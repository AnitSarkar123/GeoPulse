import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, TrendingUp, TrendingDown, Minus } from "lucide-react";

const ConflictingNarrativesModal = ({ conflicts, isOpen, onClose, query }) => {
  if (!isOpen || !conflicts || conflicts.length === 0) return null;

  const stanceColors = {
    POSITIVE: "bg-green-50 border-green-300",
    NEGATIVE: "bg-red-50 border-red-300",
    NEUTRAL: "bg-gray-50 border-gray-300",
  };

  const stanceIcons = {
    POSITIVE: <TrendingUp className="w-5 h-5 text-green-600" />,
    NEGATIVE: <TrendingDown className="w-5 h-5 text-red-600" />,
    NEUTRAL: <Minus className="w-5 h-5 text-gray-600" />,
  };

  const stanceLabels = {
    POSITIVE: "Positive Framing",
    NEGATIVE: "Critical Framing",
    NEUTRAL: "Neutral Coverage",
  };

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
            className="bg-white rounded-lg shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 animate-pulse" />
              <div>
                <h2 className="text-2xl font-bold">⚠️ Conflicting Narratives Detected</h2>
                <p className="text-orange-100 text-sm mt-1">
                  Multiple sources reporting the same event with conflicting perspectives
                </p>
              </div>
              <button
                onClick={onClose}
                className="ml-auto text-white hover:bg-white hover:bg-opacity-20 p-2 rounded"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Query Info */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-gray-700">
                  <span className="font-semibold">Query:</span> "{query}"
                </p>
              </div>

              {/* Conflict Clusters */}
              <div className="space-y-8">
                {conflicts.map((conflict, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="border-2 border-orange-200 rounded-lg p-6 bg-orange-50"
                  >
                    {/* Event Title */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        📰 {conflict.eventTitle}
                      </h3>
                      <p className="text-sm text-gray-600">
                        📍 {conflict.locations} • {conflict.stances.length} sources with{" "}
                        <span className="font-semibold">{conflict.narrativeCount} different narratives</span>
                      </p>
                    </div>

                    {/* Stance Breakdown */}
                    <div className="space-y-3">
                      {conflict.stances.map((source, sourceIdx) => (
                        <motion.div
                          key={sourceIdx}
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: (idx * 0.1) + (sourceIdx * 0.05) }}
                          className={`border-2 rounded-lg p-4 ${stanceColors[source.stance]}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                              {stanceIcons[source.stance]}
                            </div>
                            <div className="flex-grow">
                              <div className="flex items-center justify-between mb-2">
                                <p className="font-semibold text-gray-800">
                                  {source.source}
                                </p>
                                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                                  source.stance === 'POSITIVE' 
                                    ? 'bg-green-200 text-green-800'
                                    : source.stance === 'NEGATIVE'
                                    ? 'bg-red-200 text-red-800'
                                    : 'bg-gray-200 text-gray-800'
                                }`}>
                                  {stanceLabels[source.stance]}
                                </span>
                              </div>
                              <p className="text-gray-700 text-sm font-medium mb-2">
                                "{source.title}"
                              </p>
                              <p className="text-gray-600 text-xs mb-3">
                                {source.explanation}
                              </p>
                              <div className="flex justify-between items-center text-xs text-gray-500">
                                <span>{new Date(source.publishedAt).toLocaleDateString()}</span>
                                <a
                                  href={source.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline font-semibold"
                                >
                                  Read Full Article →
                                </a>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Narrative Conflict Summary */}
                    <div className="mt-4 p-3 bg-white border border-orange-300 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">📊 Analysis:</span> This event is being reported from{" "}
                        <span className="font-bold text-orange-600">{conflict.narrativeCount} different perspectives</span>.
                        Different sources emphasize different aspects, potentially reflecting editorial bias or
                        legitimate disagreement about the interpretation of events.
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                <p className="text-yellow-900 text-sm">
                  💡 <strong>Tip:</strong> Always cross-reference multiple sources to understand the full picture of
                  geopolitical events.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConflictingNarrativesModal;
