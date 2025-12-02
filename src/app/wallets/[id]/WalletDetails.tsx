// import TertiaryButton from "@/app/components/buttons/TertiaryButton";
// import PrimaryButton from "@/app/components/buttons/PrimaryButton";
// import { VaultIcon, GnosisSafeIcon, TrackedWalletIcon, EthereumIcon, BSCIcon, PolygonIcon, GnosisIcon, OPTIMISMIcon, SOLIcon, QRCodeIcon, SendIcon, ArrowLeftUpBoxFill, EditIcon } from "@/app/components/icons";
// import Tooltip from "../../components/TooltipComponent";
// import { formatCents, formatDollars } from "@/app/components/helpers";
// import { Wallet, MPCVaultWallet, GnosisSafeWallet, TrackedWallet } from "../type";
// import { Transaction } from "../../transactions/view-all/types";
// import { Proposal, ProposalCategory, ProposalStatus } from "../../transactions/proposals/types";
// import NavTab from "@/app/components/buttons/NavTab";
// import React, { useState, useMemo, useEffect, useCallback, memo } from "react";
// import ProposalList from "@/app/transactions/proposals/ProposalList";
// import TransactionList from "@/app/transactions/view-all/TransactionList";
// import AssetList from "@/app/assets/AssetList";
// import { Asset, WalletInfo } from "@/app/assets/types"
// import { AddressCardProps } from "@/app/address-book/addresses/types";
// import { transformApiDataToProposals } from "@/app/transactions/proposals/transformProposals";
// import { QRCodeSVG } from 'qrcode.react';
// import TertiaryButtonWithDropdown from "@/app/components/buttons/TertiaryButtonWithDropdown";
// import { useRouter } from 'next/navigation';
// import { useRef } from "react";
// import { Cryptocurrency } from '@/app/assets/types';
// import PolicyContent from './components/PolicyContent';

// interface TransactionWithDateInfo extends Transaction {
//     showDate: boolean;
//     isFirstOfDate: boolean;
// }

// // --- Constants (Moved Outside Components) ---
// const TAB_ORDER = ['proposals', 'assets', 'transactions', 'policy'] as const;
// const PREVIEW_ITEMS_COUNT = 8;
// const WALLET_GROUPS = [
//     { key: '1', label: 'Vaults' },
//     { key: '2', label: 'Gnosis Safes' },
//     { key: '3', label: 'Tracked Wallets' }
// ];

// const getTabOrder = (walletType: number) => {
//     if (walletType === 3) {
//         return ['assets', 'transactions'] as const;
//     }
//     return ['proposals', 'assets', 'transactions', 'policy'] as const;
// };

// // --- Helper Functions (Moved Outside Components) ---
// const getHumanReadableCategory = (category: ProposalCategory): string => {
//     const nameMap: Record<ProposalCategory, string> = {
//         [ProposalCategory.NEEDS_APPROVAL]: "Needs approval",
//         [ProposalCategory.READY_TO_EXECUTE]: "Ready to execute",
//         [ProposalCategory.DISCARDED]: "Discarded",
//     };
//     return nameMap[category] || "Needs approval";
// };

// const getCategoryFromHumanReadable = (humanReadableName: string): ProposalCategory => {
//     const categoryMap: Record<string, ProposalCategory> = {
//         "Needs approval": ProposalCategory.NEEDS_APPROVAL,
//         "Ready to execute": ProposalCategory.READY_TO_EXECUTE,
//         "Discarded": ProposalCategory.DISCARDED,
//     };
//     return categoryMap[humanReadableName] || ProposalCategory.NEEDS_APPROVAL;
// };

// const capitalizeFirstLetter = (str: string): string => {
//     if (!str || str.length === 0) return str;
//     return str.charAt(0).toUpperCase() + str.slice(1);
// };

// // --- Icon Helper Functions (Moved Outside Components) ---

// const renderWalletIcon = (walletType: number) => {
//     const iconMap: Record<number, React.ReactElement> = {
//         1: <VaultIcon className="w-[24px] h-[24px] aspect-square" />,
//         2: <GnosisSafeIcon className="w-[24px] h-[24px] aspect-square" />,
//         3: <TrackedWalletIcon className="w-[24px] h-[24px] aspect-square" />,
//     };
//     return iconMap[walletType] || null;
// };

// type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

// const getBlockchainIcon = (blockchainName: string, size: IconSize = 'lg'): React.ReactElement | null => {
//     const sizeClasses: Record<IconSize, string> = {
//         'xs': 'w-3 h-3',
//         'sm': 'w-3.5 h-3.5',
//         'md': 'w-[15px] h-[15px]',
//         'lg': 'w-4 h-4', // 16px - DEFAULT
//         'xl': 'w-5 h-5',
//         '2xl': 'w-6 h-6',
//         '3xl': 'w-7 h-7',
//         '4xl': 'w-8 h-8',
//     };

//     const iconSizeClass = sizeClasses[size];

//     const iconMap: Record<string, React.ReactElement> = {
//         "BSC": <BSCIcon className={`${iconSizeClass} shrink-0 inline-flex items-center`} />,
//         "Ethereum": <EthereumIcon className={`${iconSizeClass} shrink-0 inline-flex items-center`} />,
//         "Gnosis chain": <GnosisIcon className={`${iconSizeClass} shrink-0 inline-flex items-center`} />,
//         "Optimism": <OPTIMISMIcon className={`${iconSizeClass} shrink-0 inline-flex items-center`} />,
//         "Polygon": <PolygonIcon className={`${iconSizeClass} shrink-0 inline-flex items-center`} />,
//         "Solana": <SOLIcon className={`${iconSizeClass} shrink-0 inline-flex items-center`} />,
//     };

//     return iconMap[blockchainName] || null;
// };

// const getBlockchainIcons = (
//     blockchainData: string | Array<{ blockchain: string }> | undefined,
//     size: IconSize = 'lg' // Default to 16px
// ): React.ReactElement | null => {
//     if (!blockchainData) {
//         return null;
//     }

//     if (typeof blockchainData === 'string') {
//         const icon = getBlockchainIcon(blockchainData, size);
//         return icon ? (
//             <Tooltip title={blockchainData} position="top">
//                 {icon}
//             </Tooltip>
//         ) : null;
//     } else if (Array.isArray(blockchainData)) {
//         return (
//             <>
//                 {blockchainData.map((item, index) => {
//                     const icon = getBlockchainIcon(item.blockchain, size);
//                     return icon ? (
//                         <Tooltip key={index} title={item.blockchain} position="top">
//                             {icon}
//                         </Tooltip>
//                     ) : null;
//                 })}
//             </>
//         );
//     }
//     return null;
// };

// // Custom hook for animation logic
// const useTabAnimation = () => {
//     const [animationDirection, setAnimationDirection] = useState<'left' | 'right' | null>(null);

//     const calculateDirection = useCallback((currentIndex: number, newIndex: number) => {
//         return newIndex > currentIndex ? 'right' : 'left';
//     }, []);

//     const resetAnimation = useCallback(() => {
//         setAnimationDirection(null);
//     }, []);

//     return {
//         animationDirection,
//         setAnimationDirection: calculateDirection,
//         resetAnimation,
//     };
// };

// // OPTIMIZATION: Memoized BalanceDisplay component
// const BalanceDisplay = memo(({ label, value }: { label: string; value: number }) => (
//     <div className="flex flex-col justify-center items-start gap-[7px]">
//         <span className="text-[#F8FCFF] font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px] opacity-80">
//             {label}
//         </span>
//         <div className="flex items-baseline">
//             <span className="text-[#F8FCFF] font-[Geist] text-[22px] not-italic font-normal leading-[normal] tracking-[0.88px]">
//                 $ {formatDollars(value)}
//             </span>
//             <span className="text-[#F8FCFF] font-[Geist] text-[22px] not-italic font-normal leading-[normal] tracking-[0.88px] opacity-80">
//                 .{formatCents(value)}
//             </span>
//         </div>
//     </div>
// ));

// // OPTIMIZATION: Memoized WalletHeader component
// const WalletHeader = memo(({
//     wallet,
//     proposed,
//     available,
//     totalBalance,
//     wallets = [],
//     onWalletChange,
//     onBackToWallets
// }: {
//     wallet: Wallet;
//     proposed: number;
//     available: number;
//     totalBalance: number;
//     wallets?: Wallet[];
//     onWalletChange?: (walletId: number) => void;
//     onBackToWallets?: () => void;
// }) => {
//     const [copiedAddress, setCopiedAddress] = useState(false);
//     const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
//     const displayName = useMemo(() => capitalizeFirstLetter(wallet.name), [wallet.name]);

//     // OPTIMIZATION: Memoize dropdown options to prevent re-calculation
//     const dropdownOptions = useMemo(() =>
//         wallets
//             .filter(w => w.id !== wallet.id)
//             .map(w => ({
//                 value: w.id.toString(),
//                 label: capitalizeFirstLetter(w.name),
//                 groupKey: w.type.toString()
//             })),
//         [wallets, wallet.id]
//     );

//     const handleWalletChange = useCallback((walletId: string) => {
//         onWalletChange?.(parseInt(walletId));
//     }, [onWalletChange]);

//     const handleCopyAddress = useCallback(async () => {
//         // Clear any existing timeout
//         if (copyTimeoutRef.current) {
//             clearTimeout(copyTimeoutRef.current);
//         }

//         try {
//             // Modern clipboard API
//             if (navigator.clipboard && window.isSecureContext) {
//                 await navigator.clipboard.writeText(wallet.address);
//             } else {
//                 // Fallback for older browsers or non-secure contexts
//                 const textArea = document.createElement('textarea');
//                 textArea.value = wallet.address;
//                 textArea.style.position = 'fixed';
//                 textArea.style.opacity = '0';
//                 document.body.appendChild(textArea);
//                 textArea.select();
//                 document.execCommand('copy');
//                 document.body.removeChild(textArea);
//             }

//             setCopiedAddress(true);

//             // Reset the tooltip after 5 seconds
//             copyTimeoutRef.current = setTimeout(() => {
//                 setCopiedAddress(false);
//             }, 5000);

//         } catch (err) {
//             console.error('Failed to copy address:', err);
//             // Optional: You could show an error state here
//         }
//     }, [wallet.address]);

//     useEffect(() => {
//         return () => {
//             if (copyTimeoutRef.current) {
//                 clearTimeout(copyTimeoutRef.current);
//             }
//         };
//     }, []);

//     return (
//         <div className="flex flex-col items-start gap-16 self-stretch">
//             <div className="flex flex-col items-start gap-3 self-stretch">
//                 <div className="flex items-center gap-2.5 self-stretch">
//                     <TertiaryButton label="Wallets" size="sm" status="neutral" onClick={onBackToWallets} />
//                     <span className="text-[12px] font-medium truncate font-[Geist] not-italic leading-[normal] tracking-[0.48px]">/</span>

//                     <TertiaryButtonWithDropdown
//                         label={displayName}
//                         dropdownOptions={dropdownOptions}
//                         dropdownValue={wallet.id.toString()}
//                         onDropdownChange={handleWalletChange}
//                         groups={WALLET_GROUPS}
//                         status="neutral"
//                         size="sm"
//                         dropdownPlaceholder={displayName}
//                     />
//                 </div>
//                 <div className="flex justify-between items-start self-stretch">
//                     <div className="flex flex-col items-start gap-[5px]">
//                         <div className="flex items-center gap-3">
//                             {renderWalletIcon(wallet.type)}
//                             <h1 className="text-[#F8FCFF] font-[Figtree] text-[26px] not-italic font-medium leading-[normal] tracking-[1.04px]">
//                                 {displayName}
//                             </h1>
//                         </div>
//                         <div className="flex items-center gap-[5px]">
//                             <div className="inline-flex items-center -space-x-[4px]">
//                                 {getBlockchainIcons(wallet.blockchain)}
//                             </div>
//                             <TertiaryButton label={wallet.address} status={copiedAddress ? "brand" : "neutral"} tooltipTitle={copiedAddress ? "Address copied" : "Copy address"}
//                                 onClick={handleCopyAddress}
//                             />
//                         </div>
//                     </div>
//                     <div className="flex items-center gap-3.5">
//                         <PrimaryButton
//                             label="Make deposit"
//                             variant={totalBalance === 0 ? "brand" : "neutral"}
//                             size="md"
//                             leadingIcon={<QRCodeIcon />}
//                         />
//                         {totalBalance > 0 && (
//                             <PrimaryButton label="Send tokens" variant="neutral" size="md" leadingIcon={<SendIcon />} />
//                         )}
//                     </div>
//                 </div>
//             </div>
//             <div className="flex w-full items-center gap-9">
//                 <BalanceDisplay label="Proposed" value={proposed} />
//                 <BalanceDisplay label="Available" value={available} />
//                 <BalanceDisplay label="Total" value={totalBalance} />
//             </div>
//         </div>
//     );
// });

// // AnimatedContent component
// const AnimatedContent = ({
//     animationDirection,
//     activeTab,
//     activeProposalFilter,
//     children
// }: {
//     animationDirection: 'left' | 'right' | null;
//     activeTab: string;
//     activeProposalFilter: ProposalCategory | null;
//     children: React.ReactNode;
// }) => {
//     const getTransformClass = () => {
//         switch (animationDirection) {
//             case 'left': return 'translate-x-full';
//             case 'right': return '-translate-x-full';
//             default: return 'translate-x-0';
//         }
//     };

//     return (
//         <div className="relative w-full overflow-visible">
//             <div
//                 className={`transition-transform duration-300 ease-in-out ${getTransformClass()}`}
//                 key={`${activeTab}-${activeProposalFilter}`}
//             >
//                 {children}
//             </div>
//         </div>
//     );
// };

