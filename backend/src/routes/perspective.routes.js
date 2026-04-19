const express = require("express");
const router = express.Router();
const { filterPerspectives } = require("../modules/news/perspective.filter");
const logger = require("../utils/logger");

/**
 * POST /api/perspectives/filter
 * Analyzes articles and groups them by perspectives
 */
router.post("/filter", async (req, res) => {
  try {
    const { articles } = req.body;

    if (!articles || !Array.isArray(articles) || articles.length < 2) {
      return res.status(400).json({
        success: false,
        message: "At least 2 articles are required",
      });
    }

    logger.info(
      `Perspective filter request for ${articles.length} articles`,
      "perspective.routes"
    );

    const result = await filterPerspectives(articles);

    logger.info(
      `Perspective filter response: ${result.stanceCount} different stances found`,
      "perspective.routes"
    );

    res.json(result);
  } catch (err) {
    logger.error(`Perspective route error: ${err.message}`, "perspective.routes");
    res.status(500).json({
      success: false,
      message: "Error filtering perspectives",
      error: err.message,
    });
  }
});

module.exports = router;
