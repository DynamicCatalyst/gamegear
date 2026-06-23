import { Component, input } from '@angular/core';

/** Shows stock count or an out-of-stock label. */
@Component({
  selector: 'app-stock-status',
  template: `
    @if (inventory() > 0) {
      <span class="text-success">{{ inventory() }} in stock</span>
    } @else {
      <span class="text-danger fw-bold">Out of stock</span>
    }
  `,
})
export class StockStatus {
  readonly inventory = input.required<number>();
}
