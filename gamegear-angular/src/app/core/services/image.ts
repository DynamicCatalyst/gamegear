import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { ProductImage } from '../models/product.model';

/** /images endpoints + a helper for building image download URLs. */
@Injectable({ providedIn: 'root' })
export class ImageService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/images`;

  /** Absolute URL to fetch an image's bytes (used by the ProductImage component). */
  downloadUrl(imageId: number): string {
    return `${this.base}/image/download/${imageId}`;
  }

  upload(productId: number, files: File[]): Observable<ProductImage[]> {
    const form = new FormData();
    files.forEach((f) => form.append('files', f));
    form.append('productId', String(productId));
    return this.http
      .post<ApiResponse<ProductImage[]>>(`${this.base}/upload`, form)
      .pipe(map((r) => r.data));
  }

  update(imageId: number, file: File): Observable<unknown> {
    const form = new FormData();
    form.append('file', file);
    return this.http.put(`${this.base}/image/${imageId}/update`, form);
  }

  delete(imageId: number): Observable<unknown> {
    return this.http.delete(`${this.base}/image/${imageId}/delete`);
  }
}
