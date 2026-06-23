import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast';

/** Renders the ToastService signal; mounted once in the app shell. */
@Component({
  selector: 'app-toast-container',
  template: `
    <div class="gg-toast-container" aria-live="polite" aria-atomic="true">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="gg-toast" [class.success]="toast.type === 'success'"
             [class.error]="toast.type === 'error'" [class.info]="toast.type === 'info'"
             role="status" (click)="toastService.dismiss(toast.id)">
          {{ toast.message }}
        </div>
      }
    </div>
  `,
})
export class ToastContainer {
  protected readonly toastService = inject(ToastService);
}
