import { body } from "express-validator";

export const validatePostStateRules = [
  body("published")
    .trim()
    .notEmpty()
    .withMessage("Published State is required")
    .isBoolean()
    .withMessage("Published must be a boolean"),
];
