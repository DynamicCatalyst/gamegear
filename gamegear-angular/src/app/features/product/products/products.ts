import { Component, OnInit, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { Product } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product';
import { SearchService } from '../../../core/services/search';
import { ProductCard } from '../product-card/product-card';
import { SearchBar } from '../../search/search-bar/search-bar';
import { Sidebar } from '../../../shared/components/sidebar/sidebar';
import { Paginator } from '../../../shared/components/paginator/paginator';
import { LoadSpinner } from '../../../shared/components/load-spinner/load-spinner';

/**
 * Product catalog. Browsing (category / brand / name filtering + pagination) is
 * SERVER-SIDE: an effect watches the filter/page signals and fetches one page from
 * GET /products/search. Image search is a separate concern that shows its own
 * backend results (with a client description fallback for the offline demo, which
 * uses a one-time full-catalog load kept only for that purpose).
 */
@Component({
  selector: 'app-products',
  imports: [ProductCard, SearchBar, Sidebar, Paginator, LoadSpinner],
  templateUrl: './products.html',
})
export class Products implements OnInit {
  private readonly productService = inject(ProductService);
  protected readonly search = inject(SearchService);

  // Route inputs (component input binding).
  readonly name = input<string>();
  readonly category = input<string>();

  protected readonly loading = signal(true);

  // Server-fetched page of products (browsing mode).
  private readonly pageContent = signal<Product[]>([]);
  // Full catalog, loaded once, used ONLY for the image-search description fallback.
  private readonly catalogForImageMatch = signal<Product[]>([]);

  // Tracks the active filter set so a filter change resets to page 1.
  private lastFilterKey = '';

  protected readonly isImageSearch = computed(() => this.search.hasImageSearch());

  /** What the grid renders: image-search results when active, else the server page. */
  protected readonly displayed = computed(() => {
    if (this.search.hasImageSearch()) {
      const backend = this.search.imageSearchResults();
      if (backend.length > 0) {
        return backend;
      }
      return this.search.matchByDescription(
        this.catalogForImageMatch(),
        this.search.imageDescription(),
      );
    }
    return this.pageContent();
  });

  constructor() {
    // Server-side fetch effect: re-runs whenever a filter or the page changes.
    effect(() => {
      // In image-search mode the catalog endpoint is not used.
      if (this.search.hasImageSearch()) {
        untracked(() => this.loading.set(false));
        return;
      }

      const category = this.category() ?? this.search.selectedCategory();
      const name = this.name() ?? this.search.searchQuery();
      const brands = this.search.selectedBrands();
      const size = this.search.itemsPerPage();
      const requestedPage = this.search.currentPage(); // 1-based

      // Reset to page 1 when the filter set changes (so you don't land on an
      // out-of-range page after narrowing results).
      const filterKey = JSON.stringify({ category, name, brands, size });
      const page = untracked(() => {
        if (filterKey !== this.lastFilterKey) {
          this.lastFilterKey = filterKey;
          if (this.search.currentPage() !== 1) {
            this.search.currentPage.set(1);
          }
          return 1;
        }
        return requestedPage;
      });

      this.fetch(category, brands, name, page, size);
    });
  }

  ngOnInit(): void {
    this.search.clearImageDescription();
    // Seed the search box from a /products/:name deep link.
    const name = this.name();
    if (name) {
      this.search.setSearchQuery(name);
    }
    // One-time full load, used only as the image-search description fallback.
    this.productService.getAll().subscribe({
      next: (all) => this.catalogForImageMatch.set(all),
      error: () => {},
    });
  }

  private fetch(category: string, brands: string[], name: string, page: number, size: number): void {
    this.loading.set(true);
    // Backend pages are 0-based; the UI/SearchService page is 1-based.
    this.productService
      .search({ page: page - 1, size, category, brands, name })
      .subscribe({
        next: (res) => {
          this.pageContent.set(res.content);
          this.search.totalItems.set(res.totalElements);
          this.loading.set(false);
        },
        error: () => {
          this.pageContent.set([]);
          this.search.totalItems.set(0);
          this.loading.set(false);
        },
      });
  }
}
