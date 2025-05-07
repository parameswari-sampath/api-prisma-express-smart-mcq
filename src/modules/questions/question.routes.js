/**
 * Question routes - Define API endpoints for question operations
 */
const express = require("express");
const router = express.Router();
const questionController = require("./question.controller");
const { authenticate } = require("../../middlewares/auth.middleware");
const { authorizeTeacher } = require("../../middlewares/role.middleware");
const {
  handleValidationErrors,
} = require("../../middlewares/error.middleware");
const {
  createQuestionValidation,
  updateQuestionValidation,
} = require("../../utils/question.validation");

// Apply authentication and authorization to all question routes
router.use(authenticate);
router.use(authorizeTeacher);

/**
 * @route POST /api/questions
 * @desc Create a new question
 * @access Private - Teachers only
 */
router.post(
  "/",
  createQuestionValidation,
  handleValidationErrors,
  questionController.createQuestion
);

/**
 * @route GET /api/questions
 * @desc Get all questions
 * @access Private - Teachers only
 */
router.get("/", questionController.getAllQuestions);

/**
 * @route GET /api/questions/:id
 * @desc Get a specific question by ID
 * @access Private - Teachers only
 */
router.get("/:id", questionController.getQuestionById);

/**
 * @route PUT /api/questions/:id
 * @desc Update a question
 * @access Private - Teachers only
 */
router.put(
  "/:id",
  updateQuestionValidation,
  handleValidationErrors,
  questionController.updateQuestion
);

/**
 * @route DELETE /api/questions/:id
 * @desc Delete a question
 * @access Private - Teachers only
 */
router.delete("/:id", questionController.deleteQuestion);

module.exports = router;
