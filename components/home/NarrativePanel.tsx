"use client";

import Link from "next/link";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { NarrativeEvent } from "@/lib/intelligence/types";

interface Props {
  narratives: NarrativeEvent[];
}

export function NarrativePanel({ narratives }: Props) {
  const velIcon = (v: string) =>
    v === "accelerating" ? TrendingUp : v === "decelerating" ? TrendingDown : Minus;

  const velColor = (v: string) =>
    v === "accelerating"
      ? "text-accent-emerald"
      : v === "decelerating"
      ? "text-accent-red"
      : "text-accent-amber";

  return (
    <div className="card-shell h-full">
      <div className="card-core p-5 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <div className="flex items-center gap-2">
            <div className="live-dot" />
            <span className="text-[10px] font-mono text-text-muted uppercase tracking-[0.15em]">
              Live Narratives
            </span>
          </div>
          <Link
            href="/feed"
            className="text-[10px] font-mono text-accent-cyan/60 hover:text-accent-cyan transition-colors cursor-pointer"
          >
            View all →
          </Link>
        </div>

        <div className="flex flex-col gap-2 flex-1 overflow-hidden">
          {narratives.length === 0
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skeleton h-12 rounded-xl" />
              ))
            : narratives.slice(0, 5).map((n) => {
                const VelIcon = velIcon(n.velocity);
                return (
                  <Link
                    key={n.id}
                    href="/feed"
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-bg-elevated/50 hover:bg-bg-hover/50 border border-border hover:border-border-active transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <VelIcon className={`w-3.5 h-3.5 shrink-0 ${velColor(n.velocity)}`} strokeWidth={2} />
                      <span className="text-xs font-medium text-text-primary truncate">
                        {n.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      <span className="text-[10px] font-mono text-text-muted">
                        {n.correlatedTokenCount} tokens
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${
                          n.confidence === "High"
                            ? "badge-bullish"
                            : n.confidence === "Medium"
                            ? "badge-neutral"
                            : "badge-bearish"
                        }`}
                      >
                        {n.confidence}
                      </span>
                    </div>
                  </Link>
                );
              })}
        </div>

        <div className="mt-4 pt-3 border-t border-border shrink-0 flex items-center justify-between">
          <span className="text-[10px] text-text-muted font-mono">Powered by Birdeye</span>
          <span className="text-[10px] text-text-muted font-mono">Solana mainnet</span>
        </div>
      </div>
    </div>
  );
}
