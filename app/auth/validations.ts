import { check } from "express-validator";

export const signupValidations = [
  check("email").isEmail().withMessage("Email is required"),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

export const loginValidations = [
  check("email").isEmail().withMessage("Email is required"),
  check("password").notEmpty().withMessage("Password is required"),
];
