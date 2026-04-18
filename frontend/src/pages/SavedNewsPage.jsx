import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import BookmarkButton from '../components/BookmarkButton';
import {
  X, Bookmark, Globe, Calendar, AlertTriangle,
  ExternalLink, RefreshCw, Loader2, BookmarkX
} from 'lucide-react';
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

const CATEGORY_COLORS = {
  'Armed Conflict':        '#FF3B30',
  'Terrorism & Security':  '#DC2626',
  'Politics':              '#3B82F6',
  'Diplomacy':             '#22C55E',
  'Diplomacy & Sanctions': '#F59E0B',
  'Humanitarian':          '#FF8A00',
  'Economic & Trade':      '#A855F7',
  'Other':                 '#94A3B8',
};

/**
 * SavedNewsPage — slide-in panel showing all user-saved events.
 * Props:
 *  isOpen   — boolean
 *  onClose  — function
 */
export default function SavedNewsPage({ isOpen, onClose }) {
  const { isAuthenticated, login, isSaved, unsaveEvent } = useAuth();
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const fetchSaved = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BASE_URL}/saved`, { withCredentials: true });
      setItems(res.data.data || []);
    } catch {
      setError('Failed to load saved news');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isOpen) fetchSaved();
  }, [isOpen, fetchSaved]);

  const handleRemove = async (eventId) => {
    await unsaveEvent(eventId);
    setItems(prev => prev.filter(i => i.eventId !== eventId));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  if (!isOpen) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex justify-end"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Panel */}
      <div
        className="
          relative w-full max-w-md h-full flex flex-col
          bg-[#0d0f14] border-l border-white/[0.08]
          shadow-[-12px_0_40px_rgba(0,0,0,0.7)]
          animate-slide-in-right
        "
        style={{ animation: 'slideInRight 0.28s cubic-bezier(0.22,0.61,0.36,1) both' }}
      >
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-500/15 flex items-center justify-center">
              <Bookmark className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-[14px]"
                style={{ fontFamily: "'Chivo', sans-serif" }}>
                Saved News
              </h2>
              <p className="text-[var(--text-muted)] text-[10px] font-mono">
                {items.length} event{items.length !== 1 ? 's' : ''} bookmarked
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={fetchSaved}
              className="p-1.5 rounded-md text-[var(--text-muted)] hover:text-white hover:bg-white/5 transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              id="saved-news-close-btn"
              className="p-1.5 rounded-md text-[var(--text-muted)] hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Body ───────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">
          {!isAuthenticated ? (
            /* Not logged in */
            <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center">
                <Bookmark className="w-7 h-7 text-[var(--text-muted)]" />
              </div>
              <div>
                <p className="text-white font-semibold text-[14px] mb-1">Sign in to save news</p>
                <p className="text-[var(--text-muted)] text-[12px] font-mono">
                  Create an account or sign in with Google to bookmark geopolitical events.
                </p>
              </div>
              <button
                onClick={login}
                className="
                  flex items-center gap-2 px-4 py-2 rounded-lg
                  bg-blue-600 hover:bg-blue-500 text-white text-[12px] font-mono tracking-wider
                  transition-colors shadow-lg shadow-blue-600/30
                "
              >
                Sign In with Google
              </button>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="w-6 h-6 text-[var(--text-muted)] animate-spin" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-40 gap-3 text-center px-6">
              <AlertTriangle className="w-6 h-6 text-[var(--cat-war)]" />
              <p className="text-[var(--text-secondary)] text-[12px] font-mono">{error}</p>
              <button onClick={fetchSaved} className="text-blue-400 text-[11px] font-mono hover:underline">
                Try again
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center">
                <BookmarkX className="w-7 h-7 text-[var(--text-muted)]" />
              </div>
              <div>
                <p className="text-white font-semibold text-[14px] mb-1">No saved events yet</p>
                <p className="text-[var(--text-muted)] text-[12px] font-mono">
                  Click the bookmark icon on any event to save it here.
                </p>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-white/[0.05] px-0">
              {items.map((item) => {
                const event   = item.eventData || {};
                const catColor = CATEGORY_COLORS[event.category] || '#94A3B8';
                return (
                  <li key={item.eventId} className="px-5 py-4 hover:bg-white/[0.03] transition-colors group">
                    {/* Category badge + date */}
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded"
                        style={{ background: `${catColor}22`, color: catColor }}
                      >
                        {event.category || 'Other'}
                      </span>
                      <span className="text-[var(--text-muted)] text-[9px] font-mono flex items-center gap-1">
                        <Calendar className="w-2.5 h-2.5" />
                        {formatDate(item.savedAt)}
                      </span>
                    </div>

                    {/* Title */}
                    <p className="text-white text-[12px] font-semibold leading-snug mb-1 line-clamp-2">
                      {event.title || 'Untitled Event'}
                    </p>

                    {/* Country */}
                    {event.country && (
                      <p className="text-[var(--text-muted)] text-[10px] font-mono flex items-center gap-1 mb-2">
                        <Globe className="w-2.5 h-2.5" />
                        {event.country}
                      </p>
                    )}

                    {/* Severity */}
                    {event.severity && (
                      <div className="flex items-center gap-1 mb-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div
                            key={i}
                            className="h-1 w-4 rounded-full transition-all"
                            style={{
                              background: i < event.severity
                                ? catColor
                                : 'rgba(255,255,255,0.1)'
                            }}
                          />
                        ))}
                        <span className="text-[9px] font-mono text-[var(--text-muted)] ml-1">
                          Severity {event.severity}/5
                        </span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {/* Source link */}
                      {event.source_url && (
                        <a
                          href={event.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="
                            flex items-center gap-1 text-[9px] font-mono text-[var(--text-muted)]
                            hover:text-blue-400 transition-colors
                          "
                        >
                          <ExternalLink className="w-2.5 h-2.5" />
                          Source
                        </a>
                      )}
                      <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleRemove(item.eventId)}
                          className="
                            flex items-center gap-1 px-2 py-1 rounded
                            text-[9px] font-mono text-[var(--text-muted)]
                            hover:text-red-400 hover:bg-red-500/10 transition-colors
                          "
                          title="Remove from saved"
                        >
                          <X className="w-2.5 h-2.5" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}
