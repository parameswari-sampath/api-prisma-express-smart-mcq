/**
 * Authentication service
 */
const { PrismaClient } = require("@prisma/client");
const { hashPassword, verifyPassword } = require("../../utils/password.util");
const { generateToken } = require("../../utils/jwt.util");

const prisma = new PrismaClient();

/**
 * Register a new user
 * @param {Object} userData - User data for registration
 * @returns {Object} - Registered user (without password) and JWT token
 */
const register = async (userData) => {
  const { email, password, name, role } = userData;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    const error = new Error("User with this email already exists");
    error.statusCode = 409;
    throw error;
  }

  // Hash the password
  const hashedPassword = await hashPassword(password);

  // Create the user
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role,
    },
  });

  // Generate JWT token
  const token = generateToken({ userId: newUser.id, role: newUser.role });

  // Remove password from response
  const { password: _, ...userWithoutPassword } = newUser;

  return {
    user: userWithoutPassword,
    token,
  };
};

/**
 * Login a user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Object} - User data (without password) and JWT token
 */
const login = async (email, password) => {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  // Verify password
  const isPasswordValid = await verifyPassword(password, user.password);
  if (!isPasswordValid) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  // Generate JWT token
  const token = generateToken({ userId: user.id, role: user.role });

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token,
  };
};

/**
 * Get current user profile
 * @param {number} userId - ID of the user
 * @returns {Object} - User data (without password)
 */
const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;

  return userWithoutPassword;
};

module.exports = {
  register,
  login,
  getProfile,
};
