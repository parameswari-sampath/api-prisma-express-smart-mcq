/**
 * Question service - Business logic for question operations
 */
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Create a new question
 * @param {Object} questionData - Question data
 * @param {number} teacherId - ID of the teacher creating the question
 * @returns {Object} - Created question
 */
const createQuestion = async (questionData, teacherId) => {
  const { text, optionA, optionB, optionC, optionD, correctAnswer } =
    questionData;

  // Validate correct answer is one of the allowed options
  const validAnswers = ["A", "B", "C", "D"];
  if (!validAnswers.includes(correctAnswer)) {
    const error = new Error("Correct answer must be one of: A, B, C, D");
    error.statusCode = 400;
    throw error;
  }

  const question = await prisma.question.create({
    data: {
      text,
      optionA,
      optionB,
      optionC,
      optionD,
      correctAnswer,
      createdById: teacherId,
    },
  });

  return question;
};

/**
 * Get all questions created by a teacher
 * @param {number} teacherId - ID of the teacher
 * @param {Object} filters - Filter parameters (optional)
 * @returns {Array} - List of questions
 */
const getAllQuestions = async (teacherId, filters = {}) => {
  // Default pagination values
  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 10;
  const skip = (page - 1) * limit;

  // Get total count for pagination
  const totalCount = await prisma.question.count({
    where: {
      createdById: teacherId,
    },
  });

  // Get questions with pagination
  const questions = await prisma.question.findMany({
    where: {
      createdById: teacherId,
    },
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    data: questions,
    meta: {
      total: totalCount,
      page,
      limit,
      pages: Math.ceil(totalCount / limit),
    },
  };
};

/**
 * Get a specific question by ID
 * @param {number} questionId - ID of the question
 * @param {number} teacherId - ID of the teacher
 * @returns {Object} - Question details
 */
const getQuestionById = async (questionId, teacherId) => {
  const question = await prisma.question.findFirst({
    where: {
      id: parseInt(questionId),
      createdById: teacherId,
    },
  });

  if (!question) {
    const error = new Error("Question not found");
    error.statusCode = 404;
    throw error;
  }

  return question;
};

/**
 * Update a question
 * @param {number} questionId - ID of the question
 * @param {Object} questionData - Updated question data
 * @param {number} teacherId - ID of the teacher
 * @returns {Object} - Updated question
 */
const updateQuestion = async (questionId, questionData, teacherId) => {
  // Check if question exists and belongs to the teacher
  await getQuestionById(questionId, teacherId);

  // Validate correct answer if provided
  if (questionData.correctAnswer) {
    const validAnswers = ["A", "B", "C", "D"];
    if (!validAnswers.includes(questionData.correctAnswer)) {
      const error = new Error("Correct answer must be one of: A, B, C, D");
      error.statusCode = 400;
      throw error;
    }
  }

  // Update the question
  const updatedQuestion = await prisma.question.update({
    where: {
      id: parseInt(questionId),
    },
    data: questionData,
  });

  return updatedQuestion;
};

/**
 * Delete a question
 * @param {number} questionId - ID of the question
 * @param {number} teacherId - ID of the teacher
 * @returns {Object} - Deleted question
 */
const deleteQuestion = async (questionId, teacherId) => {
  // Check if question exists and belongs to the teacher
  await getQuestionById(questionId, teacherId);

  // Delete the question
  const deletedQuestion = await prisma.question.delete({
    where: {
      id: parseInt(questionId),
    },
  });

  return deletedQuestion;
};

module.exports = {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
};
