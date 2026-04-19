import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, TrendingDown, AlertTriangle, BarChart3, MapPin, Brain, Loader2, Navigation } from 'lucide-react';
import { CATEGORY_COLORS } from '../services/api';
import { getCountryIntel } from '../services/api';

const StabilityGauge = ({ score, label }) => {
  const getColor = () => {
    if (score >= 70) return '#22C55E';
    if (score >= 40) return '#F59E0B';
    return '#FF3B30';
  };
  const color = getColor();
  const circumference = 2 * Math.PI * 42;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2" data-testid="stability-gauge">
      <div className="relative w-28 h-28">
        <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.08)" strokeWidth="6" fill="none" />
          <circle
            cx="50" cy="50" r="42"
            stroke={color}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-mono font-bold" style={{ color }}>{score}</span>
          <span className="text-[9px] uppercase tracking-widest text-[var(--text-muted)]">/ 100</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        {label === 'Stable' && <Shield className="w-3 h-3" style={{ color }} />}
        {label === 'Moderate' && <AlertTriangle className="w-3 h-3" style={{ color }} />}
        {label === 'Unstable' && <TrendingDown className="w-3 h-3" style={{ color }} />}
        <span className="text-xs font-mono font-medium" style={{ color }}>{label}</span>
      </div>
    </div>
  );
};

const CategoryBar = ({ category, count, total }) => {
  const color = CATEGORY_COLORS[category] || '#3B82F6';
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] uppercase tracking-widest font-mono text-[var(--text-secondary)] w-20 text-right truncate">{category}</span>
      <div className="flex-1 h-2 rounded-full bg-[var(--bg-elevated)] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
      <span className="text-[10px] font-mono text-[var(--text-muted)] w-6 text-right">{count}</span>
    </div>
  );
};

