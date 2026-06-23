import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Static access-denied page. */
@Component({
  selector: 'app-unauthorized',
  imports: [RouterLink],
  template: `
    <div class="unauthorized">
      <p>You do not have permission to access this page.</p>
      <a routerLink="/" class="btn btn-light mt-3">Back to Home</a>
    </div>
  `,
})
export class Unauthorized {}
