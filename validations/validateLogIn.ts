import { body } from "express-validator";

export const validateLogInRules = [
  body("username")
    .trim()
    .isEmail()
    .withMessage("Email: Should be an email")
    .isLength({ min: 8, max: 32 })
    .withMessage("Email: Has to have a length of between 8 and 32"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 4, max: 32 })
    .withMessage("Password: Has to have a length of between 4 and 32"),
];
