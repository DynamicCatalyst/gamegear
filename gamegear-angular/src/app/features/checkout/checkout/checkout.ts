import {
  Component,
  ElementRef,
  OnInit,
  computed,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { loadStripe, Stripe, StripeCardElement, StripeElements } from '@stripe/stripe-js';
import { environment } from '../../../../environments/environment';
import { CartService } from '../../../core/services/cart';
import { OrderService } from '../../../core/services/order';
import { UserService } from '../../../core/services/user';
import { ToastService } from '../../../core/services/toast';
import { LoadSpinner } from '../../../shared/components/load-spinner/load-spinner';


@Component({
  selector: 'app-checkout',
  imports: [CurrencyPipe, ReactiveFormsModule, LoadSpinner],
  templateUrl: './checkout.html',
})
export class Checkout implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly cartService = inject(CartService);
  private readonly orderService = inject(OrderService);
  private readonly userService = inject(UserService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  
  readonly userId = input.required<string>();

  protected readonly cart = this.cartService.cart;
  protected readonly loading = signal(true);
  protected readonly processing = signal(false);

  
  protected readonly stripeAvailable = !!environment.stripePublishableKey;

  
  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;
  private card: StripeCardElement | null = null;

  protected readonly stripeReady = signal(false);
  protected readonly stripeError = signal('');
  protected readonly cardError = signal('');

  
  private readonly cardElementRef = viewChild<ElementRef<HTMLDivElement>>('cardElement');

  protected readonly form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    street: ['', [Validators.required]],
    city: ['', [Validators.required]],
    country: ['', [Validators.required]],
  });

  protected readonly total = computed(() => this.cart().totalAmount);

  constructor() {
    
    
    effect(() => {
      const host = this.cardElementRef();
      if (!host || !this.stripeReady() || !this.stripe || this.card) {
        return;
      }
      this.elements = this.stripe.elements();
      this.card = this.elements.create('card', { hidePostalCode: true });
      this.card.mount(host.nativeElement);
      this.card.on('change', (event) => this.cardError.set(event.error?.message ?? ''));
    });
  }

  ngOnInit(): void {
    const id = Number(this.userId());

    if (this.stripeAvailable) {
      loadStripe(environment.stripePublishableKey)
        .then((stripe) => {
          if (stripe) {
            this.stripe = stripe;
            this.stripeReady.set(true);
          } else {
            this.stripeError.set('Stripe failed to initialize. Check the publishable key.');
          }
        })
        .catch(() =>
          this.stripeError.set(
            'Could not load Stripe.js (check your internet connection).',
          ),
        );
    }

    this.cartService.loadCart(id).subscribe({ error: () => {} });

    this.userService.getById(id).subscribe({
      next: (user) => {
        this.form.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        });
        const first = user.addressList?.[0];
        if (first) {
          this.form.patchValue({
            street: first.street,
            city: first.city,
            country: first.country,
          });
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  
  pay(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (!this.stripe || !this.card) {
      this.toast.error('Payment form is not ready yet.');
      return;
    }

    this.processing.set(true);
    const value = this.form.getRawValue();

    this.orderService
      .createPaymentIntent({ amount: this.total(), currency: 'usd' })
      .subscribe({
        next: async ({ clientSecret }) => {
          const result = await this.stripe!.confirmCardPayment(clientSecret, {
            payment_method: {
              card: this.card!,
              billing_details: {
                name: `${value.firstName} ${value.lastName}`.trim(),
                email: value.email,
                address: { line1: value.street, city: value.city },
              },
            },
          });

          if (result.error) {
            this.processing.set(false);
            this.toast.error(result.error.message ?? 'Payment failed.');
          } else if (result.paymentIntent?.status === 'succeeded') {
            this.toast.success('Payment successful!');
            this.placeOrder();
          } else {
            this.processing.set(false);
            this.toast.error('Payment was not completed.');
          }
        },
        error: () => {
          this.processing.set(false);
          this.toast.error('Payment could not be initialized.');
        },
      });
  }

  
  simulateOrder(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.processing.set(true);
    this.placeOrder();
  }

  private placeOrder(): void {
    const id = Number(this.userId());
    this.orderService.placeOrder(id).subscribe({
      next: () => {
        this.processing.set(false);
        this.cartService.clearLocal();
        this.toast.success('Order placed successfully!');
        this.router.navigate(['/user-profile', id, 'profile']);
      },
      error: () => {
        this.processing.set(false);
        this.toast.error('Could not place the order.');
      },
    });
  }
}
