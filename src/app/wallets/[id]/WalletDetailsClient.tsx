// 'use client';

// import { useWallet } from '../../hooks/useData';
// import WalletDetails from './WalletDetails';
// import { 
//   useWallets, 
// } from '../../hooks/useData';
// import { useRouter } from 'next/navigation';

// interface WalletDetailsClientProps {
//   walletId: string;
//   addresses: any[];
// }

// export default function WalletDetailsClient({ walletId, addresses }: WalletDetailsClientProps) {
//   const router = useRouter();
//   // You can still use useParams if needed, but we're getting walletId from props
//   const { wallet, isLoading, isError } = useWallet(walletId);
//   const { wallets, isLoading: walletsLoading, isError: walletsError } = useWallets();

//   console.log(wallets);

//   if (isLoading) {
//     return (
//       <div className="flex flex-col w-full max-w-[1040px] mx-auto items-start gap-8 pt-8">
//         <div className="text-[#F8FCFF] font-[Figtree] text-2xl">Loading...</div>
//       </div>
//     );
//   }

//   if (isError || !wallet) {
//     return (
//       <div className="flex flex-col w-full max-w-[1040px] mx-auto items-start gap-8 pt-8">
//         <div className="text-[#F8FCFF] font-[Figtree] text-2xl">Error loading wallet</div>
//       </div>
//     );
//   }

//   const handleWalletChange = (walletId: number) => {
//         // Pass the entire wallets array as a query parameter

//         router.push(`/wallets/${walletId}`);
//     };

//   return (
//     <div className="flex flex-col w-full max-w-[1040px] mx-auto items-start">
//       <WalletDetails wallet={wallet} addresses={addresses} wallets={wallets || []} onWalletChange={handleWalletChange}/>
//     </div>
//   );
// }


// 'use client';

// import { useCryptocurrencies, useWallet, useMembers } from '../../hooks/useData';
// import WalletDetails from './WalletDetails';
// import {
//   useWallets,
// } from '../../hooks/useData';
// import { useRouter } from 'next/navigation';

// interface WalletDetailsClientProps {
//   walletId: string;
//   addresses: any[];
// }

// export default function WalletDetailsClient({ walletId, addresses }: WalletDetailsClientProps) {
//   const router = useRouter();
//   const { wallet, isLoading, isError } = useWallet(walletId);
//   const { wallets, isLoading: walletsLoading, isError: walletsError } = useWallets();
//   const { cryptocurrencies, isLoading: cryptosLoading, isError: cryptosError } = useCryptocurrencies();
//   const { members, isLoading: membersLoading, isError: membersError } = useMembers();


//   // Show loading if either wallet or wallets are loading
//   if (isLoading || walletsLoading) {
//     return (
//       <div className="flex flex-col w-full max-w-[1040px] mx-auto items-start gap-8 pt-8">
//         <div className="text-[#F8FCFF] font-[Figtree] text-2xl">Loading...</div>
//       </div>
//     );
//   }

//   // Show error if either wallet or wallets have errors
//   if (isError || !wallet || walletsError) {
//     return (
//       <div className="flex flex-col w-full max-w-[1040px] mx-auto items-start gap-8 pt-8">
//         <div className="text-[#F8FCFF] font-[Figtree] text-2xl">
//           {isError || !wallet ? "Error loading wallet" : "Error loading wallets"}
//         </div>
//       </div>
//     );
//   }

//   const handleWalletChange = (walletId: number) => {
//     router.push(`/wallets/${walletId}`);
//   };

//   return (
//     <div className="flex flex-col w-full max-w-[1040px] mx-auto items-start">
//       <WalletDetails
//         wallet={wallet}
//         addresses={addresses}
//         wallets={wallets || []}
//         cryptocurrencies={cryptocurrencies || []}
//         members={members}
//         onWalletChange={handleWalletChange}
//       />
//     </div>
//   );
// }



// 'use client';

// import { useState, useEffect } from 'react';
// import { useCryptocurrencies, useWallet, useMembers } from '../../hooks/useData';
// import WalletDetails from './WalletDetails';
// import { useWallets } from '../../hooks/useData';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { ProposalCategory } from '../../transactions/proposals/types';

// interface WalletDetailsClientProps {
//   walletId: string;
//   addresses: any[];
// }

// export default function WalletDetailsClient({ walletId, addresses }: WalletDetailsClientProps) {
//   const router = useRouter();
//   const searchParams = useSearchParams();
  
//   const { wallet, isLoading, isError } = useWallet(walletId);
//   const { wallets, isLoading: walletsLoading, isError: walletsError } = useWallets();
//   const { cryptocurrencies, isLoading: cryptosLoading, isError: cryptosError } = useCryptocurrencies();
//   const { members, isLoading: membersLoading, isError: membersError } = useMembers();

//   // Manage tab state here in the parent
//   const [tabState, setTabState] = useState<{
//     activeTab: string;
//     activeProposalFilter: ProposalCategory | null;
//   }>({
//     activeTab: 'proposals',
//     activeProposalFilter: null
//   });

//   // Track if we've initialized from URL to prevent overwriting
//   const [hasInitializedFromUrl, setHasInitializedFromUrl] = useState(false);

