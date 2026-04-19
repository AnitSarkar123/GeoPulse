const logger = require("../../utils/logger");
const { queryLLM } = require("../../config/llm");
const newsApiFetcher = require("../news/sources/newsapi/fetcher");

const ALLOWED_TYPES = [
  "politics",
  "conflict",
  "diplomacy",
  "sanctions & trade",
  "economic",
  "humanitarian",
  "armed conflict",
  "hostage",
  "terrorism",
  "cyber",
  "natural disaster",
  "migration",
    "cryptocurrency",
  "crypto news",
  "stock market tips",
  "crypto giveaway",
  "nft",
  "bitcoin",
  "ethereum",
  "stock price",
  "stock market",
  "trading",
  "forex",
  "financial tips",
  // Armed conflict
	"airstrike",
	"attack",
	"battle",
	"conflict",
	"military",
	"war",
	"clash",
	"bombing",
	"shelling",
	"invasion",
	"siege",
	"insurgency",
	"assassination",
	"ambush",
	"hostage",

	// Geopolitics & diplomacy
	"sanction",
	"diplomacy",
	"negotiation",
	"threat",
	"operation",
	"tension",
	"summit",
	"treaty",
	"alliance",
	"embargo",
	"blockade",
	"espionage",

	// Political events
	"coup",
	"election",
	"protest",
	"uprising",
	"riot",
	"crackdown",
	"referendum",
	"regime change",
	"rebellion",
	"strike",

	// Humanitarian
	"crisis",
	"humanitarian",
	"refugee",
	"displacement",
	"famine",
	"evacuation",
	"mass-death",

	// Cyber & intelligence
	"cyberattack",
	"hacking",
	"surveillance",

	// Trade & economic
	"tradewar",
	"tariff",
	"armsdeal",
	"economy",
	"business",

	// Health, Environment & Politics
	"pandemic",
	"disaster",
	"environment",
	"politics",
];

const AUTHENTIC_SOURCES = new Set([
  "reuters",
  "bbc",
  "associated press",
  "bloomberg",
  "ap news",
  "npr",
  "france 24",
  "dw",
  "al jazeera",
  "cnn",
  "nyt",
  "new york times",
  "washington post",
  "guardian",
  "ft",
  "financial times",
  "economist",
  "time",
  "newsweek",
  "politico",
  "axios",
  "vice news",
  "bbc news world",
]);

const BLACKLISTED_TOPICS = new Set([
  "celebrity",
  "entertainment",
  "sports",
  "weather",
  "technology gadgets",
  "lifestyle",
  "health tips",
  "diet",
  "fitness",
  "viral",
  "memes",
  "tiktok",
  "instagram",
  "gaming",
  "esports",
  "investment advice",
  "weather forecast",
  "celebrity gossip",
  "fashion",
  "beauty",
  "cooking",
  "recipe",
  "fashion week",
]);

const calculateAuthenticityScore = (source) => {
  if (!source) return 0.3;

  const normalizedSource = source.toLowerCase();
  
  // Check if source is in authentic list
  if (AUTHENTIC_SOURCES.has(normalizedSource)) return 0.95;
  
  // Check partial matches
  for (const authentic of AUTHENTIC_SOURCES) {
    if (normalizedSource.includes(authentic)) return 0.85;
  }

  // Generic major news sources
  if (normalizedSource.includes("news") || normalizedSource.includes("times")) return 0.7;
  if (normalizedSource.includes("report")) return 0.65;
  
  // Default for unknown sources
  return 0.5;
};

