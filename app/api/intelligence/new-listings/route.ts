import { NextResponse } from "next/server";
import { fetchNewListings } from "@/lib/birdeye/endpoints";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const result = await fetchNewListings("24h", "creationTime", "desc", 0, 20, 1000);
    return NextResponse.json({ success: true, data: result.items ?? [] });
  } catch {
    // Return empty data with success=true on API failure,
    // so the frontend renders gracefully instead of breaking
    return NextResponse.json({ success: true, data: [] });
  }
}
