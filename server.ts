import { createServer } from "node:http";
import { app, allowedOrigins, port } from "./app.js";
import {
  attachWebSocketServer,
  closeWebSocketServer,
} from "./websocket/server.js";
import prisma from "./config/prisma.js";

const server = createServer(app);
attachWebSocketServer(server, allowedOrigins);

server.listen(port, () => {
  console.log(`Blog API listening on port ${port}`);
});

let shuttingDown = false;
for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.once(signal, () => {
    if (shuttingDown) return;
    shuttingDown = true;

    void (async () => {
      const closeHttpServer = new Promise<void>((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      });
      await closeWebSocketServer();
      await closeHttpServer;
      await prisma.$disconnect();
    })().catch((error: unknown) => {
      console.error("Failed to shut down cleanly", error);
      process.exitCode = 1;
    });
  });
}
