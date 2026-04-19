const express = require("express");
const router = express.Router();
const narrativeService = require("../modules/narrative/narrative.service");
const logger = require("../utils/logger");

/**
 * POST /api/narrative/conflicts
 * Detects conflicting narratives about a topic
 */
router.post("/conflicts", async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Query is required",
      });
    }

    logger.info(`Narrative conflict detection request: "${query}"`, "narrative.routes");

    const result = await narrativeService.detectConflictingNarratives(query);

    logger.info(
      `Narrative detection response: ${result.conflicts?.length || 0} conflicts found`,
      "narrative.routes"
    );

    res.json(result);
  } catch (err) {
    logger.error(`Narrative route error: ${err.message}`, "narrative.routes");
    res.status(500).json({
      success: false,
      message: "Error processing narrative detection request",
      error: err.message,
    });
  }
});

module.exports = router;
