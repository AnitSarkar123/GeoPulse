const express = require("express");
const router = express.Router();
const passport = require("../config/passport");
const { generateToken, requireAuth } = require("../middleware/auth.middleware");
const logger = require("../utils/logger");

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
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

      // Set JWT in HttpOnly cookie
      res.cookie("geopulse_token", token, COOKIE_OPTIONS);

      logger.info(`User logged in: ${req.user.email}`, "auth");

      // Redirect back to frontend with success flag
      res.redirect(`${FRONTEND_URL}?auth=success`);
    } catch (err) {
      logger.error(`Callback error: ${err.message}`, "auth");
      res.redirect(`${FRONTEND_URL}?auth=error`);
    }
  }
);

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
// Clears the auth cookie
router.post("/logout", (req, res) => {
  res.clearCookie("geopulse_token", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.json({ success: true, message: "Logged out" });
});

module.exports = router;
