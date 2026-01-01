// components/DataPreloader.tsx
'use client'

import {
  useWallets,
  useCryptocurrencies,
  useAssets,
  useTransactions,
  useProposals,
  useAddresses,
  useGroups,
  useMembers,
  useWorkspaces
} from '../hooks/useData'

// This component runs on the client and preloads all data in the background
// It doesn't render anything visible but triggers the SWR hooks to cache data
export default function DataPreloader() {
  // Trigger all SWR hooks - they will fetch and cache data in the background
  useWallets()
  useCryptocurrencies()
  useAssets()
  useTransactions()
  useProposals()
  useAddresses()
  useGroups()
  useMembers()
  useWorkspaces()
  return null
}