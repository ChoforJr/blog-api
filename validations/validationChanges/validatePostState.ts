import { body } from "express-validator";
import {
  isPublishedInput,
  normalizePublishedInput,
} from "../../lib/post-input.js";

export const validatePostStateRules = [
  body("published")
    .custom(isPublishedInput)
    .withMessage("Published must be a boolean"),
  body("published").customSanitizer(normalizePublishedInput),
];
