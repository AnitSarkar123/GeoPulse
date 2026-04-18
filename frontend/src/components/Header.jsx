import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Globe, ChevronDown, LogIn, LogOut, Bookmark, User as UserIcon, Loader2
} from 'lucide-react';

/**
 * Header — fixed top bar for GeoPulse.
 * - Left:  brand logo
 * - Right: Sign In / Sign Up (logged out) | Avatar menu (logged in)
 *
 * onSavedNewsOpen: callback to open the SavedNewsPage panel
 */
export default function Header({ onSavedNewsOpen }) {
  const { user, isAuthenticated, login, logout, savedIds } = useAuth();
  const [menuOpen, setMenuOpen]       = useState(false);
  const [loggingOut, setLoggingOut]   = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    setLoggingOut(false);
    setMenuOpen(false);
  };

  return (
    <>
      <header
        className="
          fixed top-0 left-0 right-0 z-[60]
          flex items-center justify-between
          px-4 h-14
          bg-[rgba(10,11,14,0.92)] backdrop-blur-2xl
          border-b border-white/[0.07]
          shadow-[0_2px_20px_rgba(0,0,0,0.5)]
        "
      >
        {/* ── Brand ──────────────────────────────────────────────── */}
        <div className="flex items-center gap-2.5 select-none">
          <div className="relative w-7 h-7">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 animate-pulse opacity-70" />
            <Globe className="absolute inset-0 m-auto w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col leading-none">
            <span
              className="text-white font-bold text-[15px] tracking-tight"
              style={{ fontFamily: "'Chivo', sans-serif" }}
            >
              GeoPulse
            </span>
            <span className="text-[9px] font-mono text-[var(--text-muted)] tracking-[0.15em] uppercase">
              Intelligence
            </span>
          </div>
        </div>

        {/* ── Right section ──────────────────────────────────────── */}
        <div className="flex items-center gap-2">
          {!isAuthenticated ? (
            /* ── Logged-out: Sign In / Sign Up ─────────────────── */
            <>
              <button
                id="header-signin-btn"
                onClick={login}
                className="
                  flex items-center gap-1.5
                  px-3.5 py-1.5 rounded-md
                  text-[11px] font-mono tracking-wider uppercase
                  text-[var(--text-secondary)]
                  bg-white/5 border border-white/10
                  hover:bg-white/10 hover:text-white hover:border-white/20
                  transition-all duration-200
                "
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </button>

              <button
                id="header-signup-btn"
                onClick={login}
                className="
                  flex items-center gap-1.5
                  px-3.5 py-1.5 rounded-md
                  text-[11px] font-mono tracking-wider uppercase
                  text-white
                  bg-gradient-to-r from-blue-600 to-blue-500
                  hover:from-blue-500 hover:to-blue-400
                  shadow-lg shadow-blue-600/30
                  transition-all duration-200
                "
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign Up with Google
              </button>
            </>
          ) : (
            /* ── Logged-in: Avatar dropdown ─────────────────────── */
            <div className="relative">
              <button
                id="header-user-menu-btn"
                onClick={() => setMenuOpen(o => !o)}
                className="
                  flex items-center gap-2
                  px-2.5 py-1.5 rounded-lg
                  bg-white/5 border border-white/10
                  hover:bg-white/10 hover:border-white/20
                  transition-all duration-200
                "
              >
                {/* Avatar */}
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-6 h-6 rounded-full ring-1 ring-white/20"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <UserIcon className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
                <span className="text-[11px] font-mono text-white max-w-[100px] truncate hidden sm:block">
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown className={`w-3 h-3 text-[var(--text-muted)] transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown menu */}
              {menuOpen && (
                <>
                  {/* Click-away overlay */}
                  <div
                    className="fixed inset-0 z-[61]"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div
                    className="
                      absolute right-0 top-[calc(100%+8px)] z-[62]
                      w-56 rounded-xl overflow-hidden
                      bg-[rgba(16,18,23,0.97)] backdrop-blur-2xl
                      border border-white/10
                      shadow-[0_8px_32px_rgba(0,0,0,0.6)]
                    "
                  >
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-white/[0.06]">
                      <p className="text-white text-[12px] font-semibold truncate">{user.name}</p>
                      <p className="text-[var(--text-muted)] text-[10px] font-mono truncate mt-0.5">{user.email}</p>
                    </div>

                    {/* Saved news */}
                    <button
                      id="header-saved-news-btn"
                      onClick={() => { setMenuOpen(false); onSavedNewsOpen?.(); }}
                      className="
                        w-full flex items-center gap-2.5 px-4 py-2.5
                        text-[11px] font-mono text-[var(--text-secondary)]
                        hover:bg-white/5 hover:text-white transition-colors
                      "
                    >
                      <Bookmark className="w-3.5 h-3.5 text-blue-400" />
                      Saved News
                      {savedIds.size > 0 && (
                        <span className="ml-auto text-[9px] font-mono bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-full">
                          {savedIds.size}
                        </span>
                      )}
                    </button>

                    {/* Divider */}
                    <div className="h-px bg-white/[0.05] mx-4" />

                    {/* Logout */}
                    <button
                      id="header-logout-btn"
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="
                        w-full flex items-center gap-2.5 px-4 py-2.5
                        text-[11px] font-mono text-[var(--text-muted)]
                        hover:bg-red-500/10 hover:text-red-400 transition-colors
                      "
                    >
                      {loggingOut
                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        : <LogOut className="w-3.5 h-3.5" />
                      }
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </header>
    </>
  );
}
