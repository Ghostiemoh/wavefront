"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  AlertTriangle,
  ArrowRight,
  Clock,
  BarChart3,
  Users,
  Minus,
  Star,
  X,
} from "lucide-react";
import type { NarrativeEvent } from "@/lib/intelligence/types";
import type { TrendingToken, NewListingToken } from "@/lib/birdeye/types";
import { formatCurrency, formatPercentage, shortenAddress } from "@/lib/formatters";
import { getWatchlist, removeFromWatchlist } from "@/lib/watchlist";

/* ─── Narrative Card ──────────────────────────────────────────────── */

function NarrativeCard({ narrative }: { narrative: NarrativeEvent }) {
  const VelIcon =
    narrative.velocity === "accelerating"
      ? TrendingUp
      : narrative.velocity === "decelerating"
      ? TrendingDown
      : Minus;

  const velColor =
    narrative.velocity === "accelerating"
      ? "text-accent-emerald"
      : narrative.velocity === "decelerating"
      ? "text-accent-red"
      : "text-accent-amber";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.25 }}
      className="glow-card gradient-border p-5 sm:p-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-medium px-2 py-0.5 rounded badge-ai">
              Narrative Surge
            </span>
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                narrative.confidence === "High"
                  ? "badge-bullish"
                  : narrative.confidence === "Medium"
                  ? "badge-neutral"
                  : "badge-bearish"
              }`}
            >
              {narrative.confidence}
            </span>
          </div>
          <h3 className="text-lg font-bold text-text-primary">{narrative.category}</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <VelIcon className={`w-4 h-4 ${velColor}`} />
          <span className="text-xs text-text-secondary capitalize">{narrative.velocity}</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="p-2.5 rounded-lg bg-bg-elevated/50">
          <p className="text-[10px] text-text-muted mb-0.5 uppercase tracking-wider">
            Cluster Vol
          </p>
          <p className="text-sm font-mono font-semibold text-accent-emerald">
            {formatCurrency(
              narrative.topTokens.reduce((sum, t) => sum + t.volume24h, 0),
              true
            )}
          </p>
        </div>
        <div className="p-2.5 rounded-lg bg-bg-elevated/50">
          <p className="text-[10px] text-text-muted mb-0.5 uppercase tracking-wider">Tokens</p>
          <p className="text-sm font-mono font-semibold text-text-primary">
            {narrative.correlatedTokenCount}
          </p>
        </div>
        <div className="p-2.5 rounded-lg bg-bg-elevated/50">
          <p className="text-[10px] text-text-muted mb-0.5 uppercase tracking-wider">Score</p>
          <p className="text-sm font-mono font-semibold text-accent-cyan">
            {(narrative.confidenceScore * 100).toFixed(0)}
          </p>
        </div>
      </div>

      {/* Top Tokens */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto scrollbar-hide">
        {narrative.topTokens.slice(0, 4).map((token) => (
          <Link
            key={token.address}
            href={`/verdict/${token.address}`}
            className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-bg-elevated border border-border text-xs hover:border-border-active transition-colors cursor-pointer"
          >
            {token.logoURI && (
              <img
                src={token.logoURI}
                alt={token.symbol}
                className="w-4 h-4 rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            )}
            <span className="font-medium text-text-primary">{token.symbol}</span>
            {token.priceChange24h !== 0 ? (
              <span
                className={`font-mono ${
                  token.priceChange24h >= 0 ? "text-accent-emerald" : "text-accent-red"
                }`}
              >
                {token.priceChange24h >= 0 ? "+" : ""}
                {token.priceChange24h.toFixed(1)}%
              </span>
            ) : (
              <span className="font-mono text-text-muted">
                {formatCurrency(token.volume24h, true)}
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* Why This Matters */}
      <div className="p-3 rounded-lg border bg-accent-cyan/4 border-accent-cyan/10">
        <p className="text-[10px] text-accent-cyan font-medium uppercase tracking-wider mb-1">
          Why This Matters
        </p>
        <p className="text-xs text-text-secondary leading-relaxed">{narrative.whyThisMatters}</p>
      </div>
    </motion.div>
  );
}

/* ─── Trending Token Strip ────────────────────────────────────────── */

function TrendingStrip({ tokens }: { tokens: TrendingToken[] }) {
  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
      {tokens.map((token, index) => {
        const priceChange = token.priceChange24hPercent;
        const volume = token.v24hUSD ?? token.volume24hUSD ?? 0;
        const hasPriceData =
          priceChange !== null && priceChange !== undefined && priceChange !== 0;

        return (
          <Link
            key={token.address}
            href={`/verdict/${token.address}`}
            className="shrink-0 flex items-center gap-3 px-4 py-3 rounded-xl bg-bg-surface border border-border hover:border-border-active transition-all cursor-pointer group"
          >
            <span className="text-xs font-mono text-text-muted">#{index + 1}</span>
            <div className="flex items-center gap-2">
              {token.logoURI && (
                <img
                  src={token.logoURI}
                  alt={token.symbol}
                  className="w-6 h-6 rounded-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              )}
              <div>
                <p className="text-sm font-semibold text-text-primary group-hover:text-accent-cyan transition-colors">
                  {token.symbol}
                </p>
                <p className="text-[10px] text-text-muted font-mono">
                  {formatCurrency(volume, true)} vol
                </p>
              </div>
            </div>
            {hasPriceData ? (
              <span
                className={`text-xs font-mono font-medium ${
                  priceChange >= 0 ? "text-accent-emerald" : "text-accent-red"
                }`}
              >
                {formatPercentage(priceChange)}
              </span>
            ) : token.mc ? (
              <span className="text-xs font-mono text-text-secondary">
                {formatCurrency(token.mc, true)}
              </span>
            ) : null}
          </Link>
        );
      })}
    </div>
  );
}

/* ─── New Listing Card ────────────────────────────────────────────── */

function NewListingCard({ token }: { token: NewListingToken }) {
  return (
    <Link
      href={`/verdict/${token.address}`}
      className="flex items-center justify-between p-3.5 rounded-xl bg-bg-surface border border-border hover:border-border-active transition-colors cursor-pointer group"
    >
      <div className="flex items-center gap-3">
        {token.logoURI ? (
          <img
            src={token.logoURI}
            alt={token.symbol}
            className="w-8 h-8 rounded-full"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-bg-elevated flex items-center justify-center text-xs font-bold text-text-muted">
            {token.symbol?.charAt(0) ?? "?"}
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-text-primary group-hover:text-accent-cyan transition-colors">
            {token.symbol}
          </p>
          <p className="text-xs text-text-muted truncate max-w-[120px]">{token.name}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 text-xs font-mono">
        <div className="text-right">
          <p className="text-text-secondary">{formatCurrency(token.liquidity, true)}</p>
          <p className="text-text-muted">liq</p>
        </div>
        <ArrowRight className="w-3.5 h-3.5 text-text-muted group-hover:text-accent-cyan transition-colors" />
      </div>
    </Link>
  );
}

/* ─── Watchlist Strip ─────────────────────────────────────────────── */

function WatchlistStrip({
  mints,
  onRemove,
}: {
  mints: string[];
  onRemove: (mint: string) => void;
}) {
  if (mints.length === 0) return null;
  return (
    <section className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Star className="w-4 h-4 text-accent-amber" />
        <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
          Your Watchlist
        </h2>
        <span className="text-xs font-mono text-text-muted">({mints.length})</span>
      </div>
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {mints.map((mint) => (
          <div
            key={mint}
            className="shrink-0 flex items-center gap-2 pl-3 pr-2 py-2 rounded-xl bg-bg-surface border border-border hover:border-border-active transition-all"
          >
            <Link
              href={`/verdict/${mint}`}
              className="text-xs font-mono text-text-secondary hover:text-accent-cyan transition-colors cursor-pointer"
            >
              {shortenAddress(mint, 4)}
            </Link>
            <button
              type="button"
              onClick={() => onRemove(mint)}
              aria-label="Remove from watchlist"
              className="p-0.5 rounded text-text-muted hover:text-accent-red transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Feed Page ───────────────────────────────────────────────────── */

export default function FeedPage() {
  const [narratives, setNarratives] = useState<NarrativeEvent[]>([]);
  const [trending, setTrending] = useState<TrendingToken[]>([]);
  const [newListings, setNewListings] = useState<NewListingToken[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [narrativeError, setNarrativeError] = useState(false);
  const [watchlist, setWatchlist] = useState<string[]>([]);

  useEffect(() => {
    setWatchlist(getWatchlist());
  }, []);

  function handleRemoveFromWatchlist(mint: string) {
    removeFromWatchlist(mint);
    setWatchlist((prev) => prev.filter((m) => m !== mint));
  }

  const fetchAll = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [nRes, tRes, lRes] = await Promise.allSettled([
        fetch("/api/intelligence/narratives").then((r) => r.json()),
        fetch("/api/intelligence/trending").then((r) => r.json()),
        fetch("/api/intelligence/new-listings").then((r) => r.json()),
      ]);

      if (nRes.status === "fulfilled" && nRes.value.success) {
        setNarratives(nRes.value.data);
        setNarrativeError(false);
      } else {
        setNarrativeError(true);
      }

      if (tRes.status === "fulfilled" && tRes.value.success) {
        setTrending(tRes.value.data);
      }

      if (lRes.status === "fulfilled" && lRes.value.success) {
        const validListings = (lRes.value.data as NewListingToken[]).filter(
          (token) => token.liquidity > 100
        );
        setNewListings(validListings);
      }

      setLastRefresh(new Date().toLocaleTimeString());
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 30000);

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") fetchAll();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [fetchAll]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="live-dot" />
            <h1 className="text-2xl font-bold text-text-primary">Intelligence Feed</h1>
          </div>
          <p className="text-sm text-text-secondary">
            Real-time narrative intelligence from Birdeye data streams.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-text-muted font-mono flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {lastRefresh ?? "--:--:--"}
          </span>
          <button
            type="button"
            onClick={fetchAll}
            disabled={isRefreshing}
            className="p-2 rounded-lg border border-border hover:border-border-active hover:bg-bg-hover transition-colors cursor-pointer disabled:opacity-50"
            aria-label="Refresh feed"
          >
            <RefreshCw
              className={`w-4 h-4 text-text-secondary ${isRefreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Watchlist Strip */}
      <WatchlistStrip mints={watchlist} onRemove={handleRemoveFromWatchlist} />

      {/* Trending Strip */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="w-4 h-4 text-accent-cyan" />
          <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
            Trending
          </h2>
        </div>
        {isLoading ? (
          <>
            <p className="text-xs text-text-muted font-mono animate-pulse mb-3">
              Fetching trending tokens from Birdeye...
            </p>
            <div className="flex gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skeleton w-48 h-16 shrink-0" />
              ))}
            </div>
          </>
        ) : (
          <TrendingStrip tokens={trending} />
        )}
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Narrative Surges — 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-accent-violet" />
            <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
              Narrative Surges
            </h2>
          </div>

          {isLoading ? (
            <>
              <p className="text-xs text-text-muted font-mono animate-pulse">
                Clustering narrative tokens across Birdeye streams...
              </p>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="skeleton h-56" />
                ))}
              </div>
            </>
          ) : narrativeError ? (
            <div className="p-4 rounded-xl border bg-accent-amber/5 border-accent-amber/20 text-accent-amber text-xs font-mono">
              Narrative feed unavailable — Birdeye API may be rate limited. Auto-retrying every
              30s.
            </div>
          ) : narratives.length === 0 ? (
            <div className="p-12 rounded-xl bg-bg-surface border border-border text-center">
              <p className="text-text-muted text-sm">
                No active narrative surges detected. Monitoring...
              </p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {narratives.map((narrative) => (
                <NarrativeCard key={narrative.id} narrative={narrative} />
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Sidebar — New Listings — 1/3 width */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-accent-amber" />
            <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
              New Listings
            </h2>
          </div>

          {isLoading ? (
            <>
              <p className="text-xs text-text-muted font-mono animate-pulse mb-3">
                Scanning new listings with liquidity &gt; $100...
              </p>
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="skeleton h-14" />
                ))}
              </div>
            </>
          ) : newListings.length === 0 ? (
            <div className="p-8 rounded-xl bg-bg-surface border border-border text-center">
              <p className="text-text-muted text-sm">No new listings found.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {newListings.slice(0, 12).map((token) => (
                <NewListingCard key={token.address} token={token} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