// // Props for WalletDetails component
// interface WalletDetailsProps {
//     wallet: Wallet;
//     addresses: AddressCardProps[];
//     wallets?: Wallet[];
//     cryptocurrencies?: Cryptocurrency[];
//     members?: any[];
//     onWalletChange?: (walletId: number) => void;
//     // NEW: Add props to preserve tab state
//     activeTab?: string;
//     activeProposalFilter?: ProposalCategory | null;
//     onTabStateChange?: (activeTab: string, activeProposalFilter: ProposalCategory | null) => void;
// }

// export default function WalletDetails({
//     wallet,
//     addresses = [],
//     wallets = [],
//     cryptocurrencies = [],
//     members = [],
//     onWalletChange,
//     // NEW: Accept tab state from parent
//     activeTab: externalActiveTab,
//     activeProposalFilter: externalActiveProposalFilter,
//     onTabStateChange
// }: WalletDetailsProps) {
//     // Initialize Next.js router for navigation
//     const router = useRouter();

//     const tabOrder = useMemo(() => getTabOrder(wallet.type), [wallet.type]);
//     type TabType = typeof tabOrder[number];

//     // NEW: Use external state if provided, otherwise internal state
//     const [internalActiveTab, setInternalActiveTab] = useState<TabType>(tabOrder[0]);
//     const [internalActiveProposalFilter, setInternalActiveProposalFilter] = useState<ProposalCategory | null>(null);

//     // Use external state if provided, otherwise internal state
//     const activeTab = externalActiveTab !== undefined ? externalActiveTab as TabType : internalActiveTab;
//     const activeProposalFilter = externalActiveProposalFilter !== undefined ? externalActiveProposalFilter : internalActiveProposalFilter;

//     const [hasAutoSwitched, setHasAutoSwitched] = useState(false);

//     const { animationDirection, setAnimationDirection, resetAnimation } = useTabAnimation();

//     // NEW: Unified state setters that notify parent if callback provided
//     const setActiveTab = useCallback((newTab: TabType) => {
//         if (onTabStateChange) {
//             onTabStateChange(newTab, activeProposalFilter);
//         } else {
//             setInternalActiveTab(newTab);
//         }
//     }, [onTabStateChange, activeProposalFilter]);

//     const setActiveProposalFilter = useCallback((newFilter: ProposalCategory | null) => {
//         if (onTabStateChange) {
//             onTabStateChange(activeTab, newFilter);
//         } else {
//             setInternalActiveProposalFilter(newFilter);
//         }
//     }, [onTabStateChange, activeTab]);

//     const handleBackToWallets = useCallback(() => {
//         router.push('/wallets');
//     }, [router]);

//     // All useMemo hooks for calculations (unchanged)
//     const transformedProposals = useMemo(() => {
//         if (!wallet.proposals) return [];
//         const proposalsWithCalculations = wallet.proposals.map(proposal => {
//             const outgoingUSD = proposal.outTokens && proposal.outUSDPrice
//                 ? proposal.outTokens * proposal.outUSDPrice
//                 : 0;
//             return { ...proposal, outgoingUSD };
//         });
//         return transformApiDataToProposals(proposalsWithCalculations);
//     }, [wallet.proposals]);

//     const uniqueClassifications = useMemo(() => {
//         return Array.from(
//             new Set(transformedProposals.map((proposal: Proposal) => proposal.classification).filter(Boolean))
//         ) as string[];
//     }, [transformedProposals]);

//     const { totalBalance, proposed, available } = useMemo(() => {
//         const total = wallet.balance.reduce((sum, asset) => sum + (asset.tokens * asset.price), 0);
//         const proposedAmount = transformedProposals
//             .filter(proposal =>
//                 [ProposalStatus.ACTION_REQUIRED, ProposalStatus.NO_ACTION, ProposalStatus.ACTIONED,
//                 ProposalStatus.READY, ProposalStatus.EXECUTING, ProposalStatus.AWAITING_NONCE].includes(proposal.status)
//             )
//             .reduce((sum: number, proposal: Proposal) =>
//                 sum + (proposal.outTokens * (proposal.outUSDPrice || 0)), 0);
//         return { totalBalance: total, proposed: proposedAmount, available: total - proposedAmount };
//     }, [wallet.balance, transformedProposals]);

//     const proposalCounts = useMemo(() => {
//         const counts = {
//             [ProposalCategory.NEEDS_APPROVAL]: transformedProposals.filter(p =>
//                 p.status === ProposalStatus.ACTION_REQUIRED
//             ).length,
//             [ProposalCategory.READY_TO_EXECUTE]: transformedProposals.filter(p =>
//                 p.status === ProposalStatus.FAILED ||
//                 p.status === ProposalStatus.READY
//             ).length,
//             [ProposalCategory.DISCARDED]: transformedProposals.filter(p =>
//                 p.category === ProposalCategory.DISCARDED
//             ).length,
//             totalProposals: transformedProposals.length,
//         };
//         const navTabDiscardedCount = transformedProposals.filter(p =>
//             p.status === ProposalStatus.FAILED_REJECTED
//         ).length;

//         return {
//             needsApprovalCount: counts[ProposalCategory.NEEDS_APPROVAL],
//             readyToExecuteCount: counts[ProposalCategory.READY_TO_EXECUTE],
//             discardedCount: counts[ProposalCategory.DISCARDED], // Full count for actual filtering
//             navTabDiscardedCount: navTabDiscardedCount, // NEW: Only FAILED_REJECTED for display
//             totalProposals: counts.totalProposals,
//             categoryCounts: counts
//         };
//     }, [transformedProposals]);

//     const { needsApprovalCount, readyToExecuteCount, discardedCount, navTabDiscardedCount, totalProposals, categoryCounts } = proposalCounts;

//     const shouldShowAssetsTab = useMemo(() => {
//         return totalBalance === 0 &&
//             needsApprovalCount === 0 &&
//             readyToExecuteCount === 0 &&
//             discardedCount === 0;
//     }, [totalBalance, needsApprovalCount, readyToExecuteCount, discardedCount]);

//     const highestCountSubtitle = useMemo((): ProposalCategory => {
//         const counts = categoryCounts;
//         let highestCategory: ProposalCategory = ProposalCategory.NEEDS_APPROVAL;
//         let highestCount = -1;
//         const mainCategories = [ProposalCategory.NEEDS_APPROVAL, ProposalCategory.READY_TO_EXECUTE, ProposalCategory.DISCARDED];
//         mainCategories.forEach((category: ProposalCategory) => {
//             if (counts[category] > highestCount) {
//                 highestCount = counts[category];
//                 highestCategory = category;
//             }
//         });
//         return highestCategory;
//     }, [categoryCounts]);

//     // Navigation handlers for "View all" buttons (unchanged)
//     const handleViewAllProposals = useCallback(() => {
//         const tabMapping = {
//             [ProposalCategory.NEEDS_APPROVAL]: 'needs-approval',
//             [ProposalCategory.READY_TO_EXECUTE]: 'ready-to-execute',
//             [ProposalCategory.DISCARDED]: 'discarded'
//         };

//         const activeTabParam = activeProposalFilter ? tabMapping[activeProposalFilter] : 'needs-approval';
//         router.push(`/transactions/proposals?wallet=${wallet.name}&tab=${activeTabParam}`);
//     }, [router, wallet.name, activeProposalFilter]);

//     const handleViewAllAssets = useCallback(() => {
//         router.push(`/assets?wallet=${wallet.name}`);
//     }, [router, wallet.name]);

//     const handleViewAllTransactions = useCallback(() => {
//         router.push(`/transactions/view-all?wallet=${wallet.name}`);
//     }, [router, wallet.name]);

//     // Helper function to get the label for the current proposal filter
//     const getCurrentProposalLabel = useCallback(() => {
//         if (!activeProposalFilter) return 'proposals';

//         switch (activeProposalFilter) {
//             case ProposalCategory.NEEDS_APPROVAL:
//                 return 'needs approval';
//             case ProposalCategory.READY_TO_EXECUTE:
//                 return 'ready to execute';
//             case ProposalCategory.DISCARDED:
//                 return 'discarded';
//             default:
//                 return 'proposals';
//         }
//     }, [activeProposalFilter]);

//     // All useCallback hooks for handlers - UPDATED to use new setters
//     const handleTabChange = useCallback((newTab: typeof activeTab) => {
//         const currentIndex = TAB_ORDER.indexOf(activeTab);
//         const newIndex = TAB_ORDER.indexOf(newTab);
//         setAnimationDirection(currentIndex, newIndex);
//         setActiveTab(newTab);
//         if (newTab !== 'proposals') {
//             setActiveProposalFilter(null);
//         }
//     }, [activeTab, setAnimationDirection, setActiveTab, setActiveProposalFilter]);

//     const handleProposalFilterChange = useCallback((subtitleName: string) => {
//         const category = getCategoryFromHumanReadable(subtitleName);
//         if (activeProposalFilter) {
//             const currentIndex = [ProposalCategory.NEEDS_APPROVAL, ProposalCategory.READY_TO_EXECUTE, ProposalCategory.DISCARDED].indexOf(activeProposalFilter);
//             const newIndex = [ProposalCategory.NEEDS_APPROVAL, ProposalCategory.READY_TO_EXECUTE, ProposalCategory.DISCARDED].indexOf(category);
//             setAnimationDirection(currentIndex, newIndex);
//         } else {
//             setAnimationDirection(0, [ProposalCategory.NEEDS_APPROVAL, ProposalCategory.READY_TO_EXECUTE, ProposalCategory.DISCARDED].indexOf(category));
//         }
//         setActiveProposalFilter(category);
//         setActiveTab('proposals');
//     }, [activeProposalFilter, setAnimationDirection, setActiveProposalFilter, setActiveTab]);

//     const handleProposalsTabClick = useCallback(() => {
//         const currentIndex = TAB_ORDER.indexOf(activeTab);
//         const newIndex = TAB_ORDER.indexOf('proposals');
//         setAnimationDirection(currentIndex, newIndex);
//         setActiveTab('proposals');
//         setActiveProposalFilter(highestCountSubtitle);
//     }, [activeTab, setAnimationDirection, setActiveTab, setActiveProposalFilter, highestCountSubtitle]);

//     // All useEffect hooks - UPDATED to use new setters
//     useEffect(() => {
//         if (shouldShowAssetsTab && !hasAutoSwitched && activeTab === 'proposals') {
//             setActiveTab('assets');
//             setHasAutoSwitched(true);
//         }
//     }, [shouldShowAssetsTab, hasAutoSwitched, activeTab, setActiveTab]);

//     useEffect(() => {
//         if (transformedProposals.length > 0 && activeProposalFilter === null) {
//             setActiveProposalFilter(highestCountSubtitle);
//         }
//     }, [transformedProposals, activeProposalFilter, highestCountSubtitle, setActiveProposalFilter]);

//     useEffect(() => {
//         if (activeTab === 'proposals' && activeProposalFilter === null && transformedProposals.length > 0) {
//             setActiveProposalFilter(highestCountSubtitle);
//         }
//     }, [activeTab, activeProposalFilter, transformedProposals, highestCountSubtitle, setActiveProposalFilter]);

//     useEffect(() => {
//         if (animationDirection) {
//             const timer = setTimeout(resetAnimation, 300);
//             return () => clearTimeout(timer);
//         }
//     }, [animationDirection, resetAnimation]);

//     // The rest of the component remains the same...
//     // [Previous code for memoizedTransformedAssets, memoizedTransformedTransactions, 
//     // renderProposalsContent, renderAssetsContent, renderTransactionsContent, renderPolicyContent,
//     // renderTabContent, walletHeader, navTabs, etc. remains unchanged]

//     // OPTIMIZATION: Memoized data transformations for content renderers
//     const memoizedTransformedAssets = useMemo(() => {
//         const blockchainInfo = Array.isArray(wallet.blockchain)
//             ? wallet.blockchain
//             : [{ blockchain: wallet.blockchain }];

//         const safeTotalBalance = totalBalance === 0 ? 1 : totalBalance;

//         return wallet.balance.map(balance => {
//             const walletInfo: WalletInfo = {
//                 walletId: wallet.id,
//                 walletType: wallet.type,
//                 name: wallet.name,
//                 balance: balance.tokens,
//                 assetId: balance.assetId,
//                 percentageShare: (balance.USD / safeTotalBalance) * 100
//             };
//             return {
//                 uniqueId: balance.uniqueId,
//                 assetId: balance.assetId,
//                 blockchain: blockchainInfo,
//                 countOfWallets: 1,
//                 totalTokens: balance.tokens,
//                 expanded: false,
//                 wallets: [walletInfo],
//                 percentageShareInUSD: (balance.USD / safeTotalBalance) * 100,
//                 percent_change_24h: wallet.percent_change_24h || 0,
//                 price: balance.price,
//                 symbol: balance.symbol,
//                 name: balance.name,
//                 fullName: balance.fullName,
//                 USD: balance.USD
//             };
//         });
//     }, [wallet.balance, wallet.blockchain, wallet.id, wallet.type, wallet.name, wallet.percent_change_24h, totalBalance]);

//     const memoizedTransformedTransactions = useMemo((): TransactionWithDateInfo[] => {
//         return (wallet.transactions || []).map((transaction, index, array) => {
//             const currentDate = new Date(transaction.timestamp).toDateString();
//             const prevDate = index > 0 ? new Date(array[index - 1].timestamp).toDateString() : null;
//             const isFirstOfDate = currentDate !== prevDate;
//             return {
//                 ...transaction,
//                 showDate: isFirstOfDate,
//                 isFirstOfDate
//             };
//         });
//     }, [wallet.transactions]);

//     // Memoized content renderers with navigation (unchanged)
//     const renderProposalsContent = useCallback(() => {
//         const filteredProposals = transformedProposals.filter(proposal =>
//             !activeProposalFilter || proposal.category === activeProposalFilter
//         );
//         const previewProposals = filteredProposals.slice(0, PREVIEW_ITEMS_COUNT);

