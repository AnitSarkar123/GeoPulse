const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  logger.error(`Error processing ${req.method} ${req.originalUrl}: ${err.message}`, "app");

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || "Internal Server Error",
      stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
    },
  });
};

const notFoundHandler = (req, res, next) => {
  logger.warn(`Route not found: ${req.originalUrl}`, "app");
  res.status(404).json({
    success: false,
    error: {
      message: `Not Found - ${req.originalUrl}`
    }
  });
};

module.exports = {
  errorHandler,
  notFoundHandler
};
