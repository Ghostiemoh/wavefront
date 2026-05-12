import { NextResponse } from "next/server";
import { detectNarratives } from "@/lib/intelligence/narrative-clusterer";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export async function GET() {
  try {
    const narratives = await detectNarratives();
    return NextResponse.json({ success: true, data: narratives });
  } catch (error) {
    console.error("[API] Failed to detect narratives:", error);
    // Return empty data with success=true on API failure,
    // so the frontend renders gracefully instead of breaking
    return NextResponse.json({ success: true, data: [] });
  }
}
