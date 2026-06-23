import { Component, OnInit, inject, input, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { AuthService } from '../../../core/services/auth';
import { CartService } from '../../../core/services/cart';
import { ProductService } from '../../../core/services/product';
import { ToastService } from '../../../core/services/toast';
import { ProductImage } from '../../../shared/components/product-image/product-image';
import { StockStatus } from '../../../shared/components/stock-status/stock-status';
import { QuantityUpdater } from '../../../shared/components/quantity-updater/quantity-updater';
import { LoadSpinner } from '../../../shared/components/load-spinner/load-spinner';

/** Single product page with quantity selector and add-to-cart. */
@Component({
  selector: 'app-product-details',
  imports: [CurrencyPipe, ProductImage, StockStatus, QuantityUpdater, LoadSpinner],
  templateUrl: './product-details.html',
})
export class ProductDetails implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  // Route input (component input binding).
  readonly productId = input.required<string>();

  protected readonly product = signal<Product | null>(null);
  protected readonly loading = signal(true);
  protected readonly quantity = signal(1);

  ngOnInit(): void {
    this.productService.getById(Number(this.productId())).subscribe({
      next: (product) => {
        this.product.set(product);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  increase(): void {
    const max = this.product()?.inventory ?? 1;
    this.quantity.update((q) => Math.min(q + 1, max));
  }

  decrease(): void {
    this.quantity.update((q) => Math.max(1, q - 1));
  }

  addToCart(buyNow = false): void {
    const product = this.product();
    if (!product) {
      return;
    }
    if (!this.auth.isAuthenticated()) {
      this.toast.info('Please log in to add items to your cart.');
      this.router.navigate(['/login']);
      return;
    }
    this.cartService.addItem(product.id, this.quantity()).subscribe({
      next: () => {
        this.toast.success('Added to cart!');
        const userId = this.auth.userId();
        if (userId) {
          this.cartService.loadCart(userId).subscribe({ error: () => {} });
          if (buyNow) {
            this.router.navigate(['/user', userId, 'my-cart']);
          }
        }
      },
      error: () => this.toast.error('Could not add to cart.'),
    });
  }
}
