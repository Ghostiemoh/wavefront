/**
 * Multi-Lane Birdeye API Client
 * 
 * Rotates across 3 API keys to maximize throughput.
 * Each lane has independent rate limiting (~60 RPM per key).
 * Server-side only — keys never reach the client.
 */

import type { ApiLane, BirdeyeApiResponse, CacheEntry } from "./types";

const BIRDEYE_BASE = "https://public-api.birdeye.so";
const DEFAULT_FETCH_TIMEOUT = 8000;
const MIN_REQUEST_INTERVAL = 1100; // 1.1s safe buffer for 60 RPM
const DEFAULT_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const API_KEYS: Record<ApiLane, string> = {
  CHARTS: process.env.BIRDEYE_API_KEY_CHARTS ?? "",
  HOLDERS: process.env.BIRDEYE_API_KEY_HOLDERS ?? "",
  TRADES: process.env.BIRDEYE_API_KEY_TRADES ?? "",
};

const lastRequestTimes: Record<ApiLane, number> = {
  CHARTS: 0,
  HOLDERS: 0,
  TRADES: 0,
};

const cache = new Map<string, CacheEntry<unknown>>();

function getHeaders(lane: ApiLane): HeadersInit {
  return {
    "x-api-key": API_KEYS[lane],
    "x-chain": "solana",
    accept: "application/json",
  };
}

async function throttleLane(lane: ApiLane): Promise<void> {
  const now = Date.now();
  const elapsed = now - lastRequestTimes[lane];
  if (elapsed < MIN_REQUEST_INTERVAL) {
    await new Promise((resolve) =>
      setTimeout(resolve, MIN_REQUEST_INTERVAL - elapsed)
    );
  }
  lastRequestTimes[lane] = Date.now();
}

function getCached<T>(key: string): T | null {
  const entry = cache.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;
  if (Date.now() - entry.timestamp > entry.ttl) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache<T>(key: string, data: T, ttl: number = DEFAULT_CACHE_TTL): void {
  cache.set(key, { data, timestamp: Date.now(), ttl });
}

function getStaleCached<T>(key: string): T | null {
  const entry = cache.get(key) as CacheEntry<T> | undefined;
  return entry?.data ?? null;
}

export async function birdeyeFetch<T>(
  path: string,
  lane: ApiLane = "CHARTS",
  options: {
    cacheTtl?: number;
    cacheKey?: string;
    params?: Record<string, string | number | boolean>;
  } = {}
): Promise<T> {
  const { cacheTtl = DEFAULT_CACHE_TTL, params } = options;

  // Build URL with query params
  const url = new URL(`${BIRDEYE_BASE}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, String(value));
    });
  }

  const cacheKey = options.cacheKey ?? url.toString();

  // Check cache first
  const cached = getCached<T>(cacheKey);
  if (cached) return cached;

  // Rate-limit this lane
  await throttleLane(lane);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_FETCH_TIMEOUT);

  try {
    const response = await fetch(url.toString(), {
      headers: getHeaders(lane),
      signal: controller.signal,
    });

    if (!response.ok) {
      if (response.status === 429) {
        // Return stale cache on rate limit
        const stale = getStaleCached<T>(cacheKey);
        if (stale) return stale;
        throw new Error(`Birdeye rate limit (429) on ${path}`);
      }
      throw new Error(`Birdeye API error: ${response.status} on ${path}`);
    }

    const json = (await response.json()) as BirdeyeApiResponse<T>;

    if (!json.success) {
      throw new Error(`Birdeye API returned success=false on ${path}`);
    }

    setCache(cacheKey, json.data, cacheTtl);
    return json.data;
  } catch (error) {
    // On any network error, try stale cache
    const stale = getStaleCached<T>(cacheKey);
    if (stale) return stale;
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

/** Clear all cached data */
export function clearCache(): void {
  cache.clear();
}

/** Get cache stats for debugging */
export function getCacheStats(): { size: number; keys: string[] } {
  return {
    size: cache.size,
    keys: Array.from(cache.keys()),
  };
}
