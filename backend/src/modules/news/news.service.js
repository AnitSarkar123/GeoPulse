const logger = require("../../utils/logger");
const { getCache } = require("../../cache/cache.service");
const { queryLLMStructured, queryLLM } = require("../../config/llm");

exports.getGeopoliticalEvents = async () => {
	logger.info("Request received: geopolitics", "news.service");

	const cached = await getCache();

	if (cached) {
		logger.info("Returning cached data", "news.service");
		return cached;
	}

	// No cache available (rare case)
	logger.warn("No cache available yet", "news.service");

	return [];
};

/**
 * Generate geopolitical simulation insights using LLM
 * @param {string} scenario - The "what if" scenario
 * @param {Array} contextEvents - Recent events for context (optional)
 * @returns {Promise<Object>} Simulation result with probability, severity, timeline, etc.
 */
exports.simulateGeopoliticalScenario = async (scenario, contextEvents = []) => {
	try {
		logger.info(`Simulating scenario: ${scenario}`, "news.service");

		const recentEventsContext = contextEvents
			.slice(0, 10)
			.map(e => `- ${e.title} (${e.category}, Severity: ${e.severity || 5}/5)`)
			.join("\n");

		const prompt = `You are a geopolitical analyst. Analyze the following hypothetical scenario and provide structured predictions.

Scenario: ${scenario}

Recent Context (if available):
${recentEventsContext || "No recent events context available"}

Provide a detailed analysis in valid JSON format with the following structure (be precise with numbers):
{
  "summary": "2-3 sentence summary of the potential impact",
  "probability": 0.0 to 1.0 (how likely this scenario is within 6-12 months),
  "severity": 1-10 (overall impact severity on global stability),
  "timeline": "string describing onset (e.g., '1-3 months' or '3-6 months')",
  "chain_reactions": [
    {"step": 1, "event": "description", "category": "conflict|economic|diplomacy|humanitarian", "delay": "timeframe"}
  ],
  "market_impact": {
    "oil": "up|down|stable",
    "gold": "up|down|stable",
    "stocks": "up|down|stable",
    "description": "brief market explanation"
  },
  "affected_regions": [
    {"region": "name", "impact": "high|medium|low", "description": "reason"}
  ]
}`;

		const result = await queryLLMStructured(prompt, {});

		// Validate and sanitize the response
		if (!result.summary) result.summary = "Simulation analysis generated.";
		if (!result.probability) result.probability = 0.5;
		if (!result.severity) result.severity = 5;
		if (!result.timeline) result.timeline = "1-3 months";
		if (!Array.isArray(result.chain_reactions)) result.chain_reactions = [];
		if (!result.market_impact) result.market_impact = { oil: 'stable', gold: 'stable', stocks: 'stable', description: 'Impact unknown' };
		if (!Array.isArray(result.affected_regions)) result.affected_regions = [];

		// Ensure numeric values are in proper ranges
		result.probability = Math.min(1, Math.max(0, Number(result.probability) || 0.5));
		result.severity = Math.min(10, Math.max(1, Number(result.severity) || 5));

		logger.info(`Simulation completed: ${scenario}`, "news.service");
		return result;
	} catch (err) {
		logger.error(`Simulation failed: ${err.message}`, "news.service");
		throw err;
	}
};

/**
 * Ask LLM for intel on a specific country
 * @param {string} country - Country name
 * @param {Array} countryEvents - Events for this country
 * @returns {Promise<Object>} Intel analysis
 */
exports.getCountryIntelligence = async (country, countryEvents = []) => {
	try {
		logger.info(`Fetching intel for: ${country}`, "news.service");

		const eventsContext = countryEvents
			.slice(0, 10)
			.map(e => `- ${e.title} (${e.category})`)
			.join("\n");

		const prompt = `Provide a brief geopolitical intelligence assessment for ${country}.

Recent events:
${eventsContext || "No recent events"}

Provide a concise analysis that includes:
1. Current stability assessment (Stable/Moderate/Unstable)
2. Key risks and opportunities
3. Recommended monitoring areas

Keep it brief and actionable (max 3 sentences per section).`;

		const analysis = await queryLLMStructured(prompt, {});
		logger.info(`Intel analysis completed for: ${country}`, "news.service");
		return analysis;
	} catch (err) {
		logger.error(`Country intel failed: ${err.message}`, "news.service");
		throw err;
	}
};

/**
 * Chat with LLM about geopolitical events
 * @param {string} userMessage - User question or message
 * @param {Array} conversationHistory - Previous conversation messages
 * @param {Array} contextEvents - Recent events for context (optional)
 * @returns {Promise<string>} LLM response
 */
exports.chatWithIntelligence = async (userMessage, conversationHistory = [], contextEvents = []) => {
	try {
		logger.info(`Chat request: ${userMessage.substring(0, 100)}`, "news.service");

		// Build context from recent events
		const eventsContext = contextEvents
			.slice(0, 5)
			.map(e => `- ${e.title} (${e.category}, Severity: ${e.severity}/5, Location: ${e.country})`)
			.join("\n");

		// Format conversation history
		const conversationContext = conversationHistory
			.slice(-6) // Keep last 6 messages to avoid token limit
			.map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
			.join("\n");

		const systemPrompt = `You are an expert geopolitical intelligence analyst with deep knowledge of global politics, conflicts, economics, and diplomacy. 
Your role is to:
1. Answer questions about current geopolitical events
2. Analyze cause-effect relationships
3. Provide risk assessments and strategic insights
4. Explain complex international situations simply
5. Cite relevant events when available

Keep responses concise (2-4 sentences max) unless asked for detailed analysis.
Be analytical but balanced. Avoid speculation beyond available data.`;

		const userPrompt = `Recent Global Events (for context):
${eventsContext || "No recent events available"}

Conversation History:
${conversationContext || "No previous conversation"}

User Message: ${userMessage}

Provide a helpful, analytical response based on the available information.`;

		const response = await queryLLM(userPrompt, { temperature: 0.7 });

		logger.info(`Chat response generated`, "news.service");
		return response;
	} catch (err) {
		logger.error(`Chat failed: ${err.message}`, "news.service");
		throw err;
	}
};
