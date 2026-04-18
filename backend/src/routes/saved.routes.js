const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/auth.middleware");
const SavedNews = require("../models/SavedNews");
const logger = require("../utils/logger");

// All saved-news routes require authentication
router.use(requireAuth);

// ── GET /api/saved ────────────────────────────────────────────────
// List all saved news for the authenticated user
router.get("/", async (req, res) => {
  try {
    const saved = await SavedNews.find({ userId: req.user._id })
      .sort({ savedAt: -1 })
      .lean();

    res.json({ success: true, count: saved.length, data: saved });
  } catch (err) {
    logger.error(`GET /api/saved error: ${err.message}`, "saved");
    res.status(500).json({ success: false, error: "Failed to fetch saved news" });
  }
});

// ── POST /api/saved ───────────────────────────────────────────────
// Save a news event
router.post("/", async (req, res) => {
  try {
    const { eventId, eventData } = req.body;

    if (!eventId || !eventData) {
      return res.status(400).json({ success: false, error: "eventId and eventData are required" });
    }

    // findOneAndUpdate with upsert avoids duplicate errors gracefully
    const saved = await SavedNews.findOneAndUpdate(
      { userId: req.user._id, eventId },
      { userId: req.user._id, eventId, eventData, savedAt: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    logger.info(`User ${req.user.email} saved event ${eventId}`, "saved");
    res.json({ success: true, data: saved });
  } catch (err) {
    logger.error(`POST /api/saved error: ${err.message}`, "saved");
    res.status(500).json({ success: false, error: "Failed to save news" });
  }
});

// ── DELETE /api/saved/:eventId ────────────────────────────────────
// Remove a saved event
router.delete("/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;

    const result = await SavedNews.findOneAndDelete({
      userId: req.user._id,
      eventId,
    });

    if (!result) {
      return res.status(404).json({ success: false, error: "Saved event not found" });
    }

    logger.info(`User ${req.user.email} removed saved event ${eventId}`, "saved");
    res.json({ success: true, message: "Removed from saved news" });
  } catch (err) {
    logger.error(`DELETE /api/saved error: ${err.message}`, "saved");
    res.status(500).json({ success: false, error: "Failed to remove saved news" });
  }
});

module.exports = router;
