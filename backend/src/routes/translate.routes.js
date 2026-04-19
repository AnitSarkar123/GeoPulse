const express = require("express");
const router = express.Router();
const logger = require("../utils/logger");

/**
 * POST /api/translate
 *
 * Body: { texts: string[], to: string, from?: string }
 *
 * Uses MyMemory API (free, no auth needed)
 * Translates each text individually
 *
 * Returns: { success: true, translations: string[] }
 */
router.post("/", async (req, res) => {
	const { texts, to, from = "en" } = req.body;

	// ── Validation ──────────────────────────────────────────
	if (!texts || !Array.isArray(texts) || texts.length === 0) {
		return res.status(400).json({
			success: false,
			error: "texts must be a non-empty array of strings",
		});
	}
	if (!to || typeof to !== "string") {
		return res.status(400).json({
			success: false,
			error: "to (target language code) is required",
		});
	}

	try {
		logger.info(
			`Translating ${texts.length} text(s) via MyMemory → ${to}`,
			"translate",
		);

		const translations = [];

		// Translate each text individually using MyMemory API
		for (const text of texts) {
			try {
				// Encode the text for URL
				const encodedText = encodeURIComponent(text);
				const url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=${from}|${to}`;

				const response = await fetch(url, {
					method: "GET",
					headers: {
						"User-Agent": "World-Monitor/1.0",
					},
				});

				if (!response.ok) {
					logger.warn(`MyMemory returned ${response.status}`, "translate");
					translations.push(text);
					continue;
				}

				const data = await response.json();

				// MyMemory returns: { responseData: { translatedText: "..." }, responseStatus: 200 }
				if (data.responseStatus === 200 && data.responseData?.translatedText) {
					translations.push(data.responseData.translatedText);
				} else {
					logger.warn(
						`MyMemory error or no translation: ${JSON.stringify(data)}`,
						"translate",
					);
					translations.push(text);
				}
			} catch (textError) {
				logger.warn(`Error translating text: ${textError.message}`, "translate");
				translations.push(text);
			}
		}

		logger.info(
			`Translation complete (${translations.length} segments)`,
			"translate",
		);

		res.json({ success: true, translations });
	} catch (err) {
		logger.error(`Translation failed: ${err.message}`, "translate");
		res.status(500).json({
			success: false,
			error: "Translation failed",
			details:
				process.env.NODE_ENV === "development" ? err.message : undefined,
		});
	}
});

module.exports = router;