//   // Initialize tab state from URL search params if available - ONLY ONCE
//   useEffect(() => {
//     if (!hasInitializedFromUrl && wallet) {
//       const tabFromUrl = searchParams.get('tab');
//       const subtabFromUrl = searchParams.get('subtab');
      
//       let newTabState = { ...tabState };
      
//       if (tabFromUrl) {
//         newTabState.activeTab = tabFromUrl;
//       }
      
//       if (subtabFromUrl) {
//         // Convert URL subtab to ProposalCategory
//         const categoryMap: Record<string, ProposalCategory> = {
//           'needs-approval': ProposalCategory.NEEDS_APPROVAL,
//           'ready-to-execute': ProposalCategory.READY_TO_EXECUTE,
//           'discarded': ProposalCategory.DISCARDED,
//         };
//         const proposalFilter = categoryMap[subtabFromUrl] || null;
//         newTabState.activeProposalFilter = proposalFilter;
//       }
      
//       setTabState(newTabState);
//       setHasInitializedFromUrl(true);
//     }
//   }, [searchParams, wallet, hasInitializedFromUrl, tabState]);

//   // Handler for tab state changes
//   const handleTabStateChange = (activeTab: string, activeProposalFilter: ProposalCategory | null) => {
//     setTabState({ activeTab, activeProposalFilter });
    
//     // Update URL with new tab state
//     const newParams = new URLSearchParams(searchParams);
//     newParams.set('tab', activeTab);
    
//     if (activeProposalFilter) {
//       // Convert ProposalCategory to URL-friendly string
//       const subtabMap: Record<ProposalCategory, string> = {
//         [ProposalCategory.NEEDS_APPROVAL]: 'needs-approval',
//         [ProposalCategory.READY_TO_EXECUTE]: 'ready-to-execute',
//         [ProposalCategory.DISCARDED]: 'discarded',
//       };
//       newParams.set('subtab', subtabMap[activeProposalFilter]);
//     } else {
//       newParams.delete('subtab');
//     }
    
//     router.replace(`?${newParams.toString()}`, { scroll: false });
//   };

//   const handleWalletChange = (newWalletId: number) => {
//     // Preserve CURRENT tab state when switching wallets
//     // Get the current tab state from our state (not from URL)
//     const currentTabState = {
//       activeTab: tabState.activeTab,
//       activeProposalFilter: tabState.activeProposalFilter
//     };
    
//     // Create URL params with current tab state
//     const newParams = new URLSearchParams();
//     newParams.set('tab', currentTabState.activeTab);
    
//     if (currentTabState.activeProposalFilter) {
//       const subtabMap: Record<ProposalCategory, string> = {
//         [ProposalCategory.NEEDS_APPROVAL]: 'needs-approval',
//         [ProposalCategory.READY_TO_EXECUTE]: 'ready-to-execute',
//         [ProposalCategory.DISCARDED]: 'discarded',
//       };
//       newParams.set('subtab', subtabMap[currentTabState.activeProposalFilter]);
//     }
    
//     // Navigate to new wallet with preserved tab state
//     router.push(`/wallets/${newWalletId}?${newParams.toString()}`);
//   };

//   // Reset URL initialization when wallet changes
//   useEffect(() => {
//     setHasInitializedFromUrl(false);
//   }, [walletId]);

//   // Show loading if any data is loading
//   if (isLoading || walletsLoading || cryptosLoading || membersLoading) {
//     return (
//       <div className="flex flex-col w-full max-w-[1040px] mx-auto items-start gap-8 pt-8">
//         <div className="text-[#F8FCFF] font-[Figtree] text-2xl">Loading...</div>
//       </div>
//     );
//   }

//   // Show error if any data has errors
//   if (isError || !wallet || walletsError || cryptosError || membersError) {
//     return (
//       <div className="flex flex-col w-full max-w-[1040px] mx-auto items-start gap-8 pt-8">
//         <div className="text-[#F8FCFF] font-[Figtree] text-2xl">
//           {isError || !wallet ? "Error loading wallet" : 
//            walletsError ? "Error loading wallets" :
//            cryptosError ? "Error loading cryptocurrencies" :
//            "Error loading members"}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col w-full max-w-[1040px] mx-auto items-start">
//       <WalletDetails
//         wallet={wallet}
//         addresses={addresses}
//         wallets={wallets || []}
//         cryptocurrencies={cryptocurrencies || []}
//         members={members}
//         onWalletChange={handleWalletChange}
//         // Pass tab state down to WalletDetails
//         activeTab={tabState.activeTab}
//         activeProposalFilter={tabState.activeProposalFilter}
//         onTabStateChange={handleTabStateChange}
//       />
//     </div>
//   );
// }




'use client';

import { useMemo, useCallback } from 'react';
import { useCryptocurrencies, useWallet, useMembers } from '../../hooks/useData';
import WalletDetails from './WalletDetails';
import { useWallets } from '../../hooks/useData';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProposalCategory } from '../../transactions/proposals/types';

interface WalletDetailsClientProps {
  walletId: string;
  addresses: any[];
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