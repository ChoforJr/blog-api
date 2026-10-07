import type { Request } from "express";
import type { AuthenticatedUser } from "../types/models.js";

export class HttpError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export type AuthSessionRole = "USER" | "ADMIN";

export const USER_AUTH_COOKIE_NAME = "blog_user_session";
export const ADMIN_AUTH_COOKIE_NAME = "blog_admin_session";
export const LEGACY_AUTH_COOKIE_NAME = "blog_session";

export function getAuthCookieNameForPath(path: string): string | null {
  const pathname = path.split("?", 1)[0];
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return ADMIN_AUTH_COOKIE_NAME;
  }
  if (pathname === "/user" || pathname.startsWith("/user/")) {
    return USER_AUTH_COOKIE_NAME;
  }
  return null;
}

export function getAuthCookieNameForRequest(
  path: string,
  origin: string | undefined
): string | null {
  const role = getAuthRoleForOrigin(origin);
  if (role === "ADMIN") return ADMIN_AUTH_COOKIE_NAME;
  if (role === "USER") return USER_AUTH_COOKIE_NAME;
  return getAuthCookieNameForPath(path);
}

export function getAuthRoleForOrigin(
  origin: string | undefined
): AuthSessionRole | null {
  if (!origin) return null;

  const userOrigin =
    process.env.ALLOWED_URL1?.trim() ?? "http://localhost:3000";
  const adminOrigin =
    process.env.ALLOWED_URL2?.trim() ?? "http://localhost:3001";
  if (origin === userOrigin) return "USER";
  if (origin === adminOrigin) return "ADMIN";
  return null;
}

export function getAuthenticatedUser(req: Request): AuthenticatedUser {
  if (!req.user) {
    throw new HttpError("Authentication required", 401);
  }

  return req.user;
}

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET ?? process.env.SECRET_KEY;
  if (!secret || Buffer.byteLength(secret, "utf8") < 32) {
    throw new Error("JWT_SECRET must be configured with at least 32 bytes");
  }

  return secret;
}

function serializeCookie(name: string, value: string, maxAge: number): string {
  const secure = process.env.NODE_ENV === "production";
  const sameSite = secure ? "None" : "Lax";
  const attributes = [
    `${name}=${encodeURIComponent(value)}`,
    "HttpOnly",
    "Path=/",
    `Max-Age=${maxAge}`,
    `SameSite=${sameSite}`,
  ];
  if (secure) attributes.push("Secure");

  return attributes.join("; ");
}

export function createAuthCookie(
  token: string,
  role: AuthSessionRole
): string {
  const name =
    role === "ADMIN" ? ADMIN_AUTH_COOKIE_NAME : USER_AUTH_COOKIE_NAME;
  return serializeCookie(name, token, 3600);
}

export function clearAuthCookie(role?: AuthSessionRole): string[] {
  const names = role
    ? [
        role === "ADMIN" ? ADMIN_AUTH_COOKIE_NAME : USER_AUTH_COOKIE_NAME,
        LEGACY_AUTH_COOKIE_NAME,
      ]
    : [
        USER_AUTH_COOKIE_NAME,
        ADMIN_AUTH_COOKIE_NAME,
        LEGACY_AUTH_COOKIE_NAME,
      ];
  return names.map((name) => serializeCookie(name, "", 0));
}

export function clearLegacyAuthCookie(): string {
  return serializeCookie(LEGACY_AUTH_COOKIE_NAME, "", 0);
}

export function getCookieValue(
  cookieHeader: string | undefined,
  name: string
): string | null {
  if (!cookieHeader) return null;

  for (const cookie of cookieHeader.split(";")) {
    const separator = cookie.indexOf("=");
    if (separator === -1 || cookie.slice(0, separator).trim() !== name) {
      continue;
    }

    const value = cookie.slice(separator + 1).trim();
    try {
      return decodeURIComponent(value);
    } catch {
      return null;
    }
  }

  return null;
}
