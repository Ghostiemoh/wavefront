/**
 * Narrative Clustering Engine
 * 
 * Detects emerging onchain narratives by:
 * 1. Fetching trending + meme + smart money tokens
 * 2. Classifying into narrative categories via keyword matching
 * 3. Clustering correlated tokens by category
 * 4. Calculating narrative velocity (volume momentum across cluster)
 * 5. Generating NarrativeEvent objects with confidence scores
 */

import { fetchTrendingTokens, fetchMemeTokens, fetchSmartMoneyTokens } from "../birdeye/endpoints";
import type { TrendingToken, MemeToken, SmartMoneyToken } from "../birdeye/types";
import type { NarrativeCategory, NarrativeEvent, Confidence, Velocity } from "./types";

/** Keyword-based narrative classification */
const NARRATIVE_KEYWORDS: Record<NarrativeCategory, string[]> = {
  "AI Infrastructure": ["ai", "gpt", "llm", "neural", "gpu", "inference", "agent", "machine", "model", "intelligence", "cognitive"],
  Gaming: ["game", "gaming", "play", "metaverse", "quest", "battle", "arena", "rpg", "mmorpg", "esport"],
  DeFi: ["swap", "dex", "lending", "yield", "farm", "vault", "amm", "liquidity", "stake"],
  Meme: ["meme", "dog", "cat", "pepe", "doge", "shib", "inu", "moon", "wojak", "chad", "frog", "bonk"],
  RWA: ["rwa", "asset", "property", "gold", "treasury", "bond", "commodity", "tokenized"],
  DePIN: ["depin", "iot", "sensor", "wireless", "bandwidth", "storage", "hotspot", "mesh"],
  Social: ["social", "feed", "post", "creator", "content", "community", "chat", "message", "connect"],
  Infrastructure: ["bridge", "oracle", "layer", "chain", "rollup", "zk", "proof", "consensus", "validator"],
  Payments: ["pay", "payment", "transfer", "remittance", "send", "stablecoin", "usdc", "usdt"],
  NFT: ["nft", "collectible", "art", "collection", "mint", "marketplace", "opensea"],
  Unknown: [],
};

function classifyToken(name: string, symbol: string): NarrativeCategory {
  const searchText = `${name} ${symbol}`.toLowerCase();

  let bestCategory: NarrativeCategory = "Unknown";
  let bestMatchCount = 0;

  for (const [category, keywords] of Object.entries(NARRATIVE_KEYWORDS)) {
    if (category === "Unknown") continue;
    const matchCount = keywords.filter((kw) => searchText.includes(kw)).length;
    if (matchCount > bestMatchCount) {
      bestMatchCount = matchCount;
      bestCategory = category as NarrativeCategory;
    }
  }

  return bestCategory;
}

interface ClusterableToken {
  address: string;
  symbol: string;
  name: string;
  logoURI: string;
  priceChange24h: number;
  volume24h: number;
  mc?: number;
}

function normalizeToClusterable(
  trending: TrendingToken[],
  meme: MemeToken[],
  smartMoney: SmartMoneyToken[]
): ClusterableToken[] {
  const seen = new Set<string>();
  const tokens: ClusterableToken[] = [];

  for (const token of trending) {
    if (seen.has(token.address)) continue;
    seen.add(token.address);
    tokens.push({
      address: token.address,
      symbol: token.symbol,
      name: token.name,
      logoURI: token.logoURI,
      priceChange24h: token.priceChange24hPercent ?? 0,
      volume24h: token.v24hUSD ?? token.volume24hUSD ?? 0,
      mc: token.mc,
    });
  }

  for (const token of meme) {
    if (seen.has(token.address)) continue;
    seen.add(token.address);
    tokens.push({
      address: token.address,
      symbol: token.symbol,
      name: token.name,
      logoURI: token.logoURI,
      priceChange24h: token.priceChange24hPercent ?? 0,
      volume24h: token.volume24hUSD ?? 0,
      mc: token.mc,
    });
  }

  for (const token of smartMoney) {
    if (seen.has(token.address)) continue;
    seen.add(token.address);
    tokens.push({
      address: token.address,
      symbol: token.symbol,
      name: token.name,
      logoURI: token.logoURI,
      priceChange24h: token.priceChange24hPercent ?? 0,
      volume24h: token.volume24hUSD ?? 0,
    });
  }

  return tokens;
}

function calculateVelocity(tokens: ClusterableToken[]): Velocity {
  const avgChange = tokens.reduce((sum, t) => sum + t.priceChange24h, 0) / tokens.length;
  if (avgChange > 10) return "accelerating";
  if (avgChange > -5) return "stable";
  return "decelerating";
}