//         if (filteredProposals.length === 0) {
//             return (
//                 <div className="text-center py-8 text-gray-500">
//                     No proposals found
//                 </div>
//             );
//         }
//         return (
//             <div className="relative">
//                 <ProposalList
//                     proposals={previewProposals}
//                     addresses={addresses}
//                     uniqueClassifications={uniqueClassifications}
//                 />
//                 {filteredProposals.length > PREVIEW_ITEMS_COUNT && (
//                     <div className="absolute bottom-0 flex w-full justify-center py-5 bg-gradient-to-t from-[#0E1011] to-transparent" onClick={handleViewAllProposals}>
//                         <PrimaryButton
//                             leadingIcon={<ArrowLeftUpBoxFill />}
//                             label={`${filteredProposals.length} ${getCurrentProposalLabel()}`}
//                             variant="inverted"
//                             size="md"

//                         />
//                     </div>
//                 )}
//             </div>
//         );
//     }, [transformedProposals, activeProposalFilter, addresses, uniqueClassifications, handleViewAllProposals, getCurrentProposalLabel]);

//     const renderAssetsContent = useCallback(() => {
//         const previewAssets = memoizedTransformedAssets.slice(0, PREVIEW_ITEMS_COUNT);
//         const displayWalletName = capitalizeFirstLetter(wallet.name);

//         return (
//             <div>
//                 {previewAssets.length > 0 ? (
//                     <div>
//                         <AssetList assets={previewAssets} />
//                         {memoizedTransformedAssets.length > PREVIEW_ITEMS_COUNT && (
//                             <div className="absolute bottom-0 flex w-full justify-center py-5 bg-gradient-to-t from-[#0E1011] to-transparent" onClick={handleViewAllAssets}>
//                                 <PrimaryButton
//                                     leadingIcon={<ArrowLeftUpBoxFill />}
//                                     label={`${memoizedTransformedAssets.length} assets`}
//                                     variant="inverted"
//                                     size="md"

//                                 />
//                             </div>
//                         )}
//                     </div>
//                 ) : (
//                     <div className="flex flex-col items-center">
//                         <div className="flex flex-col py-10 items-center gap-4">
//                             <div className="flex flex-col gap-1 items-center">
//                                 <span className="text-[#F8FCFF] font-[Figtree] text-[26px] not-italic font-medium leading-[normal] tracking-[1.04px]">{displayWalletName} has no assets</span>
//                                 <span className="text-[#EDEEEE] font-[Geist] text-sm not-italic font-normal leading-[normal] tracking-[0.56px]">Make deposit to start using wallet</span>
//                             </div>
//                             <svg width={256} height={256}>
//                                 <defs>
//                                     <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
//                                         <stop offset="0%" stopColor="#FFFFFF" />
//                                         <stop offset="100%" stopColor="#B0B9E8" />
//                                     </linearGradient>
//                                 </defs>
//                                 <QRCodeSVG
//                                     value={wallet.address}
//                                     size={256}
//                                     bgColor="transparent"
//                                     fgColor="url(#gradient)"
//                                     level="L"
//                                 />
//                             </svg>
//                         </div>
//                         <PrimaryButton
//                             label="Make deposit"
//                             variant="brand"
//                             size="lg"
//                             leadingIcon={<QRCodeIcon />}
//                             rounded
//                         />
//                     </div>
//                 )}
//             </div>
//         );
//     }, [memoizedTransformedAssets, wallet.name, wallet.address, handleViewAllAssets]);

//     const renderTransactionsContent = useCallback(() => {
//         const previewTransactions = memoizedTransformedTransactions.slice(0, PREVIEW_ITEMS_COUNT);

//         return (
//             <div>
//                 {memoizedTransformedTransactions.length > 0 ? (
//                     <div>
//                         <TransactionList
//                             transactions={previewTransactions}
//                             addresses={addresses}
//                             uniqueClassifications={uniqueClassifications}
//                         />
//                         {memoizedTransformedTransactions.length > PREVIEW_ITEMS_COUNT && (
//                             <div className="absolute bottom-0 flex w-full justify-center py-5 bg-gradient-to-t from-[#0E1011] to-transparent" onClick={handleViewAllTransactions}>
//                                 <PrimaryButton
//                                     leadingIcon={<ArrowLeftUpBoxFill />}
//                                     label={`${memoizedTransformedTransactions.length} transactions`}
//                                     variant="inverted"
//                                     size="md"

//                                 />
//                             </div>
//                         )}
//                     </div>
//                 ) : (
//                     <div className="text-center py-8 text-gray-500">
//                         No transactions found
//                     </div>
//                 )}
//             </div>
//         );
//     }, [memoizedTransformedTransactions, addresses, uniqueClassifications, handleViewAllTransactions]);

//     const renderPolicyContent = useCallback(() => (
//         <PolicyContent wallet={wallet} cryptocurrencies={cryptocurrencies} members={members} />
//     ), [wallet, cryptocurrencies, members]);

//     const renderTabContent = useCallback(() => {
//         const contentMap = {
//             proposals: renderProposalsContent,
//             assets: renderAssetsContent,
//             transactions: renderTransactionsContent,
//             policy: renderPolicyContent,
//         };
//         return contentMap[activeTab]();
//     }, [activeTab, renderProposalsContent, renderAssetsContent, renderTransactionsContent, renderPolicyContent]);

//     // Memoized UI components
//     const walletHeader = useMemo(() => (
//         <WalletHeader
//             wallet={wallet}
//             proposed={proposed}
//             available={available}
//             totalBalance={totalBalance}
//             wallets={wallets}
//             onWalletChange={onWalletChange}
//             onBackToWallets={handleBackToWallets}
//         />
//     ), [wallet, proposed, available, totalBalance, wallets, onWalletChange, handleBackToWallets]);

//     const navTabs = useMemo(() => (
//         <div className="flex items-start gap-8 self-stretch border-b-0.8 border-[#1F2122]">
//             {/* Only show Proposals tab if wallet type is not 3 */}
//             {wallet.type !== 3 && (
//                 <NavTab
//                     title="Proposals"
//                     subtitles={[
//                         {
//                             name: "Needs approval",
//                             count: needsApprovalCount,
//                             ...(needsApprovalCount > 0 && { color: "cyan" })
//                         },
//                         {
//                             name: "Ready to execute",
//                             count: readyToExecuteCount,
//                             ...(readyToExecuteCount > 0 && { color: "white" })
//                         },
//                         {
//                             name: "Discarded",
//                             count: navTabDiscardedCount,
//                             ...(navTabDiscardedCount > 0 && { color: "red" })
//                         }
//                     ]}
//                     isActive={activeTab === 'proposals'}
//                     activeSubtitle={activeProposalFilter ? getHumanReadableCategory(activeProposalFilter) : null}
//                     onClick={handleProposalsTabClick}
//                     onSubtitleClick={handleProposalFilterChange}
//                 />
//             )}

//             <NavTab
//                 title="Assets"
//                 titleCount={wallet.balance?.length ?? 0}
//                 subtitles={[]}
//                 isActive={activeTab === 'assets'}
//                 onClick={() => handleTabChange('assets')}
//             />

//             <NavTab
//                 title="Transactions"
//                 titleCount={wallet.transactions?.length ?? 0}
//                 subtitles={[]}
//                 isActive={activeTab === 'transactions'}
//                 onClick={() => handleTabChange('transactions')}
//             />

//             {/* Only show Policy tab if wallet type is not 3 */}
//             {wallet.type !== 3 && (
//                 <NavTab
//                     title="Policy"
//                     subtitles={[]}
//                     isActive={activeTab === 'policy'}
//                     onClick={() => handleTabChange('policy')}
//                 />
//             )}
//         </div>
//     ), [wallet.type, wallet.balance, wallet.transactions, activeTab, activeProposalFilter, needsApprovalCount, readyToExecuteCount, navTabDiscardedCount, handleProposalsTabClick, handleProposalFilterChange, handleTabChange]);

//     return (
//         <div className="flex w-full pt-[22px] pb-[80px] flex-col items-center gap-8 h-[100px]">
//             {walletHeader}

//             <div className="flex flex-col items-center self-stretch">
//                 {navTabs}

//                 <AnimatedContent
//                     animationDirection={animationDirection}
//                     activeTab={activeTab}
//                     activeProposalFilter={activeProposalFilter}
//                 >
//                     {renderTabContent()}
//                 </AnimatedContent>
//             </div>
//         </div>
//     );
// }


// import TertiaryButton from "@/app/components/buttons/TertiaryButton";
// import PrimaryButton from "@/app/components/buttons/PrimaryButton";
// import { VaultIcon, GnosisSafeIcon, TrackedWalletIcon, EthereumIcon, BSCIcon, PolygonIcon, GnosisIcon, OPTIMISMIcon, SOLIcon, QRCodeIcon, SendIcon, ArrowLeftUpBoxFill, EditIcon } from "@/app/components/icons";
// import Tooltip from "../../components/TooltipComponent";
// import { formatCents, formatDollars } from "@/app/components/helpers";
// import { Wallet, MPCVaultWallet, GnosisSafeWallet, TrackedWallet } from "../type";
// import { Transaction } from "../../transactions/view-all/types";
// import { Proposal, ProposalCategory, ProposalStatus } from "../../transactions/proposals/types";
// import NavTab from "@/app/components/buttons/NavTab";
// import React, { useState, useMemo, useEffect, useCallback, memo } from "react";
// import ProposalList from "@/app/transactions/proposals/ProposalList";
// import TransactionList from "@/app/transactions/view-all/TransactionList";
// import AssetList from "@/app/assets/AssetList";
// import { Asset, WalletInfo } from "@/app/assets/types"
// import { AddressCardProps } from "@/app/address-book/addresses/types";
// import { transformApiDataToProposals } from "@/app/transactions/proposals/transformProposals";
// import { QRCodeSVG } from 'qrcode.react';
// import TertiaryButtonWithDropdown from "@/app/components/buttons/TertiaryButtonWithDropdown";
// import { useRouter } from 'next/navigation';
// import { useRef } from "react";
// import { Cryptocurrency } from '@/app/assets/types';
// import PolicyContent from './components/PolicyContent';

// interface TransactionWithDateInfo extends Transaction {
//     showDate: boolean;
//     isFirstOfDate: boolean;
// }

// // --- Constants (Moved Outside Components) ---
// const TAB_ORDER = ['proposals', 'assets', 'transactions', 'policy'] as const;
// const PREVIEW_ITEMS_COUNT = 8;
// const WALLET_GROUPS = [
//     { key: '1', label: 'Vaults' },
//     { key: '2', label: 'Gnosis Safes' },
//     { key: '3', label: 'Tracked Wallets' }
// ];

// const getTabOrder = (walletType: number) => {
//     if (walletType === 3) {
//         return ['assets', 'transactions'] as const;
//     }
//     return ['proposals', 'assets', 'transactions', 'policy'] as const;
// };

// // --- Helper Functions (Moved Outside Components) ---
// const getHumanReadableCategory = (category: ProposalCategory): string => {
//     const nameMap: Record<ProposalCategory, string> = {
//         [ProposalCategory.NEEDS_APPROVAL]: "Needs approval",
//         [ProposalCategory.READY_TO_EXECUTE]: "Ready to execute",
//         [ProposalCategory.DISCARDED]: "Discarded",
//     };
//     return nameMap[category] || "Needs approval";
// };

// const getCategoryFromHumanReadable = (humanReadableName: string): ProposalCategory => {
//     const categoryMap: Record<string, ProposalCategory> = {
//         "Needs approval": ProposalCategory.NEEDS_APPROVAL,
//         "Ready to execute": ProposalCategory.READY_TO_EXECUTE,
//         "Discarded": ProposalCategory.DISCARDED,
//     };
//     return categoryMap[humanReadableName] || ProposalCategory.NEEDS_APPROVAL;
// };

// const capitalizeFirstLetter = (str: string): string => {
//     if (!str || str.length === 0) return str;
//     return str.charAt(0).toUpperCase() + str.slice(1);
// };

// // --- Icon Helper Functions (Moved Outside Components) ---

// const renderWalletIcon = (walletType: number) => {
//     const iconMap: Record<number, React.ReactElement> = {
//         1: <VaultIcon className="w-[24px] h-[24px] aspect-square" />,
//         2: <GnosisSafeIcon className="w-[24px] h-[24px] aspect-square" />,
//         3: <TrackedWalletIcon className="w-[24px] h-[24px] aspect-square" />,
//     };
//     return iconMap[walletType] || null;
// };

// type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

// const getBlockchainIcon = (blockchainName: string, size: IconSize = 'lg'): React.ReactElement | null => {
//     const sizeClasses: Record<IconSize, string> = {
//         'xs': 'w-3 h-3',
//         'sm': 'w-3.5 h-3.5',
//         'md': 'w-[15px] h-[15px]',
//         'lg': 'w-4 h-4',
//         'xl': 'w-5 h-5',
//         '2xl': 'w-6 h-6',
//         '3xl': 'w-7 h-7',
//         '4xl': 'w-8 h-8',
//     };

//     const iconSizeClass = sizeClasses[size];

//     const iconMap: Record<string, React.ReactElement> = {
//         "BSC": <BSCIcon className={`${iconSizeClass} shrink-0 inline-flex items-center`} />,
//         "Ethereum": <EthereumIcon className={`${iconSizeClass} shrink-0 inline-flex items-center`} />,
//         "Gnosis chain": <GnosisIcon className={`${iconSizeClass} shrink-0 inline-flex items-center`} />,
//         "Optimism": <OPTIMISMIcon className={`${iconSizeClass} shrink-0 inline-flex items-center`} />,
//         "Polygon": <PolygonIcon className={`${iconSizeClass} shrink-0 inline-flex items-center`} />,
//         "Solana": <SOLIcon className={`${iconSizeClass} shrink-0 inline-flex items-center`} />,
//     };

