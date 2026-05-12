import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

const LIMITS: Record<string, { max: number; windowMs: number }> = {
  "/api/chat":         { max: 10, windowMs: 60_000 },
  "/api/mcp/query":    { max: 5,  windowMs: 60_000 },
  "/api/verdict":      { max: 30, windowMs: 60_000 },
  "/api/intelligence": { max: 20, windowMs: 60_000 },
};

function resolveRoute(pathname: string): string | null {
  for (const prefix of Object.keys(LIMITS)) {
    if (pathname.startsWith(prefix)) return prefix;
  }
  return null;
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const routeKey = resolveRoute(pathname);
  if (!routeKey) return NextResponse.next();

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const { max, windowMs } = LIMITS[routeKey];
  const { allowed, remaining, resetIn } = checkRateLimit(ip, routeKey, max, windowMs);

  if (!allowed) {
    return NextResponse.json(
      {
        success: false,
        error: `Rate limit exceeded. Try again in ${Math.ceil(resetIn / 1000)}s.`,
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": String(max),
          "X-RateLimit-Remaining": "0",
          "Retry-After": String(Math.ceil(resetIn / 1000)),
        },
      }
    );
  }

  const res = NextResponse.next();
  res.headers.set("X-RateLimit-Limit", String(max));
  res.headers.set("X-RateLimit-Remaining", String(remaining));
  return res;
}

export const config = {
  matcher: ["/api/chat", "/api/mcp/query", "/api/verdict/:path*", "/api/intelligence/:path*"],
};
