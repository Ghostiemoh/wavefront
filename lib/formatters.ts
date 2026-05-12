/** Formatting utilities for currency, percentages, and numbers */

export function formatCurrency(value: number | null | undefined, compact = false): string {
  if (value === null || value === undefined) return "$0";
  if (value === 0) return "$0";

  const absValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (compact) {
    if (absValue >= 1e9) return `${sign}$${(absValue / 1e9).toFixed(2)}B`;
    if (absValue >= 1e6) return `${sign}$${(absValue / 1e6).toFixed(2)}M`;
    if (absValue >= 1e3) return `${sign}$${(absValue / 1e3).toFixed(1)}K`;
    if (absValue < 0.01) return "< $0.01";
  }

  if (absValue >= 1) {
    return `${sign}$${absValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  if (absValue >= 0.01) return `${sign}$${absValue.toFixed(4)}`;
  if (absValue >= 0.0001) return `${sign}$${absValue.toFixed(6)}`;
  if (absValue > 0) return "< $0.01";
  return "$0";
}

export function formatPercentage(value: number | null | undefined): string {
  const safeValue = value ?? 0;
  const sign = safeValue >= 0 ? "+" : "";
  return `${sign}${safeValue.toFixed(2)}%`;
}

export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
  return value.toLocaleString();
}

export function shortenAddress(address: string, chars = 4): string {
  if (!address || address.length < chars * 2) return address || "—";
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function timeAgo(unixSeconds: number): string {
  const seconds = Math.floor(Date.now() / 1000 - unixSeconds);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function riskGradeColor(grade: string): string {
  const gradeColors: Record<string, string> = {
    "A+": "#00FF88",
    "A": "#00FF88",
    "B+": "#66FFB2",
    "B": "#88DDAA",
    "C+": "#FFB800",
    "C": "#FFB800",
    "D": "#FF6644",
    "F": "#FF3366",
  };
  return gradeColors[grade] ?? "#8888A0";
}