//     return iconMap[blockchainName] || null;
// };

// const getBlockchainIcons = (
//     blockchainData: string | Array<{ blockchain: string }> | undefined,
//     size: IconSize = 'lg'
// ): React.ReactElement | null => {
//     if (!blockchainData) {
//         return null;
//     }

//     if (typeof blockchainData === 'string') {
//         const icon = getBlockchainIcon(blockchainData, size);
//         return icon ? (
//             <Tooltip title={blockchainData} position="top">
//                 {icon}
//             </Tooltip>
//         ) : null;
//     } else if (Array.isArray(blockchainData)) {
//         return (
//             <>
//                 {blockchainData.map((item, index) => {
//                     const icon = getBlockchainIcon(item.blockchain, size);
//                     return icon ? (
//                         <Tooltip key={index} title={item.blockchain} position="top">
//                             {icon}
//                         </Tooltip>
//                     ) : null;
//                 })}
//             </>
//         );
//     }
//     return null;
// };

// // Custom hook for animation logic
// const useTabAnimation = () => {
//     const [animationDirection, setAnimationDirection] = useState<'left' | 'right' | null>(null);

//     const calculateDirection = useCallback((currentIndex: number, newIndex: number) => {
//         return newIndex > currentIndex ? 'right' : 'left';
//     }, []);

//     const resetAnimation = useCallback(() => {
//         setAnimationDirection(null);
//     }, []);

//     return {
//         animationDirection,
//         setAnimationDirection: calculateDirection,
//         resetAnimation,
//     };
// };

// // OPTIMIZATION: Memoized BalanceDisplay component
// const BalanceDisplay = memo(({ label, value }: { label: string; value: number }) => (
//     <div className="flex flex-col justify-center items-start gap-[7px]">
//         <span className="text-[#F8FCFF] font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px] opacity-80">
//             {label}
//         </span>
//         <div className="flex items-baseline">
//             <span className="text-[#F8FCFF] font-[Geist] text-[22px] not-italic font-normal leading-[normal] tracking-[0.88px]">
//                 $ {formatDollars(value)}
//             </span>
//             <span className="text-[#F8FCFF] font-[Geist] text-[22px] not-italic font-normal leading-[normal] tracking-[0.88px] opacity-80">
//                 .{formatCents(value)}
//             </span>
//         </div>
//     </div>
// ));

// // OPTIMIZATION: Memoized WalletHeader component
// const WalletHeader = memo(({
//     wallet,
//     proposed,
//     available,
//     totalBalance,
//     wallets = [],
//     onWalletChange,
//     onBackToWallets
// }: {
//     wallet: Wallet;
//     proposed: number;
//     available: number;
//     totalBalance: number;
//     wallets?: Wallet[];
//     onWalletChange?: (walletId: number) => void;
//     onBackToWallets?: () => void;
// }) => {
//     const [copiedAddress, setCopiedAddress] = useState(false);
//     const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
//     const displayName = useMemo(() => capitalizeFirstLetter(wallet.name), [wallet.name]);

//     const dropdownOptions = useMemo(() =>
//         wallets
//             .filter(w => w.id !== wallet.id)
//             .map(w => ({
//                 value: w.id.toString(),
//                 label: capitalizeFirstLetter(w.name),
//                 groupKey: w.type.toString()
//             })),
//         [wallets, wallet.id]
//     );

//     const handleWalletChange = useCallback((walletId: string) => {
//         onWalletChange?.(parseInt(walletId));
//     }, [onWalletChange]);

//     const handleCopyAddress = useCallback(async () => {
//         if (copyTimeoutRef.current) {
//             clearTimeout(copyTimeoutRef.current);
//         }

//         try {
//             if (navigator.clipboard && window.isSecureContext) {
//                 await navigator.clipboard.writeText(wallet.address);
//             } else {
//                 const textArea = document.createElement('textarea');
//                 textArea.value = wallet.address;
//                 textArea.style.position = 'fixed';
//                 textArea.style.opacity = '0';
//                 document.body.appendChild(textArea);
//                 textArea.select();
//                 document.execCommand('copy');
//                 document.body.removeChild(textArea);
//             }

//             setCopiedAddress(true);
//             copyTimeoutRef.current = setTimeout(() => {
//                 setCopiedAddress(false);
//             }, 5000);

//         } catch (err) {
//             console.error('Failed to copy address:', err);
//         }
//     }, [wallet.address]);

//     useEffect(() => {
//         return () => {
//             if (copyTimeoutRef.current) {
//                 clearTimeout(copyTimeoutRef.current);
//             }
//         };
//     }, []);

//     return (
//         <div className="flex flex-col items-start gap-16 self-stretch">
//             <div className="flex flex-col items-start gap-3 self-stretch">
//                 <div className="flex items-center gap-2.5 self-stretch">
//                     <TertiaryButton label="Wallets" size="sm" status="neutral" onClick={onBackToWallets} />
//                     <span className="text-[12px] font-medium truncate font-[Geist] not-italic leading-[normal] tracking-[0.48px]">/</span>

//                     <TertiaryButtonWithDropdown
//                         label={displayName}
//                         dropdownOptions={dropdownOptions}
//                         dropdownValue={wallet.id.toString()}
//                         onDropdownChange={handleWalletChange}
//                         groups={WALLET_GROUPS}
//                         status="neutral"
//                         size="sm"
//                         dropdownPlaceholder={displayName}
//                     />
//                 </div>
//                 <div className="flex justify-between items-start self-stretch">
//                     <div className="flex flex-col items-start gap-[5px]">
//                         <div className="flex items-center gap-3">
//                             {renderWalletIcon(wallet.type)}
//                             <h1 className="text-[#F8FCFF] font-[Figtree] text-[26px] not-italic font-medium leading-[normal] tracking-[1.04px]">
//                                 {displayName}
//                             </h1>
//                         </div>
//                         <div className="flex items-center gap-[5px]">
//                             <div className="inline-flex items-center -space-x-[4px]">
//                                 {getBlockchainIcons(wallet.blockchain)}
//                             </div>
//                             <TertiaryButton label={wallet.address} status={copiedAddress ? "brand" : "neutral"} tooltipTitle={copiedAddress ? "Address copied" : "Copy address"}
//                                 onClick={handleCopyAddress}
//                             />
//                         </div>
//                     </div>
//                     <div className="flex items-center gap-3.5">
//                         <PrimaryButton
//                             label="Make deposit"
//                             variant={totalBalance === 0 ? "brand" : "neutral"}
//                             size="md"
//                             leadingIcon={<QRCodeIcon />}
//                         />
//                         {totalBalance > 0 && (
//                             <PrimaryButton label="Send tokens" variant="neutral" size="md" leadingIcon={<SendIcon />} />
//                         )}
//                     </div>
//                 </div>
//             </div>
//             <div className="flex w-full items-center gap-9">
//                 <BalanceDisplay label="Proposed" value={proposed} />
//                 <BalanceDisplay label="Available" value={available} />
//                 <BalanceDisplay label="Total" value={totalBalance} />
//             </div>
//         </div>
//     );
// });

// // AnimatedContent component
// const AnimatedContent = ({
//     animationDirection,
//     activeTab,
//     activeProposalFilter,
//     children
// }: {
//     animationDirection: 'left' | 'right' | null;
//     activeTab: string;
//     activeProposalFilter: ProposalCategory | null;
//     children: React.ReactNode;
// }) => {
//     const getTransformClass = () => {
//         switch (animationDirection) {
//             case 'left': return 'translate-x-full';
//             case 'right': return '-translate-x-full';
//             default: return 'translate-x-0';
//         }
//     };

//     return (
//         <div className="relative w-full overflow-visible">
//             <div
//                 className={`transition-transform duration-300 ease-in-out ${getTransformClass()}`}
//                 key={`${activeTab}-${activeProposalFilter}`}
//             >
//                 {children}
//             </div>
//         </div>
//     );
// };

// // Props for WalletDetails component
// interface WalletDetailsProps {
//     wallet: Wallet;
//     addresses: AddressCardProps[];
//     wallets?: Wallet[];
//     cryptocurrencies?: Cryptocurrency[];
//     members?: any[];
//     onWalletChange?: (walletId: number) => void;
//     activeTab?: string;
//     activeProposalFilter?: ProposalCategory | null;
//     onTabStateChange?: (activeTab: string, activeProposalFilter: ProposalCategory | null) => void;
// }

// export default function WalletDetails({
//     wallet,
//     addresses = [],
//     wallets = [],
//     cryptocurrencies = [],
//     members = [],
//     onWalletChange,
//     activeTab: externalActiveTab,
//     activeProposalFilter: externalActiveProposalFilter,
//     onTabStateChange
// }: WalletDetailsProps) {
//     const router = useRouter();

//     const tabOrder = useMemo(() => getTabOrder(wallet.type), [wallet.type]);
//     type TabType = typeof tabOrder[number];

//     const [internalActiveTab, setInternalActiveTab] = useState<TabType>(tabOrder[0]);
//     const [internalActiveProposalFilter, setInternalActiveProposalFilter] = useState<ProposalCategory | null>(null);

//     const activeTab = externalActiveTab !== undefined ? externalActiveTab as TabType : internalActiveTab;
//     const activeProposalFilter = externalActiveProposalFilter !== undefined ? externalActiveProposalFilter : internalActiveProposalFilter;

//     const [hasAutoSwitched, setHasAutoSwitched] = useState(false);
//     const [isInitialLoad, setIsInitialLoad] = useState(true);

//     const { animationDirection, setAnimationDirection, resetAnimation } = useTabAnimation();

//     // All useMemo hooks for calculations - MOVED UP
//     const transformedProposals = useMemo(() => {
//         if (!wallet.proposals) return [];
//         const proposalsWithCalculations = wallet.proposals.map(proposal => {
//             const outgoingUSD = proposal.outTokens && proposal.outUSDPrice
//                 ? proposal.outTokens * proposal.outUSDPrice
//                 : 0;
//             return { ...proposal, outgoingUSD };
//         });
//         return transformApiDataToProposals(proposalsWithCalculations);
//     }, [wallet.proposals]);

//     const uniqueClassifications = useMemo(() => {
//         return Array.from(
//             new Set(transformedProposals.map((proposal: Proposal) => proposal.classification).filter(Boolean))
//         ) as string[];
//     }, [transformedProposals]);

//     const { totalBalance, proposed, available } = useMemo(() => {
//         const total = wallet.balance.reduce((sum, asset) => sum + (asset.tokens * asset.price), 0);
//         const proposedAmount = transformedProposals
//             .filter(proposal =>
//                 [ProposalStatus.ACTION_REQUIRED, ProposalStatus.NO_ACTION, ProposalStatus.ACTIONED,
//                 ProposalStatus.READY, ProposalStatus.EXECUTING, ProposalStatus.AWAITING_NONCE].includes(proposal.status)
//             )
//             .reduce((sum: number, proposal: Proposal) =>
//                 sum + (proposal.outTokens * (proposal.outUSDPrice || 0)), 0);
//         return { totalBalance: total, proposed: proposedAmount, available: total - proposedAmount };
//     }, [wallet.balance, transformedProposals]);

//     const proposalCounts = useMemo(() => {
//         const counts = {
//             [ProposalCategory.NEEDS_APPROVAL]: transformedProposals.filter(p =>
//                 p.status === ProposalStatus.ACTION_REQUIRED
//             ).length,
//             [ProposalCategory.READY_TO_EXECUTE]: transformedProposals.filter(p =>
//                 p.status === ProposalStatus.FAILED ||
//                 p.status === ProposalStatus.READY
//             ).length,
//             [ProposalCategory.DISCARDED]: transformedProposals.filter(p =>
//                 p.category === ProposalCategory.DISCARDED
//             ).length,
//             totalProposals: transformedProposals.length,
//         };
//         const navTabDiscardedCount = transformedProposals.filter(p =>
//             p.status === ProposalStatus.FAILED_REJECTED
//         ).length;

//         return {
//             needsApprovalCount: counts[ProposalCategory.NEEDS_APPROVAL],
//             readyToExecuteCount: counts[ProposalCategory.READY_TO_EXECUTE],
//             discardedCount: counts[ProposalCategory.DISCARDED],
//             navTabDiscardedCount: navTabDiscardedCount,
//             totalProposals: counts.totalProposals,
//             categoryCounts: counts
//         };
//     }, [transformedProposals]);

//     const { needsApprovalCount, readyToExecuteCount, discardedCount, navTabDiscardedCount, totalProposals, categoryCounts } = proposalCounts;

//     // FIX: Calculate highest count subtitle as a function - MOVED UP
//     const calculateHighestCountSubtitle = useCallback((): ProposalCategory => {
//         const counts = categoryCounts;
//         let highestCategory: ProposalCategory = ProposalCategory.NEEDS_APPROVAL;
//         let highestCount = -1;
//         const mainCategories = [ProposalCategory.NEEDS_APPROVAL, ProposalCategory.READY_TO_EXECUTE, ProposalCategory.DISCARDED];
//         mainCategories.forEach((category: ProposalCategory) => {
//             if (counts[category] > highestCount) {
//                 highestCount = counts[category];
//                 highestCategory = category;
//             }
//         });
//         return highestCategory;
//     }, [categoryCounts]);

//     const shouldShowAssetsTab = useMemo(() => {
//         return totalBalance === 0 &&
//             needsApprovalCount === 0 &&
//             readyToExecuteCount === 0 &&
//             discardedCount === 0;
//     }, [totalBalance, needsApprovalCount, readyToExecuteCount, discardedCount]);

//     // FIX: Calculate the appropriate default tab for this wallet - MOVED AFTER DEPENDENCIES
//     const getDefaultTabForWallet = useCallback((): { tab: TabType; proposalFilter: ProposalCategory | null } => {
//         const tabOrder = getTabOrder(wallet.type);

