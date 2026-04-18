import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [savedIds, setSavedIds]   = useState(new Set()); // eventIds the user has bookmarked

  // ── Restore session on mount ────────────────────────────────────
  const fetchCurrentUser = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/auth/me`, { withCredentials: true });
      if (res.data.success) {
        setUser(res.data.user);
        // Also load their saved event IDs so BookmarkButton knows what's already saved
        const savedRes = await axios.get(`${BASE_URL}/saved`, { withCredentials: true });
        if (savedRes.data.success) {
          setSavedIds(new Set(savedRes.data.data.map(s => s.eventId)));
        }
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Check for ?auth=success from OAuth callback redirect
    const params = new URLSearchParams(window.location.search);
    if (params.get('auth') === 'success') {
      // Remove the query param cleanly
      window.history.replaceState({}, '', window.location.pathname);
    }
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  // ── Login — redirect to Google OAuth ───────────────────────────
  const login = () => {
    window.location.href = `${BASE_URL}/auth/google`;
  };

  // ── Logout ──────────────────────────────────────────────────────
  const logout = async () => {
    try {
      await axios.post(`${BASE_URL}/auth/logout`, {}, { withCredentials: true });
    } catch { /* best effort */ }
    setUser(null);
    setSavedIds(new Set());
  };

  // ── Bookmark helpers ─────────────────────────────────────────────
  const saveEvent = async (event) => {
    if (!user) { login(); return; }
    try {
      await axios.post(`${BASE_URL}/saved`, { eventId: event.id, eventData: event }, { withCredentials: true });
      setSavedIds(prev => new Set([...prev, event.id]));
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  const unsaveEvent = async (eventId) => {
    if (!user) return;
    try {
      await axios.delete(`${BASE_URL}/saved/${eventId}`, { withCredentials: true });
      setSavedIds(prev => {
        const next = new Set(prev);
        next.delete(eventId);
        return next;
      });
    } catch (err) {
      console.error('Unsave error:', err);
    }
  };

  const isSaved = (eventId) => savedIds.has(eventId);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      loading,
      savedIds,
      login,
      logout,
      saveEvent,
      unsaveEvent,
      isSaved,
      refreshUser: fetchCurrentUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};

export default AuthContext;
