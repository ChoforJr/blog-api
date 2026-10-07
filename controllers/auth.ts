import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import {
  clearAuthCookie,
  clearLegacyAuthCookie,
  createAuthCookie,
  getAuthRoleForOrigin,
  getJwtSecret,
} from "../lib/auth.js";
import type { AuthenticatedUser } from "../types/models.js";

export const authLogin: RequestHandler = (req, res, next) => {
  passport.authenticate(
    "login",
    (
      error: Error | null,
      user: Express.User | false | undefined,
      info?: { message?: string }
    ) => {
      if (error) {
        next(error);
        return;
      }
      if (!user) {
        res.status(401).json({
          error: {
            code: "INVALID_CREDENTIALS",
            message: info?.message ?? "Authentication failed",
          },
        });
        return;
      }

      const authenticatedUser: AuthenticatedUser = {
        id: user.id,
        username: user.username,
        role: user.role,
      };
      const token = jwt.sign({ user: authenticatedUser }, getJwtSecret(), {
        expiresIn: "1h",
      });
      const sessionRole =
        getAuthRoleForOrigin(req.get("origin")) ?? authenticatedUser.role;

      res.setHeader("Set-Cookie", [
        createAuthCookie(token, sessionRole),
        clearLegacyAuthCookie(),
      ]);
      res.json({ token, user: authenticatedUser });
    }
  )(req, res, next);
};

export const authLogout: RequestHandler = (req, res) => {
  res.setHeader(
    "Set-Cookie",
    clearAuthCookie(getAuthRoleForOrigin(req.get("origin")) ?? undefined)
  );
  res.sendStatus(204);
};
