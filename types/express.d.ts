import type { AuthenticatedUser } from "./models.js";

declare global {
  namespace Express {
    interface User extends AuthenticatedUser {}
  }
}

export {};
