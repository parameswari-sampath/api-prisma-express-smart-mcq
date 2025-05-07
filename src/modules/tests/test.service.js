/**
 * Test service - Business logic for test operations
 */
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Create a new test
 * @param {Object} testData - Test data
 * @param {number} teacherId - ID of the teacher creating the test
 * @returns {Object} - Created test
 */
const createTest = async (testData, teacherId) => {
  const { title, description, duration, questionIds } = testData;

  // Create the test
  const test = await prisma.test.create({
    data: {
      title,
      description,
      duration,
      createdById: teacherId,
    },
  });

  // Add questions to the test if questionIds are provided
  if (questionIds && questionIds.length > 0) {
    await addQuestionsToTest(test.id, questionIds, teacherId);
  }

  // Return the created test with its questions
  return getTestById(test.id, teacherId);
};

/**
 * Get all tests created by a teacher
 * @param {number} teacherId - ID of the teacher
 * @param {Object} filters - Filter parameters (optional)
 * @returns {Array} - List of tests
 */
const getAllTests = async (teacherId, filters = {}) => {
  // Default pagination values
  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 10;
  const skip = (page - 1) * limit;

  // Get total count for pagination
  const totalCount = await prisma.test.count({
    where: {
      createdById: teacherId,
    },
  });

  // Get tests with pagination
  const tests = await prisma.test.findMany({
    where: {
      createdById: teacherId,
    },
    include: {
      testQuestions: {
        include: {
          question: true,
        },
        orderBy: {
          order: "asc",
        },
      },
      _count: {
        select: {
          testQuestions: true,
        },
      },
    },
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
  });

  // Transform tests to include question count
  const formattedTests = tests.map((test) => ({
    id: test.id,
    title: test.title,
    description: test.description,
    duration: test.duration,
    questionCount: test._count.testQuestions,
    createdAt: test.createdAt,
    updatedAt: test.updatedAt,
  }));

  return {
    data: formattedTests,
    meta: {
      total: totalCount,
      page,
      limit,
      pages: Math.ceil(totalCount / limit),
    },
  };
};

/**
 * Get a specific test by ID
 * @param {number} testId - ID of the test
 * @param {number} teacherId - ID of the teacher
 * @returns {Object} - Test details
 */
const getTestById = async (testId, teacherId) => {
  const test = await prisma.test.findFirst({
    where: {
      id: parseInt(testId),
      createdById: teacherId,
    },
    include: {
      testQuestions: {
        include: {
          question: true,
        },
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  if (!test) {
    const error = new Error("Test not found");
    error.statusCode = 404;
    throw error;
  }

  // Transform the test to include questions in a more usable format
  const formattedTest = {
    id: test.id,
    title: test.title,
    description: test.description,
    duration: test.duration,
    createdAt: test.createdAt,
    updatedAt: test.updatedAt,
    questions: test.testQuestions.map((tq) => ({
      id: tq.question.id,
      text: tq.question.text,
      optionA: tq.question.optionA,
      optionB: tq.question.optionB,
      optionC: tq.question.optionC,
      optionD: tq.question.optionD,
      correctAnswer: tq.question.correctAnswer,
      order: tq.order,
    })),
  };

  return formattedTest;
};

/**
 * Update a test
 * @param {number} testId - ID of the test
 * @param {Object} testData - Updated test data
 * @param {number} teacherId - ID of the teacher
 * @returns {Object} - Updated test
 */
const updateTest = async (testId, testData, teacherId) => {
  // Check if test exists and belongs to the teacher
  await getTestById(testId, teacherId);

  // Update the test
  const updatedTest = await prisma.test.update({
    where: {
      id: parseInt(testId),
    },
    data: {
      title: testData.title,
      description: testData.description,
      duration: testData.duration,
    },
  });

  // Return the updated test with its questions
  return getTestById(updatedTest.id, teacherId);
};

/**
 * Delete a test
 * @param {number} testId - ID of the test
 * @param {number} teacherId - ID of the teacher
 * @returns {Object} - Deleted test
 */
const deleteTest = async (testId, teacherId) => {
  // Check if test exists and belongs to the teacher
  await getTestById(testId, teacherId);

  // Delete the test (cascade will delete related testQuestions)
  const deletedTest = await prisma.test.delete({
    where: {
      id: parseInt(testId),
    },
  });

  return deletedTest;
};

/**
 * Add questions to a test
 * @param {number} testId - ID of the test
 * @param {Array} questionIds - Array of question IDs to add
 * @param {number} teacherId - ID of the teacher
 * @returns {Object} - Updated test
 */
const addQuestionsToTest = async (testId, questionIds, teacherId) => {
  // Check if test exists and belongs to the teacher
  await getTestById(testId, teacherId);

  // Get current question count for ordering
  const currentQuestionsCount = await prisma.testQuestion.count({
    where: {
      testId: parseInt(testId),
    },
  });

  // Validate that all questions exist and belong to the teacher
  const questions = await prisma.question.findMany({
    where: {
      id: { in: questionIds.map((id) => parseInt(id)) },
      createdById: teacherId,
    },
  });

  if (questions.length !== questionIds.length) {
    const error = new Error(
      "One or more questions not found or not owned by you"
    );
    error.statusCode = 404;
    throw error;
  }

  // Check for questions that are already in the test
  const existingQuestions = await prisma.testQuestion.findMany({
    where: {
      testId: parseInt(testId),
      questionId: { in: questionIds.map((id) => parseInt(id)) },
    },
  });

  // Filter out questions that are already in the test
  const newQuestionIds = questionIds
    .map((id) => parseInt(id))
    .filter((id) => !existingQuestions.some((eq) => eq.questionId === id));

  // Add new questions to the test
  if (newQuestionIds.length > 0) {
    await prisma.$transaction(
      newQuestionIds.map((questionId, index) =>
        prisma.testQuestion.create({
          data: {
            testId: parseInt(testId),
            questionId,
            order: currentQuestionsCount + index + 1,
          },
        })
      )
    );
  }

  // Return the updated test
  return getTestById(testId, teacherId);
};

/**
 * Remove a question from a test
 * @param {number} testId - ID of the test
 * @param {number} questionId - ID of the question to remove
 * @param {number} teacherId - ID of the teacher
 * @returns {Object} - Updated test
 */
const removeQuestionFromTest = async (testId, questionId, teacherId) => {
  // Check if test exists and belongs to the teacher
  await getTestById(testId, teacherId);

  // Check if the question is in the test
  const testQuestion = await prisma.testQuestion.findFirst({
    where: {
      testId: parseInt(testId),
      questionId: parseInt(questionId),
    },
  });

  if (!testQuestion) {
    const error = new Error("Question not found in this test");
    error.statusCode = 404;
    throw error;
  }

  // Remove the question from the test
  await prisma.testQuestion.delete({
    where: {
      id: testQuestion.id,
    },
  });

  // Reorder remaining questions
  const remainingQuestions = await prisma.testQuestion.findMany({
    where: {
      testId: parseInt(testId),
    },
    orderBy: {
      order: "asc",
    },
  });

  // Update order of remaining questions
  if (remainingQuestions.length > 0) {
    await prisma.$transaction(
      remainingQuestions.map((tq, index) =>
        prisma.testQuestion.update({
          where: {
            id: tq.id,
          },
          data: {
            order: index + 1,
          },
        })
      )
    );
  }

  // Return the updated test
  return getTestById(testId, teacherId);
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
