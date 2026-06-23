import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Cart } from '../models/cart.model';

/**
 * Cart state + /carts and /cartItems endpoints.
 * All calls are authenticated; the interceptor attaches the token.
 */
@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiBaseUrl;

  private readonly cartSig = signal<Cart>({ cartId: null, items: [], totalAmount: 0 });
  readonly cart = this.cartSig.asReadonly();
  readonly itemCount = computed(() =>
    this.cartSig().items.reduce((sum, i) => sum + i.quantity, 0),
  );

  loadCart(userId: number): Observable<Cart> {
    return this.http
      .get<ApiResponse<Cart>>(`${this.base}/carts/user/${userId}/cart`)
      .pipe(
        map((r) => r.data),
        tap((cart) => this.cartSig.set(cart)),
      );
  }

  addItem(productId: number, quantity: number): Observable<unknown> {
    const form = new FormData();
    form.append('productId', String(productId));
    form.append('quantity', String(quantity));
    return this.http.post(`${this.base}/cartItems/item/add`, form);
  }

  updateQuantity(cartId: number, itemId: number, quantity: number): Observable<unknown> {
    return this.http.put(
      `${this.base}/cartItems/cart/${cartId}/item/${itemId}/update?quantity=${quantity}`,
      null,
    );
  }

  removeItem(cartId: number, itemId: number): Observable<unknown> {
    return this.http.delete(`${this.base}/cartItems/cart/${cartId}/item/${itemId}/remove`);
  }

  clearLocal(): void {
    this.cartSig.set({ cartId: null, items: [], totalAmount: 0 });
  }
}
