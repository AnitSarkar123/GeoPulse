import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { detectNarratives } from "../services/narrative";
import ConflictingNarrativesModal from "./ConflictingNarrativesModal";

const ConflictingNarrativeButton = ({ query, disabled = false }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [narrativeConflicts, setNarrativeConflicts] = useState([]);
  const [showNarrativeModal, setShowNarrativeModal] = useState(false);

  const handleDetectNarratives = async () => {
    if (!query || !query.trim()) {
      alert("Please enter a search query first");
      return;
    }

    setIsLoading(true);
    try {
      const result = await detectNarratives(query);
      if (result.success && result.conflicts.length > 0) {
        setNarrativeConflicts(result.conflicts);
        setShowNarrativeModal(true);
      } else {
        alert(
          "No conflicting narratives detected. Try a different query like 'India Pakistan border' or 'Ukraine Russia conflict'"
        );
      }
    } catch (err) {
      alert("Error detecting narratives. Please try again.");
      console.error("Narrative detection error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleDetectNarratives}
        disabled={disabled || isLoading || !query}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
          disabled || !query
            ? "bg-gray-200 text-gray-500 cursor-not-allowed opacity-50"
            : isLoading
            ? "bg-orange-500 text-white animate-pulse"
            : "bg-gradient-to-r from-orange-500 to-red-600 text-white hover:shadow-lg hover:shadow-orange-500/50 active:scale-95"
        }`}
        title="Detect conflicting narratives between different news sources"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            <span>Analyzing...</span>
          </>
        ) : (
          <>
            <AlertTriangle className="w-5 h-5" />
            <span>Conflicting Narratives</span>
          </>
        )}
      </button>

      {/* Modal */}
      <ConflictingNarrativesModal
        conflicts={narrativeConflicts}
        isOpen={showNarrativeModal}
        onClose={() => setShowNarrativeModal(false)}
        query={query}
      />
    </>
  );
};

export default ConflictingNarrativeButton;
