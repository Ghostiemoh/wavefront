/** Birdeye API response and data types */

export interface BirdeyeApiResponse<T> {
  success: boolean;
  data: T;
}

export interface TokenOverview {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI: string;
  liquidity: number;
  price: number;
  priceChange24hPercent: number;
  priceChange1hPercent?: number;
  priceChange4hPercent?: number;
  priceChange12hPercent?: number;
  volume24h: number;
  volume24hUSD: number;
  marketCap?: number;
  fdv?: number;
  supply?: number;
  holder?: number;
  trade24h?: number;
  trade24hChangePercent?: number;
  buy24h?: number;
  sell24h?: number;
  uniqueWallet24h?: number;
  uniqueWallet24hChangePercent?: number;
  numberMarkets?: number;
  lastTradeUnixTime?: number;
  lastTradeHumanTime?: string;
  extensions?: Record<string, string>;
  mc?: number;
  v24hUSD?: number;
  v24hChangePercent?: number;
}

export interface TrendingToken {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI: string;
  volume24hUSD: number;
  rank: number;
  price?: number;
  priceChange24hPercent?: number;
  liquidity?: number;
  mc?: number;
  v24hUSD?: number;
  v24hChangePercent?: number;
}

export interface NewListingToken {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI: string;
  liquidity: number;
  volume24hUSD?: number;
  price?: number;
  openTimestamp?: number;
  holder?: number;
  numberMarkets?: number;
  mc?: number;
  v24hUSD?: number;
}

export interface TokenSecurity {
  creatorAddress: string;
  ownerAddress: string;
  creationTx: string;
  creationTime: number;
  creationSlot: number;
  mintTx: string;
  mintTime: number;
  mintSlot: number;
  creatorBalance: number;
  creatorPercentage: number;
  ownerBalance: number;
  ownerPercentage: number;
  metaplexUpdateAuthorityBalance: number;
  metaplexUpdateAuthorityPercent: number;
  mutableMetadata: boolean;
  top10HolderBalance: number;
  top10HolderPercent: number;
  top10UserBalance: number;
  top10UserPercent: number;
  isTrueToken: boolean;
  totalSupply: number;
  preMarketHolder: number[];
  lockInfo: {
    lockPercent?: number;
    lockAmount?: number;
    lockedDetail?: Array<{
      address: string;
      amount: number;
      percent: number;
    }>;
  } | null;
  freezeable: boolean | null;
  freezeAuthority: string | null;
  transferFeeEnable: boolean | null;
  transferFeeData: string | null;
  isToken2022: boolean;
  nonTransferable: boolean | null;
}

export interface TokenPrice {
  value: number;
  updateUnixTime: number;
  updateHumanTime: string;
  priceChange24h?: number;
}

export interface TokenTransaction {
  txHash: string;
  blockUnixTime: number;
  source: string;
  owner: string;
  from: {
    symbol: string;
    decimals: number;
    amount: number;
    uiAmount: number;
    price: number;
    nearestPrice: number;
    changeAmount: number;
    uiChangeAmount: number;
  };
  to: {
    symbol: string;
    decimals: number;
    amount: number;
    uiAmount: number;
    price: number;
    nearestPrice: number;
    changeAmount: number;
    uiChangeAmount: number;
  };
  side: "buy" | "sell";
  volumeUSD: number;
}

export interface HolderDistribution {
  totalHolders: number;
  distribution: Array<{
    range: string;
    count: number;
    percentage: number;
    totalAmount: number;
  }>;
}

export interface MemeToken {
  address: string;
  symbol: string;
  name: string;
  logoURI: string;
  price: number;
  priceChange24hPercent: number;
  volume24hUSD: number;
  liquidity: number;
  mc: number;
  holder?: number;
}

export interface SmartMoneyToken {
  address: string;
  symbol: string;
  name: string;
  logoURI: string;
  price: number;
  priceChange24hPercent: number;
  volume24hUSD: number;
  netflow: number;
  smartBuyVolume: number;
  smartSellVolume: number;
}

export type ApiLane = "CHARTS" | "HOLDERS" | "TRADES";

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export interface TokenHistoryItem {
  c: number;
  h: number;
  l: number;
  o: number;
  v: number;
  type: string;
  unixTime: number;
}

export interface TokenHistory {
  items: TokenHistoryItem[];
}
