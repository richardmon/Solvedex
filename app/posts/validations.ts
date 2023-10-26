import { body } from "express-validator";

export const postUpdateValidationRules = [
  body("title")
    .optional()
    .isString()
    .isLength({ min: 5 })
    .withMessage("Title must be at least 5 characters long."),
  body("content")
    .optional()
    .isString()
    .isLength({ min: 10 })
    .withMessage("Content must be at least 10 characters long."),
];

export const postCreateValidationRules = [
  body("title")
    .isString()
    .isLength({ min: 5 })
    .withMessage("Title must be at least 5 characters long."),
  body("content")
    .isString()
    .isLength({ min: 10 })
    .withMessage("Content must be at least 10 characters long."),
];
