const express = require("express");
const logger = require("../utils/logger");
const { searchNews } = require("../modules/search/search.service");

const router = express.Router();

/**
 * POST /api/search
 * Search for news relevant to geopolitical events
 */
router.post("/", async (req, res) => {
	try {
		const { query } = req.body;

		if (!query || query.trim().length === 0) {
			return res.status(400).json({
				success: false,
				message: "Search query is required",
			});
		}

		logger.info(`Search endpoint called with query: "${query}"`, "search.routes");

		const results = await searchNews(query);
		
		logger.info(`Search results: success=${results.success}, reason=${results.reason || 'N/A'}`, "search.routes");
		logger.info(`Full response: ${JSON.stringify(results, null, 2)}`, "search.routes");

		return res.status(results.success ? 200 : 400).json(results);
	} catch (err) {
		logger.error(`Search route error: ${err.message}`, "search.routes");
		logger.error(`Error stack: ${err.stack}`, "search.routes");
		return res.status(500).json({
			success: false,
			message: "Search failed",
			reason: `Backend error: ${err.message}`,
			error: err.message,
		});
	}
});

module.exports = router;
