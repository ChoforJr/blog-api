import assert from "node:assert/strict";
import { test } from "node:test";
import {
  getAllowedOrigins,
  validateRuntimeEnvironment,
} from "../config/environment.js";

test("development permits both local Next client origins by default", () => {
  assert.deepEqual(getAllowedOrigins({ NODE_ENV: "development" }), [
    "http://localhost:3000",
    "http://localhost:3001",
  ]);
});

test("production requires two distinct exact HTTPS frontend origins", () => {
  assert.deepEqual(
    getAllowedOrigins({
      NODE_ENV: "production",
      ALLOWED_URL1: "https://blog.example.com",
      ALLOWED_URL2: "https://admin.example.com",
    }),
    ["https://blog.example.com", "https://admin.example.com"]
  );
  assert.throws(
    () =>
      getAllowedOrigins({
        NODE_ENV: "production",
        ALLOWED_URL1: "https://blog.example.com/",
        ALLOWED_URL2: "https://admin.example.com",
      }),
    /bare HTTP\(S\) origins/
  );
});

test("startup environment rejects missing database and malformed port values", () => {
  assert.throws(
    () =>
      validateRuntimeEnvironment({
        NODE_ENV: "development",
        JWT_SECRET: "s".repeat(48),
      }),
    /DATABASE_URL/
  );
  assert.throws(
    () =>
      validateRuntimeEnvironment({
        NODE_ENV: "development",
        DATABASE_URL: "postgresql://user:password@localhost/blog",
        JWT_SECRET: "s".repeat(48),
        PORT: "not-a-port",
      }),
    /PORT/
  );
});
