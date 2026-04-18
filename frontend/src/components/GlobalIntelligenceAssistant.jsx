import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Brain, AlertTriangle, TrendingUp, Zap, Loader2, BarChart3 } from 'lucide-react';

/**
 * GlobalIntelligenceAssistant — AI-Powered Global Intelligence Dashboard
 * Provides hotspot analysis, trend tracking, risk assessment, and strategic recommendations
 */

export default function GlobalIntelligenceAssistant({ isOpen, onClose, events = [] }) {
  const [selectedTab, setSelectedTab] = useState('hotspots');
  const [loading, setLoading] = useState(false);

  // Compute global intelligence metrics from events
  const computeMetrics = () => {
    const metrics = {
      hotspots: events
        .filter(e => (e.severity || 0) >= 4)
        .sort((a, b) => (b.severity || 0) - (a.severity || 0))
        .slice(0, 5)
        .map(e => ({
          country: e.country,
          event: e.title,
          severity: e.severity,
          category: e.category,
        })),
      
      trends: {
        'Armed Conflict': events.filter(e => e.category === 'Armed Conflict').length,
        'Terrorism & Security': events.filter(e => e.category === 'Terrorism & Security').length,
        'Politics': events.filter(e => e.category === 'Politics').length,
        'Diplomacy': events.filter(e => e.category === 'Diplomacy').length,
        'Diplomacy & Sanctions': events.filter(e => e.category === 'Diplomacy & Sanctions').length,
        'Humanitarian': events.filter(e => e.category === 'Humanitarian').length,
        'Economic & Trade': events.filter(e => e.category === 'Economic & Trade').length,
      },

      riskLevels: {
        global_stability: Math.round(100 - Math.min(50, (events.filter(e => (e.severity || 0) >= 4).length * 10))),
        conflict_presence: events.filter(e => e.category === 'Armed Conflict').length > 0,
        economic_stress: events.filter(e => e.category === 'Economic & Trade').length > 5,
        humanitarian_crisis: events.filter(e => e.category === 'Humanitarian').length > 3,
      },

      recommendations: [
        'Monitor active conflict zones for escalation patterns',
        'Track economic disruptions that could affect markets',
        'Assess humanitarian responses and resource allocation',
        'Watch diplomatic developments for resolution opportunities',
        'Monitor cyber threats in critical infrastructure sectors',
      ],
    };

    return metrics;
  };

  const metrics = computeMetrics();

  const getStabilityColor = (value) => {
    if (value >= 75) return { color: '#22C55E', label: 'STABLE' };
    if (value >= 50) return { color: '#F59E0B', label: 'MODERATE' };
    return { color: '#FF3B30', label: 'CRITICAL' };
  };

  const getMaxTrends = () => Math.max(1, ...Object.values(metrics.trends));

  const Gauge = ({ value, label, unit = '%' }) => {
    const circumference = 2 * Math.PI * 35;
    const strokeDashoffset = circumference - (Math.min(100, value) / 100) * circumference;
    const color = getStabilityColor(value).color;

    return (
      <div className="flex flex-col items-center gap-2">
        <div className="relative w-24 h-24">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r="35"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="4"
              fill="none"
            />
            <circle
              cx="40"
              cy="40"
              r="35"
              stroke={color}
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: 'stroke-dashoffset 1s ease-out' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-mono font-bold text-center" style={{ color }}>
              {Math.round(value)}{unit}
            </span>
          </div>
        </div>
        <span className="text-xs font-mono text-[var(--text-muted)] text-center leading-tight">{label}</span>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed inset-8 z-50 glass-panel rounded-xl overflow-hidden flex flex-col max-h-[90vh]"
          data-testid="global-intel-panel"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-[var(--border-default)] flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <Brain className="w-5 h-5 text-[var(--cat-economic)]" />
              <div>
                <h2 className="text-lg font-bold tracking-tight" style={{ fontFamily: 'Chivo' }}>
                  Global Intelligence
                </h2>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">AI-powered geopolitical analysis</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 glass-light rounded-md hover:bg-[var(--bg-elevated)]"
              data-testid="intel-close-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="px-6 pt-4 flex gap-2 border-b border-[var(--border-default)] overflow-x-auto flex-shrink-0">
            {['hotspots', 'trends', 'risk', 'recommendations'].map(tab => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-4 py-2 text-xs uppercase tracking-widest font-mono whitespace-nowrap rounded-t-md transition-all ${
                  selectedTab === tab
                    ? 'bg-[var(--bg-elevated)] text-[var(--cat-economic)] border-b-2 border-[var(--cat-economic)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                }`}
              >
                {tab === 'hotspots' && '🔥 Hotspots'}
                {tab === 'trends' && '📊 Trends'}
                {tab === 'risk' && '⚠️ Risk'}
                {tab === 'recommendations' && '💡 Recommendations'}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center space-y-3">
                  <Loader2 className="w-8 h-8 animate-spin text-[var(--cat-economic)] mx-auto" />
                  <p className="text-sm text-[var(--text-secondary)] font-mono">Analyzing global intelligence...</p>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={selectedTab}
              >
                {/* Hotspots Tab */}
                {selectedTab === 'hotspots' && (
                  <div className="space-y-3">
                    {metrics.hotspots.length > 0 ? (
                      metrics.hotspots.map((spot, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="glass-light rounded-lg p-4 border-l-2 border-red-500/50"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-bold">{spot.country}</span>
                                <span className="text-xs px-2 py-1 rounded-sm bg-red-500/20 text-red-400 font-mono">
                                  {spot.severity}/5
                                </span>
                              </div>
                              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{spot.event}</p>
                              <span className="text-[9px] uppercase tracking-widest font-mono text-[var(--text-muted)] mt-2 block">
                                {spot.category}
                              </span>
                            </div>
                            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-1" />
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-[var(--text-muted)]">
                        No critical hotspots detected
                      </div>
                    )}
                  </div>
                )}

                {/* Trends Tab */}
                {selectedTab === 'trends' && (
                  <div className="space-y-4">
                    {Object.entries(metrics.trends)
                      .sort(([, a], [, b]) => b - a)
                      .map(([category, count]) => (
                        <motion.div
                          key={category}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="glass-light rounded-lg p-3"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs uppercase tracking-widest font-mono text-[var(--text-secondary)]">
                              {category}
                            </span>
                            <span className="text-sm font-mono font-bold text-[var(--cat-economic)]">{count}</span>
                          </div>
                          <div className="h-2 rounded-full bg-[var(--bg-elevated)] overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(count / getMaxTrends()) * 100}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                              className="h-full bg-gradient-to-r from-[var(--cat-economic)] to-[var(--cat-economic)]/60"
                            />
                          </div>
                        </motion.div>
                      ))}
                  </div>
                )}

                {/* Risk Tab */}
                {selectedTab === 'risk' && (
                  <div>
                    <div className="grid grid-cols-2 gap-6 mb-8">
                      <Gauge
                        value={metrics.riskLevels.global_stability}
                        label="Global Stability"
                      />
                      <div className="flex flex-col justify-center space-y-3">
                        <div className="glass-light rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`w-2 h-2 rounded-full`} style={{
                              backgroundColor: metrics.riskLevels.conflict_presence ? '#FF3B30' : '#22C55E'
                            }} />
                            <span className="text-xs font-mono">Active Conflicts</span>
                          </div>
                          <p className="text-xs text-[var(--text-muted)]">
                            {metrics.riskLevels.conflict_presence ? 'Multiple zones' : 'Minimal'}
                          </p>
                        </div>
                        <div className="glass-light rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`w-2 h-2 rounded-full`} style={{
                              backgroundColor: metrics.riskLevels.economic_stress ? '#F59E0B' : '#22C55E'
                            }} />
                            <span className="text-xs font-mono">Economic Disruption</span>
                          </div>
                          <p className="text-xs text-[var(--text-muted)]">
                            {metrics.riskLevels.economic_stress ? 'Significant' : 'Stable'}
                          </p>
                        </div>
                        <div className="glass-light rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`w-2 h-2 rounded-full`} style={{
                              backgroundColor: metrics.riskLevels.humanitarian_crisis ? '#FF8A00' : '#22C55E'
                            }} />
                            <span className="text-xs font-mono">Humanitarian Need</span>
                          </div>
                          <p className="text-xs text-[var(--text-muted)]">
                            {metrics.riskLevels.humanitarian_crisis ? 'Critical' : 'Manageable'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="glass-light rounded-lg p-4">
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        <span className="font-mono text-[var(--cat-economic)]">Overall Assessment:</span> Global stability is currently{' '}
                        <span style={{ color: getStabilityColor(metrics.riskLevels.global_stability).color }} className="font-bold">
                          {getStabilityColor(metrics.riskLevels.global_stability).label.toLowerCase()}
                        </span>
                        . Continue monitoring developments in conflict zones and economic indicators.
                      </p>
                    </div>
                  </div>
                )}

                {/* Recommendations Tab */}
                {selectedTab === 'recommendations' && (
                  <div className="space-y-3">
                    {metrics.recommendations.map((rec, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass-light rounded-lg p-4 flex gap-3"
                      >
                        <Zap className="w-4 h-4 text-[var(--cat-economic)] flex-shrink-0 mt-0.5" />
                        <p className="text-xs leading-relaxed">{rec}</p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Footer Stats */}
          <div className="px-6 py-3 border-t border-[var(--border-default)] bg-[var(--bg-elevated)]/30 text-xs font-mono text-[var(--text-muted)] flex justify-between flex-shrink-0">
            <span>Active Events: {events.length}</span>
            <span>Alert Level: {getStabilityColor(metrics.riskLevels.global_stability).label}</span>
            <span>Updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
