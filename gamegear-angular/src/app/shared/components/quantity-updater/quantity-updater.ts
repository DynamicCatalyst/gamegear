import { Component, input, output } from '@angular/core';

/** +/- quantity stepper. */
@Component({
  selector: 'app-quantity-updater',
  template: `
    <div class="d-flex align-items-center gap-2 quantity-input">
      <button type="button" class="btn btn-outline-secondary btn-sm" aria-label="Decrease quantity"
              [disabled]="disabled() || quantity() <= 1" (click)="decrease.emit()">
        <i class="bi bi-dash"></i>
      </button>
      <input type="text" class="form-control form-control-sm text-center" readonly
             [value]="quantity()" aria-label="Quantity" />
      <button type="button" class="btn btn-outline-secondary btn-sm" aria-label="Increase quantity"
              [disabled]="disabled()" (click)="increase.emit()">
        <i class="bi bi-plus"></i>
      </button>
    </div>
  `,
})
export class QuantityUpdater {
  readonly quantity = input.required<number>();
  readonly disabled = input(false);
  readonly increase = output<void>();
  readonly decrease = output<void>();
}
