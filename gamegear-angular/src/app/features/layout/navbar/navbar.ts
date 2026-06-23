import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { CartService } from '../../../core/services/cart';

/** Top navigation: role-aware links, account dropdown, cart badge. */
@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
})
export class Navbar implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);

  protected readonly isAuthenticated = this.auth.isAuthenticated;
  protected readonly isAdmin = this.auth.isAdmin;
  protected readonly userId = this.auth.userId;
  protected readonly itemCount = this.cartService.itemCount;

  ngOnInit(): void {
    const id = this.auth.userId();
    if (id) {
      this.cartService.loadCart(id).subscribe({ error: () => {} });
    }
  }

  logout(): void {
    this.auth.logout();
    this.cartService.clearLocal();
    this.router.navigate(['/']);
  }
}
