/**
 * Main application entry point
 */
require("dotenv").config();
const app = require("./config/app");
const { connectDatabase } = require("./config/database");

// Set default port
const PORT = process.env.PORT || 3000;

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();

    // Start express server
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🚀 API is available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error("❌ Server startup error:", error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (error) => {
  console.error("❌ Unhandled Rejection:", error);
  process.exit(1);
});

// Start the server
startServer();
