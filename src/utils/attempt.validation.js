/**
 * Validation schemas for test attempt operations
 */
const { body } = require("express-validator");

/**
 * Validation rules for starting a test attempt
 */
const startAttemptValidation = [
  body("testId").isInt().withMessage("Test ID must be an integer"),
];

/**
 * Validation rules for submitting answers
 */
const submitAnswerValidation = [
  body("questionId").isInt().withMessage("Question ID must be an integer"),
  body("selectedOption")
    .isString()
    .isIn(["A", "B", "C", "D"])
    .withMessage("Selected option must be one of: A, B, C, D"),
];

/**
 * Validation rules for submitting an entire test
 */
const submitAttemptValidation = [
  body("answers").isArray().withMessage("Answers must be an array"),
  body("answers.*.questionId")
    .isInt()
    .withMessage("Question ID must be an integer"),
  body("answers.*.selectedOption")
    .isString()
    .isIn(["A", "B", "C", "D"])
    .withMessage("Selected option must be one of: A, B, C, D"),
];

module.exports = {
  startAttemptValidation,
  submitAnswerValidation,
  submitAttemptValidation,
};
