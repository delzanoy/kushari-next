"use client";

import { useWallet } from "@/hooks/useData";

/**
 * WalletDataPreloader preloads detailed data for the initial set of wallets (IDs 1-6).
 * This ensures that when a user clicks into a wallet, the data is already in the SWR cache.
 */
export function WalletDataPreloader() {
  // Preload data for wallet IDs 1-6
  useWallet("1");
  useWallet("2");
  useWallet("3");
  useWallet("4");
  useWallet("5");
  useWallet("6");

  return null;
}
