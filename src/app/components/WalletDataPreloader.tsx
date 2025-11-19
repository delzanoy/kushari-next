// components/WalletDataPreloader.tsx
'use client'

import { useWallet } from '../hooks/useData'

// This component preloads data for specific wallet IDs (1-6)
// It follows the same pattern as DataPreloader - calling hooks at top level
export default function WalletDataPreloader() {
  // Preload data for wallet IDs 1-6 by calling useWallet for each
  useWallet('1')
  useWallet('2') 
  useWallet('3')
  useWallet('4')
  useWallet('5')
  useWallet('6')

  return null
}