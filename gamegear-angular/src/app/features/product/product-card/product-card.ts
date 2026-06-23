import { Component, inject, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { AuthService } from '../../../core/services/auth';
import { ProductService } from '../../../core/services/product';
import { ToastService } from '../../../core/services/toast';
import { ProductImage } from '../../../shared/components/product-image/product-image';
import { StockStatus } from '../../../shared/components/stock-status/stock-status';

/** Grid of product cards with admin edit/delete. */
@Component({
  selector: 'app-product-card',
  imports: [RouterLink, CurrencyPipe, ProductImage, StockStatus],
  templateUrl: './product-card.html',
})
export class ProductCard {
  private readonly productService = inject(ProductService);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);

  readonly products = input.required<Product[]>();
  readonly deleted = input<(id: number) => void>();

  protected readonly isAdmin = this.auth.isAdmin;

  delete(productId: number): void {
    if (!confirm('Delete this product?')) {
      return;
    }
    this.productService.delete(productId).subscribe({
      next: () => {
        this.toast.success('Product deleted.');
        this.deleted()?.(productId);
      },
      error: () => this.toast.error('Failed to delete product.'),
    });
  }
}
