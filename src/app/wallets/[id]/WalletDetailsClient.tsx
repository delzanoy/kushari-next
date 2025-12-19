'use client';

import { useMemo, useCallback } from 'react';
import { useCryptocurrencies, useWallet, useMembers } from '../../hooks/useData';
import WalletDetails from './WalletDetails';
import { useWallets } from '../../hooks/useData';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProposalCategory } from '../../transactions/proposals/types';
import { AddressCardProps } from '@/app/address-book/addresses/types';

interface WalletDetailsClientProps {
  walletId: string;
  addresses: AddressCardProps[];
}

export default function WalletDetailsClient({ walletId, addresses }: WalletDetailsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const { wallet, isLoading, isError } = useWallet(walletId);
  const { wallets, isLoading: walletsLoading, isError: walletsError } = useWallets();
  const { cryptocurrencies, isLoading: cryptosLoading, isError: cryptosError } = useCryptocurrencies();
  const { members, isLoading: membersLoading, isError: membersError } = useMembers();

  // Read tab state from URL on every render (memoized)
  const tabStateFromUrl = useMemo(() => {
    const tabFromUrl = searchParams.get('tab');
    const subtabFromUrl = searchParams.get('subtab');
    
    if (tabFromUrl) {
      const categoryMap: Record<string, ProposalCategory> = {
        'needs-approval': ProposalCategory.NEEDS_APPROVAL,
        'ready-to-execute': ProposalCategory.READY_TO_EXECUTE,
        'discarded': ProposalCategory.DISCARDED,
      };
      
      return {
        activeTab: tabFromUrl,
        activeProposalFilter: subtabFromUrl ? categoryMap[subtabFromUrl] || null : null
      };
    }
    
    return undefined;
  }, [searchParams]);

  // Handler for tab state changes - just update URL, WalletDetails manages its own state
  const handleTabStateChange = useCallback((activeTab: string, activeProposalFilter: ProposalCategory | null) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', activeTab);
    
    if (activeProposalFilter) {
      const subtabMap: Record<ProposalCategory, string> = {
        [ProposalCategory.NEEDS_APPROVAL]: 'needs-approval',
        [ProposalCategory.READY_TO_EXECUTE]: 'ready-to-execute',
        [ProposalCategory.DISCARDED]: 'discarded',
      };
      newParams.set('subtab', subtabMap[activeProposalFilter]);
    } else {
      newParams.delete('subtab');
    }
    
    router.replace(`?${newParams.toString()}`, { scroll: false });
  }, [router, searchParams]);

  const handleWalletChange = useCallback((newWalletId: number) => {
    // Keep current URL params (including tab state)
    const currentParams = searchParams.toString();
    router.push(`/wallets/${newWalletId}${currentParams ? `?${currentParams}` : ''}`);
  }, [router, searchParams]);

  // Show loading if any data is loading
  if (isLoading || walletsLoading || cryptosLoading || membersLoading) {
    return (
      <div className="flex flex-col w-full max-w-[1040px] mx-auto items-start gap-8 pt-8">
        <div className="text-[#F8FCFF] font-[Figtree] text-2xl">Loading...</div>
      </div>
    );
  }

  // Show error if any data has errors
  if (isError || !wallet || walletsError || cryptosError || membersError) {
    return (
      <div className="flex flex-col w-full max-w-[1040px] mx-auto items-start gap-8 pt-8">
        <div className="text-[#F8FCFF] font-[Figtree] text-2xl">
          {isError || !wallet ? "Error loading wallet" : 
           walletsError ? "Error loading wallets" :
           cryptosError ? "Error loading cryptocurrencies" :
           "Error loading members"}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-[1040px] mx-auto items-start">
      <WalletDetails
        wallet={wallet}
        addresses={addresses}
        wallets={wallets || []}
        cryptocurrencies={cryptocurrencies || []}
        members={members}
        onWalletChange={handleWalletChange}
        // Pass state from URL (re-reads on every URL change)
        activeTab={tabStateFromUrl?.activeTab}
        activeProposalFilter={tabStateFromUrl?.activeProposalFilter}
        onTabStateChange={handleTabStateChange}
      />
    </div>
  );
}