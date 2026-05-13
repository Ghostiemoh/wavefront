/**
 * Typed Birdeye Endpoint Wrappers
 * 
 * Each function wraps a specific Birdeye API endpoint with
 * proper lane assignment, caching strategy, and TypeScript types.
 */

import { birdeyeFetch } from "./client";
import type {
  TokenOverview,
  TrendingToken,
  NewListingToken,
  TokenSecurity,
  TokenPrice,
  TokenTransaction,
  MemeToken,
  SmartMoneyToken,
  TokenHistory,
} from "./types";

/** Fetch trending tokens on Solana */
export async function fetchTrendingTokens(
  sortBy: string = "rank",
  sortType: string = "asc",
  offset: number = 0,
  limit: number = 20
): Promise<{ tokens: TrendingToken[] }> {
  return birdeyeFetch<{ tokens: TrendingToken[] }>(
    "/defi/token_trending",
    "CHARTS",
    {
      params: { sort_by: sortBy, sort_type: sortType, offset, limit },
      cacheTtl: 2 * 60 * 1000, // 2 min — trending changes fast
    }
  );
}

/** Fetch new token listings */
export async function fetchNewListings(
  timeFrame: string = "24h",
  sortBy: string = "creationTime",
  sortType: string = "desc",
  offset: number = 0,
  limit: number = 20,
  minLiquidity: number = 1000
): Promise<{ items: NewListingToken[] }> {
  return birdeyeFetch<{ items: NewListingToken[] }>(
    "/defi/v2/tokens/new_listing",
    "HOLDERS",
    {
      params: {
        time_frame: timeFrame,
        sort_by: sortBy,
        sort_type: sortType,
        offset,
        limit,
        min_liquidity: minLiquidity,
      },
      cacheTtl: 3 * 60 * 1000,
    }
  );
}

/** Fetch comprehensive token overview */
export async function fetchTokenOverview(
  address: string
): Promise<TokenOverview> {
  return birdeyeFetch<TokenOverview>(
    "/defi/token_overview",
    "CHARTS",
    {
      params: { address },
      cacheTtl: 5 * 60 * 1000,
    }
  );
}

/** Fetch token security information */
export async function fetchTokenSecurity(
  address: string
): Promise<TokenSecurity> {
  return birdeyeFetch<TokenSecurity>(
    "/defi/token_security",
    "HOLDERS",
    {
      params: { address },
      cacheTtl: 10 * 60 * 1000, // Security data changes slowly
    }
  );
}

/** Fetch current token price */
export async function fetchTokenPrice(
  address: string
): Promise<TokenPrice> {
  return birdeyeFetch<TokenPrice>(
    "/defi/price",
    "CHARTS",
    {
      params: { address },
      cacheTtl: 30 * 1000, // 30s — price is time-sensitive
    }
  );
}

/** Fetch recent token transactions */
export async function fetchTokenTransactions(
  address: string,
  txType: string = "swap",
  sortType: string = "desc",
  limit: number = 20
): Promise<{ items: TokenTransaction[] }> {
  return birdeyeFetch<{ items: TokenTransaction[] }>(
    "/defi/v3/token/txs",
    "HOLDERS",
    {
      params: {
        address,
        tx_type: txType,
        sort_type: sortType,
        limit,
      },
      cacheTtl: 60 * 1000, // 1 min
    }
  );
}

/** Fetch meme tokens list */
export async function fetchMemeTokens(
  sortBy: string = "v24hUSD",
  sortType: string = "desc",
  offset: number = 0,
  limit: number = 20,
  minLiquidity: number = 10000
): Promise<{ items: MemeToken[] }> {
  return birdeyeFetch<{ items: MemeToken[] }>(
    "/defi/v3/token/meme/list",
    "TRADES",
    {
      params: {
        sort_by: sortBy,
        sort_type: sortType,
        offset,
        limit,
        min_liquidity: minLiquidity,
      },
      cacheTtl: 3 * 60 * 1000,
    }
  );
}

/** Fetch smart money token flows */
export async function fetchSmartMoneyTokens(
  sortBy: string = "netflow",
  sortType: string = "desc",
  offset: number = 0,
  limit: number = 20
): Promise<{ items: SmartMoneyToken[] }> {
  return birdeyeFetch<{ items: SmartMoneyToken[] }>(
    "/smart-money/v1/token/list",
    "HOLDERS",
    {
      params: {
        sort_by: sortBy,
        sort_type: sortType,
        offset,
        limit,
      },
      cacheTtl: 5 * 60 * 1000,
    }
  );
}

/** Search tokens by keyword */
export async function searchTokens(
  keyword: string,
  sortBy: string = "v24hUSD",
  sortType: string = "desc",
  offset: number = 0,
  limit: number = 10
): Promise<{ items: TokenOverview[] }> {
  return birdeyeFetch<{ items: TokenOverview[] }>(
    "/defi/v3/search",
    "HOLDERS",
    {
      params: {
        keyword,
        sort_by: sortBy,
        sort_type: sortType,
        offset,
        limit,
        chain: "solana",
        target: "token",
        verify_token: "true",
      },
      cacheTtl: 2 * 60 * 1000,
    }
  );
}

/** Fetch historical price data */
export async function fetchTokenHistory(
  address: string,
  type: string = "15m",
  timeFrom: number,
  timeTo: number
): Promise<TokenHistory> {
  return birdeyeFetch<TokenHistory>(
    "/defi/history_price",
    "TRADES",
    {
      params: {
        address,
        address_type: "token",
        type,
        time_from: timeFrom,
        time_to: timeTo,
      },
      cacheTtl: 5 * 60 * 1000, // 5 minutes cache for history
    }
  );
}
