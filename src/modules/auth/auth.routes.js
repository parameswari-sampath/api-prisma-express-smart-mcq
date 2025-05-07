/**
 * Authentication routes
 */
const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");
const {
  registerValidation,
  loginValidation,
} = require("../../utils/validation.util");
const {
  handleValidationErrors,
} = require("../../middlewares/error.middleware");
const { authenticate } = require("../../middlewares/auth.middleware");

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post(
  "/register",
  registerValidation,
  handleValidationErrors,
  authController.register
);

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 */
router.post(
  "/login",
  loginValidation,
  handleValidationErrors,
  authController.login
);

/**
 * @route GET /api/auth/profile
 * @desc Get current user profile
 * @access Private
 */
router.get("/profile", authenticate, authController.getProfile);

module.exports = router;
