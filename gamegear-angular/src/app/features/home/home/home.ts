import { Component, OnInit, computed, effect, inject, signal, untracked } from '@angular/core';
import { Product } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product';
import { SearchService } from '../../../core/services/search';
import { Hero } from '../../hero/hero/hero';
import { ProductCard } from '../../product/product-card/product-card';
import { Paginator } from '../../../shared/components/paginator/paginator';
import { LoadSpinner } from '../../../shared/components/load-spinner/load-spinner';

/** Landing page: hero + filtered distinct products + pagination. */
@Component({
  selector: 'app-home',
  imports: [Hero, ProductCard, Paginator, LoadSpinner],
  templateUrl: './home.html',
})
export class Home implements OnInit {
  private readonly productService = inject(ProductService);
  protected readonly search = inject(SearchService);

  protected readonly allProducts = signal<Product[]>([]);
  protected readonly loading = signal(true);

  /** Products after text / category / image-search filters. */
  protected readonly filtered = computed(() => {
    const query = this.search.searchQuery().toLowerCase().trim();
    const category = this.search.selectedCategory();
    const all = this.allProducts();

    // Image-search mode: prefer the backend vector-search results; if those are
    // empty (e.g. product images aren't embedded in Chroma), fall back to matching
    // the AI description's keywords against product text. Never fall through to
    // "show everything" here — an image search that finds nothing shows nothing.
    if (this.search.hasImageSearch()) {
      const backend = this.search.imageSearchResults();
      if (backend.length > 0) {
        return backend;
      }
      return this.search.matchByDescription(all, this.search.imageDescription());
    }

    return all.filter((p) => {
      const matchesQuery = !query || p.name.toLowerCase().includes(query);
      const matchesCategory = category === 'all' || p.category?.name === category;
      return matchesQuery && matchesCategory;
    });
  });

  /** True when the user has run an image search (used for the empty-state message). */
  protected readonly isImageSearch = computed(() => this.search.hasImageSearch());

  /** Current page slice. */
  protected readonly paged = computed(() => {
    const items = this.filtered();
    const perPage = this.search.itemsPerPage();
    const page = this.search.currentPage();
    const start = (page - 1) * perPage;
    return items.slice(start, start + perPage);
  });

  constructor() {
    // Keep the paginator's total in sync with the filtered result set, and reset
    // to page 1 whenever the active filters change the result count.
    effect(() => {
      const count = this.filtered().length;
      untracked(() => {
        this.search.totalItems.set(count);
        const maxPage = Math.max(1, Math.ceil(count / this.search.itemsPerPage()));
        if (this.search.currentPage() > maxPage) {
          this.search.currentPage.set(1);
        }
      });
    });
  }

  ngOnInit(): void {
    this.search.clearImageDescription();
    this.productService.getDistinctProducts().subscribe({
      next: (products) => {
        this.allProducts.set(products);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
