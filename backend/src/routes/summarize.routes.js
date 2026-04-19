const express = require("express");
const router = express.Router();
const logger = require("../utils/logger");
const { queryLLM } = require("../config/llm");

/**
 * POST /api/summarize
 * 
 * Summarizes an article using AI
 * 
 * Body: { title: string, description: string }
 * Returns: { success: true, summary: string }
 */
router.post("/", async (req, res) => {
	const { title, description } = req.body;

	// Validation
	if (!title || !description) {
		return res.status(400).json({
			success: false,
			error: "title and description are required",
		});
	}

	try {
		logger.info(`Summarizing article: "${title}"`, "summarize");

		// Create a prompt for the LLM to generate a concise summary
		const prompt = `You are a news summarization expert. Create a brief, concise summary (2-3 sentences max) of the following article.

Title: "${title}"

Description: "${description}"


Summary (brief, factual, 5-10 sentences):
and please don't include * in your response
`;

		const summary = await queryLLM(prompt);

		if (!summary || summary.trim().length === 0) {
			throw new Error("LLM returned empty summary");
		}

		logger.info(`Summary generated successfully`, "summarize");

		res.json({
			success: true,
			summary: summary.trim(),
		});
	} catch (err) {
		logger.error(`Summarization failed: ${err.message}`, "summarize");
		res.status(500).json({
			success: false,
			error: "Failed to generate summary",
			details:
				process.env.NODE_ENV === "development" ? err.message : undefined,
		});
	}
});

module.exports = router;
