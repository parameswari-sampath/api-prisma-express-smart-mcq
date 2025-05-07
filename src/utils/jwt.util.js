/**
 * Utility for JWT generation and verification
 */
const jwt = require("jsonwebtoken");
require("dotenv").config();

// JWT Secret Key from environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
// Default token expiration: 24 hours
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

/**
 * Generate a JWT token for a user
 * @param {Object} payload - User data to embed in token
 * @returns {string} - JWT token
 */
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

/**
 * Verify a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object|null} - Decoded token payload or null if invalid
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
