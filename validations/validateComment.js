import { body } from "express-validator";

export const validateCommentRules = [
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 4 })
    .withMessage("Content has to have a minimum of 4 characters"),
  body("parentId")
    .trim()
    .notEmpty()
    .withMessage("postId is required")
    .isNumeric()
    .withMessage("parentId must be a Number, if it is null send '0'"),
];
