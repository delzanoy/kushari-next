// lib/server-data.ts
import { cache } from 'react'

export const getWallets = cache(async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/wallets`, {
    next: { revalidate: 300 }
  })
  if (!res.ok) throw new Error('Failed to fetch wallets')
  return res.json()
})

export const getCryptocurrencies = cache(async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/cryptocurrencies`, {
    next: { revalidate: 300 }
  })
  if (!res.ok) throw new Error('Failed to fetch cryptocurrencies')
  return res.json()
})

export const getAssets = cache(async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/assets`, {
    next: { revalidate: 300 }
  })
  if (!res.ok) throw new Error('Failed to fetch assets')
  return res.json()
})

export const getTransactions = cache(async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/transactions`, {
    next: { revalidate: 300 }
  })
  if (!res.ok) throw new Error('Failed to fetch transactions')
  return res.json()
})

export const getProposals = cache(async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/proposals`, {
    next: { revalidate: 300 }
  })
  if (!res.ok) throw new Error('Failed to fetch proposals')
  return res.json()
})

export const getAddresses = cache(async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/addresses`, {
    next: { revalidate: 300 }
  })
  if (!res.ok) throw new Error('Failed to fetch addresses')
  return res.json()
})

export const getGroups = cache(async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/groups`, {
    next: { revalidate: 300 }
  })
  if (!res.ok) throw new Error('Failed to fetch groups')
  return res.json()
})


export const getWallet = cache(async (id: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/wallet/${id}`, {
    next: { revalidate: 300 }
  })
  
  if (!res.ok) {
    throw new Error(`Failed to fetch wallet: ${res.status} ${res.statusText}`)
  }
  
  const data = await res.json() 
  
  // If it's an object but empty or missing expected properties
  if (data && typeof data === 'object' && Object.keys(data).length === 0) {
    throw new Error('Wallet not found')
  }

  console.log('Fetched wallet data:', data)
  
  return data
})