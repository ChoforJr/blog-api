import { body } from "express-validator";
import { findUserByUsername } from "../prisma_queries/find.js";

export const validateSignUpRules = [
  body("username")
    .trim()
    .isEmail()
    .withMessage("Email: Should be an email")
    .isLength({ min: 8, max: 32 })
    .withMessage("Email: Has to have a length of between 8 and 32")
    .custom(async (value) => {
      const user = await findUserByUsername(value);
      if (!user) {
        return true;
      }
      throw new Error("Email: Has already been Added");
    }),
  body("displayName")
    .trim()
    .matches(/^[A-Za-z0-9\s_]+$/) // Allows letters, spaces, numbers and underscore
    .withMessage(
      "Display Name: must contain only letters, spaces, numbers or underscore"
    )
    .isLength({ min: 4, max: 32 })
    .withMessage("Display Name: Has to have a length of between 4 and 32"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 4, max: 32 })
    .withMessage("Password: Has to have a length of between 4 and 32"),
  body("confirmPassword")
    .trim()
    .notEmpty()
    .withMessage("Confirm Password is required")
    .isLength({ min: 4, max: 32 })
    .withMessage("Confirm Password: Has to have a length of between 4 and 32")
    .custom(async (value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match Password");
      }
      return true;
    }),
];
