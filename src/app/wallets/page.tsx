import WalletList from "./WalletList";
import { Cryptocurrency } from "../assets/types";
import { WalletSummary } from "./type";

import { getWallets, getCryptocurrencies } from "../api/server-data";
import WalletDataPreloader from "../components/WalletDataPreloader"

export default async function WalletsPage() {

  const [wallets, cryptocurrencies] = await Promise.all([
    getWallets(),
    getCryptocurrencies()
  ])

  function enrichWalletsWith24hChange(
    wallets: WalletSummary[],
    cryptocurrencies: Cryptocurrency[]
  ): WalletSummary[] {
    return wallets.map(wallet => {
      // Initialize wallet-level totals
      let walletUSDBalance = 0;
      let weightedPercentChange = 0;

      if (Array.isArray(wallet.balance)) {
        const enrichedAssets = wallet.balance.map(asset => {
          const crypto = cryptocurrencies.find(c => c.id === asset.assetId);

          if (!crypto) {
            return {
              ...asset,
              percentChange24h: 0,
              currentValue: 0,
              valueChange24h: 0,
            };
          }

          const currentPrice = crypto.quote.USD.price;
          const percentChange24h = crypto.quote.USD.percent_change_24h;
          const currentValue = asset.tokens * currentPrice;
          const valueChange24h = currentValue * (percentChange24h / 100);

          // Accumulate for weighted average calculation
          walletUSDBalance += currentValue;
          weightedPercentChange += valueChange24h; // This is the dollar amount change

          return {
            ...asset,
            percentChange24h,
            currentValue,
            valueChange24h,
          };
        });

        // Calculate portfolio-level 24h% change (weighted average)
        const portfolioPercentChange24h = walletUSDBalance > 0
          ? (weightedPercentChange / walletUSDBalance) * 100
          : 0;

        return {
          ...wallet,
          assets: enrichedAssets,
          USDBalance: walletUSDBalance,
          percent_change_24h: portfolioPercentChange24h,
        };
      }

      return {
        ...wallet,
        assets: [],
        USDBalance: 0,
        percent_change_24h: 0,
      };
    });
  }

  const walletsToDisplay = enrichWalletsWith24hChange(wallets, cryptocurrencies);

  return (
    <div className="flex flex-col w-full max-w-[1040px] mx-auto items-start gap-8 flex-[1_0_0]">
      <WalletDataPreloader />
      <h1 className="text-[#F8FCFF] font-[Figtree] text-[26px] not-italic font-medium leading-[normal] tracking-[1.04px] pt-[58px]">Wallets</h1>
      <WalletList wallets={walletsToDisplay} />
    </div>
  );
}