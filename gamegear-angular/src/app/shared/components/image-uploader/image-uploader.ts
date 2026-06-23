import { Component, inject, input, signal } from '@angular/core';
import { ImageService } from '../../../core/services/image';
import { ToastService } from '../../../core/services/toast';

/** Multi-file product image uploader. */
@Component({
  selector: 'app-image-uploader',
  template: `
    <div class="mt-3">
      <input type="file" class="form-control mb-2" multiple accept="image/*"
             (change)="onFilesSelected($event)" aria-label="Select product images" />
      @if (selectedNames().length) {
        <ul class="list-group mb-2">
          @for (name of selectedNames(); track name) {
            <li class="list-group-item py-1 small">{{ name }}</li>
          }
        </ul>
      }
      <button type="button" class="btn btn-primary" [disabled]="!files.length || uploading()"
              (click)="upload()">
        @if (uploading()) {
          <span class="spinner-border spinner-border-sm me-2"></span>
        }
        Upload images
      </button>
    </div>
  `,
})
export class ImageUploader {
  private readonly imageService = inject(ImageService);
  private readonly toast = inject(ToastService);

  readonly productId = input.required<number>();

  protected files: File[] = [];
  protected readonly selectedNames = signal<string[]>([]);
  protected readonly uploading = signal(false);

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.files = input.files ? Array.from(input.files) : [];
    this.selectedNames.set(this.files.map((f) => f.name));
  }

  upload(): void {
    if (!this.files.length) {
      return;
    }
    this.uploading.set(true);
    this.imageService.upload(this.productId(), this.files).subscribe({
      next: () => {
        this.toast.success('Images uploaded successfully!');
        this.files = [];
        this.selectedNames.set([]);
        this.uploading.set(false);
      },
      error: () => {
        this.toast.error('Image upload failed.');
        this.uploading.set(false);
      },
    });
  }
}
