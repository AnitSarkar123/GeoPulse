require("dotenv").config();
const mongoose = require("mongoose");
const logger = require("../utils/logger");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/geopulse";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    logger.info("MongoDB connected successfully", "db");

    mongoose.connection.on("error", (err) => {
      logger.error(`MongoDB connection error: ${err.message}`, "db");
    });

    mongoose.connection.on("disconnected", () => {
      isConnected = false;
      logger.warn("MongoDB disconnected. Attempting to reconnect…", "db");
    });
  } catch (err) {
    logger.error(`MongoDB connection failed: ${err.message}`, "db");
    // Don't crash the server — features requiring DB will individually handle errors
  }
};

module.exports = { connectDB };