export default function CountryIntelPanel({ country, isOpen, onClose, allEvents = [] }) {
  const countryName = typeof country === 'string' ? country : country?.name;
  const lat = country?.lat;
  const lng = country?.lng;
  const city = country?.city;
  const state = country?.state;
  const countryLabel = country?.country;
  const displayName = country?.displayName;
  const [aiIntel, setAiIntel] = useState(null);
  const [loadingIntel, setLoadingIntel] = useState(false);
  const [intelError, setIntelError] = useState(null);

  // Fetch AI-generated intel when country opens
  useEffect(() => {
    if (isOpen && countryName) {
      setLoadingIntel(true);
      setIntelError(null);

      getCountryIntel(countryName)
        .then(data => {
          setAiIntel(data.intel);
        })
        .catch(err => {
          console.warn('Failed to fetch AI intel:', err);
          setIntelError(err.message || 'Failed to analyze country intelligence');
        })
        .finally(() => {
          setLoadingIntel(false);
        });
    }
  }, [isOpen, country]);

  const retryFetchIntel = () => {
    if (countryName) {
      setLoadingIntel(true);
      setIntelError(null);
      setAiIntel(null);

      getCountryIntel(countryName)
        .then(data => {
          setAiIntel(data.intel);
        })
        .catch(err => {
          console.warn('Failed to fetch AI intel (retry):', err);
          setIntelError(err.message || 'Failed to analyze country intelligence');
        })
        .finally(() => {
          setLoadingIntel(false);
        });
    }
  };

  // Compute country intelligence from the already-fetched events
  const data = useMemo(() => {
    if (!countryName || !allEvents.length) return null;

    const countryEvents = allEvents.filter(
      e => e.country && e.country.toLowerCase() === countryName.toLowerCase()
    );

    if (countryEvents.length === 0) return null;

    // Category breakdown
    const categoryBreakdown = {};
    let totalSeverity = 0;
    countryEvents.forEach(e => {
      categoryBreakdown[e.category] = (categoryBreakdown[e.category] || 0) + 1;
      totalSeverity += (e.severity || 0);
    });

    const avgSeverity = totalSeverity / countryEvents.length;

    // Stability score: lower severity → higher stability
    // severity is 1-5, invert to 0-100 scale
    const stabilityScore = Math.round(Math.max(0, Math.min(100, (1 - avgSeverity / 5) * 100)));
    const stabilityLabel = stabilityScore >= 70 ? 'Stable' : stabilityScore >= 40 ? 'Moderate' : 'Unstable';

    return {
      event_count: countryEvents.length,
      avg_severity: avgSeverity.toFixed(1),
      stability: { score: stabilityScore, label: stabilityLabel },
      category_breakdown: categoryBreakdown,
      recent_events: countryEvents.slice(0, 6),
    };
  }, [countryName, allEvents]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full md:w-[420px] z-50 glass-panel overflow-y-auto"
            data-testid="country-intel-panel"
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--cat-political)]">Country Intelligence</span>
                  <h2 className="text-2xl font-bold tracking-tight mt-1" data-testid="country-name">{countryName}</h2>
                  {lat !== undefined && lng !== undefined && lat !== null && lng !== null && (
                    <div className="mt-3 space-y-2">
                      {/* Location breakdown */}
                      {(city || state || countryLabel) && (
                        <div className="glass-light rounded-lg p-3 space-y-1.5">
                          <div className="flex items-center gap-1.5 mb-2">
                            <Navigation className="w-3 h-3 text-[var(--cat-political)]" />
                            <span className="text-[9px] uppercase tracking-[0.15em] font-mono text-[var(--text-muted)]">Location</span>
                          </div>
                          {city && (
                            <div className="flex items-center justify-between text-xs font-mono">
                              <span className="text-[var(--text-muted)]">City</span>
                              <span className="text-[var(--text-primary)]">{city}</span>
                            </div>
                          )}
                          {state && (
                            <div className="flex items-center justify-between text-xs font-mono">
                              <span className="text-[var(--text-muted)]">State</span>
                              <span className="text-[var(--text-primary)]">{state}</span>
                            </div>
                          )}
                          {countryLabel && (
                            <div className="flex items-center justify-between text-xs font-mono">
                              <span className="text-[var(--text-muted)]">Country</span>
                              <span className="text-[var(--text-primary)]">{countryLabel}</span>
                            </div>
                          )}
                        </div>
                      )}
                      {/* Coordinates */}
                      <div className="flex gap-3">
                        <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-secondary)] bg-white/5 px-2 py-1 rounded-md border border-white/5">
                          <MapPin className="w-3 h-3 text-[var(--cat-political)]" />
                          <span className="text-[var(--text-muted)]">LAT</span>
                          <span className="text-[var(--text-primary)]">{lat.toFixed(4)}°</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-secondary)] bg-white/5 px-2 py-1 rounded-md border border-white/5">
                          <MapPin className="w-3 h-3 text-[var(--cat-economic)]" />
                          <span className="text-[var(--text-muted)]">LON</span>
                          <span className="text-[var(--text-primary)]">{lng.toFixed(4)}°</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <button onClick={onClose} className="glass-light p-2 rounded-md hover:bg-[var(--bg-elevated)] transition-colors" data-testid="country-panel-close-btn">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {data ? (
                <>
                  {/* AI-Generated Intelligence */}
                  {loadingIntel ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="glass-light rounded-lg p-4 flex items-center gap-3"
                    >
                      <Loader2 className="w-4 h-4 animate-spin text-[var(--cat-economic)]" />
                      <span className="text-xs text-[var(--text-secondary)]">Analyzing intelligence...</span>
                    </motion.div>
                  ) : intelError ? (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-light rounded-lg p-4 border border-red-500/20 bg-red-500/5"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="w-3 h-3 text-red-400" />
                        <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-red-400">Analysis Failed</span>
                      </div>
                      <p className="text-xs text-red-300 mb-3">{intelError}</p>
                      <button
                        onClick={retryFetchIntel}
                        disabled={loadingIntel}
                        className="w-full text-xs py-1.5 px-2 rounded bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-colors disabled:opacity-50 font-mono"
                      >
                        {loadingIntel ? 'Retrying...' : 'Retry Analysis'}
                      </button>
                    </motion.div>
                  ) : aiIntel ? (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="space-y-3"
                    >
                      {/* Stability Assessment */}
                      {aiIntel.stability_assessment && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                          className="glass-light rounded-lg p-4 border border-[var(--cat-economic)]/20 hover:border-[var(--cat-economic)]/40 transition-colors"
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <Shield className="w-3 h-3 text-[var(--cat-economic)] animate-pulse" />
                            <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--cat-economic)] font-semibold">Stability Assessment</span>
                          </div>
                          <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-xs text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap"
                          >
                            {aiIntel.stability_assessment}
                          </motion.p>
                        </motion.div>
                      )}

                      {/* Key Risks & Opportunities */}
                      {aiIntel.key_risks_and_opportunities && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                          className="glass-light rounded-lg p-4 border border-[var(--cat-conflict)]/20 hover:border-[var(--cat-conflict)]/40 transition-colors"
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <AlertTriangle className="w-3 h-3 text-[var(--cat-conflict)] animate-pulse" />
                            <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--cat-conflict)] font-semibold">Risks & Opportunities</span>
                          </div>
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                          >
                            {typeof aiIntel.key_risks_and_opportunities === 'string' ? (
                              aiIntel.key_risks_and_opportunities.split('\n• ').map((item, idx) => (
                                <motion.div
                                  key={idx}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: 0.3 + idx * 0.1 }}
                                  className="text-xs text-[var(--text-primary)] leading-relaxed mb-2 flex gap-2"
                                >
                                  <span className="text-[var(--cat-conflict)] font-mono">•</span>
                                  <span>{item.trim()}</span>
                                </motion.div>
                              ))
                            ) : (
                              <p className="text-xs text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap">
                                {String(aiIntel.key_risks_and_opportunities)}
                              </p>
                            )}
                          </motion.div>
                        </motion.div>
                      )}

                      {/* Recommended Monitoring Areas */}
                      {aiIntel.recommended_monitoring_areas && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                          className="glass-light rounded-lg p-4 border border-[var(--cat-political)]/20 hover:border-[var(--cat-political)]/40 transition-colors"
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <Navigation className="w-3 h-3 text-[var(--cat-political)] animate-pulse" />
                            <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--cat-political)] font-semibold">Monitoring Areas</span>
                          </div>
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                          >
                            {typeof aiIntel.recommended_monitoring_areas === 'string' ? (
                              aiIntel.recommended_monitoring_areas.split('\n• ').map((item, idx) => (
                                <motion.div
                                  key={idx}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: 0.4 + idx * 0.1 }}
                                  className="text-xs text-[var(--text-primary)] leading-relaxed mb-2 flex gap-2"
                                >
                                  <span className="text-[var(--cat-political)] font-mono">→</span>
                                  <span>{item.trim()}</span>
                                </motion.div>
                              ))
                            ) : (
                              <p className="text-xs text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap">
                                {String(aiIntel.recommended_monitoring_areas)}
                              </p>
                            )}
                          </motion.div>
                        </motion.div>
                      )}
                    </motion.div>
                  ) : null}

                  {/* Stability Index */}
                  <div className="glass-light rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Shield className="w-3 h-3 text-[var(--text-secondary)]" />
                      <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--text-secondary)]">Stability Index</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <StabilityGauge score={data.stability.score} label={data.stability.label} />
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between text-[10px] font-mono">
                          <span className="text-[var(--text-muted)]">Events</span>
                          <span>{data.event_count}</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-mono">
                          <span className="text-[var(--text-muted)]">Avg Severity</span>
                          <span>{data.avg_severity}/5</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category Breakdown */}
                  <div className="glass-light rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <BarChart3 className="w-3 h-3 text-[var(--text-secondary)]" />
                      <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--text-secondary)]">Event Breakdown</span>
                    </div>
                    <div className="space-y-2.5">
                      {Object.entries(data.category_breakdown).map(([cat, count]) => (
                        <CategoryBar key={cat} category={cat} count={count} total={data.event_count} />
                      ))}
                    </div>
                  </div>

                  {/* Recent Events */}
                  {data.recent_events.length > 0 && (
                    <div className="space-y-3">
                      <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--text-secondary)]">Recent Events</span>
                      <div className="space-y-1.5">
                        {data.recent_events.map((evt, idx) => (
                          <div key={idx} className="glass-light rounded-md px-3 py-2 flex items-start gap-2" data-testid={`country-event-${idx}`}>
                            <div
                              className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                              style={{ backgroundColor: CATEGORY_COLORS[evt.category] || '#3B82F6' }}
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-medium leading-snug line-clamp-2">{evt.title}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] text-[var(--text-muted)] font-mono">{evt.source_name || evt.sources?.[0]?.name || ''}</span>
                                <span className="text-[10px] text-[var(--text-muted)] font-mono flex items-center gap-1">
                                  <MapPin className="w-2.5 h-2.5" />
                                  {evt.type}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12 text-sm text-[var(--text-muted)]">
                  No intelligence data available for this country.
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
