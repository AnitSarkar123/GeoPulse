const jwt = require("jsonwebtoken");
const User = require("../models/User");
const logger = require("../utils/logger");

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_change_me";

/**
 * requireAuth — JWT middleware.
 * Checks Authorization: Bearer <token>  OR  geopulse_token cookie.
 */
const requireAuth = async (req, res, next) => {
  try {
    // 1) Try Authorization header
    let token = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 2) Fallback to cookie
    if (!token && req.cookies && req.cookies.geopulse_token) {
      token = req.cookies.geopulse_token;
    }

    if (!token) {
      return res.status(401).json({ success: false, error: "Unauthorized — no token" });
    }

    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.userId).select("-__v");

    if (!user) {
      return res.status(401).json({ success: false, error: "Unauthorized — user not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    logger.warn(`Auth middleware error: ${err.message}`, "auth");
    return res.status(401).json({ success: false, error: "Unauthorized — invalid token" });
  }
};

const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "15m" });
};

const generateRefreshToken = (userId) => {
  const refreshSecret = process.env.JWT_REFRESH_SECRET || "fallback_refresh_secret_change_me";
  return jwt.sign({ userId }, refreshSecret, { expiresIn: "7d" });
};

module.exports = { requireAuth, generateToken, generateRefreshToken };
