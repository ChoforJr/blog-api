import assert from "node:assert/strict";
import { once } from "node:events";
import { createServer } from "node:http";
import { test } from "node:test";
import WebSocket from "ws";
import { attachWebSocketServer, emitRealtimeEvent } from "../websocket/server.js";

test("WebSocket clients receive typed published-post events", async () => {
  const server = createServer();
  attachWebSocketServer(server, ["http://localhost:3000"]);
  server.listen(0, "127.0.0.1");
  await once(server, "listening");

  const address = server.address();
  assert.ok(address && typeof address !== "string");
  const client = new WebSocket(`ws://127.0.0.1:${address.port}/ws`);

  try {
    await once(client, "open");
    const nextMessage = once(client, "message");
    emitRealtimeEvent("post:published", {
      id: 42,
      title: "Typed event",
      content: "Published content",
      published: true,
      createdAt: "2026-10-06T00:00:00.000Z",
      publishedAt: "2026-10-06T00:00:00.000Z",
      userId: 1,
    });

    const [message] = await nextMessage;
    assert.deepEqual(JSON.parse(message.toString()), {
      event: "post:published",
      payload: {
        id: 42,
        title: "Typed event",
        content: "Published content",
        published: true,
        createdAt: "2026-10-06T00:00:00.000Z",
        publishedAt: "2026-10-06T00:00:00.000Z",
        userId: 1,
      },
    });
  } finally {
    client.close();
    await once(client, "close");
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});
