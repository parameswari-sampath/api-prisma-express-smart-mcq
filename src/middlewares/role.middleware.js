/**
 * Role-based authorization middleware
 */
const { UserRole } = require("@prisma/client");

/**
 * Create middleware to check if user has required role
 * @param {UserRole[]} roles - Array of allowed roles
 * @returns {Function} - Express middleware function
 */
const authorize = (roles) => {
  return (req, res, next) => {
    // Check if user exists and has a role
    if (!req.user || !req.user.role) {
      return res
        .status(403)
        .json({ message: "Forbidden - Authentication required" });
    }

    // Check if user's role is in the allowed roles array
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden - Required role: ${roles.join(" or ")}`,
      });
    }

    // User has an allowed role
    next();
  };
};

/**
 * Middleware to authorize only teachers
 */
const authorizeTeacher = authorize([UserRole.TEACHER]);

/**
 * Middleware to authorize only students
 */
const authorizeStudent = authorize([UserRole.STUDENT]);

/**
 * Middleware to authorize both teachers and students
 */
const authorizeAny = authorize([UserRole.TEACHER, UserRole.STUDENT]);

module.exports = {
  authorize,
  authorizeTeacher,
  authorizeStudent,
  authorizeAny,
};
