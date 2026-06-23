/**
 * Minimal JWT payload decoder (no external dependency).
 * The backend issues HS256 tokens whose payload carries { sub, id, roles, iat, exp }.
 * Only the payload segment is base64url-decoded; the signature is verified server-side.
 */
export interface JwtPayload {
  sub: string;
  id: number;
  roles: string[];
  iat: number;
  exp: number;
}

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) {
      return null;
    }
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}
