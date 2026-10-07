import assert from "node:assert/strict";
import { createServer } from "node:http";
import { test } from "node:test";

test("local admin origin receives credentialed CORS headers", async () => {
  const keys = [
    "DATABASE_URL",
    "JWT_SECRET",
    "NODE_ENV",
    "ALLOWED_URL1",
    "ALLOWED_URL2",
  ] as const;
  const previous = new Map(
    keys.map((key) => [key, process.env[key]] as const)
  );
  process.env.DATABASE_URL = "postgresql://user:password@localhost:5432/blog";
  process.env.JWT_SECRET = "x".repeat(48);
  process.env.NODE_ENV = "development";
  delete process.env.ALLOWED_URL1;
  delete process.env.ALLOWED_URL2;

  let server: ReturnType<typeof createServer> | undefined;
  try {
    const { app, allowedOrigins } = await import("../app.js");
    assert.ok(allowedOrigins.includes("http://localhost:3001"));
    server = createServer(app);
    await new Promise<void>((resolve) => {
      server?.listen(0, "127.0.0.1", resolve);
    });
    const address = server.address();
    assert.ok(address && typeof address !== "string");
    const apiUrl = `http://127.0.0.1:${address.port}/healthz`;

    const response = await fetch(apiUrl, {
      headers: { Origin: "http://localhost:3001" },
    });
    assert.equal(response.status, 200);
    assert.equal(
      response.headers.get("access-control-allow-origin"),
      "http://localhost:3001"
    );
    assert.equal(
      response.headers.get("access-control-allow-credentials"),
      "true"
    );

    const preflight = await fetch(apiUrl, {
      method: "OPTIONS",
      headers: {
        Origin: "http://localhost:3001",
        "Access-Control-Request-Method": "PUT",
        "Access-Control-Request-Headers": "content-type",
      },
    });
    assert.equal(preflight.status, 200);
    assert.match(
      preflight.headers.get("access-control-allow-methods") ?? "",
      /PUT/
    );
  } finally {
    if (server?.listening) {
      await new Promise<void>((resolve, reject) => {
        server?.close((error) => (error ? reject(error) : resolve()));
      });
    }
    for (const key of keys) {
      const value = previous.get(key);
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});
