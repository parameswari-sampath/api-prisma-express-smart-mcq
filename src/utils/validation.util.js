/**
 * Validation schemas for auth requests
 */
const { body } = require("express-validator");
const { UserRole } = require("@prisma/client");

/**
 * Validation rules for user registration
 */
const registerValidation = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("name").notEmpty().withMessage("Name is required"),
  body("role")
    .isIn(Object.values(UserRole))
    .withMessage(`Role must be one of: ${Object.values(UserRole).join(", ")}`),
];

/**
 * Validation rules for user login
 */
const loginValidation = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

module.exports = {
  registerValidation,
  loginValidation,
};
