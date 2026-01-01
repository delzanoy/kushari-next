// hooks/useData.ts
"use client"
import useSWR from 'swr'
import { getUserWallets } from '../api/mock-cache'

const fetcher = (url: string) => fetch(url).then(res => res.json())

const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  refreshInterval: 300000,
}

export function useWallets() {
  const { data, error, isLoading, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_BASE_URL}/wallets`,
    fetcher,
    swrConfig
  )
  return { wallets: data, isLoading, isError: error, mutate }
}

export function useWallet(id: string) {
  const walletId = parseInt(id);
  const isUserWallet = walletId >= 30000; // User-created wallets have IDs >= 30000

  // For API wallets, fetch from API
  const { data: apiData, error: apiError, isLoading: apiLoading, mutate: apiMutate } = useSWR(
    !isUserWallet && id ? `${process.env.NEXT_PUBLIC_BASE_URL}/wallet/${id}` : null,
    fetcher,
    swrConfig
  );

  // For user wallets, fetch from mock cache
  const { data: userData, error: userError, isLoading: userLoading, mutate: userMutate } = useSWR(
    isUserWallet ? ['userWallet', id] : null,
    async () => {
      const userWallets = await getUserWallets();
      const wallet = userWallets.find(w => w.id === walletId);

      if (!wallet) {
        throw new Error('Wallet not found in mock cache');
      }

      return wallet;
    },
    {
      ...swrConfig,
      // Revalidate on mount for user wallets to ensure fresh data
      revalidateOnMount: true,
    }
  );

  const wallet = isUserWallet ? userData : apiData;
  const error = isUserWallet ? userError : apiError;
  const isLoading = isUserWallet ? userLoading : apiLoading;
  const mutate = isUserWallet ? userMutate : apiMutate;

  return {
    wallet,
    isLoading,
    isError: error,
    mutate
  }
}

export function useCryptocurrencies() {
  const { data, error, isLoading, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_BASE_URL}/cryptocurrencies`,
    fetcher,
    swrConfig
  )
  return { cryptocurrencies: data, isLoading, isError: error, mutate }
}

export function useAssets() {
  const { data, error, isLoading, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_BASE_URL}/assets`,
    fetcher,
    swrConfig
  )
  return { assets: data, isLoading, isError: error, mutate }
}

export function useTransactions() {
  const { data, error, isLoading, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_BASE_URL}/transactions`,
    fetcher,
    swrConfig
  )
  return { transactions: data, isLoading, isError: error, mutate }
}

export function useProposals() {
  const { data, error, isLoading, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_BASE_URL}/proposals`,
    fetcher,
    swrConfig
  )
  return { proposals: data, isLoading, isError: error, mutate }
}

export function useAddresses() {
  const { data, error, isLoading, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_BASE_URL}/addresses`,
    fetcher,
    swrConfig
  )
  return { addresses: data, isLoading, isError: error, mutate }
}

export function useGroups() {
  const { data, error, isLoading, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_BASE_URL}/groups`,
    fetcher,
    swrConfig
  )
  return { groups: data, isLoading, isError: error, mutate }
}


export function useMembers() {
  const { data, error, isLoading, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_BASE_URL}/members`,
    fetcher,
    swrConfig
  )
  return { members: data, isLoading, isError: error, mutate }
}


export function useWorkspaces() {
  const { data, error, isLoading, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_BASE_URL}/workspaces`,
    fetcher,
    swrConfig
  )
  return { workspaces: data, isLoading, isError: error, mutate }
}