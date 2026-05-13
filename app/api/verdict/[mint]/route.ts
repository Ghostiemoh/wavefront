import { NextResponse } from "next/server";
import { generateRiskVerdict } from "@/lib/intelligence/risk-scorer";
import { generateTokenVerdict } from "@/lib/ai/gemini";
import { fetchTokenOverview, fetchTokenSecurity } from "@/lib/birdeye/endpoints";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ mint: string }> }
) {
  const { mint } = await params;

  if (!mint || mint.length < 20) {
    return NextResponse.json(
      { success: false, error: "Invalid mint address" },
      { status: 400 }
    );
  }

    try {
      const verdict = await generateRiskVerdict(mint);
  
      // Generate AI summary if we have enough data
      let aiSummary = verdict.summary;
      if (verdict.overallScore > 0) {
        try {
          aiSummary = await generateTokenVerdict(
            verdict.symbol,
            verdict.name,
            verdict.overallGrade,
            verdict.overallScore,
            verdict.flags,
            {
              liquidity: verdict.marketData?.liquidity ?? 0,
              volume24h: verdict.marketData?.volume24h ?? 0,
              holderConcentration: 0, // Fallback if not directly in verdict
              priceChange24h: verdict.marketData?.priceChange24h ?? 0,
            }
          );
        } catch {
          // AI summary is optional — fallback silently
        }
      }

    return NextResponse.json({
      success: true,
      data: { ...verdict, summary: aiSummary },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
