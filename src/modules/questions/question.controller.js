/**
 * Question controller - Handles HTTP requests for question operations
 */
const questionService = require("./question.service");

/**
 * Create a new question
 * @route POST /api/questions
 * @access Private - Teachers only
 */
const createQuestion = async (req, res, next) => {
  try {
    const teacherId = req.user.id;
    const questionData = req.body;

    const question = await questionService.createQuestion(
      questionData,
      teacherId
    );

    res.status(201).json({
      message: "Question created successfully",
      question,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all questions
 * @route GET /api/questions
 * @access Private - Teachers only
 */
const getAllQuestions = async (req, res, next) => {
  try {
    const teacherId = req.user.id;
    const filters = {
      page: req.query.page,
      limit: req.query.limit,
    };

    const result = await questionService.getAllQuestions(teacherId, filters);

    res.status(200).json({
      message: "Questions retrieved successfully",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a specific question by ID
 * @route GET /api/questions/:id
 * @access Private - Teachers only
 */
const getQuestionById = async (req, res, next) => {
  try {
    const questionId = req.params.id;
    const teacherId = req.user.id;

    const question = await questionService.getQuestionById(
      questionId,
      teacherId
    );

    res.status(200).json({
      message: "Question retrieved successfully",
      question,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a question
 * @route PUT /api/questions/:id
 * @access Private - Teachers only
 */
const updateQuestion = async (req, res, next) => {
  try {
    const questionId = req.params.id;
    const teacherId = req.user.id;
    const questionData = req.body;

    const updatedQuestion = await questionService.updateQuestion(
      questionId,
      questionData,
      teacherId
    );

    res.status(200).json({
      message: "Question updated successfully",
      question: updatedQuestion,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a question
 * @route DELETE /api/questions/:id
 * @access Private - Teachers only
 */
const deleteQuestion = async (req, res, next) => {
  try {
    const questionId = req.params.id;
    const teacherId = req.user.id;

    await questionService.deleteQuestion(questionId, teacherId);

    res.status(200).json({
      message: "Question deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
};
