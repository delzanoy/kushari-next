"use client";

import useSWR from "swr";
import { apiUrl, fetcher } from "@/lib/fetcher";
import type { 
  Wallet, 
  Member
} from "@/components/molecules/wallet/types";
import type { Transaction } from "@/components/molecules/transactions/view-all/types";
import type { Proposal } from "@/components/molecules/transactions/proposals/types";
import type { Cryptocurrency, Asset } from "@/components/molecules/assets/types";
import { getUserWallets } from "@/lib/mock-cache";

const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  refreshInterval: 300000,
};

// ─── Wallets ──────────────────────────────────────────────────────────────────

async function mergedWalletsFetcher(url: string) {
  const [apiWallets, userWallets] = await Promise.all([
    fetcher<Wallet[]>(url).catch(() => []),
    getUserWallets().catch(() => [])
  ]);
  return [...apiWallets, ...userWallets] as unknown as Wallet[];
}

export function useWallets() {
  const url = apiUrl("/wallets");
  const { data, error, isLoading, mutate } = useSWR<Wallet[]>(
    url,
    url ? mergedWalletsFetcher : null,
    swrConfig
  );
  return { wallets: data, isLoading, isError: error, mutate };
}

export function useWallet(id: string) {
  const walletId = parseInt(id);
  const isUserWallet = walletId >= 30000;

  const { data: apiData, error: apiError, isLoading: apiLoading, mutate: apiMutate } = useSWR<Wallet>(
    !isUserWallet && id ? apiUrl(`/wallet/${id}`) : null,
    fetcher,
    swrConfig
  );

  const { data: userData, error: userError, isLoading: userLoading, mutate: userMutate } = useSWR<Wallet>(
    isUserWallet ? ["userWallet", id] : null,
    async ([_, wid]: [string, string]) => {
      const wallets = await getUserWallets();
      const wallet = wallets.find((w) => w.id === parseInt(wid));
      if (!wallet) throw new Error("Wallet not found in local cache");
      return wallet as unknown as Wallet;
    },
    { ...swrConfig, revalidateOnMount: true }
  );

  const wallet = isUserWallet ? userData : apiData;
  const error = isUserWallet ? userError : apiError;
  const isLoading = isUserWallet ? userLoading : apiLoading;
  const mutate = isUserWallet ? userMutate : apiMutate;

  return { wallet, isLoading, isError: error, mutate };
}

// ─── Cryptocurrencies ─────────────────────────────────────────────────────────

export function useCryptocurrencies() {
  const url = apiUrl("/cryptocurrencies");
  const { data, error, isLoading, mutate } = useSWR<Cryptocurrency[]>(
    url,
    fetcher,
    swrConfig
  );
  return { cryptocurrencies: data, isLoading, isError: error, mutate };
}

// ─── Assets ───────────────────────────────────────────────────────────────────

export function useAssets() {
  const url = apiUrl("/assets");
  const { data, error, isLoading, mutate } = useSWR<Asset[]>(
    url,
    fetcher,
    swrConfig
  );
  return { assets: data, isLoading, isError: error, mutate };
}

// ─── Transactions ─────────────────────────────────────────────────────────────

export function useTransactions() {
  const url = apiUrl("/transactions");
  const { data, error, isLoading, mutate } = useSWR<Transaction[]>(
    url,
    fetcher,
    swrConfig
  );
  return { transactions: data, isLoading, isError: error, mutate };
}

// ─── Proposals ────────────────────────────────────────────────────────────────

export function useProposals() {
  const url = apiUrl("/proposals");
  const { data, error, isLoading, mutate } = useSWR<Proposal[]>(
    url,
    fetcher,
    swrConfig
  );
  return { proposals: data, isLoading, isError: error, mutate };
}

// ─── Other Hooks ──────────────────────────────────────────────────────────────

export function useAddresses() {
  const url = apiUrl("/addresses");
  const { data, error, isLoading, mutate } = useSWR<any[]>(
    url,
    fetcher,
    swrConfig
  );
  return { addresses: data, isLoading, isError: error, mutate };
}

export function useGroups() {
  const url = apiUrl("/groups");
  const { data, error, isLoading, mutate } = useSWR<any[]>(
    url,
    fetcher,
    swrConfig
  );
  return { groups: data, isLoading, isError: error, mutate };
}

export function useMembers() {
  const url = apiUrl("/members");
  const { data, error, isLoading, mutate } = useSWR<Member[]>(
    url,
    fetcher,
    swrConfig
  );
  return { members: data, isLoading, isError: error, mutate };
}

export function useWorkspaces() {
  const url = apiUrl("/workspaces");
  const { data, error, isLoading, mutate } = useSWR<any[]>(
    url,
    fetcher,
    swrConfig
  );
  return { workspaces: data, isLoading, isError: error, mutate };
}
