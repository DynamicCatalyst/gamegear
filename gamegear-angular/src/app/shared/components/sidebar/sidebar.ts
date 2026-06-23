import { Component, OnInit, inject, signal } from '@angular/core';
import { ProductService } from '../../../core/services/product';
import { SearchService } from '../../../core/services/search';

/** Brand-filter sidebar with custom checkboxes. */
@Component({
  selector: 'app-sidebar',
  template: `
    <aside class="sidebar">
      <h6 class="mb-3">Brands</h6>
      <ul class="brand-list">
        @for (brand of brands(); track brand) {
          <li class="brand-item">
            <label class="checkbox-container">
              <input type="checkbox" [checked]="isChecked(brand)"
                     (change)="onToggle(brand, $event)" />
              <span class="checkmark"></span>
              {{ brand }}
            </label>
          </li>
        } @empty {
          <li class="text-muted small">No brands</li>
        }
      </ul>
    </aside>
  `,
})
export class Sidebar implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly search = inject(SearchService);

  protected readonly brands = signal<string[]>([]);

  ngOnInit(): void {
    this.productService.getDistinctBrands().subscribe({
      next: (brands) => this.brands.set(brands),
      error: () => this.brands.set([]),
    });
  }

  isChecked(brand: string): boolean {
    return this.search.selectedBrands().includes(brand);
  }

  onToggle(brand: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.search.toggleBrand(brand, checked);
  }
}
