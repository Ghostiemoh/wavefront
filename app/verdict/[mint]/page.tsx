"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Droplets,
  Users,
  BarChart3,
  Lock,
  Bookmark,
  BookmarkCheck,
  Info,
} from "lucide-react";
import type { RiskVerdict } from "@/lib/intelligence/types";
import { shortenAddress } from "@/lib/formatters";
import { Copilot } from "@/components/intelligence/Copilot";
import { isWatchlisted, toggleWatchlist } from "@/lib/watchlist";

const TokenChart = dynamic(
  () => import("@/components/intelligence/TokenChart").then((m) => m.TokenChart),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-64 skeleton rounded-xl shrink-0" />
    ),
  }
);

function RiskGauge({ grade, score }: { grade: string; score: number }) {
  const gradeClass = grade.startsWith("A")
    ? "grade-a"
    : grade.startsWith("B")
    ? "grade-b"
    : grade.startsWith("C")
    ? "grade-c"
    : grade === "D"
    ? "grade-d"
    : "grade-f";
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-40 h-40 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60" cy="60" r="54"
          stroke="currentColor" strokeWidth="6" fill="none"
          className="text-bg-elevated"
        />
        <motion.circle
          cx="60" cy="60" r="54"
          stroke="currentColor" strokeWidth="6" fill="none"
          className={gradeClass}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1] as const }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-3xl font-bold ${gradeClass}`}>{grade}</span>
        <span className="text-sm font-mono text-text-secondary">{score}/100</span>
      </div>
    </div>
  );
}

function ScoreBar({
  label,
  score,
  icon: Icon,
  tooltip,
}: {
  label: string;
  score: number;
  icon: React.ElementType;
  tooltip: string;
}) {
  const color =
    score >= 70 ? "bg-accent-emerald" : score >= 40 ? "bg-accent-amber" : "bg-accent-red";
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 min-w-0" title={tooltip}>
          <Icon className="w-3.5 h-3.5 text-text-muted shrink-0" />
          <span className="text-xs font-medium text-text-secondary whitespace-nowrap overflow-hidden text-ellipsis">
            {label}
          </span>
          <Info className="w-3 h-3 text-text-muted shrink-0 opacity-60 cursor-help" />
        </div>
        <span className="text-xs font-mono text-text-primary ml-2">{score}</span>
      </div>
      <div className="h-1.5 rounded-full bg-bg-elevated overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export default function VerdictPage() {
  const params = useParams();
  const mint = params.mint as string;
  const [verdict, setVerdict] = useState<RiskVerdict | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkFlash, setBookmarkFlash] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (mint) setBookmarked(isWatchlisted(mint));
  }, [mint]);

  useEffect(() => {
    if (!mint) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    fetch(`/api/verdict/${mint}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setVerdict(json.data);
        else setError(json.error || "Failed to generate verdict");
      })
      .catch(() => setError("Network error"))
      .finally(() => setIsLoading(false));
  }, [mint]);

  function handleBookmark() {
    const next = toggleWatchlist(mint);
    setBookmarked(next);
    setBookmarkFlash(true);
    setTimeout(() => setBookmarkFlash(false), 1800);
  }

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] pt-24 pb-12 px-6 max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-bg-elevated animate-pulse" />
          <div className="space-y-2">
            <div className="w-48 h-8 bg-bg-elevated rounded animate-pulse" />
            <div className="w-32 h-4 bg-bg-elevated rounded animate-pulse" />
          </div>
        </div>
        <p className="text-xs text-text-muted font-mono animate-pulse">
          Fetching onchain data and generating risk verdict...
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
          <div className="lg:col-span-2 space-y-6 h-full flex flex-col">
            <div className="w-full h-64 bg-bg-surface border border-border rounded-xl animate-pulse shrink-0" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
              <div className="w-full h-full bg-bg-surface border border-border rounded-xl animate-pulse" />
              <div className="w-full h-full bg-bg-surface border border-border rounded-xl animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col gap-6 h-full">
            <div className="w-full h-[220px] bg-bg-surface border border-border rounded-xl animate-pulse shrink-0" />
            <div className="flex-1 w-full bg-bg-surface border border-border rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !verdict) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <XCircle className="w-12 h-12 text-accent-red mx-auto mb-4" />
        <h1 className="text-xl font-bold text-text-primary mb-2">Verdict Unavailable</h1>
        <p className="text-text-secondary mb-6">{error || "Unable to analyze this token."}</p>
        <Link
          href="/feed"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-surface border border-border text-sm text-text-primary hover:border-border-active transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Feed
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/feed"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Feed
        </Link>

        {/* Token Header */}
        <div className="flex items-center gap-4 mb-8">
          {verdict.logoURI ? (
            <Image
              src={verdict.logoURI}
              alt={verdict.symbol}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full"
              unoptimized
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-bg-elevated flex items-center justify-center text-lg font-bold text-text-muted">
              {verdict.symbol?.charAt(0)}
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-text-primary">{verdict.name}</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-text-secondary">{verdict.symbol}</span>
              <span className="text-xs font-mono text-text-muted">
                {shortenAddress(verdict.address, 6)}
              </span>
            </div>
          </div>

          {/* Watchlist button */}
          <div className="relative">
            <button
              onClick={handleBookmark}
              aria-label={bookmarked ? "Remove from watchlist" : "Add to watchlist"}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                bookmarked
                  ? "border-accent-cyan/40 bg-accent-cyan/10 text-accent-cyan"
                  : "border-border text-text-muted hover:border-border-active hover:text-text-primary"
              }`}
            >
              {bookmarked ? (
                <BookmarkCheck className="w-4 h-4" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">
                {bookmarked ? "Watchlisted" : "Watch"}
              </span>
            </button>
            {bookmarkFlash && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-mono px-2 py-1 rounded bg-bg-elevated border border-border text-accent-cyan"
              >
                {bookmarked ? "Added to watchlist" : "Removed from watchlist"}
              </motion.div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[700px] mb-8">
          {/* Left Column: Chart & Breakdown */}
          <div className="lg:col-span-2 flex flex-col gap-6 h-full">
            <div className="shrink-0">
              <TokenChart mint={mint} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-[250px]">
              <div className="glow-card p-6 flex flex-col">
                <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4 shrink-0">
                  Score Breakdown
                </h2>
                <div className="flex flex-col justify-between flex-1 gap-4">
                  <ScoreBar
                    label="Liquidity Depth"
                    score={verdict.liquidityScore}
                    icon={Droplets}
                    tooltip="Total liquidity vs. market cap. Low liquidity = easy to manipulate price."
                  />
                  <ScoreBar
                    label="Holder Dist."
                    score={verdict.holderScore}
                    icon={Users}
                    tooltip="Top 10 holder concentration. >70% in top 10 wallets signals rug risk."
                  />
                  <ScoreBar
                    label="Volume Auth."
                    score={verdict.volumeAuthenticityScore}
                    icon={BarChart3}
                    tooltip="Volume-to-liquidity ratio. >10× suggests wash trading or artificial volume."
                  />
                  <ScoreBar
                    label="Security"
                    score={verdict.securityScore}
                    icon={Lock}
                    tooltip="Checks freeze authority, locked liquidity, transfer fees, and mutable metadata."
                  />
                </div>
              </div>

              {verdict.flags.length > 0 && (
                <div className="glow-card p-6 flex flex-col h-full overflow-hidden">
                  <div className="flex items-center gap-2 mb-3 shrink-0">
                    <AlertTriangle className="w-4 h-4 text-accent-amber" />
                    <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
                      Security Flags
                    </h2>
                  </div>
                  <div className="space-y-2 overflow-y-auto flex-1 pr-2 custom-scrollbar">
                    {verdict.flags.map((flag, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 p-2.5 rounded-lg bg-bg-elevated/50 text-xs shrink-0"
                      >
                        {flag.toLowerCase().includes("locked") ||
                        flag.toLowerCase().includes("token-2022") ? (
                          <CheckCircle className="w-3.5 h-3.5 text-accent-emerald shrink-0" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-accent-amber shrink-0" />
                        )}
                        <span className="text-text-secondary">{flag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Risk & Copilot */}
          <div className="flex flex-col gap-6 h-full">
            <div className="glow-card gradient-border p-6 flex flex-col items-center justify-center shrink-0 min-h-[220px]">
              <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
                Risk Assessment
              </h2>
              <RiskGauge grade={verdict.overallGrade} score={verdict.overallScore} />
              <p className="text-[10px] text-text-muted mt-3 text-center font-mono">
                A+ = Safe · B = Moderate · C = Caution · D/F = High Risk
              </p>
            </div>

            <div className="flex-1 min-h-[400px]">
              <Copilot verdict={verdict} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
