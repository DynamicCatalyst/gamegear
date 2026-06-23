import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { decodeJwt } from '../utils/jwt';

const TOKEN_KEY = 'authToken';
const ROLES_KEY = 'userRoles';
const USER_ID_KEY = 'userId';

interface LoginResponse {
  accessToken: string;
}

/**
 * Holds authentication state as signals.
 * Token / roles / userId are mirrored to localStorage so the session survives
 * a reload and so the HTTP interceptor can read the token synchronously.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiBaseUrl;

  private readonly tokenSig = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  private readonly rolesSig = signal<string[]>(this.readRoles());
  private readonly userIdSig = signal<number | null>(this.readUserId());

  readonly token = this.tokenSig.asReadonly();
  readonly roles = this.rolesSig.asReadonly();
  readonly userId = this.userIdSig.asReadonly();
  readonly isAuthenticated = computed(() => !!this.tokenSig());
  readonly isAdmin = computed(() => this.rolesSig().includes('ROLE_ADMIN'));

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.base}/auth/login`, { email, password })
      .pipe(tap((res) => this.storeToken(res.accessToken)));
  }

  /** Stores a freshly issued access token and refreshes derived state. */
  storeToken(accessToken: string): void {
    localStorage.setItem(TOKEN_KEY, accessToken);
    this.tokenSig.set(accessToken);

    const payload = decodeJwt(accessToken);
    const roles = payload?.roles ?? [];
    const id = payload?.id ?? null;

    localStorage.setItem(ROLES_KEY, JSON.stringify(roles));
    this.rolesSig.set(roles);

    if (id !== null) {
      localStorage.setItem(USER_ID_KEY, String(id));
      this.userIdSig.set(id);
    }
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLES_KEY);
    localStorage.removeItem(USER_ID_KEY);
    this.tokenSig.set(null);
    this.rolesSig.set([]);
    this.userIdSig.set(null);
  }

  hasAnyRole(allowed: string[]): boolean {
    if (allowed.length === 0) {
      return true;
    }
    const mine = this.rolesSig().map((r) => r.toUpperCase());
    return allowed.some((r) => mine.includes(r.toUpperCase()));
  }

  private readRoles(): string[] {
    try {
      return JSON.parse(localStorage.getItem(ROLES_KEY) ?? '[]') as string[];
    } catch {
      return [];
    }
  }

  private readUserId(): number | null {
    const raw = localStorage.getItem(USER_ID_KEY);
    return raw ? Number(raw) : null;
  }
}
