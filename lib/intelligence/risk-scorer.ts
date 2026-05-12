/**
 * Risk Scoring Engine
 * 
 * Runs an instant token health autopsy using Birdeye security,
 * overview, and holder data. Produces a composite risk grade (A+ to F).
 */

import { fetchTokenOverview, fetchTokenSecurity } from "../birdeye/endpoints";
import type { RiskGrade, RiskVerdict } from "./types";

function scoreToGrade(score: number): RiskGrade {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B+";
  if (score >= 60) return "B";
  if (score >= 50) return "C+";
  if (score >= 40) return "C";
  if (score >= 25) return "D";
  return "F";
}

function calculateLiquidityScore(liquidity: number, volume24h: number, mc: number | undefined): number {
  if (liquidity < 100) return 0; // Extremely heavy penalty for zero/low liquidity

  let score = 50; // baseline

  // Liquidity depth
  if (liquidity >= 1_000_000) score += 25;
  else if (liquidity >= 100_000) score += 15;
  else if (liquidity >= 10_000) score += 5;
  else score -= 20;

  // Volume-to-liquidity ratio (healthy is 0.5-3x)
  if (liquidity > 0) {
    const ratio = volume24h / liquidity;
    if (ratio >= 0.5 && ratio <= 3) score += 15;
    else if (ratio > 10) score -= 15; // Wash trading signal
    else if (ratio < 0.1) score -= 10; // Dead volume
  }

  // Market cap sanity
  if (mc && liquidity > 0) {
    const mcToLiq = mc / liquidity;
    if (mcToLiq > 100) score -= 10; // Extremely thin liquidity for market cap
  }

  return Math.min(Math.max(score, 0), 100);
}

function calculateHolderScore(security: {
  top10HolderPercent: number;
  creatorPercentage: number;
  ownerPercentage: number;
}): number {
  let score = 50;

  // Top 10 concentration (lower is better)
  if (security.top10HolderPercent <= 30) score += 25;
  else if (security.top10HolderPercent <= 50) score += 10;
  else if (security.top10HolderPercent <= 70) score -= 5;
  else score -= 20;

  // Creator holding
  if (security.creatorPercentage <= 5) score += 15;
  else if (security.creatorPercentage <= 15) score += 5;
  else if (security.creatorPercentage > 30) score -= 20;

  // Owner holding
  if (security.ownerPercentage <= 5) score += 10;
  else if (security.ownerPercentage > 20) score -= 15;

  return Math.min(Math.max(score, 0), 100);
}

function calculateVolumeAuthenticityScore(volume24h: number, liquidity: number, uniqueWallets: number | undefined): number {
  let score = 50;

  // Volume-to-liquidity ratio (extreme ratios suggest wash trading)
  if (liquidity > 0) {
    const ratio = volume24h / liquidity;
    if (ratio >= 0.3 && ratio <= 5) score += 25;
    else if (ratio > 20) score -= 25;
    else if (ratio > 10) score -= 15;
  }

  // Unique wallet participation (more unique wallets = more authentic)
  if (uniqueWallets) {
    if (uniqueWallets >= 1000) score += 20;
    else if (uniqueWallets >= 100) score += 10;
    else if (uniqueWallets < 20) score -= 15;
  }

  return Math.min(Math.max(score, 0), 100);
}

function calculateSecurityScore(security: {
  freezeable: boolean | null;
  freezeAuthority: string | null;
  mutableMetadata: boolean;
  isToken2022: boolean;
  nonTransferable: boolean | null;
  transferFeeEnable: boolean | null;
  lockInfo: { lockPercent?: number } | null;
}): { score: number; flags: string[] } {
  let score = 70; // Start optimistic
  const flags: string[] = [];

  // Freeze authority check
  if (security.freezeable || security.freezeAuthority) {
    score -= 15;
    flags.push("Freeze authority active");
  }

  // Mutable metadata
  if (security.mutableMetadata) {
    score -= 5;
    flags.push("Metadata is mutable");
  }

  // Non-transferable check
  if (security.nonTransferable) {
    score -= 25;
    flags.push("Token is non-transferable");
  }

  // Transfer fee
  if (security.transferFeeEnable) {
    score -= 10;
    flags.push("Transfer fee enabled");
  }

  // Liquidity lock bonus
  if (security.lockInfo?.lockPercent) {
    if (security.lockInfo.lockPercent >= 80) {
      score += 20;
      flags.push(`${security.lockInfo.lockPercent.toFixed(0)}% liquidity locked`);
    } else if (security.lockInfo.lockPercent >= 50) {
      score += 10;
      flags.push(`${security.lockInfo.lockPercent.toFixed(0)}% liquidity locked`);
    }
  } else {
    flags.push("No liquidity lock detected");
  }

  // Token2022 — neutral flag
  if (security.isToken2022) {
    flags.push("Token-2022 program");
  }

  return { score: Math.min(Math.max(score, 0), 100), flags };
}

export async function generateRiskVerdict(address: string): Promise<RiskVerdict> {
  const [overview, security] = await Promise.allSettled([
    fetchTokenOverview(address),
    fetchTokenSecurity(address),
  ]);

  const overviewData = overview.status === "fulfilled" ? overview.value : null;
  const securityData = security.status === "fulfilled" ? security.value : null;

  const liquidityScore = overviewData
    ? calculateLiquidityScore(
        overviewData.liquidity ?? 0,
        overviewData.v24hUSD ?? overviewData.volume24hUSD ?? 0,
        overviewData.mc ?? overviewData.fdv
      )
    : 30;

  const holderScore = securityData
    ? calculateHolderScore({
        top10HolderPercent: securityData.top10HolderPercent ?? 100,
        creatorPercentage: securityData.creatorPercentage ?? 0,
        ownerPercentage: securityData.ownerPercentage ?? 0,
      })
    : 30;

  const volumeAuthenticityScore = overviewData
    ? calculateVolumeAuthenticityScore(
        overviewData.v24hUSD ?? overviewData.volume24hUSD ?? 0,
        overviewData.liquidity ?? 0,
        overviewData.uniqueWallet24h
      )
    : 30;

  const securityResult = securityData
    ? calculateSecurityScore({
        freezeable: securityData.freezeable,
        freezeAuthority: securityData.freezeAuthority,
        mutableMetadata: securityData.mutableMetadata,
        isToken2022: securityData.isToken2022,
        nonTransferable: securityData.nonTransferable,
        transferFeeEnable: securityData.transferFeeEnable,
        lockInfo: securityData.lockInfo,
      })
    : { score: 30, flags: ["Security data unavailable"] };

  const overallScore = Math.round(
    liquidityScore * 0.3 +
    holderScore * 0.25 +
    volumeAuthenticityScore * 0.2 +
    securityResult.score * 0.25
  );

  return {
    address,
    symbol: overviewData?.symbol ?? "???",
    name: overviewData?.name ?? "Unknown Token",
    logoURI: overviewData?.logoURI ?? "",
    overallGrade: scoreToGrade(overallScore),
    overallScore,
    liquidityScore,
    holderScore,
    volumeAuthenticityScore,
    securityScore: securityResult.score,
    flags: securityResult.flags,
    summary: "",
    generatedAt: Date.now(),
  };
}
