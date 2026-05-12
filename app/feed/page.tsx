import { unstable_cache } from "next/cache";
import { detectNarratives } from "@/lib/intelligence/narrative-clusterer";
import { fetchTrendingTokens, fetchNewListings } from "@/lib/birdeye/endpoints";
import type { NarrativeEvent } from "@/lib/intelligence/types";
import type { TrendingToken, NewListingToken } from "@/lib/birdeye/types";
import { FeedClient } from "./FeedClient";

export const revalidate = 30;

interface InitialFeed {
  narratives: NarrativeEvent[];
  trending: TrendingToken[];
  newListings: NewListingToken[];
  narrativeError: boolean;
}

const getInitialFeed = unstable_cache(
  async (): Promise<InitialFeed> => {
    const [nRes, tRes, lRes] = await Promise.allSettled([
      detectNarratives(),
      fetchTrendingTokens("rank", "asc", 0, 20),
      fetchNewListings("24h", "creationTime", "desc", 0, 20, 1000),
    ]);

    const narratives = nRes.status === "fulfilled" ? nRes.value : [];
    const narrativeError = nRes.status === "rejected";

    const trending =
      tRes.status === "fulfilled" ? tRes.value.tokens ?? [] : [];

    const newListings =
      lRes.status === "fulfilled"
        ? (lRes.value.items ?? []).filter((t) => t.liquidity > 100)
        : [];

    return { narratives, trending, newListings, narrativeError };
  },
  ["feed-initial-v1"],
  { revalidate: 30 }
);

export default async function FeedPage() {
  const initial = await getInitialFeed();

  return (
    <FeedClient
      initialNarratives={initial.narratives}
      initialTrending={initial.trending}
      initialNewListings={initial.newListings}
      initialNarrativeError={initial.narrativeError}
    />
  );
}
