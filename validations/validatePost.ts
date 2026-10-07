import { body } from "express-validator";
import {
  isPublishedInput,
  normalizePublishedInput,
} from "../lib/post-input.js";

export const validatePostRules = [
  body("title")
    .trim()
    .isLength({ min: 4, max: 32 })
    .withMessage("Title: Has to have a length of between 4 and 32"),
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 4 })
    .withMessage("Content has to have a minimum of 4 characters"),
  body("published")
    .custom(isPublishedInput)
    .withMessage("Published must be a boolean"),
  body("published").customSanitizer(normalizePublishedInput),
];
