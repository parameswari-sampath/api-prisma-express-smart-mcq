/**
 * Main application routes
 */
const express = require("express");
const router = express.Router();

// Import route modules
const authRoutes = require("./modules/auth/auth.routes");
const questionRoutes = require("./modules/questions/question.routes");
const testRoutes = require("./modules/tests/test.routes");
const attemptRoutes = require("./modules/attempts/attempt.routes");

// These will be used later as we implement other modules

// Base API routes
router.use("/auth", authRoutes);
router.use("/questions", questionRoutes);
router.use("/tests", testRoutes);
router.use("/attempts", attemptRoutes);

// Simple health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