const checkRelevance = async (query, articles) => {
  try {
    logger.info("Checking search relevance with LLM...", "search.service");

    const lowerQuery = query.toLowerCase();

    // First: Quick blacklist check - reject immediately if blacklisted topic detected
    for (const blacklistedTopic of BLACKLISTED_TOPICS) {
      if (lowerQuery.includes(blacklistedTopic)) {
        logger.warn(`Query contains blacklisted topic "${blacklistedTopic}": ${query}`, "search.service");
        return {
          is_relevant: false,
          reason: `This query is about ${blacklistedTopic}, which is not related to geopolitical events.`,
          matched_type: null,
        };
      }
    }

    // Second: Quick allowlist check - approve immediately if allowed type detected
    for (const allowedType of ALLOWED_TYPES) {
      if (lowerQuery.includes(allowedType)) {
        logger.info(`Query matches allowed type "${allowedType}": ${query}`, "search.service");
        return {
          is_relevant: true,
          reason: `Query is about ${allowedType}`,
          matched_type: allowedType,
        };
      }
    }

    // Third: LLM verification for ambiguous queries
    const prompt = `
You are a geopolitical intelligence analyst. Check if this search query is relevant to geopolitical events.

Query: "${query}"
if the qurey has any spelling mistakes then please correct it and then check the relevance of the query like anyone can write Donald Trump as dronal tramp and also someone say narendra modi as modi

Allowed geopolitical event types:
${ALLOWED_TYPES.join(", ")}

Return YES or NO and state which allowed type it matches, if any.
Format: YES - [type] or NO - [reason]
`;

    logger.info(`Sending LLM prompt for relevance check...`, "search.service");
    let response;
    try {
      response = await queryLLM(prompt);
      logger.info(`LLM response received: "${response}"`, "search.service");
    } catch (llmErr) {
      logger.error(`LLM call failed: ${llmErr.message}`, "search.service");
      // If LLM fails, use fallback: reject queries that don't match common keywords
      const hasCommonKeywords = ALLOWED_TYPES.some(type => lowerQuery.includes(type.toLowerCase()));
      if (hasCommonKeywords) {
        return {
          is_relevant: true,
          reason: "Matched by keyword",
          matched_type: ALLOWED_TYPES.find(type => lowerQuery.includes(type.toLowerCase())),
        };
      }
      return {
        is_relevant: false,
        reason: "This query does not appear to be about geopolitical topics. Try searching for conflicts, diplomacy, sanctions, or world events.",
        matched_type: null,
      };
    }
    
    if (!response) {
      logger.warn(`Empty LLM response for query: "${query}"`, "search.service");
      return {
        is_relevant: false,
        reason: "Unable to verify query relevance. Please try with different keywords.",
        matched_type: null,
      };
    }

    const responseUpper = response.toUpperCase();
    
    if (responseUpper.includes("YES")) {
      const typeMatch = ALLOWED_TYPES.find(type => response.toLowerCase().includes(type.toLowerCase()));
      logger.info(`Query approved by LLM as: ${typeMatch || 'general'}`, "search.service");
      return {
        is_relevant: true,
        reason: "Verified by LLM",
        matched_type: typeMatch || null,
      };
    }

    // Extract reason from "NO - [reason]" format
    let extractedReason = "This query does not match any geopolitical event types we track.";
    const noMatch = response.match(/NO\s*-\s*(.+?)(?:\n|$)/i);
    if (noMatch && noMatch[1]) {
      extractedReason = noMatch[1].trim();
      // Remove quotes if they wrap the entire reason
      extractedReason = extractedReason.replace(/^["']|["']$/g, '');
      logger.info(`Extracted LLM rejection reason: "${extractedReason}"`, "search.service");
    } else {
      logger.info(`Could not extract reason from response. Full response: "${response}"`, "search.service");
    }

    return {
      is_relevant: false,
      reason: extractedReason,
      matched_type: null,
    };
  } catch (err) {
    logger.error(`Relevance check failed: ${err.message}`, "search.service");
    logger.error(`Error stack: ${err.stack}`, "search.service");
    return { 
      is_relevant: false, 
      reason: `Error verifying query: ${err.message}`, 
      matched_type: null 
    };
  }
};

exports.searchNews = async (query) => {
  try {
    logger.info(`Searching news for query: "${query}"`, "search.service");

    // Check relevance first
    const relevanceCheck = await checkRelevance(query, []);
    logger.info(`Relevance check result: is_relevant=${relevanceCheck.is_relevant}, reason=${relevanceCheck.reason}`, "search.service");
    
    if (!relevanceCheck.is_relevant) {
      logger.warn(`Search query rejected: ${query}`, "search.service");
      const rejectionResponse = {
        success: false,
        query: query,
        message: relevanceCheck.reason || "Not relevant to our perspective",
        reason: relevanceCheck.reason || "This query does not match geopolitical event types in our database.",
        recommendation: "Try searching for geopolitical conflicts, diplomacy, sanctions, economic news, or humanitarian issues",
        results: [],
      };
      logger.info(`Rejection response: ${JSON.stringify(rejectionResponse, null, 2)}`, "search.service");
      return rejectionResponse;
    }

    logger.info(`Query "${query}" passed relevance. Fetching articles from NewsAPI...`, "search.service");

    // Fetch news with search query
    let articles = [];
    try {
      articles = await newsApiFetcher.fetchNewsWithSearch(query);
    } catch (newsErr) {
      logger.warn(`NewsAPI error: ${newsErr.message}`, "search.service");
      // Don't fail - return no results message
      return {
        success: false,
        query: query,
        message: "No articles found",
        reason: `We couldn't find any recent articles about "${query}" in our news sources. This might be because:
• The topic is too recent and not yet covered by major news outlets
• The keywords need to be more specific
• It's a less-covered geopolitical event`,
        recommendation: "Try searching with different keywords or wait for more coverage on this topic",
        results: [],
      };
    }

    logger.info(`NewsAPI returned ${articles?.length || 0} articles for "${query}"`, "search.service");
    
    if (!articles || articles.length === 0) {
      logger.warn(`No articles found from NewsAPI for query: "${query}"`, "search.service");
      return {
        success: false,
        query: query,
        message: "No articles found",
        reason: `Your search for "${query}" matched our filters, but we couldn't find any recent articles about this topic in our news sources.`,
        recommendation: "Try different keywords or search for similar topics like 'Ukraine conflict', 'Middle East tensions', or 'international diplomacy'",
        results: [],
      };
    }

    // Transform results with authenticity scores
    const results = articles.map((article, idx) => {
      const source = article.source?.name || "Unknown";
      const authenticityScore = calculateAuthenticityScore(source);

      return {
        id: `search_${Date.now()}_${idx}`,
        title: article.title,
        description: article.description,
        content: article.content,
        source: source,
        url: article.url,
        image: article.urlToImage,
        publishedAt: article.publishedAt,
        authenticity_score: Number(authenticityScore.toFixed(2)),
        matched_type: relevanceCheck.matched_type || "Other",
        relevance_reason: relevanceCheck.reason,
      };
    });

    logger.info(`Search returned ${results.length} articles`, "search.service");

    const response = {
      success: true,
      message: `Found ${results.length} relevant articles`,
      query: query,
      matched_type: relevanceCheck.matched_type,
      results: results.slice(0, 10), // Limit to 10 results
    };
    
    logger.info(`Final search response: ${JSON.stringify(response, null, 2)}`, "search.service");
    return response;
  } catch (err) {
    logger.error(`Search service error for query "${query}": ${err.message}`, "search.service");
    logger.error(`Error stack: ${err.stack}`, "search.service");
    
    // Provide specific error reasons instead of generic "Search failed"
    let errorReason = "An error occurred while processing your search. Please try again.";
    
    if (err.message.includes("API") || err.message.includes("api")) {
      errorReason = "The LLM service is temporarily unavailable. Please try again in a moment.";
    } else if (err.message.includes("rate") || err.message.includes("429")) {
      errorReason = "Too many requests. Please wait a moment before searching again.";
    } else if (err.message.includes("key") || err.message.includes("auth")) {
      errorReason = "Service authentication failed. Please contact support.";
    } else {
      errorReason = `Error: ${err.message}`;
    }
    
    return {
      success: false,
      query: query,
      message: "Search error",
      reason: errorReason,
      recommendation: "Try searching with simpler keywords or try again later",
      results: [],
    };
  }
};
