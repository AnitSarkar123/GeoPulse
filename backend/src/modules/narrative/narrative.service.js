const logger = require("../../utils/logger");
const { queryLLM } = require("../../config/llm");
const newsApiFetcher = require("../news/sources/newsapi/fetcher");

/**
 * Narrative Conflict Detection Service
 * Groups articles about the same event and detects conflicting perspectives
 */

// Improved similarity scoring - more lenient
const calculateSimilarityScore = (text1, text2) => {
  const normalize = (text) =>
    text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 2);

  const words1 = normalize(text1);
  const words2 = normalize(text2);

  if (words1.length === 0 || words2.length === 0) return 0;

  const set1 = new Set(words1);
  const set2 = new Set(words2);

  let commonCount = 0;
  for (const word of set1) {
    if (set2.has(word)) {
      commonCount++;
    }
  }

  // Use Jaccard similarity (more forgiving than previous method)
  const unionSize = set1.size + set2.size - commonCount;
  return commonCount / unionSize;
};

// Extract stance from an article using LLM
const extractStance = async (article) => {
  try {
    const prompt = `You are a neutral news analyst. Read this article excerpt and determine the stance toward the main subject.

Title: "${article.title}"
Description: "${article.description || ''}"

Classify the stance as: POSITIVE, NEUTRAL, or NEGATIVE
Briefly explain (1-2 sentences) what perspective this article takes.

Format: [POSITIVE/NEUTRAL/NEGATIVE] - [Brief explanation]`;

    const response = await queryLLM(prompt);
    
    // Parse response
    let stance = "NEUTRAL";
    let explanation = "Neutral coverage";
    
    if (response.includes("POSITIVE")) {
      stance = "POSITIVE";
      explanation = response.split("-")[1]?.trim() || "Positive framing";
    } else if (response.includes("NEGATIVE")) {
      stance = "NEGATIVE";
      explanation = response.split("-")[1]?.trim() || "Critical framing";
    } else if (response.includes("NEUTRAL")) {
      stance = "NEUTRAL";
      explanation = response.split("-")[1]?.trim() || "Neutral reporting";
    }
    
    return {
      stance,
      explanation: explanation.substring(0, 150), // Limit length
    };
  } catch (err) {
    logger.warn(`Failed to extract stance for article: ${err.message}`, "narrative.service");
    return {
      stance: "NEUTRAL",
      explanation: "Could not determine stance",
    };
  }
};

// Improved clustering - groups similar articles together
const clusterArticles = async (articles) => {
  if (!articles || articles.length < 2) return [];

  const clusters = [];
  const processed = new Set();

  for (let i = 0; i < articles.length; i++) {
    if (processed.has(i)) continue;

    const cluster = [i];
    processed.add(i);

    const article1Text = `${articles[i].title} ${articles[i].description}`;

    // Find similar articles with lower threshold (0.15 instead of 0.3)
    for (let j = i + 1; j < articles.length; j++) {
      if (processed.has(j)) continue;

      const article2Text = `${articles[j].title} ${articles[j].description}`;
      const similarity = calculateSimilarityScore(article1Text, article2Text);

      // Lowered threshold from 0.3 to 0.15 for better clustering
      if (similarity > 0.15) {
        cluster.push(j);
        processed.add(j);
      }
    }

    // Accept clusters with 2+ articles OR single articles with high keyword relevance
    if (
      cluster.length >= 2 ||
      (cluster.length === 1 && articles.length > 10)
    ) {
      clusters.push(cluster);
    }
  }

  // If no clusters found, create one mega-cluster from all articles
  // (since they all came from the same search query)
  if (clusters.length === 0 && articles.length >= 2) {
    logger.info(
      `No tight clusters found. Creating one cluster from all ${articles.length} articles.`,
      "narrative.service"
    );
    clusters.push(Array.from({ length: articles.length }, (_, i) => i));
  }

  return clusters;
};

// Detect conflicts in a cluster
const detectConflictInCluster = async (cluster, articles) => {
  const stances = [];

  // Extract stance for each article in cluster
  for (const idx of cluster) {
    const article = articles[idx];
    const stanceData = await extractStance(article);

    stances.push({
      source: article.source?.name || "Unknown",
      title: article.title,
      stance: stanceData.stance,
      explanation: stanceData.explanation,
      url: article.url,
      publishedAt: article.publishedAt,
    });
  }

  // Determine if there's a conflict
  const stanceSet = new Set(stances.map((s) => s.stance));
  
  // Conflict exists if:
  // 1. Multiple different stances (e.g., POSITIVE + NEGATIVE, POSITIVE + NEUTRAL, etc.)
  // 2. And at least one is POSITIVE or NEGATIVE (not just NEUTRAL variants)
  const hasPositive = stanceSet.has("POSITIVE");
  const hasNegative = stanceSet.has("NEGATIVE");
  const hasNeutral = stanceSet.has("NEUTRAL");
  
  const hasConflict =
    stanceSet.size >= 2 && (hasPositive || hasNegative) && stanceSet.size > 1;

  // Extract main topic from first article
  const eventTitle = articles[cluster[0]].title;

  // Find key locations and countries
  const locationMatch = eventTitle.match(/\b([A-Z][a-z]+ )+/g);
  const locations = locationMatch ? locationMatch.join(", ") : "Multiple locations";

  return {
    eventTitle,
    locations,
    hasConflict,
    narrativeCount: stanceSet.size,
    stances,
  };
};

exports.detectConflictingNarratives = async (query) => {
  try {
    logger.info(`Detecting conflicting narratives for: "${query}"`, "narrative.service");
    
    // Fetch articles
    const articles = await newsApiFetcher.fetchNewsWithSearch(query);
    
    if (!articles || articles.length < 2) {
      logger.info(`Not enough articles (${articles?.length || 0}) for conflict detection`, "narrative.service");
      return {
        success: false,
        message: "Not enough sources to detect conflicting narratives",
        conflicts: [],
      };
    }
    
    logger.info(`Fetched ${articles.length} articles, clustering...`, "narrative.service");
    
    // Cluster similar articles
    const clusters = await clusterArticles(articles);
    
    if (clusters.length === 0) {
      logger.info(`No clusters found`, "narrative.service");
      return {
        success: false,
        message: "Unable to cluster articles for narrative analysis",
        conflicts: [],
      };
    }
    
    logger.info(`Found ${clusters.length} clusters, analyzing perspectives...`, "narrative.service");
    
    // Analyze all clusters for different perspectives
    const conflicts = [];
    for (const cluster of clusters) {
      const analysis = await detectConflictInCluster(cluster, articles);
      
      // Include all clusters with diverse perspectives (not just strict conflicts)
      // If cluster has 2+ different stances, it shows different perspectives
      if (analysis.narrativeCount >= 2) {
        conflicts.push(analysis);
        logger.info(
          `Found perspective diversity: ${analysis.narrativeCount} different stances in cluster`,
          "narrative.service"
        );
      }
    }
    
    logger.info(`Analyzed ${conflicts.length} perspective clusters`, "narrative.service");
    
    return {
      success: conflicts.length > 0,
      message:
        conflicts.length > 0
          ? `Found ${conflicts.length} clusters with multiple perspectives`
          : "All sources report the same perspective on this topic",
      query,
      conflicts,
      totalArticlesAnalyzed: articles.length,
      clustersAnalyzed: clusters.length,
    };
  } catch (err) {
    logger.error(`Narrative detection error: ${err.message}`, "narrative.service");
    return {
      success: false,
      message: `Error detecting narratives: ${err.message}`,
      conflicts: [],
    };
  }
};
