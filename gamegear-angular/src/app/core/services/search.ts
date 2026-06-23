import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Product } from '../models/product.model';

/**
 * Search + lightweight UI/pagination state.
 * The image-search and describe-image calls require OpenAI+Chroma and degrade
 * gracefully offline (callers catch the error and show an "unavailable" message).
 */
@Injectable({ providedIn: 'root' })
export class SearchService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiBaseUrl;

  // search filters
  readonly searchQuery = signal('');
  readonly selectedCategory = signal('all');
  readonly selectedBrands = signal<string[]>([]);

  // image search
  readonly imageSearchResults = signal<Product[]>([]);
  readonly imageDescription = signal('');
  readonly isImgSearchActive = signal(false);

  // pagination
  readonly itemsPerPage = signal(12);
  readonly currentPage = signal(1);
  readonly totalItems = signal(0);

  setSearchQuery(q: string): void {
    this.searchQuery.set(q);
  }

  setSelectedCategory(c: string): void {
    this.selectedCategory.set(c);
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.selectedCategory.set('all');
    this.selectedBrands.set([]);
    this.imageSearchResults.set([]);
    this.imageDescription.set('');
  }

  toggleBrand(brand: string, checked: boolean): void {
    this.selectedBrands.update((brands) =>
      checked ? [...brands, brand] : brands.filter((b) => b !== brand),
    );
  }

  clearImageDescription(): void {
    this.imageDescription.set('');
  }

  searchByImage(image: File): Observable<Product[]> {
    const form = new FormData();
    form.append('image', image);
    return this.http
      .post<ApiResponse<Product[]>>(`${this.base}/products/search-by-image`, form)
      .pipe(map((r) => r.data));
  }

  describeImage(image: File): Observable<string> {
    const form = new FormData();
    form.append('image', image);
    return this.http
      .post<ApiResponse<string>>(`${this.base}/images/describe-image`, form)
      .pipe(map((r) => r.data));
  }

  /** True once an image search has run (an AI description has been generated). */
  hasImageSearch(): boolean {
    return this.imageDescription().trim().length > 0;
  }

  /**
   * Client-side fallback for image search: matches products whose text
   * (name / brand / description / category) shares keywords with the AI-generated
   * image description. Used when the backend vector search returns no matches
   * (e.g. product images haven't been embedded in Chroma). Returns distinct-by-name.
   */
  matchByDescription(products: Product[], description: string): Product[] {
    const keywords = this.extractKeywords(description);
    if (keywords.length === 0) {
      return [];
    }
    const seen = new Set<string>();
    const matches: Product[] = [];
    for (const p of products) {
      const haystack = `${p.name} ${p.brand} ${p.description} ${p.category?.name ?? ''}`.toLowerCase();
      if (keywords.some((k) => haystack.includes(k)) && !seen.has(p.name)) {
        seen.add(p.name);
        matches.push(p);
      }
    }
    return matches;
  }

  private extractKeywords(description: string): string[] {
    const stopwords = new Set([
      'the', 'and', 'with', 'for', 'this', 'that', 'has', 'have', 'are', 'was',
      'from', 'minimal', 'large', 'small', 'displaying', 'finish', 'logo', 'side',
      'top', 'front', 'back', 'features', 'feature', 'visible', 'colors', 'color',
      'image', 'product', 'item', 'device', 'objects', 'object', 'attributes',
    ]);
    return Array.from(
      new Set(
        description
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, ' ')
          .split(/\s+/)
          .filter((w) => w.length >= 4 && !stopwords.has(w)),
      ),
    );
  }
}
