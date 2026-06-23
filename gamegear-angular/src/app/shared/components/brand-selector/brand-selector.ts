import { Component, OnInit, inject, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product';

/**
 * Brand picker with inline "add new brand" support.
 * The selected brand is a two-way model() so parent forms can bind to it.
 */
@Component({
  selector: 'app-brand-selector',
  imports: [FormsModule],
  template: `
    <div class="mb-3">
      <label class="form-label">Brand</label>
      @if (!showNewInput()) {
        <div class="d-flex gap-2">
          <select class="form-select" [ngModel]="selectedBrand()"
                  (ngModelChange)="selectedBrand.set($event)">
            <option value="">Select a brand</option>
            @for (brand of brands(); track brand) {
              <option [value]="brand">{{ brand }}</option>
            }
          </select>
          <button type="button" class="btn btn-outline-secondary" (click)="showNewInput.set(true)">
            New
          </button>
        </div>
      } @else {
        <div class="d-flex gap-2">
          <input type="text" class="form-control" placeholder="New brand name"
                 [ngModel]="newBrand()" (ngModelChange)="newBrand.set($event)" />
          <button type="button" class="btn btn-success" (click)="addNewBrand()">Add</button>
          <button type="button" class="btn btn-outline-secondary" (click)="cancelNew()">Cancel</button>
        </div>
      }
    </div>
  `,
})
export class BrandSelector implements OnInit {
  private readonly productService = inject(ProductService);

  readonly selectedBrand = model('');
  protected readonly brands = signal<string[]>([]);
  protected readonly showNewInput = signal(false);
  protected readonly newBrand = signal('');

  ngOnInit(): void {
    this.productService.getDistinctBrands().subscribe({
      next: (brands) => this.brands.set(brands),
      error: () => this.brands.set([]),
    });
  }

  addNewBrand(): void {
    const name = this.newBrand().trim();
    if (!name) {
      return;
    }
    if (!this.brands().includes(name)) {
      this.brands.update((b) => [...b, name]);
    }
    this.selectedBrand.set(name);
    this.newBrand.set('');
    this.showNewInput.set(false);
  }

  cancelNew(): void {
    this.newBrand.set('');
    this.showNewInput.set(false);
  }
}
