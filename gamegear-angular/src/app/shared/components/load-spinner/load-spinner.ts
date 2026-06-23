import { Component, input } from '@angular/core';

/** Centered Bootstrap spinner. */
@Component({
  selector: 'app-load-spinner',
  template: `
    <div class="d-flex justify-content-center align-items-center p-4">
      <div class="spinner-border" [class.text-secondary]="variant() === 'secondary'"
           [class.text-primary]="variant() === 'primary'" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  `,
})
export class LoadSpinner {
  readonly variant = input<'primary' | 'secondary'>('secondary');
}
