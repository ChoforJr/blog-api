import type { RequestHandler } from "express";
import { getAuthenticatedUser } from "../lib/auth.js";

export const checkIfUserIsAdmin: RequestHandler = (req, res, next) => {
  try {
    if (getAuthenticatedUser(req).role !== "ADMIN") {
      res.status(403).json({
        error: {
          code: "FORBIDDEN",
          message: "You are not authorized to access this information",
        },
      });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};
