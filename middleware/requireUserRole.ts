import type { RequestHandler } from "express";

export const requireUserRole: RequestHandler = (req, res, next) => {
  if (req.user?.role !== "USER") {
    res.status(403).json({
      error: {
        code: "FORBIDDEN",
        message: "A user account is required for this action",
      },
    });
    return;
  }

  next();
};
