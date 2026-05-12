/**
 * Gemini AI Integration
 * 
 * Uses Google's Gemini API for:
 * - Narrative summaries (why is this emerging?)
 * - Token verdicts (should traders pay attention?)
 * - MCP query interpretation (NL → structured query)
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");
const genAIVerdicts = new GoogleGenerativeAI(process.env.GEMINI_API_KEY_VERDICTS || process.env.GEMINI_API_KEY || "");

const MODEL = "gemini-2.5-flash";

export async function generateNarrativeSummary(
  category: string,
  topTokens: Array<{ symbol: string; priceChange24h: number; volume24h: number }>,
  velocity: string,
  volumeChange: number
): Promise<string> {
  const tokenSummary = topTokens
    .slice(0, 5)
    .map((t) => `${t.symbol} (${t.priceChange24h > 0 ? "+" : ""}${t.priceChange24h.toFixed(1)}%, vol $${(t.volume24h / 1e6).toFixed(2)}M)`)
    .join(", ");

  const prompt = `You are Wavefront, an onchain intelligence engine. Generate a 2-sentence market intelligence summary.

Context:
- Narrative: ${category}
- Velocity: ${velocity}
- Average volume change: ${volumeChange > 0 ? "+" : ""}${volumeChange.toFixed(1)}%
- Top tokens: ${tokenSummary}

Rules:
- Be specific and data-driven, not generic
- Use trader language (accumulation, rotation, momentum, breakout)
- No emojis, no hashtags
- Max 50 words total`;

  try {
    const response = await genAI.getGenerativeModel({ model: MODEL }).generateContent(prompt);
    return response.response.text().trim() || "Narrative intelligence unavailable.";
  } catch (error) {
    console.error("[Gemini] Narrative summary error:", error);
    return `${category} narrative showing ${velocity} momentum across ${topTokens.length} correlated tokens with ${volumeChange > 0 ? "+" : ""}${volumeChange.toFixed(1)}% average volume shift.`;
  }
}

export async function generateTokenVerdict(
  symbol: string,
  name: string,
  riskGrade: string,
  riskScore: number,
  flags: string[],
  metrics: {
    liquidity: number;
    volume24h: number;
    holderConcentration: number;
    priceChange24h: number;
  }
): Promise<string> {
  const prompt = `You are Wavefront, an onchain intelligence engine. Generate a concise risk verdict for this Solana token.

Token: ${name} (${symbol})
Risk Grade: ${riskGrade} (${riskScore}/100)
Flags: ${flags.join(", ") || "None"}
Liquidity: $${(metrics.liquidity / 1e6).toFixed(2)}M
24h Volume: $${(metrics.volume24h / 1e6).toFixed(2)}M
Top 10 Holder %: ${metrics.holderConcentration.toFixed(1)}%
24h Price Change: ${metrics.priceChange24h > 0 ? "+" : ""}${metrics.priceChange24h.toFixed(2)}%

Rules:
- 3 sentences max
- State the verdict clearly (safe, caution, avoid)
- Reference specific data points
- No emojis, no financial advice disclaimers
- Speak like a Bloomberg terminal analyst`;

  try {
    const response = await genAIVerdicts.getGenerativeModel({ model: MODEL }).generateContent(prompt);
    return response.response.text().trim() || "Verdict generation unavailable.";
  } catch (error) {
    console.error("[Gemini] Token verdict error:", error);
    return `${symbol} rated ${riskGrade} (${riskScore}/100). ${flags.length > 0 ? `Key flags: ${flags.slice(0, 2).join(", ")}.` : "No critical flags detected."} Liquidity at $${(metrics.liquidity / 1e6).toFixed(2)}M.`;
  }
}

export async function interpretMCPQuery(
  query: string
): Promise<{
  intent: string;
  filters: Record<string, string | number | boolean>;
  explanation: string;
}> {
  const prompt = `You are Wavefront's MCP query interpreter. Parse this natural language query into structured intelligence filters.

Query: "${query}"

Respond in JSON only (no markdown fencing):
{
  "intent": "one of: find_tokens, analyze_narrative, risk_check, market_overview",
  "filters": {
    "narrative": "string or null (e.g. 'AI Infrastructure', 'Gaming', 'Meme', 'DeFi')",
    "maxMarketCap": "number or null",
    "minVolume": "number or null",
    "riskLevel": "string or null (low, medium, high)",
    "sortBy": "string (volume, marketCap, priceChange)"
  },
  "explanation": "1-sentence explanation of how the query was interpreted"
}`;

  try {
    const response = await genAI.getGenerativeModel({ model: MODEL }).generateContent(prompt);
    const text = response.response.text().trim() || "{}";
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("[Gemini] MCP interpretation error:", error);
    return {
      intent: "find_tokens",
      filters: {},
      explanation: "Unable to parse query. Showing general results.",
    };
  }
}
