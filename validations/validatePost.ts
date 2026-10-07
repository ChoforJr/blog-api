import { body } from "express-validator";
import {
  isPublishedInput,
  normalizePublishedInput,
} from "../lib/post-input.js";

export const validatePostRules = [
  body("title")
    .trim()
    .isLength({ min: 4, max: 120 })
    .withMessage("Title must be between 4 and 120 characters"),
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
