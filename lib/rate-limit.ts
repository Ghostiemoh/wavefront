interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

export function checkRateLimit(
  ip: string,
  route: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetIn: number } {
  const key = `${ip}:${route}`;
  const now = Date.now();

  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    // Prune stale entries every ~100 calls to avoid memory leaks
    if (store.size > 5000) {
      for (const [k, v] of store.entries()) {
        if (now > v.resetAt) store.delete(k);
      }
    }
    return { allowed: true, remaining: maxRequests - 1, resetIn: windowMs };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetIn: entry.resetAt - now };
  }

  entry.count += 1;
  return { allowed: true, remaining: maxRequests - entry.count, resetIn: entry.resetAt - now };
}
