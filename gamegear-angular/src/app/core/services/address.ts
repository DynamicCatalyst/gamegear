import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Address } from '../models/address.model';

/** /addresses endpoints. */
@Injectable({ providedIn: 'root' })
export class AddressService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/addresses`;

  getForUser(userId: number): Observable<Address[]> {
    return this.http
      .get<ApiResponse<Address[]>>(`${this.base}/${userId}/address`)
      .pipe(map((r) => r.data));
  }

  add(userId: number, addresses: Address[]): Observable<Address[]> {
    return this.http
      .post<ApiResponse<Address[]>>(`${this.base}/${userId}/new`, addresses)
      .pipe(map((r) => r.data));
  }

  update(id: number, address: Address): Observable<Address> {
    return this.http
      .put<ApiResponse<Address>>(`${this.base}/${id}/update`, address)
      .pipe(map((r) => r.data));
  }

  delete(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}/delete`);
  }
}
