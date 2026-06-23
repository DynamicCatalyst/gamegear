import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { PagedResponse } from '../models/paged-response.model';
import {
  AddProductRequest,
  Product,
  ProductUpdateRequest,
} from '../models/product.model';

/** All /products endpoints. Unwraps the { message, data } envelope. */
@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/products`;

  getAll(): Observable<Product[]> {
    return this.http
      .get<ApiResponse<Product[]>>(`${this.base}/all`)
      .pipe(map((r) => r.data));
  }

  /**
   * Server-side filtered + paginated catalog search.
   * page is 0-based (matches Spring). Blank filters are omitted.
   */
  search(opts: {
    page: number;
    size: number;
    category?: string;
    brands?: string[];
    name?: string;
  }): Observable<PagedResponse<Product>> {
    let params = new HttpParams()
      .set('page', opts.page)
      .set('size', opts.size);
    if (opts.category && opts.category !== 'all') {
      params = params.set('category', opts.category);
    }
    if (opts.name) {
      params = params.set('name', opts.name);
    }
    for (const brand of opts.brands ?? []) {
      params = params.append('brand', brand);
    }
    return this.http
      .get<ApiResponse<PagedResponse<Product>>>(`${this.base}/search`, { params })
      .pipe(map((r) => r.data));
  }

  getById(productId: number): Observable<Product> {
    return this.http
      .get<ApiResponse<Product>>(`${this.base}/product/${productId}/product`)
      .pipe(map((r) => r.data));
  }

  getByCategory(category: string): Observable<Product[]> {
    return this.http
      .get<ApiResponse<Product[]>>(`${this.base}/product/${category}/all/products`)
      .pipe(map((r) => r.data));
  }

  getDistinctBrands(): Observable<string[]> {
    return this.http
      .get<ApiResponse<string[]>>(`${this.base}/distinct/brands`)
      .pipe(map((r) => r.data));
  }

  getDistinctProducts(): Observable<Product[]> {
    return this.http
      .get<ApiResponse<Product[]>>(`${this.base}/distinct/products`)
      .pipe(map((r) => r.data));
  }

  add(product: AddProductRequest): Observable<Product> {
    return this.http
      .post<ApiResponse<Product>>(`${this.base}/add`, product)
      .pipe(map((r) => r.data));
  }

  update(productId: number, product: ProductUpdateRequest): Observable<Product> {
    return this.http
      .put<ApiResponse<Product>>(`${this.base}/product/${productId}/update`, product)
      .pipe(map((r) => r.data));
  }

  delete(productId: number): Observable<number> {
    return this.http
      .delete<ApiResponse<number>>(`${this.base}/product/${productId}/delete`)
      .pipe(map((r) => r.data));
  }

  /** AI image similarity search. Requires OpenAI+Chroma; degrades offline. */
  searchByImage(image: File): Observable<Product[]> {
    const form = new FormData();
    form.append('image', image);
    return this.http
      .post<ApiResponse<Product[]>>(`${this.base}/search-by-image`, form)
      .pipe(map((r) => r.data));
  }
}
