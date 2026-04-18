const express = require("express");
const router = express.Router();

const logger = require("../utils/logger");

const { getGeopoliticalEvents } = require("../modules/news/news.service");

// ---------- CATEGORY MAPPING ----------
const CATEGORY_MAP = {
	// Armed Conflict
	war: "Armed Conflict",
	attack: "Armed Conflict",
	airstrike: "Armed Conflict",
	battle: "Armed Conflict",
	conflict: "Armed Conflict",
	clash: "Armed Conflict",
	bombing: "Armed Conflict",
	shelling: "Armed Conflict",
	invasion: "Armed Conflict",
	siege: "Armed Conflict",
	insurgency: "Armed Conflict",
	ambush: "Armed Conflict",
	military: "Armed Conflict",
	hostage: "Armed Conflict",

	// Politics
	policy: "Politics",
	legislation: "Politics",
	reform: "Politics",
	law: "Politics",
	election: "Politics",
	coup: "Politics",
	protest: "Politics",
	uprising: "Politics",
	riot: "Politics",
	crackdown: "Politics",
	referendum: "Politics",
	"regime change": "Politics",

	// Diplomacy
	diplomacy: "Diplomacy",
	negotiation: "Diplomacy",
	summit: "Diplomacy",
	treaty: "Diplomacy",
	alliance: "Diplomacy",
	sanction: "Diplomacy & Sanctions",
	embargo: "Diplomacy & Sanctions",
	blockade: "Diplomacy & Sanctions",
	tension: "Diplomacy",
	threat: "Diplomacy",

	// Terrorism & Security
	assassination: "Terrorism & Security",
	espionage: "Terrorism & Security",
	cyberattack: "Terrorism & Security",
	hacking: "Terrorism & Security",
	surveillance: "Terrorism & Security",
	operation: "Terrorism & Security",

	// Humanitarian
	crisis: "Humanitarian",
	humanitarian: "Humanitarian",
	refugee: "Humanitarian",
	displacement: "Humanitarian",
	famine: "Humanitarian",
	evacuation: "Humanitarian",

	// Economic & Trade
	tradewar: "Economic & Trade",
	tariff: "Economic & Trade",
	armsdeal: "Economic & Trade",
};

// Fallback category ordering for display
const CATEGORY_ORDER = [
	"Armed Conflict",
	"Terrorism & Security",
	"Politics",
	"Diplomacy",
	"Diplomacy & Sanctions",
	"Humanitarian",
	"Economic & Trade",
	"Other",
];

const categorizeEvents = (events) => {
	const grouped = {};

	for (const event of events) {
		const category =
			CATEGORY_MAP[event.type] || CATEGORY_MAP[event.event_type] || "Other";

		if (!grouped[category]) {
			grouped[category] = [];
		}

		grouped[category].push(event);
	}

	// Return ordered object
	const result = {};
	for (const cat of CATEGORY_ORDER) {
		if (grouped[cat]) {
			result[cat] = grouped[cat];
		}
	}

	return result;
};

// GET /api/geopolitics
router.get("/geopolitics", async (req, res) => {
	const start = Date.now();

	try {
		logger.info("GET /api/geopolitics", "routes");

		const events = await getGeopoliticalEvents();
		const data = categorizeEvents(events);

		const duration = Date.now() - start;

		logger.info(
			`Response sent (${events.length} events) in ${duration}ms`,
			"routes",
		);

		res.status(200).json({
			success: true,
			count: events.length,
			data,
		});
	} catch (err) {
		logger.error(`Route error: ${err.message}`, "routes");

		res.status(500).json({
			success: false,
			error: "Internal Server Error",
		});
	}
});

// POST /api/simulate
// Run a geopolitical simulation on a "what if" scenario
router.post("/simulate", async (req, res) => {
	const start = Date.now();
	const { scenario } = req.body;

	try {
		if (!scenario || typeof scenario !== 'string' || !scenario.trim()) {
			return res.status(400).json({
				success: false,
				error: "Scenario is required and must be a non-empty string",
			});
		}

		logger.info(`POST /api/simulate: ${scenario.substring(0, 100)}`, "routes");

		const { simulateGeopoliticalScenario } = require("../modules/news/news.service");
		const events = await getGeopoliticalEvents();
		const result = await simulateGeopoliticalScenario(scenario, events);

		const duration = Date.now() - start;
		logger.info(`Simulation completed in ${duration}ms`, "routes");

		res.status(200).json({
			success: true,
			data: result,
		});
	} catch (err) {
		logger.error(`Simulation error: ${err.message}`, "routes");

		res.status(500).json({
			success: false,
			error: "Simulation failed",
			details: process.env.NODE_ENV === 'development' ? err.message : undefined,
		});
	}
});

// POST /api/country-intel
// Get AI-generated intelligence for a specific country
router.post("/country-intel", async (req, res) => {
	const start = Date.now();
	const { country } = req.body;

	try {
		if (!country || typeof country !== 'string' || !country.trim()) {
			return res.status(400).json({
				success: false,
				error: "Country is required and must be a non-empty string",
			});
		}

		logger.info(`POST /api/country-intel: ${country}`, "routes");

		const { getCountryIntelligence } = require("../modules/news/news.service");
		const events = await getGeopoliticalEvents();

		// Flatten events and filter by country
		const flatEvents = [];
		Object.values(events).forEach(category => {
			if (Array.isArray(category)) {
				flatEvents.push(...category);
			}
		});
		const countryEvents = flatEvents.filter(e =>
			e.country && e.country.toLowerCase() === country.toLowerCase()
		);

		const intel = await getCountryIntelligence(country, countryEvents);

		const duration = Date.now() - start;
		logger.info(`Country intel completed in ${duration}ms`, "routes");

		res.status(200).json({
			success: true,
			country,
			intel,
			event_count: countryEvents.length,
		});
	} catch (err) {
		logger.error(`Country intel error: ${err.message}`, "routes");

		res.status(500).json({
			success: false,
			error: "Country intel failed",
			details: process.env.NODE_ENV === 'development' ? err.message : undefined,
		});
	}
});

// POST /api/chat
// Chat with AI intelligence assistant about geopolitical events
router.post("/chat", async (req, res) => {
	const start = Date.now();
	const { message, conversationHistory = [] } = req.body;

	try {
		if (!message || typeof message !== 'string' || !message.trim()) {
			return res.status(400).json({
				success: false,
				error: "Message is required and must be a non-empty string",
			});
		}

		logger.info(`POST /api/chat: ${message.substring(0, 100)}`, "routes");

		const { chatWithIntelligence } = require("../modules/news/news.service");
		const events = await getGeopoliticalEvents();

		// Flatten events for context
		const flatEvents = [];
		Object.values(events).forEach(category => {
			if (Array.isArray(category)) {
				flatEvents.push(...category);
			}
		});

		const response = await chatWithIntelligence(message, conversationHistory, flatEvents);

		const duration = Date.now() - start;
		logger.info(`Chat response sent in ${duration}ms`, "routes");

		res.status(200).json({
			success: true,
			response: response,
		});
	} catch (err) {
		logger.error(`Chat error: ${err.message}`, "routes");

		res.status(500).json({
			success: false,
			error: "Chat request failed",
			details: process.env.NODE_ENV === 'development' ? err.message : undefined,
		});
	}
});

module.exports = router;

