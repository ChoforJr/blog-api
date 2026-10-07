import type { RequestParamHandler } from "express";

export const validateId: RequestParamHandler = (
  _req,
  res,
  next,
  value
) => {
  const id = Number(value);
  if (!/^[1-9]\d*$/.test(value) || !Number.isSafeInteger(id)) {
    res.status(400).json({
      error: { code: "INVALID_ID", message: "ID must be a positive integer" },
    });
    return;
  }

  next();
};
