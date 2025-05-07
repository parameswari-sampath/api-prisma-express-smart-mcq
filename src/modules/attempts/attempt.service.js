/**
 * Test attempt service - Business logic for test attempt operations
 */
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Start a new test attempt
 * @param {number} testId - ID of the test to attempt
 * @param {number} studentId - ID of the student
 * @returns {Object} - Created attempt
 */
const startAttempt = async (testId, studentId) => {
  // Check if test exists
  const test = await prisma.test.findUnique({
    where: {
      id: parseInt(testId),
    },
  });

  if (!test) {
    const error = new Error("Test not found");
    error.statusCode = 404;
    throw error;
  }

  // Check if student already has an active attempt for this test
  const existingAttempt = await prisma.testAttempt.findFirst({
    where: {
      testId: parseInt(testId),
      studentId: studentId,
      submittedAt: null,
    },
  });

  if (existingAttempt) {
    return getAttemptById(existingAttempt.id, studentId);
  }

  // Create new attempt
  const attempt = await prisma.testAttempt.create({
    data: {
      testId: parseInt(testId),
      studentId: studentId,
    },
  });

  // Return the created attempt with its questions
  return getAttemptById(attempt.id, studentId);
};

/**
 * Get all test attempts for a student
 * @param {number} studentId - ID of the student
 * @param {Object} filters - Filter parameters (optional)
 * @returns {Array} - List of attempts
 */
const getStudentAttempts = async (studentId, filters = {}) => {
  // Default pagination values
  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 10;
  const skip = (page - 1) * limit;

  // Get total count for pagination
  const totalCount = await prisma.testAttempt.count({
    where: {
      studentId: studentId,
    },
  });

  // Get attempts with pagination
  const attempts = await prisma.testAttempt.findMany({
    where: {
      studentId: studentId,
    },
    include: {
      test: {
        select: {
          id: true,
          title: true,
          description: true,
          duration: true,
        },
      },
      _count: {
        select: {
          answers: true,
        },
      },
    },
    skip,
    take: limit,
    orderBy: {
      startedAt: "desc",
    },
  });

  // Format the attempts
  const formattedAttempts = attempts.map((attempt) => ({
    id: attempt.id,
    testId: attempt.testId,
    testTitle: attempt.test.title,
    testDescription: attempt.test.description,
    duration: attempt.test.duration,
    startedAt: attempt.startedAt,
    submittedAt: attempt.submittedAt,
    score: attempt.score,
    answeredQuestions: attempt._count.answers,
    status: attempt.submittedAt ? "Completed" : "In Progress",
  }));

  return {
    data: formattedAttempts,
    meta: {
      total: totalCount,
      page,
      limit,
      pages: Math.ceil(totalCount / limit),
    },
  };
};

/**
 * Get a specific test attempt by ID
 * @param {number} attemptId - ID of the attempt
 * @param {number} studentId - ID of the student
 * @returns {Object} - Attempt details
 */
const getAttemptById = async (attemptId, studentId) => {
  const attempt = await prisma.testAttempt.findFirst({
    where: {
      id: parseInt(attemptId),
      studentId: studentId,
    },
    include: {
      test: {
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
      },
      answers: true,
    },
  });

  if (!attempt) {
    const error = new Error("Test attempt not found");
    error.statusCode = 404;
    throw error;
  }

  // Calculate time remaining if not submitted yet
  let timeRemaining = null;
  if (!attempt.submittedAt) {
    const startTime = new Date(attempt.startedAt).getTime();
    const endTime = startTime + attempt.test.duration * 60 * 1000;
    const currentTime = new Date().getTime();
    timeRemaining = Math.max(0, Math.floor((endTime - currentTime) / 1000));
  }

  // Format questions and answers
  const questions = attempt.test.testQuestions.map((tq) => {
    const answer = attempt.answers.find((a) => a.questionId === tq.questionId);

    // Only include the correct answer if the attempt is submitted
    const questionData = {
      id: tq.question.id,
      text: tq.question.text,
      optionA: tq.question.optionA,
      optionB: tq.question.optionB,
      optionC: tq.question.optionC,
      optionD: tq.question.optionD,
      order: tq.order,
      selectedOption: answer ? answer.selectedOption : null,
    };

    // Only add correctAnswer and isCorrect if the attempt is submitted
    if (attempt.submittedAt) {
      questionData.correctAnswer = tq.question.correctAnswer;
      questionData.isCorrect = answer ? answer.isCorrect : false;
    }

    return questionData;
  });

  // Format the response
  const formattedAttempt = {
    id: attempt.id,
    test: {
      id: attempt.test.id,
      title: attempt.test.title,
      description: attempt.test.description,
      duration: attempt.test.duration,
    },
    startedAt: attempt.startedAt,
    submittedAt: attempt.submittedAt,
    score: attempt.score,
    totalQuestions: questions.length,
    answeredQuestions: attempt.answers.length,
    timeRemaining: timeRemaining,
    status: attempt.submittedAt ? "Completed" : "In Progress",
    questions: questions,
  };

  return formattedAttempt;
};

