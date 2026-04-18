import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bookmark, BookmarkCheck, LogIn } from 'lucide-react';

/**
 * BookmarkButton — toggles save/unsave for a given event.
 * Shown inside event cards and IntelPanel.
 *
 * Props:
 *  event        — full event object (must have .id)
 *  size         — 'sm' | 'md' (default 'md')
 *  showLabel    — show text label beside icon (default false)
 */
export default function BookmarkButton({ event, size = 'md', showLabel = false }) {
  const { isAuthenticated, isSaved, saveEvent, unsaveEvent, login } = useAuth();
  const [animating, setAnimating] = useState(false);

  if (!event?.id) return null;

  const saved = isSaved(event.id);

  const handleClick = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      login();
      return;
    }

    setAnimating(true);
    if (saved) {
      await unsaveEvent(event.id);
    } else {
      await saveEvent(event);
    }
    setTimeout(() => setAnimating(false), 400);
  };

  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  const padding  = size === 'sm' ? 'px-2 py-1'  : 'px-2.5 py-1.5';

  return (
    <button
      onClick={handleClick}
      title={
        !isAuthenticated ? 'Sign in to save this event'
        : saved           ? 'Remove from saved news'
                          : 'Save this event'
      }
      className={`
        flex items-center gap-1.5 rounded-md transition-all duration-200 font-mono text-[10px] uppercase tracking-wider
        ${padding}
        ${saved
          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30'
          : 'bg-white/5 text-[var(--text-muted)] border border-white/10 hover:bg-blue-500/15 hover:text-blue-400 hover:border-blue-500/30'
        }
        ${animating ? 'scale-90' : 'scale-100'}
      `}
    >
      {saved
        ? <BookmarkCheck className={`${iconSize} flex-shrink-0`} />
        : !isAuthenticated
          ? <LogIn className={`${iconSize} flex-shrink-0`} />
          : <Bookmark className={`${iconSize} flex-shrink-0`} />
      }
      {showLabel && (
        <span>
          {!isAuthenticated ? 'Sign in' : saved ? 'Saved' : 'Save'}
        </span>
      )}
    </button>
  );
}
