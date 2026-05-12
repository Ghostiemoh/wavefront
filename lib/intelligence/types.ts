/**
 * Intelligence Data Types
 * 
 * Structured types for narrative events, risk verdicts,
 * and intelligence feed items.
 */

export type NarrativeCategory =
  | "AI Infrastructure"
  | "Gaming"
  | "DeFi"
  | "Meme"
  | "RWA"
  | "DePIN"
  | "Social"
  | "Infrastructure"
  | "Payments"
  | "NFT"
  | "Unknown";

export type Confidence = "High" | "Medium" | "Low";
export type Velocity = "accelerating" | "stable" | "decelerating";
export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface NarrativeEvent {
  id: string;
  category: NarrativeCategory;
  confidence: Confidence;
  confidenceScore: number; // 0–1
  velocity: Velocity;
  volumeChange24h: number;
  correlatedTokenCount: number;
  topTokens: Array<{
    address: string;
    symbol: string;
    name: string;
    logoURI: string;
    priceChange24h: number;
    volume24h: number;
    mc?: number;
  }>;
  whyThisMatters: string;
  detectedAt: number; // unix ms
}

export type RiskGrade = "A+" | "A" | "B+" | "B" | "C+" | "C" | "D" | "F";

export interface RiskVerdict {
  address: string;
  symbol: string;
  name: string;
  logoURI: string;
  overallGrade: RiskGrade;
  overallScore: number; // 0–100
  liquidityScore: number;
  holderScore: number;
  volumeAuthenticityScore: number;
  securityScore: number;
  flags: string[];
  summary: string;
  generatedAt: number;
}

export interface IntelligenceItem {
  type: "narrative_surge" | "risk_alert" | "whale_movement" | "new_listing" | "momentum_shift";
  id: string;
  title: string;
  subtitle: string;
  confidence: Confidence;
  timestamp: number;
  data: NarrativeEvent | RiskVerdict | Record<string, unknown>;
}

export interface MCPQueryResult {
  query: string;
  interpretation: string;
  results: Array<{
    token: string;
    symbol: string;
    address: string;
    confidence: number;
    reason: string;
    metrics: Record<string, number | string>;
  }>;
  generatedAt: number;
}
