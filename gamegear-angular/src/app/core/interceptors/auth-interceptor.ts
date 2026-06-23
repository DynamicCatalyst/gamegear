import { HttpClient, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth';
import { environment } from '../../../environments/environment';

/**
 * HTTP interceptor that:
 *  - attaches `Authorization: Bearer <token>` when a token is present
 *  - sends credentials so the httpOnly refresh-token cookie travels with requests
 *  - on a 401, calls /auth/refresh-token once, stores the new token, retries the
 *    original request, and logs out if the refresh itself fails
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const http = inject(HttpClient);

  // The refresh call returns the raw access token string (text), not JSON.
  const isRefreshCall = req.url.includes('/auth/refresh-token');

  const token = auth.token();
  let authReq = req.clone({ withCredentials: true });
  if (token && !isRefreshCall) {
    authReq = authReq.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401 || isRefreshCall || (req as { _retried?: boolean })._retried) {
        return throwError(() => error);
      }

      return http
        .post(`${environment.apiBaseUrl}/auth/refresh-token`, null, {
          responseType: 'text',
          withCredentials: true,
        })
        .pipe(
          switchMap((newToken) => {
            auth.storeToken(newToken);
            const retried = req.clone({
              withCredentials: true,
              setHeaders: { Authorization: `Bearer ${newToken}` },
            });
            (retried as { _retried?: boolean })._retried = true;
            return next(retried);
          }),
          catchError((refreshError) => {
            auth.logout();
            return throwError(() => refreshError);
          }),
        );
    }),
  );
};
