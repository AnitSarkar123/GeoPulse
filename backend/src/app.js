require("dotenv").config();
const express      = require("express");
const cors         = require("cors");
const helmet       = require("helmet");
const morgan       = require("morgan");
const cookieParser = require("cookie-parser");
const passport     = require("./config/passport");

const logger       = require("./utils/logger");
const { connectDB } = require("./config/db");

// Routes
const newsRoutes      = require("./routes/news.routes");
const searchRoutes    = require("./routes/search.routes");
const assistantRoutes = require("./routes/assistant.routes");
const authRoutes      = require("./routes/auth.routes");
const savedRoutes     = require("./routes/saved.routes");
const translateRoutes = require("./routes/translate.routes");
const summarizeRoutes = require("./routes/summarize.routes");
const financeRoutes   = require("./routes/finance.routes");
const narrativeRoutes = require("./routes/narrative.routes");
const perspectiveRoutes = require("./routes/perspective.routes");
const setupSwagger = require('./config/swagger');

const app = express();

// Initialize Swagger docs
setupSwagger(app);

// ---------- DATABASE ----------
connectDB();

// ---------- MIDDLEWARE ----------
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// HTTP request logging → pipe into your logger
app.use(
  morgan("dev", {
    stream: {
      write: (message) => {
        logger.info(message.trim(), "http");
      }
    }
  })
);

// ---------- ROUTES ----------

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Server is running",
    timestamp: new Date().toISOString()
  });
});

// Main API
app.use("/api", newsRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/translate", translateRoutes);
app.use("/api/summarize", summarizeRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/narrative", narrativeRoutes);
app.use("/api/perspectives", perspectiveRoutes);
app.use("/api/assistant", assistantRoutes);

// Auth & Saved News routes
app.use("/api/auth", authRoutes);
app.use("/api/saved", savedRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Geopolitical Intelligence Backend Running 🚀");
});

// ---------- 404 HANDLER ----------
app.use((req, res) => {
  logger.warn(`Route not found: ${req.originalUrl}`, "app");

  res.status(404).json({
    success: false,
    error: "Route not found"
  });
});

// ---------- GLOBAL ERROR HANDLER ----------
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`, "app");

  res.status(500).json({
    success: false,
    error: "Internal Server Error"
  });
});

module.exports = app;