import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Category } from '../models/product.model';

/** /categories endpoints, with a cached signal of the category list. */
@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/categories`;

  private readonly categoriesSig = signal<Category[]>([]);
  readonly categories = this.categoriesSig.asReadonly();

  loadAll(): Observable<Category[]> {
    return this.http
      .get<ApiResponse<Category[]>>(`${this.base}/all`)
      .pipe(
        map((r) => r.data),
        tap((cats) => this.categoriesSig.set(cats)),
      );
  }
}
