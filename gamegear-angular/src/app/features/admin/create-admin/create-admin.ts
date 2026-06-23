import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user';
import { ToastService } from '../../../core/services/toast';
import { CreateUserRequest } from '../../../core/models/user.model';

@Component({
  selector: 'app-create-admin',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="card shadow-sm p-4" style="max-width: 520px; width: 100%;">
          <h1 class="h4 text-center mb-4">Create Admin Account</h1>

          @if (errorMessage()) {
            <div class="alert alert-danger py-2" role="alert">{{ errorMessage() }}</div>
          }
          @if (successMessage()) {
            <div class="alert alert-success py-2" role="alert">{{ successMessage() }}</div>
          }

          <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
            <div class="row g-2">
              <div class="col-md-6">
                <label class="form-label" for="firstName">First name</label>
                <input id="firstName" type="text" class="form-control" formControlName="firstName"
                       [class.is-invalid]="form.controls.firstName.invalid && form.controls.firstName.touched" />
              </div>
              <div class="col-md-6">
                <label class="form-label" for="lastName">Last name</label>
                <input id="lastName" type="text" class="form-control" formControlName="lastName"
                       [class.is-invalid]="form.controls.lastName.invalid && form.controls.lastName.touched" />
              </div>
              <div class="col-12">
                <label class="form-label" for="email">Email</label>
                <input id="email" type="email" class="form-control" formControlName="email"
                       autocomplete="email"
                       [class.is-invalid]="form.controls.email.invalid && form.controls.email.touched" />
              </div>
              <div class="col-12">
                <label class="form-label" for="password">Password</label>
                <input id="password" type="password" class="form-control" formControlName="password"
                       autocomplete="new-password"
                       [class.is-invalid]="form.controls.password.invalid && form.controls.password.touched" />
              </div>
            </div>

            <button type="submit" class="btn btn-primary w-100 mt-4" [disabled]="submitting()">
              @if (submitting()) {
                <span class="spinner-border spinner-border-sm me-2"></span>
              }
              Create Admin
            </button>
          </form>

          <p class="text-center mt-3 mb-0 small">
            <a routerLink="/add-product">Back to Manage Shop</a>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class CreateAdmin {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly successMessage = signal('');

  protected readonly form = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const value = this.form.getRawValue();
    const request: CreateUserRequest = {
      firstName: value.firstName,
      lastName: value.lastName,
      email: value.email,
      password: value.password,
    };

    this.userService.createAdmin(request).subscribe({
      next: () => {
        this.submitting.set(false);
        this.successMessage.set(`Admin account created for ${value.email}.`);
        this.form.reset();
        this.toast.success('Admin created successfully!');
      },
      error: (err) => {
        this.submitting.set(false);
        this.errorMessage.set(
          err?.error?.message ?? 'Failed to create admin. The email may already be in use.',
        );
      },
    });
  }
}
