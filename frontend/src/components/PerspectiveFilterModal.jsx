import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, TrendingUp, TrendingDown, Minus, ExternalLink } from "lucide-react";

const PerspectiveFilterModal = ({ isOpen, onClose, perspectives, grouped, totalArticles }) => {
  if (!isOpen) return null;

  const stanceIcons = {
    POSITIVE: <TrendingUp className="w-5 h-5 text-green-600" />,
    NEGATIVE: <TrendingDown className="w-5 h-5 text-red-600" />,
    NEUTRAL: <Minus className="w-5 h-5 text-gray-600" />,
    CRITICAL: <AlertTriangle className="w-5 h-5 text-orange-600" />,
  };

  const stanceColors = {
    POSITIVE: "bg-green-50 border-green-300 text-green-900",
    NEGATIVE: "bg-red-50 border-red-300 text-red-900",
    NEUTRAL: "bg-gray-50 border-gray-300 text-gray-900",
    CRITICAL: "bg-orange-50 border-orange-300 text-orange-900",
  };

  const stanceBgColors = {
    POSITIVE: "bg-green-100 text-green-700",
    NEGATIVE: "bg-red-100 text-red-700",
    NEUTRAL: "bg-gray-100 text-gray-700",
    CRITICAL: "bg-orange-100 text-orange-700",
  };

  const stanceLabels = {
    POSITIVE: "Positive Perspective",
    NEGATIVE: "Negative/Critical Perspective",
    NEUTRAL: "Neutral Coverage",
    CRITICAL: "Critical Coverage",
  };

  const orderedStances = ["POSITIVE", "NEGATIVE", "CRITICAL", "NEUTRAL"];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-lg shadow-2xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-8 h-8" />
                <div>
                  <h2 className="text-2xl font-bold">🎯 Perspective Analysis</h2>
                  <p className="text-blue-100 text-sm mt-1">
                    Articles grouped by their perspective/stance on this topic
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Summary */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-gray-700">
                  <span className="font-semibold">Total Articles Analyzed:</span> {totalArticles}
                </p>
                <p className="text-gray-700 mt-1">
                  <span className="font-semibold">Perspectives Found:</span> {Object.keys(grouped).length}
                </p>
              </div>

              {/* Perspectives */}
              <div className="space-y-6">
                {orderedStances.map((stance) => {
                  const articles = grouped[stance];
                  if (!articles) return null;

                  return (
                    <motion.div
                      key={stance}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className={`border-2 rounded-lg p-5 ${stanceColors[stance]}`}
                    >
                      {/* Stance Header */}
                      <div className="flex items-center gap-3 mb-4">
                        {stanceIcons[stance]}
                        <div>
                          <h3 className="text-lg font-bold">{stanceLabels[stance]}</h3>
                          <p className="text-sm opacity-75">{articles.length} article(s)</p>
                        </div>
                        <span className={`ml-auto px-3 py-1 rounded-full text-sm font-semibold ${stanceBgColors[stance]}`}>
                          {articles.length}/{totalArticles}
                        </span>
                      </div>

                      {/* Articles */}
                      <div className="space-y-3">
                        {articles.map((article, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.15 + idx * 0.05 }}
                            className="bg-white rounded p-4 border border-opacity-30"
                          >
                            {/* Article Image + Info */}
                            <div className="flex gap-4">
                              {article.image && (
                                <img
                                  src={article.image}
                                  alt="article"
                                  className="w-20 h-20 object-cover rounded flex-shrink-0"
                                  onError={(e) => (e.target.style.display = "none")}
                                />
                              )}
                              <div className="flex-grow">
                                <p className="text-xs text-gray-500 font-semibold mb-1">
                                  📰 {article.source}
                                </p>
                                <p className="font-semibold text-gray-800 mb-2 line-clamp-2">
                                  {article.title}
                                </p>
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                  <strong>Angle:</strong> {article.angle}
                                </p>
                                <div className="flex justify-between items-center">
                                  <span className="text-xs text-gray-500">
                                    {new Date(article.publishedAt).toLocaleDateString()}
                                  </span>
                                  <a
                                    href={article.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-semibold"
                                  >
                                    Read <ExternalLink className="w-3 h-3" />
                                  </a>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Footer Insight */}
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                <p className="text-yellow-900 text-sm">
                  💡 <strong>Insight:</strong> This topic has multiple perspectives. Different news sources emphasize
                  different angles. Always cross-reference multiple sources for complete understanding.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PerspectiveFilterModal;
