/**
 * Test controller - Handles HTTP requests for test operations
 */
const testService = require("./test.service");

/**
 * Create a new test
 * @route POST /api/tests
 * @access Private - Teachers only
 */
const createTest = async (req, res, next) => {
  try {
    const teacherId = req.user.id;
    const testData = req.body;

    const test = await testService.createTest(testData, teacherId);

    res.status(201).json({
      message: "Test created successfully",
      test,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all tests created by a teacher
 * @route GET /api/tests
 * @access Private - Teachers only
 */
const getAllTests = async (req, res, next) => {
  try {
    const teacherId = req.user.id;
    const filters = {
      page: req.query.page,
      limit: req.query.limit,
    };

    const result = await testService.getAllTests(teacherId, filters);

    res.status(200).json({
      message: "Tests retrieved successfully",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a specific test by ID
 * @route GET /api/tests/:id
 * @access Private - Teachers only
 */
const getTestById = async (req, res, next) => {
  try {
    const testId = req.params.id;
    const teacherId = req.user.id;

    const test = await testService.getTestById(testId, teacherId);

    res.status(200).json({
      message: "Test retrieved successfully",
      test,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a test
 * @route PUT /api/tests/:id
 * @access Private - Teachers only
 */
const updateTest = async (req, res, next) => {
  try {
    const testId = req.params.id;
    const teacherId = req.user.id;
    const testData = req.body;

    const updatedTest = await testService.updateTest(
      testId,
      testData,
      teacherId
    );

    res.status(200).json({
      message: "Test updated successfully",
      test: updatedTest,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a test
 * @route DELETE /api/tests/:id
 * @access Private - Teachers only
 */
const deleteTest = async (req, res, next) => {
  try {
    const testId = req.params.id;
    const teacherId = req.user.id;

    await testService.deleteTest(testId, teacherId);

    res.status(200).json({
      message: "Test deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add questions to a test
 * @route POST /api/tests/:id/questions
 * @access Private - Teachers only
 */
const addQuestionsToTest = async (req, res, next) => {
  try {
    const testId = req.params.id;
    const teacherId = req.user.id;
    const { questionIds } = req.body;

    const test = await testService.addQuestionsToTest(
      testId,
      questionIds,
      teacherId
    );

    res.status(200).json({
      message: "Questions added to test successfully",
      test,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove a question from a test
 * @route DELETE /api/tests/:id/questions/:questionId
 * @access Private - Teachers only
 */
const removeQuestionFromTest = async (req, res, next) => {
  try {
    const testId = req.params.id;
    const questionId = req.params.questionId;
    const teacherId = req.user.id;

    await testService.removeQuestionFromTest(testId, questionId, teacherId);

    res.status(200).json({
      message: "Question removed from test successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTest,
  getAllTests,
  getTestById,
  updateTest,
  deleteTest,
  addQuestionsToTest,
  removeQuestionFromTest,
};
