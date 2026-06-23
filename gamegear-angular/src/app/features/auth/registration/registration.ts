import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../../core/services/user';
import { ToastService } from '../../../core/services/toast';
import { CreateUserRequest } from '../../../core/models/user.model';
import { Address } from '../../../core/models/address.model';


@Component({
  selector: 'app-registration',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registration.html',
})
export class Registration {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal('');

  protected readonly form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
    addressList: this.fb.array([this.createAddressGroup()]),
  });

  protected get addressList(): FormArray {
    return this.form.controls.addressList;
  }

  protected addressGroupAt(index: number): FormGroup {
    return this.addressList.at(index) as FormGroup;
  }

  private createAddressGroup(): FormGroup {
    return this.fb.nonNullable.group({
      street: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: [''],
      country: ['', [Validators.required]],
      phoneNumber: [''],
      addressType: ['HOME'],
    });
  }

  addAddress(): void {
    this.addressList.push(this.createAddressGroup());
  }

  removeAddress(index: number): void {
    if (this.addressList.length > 1) {
      this.addressList.removeAt(index);
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.errorMessage.set('');

    const value = this.form.getRawValue();
    const request: CreateUserRequest = {
      firstName: value.firstName,
      lastName: value.lastName,
      email: value.email,
      password: value.password,
      addressList: value.addressList as Address[],
    };

    this.userService.register(request).subscribe({
      next: () => {
        this.submitting.set(false);
        this.toast.success('Account created! Please sign in.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.submitting.set(false);
        this.errorMessage.set(
          err?.error?.message ?? 'Registration failed. The email may already be in use.',
        );
      },
    });
  }
}
