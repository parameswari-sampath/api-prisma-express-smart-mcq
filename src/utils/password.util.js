/**
 * Utility for password hashing and comparison
 */
const bcrypt = require("bcryptjs");

// Number of salt rounds for password hashing
const SALT_ROUNDS = 10;

/**
 * Hash a plain text password
 * @param {string} password - The plain text password to hash
 * @returns {Promise<string>} - Hashed password
 */
const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare a plain text password with a hashed password
 * @param {string} password - Plain text password
 * @param {string} hashedPassword - Hashed password to compare against
 * @returns {Promise<boolean>} - True if passwords match, false otherwise
 */
const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

module.exports = {
  hashPassword,
  verifyPassword,
};
