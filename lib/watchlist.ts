const KEY = "wavefront_watchlist";

export function getWatchlist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function isWatchlisted(mint: string): boolean {
  return getWatchlist().includes(mint);
}

export function toggleWatchlist(mint: string): boolean {
  const list = getWatchlist();
  const idx = list.indexOf(mint);
  if (idx === -1) {
    list.push(mint);
    localStorage.setItem(KEY, JSON.stringify(list));
    return true;
  } else {
    list.splice(idx, 1);
    localStorage.setItem(KEY, JSON.stringify(list));
    return false;
  }
}

export function removeFromWatchlist(mint: string): void {
  const list = getWatchlist().filter((m) => m !== mint);
  localStorage.setItem(KEY, JSON.stringify(list));
}
