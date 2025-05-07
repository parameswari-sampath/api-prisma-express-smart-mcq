/**
 * Test attempt controller - Handles HTTP requests for test attempt operations
 */
const attemptService = require("./attempt.service");

/**
 * Start a new test attempt
 * @route POST /api/attempts
 * @access Private - Students only
 */
const startAttempt = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const { testId } = req.body;

    const attempt = await attemptService.startAttempt(testId, studentId);

    res.status(201).json({
      message: "Test attempt started successfully",
      attempt,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all test attempts for a student
 * @route GET /api/attempts
 * @access Private - Students only
 */
const getMyAttempts = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const filters = {
      page: req.query.page,
      limit: req.query.limit,
    };

    const result = await attemptService.getStudentAttempts(studentId, filters);

    res.status(200).json({
      message: "Test attempts retrieved successfully",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a specific test attempt by ID
 * @route GET /api/attempts/:id
 * @access Private - Students only
 */
const getAttemptById = async (req, res, next) => {
  try {
    const attemptId = req.params.id;
    const studentId = req.user.id;

    const attempt = await attemptService.getAttemptById(attemptId, studentId);

    res.status(200).json({
      message: "Test attempt retrieved successfully",
      attempt,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Submit an answer for a question in a test attempt
 * @route POST /api/attempts/:id/answers
 * @access Private - Students only
 */
const submitAnswer = async (req, res, next) => {
  try {
    const attemptId = req.params.id;
    const studentId = req.user.id;
    const { questionId, selectedOption } = req.body;

    const answer = await attemptService.saveAnswer(
      attemptId,
      questionId,
      selectedOption,
      studentId
    );

    res.status(200).json({
      message: "Answer submitted successfully",
      answer,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Submit the entire test attempt
 * @route PUT /api/attempts/:id/submit
 * @access Private - Students only
 */
const submitAttempt = async (req, res, next) => {
  try {
    const attemptId = req.params.id;
    const studentId = req.user.id;
    const { answers } = req.body;

    const result = await attemptService.submitAttempt(
      attemptId,
      answers,
      studentId
    );

    res.status(200).json({
      message: "Test submitted successfully",
      result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  startAttempt,
  getMyAttempts,
  getAttemptById,
  submitAnswer,
  submitAttempt,
};
