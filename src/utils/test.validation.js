/**
 * Validation schemas for test operations
 */
const { body } = require("express-validator");

/**
 * Validation rules for test creation
 */
const createTestValidation = [
  body("title").trim().notEmpty().withMessage("Test title is required"),
  body("description").optional().trim(),
  body("duration")
    .isInt({ min: 5, max: 180 })
    .withMessage("Duration must be between 5 and 180 minutes"),
  body("questionIds")
    .isArray({ min: 1 })
    .withMessage("At least one question is required"),
  body("questionIds.*").isInt().withMessage("Question IDs must be integers"),
];

/**
 * Validation rules for test update
 */
const updateTestValidation = [
  body("title").trim().notEmpty().withMessage("Test title is required"),
  body("description").optional().trim(),
  body("duration")
    .isInt({ min: 5, max: 180 })
    .withMessage("Duration must be between 5 and 180 minutes"),
];

/**
 * Validation rules for adding questions to a test
 */
const addQuestionsValidation = [
  body("questionIds")
    .isArray({ min: 1 })
    .withMessage("At least one question is required"),
  body("questionIds.*").isInt().withMessage("Question IDs must be integers"),
];

module.exports = {
  createTestValidation,
  updateTestValidation,
  addQuestionsValidation,
};
