const logger = require("../../utils/logger");
const { queryLLM } = require("../../config/llm");

/**
 * Perspective Filter using LLM
 * Groups search results by different perspectives/stances
 */

const filterPerspectives = async (articles) => {
  if (!articles || articles.length < 2) {
    return {
      success: false,
      message: "Need at least 2 articles to analyze perspectives",
      perspectives: [],
    };
  }

  try {
    logger.info(`Filtering perspectives from ${articles.length} articles`, "perspective.filter");

    const perspectives = [];

    // Extract stance for each article
    for (const article of articles) {
      try {
        const prompt = `Analyze this news article and determine its perspective/stance:

Title: "${article.title}"
Description: "${article.description || ""}"

Classify as: POSITIVE | NEUTRAL | NEGATIVE | CRITICAL
And provide the main angle in 1 sentence.

Format: [STANCE] | [Main angle]`;

        const response = await queryLLM(prompt);
        logger.info(`LLM response for stance: "${response}"`, "perspective.filter");

        let stance = "NEUTRAL";
        let angle = "General coverage";

        const parts = response.split("|");
        if (parts.length >= 2) {
          const stancePart = parts[0].trim().toUpperCase();
          const anglePart = parts[1].trim();

          if (
            stancePart.includes("POSITIVE") ||
            stancePart.includes("SUPPORTIVE")
          ) {
            stance = "POSITIVE";
          } else if (
            stancePart.includes("NEGATIVE") ||
            stancePart.includes("CRITICAL")
          ) {
            stance = "NEGATIVE";
          } else if (stancePart.includes("CRITICAL")) {
            stance = "CRITICAL";
          }

          angle = anglePart.substring(0, 100);
        }

        perspectives.push({
          source: article.source?.name || "Unknown",
          title: article.title,
          stance,
          angle,
          url: article.url,
          publishedAt: article.publishedAt,
          image: article.urlToImage,
        });
      } catch (articleErr) {
        logger.warn(`Failed to analyze article: ${articleErr.message}`, "perspective.filter");
        perspectives.push({
          source: article.source?.name || "Unknown",
          title: article.title,
          stance: "NEUTRAL",
          angle: "Analysis unavailable",
          url: article.url,
          publishedAt: article.publishedAt,
          image: article.urlToImage,
        });
      }
    }

    // Group by stance
    const grouped = {};
    perspectives.forEach((p) => {
      if (!grouped[p.stance]) {
        grouped[p.stance] = [];
      }
      grouped[p.stance].push(p);
    });

    logger.info(`Grouped into ${Object.keys(grouped).length} perspectives`, "perspective.filter");

    // Check if there's diversity
    const stanceCount = Object.keys(grouped).length;
    const hasDiversity = stanceCount >= 2;

    return {
      success: hasDiversity,
      message: hasDiversity
        ? `Found ${stanceCount} different perspectives`
        : "All articles share similar perspective",
      perspectives,
      grouped,
      stanceCount,
      totalArticles: articles.length,
    };
  } catch (err) {
    logger.error(`Perspective filtering error: ${err.message}`, "perspective.filter");
    return {
      success: false,
      message: `Error filtering perspectives: ${err.message}`,
      perspectives: [],
    };
  }
};

exports.filterPerspectives = filterPerspectives;
