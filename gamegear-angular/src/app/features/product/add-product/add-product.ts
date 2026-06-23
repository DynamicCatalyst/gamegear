import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../../core/services/product';
import { ToastService } from '../../../core/services/toast';
import { AddProductRequest, Product } from '../../../core/models/product.model';
import { BrandSelector } from '../../../shared/components/brand-selector/brand-selector';
import { CategorySelector } from '../../../shared/components/category-selector/category-selector';
import { ImageUploader } from '../../../shared/components/image-uploader/image-uploader';


@Component({
  selector: 'app-add-product',
  imports: [ReactiveFormsModule, BrandSelector, CategorySelector, ImageUploader],
  templateUrl: './add-product.html',
})
export class AddProduct {
  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  protected readonly step = signal(1);
  protected readonly submitting = signal(false);
  protected readonly createdProduct = signal<Product | null>(null);

  protected readonly brand = signal('');
  protected readonly category = signal('');

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.min(0)]],
    inventory: [0, [Validators.required, Validators.min(0)]],
    description: [''],
  });

  saveDetails(): void {
    if (this.form.invalid || !this.brand() || !this.category()) {
      this.form.markAllAsTouched();
      this.toast.info('Please fill in all fields, including brand and category.');
      return;
    }
    this.submitting.set(true);
    const value = this.form.getRawValue();
    const request: AddProductRequest = {
      name: value.name,
      brand: this.brand(),
      price: value.price,
      inventory: value.inventory,
      description: value.description,
      category: { name: this.category() },
    };

    this.productService.add(request).subscribe({
      next: (product) => {
        this.submitting.set(false);
        this.createdProduct.set(product);
        this.toast.success('Product created. Now add images.');
        this.step.set(2);
      },
      error: (err) => {
        this.submitting.set(false);
        this.toast.error(err?.error?.message ?? 'Could not create product.');
      },
    });
  }

  finish(): void {
    this.toast.success('Product saved.');
    this.router.navigate(['/products']);
  }
}
