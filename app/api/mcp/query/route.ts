import { NextResponse } from "next/server";
import { interpretMCPQuery } from "@/lib/ai/gemini";
import { fetchTrendingTokens, fetchMemeTokens, searchTokens } from "@/lib/birdeye/endpoints";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query } = body as { query: string };

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing query parameter" },
        { status: 400 }
      );
    }

    // Interpret the natural language query via Gemini
    const interpretation = await interpretMCPQuery(query);

    // Execute the appropriate data fetch based on intent
    let results: Array<{
      token: string;
      symbol: string;
      address: string;
      confidence: number;
      reason: string;
      metrics: Record<string, number | string>;
    }> = [];

    switch (interpretation.intent) {
      case "find_tokens": {
        // Use search or trending based on filters
        const narrativeFilter = interpretation.filters.narrative as string | null;
        if (narrativeFilter && narrativeFilter.toLowerCase().includes("meme")) {
          const meme = await fetchMemeTokens("v24hUSD", "desc", 0, 10, 10000);
          results = (meme.items ?? []).map((token) => ({
            token: token.name,
            symbol: token.symbol,
            address: token.address,
            confidence: 0.75,
            reason: `Volume: $${(token.volume24hUSD / 1e6).toFixed(2)}M, MC: $${((token.mc ?? 0) / 1e6).toFixed(2)}M`,
            metrics: {
              price: token.price,
              volume24h: token.volume24hUSD,
              marketCap: token.mc ?? 0,
              priceChange24h: token.priceChange24hPercent,
            },
          }));
        } else {
          const trending = await fetchTrendingTokens("rank", "asc", 0, 10);
          results = (trending.tokens ?? []).map((token) => ({
            token: token.name,
            symbol: token.symbol,
            address: token.address,
            confidence: 0.8,
            reason: `Trending rank #${token.rank}, Volume: $${((token.v24hUSD ?? token.volume24hUSD ?? 0) / 1e6).toFixed(2)}M`,
            metrics: {
              volume24h: token.v24hUSD ?? token.volume24hUSD ?? 0,
              priceChange24h: token.priceChange24hPercent ?? 0,
              marketCap: token.mc ?? 0,
            },
          }));
        }
        break;
      }

      case "analyze_narrative": {
        // Return trending as narrative context
        const trending = await fetchTrendingTokens("rank", "asc", 0, 15);
        results = (trending.tokens ?? []).map((token) => ({
          token: token.name,
          symbol: token.symbol,
          address: token.address,
          confidence: 0.7,
          reason: "Part of trending narrative analysis",
          metrics: {
            volume24h: token.v24hUSD ?? token.volume24hUSD ?? 0,
            priceChange24h: token.priceChange24hPercent ?? 0,
          },
        }));
        break;
      }

      case "market_overview":
      default: {
        const trending = await fetchTrendingTokens("rank", "asc", 0, 10);
        results = (trending.tokens ?? []).map((token) => ({
          token: token.name,
          symbol: token.symbol,
          address: token.address,
          confidence: 0.85,
          reason: `Ranked #${token.rank} trending`,
          metrics: {
            volume24h: token.v24hUSD ?? token.volume24hUSD ?? 0,
            priceChange24h: token.priceChange24hPercent ?? 0,
          },
        }));
        break;
      }
    }

    // Apply market cap filter if specified
    const maxMC = interpretation.filters.maxMarketCap;
    if (typeof maxMC === "number" && maxMC > 0) {
      results = results.filter((r) => {
        const mc = r.metrics.marketCap;
        return typeof mc === "number" && mc <= maxMC;
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        query,
        interpretation: interpretation.explanation,
        results: results.slice(0, 10),
        generatedAt: Date.now(),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
