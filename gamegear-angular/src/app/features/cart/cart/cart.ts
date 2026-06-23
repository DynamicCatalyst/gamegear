import { Component, OnInit, computed, inject, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart';
import { ToastService } from '../../../core/services/toast';
import { CartItem } from '../../../core/models/cart.model';
import { ProductImage } from '../../../shared/components/product-image/product-image';
import { QuantityUpdater } from '../../../shared/components/quantity-updater/quantity-updater';
import { LoadSpinner } from '../../../shared/components/load-spinner/load-spinner';

/** Shopping cart with quantity update, remove, and checkout link. */
@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe, RouterLink, ProductImage, QuantityUpdater, LoadSpinner],
  templateUrl: './cart.html',
})
export class Cart implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  // Route input (component input binding).
  readonly userId = input.required<string>();

  protected readonly cart = this.cartService.cart;
  protected readonly items = computed(() => this.cart().items);
  protected readonly loading = computed(() => false);

  ngOnInit(): void {
    this.cartService.loadCart(Number(this.userId())).subscribe({
      error: () => this.toast.error('Could not load your cart.'),
    });
  }

  increase(item: CartItem): void {
    this.changeQuantity(item, item.quantity + 1);
  }

  decrease(item: CartItem): void {
    if (item.quantity > 1) {
      this.changeQuantity(item, item.quantity - 1);
    }
  }

  private changeQuantity(item: CartItem, quantity: number): void {
    const cartId = this.cart().cartId;
    if (cartId === null) {
      return;
    }
    // NOTE: the backend's {itemId} path variable is actually matched against the
    // product id (CartItemService filters by item.getProduct().getId()), so we
    // must send product.id here, not the cart-item's own itemId.
    this.cartService.updateQuantity(cartId, item.product.id, quantity).subscribe({
      next: () => this.cartService.loadCart(Number(this.userId())).subscribe({ error: () => {} }),
      error: () => this.toast.error('Could not update quantity.'),
    });
  }

  remove(item: CartItem): void {
    const cartId = this.cart().cartId;
    if (cartId === null) {
      return;
    }
    // Same backend quirk: the remove endpoint also matches on product id.
    this.cartService.removeItem(cartId, item.product.id).subscribe({
      next: () => {
        this.toast.success('Item removed.');
        this.cartService.loadCart(Number(this.userId())).subscribe({ error: () => {} });
      },
      error: () => this.toast.error('Could not remove item.'),
    });
  }

  checkout(): void {
    this.router.navigate(['/checkout', this.userId(), 'checkout']);
  }
}
