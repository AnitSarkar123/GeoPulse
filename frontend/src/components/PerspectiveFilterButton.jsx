import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { filterPerspectives } from "../services/perspective";
import PerspectiveFilterModal from "./PerspectiveFilterModal";

const PerspectiveFilterButton = ({ searchResults, disabled = false }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [filterResult, setFilterResult] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleAnalyzePerspectives = async () => {
    if (!searchResults || !searchResults.results || searchResults.results.length < 2) {
      alert("Need at least 2 search results to analyze perspectives");
      return;
    }

    setIsLoading(true);
    try {
      const result = await filterPerspectives(searchResults.results);
      if (result.success) {
        setFilterResult(result);
        setShowModal(true);
      } else {
        alert(result.message || "Could not analyze perspectives");
      }
    } catch (err) {
      alert("Error analyzing perspectives");
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const hasResults = searchResults && searchResults.results && searchResults.results.length >= 2;

  return (
    <>
      <button
        onClick={handleAnalyzePerspectives}
        disabled={disabled || isLoading || !hasResults}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
          disabled || !hasResults
            ? "bg-gray-200 text-gray-500 cursor-not-allowed opacity-50"
            : isLoading
            ? "bg-blue-500 text-white animate-pulse"
            : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/50 active:scale-95"
        }`}
        title="Analyze search results by perspective"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            <span>Analyzing...</span>
          </>
        ) : (
          <>
            <AlertTriangle className="w-5 h-5" />
            <span>View Perspectives</span>
          </>
        )}
      </button>

      {/* Modal */}
      {filterResult && (
        <PerspectiveFilterModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          perspectives={filterResult.perspectives}
          grouped={filterResult.grouped}
          totalArticles={filterResult.totalArticles}
        />
      )}
    </>
  );
};

export default PerspectiveFilterButton;
