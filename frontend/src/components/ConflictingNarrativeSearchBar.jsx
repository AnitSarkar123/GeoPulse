import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { detectNarratives } from "../services/narrative";
import ConflictingNarrativesModal from "./ConflictingNarrativesModal";

export default function ConflictingNarrativeSearchBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [narrativeConflicts, setNarrativeConflicts] = useState([]);
  const [showNarrativeModal, setShowNarrativeModal] = useState(false);
  const debounceTimer = useRef(null);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();

    if (!query.trim()) {
      alert("Please enter a search query");
      return;
    }

    setIsSearching(true);
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
      setIsSearching(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setIsExpanded(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Clear previous debounce
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Debounce and search automatically for longer queries
    if (value.trim().length > 5) {
      debounceTimer.current = setTimeout(() => {
        handleSearch();
      }, 1000);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsExpanded(false);
      handleClear();
    } else if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  return (
    <div data-testid="narrative-search-bar">
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="glass-panel rounded-md p-2.5 hover:bg-[var(--bg-elevated)] transition-colors flex items-center gap-2"
          data-testid="narrative-search-toggle-btn"
          title="Search for conflicting narratives"
        >
          <AlertTriangle className="w-4 h-4 text-orange-600" />
        </button>
      ) : (
        <motion.form
          initial={{ width: 40 }}
          animate={{ width: 320 }}
          onSubmit={handleSearch}
          className="glass-panel rounded-md px-3 py-2 flex items-center gap-2"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Search for narrative conflicts..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] min-w-0"
            autoFocus
            data-testid="narrative-search-input"
          />
          {isSearching && (
            <div className="w-3.5 h-3.5 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
          )}
          {query && !isSearching && (
            <button
              type="button"
              onClick={handleClear}
              className="p-0.5 hover:bg-[var(--bg-elevated)] rounded"
              data-testid="narrative-search-clear-btn"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </motion.form>
      )}

      {/* Conflicting Narratives Modal */}
      <ConflictingNarrativesModal
        conflicts={narrativeConflicts}
        isOpen={showNarrativeModal}
        onClose={() => setShowNarrativeModal(false)}
        query={query}
      />
    </div>
  );
}
