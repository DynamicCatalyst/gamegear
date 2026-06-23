import { Component, OnInit, inject, input, model, output, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { catchError, of } from 'rxjs';
import { Address } from '../../../core/models/address.model';

/**
 * Reusable address form.
 * Two-way binds the address via model(); emits save/cancel.
 * Country list comes from restcountries.com with a static offline fallback.
 */
@Component({
  selector: 'app-address-form',
  imports: [FormsModule],
  template: `
    @if (showTitle()) {
      <h6 class="checkout-form-title">Address</h6>
    }
    <div class="row g-2">
      <div class="col-12">
        <input type="text" class="form-control" placeholder="Street" [ngModel]="address().street"
               (ngModelChange)="patch('street', $event)" aria-label="Street" />
      </div>
      <div class="col-md-6">
        <input type="text" class="form-control" placeholder="City" [ngModel]="address().city"
               (ngModelChange)="patch('city', $event)" aria-label="City" />
      </div>
      <div class="col-md-6">
        <input type="text" class="form-control" placeholder="State" [ngModel]="address().state"
               (ngModelChange)="patch('state', $event)" aria-label="State" />
      </div>
      <div class="col-md-6">
        <select class="form-select" [ngModel]="address().country"
                (ngModelChange)="patch('country', $event)" aria-label="Country">
          <option value="">Select country</option>
          @for (c of countries(); track c) {
            <option [value]="c">{{ c }}</option>
          }
        </select>
      </div>
      <div class="col-md-6">
        <input type="text" class="form-control" placeholder="Phone number"
               [ngModel]="address().phoneNumber" (ngModelChange)="patch('phoneNumber', $event)"
               aria-label="Phone number" />
      </div>
      <div class="col-md-6">
        <select class="form-select" [ngModel]="address().addressType"
                (ngModelChange)="patch('addressType', $event)" aria-label="Address type">
          <option value="HOME">Home</option>
          <option value="WORK">Work</option>
          <option value="BILLING">Billing</option>
          <option value="SHIPPING">Shipping</option>
        </select>
      </div>
    </div>
    @if (showButtons()) {
      <div class="d-flex gap-2 mt-2">
        <button type="button" class="btn btn-success btn-sm" (click)="save.emit()">
          <i class="bi bi-check"></i> Save
        </button>
        <button type="button" class="btn btn-outline-secondary btn-sm" (click)="cancel.emit()">
          <i class="bi bi-x"></i> Cancel
        </button>
      </div>
    }
  `,
})
export class AddressForm implements OnInit {
  private readonly http = inject(HttpClient);

  readonly address = model.required<Address>();
  readonly showButtons = input(true);
  readonly showTitle = input(true);
  readonly save = output<void>();
  readonly cancel = output<void>();

  protected readonly countries = signal<string[]>([]);

  ngOnInit(): void {
    this.http
      .get<{ name: { common: string } }[]>('https://restcountries.com/v3.1/all?fields=name')
      .pipe(catchError(() => of([])))
      .subscribe((data) => {
        const names = data
          .map((c) => c.name?.common)
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b));
        this.countries.set(names.length ? names : this.fallbackCountries);
      });
  }

  patch<K extends keyof Address>(key: K, value: Address[K]): void {
    this.address.update((a) => ({ ...a, [key]: value }));
  }

  private readonly fallbackCountries = [
    'Australia', 'Canada', 'France', 'Germany', 'India', 'Japan',
    'United Kingdom', 'United States',
  ];
}
