import { body } from "express-validator";

export const validatePostStateRules = [
  body("published")
    .trim()
    .notEmpty()
    .isBoolean()
    .withMessage("Published must be a boolean"),
];