//         // If this is a tracked wallet, default to assets
//         if (wallet.type === 3) {
//             return { tab: 'assets' as TabType, proposalFilter: null };
//         }

//         // For other wallets, check if we should auto-switch to assets
//         const shouldAutoSwitch = totalBalance === 0 &&
//             needsApprovalCount === 0 &&
//             readyToExecuteCount === 0 &&
//             discardedCount === 0;

//         if (shouldAutoSwitch) {
//             return { tab: 'assets' as TabType, proposalFilter: null };
//         }

//         // Otherwise, default to proposals with the highest count subtab
//         const highestSubtitle = calculateHighestCountSubtitle();
//         return { tab: 'proposals' as TabType, proposalFilter: highestSubtitle };
//     }, [wallet.type, totalBalance, needsApprovalCount, readyToExecuteCount, discardedCount, calculateHighestCountSubtitle]);

//     // FIX: Direct tab change handlers that work with parent-controlled state
//     const handleTabChange = useCallback((newTab: TabType) => {
//         const currentIndex = TAB_ORDER.indexOf(activeTab);
//         const newIndex = TAB_ORDER.indexOf(newTab);
//         setAnimationDirection(currentIndex, newIndex);

//         if (onTabStateChange) {
//             // Parent controls state - notify parent of change
//             onTabStateChange(newTab, newTab !== 'proposals' ? null : activeProposalFilter);
//         } else {
//             // Internal state - update directly
//             setInternalActiveTab(newTab);
//             if (newTab !== 'proposals') {
//                 setInternalActiveProposalFilter(null);
//             }
//         }
//     }, [activeTab, activeProposalFilter, setAnimationDirection, onTabStateChange]);

//     const handleProposalFilterChange = useCallback((subtitleName: string) => {
//         const category = getCategoryFromHumanReadable(subtitleName);

//         // Animation logic
//         if (activeProposalFilter) {
//             const currentIndex = [ProposalCategory.NEEDS_APPROVAL, ProposalCategory.READY_TO_EXECUTE, ProposalCategory.DISCARDED].indexOf(activeProposalFilter);
//             const newIndex = [ProposalCategory.NEEDS_APPROVAL, ProposalCategory.READY_TO_EXECUTE, ProposalCategory.DISCARDED].indexOf(category);
//             setAnimationDirection(currentIndex, newIndex);
//         } else {
//             setAnimationDirection(0, [ProposalCategory.NEEDS_APPROVAL, ProposalCategory.READY_TO_EXECUTE, ProposalCategory.DISCARDED].indexOf(category));
//         }

//         if (onTabStateChange) {
//             // Parent controls state - notify parent of change
//             onTabStateChange('proposals', category);
//         } else {
//             // Internal state - update directly
//             setInternalActiveProposalFilter(category);
//             setInternalActiveTab('proposals');
//         }
//     }, [activeProposalFilter, setAnimationDirection, onTabStateChange]);

//     const handleProposalsTabClick = useCallback(() => {
//         const currentIndex = TAB_ORDER.indexOf(activeTab);
//         const newIndex = TAB_ORDER.indexOf('proposals');
//         setAnimationDirection(currentIndex, newIndex);

//         const highestCountSubtitle = calculateHighestCountSubtitle();

//         if (onTabStateChange) {
//             // Parent controls state - notify parent of change
//             onTabStateChange('proposals', highestCountSubtitle);
//         } else {
//             // Internal state - update directly
//             setInternalActiveTab('proposals');
//             setInternalActiveProposalFilter(highestCountSubtitle);
//         }
//     }, [activeTab, setAnimationDirection, onTabStateChange, calculateHighestCountSubtitle]);

//     const handleBackToWallets = useCallback(() => {
//         router.push('/wallets');
//     }, [router]);

//     // FIX: Validate and correct tab state when wallet changes
//     useEffect(() => {
//         if (!isInitialLoad) {
//             // Reset auto-switch flag when wallet changes
//             setHasAutoSwitched(false);

//             const currentTabOrder = getTabOrder(wallet.type);
//             const defaultTabState = getDefaultTabForWallet();

//             // Check if current tab is valid for this wallet type
//             const isCurrentTabValid = currentTabOrder.includes(activeTab as any);

//             if (!isCurrentTabValid) {
//                 // Current tab is not valid for this wallet type, switch to default
//                 if (onTabStateChange) {
//                     onTabStateChange(defaultTabState.tab, defaultTabState.proposalFilter);
//                 } else {
//                     setInternalActiveTab(defaultTabState.tab);
//                     setInternalActiveProposalFilter(defaultTabState.proposalFilter);
//                 }
//             } else if (shouldShowAssetsTab && !hasAutoSwitched && activeTab === 'proposals') {
//                 // Auto-switch to assets if needed
//                 if (onTabStateChange) {
//                     onTabStateChange('assets', null);
//                 } else {
//                     setInternalActiveTab('assets');
//                 }
//                 setHasAutoSwitched(true);
//             }
//         } else {
//             setIsInitialLoad(false);
//         }
//     }, [wallet.id, wallet.type, activeTab, shouldShowAssetsTab, hasAutoSwitched, onTabStateChange, getDefaultTabForWallet, isInitialLoad]);

//     const handleViewAllProposals = useCallback(() => {
//         const tabMapping = {
//             [ProposalCategory.NEEDS_APPROVAL]: 'needs-approval',
//             [ProposalCategory.READY_TO_EXECUTE]: 'ready-to-execute',
//             [ProposalCategory.DISCARDED]: 'discarded'
//         };

//         const activeTabParam = activeProposalFilter ? tabMapping[activeProposalFilter] : 'needs-approval';
//         router.push(`/transactions/proposals?wallet=${wallet.name}&tab=${activeTabParam}`);
//     }, [router, wallet.name, activeProposalFilter]);

//     const handleViewAllAssets = useCallback(() => {
//         router.push(`/assets?wallet=${wallet.name}`);
//     }, [router, wallet.name]);

//     const handleViewAllTransactions = useCallback(() => {
//         router.push(`/transactions/view-all?wallet=${wallet.name}`);
//     }, [router, wallet.name]);

//     const getCurrentProposalLabel = useCallback(() => {
//         if (!activeProposalFilter) return 'proposals';

//         switch (activeProposalFilter) {
//             case ProposalCategory.NEEDS_APPROVAL:
//                 return 'needs approval';
//             case ProposalCategory.READY_TO_EXECUTE:
//                 return 'ready to execute';
//             case ProposalCategory.DISCARDED:
//                 return 'discarded';
//             default:
//                 return 'proposals';
//         }
//     }, [activeProposalFilter]);

//     useEffect(() => {
//         if (animationDirection) {
//             const timer = setTimeout(resetAnimation, 300);
//             return () => clearTimeout(timer);
//         }
//     }, [animationDirection, resetAnimation]);

//     const memoizedTransformedAssets = useMemo(() => {
//         const blockchainInfo = Array.isArray(wallet.blockchain)
//             ? wallet.blockchain
//             : [{ blockchain: wallet.blockchain }];

//         const safeTotalBalance = totalBalance === 0 ? 1 : totalBalance;

//         return wallet.balance.map(balance => {
//             const walletInfo: WalletInfo = {
//                 walletId: wallet.id,
//                 walletType: wallet.type,
//                 name: wallet.name,
//                 balance: balance.tokens,
//                 assetId: balance.assetId,
//                 percentageShare: (balance.USD / safeTotalBalance) * 100
//             };
//             return {
//                 uniqueId: balance.uniqueId,
//                 assetId: balance.assetId,
//                 blockchain: blockchainInfo,
//                 countOfWallets: 1,
//                 totalTokens: balance.tokens,
//                 expanded: false,
//                 wallets: [walletInfo],
//                 percentageShareInUSD: (balance.USD / safeTotalBalance) * 100,
//                 percent_change_24h: wallet.percent_change_24h || 0,
//                 price: balance.price,
//                 symbol: balance.symbol,
//                 name: balance.name,
//                 fullName: balance.fullName,
//                 USD: balance.USD
//             };
//         });
//     }, [wallet.balance, wallet.blockchain, wallet.id, wallet.type, wallet.name, wallet.percent_change_24h, totalBalance]);

//     const memoizedTransformedTransactions = useMemo((): TransactionWithDateInfo[] => {
//         return (wallet.transactions || []).map((transaction, index, array) => {
//             const currentDate = new Date(transaction.timestamp).toDateString();
//             const prevDate = index > 0 ? new Date(array[index - 1].timestamp).toDateString() : null;
//             const isFirstOfDate = currentDate !== prevDate;
//             return {
//                 ...transaction,
//                 showDate: isFirstOfDate,
//                 isFirstOfDate
//             };
//         });
//     }, [wallet.transactions]);

//     const renderProposalsContent = useCallback(() => {
//         const filteredProposals = transformedProposals.filter(proposal =>
//             !activeProposalFilter || proposal.category === activeProposalFilter
//         );
//         const previewProposals = filteredProposals.slice(0, PREVIEW_ITEMS_COUNT);

//         if (filteredProposals.length === 0) {
//             return (
//                 <div className="text-center py-8 text-gray-500">
//                     No proposals found
//                 </div>
//             );
//         }
//         return (
//             <div className="relative">
//                 <ProposalList
//                     proposals={previewProposals}
//                     addresses={addresses}
//                     uniqueClassifications={uniqueClassifications}
//                 />
//                 {filteredProposals.length > PREVIEW_ITEMS_COUNT && (
//                     <div className="absolute bottom-0 flex w-full justify-center py-5 bg-gradient-to-t from-[#0E1011] to-transparent" onClick={handleViewAllProposals}>
//                         <PrimaryButton
//                             leadingIcon={<ArrowLeftUpBoxFill />}
//                             label={`${filteredProposals.length} ${getCurrentProposalLabel()}`}
//                             variant="inverted"
//                             size="md"
//                         />
//                     </div>
//                 )}
//             </div>
//         );
//     }, [transformedProposals, activeProposalFilter, addresses, uniqueClassifications, handleViewAllProposals, getCurrentProposalLabel]);

//     const renderAssetsContent = useCallback(() => {
//         const previewAssets = memoizedTransformedAssets.slice(0, PREVIEW_ITEMS_COUNT);
//         const displayWalletName = capitalizeFirstLetter(wallet.name);

//         return (
//             <div>
//                 {previewAssets.length > 0 ? (
//                     <div>
//                         <AssetList assets={previewAssets} />
//                         {memoizedTransformedAssets.length > PREVIEW_ITEMS_COUNT && (
//                             <div className="absolute bottom-0 flex w-full justify-center py-5 bg-gradient-to-t from-[#0E1011] to-transparent" onClick={handleViewAllAssets}>
//                                 <PrimaryButton
//                                     leadingIcon={<ArrowLeftUpBoxFill />}
//                                     label={`${memoizedTransformedAssets.length} assets`}
//                                     variant="inverted"
//                                     size="md"
//                                 />
//                             </div>
//                         )}
//                     </div>
//                 ) : (
//                     <div className="flex flex-col items-center">
//                         <div className="flex flex-col py-10 items-center gap-4">
//                             <div className="flex flex-col gap-1 items-center">
//                                 <span className="text-[#F8FCFF] font-[Figtree] text-[26px] not-italic font-medium leading-[normal] tracking-[1.04px]">{displayWalletName} has no assets</span>
//                                 <span className="text-[#EDEEEE] font-[Geist] text-sm not-italic font-normal leading-[normal] tracking-[0.56px]">Make deposit to start using wallet</span>
//                             </div>
//                             <svg width={256} height={256}>
//                                 <defs>
//                                     <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
//                                         <stop offset="0%" stopColor="#FFFFFF" />
//                                         <stop offset="100%" stopColor="#B0B9E8" />
//                                     </linearGradient>
//                                 </defs>
//                                 <QRCodeSVG
//                                     value={wallet.address}
//                                     size={256}
//                                     bgColor="transparent"
//                                     fgColor="url(#gradient)"
//                                     level="L"
//                                 />
//                             </svg>
//                         </div>
//                         <PrimaryButton
//                             label="Make deposit"
//                             variant="brand"
//                             size="lg"
//                             leadingIcon={<QRCodeIcon />}
//                             rounded
//                         />
//                     </div>
//                 )}
//             </div>
//         );
//     }, [memoizedTransformedAssets, wallet.name, wallet.address, handleViewAllAssets]);

//     const renderTransactionsContent = useCallback(() => {
//         const previewTransactions = memoizedTransformedTransactions.slice(0, PREVIEW_ITEMS_COUNT);

//         return (
//             <div>
//                 {memoizedTransformedTransactions.length > 0 ? (
//                     <div>
//                         <TransactionList
//                             transactions={previewTransactions}
//                             addresses={addresses}
//                             uniqueClassifications={uniqueClassifications}
//                         />
//                         {memoizedTransformedTransactions.length > PREVIEW_ITEMS_COUNT && (
//                             <div className="absolute bottom-0 flex w-full justify-center py-5 bg-gradient-to-t from-[#0E1011] to-transparent" onClick={handleViewAllTransactions}>
//                                 <PrimaryButton
//                                     leadingIcon={<ArrowLeftUpBoxFill />}
//                                     label={`${memoizedTransformedTransactions.length} transactions`}
//                                     variant="inverted"
//                                     size="md"
//                                 />
//                             </div>
//                         )}
//                     </div>
//                 ) : (
//                     <div className="text-center py-8 text-gray-500">
//                         No transactions found
//                     </div>
//                 )}
//             </div>
//         );
//     }, [memoizedTransformedTransactions, addresses, uniqueClassifications, handleViewAllTransactions]);

//     const renderPolicyContent = useCallback(() => (
//         <PolicyContent wallet={wallet} cryptocurrencies={cryptocurrencies} members={members} />
//     ), [wallet, cryptocurrencies, members]);

