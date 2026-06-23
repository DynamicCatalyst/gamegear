import {
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ProductImage as ProductImageModel } from '../../../core/models/product.model';

/**
 * Loads a product's first image as a blob and renders it via an object URL.
 * The backend stores images as DB blobs served at /images/image/download/{id},
 * so NgOptimizedImage does not apply here. Object URLs are revoked on destroy.
 */
@Component({
  selector: 'app-product-image',
  template: `
    @if (objectUrl(); as url) {
      <img [src]="url" [alt]="alt()" loading="lazy" class="img-fluid" />
    } @else {
      <div class="d-flex justify-content-center align-items-center h-100 text-muted">
        <i class="bi bi-image fs-3"></i>
      </div>
    }
  `,
})
export class ProductImage {
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);

  readonly images = input<ProductImageModel[]>([]);
  readonly alt = input('Product image');

  protected readonly objectUrl = signal<string | null>(null);
  private readonly firstImageId = computed(() => this.images()[0]?.id ?? null);

  // Tracked in a plain field (NOT read inside the effect) so the effect depends
  // only on the image id. Reading objectUrl inside the effect would make a
  // successful load re-trigger the effect, revoking the URL it just created.
  private currentUrl: string | null = null;

  constructor() {
    effect((onCleanup) => {
      const id = this.firstImageId();

      this.revokeCurrent();
      this.objectUrl.set(null);

      if (id === null) {
        return;
      }

      const sub = this.http
        .get(`${environment.apiBaseUrl}/images/image/download/${id}`, {
          responseType: 'blob',
        })
        .subscribe({
          next: (blob) => {
            this.currentUrl = URL.createObjectURL(blob);
            this.objectUrl.set(this.currentUrl);
          },
          error: () => {
            this.currentUrl = null;
            this.objectUrl.set(null);
          },
        });
      onCleanup(() => sub.unsubscribe());
    });

    this.destroyRef.onDestroy(() => this.revokeCurrent());
  }

  private revokeCurrent(): void {
    if (this.currentUrl) {
      URL.revokeObjectURL(this.currentUrl);
      this.currentUrl = null;
    }
  }
}
