/**
 * Test routes - API endpoints for test operations
 */
const express = require("express");
const router = express.Router();
const testController = require("./test.controller");
const { authenticate } = require("../../middlewares/auth.middleware");
const { authorizeTeacher } = require("../../middlewares/role.middleware");
const {
  handleValidationErrors,
} = require("../../middlewares/error.middleware");
const {
  createTestValidation,
  updateTestValidation,
  addQuestionsValidation,
} = require("../../utils/test.validation");

// Apply authentication to all test routes
router.use(authenticate);
router.use(authorizeTeacher);

/**
 * @route POST /api/tests
 * @desc Create a new test
 * @access Private - Teachers only
 */
router.post(
  "/",
  createTestValidation,
  handleValidationErrors,
  testController.createTest
);

/**
 * @route GET /api/tests
 * @desc Get all tests created by teacher
 * @access Private - Teachers only
 */
router.get("/", testController.getAllTests);

/**
 * @route GET /api/tests/:id
 * @desc Get specific test details
 * @access Private - Teachers only
 */
router.get("/:id", testController.getTestById);

/**
 * @route PUT /api/tests/:id
 * @desc Update test details
 * @access Private - Teachers only
 */
router.put(
  "/:id",
  updateTestValidation,
  handleValidationErrors,
  testController.updateTest
);

/**
 * @route DELETE /api/tests/:id
 * @desc Delete a test
 * @access Private - Teachers only
 */
router.delete("/:id", testController.deleteTest);

/**
 * @route POST /api/tests/:id/questions
 * @desc Add questions from bank to test
 * @access Private - Teachers only
 */
router.post(
  "/:id/questions",
  addQuestionsValidation,
  handleValidationErrors,
  testController.addQuestionsToTest
);

/**
 * @route DELETE /api/tests/:id/questions/:questionId
 * @desc Remove a question from test
 * @access Private - Teachers only
 */
router.delete(
  "/:id/questions/:questionId",
  testController.removeQuestionFromTest
);

module.exports = router;
