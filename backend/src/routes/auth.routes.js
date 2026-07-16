const express = require("express");
const router = express.Router();
const passport = require("../config/passport");
const jwt = require("jsonwebtoken");
const { generateToken, generateRefreshToken, requireAuth } = require("../middleware/auth.middleware");
const logger = require("../utils/logger");

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

const ACCESS_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 15 * 60 * 1000, // 15 minutes
};

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// ── GET /api/auth/google ──────────────────────────────────────────
// Initiates the Google OAuth flow
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

// ── GET /api/auth/google/callback ─────────────────────────────────
// Google redirects here after user grants permission
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${FRONTEND_URL}?auth=error`,
  }),
  (req, res) => {
    try {
      const token = generateToken(req.user._id);
      const refreshToken = generateRefreshToken(req.user._id);

      // Set JWT in HttpOnly cookies
      res.cookie("geopulse_token", token, ACCESS_COOKIE_OPTIONS);
      res.cookie("geopulse_refresh_token", refreshToken, REFRESH_COOKIE_OPTIONS);

      logger.info(`User logged in: ${req.user.email}`, "auth");

      // Redirect back to frontend with success flag
      res.redirect(`${FRONTEND_URL}?auth=success`);
    } catch (err) {
      logger.error(`Callback error: ${err.message}`, "auth");
      res.redirect(`${FRONTEND_URL}?auth=error`);
    }
  }
);

// ── POST /api/auth/refresh ────────────────────────────────────────
// Rotate access and refresh tokens
router.post("/refresh", (req, res) => {
  const refreshToken = req.cookies.geopulse_refresh_token;
  if (!refreshToken) {
    return res.status(401).json({ success: false, error: "Unauthorized — no refresh token" });
  }

  try {
    const refreshSecret = process.env.JWT_REFRESH_SECRET || "fallback_refresh_secret_change_me";
    const payload = jwt.verify(refreshToken, refreshSecret);

    // Rotate tokens
    const newAccessToken = generateToken(payload.userId);
    const newRefreshToken = generateRefreshToken(payload.userId);

    // Set new cookies
    res.cookie("geopulse_token", newAccessToken, ACCESS_COOKIE_OPTIONS);
    res.cookie("geopulse_refresh_token", newRefreshToken, REFRESH_COOKIE_OPTIONS);

    res.json({ success: true, message: "Tokens refreshed" });
  } catch (err) {
    logger.warn(`Refresh token error: ${err.message}`, "auth");
    // Clear potentially compromised or expired refresh token
    res.clearCookie("geopulse_refresh_token", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return res.status(401).json({ success: false, error: "Unauthorized — invalid refresh token" });
  }
});

// ── GET /api/auth/me ──────────────────────────────────────────────
// Returns the current signed-in user (protected)
router.get("/me", requireAuth, (req, res) => {
  const { _id, name, email, avatar, createdAt } = req.user;
  res.json({
    success: true,
    user: { id: _id, name, email, avatar, createdAt },
  });
});

// ── POST /api/auth/logout ─────────────────────────────────────────
// Clears the auth cookies
router.post("/logout", (req, res) => {
  const clearOptions = {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  };
  
  res.clearCookie("geopulse_token", clearOptions);
  res.clearCookie("geopulse_refresh_token", clearOptions);
  
  res.json({ success: true, message: "Logged out" });
});

module.exports = router;
