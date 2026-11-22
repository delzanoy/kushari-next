export interface BlockchainInfo {
  blockchain: string;
}

export interface WalletInfo {
  balance: number;
  assetId: number;
  walletId: number;
  walletType: number;
  name: string;
  percentageShare: number; 
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
  slug?: string;
  USD: number;
}

export function getCoinMarketCapUrl(asset: Asset): string {
  if (asset.slug) {
    return `https://coinmarketcap.com/currencies/${asset.slug}/`;
  }

  const symbolUpper = (asset.symbol || "").toUpperCase();
  const knownSlugs: Record<string, string> = {
    BTC: "bitcoin",
    ETH: "ethereum",
    USDT: "tether",
    USDC: "usd-coin",
    BNB: "bnb",
    SOL: "solana",
    XRP: "xrp",
    ADA: "cardano",
    AVAX: "avalanche",
    DOGE: "dogecoin",
    DOT: "polkadot-new",
    MATIC: "polygon",
    POL: "polygon-ecosystem",
    LINK: "chainlink",
    UNI: "uniswap",
    DAI: "multi-collateral-dai",
    WBTC: "wrapped-bitcoin",
    SHIB: "shiba-inu",
    LTC: "litecoin",
    BCH: "bitcoin-cash",
    NEAR: "near-protocol",
    APT: "aptos",
    SUI: "sui",
    OP: "optimism-ethereum",
    ARB: "arbitrum",
  };

  if (symbolUpper && knownSlugs[symbolUpper]) {
    return `https://coinmarketcap.com/currencies/${knownSlugs[symbolUpper]}/`;
  }

  const rawName = asset.fullName || asset.name || asset.symbol || "";
  const slugified = rawName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  return slugified
    ? `https://coinmarketcap.com/currencies/${slugified}/`
    : "https://coinmarketcap.com/";
}

export interface WalletShare {
  walletId: number;
  walletName: string;
  address?: string;
  balance: number;
  valueUSD: number;
  percentage: number; 
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
}
