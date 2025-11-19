// hooks/useData.ts
"use client"
import useSWR from 'swr'

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
  const { data, error, isLoading, mutate } = useSWR(
    id ? `${process.env.NEXT_PUBLIC_BASE_URL}/wallet/${id}` : null,
    fetcher,
    swrConfig
  )

  // Since your API returns an array, take the first item
  const wallet = data ? data : null;
  
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