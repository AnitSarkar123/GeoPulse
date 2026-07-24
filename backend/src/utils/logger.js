const winston = require("winston");
const path = require("path");

// Define custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ level, message, timestamp, context, stack }) => {
    const ctxString = context ? ` [${context}]` : "";
    return `${timestamp} ${level}${ctxString}: ${message}${stack ? "\n" + stack : ""}`;
  })
);

// Create the logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: logFormat,
  transports: [
    // Write all logs with importance level of `error` or less to `error.log`
    new winston.transports.File({ 
      filename: path.join(__dirname, "../../logs/error.log"), 
      level: "error" 
    }),
    // Write all logs with importance level of `info` or less to `combined.log`
    new winston.transports.File({ 
      filename: path.join(__dirname, "../../logs/combined.log") 
    }),
  ],
});

// If we're not in production then log to the `console` with custom format
if (process.env.NODE_ENV !== "production") {
  logger.add(new winston.transports.Console({
    format: consoleFormat,
  }));
}

// Wrapper to maintain backward compatibility with existing code
module.exports = {
  info: (msg, ctx) => logger.info(msg, { context: ctx }),
  warn: (msg, ctx) => logger.warn(msg, { context: ctx }),
  error: (msg, ctx) => logger.error(msg, { context: ctx }),
  debug: (msg, ctx) => logger.debug(msg, { context: ctx }),
  logger // Export raw winston logger if needed
};
