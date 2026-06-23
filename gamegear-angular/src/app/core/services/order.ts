import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Order, PaymentRequest } from '../models/order.model';

/** /orders endpoints. */
@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/orders`;

  placeOrder(userId: number): Observable<Order> {
    return this.http
      .post<ApiResponse<Order>>(`${this.base}/user/${userId}/place-order`, null)
      .pipe(map((r) => r.data));
  }

  getUserOrders(userId: number): Observable<Order[]> {
    return this.http
      .get<ApiResponse<Order[]>>(`${this.base}/user/${userId}/orders`)
      .pipe(map((r) => r.data));
  }

  /** Returns the Stripe client secret. Requires a configured Stripe backend key. */
  createPaymentIntent(request: PaymentRequest): Observable<{ clientSecret: string }> {
    return this.http.post<{ clientSecret: string }>(
      `${this.base}/create-payment-intent`,
      request,
    );
  }
}
