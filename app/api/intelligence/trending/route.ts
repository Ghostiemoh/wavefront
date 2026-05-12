import { NextResponse } from "next/server";
import { fetchTrendingTokens } from "@/lib/birdeye/endpoints";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const result = await fetchTrendingTokens("rank", "asc", 0, 20);
    return NextResponse.json({ success: true, data: result.tokens ?? [] });
  } catch (error) {
    console.error("[API] Failed to fetch trending tokens:", error);
    // Return empty data with success=true on API failure,
    // so the frontend renders gracefully instead of breaking
    return NextResponse.json({ success: true, data: [] });
  }
}
