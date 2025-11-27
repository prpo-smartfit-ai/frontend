// jwt utility functions for token validation and parsing

interface JwtPayload {
  sub: string; // user id
  email: string;
  iat: number; // issued at
  exp: number; // expiration
  iss: string; // issuer
}

// decode jwt token without verification
// note: this is only for reading claims, not for validation
export function decodeJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

// check if jwt token is expired
export function isTokenExpired(token: string): boolean {
  const payload = decodeJwt(token);
  if (!payload || !payload.exp) {
    return true;
  }

  // exp is in seconds, date.now() is in milliseconds
  return payload.exp * 1000 < Date.now();
}

// get user id from jwt token
export function getUserIdFromToken(token: string): string | null {
  const payload = decodeJwt(token);
  return payload?.sub || null;
}

// get email from jwt token
export function getEmailFromToken(token: string): string | null {
  const payload = decodeJwt(token);
  return payload?.email || null;
}

// get token expiration time in milliseconds
export function getTokenExpiration(token: string): number | null {
  const payload = decodeJwt(token);
  if (!payload || !payload.exp) {
    return null;
  }
  return payload.exp * 1000;
}

// get time remaining until token expires (in milliseconds)
export function getTokenTimeRemaining(token: string): number {
  const expiration = getTokenExpiration(token);
  if (!expiration) {
    return 0;
  }
  return Math.max(0, expiration - Date.now());
}

// check if token is valid (not expired and properly formatted)
export function isTokenValid(token: string): boolean {
  if (!token) {
    return false;
  }

  const payload = decodeJwt(token);
  if (!payload) {
    return false;
  }

  return !isTokenExpired(token);
}
