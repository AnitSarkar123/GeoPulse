import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, BarChart3, AlertCircle, X, Search } from 'lucide-react';

/**
 * FinanceCorrelation — Fetches real market data from backend API
 * Shows live market prices for 10 stocks, with search and modal details
 */

export default function FinanceCorrelation() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [markets, setMarkets] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMarket, setSelectedMarket] = useState(null);

  useEffect(() => {
    const fetchMarkets = async () => {
      if (!isExpanded) return;
      
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/finance/markets');
        if (!response.ok) throw new Error('Failed to fetch markets');
        const data = await response.json();
        setMarkets(data.markets);
        setError(null);
      } catch (err) {
        console.error('Market fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMarkets();
  }, [isExpanded]);

  const filteredMarkets = markets
    ? Object.entries(markets).filter(([key, item]) => {
        const query = searchQuery.toLowerCase();
        return (
          item.symbol.toLowerCase().includes(query) ||
          (item.name && item.name.toLowerCase().includes(query))
        );
      })
    : [];

  return (
    <>
      {/* Main Panel */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`fixed top-38 right-4 z-30 glass-panel rounded-xl overflow-hidden transition-all ${isExpanded ? 'w-[320px]' : 'w-auto'}`}
        data-testid="finance-panel"
      >
        {!isExpanded ? (
          <button
            onClick={() => setIsExpanded(true)}
            className="p-3 hover:bg-[var(--bg-elevated)] transition-colors flex items-center gap-2"
            data-testid="finance-toggle-btn"
          >
            <BarChart3 className="w-4 h-4 text-[var(--cat-economic)]" />
            <span className="text-[10px] font-mono text-[var(--text-secondary)]">Markets</span>
          </button>
        ) : (
          <div>
            {/* Header */}
            <div className="px-4 py-3 border-b border-[var(--border-default)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-3 h-3 text-[var(--cat-economic)]" />
                <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[var(--text-secondary)]">Live Markets</span>
              </div>
              <button onClick={() => setIsExpanded(false)} className="text-[10px] text-[var(--text-muted)] hover:text-white">
                Collapse
              </button>
            </div>

            {/* Search Input */}
            <div className="px-4 py-3 border-b border-[var(--border-default)]">
              <div className="flex items-center gap-2 bg-[var(--bg-elevated)] rounded px-2 py-1.5">
                <Search className="w-3 h-3 text-[var(--text-muted)]" />
                <input
                  type="text"
                  placeholder="Search stocks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent flex-1 text-[10px] outline-none text-[var(--text-primary)] placeholder-[var(--text-muted)]"
                />
              </div>
            </div>

            {/* Content */}
            <div className="p-3 space-y-2 max-h-96 overflow-y-auto">
              {error && (
                <div className="flex items-start gap-2 p-2 bg-red-500/10 border border-red-500/30 rounded text-[10px] text-red-300">
                  <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
              
              {loading && (
                <div className="text-[10px] text-[var(--text-muted)] text-center py-4">Loading markets...</div>
              )}

              {!loading && filteredMarkets.length === 0 && markets && (
                <div className="text-[10px] text-[var(--text-muted)] text-center py-4">
                  {searchQuery ? 'No stocks found' : 'No market data available'}
                </div>
              )}

              {filteredMarkets.map(([key, item]) => {
                const isUp = item.change_pct > 0;
                const isDown = item.change_pct < 0;
                const Icon = isUp ? TrendingUp : isDown ? TrendingDown : Minus;
                const changeColor = isUp ? '#22C55E' : isDown ? '#FF3B30' : '#94A3B8';

                return (
                  <motion.button
                    key={key}
                    onClick={() => setSelectedMarket({ key, ...item })}
                    className="w-full text-left flex items-center gap-2 py-2 px-2 rounded hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    data-testid={`finance-${key}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-bold">{item.symbol}</span>
                        <Icon className="w-3 h-3" style={{ color: changeColor }} />
                      </div>
                      <div className="text-[8px] text-[var(--text-muted)]">{item.name}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-mono">${item.current_price?.toFixed(2)}</span>
                        <span className="text-[10px] font-mono" style={{ color: changeColor }}>
                          {isUp ? '+' : ''}{item.change_pct?.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </motion.button>
                );
              })}

              <div className="pt-2 border-t border-[var(--border-default)]">
                <span className="text-[9px] font-mono text-[var(--text-muted)]">10 Markets • Click for details</span>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Stock Detail Modal */}
      <AnimatePresence>
        {selectedMarket && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMarket(null)}
              className="fixed inset-0 bg-black/50 z-40"
            />

            {/* Modal - Centered */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="glass-panel rounded-xl p-6 w-full max-w-md shadow-2xl pointer-events-auto max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedMarket(null)}
                  className="absolute top-4 right-4 p-1 hover:bg-[var(--bg-elevated)] rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Header */}
                <div className="mb-4 pr-8">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-bold text-[var(--text-primary)]">{selectedMarket.symbol}</span>
                    {selectedMarket.change_pct > 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">{selectedMarket.name}</p>
                </div>

                {/* Price Section */}
                <div className="mb-6 pb-4 border-b border-[var(--border-default)]">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-3xl font-mono font-bold text-[var(--text-primary)]">
                      ${selectedMarket.current_price?.toFixed(2)}
                    </span>
                    <span
                      className="text-lg font-mono"
                      style={{
                        color:
                          selectedMarket.change_pct > 0
                            ? '#22C55E'
                            : selectedMarket.change_pct < 0
                            ? '#FF3B30'
                            : '#94A3B8',
                      }}
                    >
                      {selectedMarket.change_pct > 0 ? '+' : ''}
                      {selectedMarket.change_pct?.toFixed(2)}%
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">Last update: {new Date().toLocaleTimeString()}</p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="glass-light rounded p-3">
                    <div className="text-[10px] text-[var(--text-muted)] mb-1">Open</div>
                    <div className="text-sm font-mono font-bold text-[var(--text-primary)]">
                      ${selectedMarket.open?.toFixed(2)}
                    </div>
                  </div>
                  <div className="glass-light rounded p-3">
                    <div className="text-[10px] text-[var(--text-muted)] mb-1">High</div>
                    <div className="text-sm font-mono font-bold text-green-400">
                      ${selectedMarket.high?.toFixed(2)}
                    </div>
                  </div>
                  <div className="glass-light rounded p-3">
                    <div className="text-[10px] text-[var(--text-muted)] mb-1">Low</div>
                    <div className="text-sm font-mono font-bold text-red-400">
                      ${selectedMarket.low?.toFixed(2)}
                    </div>
                  </div>
                  <div className="glass-light rounded p-3">
                    <div className="text-[10px] text-[var(--text-muted)] mb-1">Change</div>
                    <div
                      className="text-sm font-mono font-bold"
                      style={{
                        color:
                          selectedMarket.change_pct > 0
                            ? '#22C55E'
                            : selectedMarket.change_pct < 0
                            ? '#FF3B30'
                            : '#94A3B8',
                      }}
                    >
                      {selectedMarket.change_pct > 0 ? '+' : ''}
                      {selectedMarket.change_pct?.toFixed(2)}%
                    </div>
                  </div>
                </div>

                {/* Chart Placeholder */}
                <div className="mb-4 p-4 bg-[var(--bg-elevated)] rounded-lg">
                  <div className="h-24 flex items-end justify-between gap-1 px-2">
                    {Array.from({ length: 20 }).map((_, i) => {
                      const height = Math.random() * 100;
                      const isAboveAvg = height > 50;
                      return (
                        <div
                          key={i}
                          className="flex-1 rounded-sm transition-colors"
                          style={{
                            height: `${height}%`,
                            backgroundColor: isAboveAvg
                              ? 'rgba(34, 197, 94, 0.6)'
                              : 'rgba(59, 130, 246, 0.6)',
                          }}
                        />
                      );
                    })}
                  </div>
                  <p className="text-[8px] text-[var(--text-muted)] text-center mt-2">24h Price Movement</p>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setSelectedMarket(null)}
                  className="w-full py-2 px-3 bg-[var(--bg-elevated)] hover:bg-[var(--cat-political)] text-[var(--text-primary)] text-xs rounded font-mono transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
