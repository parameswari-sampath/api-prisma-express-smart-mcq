/**
 * Validation schemas for question operations
 */
const { body } = require("express-validator");

/**
 * Validation rules for question creation
 */
const createQuestionValidation = [
  body("text").notEmpty().withMessage("Question text is required").trim(),
  body("optionA").notEmpty().withMessage("Option A is required").trim(),
  body("optionB").notEmpty().withMessage("Option B is required").trim(),
  body("optionC").notEmpty().withMessage("Option C is required").trim(),
  body("optionD").notEmpty().withMessage("Option D is required").trim(),
  body("correctAnswer")
    .notEmpty()
    .withMessage("Correct answer is required")
    .isIn(["A", "B", "C", "D"])
    .withMessage("Correct answer must be one of: A, B, C, D"),
];

/**
 * Validation rules for question update
 */
const updateQuestionValidation = [
  body("text")
    .optional()
    .notEmpty()
    .withMessage("Question text cannot be empty if provided")
    .trim(),
  body("optionA")
    .optional()
    .notEmpty()
    .withMessage("Option A cannot be empty if provided")
    .trim(),
  body("optionB")
    .optional()
    .notEmpty()
    .withMessage("Option B cannot be empty if provided")
    .trim(),
  body("optionC")
    .optional()
    .notEmpty()
    .withMessage("Option C cannot be empty if provided")
    .trim(),
  body("optionD")
    .optional()
    .notEmpty()
    .withMessage("Option D cannot be empty if provided")
    .trim(),
  body("correctAnswer")
    .optional()
    .isIn(["A", "B", "C", "D"])
    .withMessage("Correct answer must be one of: A, B, C, D"),
];

module.exports = {
  createQuestionValidation,
  updateQuestionValidation,
};