/**
 * Save an answer for a question in a test attempt
 * @param {number} attemptId - ID of the test attempt
 * @param {number} questionId - ID of the question
 * @param {string} selectedOption - Selected option (A, B, C, or D)
 * @param {number} studentId - ID of the student
 * @returns {Object} - Saved answer
 */
const saveAnswer = async (attemptId, questionId, selectedOption, studentId) => {
  // Check if attempt exists and belongs to student
  const attempt = await prisma.testAttempt.findFirst({
    where: {
      id: parseInt(attemptId),
      studentId: studentId,
    },
  });

  if (!attempt) {
    const error = new Error("Test attempt not found");
    error.statusCode = 404;
    throw error;
  }

  // Check if attempt is already submitted
  if (attempt.submittedAt) {
    const error = new Error("Cannot modify answers for a submitted test");
    error.statusCode = 400;
    throw error;
  }

  // Check if the question exists in the test
  const testQuestion = await prisma.testQuestion.findFirst({
    where: {
      testId: attempt.testId,
      questionId: parseInt(questionId),
    },
  });

  if (!testQuestion) {
    const error = new Error("Question not found in this test");
    error.statusCode = 404;
    throw error;
  }

  // Save or update the answer
  const answer = await prisma.studentAnswer.upsert({
    where: {
      testAttemptId_questionId: {
        testAttemptId: parseInt(attemptId),
        questionId: parseInt(questionId),
      },
    },
    update: {
      selectedOption: selectedOption,
    },
    create: {
      testAttemptId: parseInt(attemptId),
      questionId: parseInt(questionId),
      selectedOption: selectedOption,
    },
  });

  return answer;
};

/**
 * Submit the entire test attempt
 * @param {number} attemptId - ID of the test attempt
 * @param {Array} answers - Array of answers (optional)
 * @param {number} studentId - ID of the student
 * @returns {Object} - Submitted attempt with results
 */
const submitAttempt = async (attemptId, answers = [], studentId) => {
  // Check if attempt exists and belongs to student
  const attempt = await prisma.testAttempt.findFirst({
    where: {
      id: parseInt(attemptId),
      studentId: studentId,
    },
    include: {
      test: {
        include: {
          testQuestions: {
            include: {
              question: true,
            },
          },
        },
      },
    },
  });

  if (!attempt) {
    const error = new Error("Test attempt not found");
    error.statusCode = 404;
    throw error;
  }

  // Check if attempt is already submitted
  if (attempt.submittedAt) {
    const error = new Error("Test is already submitted");
    error.statusCode = 400;
    throw error;
  }

  // Process any new answers that were provided
  if (answers && answers.length > 0) {
    for (const answerData of answers) {
      await saveAnswer(
        attemptId,
        answerData.questionId,
        answerData.selectedOption,
        studentId
      );
    }
  }

  // Get all questions and answers
  const questions = attempt.test.testQuestions;
  const studentAnswers = await prisma.studentAnswer.findMany({
    where: {
      testAttemptId: parseInt(attemptId),
    },
  });

  // Calculate score and mark correct/incorrect answers
  let correctAnswers = 0;
  const updatedAnswers = [];

  for (const question of questions) {
    const answer = studentAnswers.find(
      (a) => a.questionId === question.questionId
    );

    if (answer) {
      const isCorrect =
        answer.selectedOption === question.question.correctAnswer;
      if (isCorrect) correctAnswers++;

      updatedAnswers.push(
        prisma.studentAnswer.update({
          where: { id: answer.id },
          data: { isCorrect: isCorrect },
        })
      );
    }
  }

  // Calculate percentage score
  const totalQuestions = questions.length;
  const score = Math.round((correctAnswers / totalQuestions) * 100);

  // Update answers to mark correct/incorrect
  await prisma.$transaction(updatedAnswers);

  // Update the attempt with submission time and score
  const submittedAttempt = await prisma.testAttempt.update({
    where: {
      id: parseInt(attemptId),
    },
    data: {
      submittedAt: new Date(),
      score: score,
    },
  });

  // Return the result
  return {
    id: submittedAttempt.id,
    score: score,
    totalQuestions: totalQuestions,
    correctAnswers: correctAnswers,
    submittedAt: submittedAttempt.submittedAt,
    detailed: await getAttemptById(attemptId, studentId),
  };
};

module.exports = {
  startAttempt,
  getStudentAttempts,
  getAttemptById,
  saveAnswer,
  submitAttempt,
};
