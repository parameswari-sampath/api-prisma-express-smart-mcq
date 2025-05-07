/**
 * Test attempt routes - API endpoints for test attempt operations
 */
const express = require("express");
const router = express.Router();
const attemptController = require("./attempt.controller");
const { authenticate } = require("../../middlewares/auth.middleware");
const { authorizeStudent } = require("../../middlewares/role.middleware");
const {
  handleValidationErrors,
} = require("../../middlewares/error.middleware");
const {
  startAttemptValidation,
  submitAnswerValidation,
  submitAttemptValidation,
} = require("../../utils/attempt.validation");

// Apply authentication and student authorization to all attempt routes
router.use(authenticate);
router.use(authorizeStudent);

/**
 * @route POST /api/attempts
 * @desc Start a new test attempt
 * @access Private - Students only
 */
router.post(
  "/",
  startAttemptValidation,
  handleValidationErrors,
  attemptController.startAttempt
);

/**
 * @route GET /api/attempts
 * @desc Get all test attempts for the current student
 * @access Private - Students only
 */
router.get("/", attemptController.getMyAttempts);

/**
 * @route GET /api/attempts/:id
 * @desc Get a specific test attempt by ID
 * @access Private - Students only
 */
router.get("/:id", attemptController.getAttemptById);

/**
 * @route POST /api/attempts/:id/answers
 * @desc Submit an answer for a question in a test attempt
 * @access Private - Students only
 */
router.post(
  "/:id/answers",
  submitAnswerValidation,
  handleValidationErrors,
  attemptController.submitAnswer
);

/**
 * @route PUT /api/attempts/:id/submit
 * @desc Submit the entire test attempt
 * @access Private - Students only
 */
router.put(
  "/:id/submit",
  submitAttemptValidation,
  handleValidationErrors,
  attemptController.submitAttempt
);

module.exports = router;
