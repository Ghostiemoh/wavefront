"use client";

import { motion } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  BarChart3, 
  Droplets, 
  Users,
  DollarSign
} from "lucide-react";
import type { RiskVerdict } from "@/lib/intelligence/types";

interface TokenStatsProps {
  verdict: RiskVerdict;
}

export function TokenStats({ verdict }: TokenStatsProps) {
  const { marketData } = verdict;

  if (!marketData) return null;

  const stats = [
    {
      label: "Current Price",
      value: `$${marketData.price.toLocaleString(undefined, { maximumFractionDigits: 8 })}`,
      icon: DollarSign,
      color: "text-text-primary",
    },
    {
      label: "24h Performance",
      value: `${marketData.priceChange24h >= 0 ? "+" : ""}${marketData.priceChange24h.toFixed(2)}%`,
      icon: marketData.priceChange24h >= 0 ? TrendingUp : TrendingDown,
      color: marketData.priceChange24h >= 0 ? "text-accent-emerald" : "text-accent-red",
    },
    {
      label: "24h Volume",
      value: `$${marketData.volume24h.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      icon: Activity,
      color: "text-text-primary",
    },
    {
      label: "Market Cap",
      value: `$${marketData.marketCap.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      icon: BarChart3,
      color: "text-text-primary",
    },
    {
      label: "Total Liquidity",
      value: `$${marketData.liquidity.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      icon: Droplets,
      color: "text-text-primary",
    },
    {
      label: "Unique Holders",
      value: marketData.holders.toLocaleString(),
      icon: Users,
      color: "text-text-primary",
    },
  ];

  return (
    <div className="w-full bg-bg-surface border border-border rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
          Market Intelligence
        </h3>
        <span className="text-[10px] font-mono text-text-muted bg-bg-elevated px-2 py-0.5 rounded border border-border">
          REAL-TIME DATA
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex flex-col gap-1.5"
          >
            <div className="flex items-center gap-1.5 text-text-muted">
              <stat.icon className="w-3.5 h-3.5" />
              <span className="text-[10px] font-medium uppercase tracking-tight">
                {stat.label}
              </span>
            </div>
            <span className={`text-base font-mono font-bold truncate ${stat.color}`}>
              {stat.value}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
