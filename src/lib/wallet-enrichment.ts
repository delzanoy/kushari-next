import type { WalletSummary } from "@/components/molecules/wallet/types";
import type { Cryptocurrency } from "@/components/molecules/assets/types";

/**
 * Enriches a list of wallets with updated USD balances and 24h percentage changes
 * based on current cryptocurrency prices.
 */
export function enrichWalletsWithPrices(
  wallets: WalletSummary[],
  cryptocurrencies: Cryptocurrency[]
): WalletSummary[] {
  if (!cryptocurrencies || cryptocurrencies.length === 0) {
    return wallets;
  }

  return wallets.map((wallet) => {
    let walletUSDBalance = 0;
    let weightedPercentChangeSum = 0;

    // Map and enrich individual asset balances
    const enrichedBalance = (wallet.balance as any[]).map((asset) => {
      const crypto = cryptocurrencies.find((c) => Number(c.id) === Number(asset.assetId));
      
      const currentPrice = Number(crypto?.quote?.USD?.price ?? asset.price) || 0;
      const percentChange24h = Number(crypto?.quote?.USD?.percent_change_24h ?? asset.percent_change_24h) || 0;
      const tokens = Number(asset.tokens) || 0;
      
      const currentValue = tokens * currentPrice;
      const valueChange24hUSD = currentValue * (percentChange24h / 100);

      walletUSDBalance += currentValue;
      weightedPercentChangeSum += valueChange24hUSD;

      return {
        ...asset,
        uniqueId: `${wallet.id}-${asset.assetId}`,
        tokens,
        assetId: Number(asset.assetId),
        USD: currentValue,
        price: currentPrice,
        percent_change_24h: percentChange24h,
        symbol: crypto?.symbol ?? asset.symbol ?? "???",
        name: crypto?.name ?? asset.name ?? "Unknown",
        fullName: crypto?.name ?? asset.fullName ?? "Unknown Asset",
      };
    });

    // Calculate portfolio-level 24h% change (weighted average)
    const portfolioPercentChange24h = walletUSDBalance > 0
      ? (weightedPercentChangeSum / walletUSDBalance) * 100
      : 0;

    return {
      ...wallet,
      balance: enrichedBalance,
      USDBalance: walletUSDBalance,
      totalBalance: walletUSDBalance,
      percent_change_24h: portfolioPercentChange24h,
    };
  });
}
