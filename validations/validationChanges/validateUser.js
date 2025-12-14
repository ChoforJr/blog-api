import { body } from "express-validator";
import { compare } from "bcryptjs";
import { findUserByUsername } from "../../prisma_queries/find.js";

export const validateUsernameRules = [
  body("newUsername")
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
];

export const validatePasswordRules = [
  body("currentPassword")
    .trim()
    .notEmpty()
    .withMessage("currentPassword is required")
    .isLength({ min: 4, max: 32 })
    .withMessage("currentPassword: Has to have a length of between 4 and 32")
    .custom(async (value, { req }) => {
      const user = await findUserByUsername(req.user.username);
      if (!user) {
        throw new Error("Incorrect username");
      }
      const match = await compare(value, user.password);
      if (!match) {
        throw new Error("Incorrect password");
      }
    }),
  body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("newPassword is required")
    .isLength({ min: 4, max: 32 })
    .withMessage("newPassword: Has to have a length of between 4 and 32"),
  body("confirmNewPassword")
    .trim()
    .notEmpty()
    .withMessage("Confirm New Password is required")
    .isLength({ min: 4, max: 32 })
    .withMessage(
      "Confirm New Password: Has to have a length of between 4 and 32"
    )
    .custom(async (value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Password confirmation does not match New Password");
      }
      return true;
    }),
];

export const validateDisplayNameRules = [
  body("newDisplayName")
    .trim()
    .matches(/^[A-Za-z0-9\s_]+$/) // Allows letters, spaces, numbers and underscore
    .withMessage("Display Name: must contain only letters")
    .isLength({ min: 4, max: 32 })
    .withMessage("Display Name: Has to have a length of between 4 and 32"),
];

export const validateBioRules = [
  body("newBio")
    .trim()
    .isLength({ min: 4, max: 64 })
    .withMessage("Bio: Has to have a length of between 4 and 64"),
];