function calculateConfidence(clusterSize: number, avgVolume: number): { label: Confidence; score: number } {
  let score = 0;

  // More correlated tokens = higher confidence
  if (clusterSize >= 10) score += 0.4;
  else if (clusterSize >= 5) score += 0.25;
  else if (clusterSize >= 3) score += 0.15;

  // Higher average volume = more conviction
  if (avgVolume >= 1_000_000) score += 0.35;
  else if (avgVolume >= 100_000) score += 0.2;
  else score += 0.1;

  // Bonus for having decent cluster
  score += Math.min(clusterSize / 20, 0.25);

  score = Math.min(score, 1);

  const label: Confidence = score >= 0.7 ? "High" : score >= 0.4 ? "Medium" : "Low";
  return { label, score: Math.round(score * 100) / 100 };
}

function generateWhyThisMatters(
  category: NarrativeCategory,
  velocity: Velocity,
  tokenCount: number,
  totalVolume: number
): string {
  const velocityText = velocity === "accelerating"
    ? "gaining momentum rapidly"
    : velocity === "stable"
      ? "holding steady"
      : "losing momentum";

  const volumeFormatted = totalVolume >= 1_000_000
    ? `$${(totalVolume / 1_000_000).toFixed(1)}M`
    : totalVolume >= 1_000
      ? `$${(totalVolume / 1_000).toFixed(0)}K`
      : `$${totalVolume.toFixed(0)}`;

  return `${tokenCount} correlated ${category} tokens are ${velocityText} with ${volumeFormatted} combined volume. Coordinated movements across this many assets in the same narrative typically ${velocity === "accelerating" ? "precede speculative rotation phases" : velocity === "stable" ? "indicate accumulation or consolidation" : "signal capital rotation to other narratives"}.`;
}

export async function detectNarratives(): Promise<NarrativeEvent[]> {
  // Fetch data from multiple endpoints in parallel
  const [trendingResult, memeResult, smartMoneyResult] = await Promise.allSettled([
    fetchTrendingTokens("rank", "asc", 0, 20),
    fetchMemeTokens("v24hUSD", "desc", 0, 20, 10000),
    fetchSmartMoneyTokens("netflow", "desc", 0, 20),
  ]);

  const trending = trendingResult.status === "fulfilled" ? trendingResult.value.tokens ?? [] : [];
  const meme = memeResult.status === "fulfilled" ? memeResult.value.items ?? [] : [];
  const smartMoney = smartMoneyResult.status === "fulfilled" ? smartMoneyResult.value.items ?? [] : [];

  // Normalize and deduplicate
  const allTokens = normalizeToClusterable(trending, meme, smartMoney);
  console.log(`[Narratives] Fetched ${trending.length} trending, ${meme.length} meme, ${smartMoney.length} smart money. Total unique: ${allTokens.length}`);

  // Cluster by narrative category
  const clusters = new Map<NarrativeCategory, ClusterableToken[]>();
  for (const token of allTokens) {
    const category = classifyToken(token.name, token.symbol);
    if (!clusters.has(category)) clusters.set(category, []);
    clusters.get(category)!.push(token);
  }

  console.log(`[Narratives] Formed ${clusters.size} initial clusters. Categories:`, Array.from(clusters.keys()));

  // Generate narrative events for meaningful clusters
  const narratives: NarrativeEvent[] = [];
  const now = Date.now();

  for (const [category, tokens] of clusters.entries()) {
    if (category === "Unknown" || tokens.length < 2) continue;

    // Sort by volume descending
    tokens.sort((a, b) => b.volume24h - a.volume24h);

    const avgVolume = tokens.reduce((sum, t) => sum + t.volume24h, 0) / tokens.length;
    const totalVolume = tokens.reduce((sum, t) => sum + t.volume24h, 0);
    const velocity = calculateVelocity(tokens);
    const confidence = calculateConfidence(tokens.length, avgVolume);

    narratives.push({
      id: `narrative-${category.toLowerCase().replace(/\s+/g, "-")}-${now}`,
      category,
      confidence: confidence.label,
      confidenceScore: confidence.score,
      velocity,
      volumeChange24h: 0,
      correlatedTokenCount: tokens.length,
      topTokens: tokens.slice(0, 5).map((t) => ({
        address: t.address,
        symbol: t.symbol,
        name: t.name,
        logoURI: t.logoURI,
        priceChange24h: t.priceChange24h,
        volume24h: t.volume24h,
        mc: t.mc,
      })),
      whyThisMatters: generateWhyThisMatters(category, velocity, tokens.length, totalVolume),
      detectedAt: now,
    });
  }

  // Sort by confidence score descending
  narratives.sort((a, b) => b.confidenceScore - a.confidenceScore);

  return narratives;
}
