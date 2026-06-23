import { Component, OnInit, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../core/services/category';
import { SearchService } from '../../../core/services/search';
import { ImageSearch } from '../image-search/image-search';

/** Category dropdown + text search. Pass showImageSearch=true only on the homepage. */
@Component({
  selector: 'app-search-bar',
  imports: [FormsModule, ImageSearch],
  template: `
    <div class="d-flex flex-column gap-2">
      <div class="input-group">
        <select class="form-select flex-grow-0" style="max-width: 160px;"
                [ngModel]="search.selectedCategory()"
                (ngModelChange)="search.setSelectedCategory($event)" aria-label="Category filter">
          <option value="all">All</option>
          @for (cat of categories(); track cat.id) {
            <option [value]="cat.name">{{ cat.name }}</option>
          }
        </select>
        <input type="text" class="form-control" placeholder="Search products..."
               [ngModel]="search.searchQuery()" (ngModelChange)="search.setSearchQuery($event)"
               aria-label="Search products" />
        @if (showImageSearch()) {
          <button type="button" class="btn" style="background-color: var(--light-gray);"
                  (click)="toggleImageSearch()" aria-label="Toggle image search"
                  [attr.aria-pressed]="search.isImgSearchActive()">
            <i class="bi bi-camera"></i>
          </button>
        }
      </div>

      @if (showImageSearch() && search.isImgSearchActive()) {
        <app-image-search />
      }
    </div>
  `,
})
export class SearchBar implements OnInit {
  private readonly categoryService = inject(CategoryService);
  protected readonly search = inject(SearchService);

  readonly showImageSearch = input(false);

  protected readonly categories = this.categoryService.categories;

  ngOnInit(): void {
    this.categoryService.loadAll().subscribe({ error: () => {} });
  }

  toggleImageSearch(): void {
    this.search.isImgSearchActive.update((v) => !v);
  }
}
