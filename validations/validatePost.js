import { body, validationResult } from "express-validator";

export const validatePostRules = [
  body("title")
    .trim()
    .matches(/^[A-Za-z\s]\w+$/) // Allows letters, spaces, numbers and underscore
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
];

export const checkPostValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } else {
    next();
  }
};
