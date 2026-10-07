import type { Server } from "node:http";
import { WebSocket, WebSocketServer } from "ws";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../types/websocket.js";

type ClientEvent = {
  [K in keyof ClientToServerEvents]: {
    event: K;
    payload: Parameters<ClientToServerEvents[K]>[0];
  };
}[keyof ClientToServerEvents];

const postSubscriptions = new WeakMap<WebSocket, Set<number>>();

function isClientEvent(value: unknown): value is ClientEvent {
  if (!value || typeof value !== "object" || !("event" in value)) {
    return false;
  }

  const event = value as { event: unknown; payload?: unknown };
  if (
    event.event !== "post:subscribe" &&
    event.event !== "post:unsubscribe"
  ) {
    return false;
  }

  return (
    typeof event.payload === "object" &&
    event.payload !== null &&
    "postId" in event.payload &&
    typeof event.payload.postId === "number" &&
    Number.isSafeInteger(event.payload.postId) &&
    event.payload.postId > 0
  );
}

export function emitRealtimeEvent<K extends keyof ServerToClientEvents>(
  event: K,
  payload: Parameters<ServerToClientEvents[K]>[0]
): void {
  const message = JSON.stringify({ event, payload });

  for (const client of websocketServer.clients) {
    if (client.readyState !== WebSocket.OPEN) continue;

    const postId =
      payload && typeof payload === "object"
        ? "postId" in payload
          ? payload.postId
          : "id" in payload
            ? payload.id
            : null
        : null;
    const subscribed = postSubscriptions.get(client);
    if (
      event !== "post:published" &&
      typeof postId === "number" &&
      subscribed &&
      !subscribed.has(postId)
    ) {
      continue;
    }

    client.send(message, (error) => {
      if (error) console.error("Failed to send WebSocket event", error);
    });
  }
}

const websocketServer = new WebSocketServer({
  noServer: true,
  maxPayload: 64 * 1024,
  perMessageDeflate: false,
});
const liveClients = new WeakSet<WebSocket>();
const heartbeat = setInterval(() => {
  for (const client of websocketServer.clients) {
    if (!liveClients.has(client)) {
      client.terminate();
      continue;
    }

    liveClients.delete(client);
    client.ping((error?: Error) => {
      if (error) {
        console.error("WebSocket heartbeat failed", error);
        client.terminate();
      }
    });
  }
}, 30_000);
heartbeat.unref();

websocketServer.on("connection", (client) => {
  liveClients.add(client);
  postSubscriptions.set(client, new Set());
  client.on("pong", () => liveClients.add(client));

  client.on("message", (data) => {
    let event: unknown;
    try {
      event = JSON.parse(data.toString()) as unknown;
    } catch {
      client.close(1007, "Invalid JSON message");
      return;
    }

    if (!isClientEvent(event)) {
      client.close(1008, "Unsupported event");
      return;
    }

    const subscriptions = postSubscriptions.get(client);
    if (!subscriptions) {
      client.close(1011, "Connection state is unavailable");
      return;
    }

    if (event.event === "post:subscribe") {
      subscriptions.add(event.payload.postId);
    } else {
      subscriptions.delete(event.payload.postId);
    }
  });
});

export function closeWebSocketServer(): Promise<void> {
  for (const client of websocketServer.clients) {
    client.close(1001, "Server shutting down");
  }

  const terminateUnclosedClients = setTimeout(() => {
    for (const client of websocketServer.clients) client.terminate();
  }, 1_000);
  terminateUnclosedClients.unref();

  return new Promise((resolve, reject) => {
    websocketServer.close((error) => {
      clearTimeout(terminateUnclosedClients);
      clearInterval(heartbeat);
      if (error) reject(error);
      else resolve();
    });
  });
}

export function attachWebSocketServer(
  server: Server,
  allowedOrigins: string[]
): void {
  server.on("upgrade", (request, socket, head) => {
    let requestUrl: URL;
    try {
      requestUrl = new URL(request.url ?? "/", "http://localhost");
    } catch {
      socket.destroy();
      return;
    }

    const origin = request.headers.origin;
    if (
      requestUrl.pathname !== "/ws" ||
      (origin !== undefined && !allowedOrigins.includes(origin))
    ) {
      socket.write("HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n");
      socket.destroy();
      return;
    }

    websocketServer.handleUpgrade(request, socket, head, (client) => {
      websocketServer.emit("connection", client, request);
    });
  });
}