//     const renderTabContent = useCallback(() => {
//         const contentMap = {
//             proposals: renderProposalsContent,
//             assets: renderAssetsContent,
//             transactions: renderTransactionsContent,
//             policy: renderPolicyContent,
//         };
//         return contentMap[activeTab]();
//     }, [activeTab, renderProposalsContent, renderAssetsContent, renderTransactionsContent, renderPolicyContent]);

//     const walletHeader = useMemo(() => (
//         <WalletHeader
//             wallet={wallet}
//             proposed={proposed}
//             available={available}
//             totalBalance={totalBalance}
//             wallets={wallets}
//             onWalletChange={onWalletChange}
//             onBackToWallets={handleBackToWallets}
//         />
//     ), [wallet, proposed, available, totalBalance, wallets, onWalletChange, handleBackToWallets]);

//     const navTabs = useMemo(() => (
//         <div className="flex items-start gap-8 self-stretch border-b-0.8 border-[#1F2122]">
//             {wallet.type !== 3 && (
//                 <NavTab
//                     title="Proposals"
//                     subtitles={[
//                         {
//                             name: "Needs approval",
//                             count: needsApprovalCount,
//                             ...(needsApprovalCount > 0 && { color: "cyan" })
//                         },
//                         {
//                             name: "Ready to execute",
//                             count: readyToExecuteCount,
//                             ...(readyToExecuteCount > 0 && { color: "white" })
//                         },
//                         {
//                             name: "Discarded",
//                             count: navTabDiscardedCount,
//                             ...(navTabDiscardedCount > 0 && { color: "red" })
//                         }
//                     ]}
//                     isActive={activeTab === 'proposals'}
//                     activeSubtitle={activeProposalFilter ? getHumanReadableCategory(activeProposalFilter) : null}
//                     onClick={handleProposalsTabClick}
//                     onSubtitleClick={handleProposalFilterChange}
//                 />
//             )}

//             <NavTab
//                 title="Assets"
//                 titleCount={wallet.balance?.length ?? 0}
//                 subtitles={[]}
//                 isActive={activeTab === 'assets'}
//                 onClick={() => handleTabChange('assets')}
//             />

//             <NavTab
//                 title="Transactions"
//                 titleCount={wallet.transactions?.length ?? 0}
//                 subtitles={[]}
//                 isActive={activeTab === 'transactions'}
//                 onClick={() => handleTabChange('transactions')}
//             />

//             {wallet.type !== 3 && (
//                 <NavTab
//                     title="Policy"
//                     subtitles={[]}
//                     isActive={activeTab === 'policy'}
//                     onClick={() => handleTabChange('policy')}
//                 />
//             )}
//         </div>
//     ), [wallet.type, wallet.balance, wallet.transactions, activeTab, activeProposalFilter, needsApprovalCount, readyToExecuteCount, navTabDiscardedCount, handleProposalsTabClick, handleProposalFilterChange, handleTabChange]);

//     return (
//         <div className="flex w-full pt-[22px] pb-[80px] flex-col items-center gap-8 h-[100px]">
//             {walletHeader}

//             <div className="flex flex-col items-center self-stretch">
//                 {navTabs}

//                 <AnimatedContent
//                     animationDirection={animationDirection}
//                     activeTab={activeTab}
//                     activeProposalFilter={activeProposalFilter}
//                 >
//                     {renderTabContent()}
//                 </AnimatedContent>
//             </div>
//         </div>
//     );
// }


import TertiaryButton from "@/app/components/buttons/TertiaryButton";
import PrimaryButton from "@/app/components/buttons/PrimaryButton";
import { VaultIcon, GnosisSafeIcon, TrackedWalletIcon, EthereumIcon, BSCIcon, PolygonIcon, GnosisIcon, OPTIMISMIcon, SOLIcon, QRCodeIcon, SendIcon, ArrowLeftUpBoxFill, EditIcon } from "@/app/components/icons";
import Tooltip from "../../components/TooltipComponent";
import { formatCents, formatDollars } from "@/app/components/helpers";
import { Wallet, MPCVaultWallet, GnosisSafeWallet, TrackedWallet } from "../type";
import { Transaction } from "../../transactions/view-all/types";
import { Proposal, ProposalCategory, ProposalStatus } from "../../transactions/proposals/types";
import NavTab from "@/app/components/buttons/NavTab";
import React, { useState, useMemo, useEffect, useCallback, memo } from "react";
import ProposalList from "@/app/transactions/proposals/ProposalList";
import TransactionList from "@/app/transactions/view-all/TransactionList";
import AssetList from "@/app/assets/AssetList";
import { Asset, WalletInfo } from "@/app/assets/types"
import { AddressCardProps } from "@/app/address-book/addresses/types";
import { transformApiDataToProposals } from "@/app/transactions/proposals/transformProposals";
import { QRCodeSVG } from 'qrcode.react';
import TertiaryButtonWithDropdown from "@/app/components/buttons/TertiaryButtonWithDropdown";
import { useRouter } from 'next/navigation';
import { useRef } from "react";
import { Cryptocurrency } from '@/app/assets/types';
import PolicyContent from './components/PolicyContent';

interface TransactionWithDateInfo extends Transaction {
    showDate: boolean;
    isFirstOfDate: boolean;
}

// --- Constants (Moved Outside Components) ---
const TAB_ORDER = ['proposals', 'assets', 'transactions', 'policy'] as const;
const PREVIEW_ITEMS_COUNT = 8;
const WALLET_GROUPS = [
    { key: '1', label: 'Vaults' },
    { key: '2', label: 'Gnosis Safes' },
    { key: '3', label: 'Tracked Wallets' }
];

const getTabOrder = (walletType: number) => {
    if (walletType === 3) {
        return ['assets', 'transactions'] as const;
    }
    return ['proposals', 'assets', 'transactions', 'policy'] as const;
};

// --- Helper Functions (Moved Outside Components) ---
const getHumanReadableCategory = (category: ProposalCategory): string => {
    const nameMap: Record<ProposalCategory, string> = {
        [ProposalCategory.NEEDS_APPROVAL]: "Needs approval",
        [ProposalCategory.READY_TO_EXECUTE]: "Ready to execute",
        [ProposalCategory.DISCARDED]: "Discarded",
    };
    return nameMap[category] || "Needs approval";
};

const getCategoryFromHumanReadable = (humanReadableName: string): ProposalCategory => {
    const categoryMap: Record<string, ProposalCategory> = {
        "Needs approval": ProposalCategory.NEEDS_APPROVAL,
        "Ready to execute": ProposalCategory.READY_TO_EXECUTE,
        "Discarded": ProposalCategory.DISCARDED,
    };
    return categoryMap[humanReadableName] || ProposalCategory.NEEDS_APPROVAL;
};

const capitalizeFirstLetter = (str: string): string => {
    if (!str || str.length === 0) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
};

// --- Icon Helper Functions (Moved Outside Components) ---

const renderWalletIcon = (walletType: number) => {
    const iconMap: Record<number, React.ReactElement> = {
        1: <VaultIcon className="w-[24px] h-[24px] aspect-square" />,
        2: <GnosisSafeIcon className="w-[24px] h-[24px] aspect-square" />,
        3: <TrackedWalletIcon className="w-[24px] h-[24px] aspect-square" />,
    };
    return iconMap[walletType] || null;
};

type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

const getBlockchainIcon = (blockchainName: string, size: IconSize = 'lg'): React.ReactElement | null => {
    const sizeClasses: Record<IconSize, string> = {
        'xs': 'w-3 h-3',
        'sm': 'w-3.5 h-3.5',
        'md': 'w-[15px] h-[15px]',
        'lg': 'w-4 h-4',
        'xl': 'w-5 h-5',
        '2xl': 'w-6 h-6',
        '3xl': 'w-7 h-7',
        '4xl': 'w-8 h-8',
    };

    const iconSizeClass = sizeClasses[size];

    const iconMap: Record<string, React.ReactElement> = {
        "BSC": <BSCIcon className={`${iconSizeClass} shrink-0 inline-flex items-center`} />,
        "Ethereum": <EthereumIcon className={`${iconSizeClass} shrink-0 inline-flex items-center`} />,
        "Gnosis chain": <GnosisIcon className={`${iconSizeClass} shrink-0 inline-flex items-center`} />,
        "Optimism": <OPTIMISMIcon className={`${iconSizeClass} shrink-0 inline-flex items-center`} />,
        "Polygon": <PolygonIcon className={`${iconSizeClass} shrink-0 inline-flex items-center`} />,
        "Solana": <SOLIcon className={`${iconSizeClass} shrink-0 inline-flex items-center`} />,
    };

    return iconMap[blockchainName] || null;
};

const getBlockchainIcons = (
    blockchainData: string | Array<{ blockchain: string }> | undefined,
    size: IconSize = 'lg'
): React.ReactElement | null => {
    if (!blockchainData) {
        return null;
    }

    if (typeof blockchainData === 'string') {
        const icon = getBlockchainIcon(blockchainData, size);
        return icon ? (
            <Tooltip title={blockchainData} position="top">
                {icon}
            </Tooltip>
        ) : null;
    } else if (Array.isArray(blockchainData)) {
        return (
            <>
                {blockchainData.map((item, index) => {
                    const icon = getBlockchainIcon(item.blockchain, size);
                    return icon ? (
                        <Tooltip key={index} title={item.blockchain} position="top">
                            {icon}
                        </Tooltip>
                    ) : null;
                })}
            </>
        );
    }
    return null;
};

// Custom hook for animation logic
const useTabAnimation = () => {
    const [animationDirection, setAnimationDirection] = useState<'left' | 'right' | null>(null);

    const calculateDirection = useCallback((currentIndex: number, newIndex: number) => {
        return newIndex > currentIndex ? 'right' : 'left';
    }, []);

    const resetAnimation = useCallback(() => {
        setAnimationDirection(null);
    }, []);

    return {
        animationDirection,
        setAnimationDirection: calculateDirection,
        resetAnimation,
    };
};

// OPTIMIZATION: Memoized BalanceDisplay component
const BalanceDisplay = memo(({ label, value }: { label: string; value: number }) => (
    <div className="flex flex-col justify-center items-start gap-[7px]">
        <span className="text-[#F8FCFF] font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px] opacity-80">
            {label}
        </span>
        <div className="flex items-baseline">
            <span className="text-[#F8FCFF] font-[Geist] text-[22px] not-italic font-normal leading-[normal] tracking-[0.88px]">
                $ {formatDollars(value)}
            </span>
            <span className="text-[#F8FCFF] font-[Geist] text-[22px] not-italic font-normal leading-[normal] tracking-[0.88px] opacity-80">
                .{formatCents(value)}
            </span>
        </div>
    </div>
));

// OPTIMIZATION: Memoized WalletHeader component
const WalletHeader = memo(({
    wallet,
    proposed,
    available,
    totalBalance,
    wallets = [],
    onWalletChange,
    onBackToWallets
}: {
    wallet: Wallet;
    proposed: number;
    available: number;
    totalBalance: number;
    wallets?: Wallet[];
    onWalletChange?: (walletId: number) => void;
    onBackToWallets?: () => void;
}) => {
    const [copiedAddress, setCopiedAddress] = useState(false);
    const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const displayName = useMemo(() => capitalizeFirstLetter(wallet.name), [wallet.name]);

    const dropdownOptions = useMemo(() =>
        wallets
            .filter(w => w.id !== wallet.id)
            .map(w => ({
                value: w.id.toString(),
                label: capitalizeFirstLetter(w.name),
                groupKey: w.type.toString()
            })),
        [wallets, wallet.id]
    );

    const handleWalletChange = useCallback((walletId: string) => {
        onWalletChange?.(parseInt(walletId));
    }, [onWalletChange]);

    const handleCopyAddress = useCallback(async () => {
        if (copyTimeoutRef.current) {
            clearTimeout(copyTimeoutRef.current);
        }

        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(wallet.address);
            } else {
                const textArea = document.createElement('textarea');
                textArea.value = wallet.address;
                textArea.style.position = 'fixed';
                textArea.style.opacity = '0';
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }

            setCopiedAddress(true);
            copyTimeoutRef.current = setTimeout(() => {
                setCopiedAddress(false);
            }, 5000);

        } catch (err) {
            console.error('Failed to copy address:', err);
        }
    }, [wallet.address]);

    useEffect(() => {
        return () => {
            if (copyTimeoutRef.current) {
                clearTimeout(copyTimeoutRef.current);
            }
        };
    }, []);

    return (
        <div className="flex flex-col items-start gap-16 self-stretch">
            <div className="flex flex-col items-start gap-3 self-stretch">
                <div className="flex items-center gap-2.5 self-stretch">
                    <TertiaryButton label="Wallets" size="sm" status="neutral" onClick={onBackToWallets} />
                    <span className="text-[12px] font-medium truncate font-[Geist] not-italic leading-[normal] tracking-[0.48px]">/</span>

                    <TertiaryButtonWithDropdown
                        label={displayName}
                        dropdownOptions={dropdownOptions}
                        dropdownValue={wallet.id.toString()}
                        onDropdownChange={handleWalletChange}
                        groups={WALLET_GROUPS}
                        status="neutral"
                        size="sm"
                        dropdownPlaceholder={displayName}
                    />
                </div>
                <div className="flex justify-between items-start self-stretch">
                    <div className="flex flex-col items-start gap-[5px]">
                        <div className="flex items-center gap-3">
                            {renderWalletIcon(wallet.type)}
                            <h1 className="text-[#F8FCFF] font-[Figtree] text-[26px] not-italic font-medium leading-[normal] tracking-[1.04px]">
                                {displayName}
                            </h1>
                        </div>
                        <div className="flex items-center gap-[5px]">
                            <div className="inline-flex items-center -space-x-[4px]">
                                {getBlockchainIcons(wallet.blockchain)}
                            </div>
                            <TertiaryButton label={wallet.address} status={copiedAddress ? "brand" : "neutral"} tooltipTitle={copiedAddress ? "Address copied" : "Copy address"}
                                onClick={handleCopyAddress}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3.5">
                        <PrimaryButton
                            label="Make deposit"
                            variant={totalBalance === 0 ? "brand" : "neutral"}
                            size="md"
                            leadingIcon={<QRCodeIcon />}
                        />
                        {totalBalance > 0 && (
                            <PrimaryButton label="Send tokens" variant="neutral" size="md" leadingIcon={<SendIcon />} />
                        )}
                    </div>
                </div>
            </div>
            <div className="flex w-full items-center gap-9">
                <BalanceDisplay label="Proposed" value={proposed} />
                <BalanceDisplay label="Available" value={available} />
                <BalanceDisplay label="Total" value={totalBalance} />
            </div>
        </div>
    );
});

