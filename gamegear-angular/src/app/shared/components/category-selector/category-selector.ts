import { Component, OnInit, inject, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../core/services/category';

/**
 * Category picker with inline "add new category" support.
 * The selected category name is a two-way model() for parent form binding.
 */
@Component({
  selector: 'app-category-selector',
  imports: [FormsModule],
  template: `
    <div class="mb-3">
      <label class="form-label">Category</label>
      @if (!showNewInput()) {
        <div class="d-flex gap-2">
          <select class="form-select" [ngModel]="selectedCategory()"
                  (ngModelChange)="selectedCategory.set($event)">
            <option value="">Select a category</option>
            @for (cat of categories(); track cat) {
              <option [value]="cat">{{ cat }}</option>
            }
          </select>
          <button type="button" class="btn btn-outline-secondary" (click)="showNewInput.set(true)">
            New
          </button>
        </div>
      } @else {
        <div class="d-flex gap-2">
          <input type="text" class="form-control" placeholder="New category name"
                 [ngModel]="newCategory()" (ngModelChange)="newCategory.set($event)" />
          <button type="button" class="btn btn-success" (click)="addNewCategory()">Add</button>
          <button type="button" class="btn btn-outline-secondary" (click)="cancelNew()">Cancel</button>
        </div>
      }
    </div>
  `,
})
export class CategorySelector implements OnInit {
  private readonly categoryService = inject(CategoryService);

  readonly selectedCategory = model('');
  protected readonly categories = signal<string[]>([]);
  protected readonly showNewInput = signal(false);
  protected readonly newCategory = signal('');

  ngOnInit(): void {
    this.categoryService.loadAll().subscribe({
      next: (cats) => this.categories.set(cats.map((c) => c.name)),
      error: () => this.categories.set([]),
    });
  }

  addNewCategory(): void {
    const name = this.newCategory().trim();
    if (!name) {
      return;
    }
    if (!this.categories().includes(name)) {
      this.categories.update((c) => [...c, name]);
    }
    this.selectedCategory.set(name);
    this.newCategory.set('');
    this.showNewInput.set(false);
  }

  cancelNew(): void {
    this.newCategory.set('');
    this.showNewInput.set(false);
  }
}
