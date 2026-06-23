import { Component, OnInit, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product, ProductImage as ProductImageModel } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product';
import { ImageService } from '../../../core/services/image';
import { ToastService } from '../../../core/services/toast';
import { BrandSelector } from '../../../shared/components/brand-selector/brand-selector';
import { CategorySelector } from '../../../shared/components/category-selector/category-selector';
import { ImageUploader } from '../../../shared/components/image-uploader/image-uploader';
import { ProductImage } from '../../../shared/components/product-image/product-image';
import { LoadSpinner } from '../../../shared/components/load-spinner/load-spinner';


@Component({
  selector: 'app-product-update',
  imports: [
    ReactiveFormsModule,
    BrandSelector,
    CategorySelector,
    ImageUploader,
    ProductImage,
    LoadSpinner,
  ],
  templateUrl: './product-update.html',
})
export class ProductUpdate implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductService);
  private readonly imageService = inject(ImageService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  
  readonly productId = input.required<string>();

  protected readonly product = signal<Product | null>(null);
  protected readonly images = signal<ProductImageModel[]>([]);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly showUploader = signal(false);

  protected readonly brand = signal('');
  protected readonly category = signal('');

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.min(0)]],
    inventory: [0, [Validators.required, Validators.min(0)]],
    description: [''],
  });

  ngOnInit(): void {
    this.productService.getById(Number(this.productId())).subscribe({
      next: (product) => {
        this.product.set(product);
        this.images.set(product.images ?? []);
        this.brand.set(product.brand);
        this.category.set(product.category?.name ?? '');
        this.form.patchValue({
          name: product.name,
          price: product.price,
          inventory: product.inventory,
          description: product.description,
        });
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  save(): void {
    if (this.form.invalid || !this.brand() || !this.category()) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    const value = this.form.getRawValue();
    this.productService
      .update(Number(this.productId()), {
        name: value.name,
        brand: this.brand(),
        price: value.price,
        inventory: value.inventory,
        description: value.description,
        category: { name: this.category() },
      })
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.toast.success('Product updated.');
        },
        error: (err) => {
          this.saving.set(false);
          this.toast.error(err?.error?.message ?? 'Could not update product.');
        },
      });
  }

  removeImage(image: ProductImageModel): void {
    if (!confirm('Remove this image?')) {
      return;
    }
    this.imageService.delete(image.id).subscribe({
      next: () => {
        this.toast.success('Image removed.');
        this.images.update((list) => list.filter((i) => i.id !== image.id));
      },
      error: () => this.toast.error('Could not remove image.'),
    });
  }

  replaceImage(image: ProductImageModel, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    this.imageService.update(image.id, file).subscribe({
      next: () => this.toast.success('Image replaced.'),
      error: () => this.toast.error('Could not replace image.'),
    });
  }

  done(): void {
    this.router.navigate(['/products']);
  }
}