// AnimatedContent component
const AnimatedContent = ({
    animationDirection,
    activeTab,
    activeProposalFilter,
    children
}: {
    animationDirection: 'left' | 'right' | null;
    activeTab: string;
    activeProposalFilter: ProposalCategory | null;
    children: React.ReactNode;
}) => {
    const getTransformClass = () => {
        switch (animationDirection) {
            case 'left': return 'translate-x-full';
            case 'right': return '-translate-x-full';
            default: return 'translate-x-0';
        }
    };

    return (
        <div className="relative w-full overflow-visible">
            <div
                className={`transition-transform duration-300 ease-in-out ${getTransformClass()}`}
                key={`${activeTab}-${activeProposalFilter}`}
            >
                {children}
            </div>
        </div>
    );
};

// Props for WalletDetails component
interface WalletDetailsProps {
    wallet: Wallet;
    addresses: AddressCardProps[];
    wallets?: Wallet[];
    cryptocurrencies?: Cryptocurrency[];
    members?: any[];
    onWalletChange?: (walletId: number) => void;
    activeTab?: string;
    activeProposalFilter?: ProposalCategory | null;
    onTabStateChange?: (activeTab: string, activeProposalFilter: ProposalCategory | null) => void;
}

export default function WalletDetails({
    wallet,
    addresses = [],
    wallets = [],
    cryptocurrencies = [],
    members = [],
    onWalletChange,
    activeTab: externalActiveTab,
    activeProposalFilter: externalActiveProposalFilter,
    onTabStateChange
}: WalletDetailsProps) {
    const router = useRouter();

    const tabOrder = useMemo(() => getTabOrder(wallet.type), [wallet.type]);
    type TabType = typeof tabOrder[number];

    const [internalActiveTab, setInternalActiveTab] = useState<TabType>(tabOrder[0]);
    const [internalActiveProposalFilter, setInternalActiveProposalFilter] = useState<ProposalCategory | null>(null);

    const activeTab = externalActiveTab !== undefined ? externalActiveTab as TabType : internalActiveTab;
    const activeProposalFilter = externalActiveProposalFilter !== undefined ? externalActiveProposalFilter : internalActiveProposalFilter;

    // const activeTab = (externalActiveTab !== undefined ? externalActiveTab : internalActiveTab) as TabType;
    // const activeProposalFilter = externalActiveProposalFilter !== undefined ? externalActiveProposalFilter : internalActiveProposalFilter;

    const [hasAutoSwitched, setHasAutoSwitched] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const { animationDirection, setAnimationDirection, resetAnimation } = useTabAnimation();

    // All useMemo hooks for calculations - MOVED UP
    const transformedProposals = useMemo(() => {
        if (!wallet.proposals) return [];
        const proposalsWithCalculations = wallet.proposals.map(proposal => {
            const outgoingUSD = proposal.outTokens && proposal.outUSDPrice
                ? proposal.outTokens * proposal.outUSDPrice
                : 0;
            return { ...proposal, outgoingUSD };
        });
        return transformApiDataToProposals(proposalsWithCalculations);
    }, [wallet.proposals]);

    const uniqueClassifications = useMemo(() => {
        return Array.from(
            new Set(transformedProposals.map((proposal: Proposal) => proposal.classification).filter(Boolean))
        ) as string[];
    }, [transformedProposals]);

    const { totalBalance, proposed, available } = useMemo(() => {
        const total = wallet.balance.reduce((sum, asset) => sum + (asset.tokens * asset.price), 0);
        const proposedAmount = transformedProposals
            .filter(proposal =>
                [ProposalStatus.ACTION_REQUIRED, ProposalStatus.NO_ACTION, ProposalStatus.ACTIONED,
                ProposalStatus.READY, ProposalStatus.EXECUTING, ProposalStatus.AWAITING_NONCE].includes(proposal.status)
            )
            .reduce((sum: number, proposal: Proposal) =>
                sum + (proposal.outTokens * (proposal.outUSDPrice || 0)), 0);
        return { totalBalance: total, proposed: proposedAmount, available: total - proposedAmount };
    }, [wallet.balance, transformedProposals]);

    const proposalCounts = useMemo(() => {
        const counts = {
            [ProposalCategory.NEEDS_APPROVAL]: transformedProposals.filter(p =>
                p.status === ProposalStatus.ACTION_REQUIRED
            ).length,
            [ProposalCategory.READY_TO_EXECUTE]: transformedProposals.filter(p =>
                p.status === ProposalStatus.FAILED ||
                p.status === ProposalStatus.READY
            ).length,
            [ProposalCategory.DISCARDED]: transformedProposals.filter(p =>
                p.category === ProposalCategory.DISCARDED
            ).length,
            totalProposals: transformedProposals.length,
        };
        const navTabDiscardedCount = transformedProposals.filter(p =>
            p.status === ProposalStatus.FAILED_REJECTED
        ).length;

        return {
            needsApprovalCount: counts[ProposalCategory.NEEDS_APPROVAL],
            readyToExecuteCount: counts[ProposalCategory.READY_TO_EXECUTE],
            discardedCount: counts[ProposalCategory.DISCARDED],
            navTabDiscardedCount: navTabDiscardedCount,
            totalProposals: counts.totalProposals,
            categoryCounts: counts
        };
    }, [transformedProposals]);

    const { needsApprovalCount, readyToExecuteCount, discardedCount, navTabDiscardedCount, totalProposals, categoryCounts } = proposalCounts;

    // FIX: Calculate highest count subtitle as a function - MOVED UP
    const calculateHighestCountSubtitle = useCallback((): ProposalCategory => {
        const counts = categoryCounts;
        let highestCategory: ProposalCategory = ProposalCategory.NEEDS_APPROVAL;
        let highestCount = -1;
        const mainCategories = [ProposalCategory.NEEDS_APPROVAL, ProposalCategory.READY_TO_EXECUTE, ProposalCategory.DISCARDED];
        mainCategories.forEach((category: ProposalCategory) => {
            if (counts[category] > highestCount) {
                highestCount = counts[category];
                highestCategory = category;
            }
        });
        return highestCategory;
    }, [categoryCounts]);

    const shouldShowAssetsTab = useMemo(() => {
        return totalBalance === 0 &&
            needsApprovalCount === 0 &&
            readyToExecuteCount === 0 &&
            discardedCount === 0;
    }, [totalBalance, needsApprovalCount, readyToExecuteCount, discardedCount]);

    // FIX: Calculate the appropriate default tab for this wallet - MOVED AFTER DEPENDENCIES
    const getDefaultTabForWallet = useCallback((): { tab: TabType; proposalFilter: ProposalCategory | null } => {
        const tabOrder = getTabOrder(wallet.type);

        // If this is a tracked wallet, default to assets
        if (wallet.type === 3) {
            return { tab: 'assets' as TabType, proposalFilter: null };
        }

        // For other wallets, check if we should auto-switch to assets
        const shouldAutoSwitch = totalBalance === 0 &&
            needsApprovalCount === 0 &&
            readyToExecuteCount === 0 &&
            discardedCount === 0;

        if (shouldAutoSwitch) {
            return { tab: 'assets' as TabType, proposalFilter: null };
        }

        // Otherwise, default to proposals with the highest count subtab
        const highestSubtitle = calculateHighestCountSubtitle();
        return { tab: 'proposals' as TabType, proposalFilter: highestSubtitle };
    }, [wallet.type, totalBalance, needsApprovalCount, readyToExecuteCount, discardedCount, calculateHighestCountSubtitle]);

    // FIX: Initialize tab state on first load only
    useEffect(() => {
        if (isInitialLoad) {
            // On initial load, if no external tab state is provided, use the default for this wallet
            if (externalActiveTab === undefined && externalActiveProposalFilter === undefined) {
                const defaultTabState = getDefaultTabForWallet();
                setInternalActiveTab(defaultTabState.tab);
                setInternalActiveProposalFilter(defaultTabState.proposalFilter);
            }
            setIsInitialLoad(false);
        }
    }, [isInitialLoad, externalActiveTab, externalActiveProposalFilter, getDefaultTabForWallet]);

    // FIX: Validate and correct tab state when wallet changes
    useEffect(() => {
        // Skip this effect on initial load - handled by separate effect above
        if (isInitialLoad) {
            return;
        }

        // Reset auto-switch flag when wallet changes
        setHasAutoSwitched(false);

        const currentTabOrder = getTabOrder(wallet.type);

        // Check if current tab is valid for this wallet type
        const isCurrentTabValid = currentTabOrder.includes(activeTab as any);

        if (!isCurrentTabValid) {
            // Current tab is not valid for this wallet type, switch to default
            const defaultTabState = getDefaultTabForWallet();
            if (onTabStateChange) {
                onTabStateChange(defaultTabState.tab, defaultTabState.proposalFilter);
            } else {
                setInternalActiveTab(defaultTabState.tab);
                setInternalActiveProposalFilter(defaultTabState.proposalFilter);
            }
        } else if (activeTab === 'proposals' && transformedProposals.length > 0 && activeProposalFilter === null) {
            // If we're on proposals but no subtab is selected, initialize it with highest count
            const highestSubtitle = calculateHighestCountSubtitle();
            if (onTabStateChange) {
                onTabStateChange('proposals', highestSubtitle);
            } else {
                setInternalActiveProposalFilter(highestSubtitle);
            }
        }
        // Note: We removed the auto-switch to assets logic here because:
        // 1. If user explicitly chose a tab, we should preserve it
        // 2. The default tab calculation already handles empty wallets
    }, [wallet.id, wallet.type, activeTab, onTabStateChange, getDefaultTabForWallet, isInitialLoad, transformedProposals, activeProposalFilter, calculateHighestCountSubtitle]);

    // FIX: Initialize subtab when switching to proposals tab
    useEffect(() => {
        // If we're on proposals tab but no subtab is selected, initialize it
        if (activeTab === 'proposals' && activeProposalFilter === null && transformedProposals.length > 0) {
            const highestSubtitle = calculateHighestCountSubtitle();
            if (onTabStateChange) {
                onTabStateChange('proposals', highestSubtitle);
            } else {
                setInternalActiveProposalFilter(highestSubtitle);
            }
        }
    }, [activeTab, activeProposalFilter, transformedProposals, calculateHighestCountSubtitle, onTabStateChange]);

    // FIX: Direct tab change handlers that work with parent-controlled state
    const handleTabChange = useCallback((newTab: TabType) => {
        const currentIndex = TAB_ORDER.indexOf(activeTab);
        const newIndex = TAB_ORDER.indexOf(newTab);
        setAnimationDirection(currentIndex, newIndex);

        if (onTabStateChange) {
            // Parent controls state - notify parent of change
            if (newTab === 'proposals' && transformedProposals.length > 0) {
                // When switching to proposals, initialize with highest count subtab
                const highestSubtitle = calculateHighestCountSubtitle();
                onTabStateChange(newTab, highestSubtitle);
            } else {
                onTabStateChange(newTab, null);
            }
        } else {
            // Internal state - update directly
            setInternalActiveTab(newTab);
            if (newTab === 'proposals' && transformedProposals.length > 0) {
                const highestSubtitle = calculateHighestCountSubtitle();
                setInternalActiveProposalFilter(highestSubtitle);
            } else {
                setInternalActiveProposalFilter(null);
            }
        }
    }, [activeTab, activeProposalFilter, setAnimationDirection, onTabStateChange, transformedProposals, calculateHighestCountSubtitle]);

    const handleProposalFilterChange = useCallback((subtitleName: string) => {
        const category = getCategoryFromHumanReadable(subtitleName);

        // Animation logic
        if (activeProposalFilter) {
            const currentIndex = [ProposalCategory.NEEDS_APPROVAL, ProposalCategory.READY_TO_EXECUTE, ProposalCategory.DISCARDED].indexOf(activeProposalFilter);
            const newIndex = [ProposalCategory.NEEDS_APPROVAL, ProposalCategory.READY_TO_EXECUTE, ProposalCategory.DISCARDED].indexOf(category);
            setAnimationDirection(currentIndex, newIndex);
        } else {
            setAnimationDirection(0, [ProposalCategory.NEEDS_APPROVAL, ProposalCategory.READY_TO_EXECUTE, ProposalCategory.DISCARDED].indexOf(category));
        }

        if (onTabStateChange) {
            // Parent controls state - notify parent of change
            onTabStateChange('proposals', category);
        } else {
            // Internal state - update directly
            setInternalActiveProposalFilter(category);
            setInternalActiveTab('proposals');
        }
    }, [activeProposalFilter, setAnimationDirection, onTabStateChange]);

    const handleProposalsTabClick = useCallback(() => {
        const currentIndex = TAB_ORDER.indexOf(activeTab);
        const newIndex = TAB_ORDER.indexOf('proposals');
        setAnimationDirection(currentIndex, newIndex);

        const highestCountSubtitle = calculateHighestCountSubtitle();

        if (onTabStateChange) {
            // Parent controls state - notify parent of change
            onTabStateChange('proposals', highestCountSubtitle);
        } else {
            // Internal state - update directly
            setInternalActiveTab('proposals');
            setInternalActiveProposalFilter(highestCountSubtitle);
        }
    }, [activeTab, setAnimationDirection, onTabStateChange, calculateHighestCountSubtitle]);

    const handleBackToWallets = useCallback(() => {
        router.push('/wallets');
    }, [router]);

    const handleViewAllProposals = useCallback(() => {
        const tabMapping = {
            [ProposalCategory.NEEDS_APPROVAL]: 'needs-approval',
            [ProposalCategory.READY_TO_EXECUTE]: 'ready-to-execute',
            [ProposalCategory.DISCARDED]: 'discarded'
        };

        const activeTabParam = activeProposalFilter ? tabMapping[activeProposalFilter] : 'needs-approval';
        router.push(`/transactions/proposals?wallet=${wallet.name}&tab=${activeTabParam}`);
    }, [router, wallet.name, activeProposalFilter]);

    const handleViewAllAssets = useCallback(() => {
        router.push(`/assets?wallet=${wallet.name}`);
    }, [router, wallet.name]);

    const handleViewAllTransactions = useCallback(() => {
        router.push(`/transactions/view-all?wallet=${wallet.name}`);
    }, [router, wallet.name]);

    const getCurrentProposalLabel = useCallback(() => {
        if (!activeProposalFilter) return 'proposals';

        switch (activeProposalFilter) {
            case ProposalCategory.NEEDS_APPROVAL:
                return 'needs approval';
            case ProposalCategory.READY_TO_EXECUTE:
                return 'ready to execute';
            case ProposalCategory.DISCARDED:
                return 'discarded';
            default:
                return 'proposals';
        }
    }, [activeProposalFilter]);

    useEffect(() => {
        if (animationDirection) {
            const timer = setTimeout(resetAnimation, 300);
            return () => clearTimeout(timer);
        }
    }, [animationDirection, resetAnimation]);

    const memoizedTransformedAssets = useMemo(() => {
        const blockchainInfo = Array.isArray(wallet.blockchain)
            ? wallet.blockchain
            : [{ blockchain: wallet.blockchain }];

        const safeTotalBalance = totalBalance === 0 ? 1 : totalBalance;

        return wallet.balance.map(balance => {
            const walletInfo: WalletInfo = {
                walletId: wallet.id,
                walletType: wallet.type,
                name: wallet.name,
                balance: balance.tokens,
                assetId: balance.assetId,
                percentageShare: (balance.USD / safeTotalBalance) * 100
            };
            return {
                uniqueId: balance.uniqueId,
                assetId: balance.assetId,
                blockchain: blockchainInfo,
                countOfWallets: 1,
                totalTokens: balance.tokens,
                expanded: false,
                wallets: [walletInfo],
                percentageShareInUSD: (balance.USD / safeTotalBalance) * 100,
                percent_change_24h: wallet.percent_change_24h || 0,
                price: balance.price,
                symbol: balance.symbol,
                name: balance.name,
                fullName: balance.fullName,
                USD: balance.USD
            };
        });
    }, [wallet.balance, wallet.blockchain, wallet.id, wallet.type, wallet.name, wallet.percent_change_24h, totalBalance]);

    const memoizedTransformedTransactions = useMemo((): TransactionWithDateInfo[] => {
        return (wallet.transactions || []).map((transaction, index, array) => {
            const currentDate = new Date(transaction.timestamp).toDateString();
            const prevDate = index > 0 ? new Date(array[index - 1].timestamp).toDateString() : null;
            const isFirstOfDate = currentDate !== prevDate;
            return {
                ...transaction,
                showDate: isFirstOfDate,
                isFirstOfDate
            };
        });
    }, [wallet.transactions]);

    const renderProposalsContent = useCallback(() => {
        const filteredProposals = transformedProposals.filter(proposal =>
            !activeProposalFilter || proposal.category === activeProposalFilter
        );
        const previewProposals = filteredProposals.slice(0, PREVIEW_ITEMS_COUNT);

        if (filteredProposals.length === 0) {
            return (
                <div className="text-center py-8 text-gray-500">
                    No proposals found
                </div>
            );
        }
        return (
            <div className="relative">
                <div className="group/group flex w-full max-w-[1040px] mx-auto flex pt-[10px] pr-[16px] pb-[10px] pl-[8px] items-center gap-4 self-stretch bg-[#18191B]">
                    <span className="w-[154px] text-[#F8FCFF] opacity-82 font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px]">Initiated</span>
                    <span className="w-[160px] text-[#F8FCFF] opacity-82 font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px]">Wallet & Network</span>
                    <span className="w-[160px] text-[#F8FCFF] opacity-82 font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px]">To</span>
                    <span className="w-[160px] text-[#F8FCFF] opacity-82 font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px]">Tokens</span>
                    <span className="w-[160px] text-[#F8FCFF] opacity-82 font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px]">Classification</span>
                    <span className="w-[150px] text-[#F8FCFF] opacity-82 font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px]">Status</span>
                </div>
                <ProposalList
                    proposals={previewProposals}
                    addresses={addresses}
                    uniqueClassifications={uniqueClassifications}
                />
                {filteredProposals.length > PREVIEW_ITEMS_COUNT && (
                    <div className="absolute bottom-0 flex w-full justify-center py-5 bg-gradient-to-t from-[#0E1011] to-transparent" onClick={handleViewAllProposals}>
                        <PrimaryButton
                            leadingIcon={<ArrowLeftUpBoxFill />}
                            label={`${filteredProposals.length} ${getCurrentProposalLabel()}`}
                            variant="inverted"
                            size="md"
                        />
                    </div>
                )}
            </div>
        );
    }, [transformedProposals, activeProposalFilter, addresses, uniqueClassifications, handleViewAllProposals, getCurrentProposalLabel]);

    const renderAssetsContent = useCallback(() => {
        const previewAssets = memoizedTransformedAssets.slice(0, PREVIEW_ITEMS_COUNT);
        const displayWalletName = capitalizeFirstLetter(wallet.name);

        return (
            <div>
                {previewAssets.length > 0 ? (
                    <div>
                        <div className="group/group flex w-full max-w-[1040px] mx-auto flex pt-[10px] pr-[16px] pb-[10px] pl-[11.5px] items-center gap-4 self-stretch bg-[#18191B]">
                            <span className="w-[262px] text-[#F8FCFF] opacity-82 font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px]">Token & Network</span>
                            <div className="w-[248px] flex items-center justify-between gap-4">
                                <span className="text-[#F8FCFF] opacity-82 font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px] text-right w-[116px]">Price</span>
                                <span className="text-[#F8FCFF] opacity-82 font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px] w-[116px]">Last 24 Hrs</span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <span className="w-[160px] text-[#F8FCFF] opacity-82 font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px] text-right ">Token value</span>
                                <span className="w-[160px] text-[#F8FCFF] opacity-82 font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px]">USD</span>
                            </div>
                            <span className="w-[150px] text-[#F8FCFF] opacity-82 font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px]">Wallets</span>
                        </div>
                        <AssetList assets={previewAssets} />
                        {memoizedTransformedAssets.length > PREVIEW_ITEMS_COUNT && (
                            <div className="absolute bottom-0 flex w-full justify-center py-5 bg-gradient-to-t from-[#0E1011] to-transparent" onClick={handleViewAllAssets}>
                                <PrimaryButton
                                    leadingIcon={<ArrowLeftUpBoxFill />}
                                    label={`${memoizedTransformedAssets.length} assets`}
                                    variant="inverted"
                                    size="md"
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <div className="flex flex-col py-10 items-center gap-4">
                            <div className="flex flex-col gap-1 items-center">
                                <span className="text-[#F8FCFF] font-[Figtree] text-[26px] not-italic font-medium leading-[normal] tracking-[1.04px]">{displayWalletName} has no assets</span>
                                <span className="text-[#EDEEEE] font-[Geist] text-sm not-italic font-normal leading-[normal] tracking-[0.56px]">Make deposit to start using wallet</span>
                            </div>
                            <svg width={256} height={256}>
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#FFFFFF" />
                                        <stop offset="100%" stopColor="#B0B9E8" />
                                    </linearGradient>
                                </defs>
                                <QRCodeSVG
                                    value={wallet.address}
                                    size={256}
                                    bgColor="transparent"
                                    fgColor="url(#gradient)"
                                    level="L"
                                />
                            </svg>
                        </div>
                        <PrimaryButton
                            label="Make deposit"
                            variant="brand"
                            size="lg"
                            leadingIcon={<QRCodeIcon />}
                            rounded
                        />
                    </div>
                )}
            </div>
        );
    }, [memoizedTransformedAssets, wallet.name, wallet.address, handleViewAllAssets]);

    const renderTransactionsContent = useCallback(() => {
        const previewTransactions = memoizedTransformedTransactions.slice(0, PREVIEW_ITEMS_COUNT);

        return (
            <div>
                {memoizedTransformedTransactions.length > 0 ? (
                    <div>
                        <div className="group/group flex w-full max-w-[1040px] mx-auto flex pt-[10px] pr-[16px] pb-[10px] pl-[8px] items-center gap-4 self-stretch bg-[#18191B]">
                            <span className="w-[154px] text-[#F8FCFF] opacity-82 font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px]">Type & time</span>
                            <span className="w-[160px] text-[#F8FCFF] opacity-82 font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px]">Wallet & Network</span>
                            <span className="w-[160px] text-[#F8FCFF] opacity-82 font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px]">To/From</span>
                            <span className="w-[160px] text-[#F8FCFF] opacity-82 font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px]">In</span>
                            <span className="w-[160px] text-[#F8FCFF] opacity-82 font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px]">Out</span>
                            <span className="w-[150px] text-[#F8FCFF] opacity-82 font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px]">Classification</span>
                        </div>
                        <TransactionList
                            transactions={previewTransactions}
                            addresses={addresses}
                            uniqueClassifications={uniqueClassifications}
                        />
                        {memoizedTransformedTransactions.length > PREVIEW_ITEMS_COUNT && (
                            <div className="absolute bottom-0 flex w-full justify-center py-5 bg-gradient-to-t from-[#0E1011] to-transparent" onClick={handleViewAllTransactions}>
                                <PrimaryButton
                                    leadingIcon={<ArrowLeftUpBoxFill />}
                                    label={`${memoizedTransformedTransactions.length} transactions`}
                                    variant="inverted"
                                    size="md"
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        No transactions found
                    </div>
                )}
            </div>
        );
    }, [memoizedTransformedTransactions, addresses, uniqueClassifications, handleViewAllTransactions]);

    const renderPolicyContent = useCallback(() => (
        <PolicyContent wallet={wallet} cryptocurrencies={cryptocurrencies} members={members} />
    ), [wallet, cryptocurrencies, members]);

    const renderTabContent = useCallback(() => {
        const contentMap = {
            proposals: renderProposalsContent,
            assets: renderAssetsContent,
            transactions: renderTransactionsContent,
            policy: renderPolicyContent,
        };
        return contentMap[activeTab]();
    }, [activeTab, renderProposalsContent, renderAssetsContent, renderTransactionsContent, renderPolicyContent]);

    const walletHeader = useMemo(() => (
        <WalletHeader
            wallet={wallet}
            proposed={proposed}
            available={available}
            totalBalance={totalBalance}
            wallets={wallets}
            onWalletChange={onWalletChange}
            onBackToWallets={handleBackToWallets}
        />
    ), [wallet, proposed, available, totalBalance, wallets, onWalletChange, handleBackToWallets]);

    const navTabs = useMemo(() => (
        <div className="flex items-start gap-8 self-stretch border-b-0.8 border-[#1F2122]">
            {wallet.type !== 3 && (
                <NavTab
                    title="Proposals"
                    subtitles={[
                        {
                            name: "Needs approval",
                            count: needsApprovalCount,
                            ...(needsApprovalCount > 0 && { color: "cyan" })
                        },
                        {
                            name: "Ready to execute",
                            count: readyToExecuteCount,
                            ...(readyToExecuteCount > 0 && { color: "white" })
                        },
                        {
                            name: "Discarded",
                            count: navTabDiscardedCount,
                            ...(navTabDiscardedCount > 0 && { color: "red" })
                        }
                    ]}
                    isActive={activeTab === 'proposals'}
                    activeSubtitle={activeProposalFilter ? getHumanReadableCategory(activeProposalFilter) : null}
                    onClick={handleProposalsTabClick}
                    onSubtitleClick={handleProposalFilterChange}
                />
            )}

            <NavTab
                title="Assets"
                titleCount={wallet.balance?.length ?? 0}
                subtitles={[]}
                isActive={activeTab === 'assets'}
                onClick={() => handleTabChange('assets')}
            />

            <NavTab
                title="Transactions"
                titleCount={wallet.transactions?.length ?? 0}
                subtitles={[]}
                isActive={activeTab === 'transactions'}
                onClick={() => handleTabChange('transactions')}
            />

            {wallet.type !== 3 && (
                <NavTab
                    title="Policy"
                    subtitles={[]}
                    isActive={activeTab === 'policy'}
                    onClick={() => handleTabChange('policy')}
                />
            )}
        </div>
    ), [wallet.type, wallet.balance, wallet.transactions, activeTab, activeProposalFilter, needsApprovalCount, readyToExecuteCount, navTabDiscardedCount, handleProposalsTabClick, handleProposalFilterChange, handleTabChange]);

    return (
        <div className="flex w-full pt-[22px] pb-[80px] flex-col items-center gap-8 h-[100px]">
            {walletHeader}

            <div className="flex flex-col items-center self-stretch">
                {navTabs}

                <AnimatedContent
                    animationDirection={animationDirection}
                    activeTab={activeTab}
                    activeProposalFilter={activeProposalFilter}
                >
                    {renderTabContent()}
                </AnimatedContent>
            </div>
        </div>
    );
}