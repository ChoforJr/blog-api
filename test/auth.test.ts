import assert from "node:assert/strict";
import { test } from "node:test";
import {
  ADMIN_AUTH_COOKIE_NAME,
  USER_AUTH_COOKIE_NAME,
  LEGACY_AUTH_COOKIE_NAME,
  clearAuthCookie,
  clearLegacyAuthCookie,
  createAuthCookie,
  getAuthCookieNameForPath,
  getAuthCookieNameForRequest,
  getAuthRoleForOrigin,
  getCookieValue,
  getJwtSecret,
} from "../lib/auth.js";

test("cookie parsing returns the named, decoded value", () => {
  assert.equal(
    getCookieValue("other=value; blog_user_session=abc%2Bdef", USER_AUTH_COOKIE_NAME),
    "abc+def"
  );
  assert.equal(getCookieValue("other=value", USER_AUTH_COOKIE_NAME), null);
  assert.equal(
    getCookieValue("blog_user_session=%E0%A4%A", USER_AUTH_COOKIE_NAME),
    null
  );
});

test("auth cookies are HttpOnly and use secure cross-site attributes in production", () => {
  const previousEnvironment = process.env.NODE_ENV;
  process.env.NODE_ENV = "production";

  try {
    const cookie = createAuthCookie("token", "ADMIN");
    assert.match(cookie, new RegExp(`^${ADMIN_AUTH_COOKIE_NAME}=`));
    assert.match(cookie, /HttpOnly/);
    assert.match(cookie, /Secure/);
    assert.match(cookie, /SameSite=None/);
    assert.ok(clearAuthCookie("ADMIN").some((value) =>
      value.startsWith(`${ADMIN_AUTH_COOKIE_NAME}=`) && value.includes("Max-Age=0")
    ));
  } finally {
    if (previousEnvironment === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previousEnvironment;
  }
});

test("local auth cookies use SameSite=Lax without Secure", () => {
  const previousEnvironment = process.env.NODE_ENV;
  process.env.NODE_ENV = "development";

  try {
    const cookie = createAuthCookie("token", "USER");
    assert.match(cookie, new RegExp(`^${USER_AUTH_COOKIE_NAME}=`));
    assert.match(cookie, /SameSite=Lax/);
    assert.doesNotMatch(cookie, /; Secure/);
    assert.ok(clearAuthCookie("USER").every((value) => value.includes("SameSite=Lax")));
  } finally {
    if (previousEnvironment === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previousEnvironment;
  }
});

test("admin and user routes select separate cookies when both are present", () => {
  const previousUserOrigin = process.env.ALLOWED_URL1;
  const previousAdminOrigin = process.env.ALLOWED_URL2;
  process.env.ALLOWED_URL1 = "http://localhost:3000";
  process.env.ALLOWED_URL2 = "http://localhost:3001";

  try {
    const cookieHeader =
      "blog_admin_session=admin-token; blog_user_session=user-token";
    const userCookie = getAuthCookieNameForPath("/user/post/24/comment");
    const adminCookie = getAuthCookieNameForPath("/admin/post/all");

    assert.ok(userCookie);
    assert.ok(adminCookie);
    assert.equal(userCookie, USER_AUTH_COOKIE_NAME);
    assert.equal(adminCookie, ADMIN_AUTH_COOKIE_NAME);
    assert.equal(getCookieValue(cookieHeader, userCookie), "user-token");
    assert.equal(getCookieValue(cookieHeader, adminCookie), "admin-token");
    assert.equal(getAuthCookieNameForPath("/post"), null);
    assert.equal(getAuthCookieNameForPath("/administer"), null);
    assert.equal(
      getAuthCookieNameForRequest(
        "/user/post/24/comment",
        "http://localhost:3000"
      ),
      USER_AUTH_COOKIE_NAME
    );
    assert.equal(
      getAuthCookieNameForRequest("/user/username", "http://localhost:3001"),
      ADMIN_AUTH_COOKIE_NAME
    );
    assert.equal(
      getAuthCookieNameForRequest("/admin/post/all", "http://localhost:3000"),
      USER_AUTH_COOKIE_NAME
    );
    assert.equal(
      getAuthCookieNameForRequest("/admin/post/all", undefined),
      ADMIN_AUTH_COOKIE_NAME
    );
    assert.equal(LEGACY_AUTH_COOKIE_NAME, "blog_session");
  } finally {
    if (previousUserOrigin === undefined) delete process.env.ALLOWED_URL1;
    else process.env.ALLOWED_URL1 = previousUserOrigin;
    if (previousAdminOrigin === undefined) delete process.env.ALLOWED_URL2;
    else process.env.ALLOWED_URL2 = previousAdminOrigin;
  }
});

test("logout selects the matching client session and clears the legacy cookie", () => {
  const previousUserOrigin = process.env.ALLOWED_URL1;
  const previousAdminOrigin = process.env.ALLOWED_URL2;
  process.env.ALLOWED_URL1 = "http://localhost:3000";
  process.env.ALLOWED_URL2 = "http://localhost:3001";

  try {
    assert.equal(getAuthRoleForOrigin("http://localhost:3000"), "USER");
    assert.equal(getAuthRoleForOrigin("http://localhost:3001"), "ADMIN");
    assert.equal(getAuthRoleForOrigin(undefined), null);
    assert.match(clearLegacyAuthCookie(), /^blog_session=/);
  } finally {
    if (previousUserOrigin === undefined) delete process.env.ALLOWED_URL1;
    else process.env.ALLOWED_URL1 = previousUserOrigin;
    if (previousAdminOrigin === undefined) delete process.env.ALLOWED_URL2;
    else process.env.ALLOWED_URL2 = previousAdminOrigin;
  }
});

test("JWT secret rejects missing or short values", () => {
  const previousJwtSecret = process.env.JWT_SECRET;
  const previousSecretKey = process.env.SECRET_KEY;
  delete process.env.JWT_SECRET;
  delete process.env.SECRET_KEY;

  try {
    assert.throws(() => getJwtSecret(), /at least 32 bytes/);
    process.env.JWT_SECRET = "x".repeat(32);
    assert.equal(getJwtSecret(), "x".repeat(32));
  } finally {
    if (previousJwtSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = previousJwtSecret;
    if (previousSecretKey === undefined) delete process.env.SECRET_KEY;
    else process.env.SECRET_KEY = previousSecretKey;
  }
});
