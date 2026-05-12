"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Loader2 } from "lucide-react";
import type { TokenHistoryItem } from "@/lib/birdeye/types";

interface TokenChartProps {
  mint: string;
}

export function TokenChart({ mint }: TokenChartProps) {
  const [data, setData] = useState<TokenHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        const timeTo = Math.floor(Date.now() / 1000);
        const timeFrom = timeTo - 24 * 60 * 60; // 24 hours ago
        const res = await fetch(`/api/history/${mint}?type=15m&timeFrom=${timeFrom}&timeTo=${timeTo}`);
        const json = await res.json();
        
        if (json.success && json.data?.items) {
          if (isMounted) setData(json.data.items);
        } else {
          if (isMounted) setError("Failed to load chart data");
        }
      } catch (err) {
        if (isMounted) setError("Network error");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchData();
    return () => { isMounted = false; };
  }, [mint]);

  // Format data for Recharts
  const chartData = useMemo(() => {
    return data.map((item) => ({
      time: new Date(item.unixTime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      price: item.c, // using close price
      fullDate: new Date(item.unixTime * 1000).toLocaleString(),
    }));
  }, [data]);

  // Calculate min/max for Y axis to make the chart look dynamic
  const yDomain: [(dataMin: number) => number, (dataMax: number) => number] = useMemo(() => {
    return [
      (dataMin: number) => Math.max(0, dataMin - (dataMin * 0.05)),
      (dataMax: number) => dataMax === 0 ? 1 : dataMax + (dataMax * 0.05)
    ];
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-64 bg-bg-surface border border-border rounded-xl flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-accent-cyan animate-spin opacity-50" />
      </div>
    );
  }

  if (error || data.length === 0) {
    return (
      <div className="w-full h-64 bg-bg-surface border border-border rounded-xl flex items-center justify-center">
        <p className="text-sm text-text-secondary">{error || "No chart data available"}</p>
      </div>
    );
  }

  const isPositive = data[data.length - 1].c >= data[0].c;
  const color = isPositive ? "var(--accent-emerald)" : "var(--accent-red)";

  return (
    <div className="w-full h-64 bg-bg-surface border border-border rounded-xl p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-text-primary">24h Price Action</h3>
        <span className="text-xs text-text-secondary bg-bg-elevated px-2 py-1 rounded-md">15m</span>
      </div>
      
      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
              minTickGap={30}
            />
            <YAxis 
              domain={yDomain}
              hide 
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-bg-elevated border border-border rounded-lg p-3 shadow-lg">
                      <p className="text-xs text-text-secondary mb-1">{data.fullDate}</p>
                      <p className="text-sm font-mono font-medium text-text-primary">
                        ${Number(data.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={color}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorPrice)"
              animationDuration={1500}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
