import { body } from "express-validator";

export const validatePostRules = [
  body("title")
    .trim()
    .matches(/^[A-Za-z0-9\s_]+$/) // Allows letters, spaces, numbers and underscore
    .withMessage(
      "Title: must contain only letters, spaces, numbers or underscore"
    )
    .isLength({ min: 4, max: 32 })
    .withMessage("Title: Has to have a length of between 4 and 32"),
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 4 })
    .withMessage("Content has to have a minimum of 4 characters"),
  body("published")
    .trim()
    .notEmpty()
    .withMessage("Published State is required")
    .isBoolean()
    .withMessage("Published must be a boolean"),
];
