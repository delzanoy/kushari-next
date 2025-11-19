export interface BlockchainInfo {
  blockchain: string;
}

export interface WalletInfo {
  balance: number;
  assetId: number;
  walletId: number;
  walletType: number;
  name: string;
  percentageShare: number; // NEW: Percentage share from API
}

export interface Asset {
  uniqueId: string;
  assetId: number;
  blockchain: BlockchainInfo[] | string;
  countOfWallets: number;
  totalTokens: number;
  expanded: boolean;
  wallets: WalletInfo[];
  percentageShareInUSD: number;
  percent_change_24h: number;
  price: number;
  symbol: string;
  name: string;
  fullName: string;
  USD: number;
}

export interface WalletShare {
  walletId: number;
  walletName: string;
  address?: string;
  balance: number;
  valueUSD: number;
  percentage: number; // Now we can use the API-provided percentageShare
}

export interface AssetCardProps {
  asset: Asset;
  breakdown?: WalletShare[];
  onExpand?: (id: string) => void;
}






export interface Cryptocurrency {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  num_market_pairs: number;
  date_added: string;
  tags: string[];
  max_supply: number | null;
  circulating_supply: number;
  total_supply: number;
  infinite_supply: boolean;
  platform: Platform | null;
  cmc_rank: number;
  self_reported_circulating_supply: number | null;
  self_reported_market_cap: number | null;
  tvl_ratio: number | null;
  last_updated: string;
  quote: {
    USD: QuoteData;
  };
}

export interface Platform {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  token_address: string;
}

export interface QuoteData {
  price: number;
  volume_24h: number;
  volume_change_24h: number;
  percent_change_1h: number;
  percent_change_24h: number;
  // percent_change_7d: number;
  // percent_change_30d: number;
  // percent_change_60d: number;
  // percent_change_90d: number;
  // market_cap: number;
  // market_cap_dominance: number;
  // fully_diluted_market_cap: number;
  // tvl: number | null;
  // last_updated: string;
}


// types/index.ts
// export interface FilterState {
//   tokens: string[];  // Changed from token to tokens (array)
//   wallets: string[]; // Changed from wallet to wallets (array)
//   blockchains: string[]; // Changed from blockchain to blockchains (array)
// }

// export interface FilterOptions {
//   tokens: { symbol: string; name: string }[];
//   wallets: { id: string; name: string }[];
//   blockchains: string[];
// }