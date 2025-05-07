/**
 * Error handling middleware
 */
const { validationResult } = require("express-validator");

/**
 * Middleware to handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  next();
};

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Handle Prisma specific errors
  if (err.code === "P2002") {
    return res.status(409).json({
      message: "Resource already exists",
      detail: `A resource with this ${err.meta?.target} already exists`,
    });
  }

  // Default error response
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  res.status(statusCode).json({ message });
};

module.exports = {
  handleValidationErrors,
  errorHandler,
};
