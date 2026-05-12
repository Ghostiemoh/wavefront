import { NextResponse } from "next/server";
import { fetchTokenHistory } from "@/lib/birdeye/endpoints";

export const revalidate = 60; // Cache for 60 seconds

export async function GET(
  request: Request,
  { params }: { params: Promise<{ mint: string }> }
) {
  try {
    const { mint } = await params;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "15m";
    const timeFrom = searchParams.get("timeFrom");
    const timeTo = searchParams.get("timeTo");

    if (!mint) {
      return NextResponse.json({ success: false, error: "Mint address required" }, { status: 400 });
    }

    if (!timeFrom || !timeTo) {
      return NextResponse.json({ success: false, error: "timeFrom and timeTo required" }, { status: 400 });
    }

    const data = await fetchTokenHistory(
      mint,
      type,
      parseInt(timeFrom),
      parseInt(timeTo)
    );

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("[API] History fetch error:", error);
    // Graceful degradation
    return NextResponse.json({
      success: true,
      data: { items: [] },
      error: "Failed to fetch chart data"
    });
  }
}
