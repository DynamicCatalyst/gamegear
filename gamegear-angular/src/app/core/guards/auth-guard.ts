import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

/**
 * Functional guard factory for protected routes.
 * - not authenticated -> /login
 * - authenticated but wrong role -> /unauthorized
 *
 * NOTE: client-side guards are UX only. The Spring Boot backend independently
 * enforces ROLE_ADMIN / authentication on its secured endpoints.
 */
export function authGuard(allowedRoles: string[] = []): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.isAuthenticated()) {
      return router.parseUrl('/login');
    }
    if (!auth.hasAnyRole(allowedRoles)) {
      return router.parseUrl('/unauthorized');
    }
    return true;
  };
}
