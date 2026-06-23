import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { CreateUserRequest, User } from '../models/user.model';

/** /users endpoints. */
@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/users`;

  getById(userId: number): Observable<User> {
    return this.http
      .get<ApiResponse<User>>(`${this.base}/user/${userId}/user`)
      .pipe(map((r) => r.data));
  }

  createAdmin(request: CreateUserRequest): Observable<User> {
    return this.http
      .post<ApiResponse<User>>(`${this.base}/add-admin`, request)
      .pipe(map((r) => r.data));
  }

  register(request: CreateUserRequest): Observable<User> {
    return this.http
      .post<ApiResponse<User>>(`${this.base}/add`, request)
      .pipe(map((r) => r.data));
  }
}
