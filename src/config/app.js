/**
 * Express application configuration
 */
const express = require("express");
const cors = require("cors");
const routes = require("../routes");
const { errorHandler } = require("../middlewares/error.middleware");

// Initialize express app
const app = express();

// Apply middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api", routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Resource not found" });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
