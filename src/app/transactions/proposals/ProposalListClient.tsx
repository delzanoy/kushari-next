// // ProposalListClient.tsx
// "use client"
// import { useState, useMemo, useRef, useEffect, useCallback } from "react";
// import { Proposal, ProposalCategory, ProposalStatus } from "./types";
// import { AddressCardProps } from "./../../address-book/addresses/types";
// import ProposalList from "./ProposalList";
// import NavTab from "../../components/buttons/NavTab";
// import MultiLevelFilter, { FilterCriterion, FilterField, FilterDropdownOption } from "./../../components/filters/ComplexFilter";
// import FilterDropdown from "./../../components/filters/FilterDropdown";
// import IconButton from "./../../components/buttons/IconButton";

// // Import icons
// import {
//     SearchIcon,
//     VaultIcon,
//     GnosisSafeIcon,
//     TrackedWalletIcon,
//     ChevronLeftIcon,
//     ChevronRightIcon,
//     AddressIcon,
//     NetworkIcon,
//     BSCIcon,
//     EthereumIcon,
//     GnosisIcon,
//     OPTIMISMIcon,
//     PolygonIcon,
//     SOLIcon,
//     SmallArrowDown
// } from "./../../components/icons";

// interface ProposalListProps {
//     proposals: Proposal[];
//     addresses: AddressCardProps[];
//     uniqueClassifications: string[];
//     initialSearchQuery?: string;
//     initialPage?: number;
//     initialWalletFilter?: string; // ADD THIS LINE
//     initialTab?: ProposalCategory; // ADD THIS LINE
//     onSearchChange?: (query: string) => void;
// }

// // Function to categorize proposals based on their status
// function getProposalCategory(status: ProposalStatus): ProposalCategory {
//     switch (status) {
//         case ProposalStatus.ACTION_REQUIRED:
//         case ProposalStatus.NO_ACTION:
//         case ProposalStatus.ACTIONED:
//             return ProposalCategory.NEEDS_APPROVAL;

//         case ProposalStatus.READY:
//         case ProposalStatus.FAILED:
//         case ProposalStatus.EXECUTING:
//         case ProposalStatus.AWAITING_NONCE:
//             return ProposalCategory.READY_TO_EXECUTE;

//         case ProposalStatus.DECLINED:
//         case ProposalStatus.FAILED_REJECTED:
//             return ProposalCategory.DISCARDED;

//         default:
//             return ProposalCategory.NEEDS_APPROVAL;
//     }
// }

// // Define wallet groups
// const walletGroups = [
//     { key: '1', label: 'Vaults' },
//     { key: '2', label: 'Gnosis Safes' },
//     { key: '3', label: 'Tracked Wallets' },
// ];

// const ITEMS_PER_PAGE = 25;

// const PageSelector = ({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (page: number) => void }) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const dropdownRef = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//         function handleClickOutside(event: MouseEvent) {
//             if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//                 setIsOpen(false);
//             }
//         }
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, []);

//     return (
//         <div className="relative" ref={dropdownRef}>
//             <div
//                 className="group/dropdown flex py-[2px] px-[8px] items-center gap-[6px] rounded-md border-[0.5px] border-solid border-[#F8FCFF]/24 bg-[#F8FCFF]/02 hover:border-[#F8FCFF] hover:bg-[#F8FCFF]/16 hover:cursor-pointer transition-all duration-150 ease-in-out"
//                 onClick={() => setIsOpen(!isOpen)}
//             >
//                 <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-light leading-[normal] tracking-[0.7px] group-hover/dropdown:text-[#FFFFFF]">
//                     Pg. {currentPage}
//                 </span>
//                 <SmallArrowDown className="h-[16px] w-[16px] opacity-80 group-hover/dropdown:text-[#FFFFFF]" />
//             </div>

//             {isOpen && (
//                 <div className="absolute top-full left-0 mt-1 w-32 rounded-md border border-[#F8FCFF]/24 bg-[#1E2A34] shadow-lg z-50 max-h-60 overflow-y-auto">
//                     {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//                         <div
//                             key={page}
//                             className={`px-3 py-2 text-sm cursor-pointer transition-colors duration-150 ${page === currentPage
//                                 ? 'bg-[#26C9C9]/20 text-[#26C9C9] font-medium'
//                                 : 'text-[#F8FCFF] hover:bg-[#26C9C9]/20 hover:text-[#26C9C9]'
//                                 }`}
//                             onClick={() => {
//                                 onPageChange(page);
//                                 setIsOpen(false);
//                             }}
//                         >
//                             Pg. {page}
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };

// // Wallet icon renderer
// const renderWalletIcon = (walletType: number) => {
//     switch (walletType) {
//         case 1:
//             return <VaultIcon className="w-4 h-4 shrink-0 aspect-square" />;
//         case 2:
//             return <GnosisSafeIcon className="w-4 h-4 shrink-0 aspect-square" />;
//         case 3:
//             return <TrackedWalletIcon className="w-4 h-4 shrink-0 aspect-square" />;
//         default:
//             return null;
//     }
// };

// const getBlockchainIcon = (blockchainName: string) => {
//     switch (blockchainName) {
//         case "BSC":
//             return <BSCIcon className="w-4 h-4 shrink-0" />;
//         case "Ethereum":
//             return <EthereumIcon className="w-4 h-4 shrink-0" />;
//         case "Gnosis chain":
//             return <GnosisIcon className="w-4 h-4 shrink-0" />;
//         case "Optimism":
//             return <OPTIMISMIcon className="w-4 h-4 shrink-0" />;
//         case "Polygon":
//             return <PolygonIcon className="w-4 h-4 shrink-0" />;
//         case "Solana":
//             return <SOLIcon className="w-4 h-4 shrink-0" />;
//         default:
//             return null;
//     }
// };

// export default function ProposalListClient({
//     proposals,
//     addresses,
//     uniqueClassifications,
//     initialSearchQuery = '',
//     initialPage = 1,
//     initialWalletFilter,
//     initialTab
// }: ProposalListProps) {
//     const [activeTab, setActiveTab] = useState<ProposalCategory>(
//         initialTab || ProposalCategory.NEEDS_APPROVAL
//     );

//     const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
//     const [filterCriteria, setFilterCriteria] = useState<FilterCriterion[]>([]);
//     const [currentPage, setCurrentPage] = useState(initialPage);

//     // Sync search query when initialSearchQuery changes (from URL)
//     useEffect(() => {
//         setSearchQuery(initialSearchQuery);
//     }, [initialSearchQuery]);

//     // Sync current page when initialPage changes (from URL)
//     useEffect(() => {
//         setCurrentPage(initialPage);
//     }, [initialPage]);

//     useEffect(() => {
//         if (initialTab && initialTab !== activeTab) {
//             setActiveTab(initialTab);
//         }
//     }, [initialTab]);

//     // Search function for proposals (status removed)
//     const searchProposals = useCallback((proposal: Proposal, query: string): boolean => {
//         if (!query.trim()) return true;

//         const searchTerm = query.toLowerCase().trim();

//         // Helper function to safely check if a value contains the search term
//         const checkValue = (value: any): boolean => {
//             if (!value) return false;
//             if (typeof value === 'string') {
//                 return value.toLowerCase().includes(searchTerm);
//             }
//             return false;
//         };

//         // Search in basic string fields (status removed)
//         if (checkValue(proposal.id) || // Proposal hash/ID
//             checkValue(proposal.wallet) ||
//             checkValue(proposal.classification) ||
//             checkValue(proposal.initiator)) {
//             return true;
//         }

//         // Search in recipients/addresses - handle different formats
//         if (proposal.recipients) {
//             // Case 1: recipients is a string (raw address)
//             if (typeof proposal.recipients === 'string') {
//                 if (checkValue(proposal.recipients)) {
//                     return true;
//                 }
//             }
//             // Case 2: recipients is an array (multi-recipient)
//             else if (Array.isArray(proposal.recipients)) {
//                 for (const recipient of proposal.recipients) {
//                     // Check if recipient has addressId and look up address name
//                     if (recipient.addressId) {
//                         const addressEntry = addresses.find(addr => addr.id === recipient.addressId);
//                         if (addressEntry?.name && checkValue(addressEntry.name)) {
//                             return true;
//                         }
//                     }
//                     // Check raw address in toAddress
//                     if (recipient.toAddress && checkValue(recipient.toAddress)) {
//                         return true;
//                     }
//                 }
//             }
//             // Case 3: recipients is an object (single recipient with addressId)
//             else if (typeof proposal.recipients === 'object') {
//                 const recipient = proposal.recipients;

//                 // Check if recipient has addressId and look up address name
//                 if (recipient.addressId) {
//                     const addressEntry = addresses.find(addr => addr.id === recipient.addressId);
//                     if (addressEntry?.name && checkValue(addressEntry.name)) {
//                         return true;
//                     }
//                 }
//                 // Check raw address in toAddress
//                 if (recipient.toAddress && checkValue(recipient.toAddress)) {
//                     return true;
//                 }
//             }
//         }

//         return false;
//     }, [addresses]);

//     // Sort proposals by timestamp (newest first)
//     const sortedProposals = useMemo(() => {
//         return [...proposals].sort((a, b) => {
//             // Assuming proposals have a timestamp field like transactions
//             const dateA = new Date(a.timestamp).getTime();
//             const dateB = new Date(b.timestamp).getTime();
//             return dateB - dateA; // Descending order (newest first)
//         });
//     }, [proposals]);

//     // Group proposals by date
//     const proposalsByDate = useMemo(() => {
//         const groups: { [key: string]: Proposal[] } = {};

//         sortedProposals.forEach(proposal => {
//             const dateKey = new Date(proposal.timestamp).toDateString(); // This ignores time, only uses date

//             if (!groups[dateKey]) {
//                 groups[dateKey] = [];
//             }

//             groups[dateKey].push(proposal);
//         });

//         return groups;
//     }, [sortedProposals]);

//     // Flatten proposals with date grouping info for the list
//     const proposalsWithDateInfo = useMemo(() => {
//         const result: Array<Proposal & { showDate: boolean; isFirstOfDate: boolean }> = [];

//         Object.entries(proposalsByDate).forEach(([dateKey, proposals]) => {
//             proposals.forEach((proposal, index) => {
//                 result.push({
//                     ...proposal,
//                     showDate: index === 0, // Only show date for first proposal of the day
//                     isFirstOfDate: index === 0
//                 });
//             });
//         });

//         return result;
//     }, [proposalsByDate]);

//     // Categorize proposals
//     const categorizedProposals = useMemo(() => {
//         return proposalsWithDateInfo.map(proposal => ({
//             ...proposal,
//             category: getProposalCategory(proposal.status)
//         }));
//     }, [proposalsWithDateInfo]);

//     // Clean up filter criteria - remove any with empty values
//     const cleanedFilterCriteria = useMemo(() => {
//         return filterCriteria.filter(criterion => {
//             if (Array.isArray(criterion.value)) {
//                 return criterion.value.length > 0;
//             }
//             return criterion.value !== '' && criterion.value != null;
//         });
//     }, [filterCriteria]);

//     // Helper function to get proposal values for filtering (status removed)
//     const getProposalValue = (proposal: Proposal, field: string): any => {
//         switch (field) {
//             case 'wallet':
//                 return proposal.wallet?.toString() || '';
//             case 'network':
//                 return proposal.blockchain || '';
//             case 'address':
//                 // Handle address search for filtering
//                 if (Array.isArray(proposal.recipients)) {
//                     return proposal.recipients
//                         .map(r => {
//                             if (r.addressId) {
//                                 return r.addressId.toString();
//                             }
//                             return r.toAddress || '';
//                         })
//                         .filter((addr): addr is string => Boolean(addr));
//                 } else if (typeof proposal.recipients === 'string') {
//                     // Handle case where recipients is a raw address string
//                     return proposal.recipients;
//                 } else if (!Array.isArray(proposal.recipients) && proposal.recipients) {
//                     // Single recipient object
//                     if (proposal.recipients.addressId) {
//                         return proposal.recipients.addressId.toString();
//                     }
//                     return proposal.recipients.toAddress || '';
//                 }
//                 return '';
//             case 'classification':
//                 return proposal.classification || '';
//             default:
//                 return (proposal as any)[field] || '';
//         }
//     };

//     // Get selected values for a specific field from filter criteria
//     const getSelectedValuesForField = (fieldKey: string): any[] => {
//         const criterion = filterCriteria.find(c => c.field === fieldKey);
//         if (!criterion) return [];

//         if (Array.isArray(criterion.value)) {
//             return criterion.value;
//         }
//         return [criterion.value];
//     };

//     // Update filter criteria for a specific field
//     const updateFieldCriteria = (fieldKey: string, newValues: any[]) => {
//         setFilterCriteria(prev => {
//             const existingCriterionIndex = prev.findIndex(c => c.field === fieldKey);

//             if (newValues.length === 0) {
//                 return prev.filter(c => c.field !== fieldKey);
//             } else {
//                 const newCriterion: FilterCriterion = {
//                     id: existingCriterionIndex >= 0 ? prev[existingCriterionIndex].id : `criterion-${Date.now()}`,
//                     field: fieldKey,
//                     operator: 'equals',
//                     value: newValues,
//                 };

//                 if (existingCriterionIndex >= 0) {
//                     return prev.map((c, index) =>
//                         index === existingCriterionIndex ? newCriterion : c
//                     );
//                 } else {
//                     return [...prev, newCriterion];
//                 }
//             }
//         });
//         setCurrentPage(1); // Reset to first page when filters change
//     };

//     // Get wallet options
//     const walletOptions = useMemo((): FilterDropdownOption[] => {
//         const walletMap = new Map();

//         proposals.forEach(proposal => {
//             if (proposal.wallet && proposal.wallet && !walletMap.has(proposal.wallet)) {
//                 walletMap.set(proposal.wallet, {
//                     id: proposal.wallet,
//                     name: proposal.wallet,
//                     walletType: proposal.walletType,
//                 });
//             }
//         });

//         const uniqueWallets = Array.from(walletMap.values())
//             .sort((a, b) => a.name.localeCompare(b.name));

//         return uniqueWallets.map(wallet => ({
//             value: wallet.id.toString(),
//             id: wallet.id.toString(),
//             searchText: wallet.name.toLowerCase(),
//             groupKey: `${wallet.walletType}`,
//             display: (
//                 <div className="flex items-center gap-3 flex-1">
//                     <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
//                         {renderWalletIcon(wallet.walletType)}
//                     </div>
//                     <div className="flex flex-col flex-1 min-w-0">
//                         <span className="text-[#F8FCFF] font-[Geist] text-sm font-medium truncate">
//                             {wallet.name}
//                         </span>
//                     </div>
//                 </div>
//             ),
//             displayProps: {
//                 fullName: wallet.name,
//                 icon: renderWalletIcon(wallet.walletType)
//             }
//         }));
//     }, [proposals]);

//     useEffect(() => {
//         if (initialWalletFilter && walletOptions.length > 0) {
//             // Find the wallet that matches the wallet name from URL
//             const matchingWallet = walletOptions.find(
//                 option => option.displayProps.fullName.toLowerCase() === initialWalletFilter.toLowerCase()
//             );

//             if (matchingWallet) {
//                 // Check if this filter isn't already applied
//                 const existingWalletFilter = filterCriteria.find(c => c.field === 'wallet');
//                 const isAlreadyFiltered = existingWalletFilter?.value.includes(matchingWallet.value);

//                 if (!isAlreadyFiltered) {
//                     // Apply the wallet filter using the existing updateFieldCriteria function
//                     updateFieldCriteria('wallet', [matchingWallet.value]);
//                 }
//             }
//         }
//     }, [initialWalletFilter, walletOptions]);

//     // Get network options
//     const networkOptions = useMemo((): FilterDropdownOption[] =>
//         Array.from(new Set(proposals.map(proposal => proposal.blockchain)))
//             .filter((network): network is string => Boolean(network))
//             .map(network => ({
//                 value: network,
//                 id: network,
//                 searchText: network.toLowerCase(),
//                 display: (
//                     <div className="flex items-center gap-3 flex-1">
//                         <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
//                             <NetworkIcon className="w-4 h-4" />
//                         </div>
//                         <div className="flex flex-col flex-1 min-w-0">
//                             <span className="text-[#F8FCFF] font-[Geist] text-sm font-medium truncate">
//                                 {network}
//                             </span>
//                         </div>
//                     </div>
//                 ),
//                 displayProps: {
//                     fullName: network,
//                     icon: getBlockchainIcon(network)
//                 }
//             })), [proposals]);

//     // Get address options
//     const addressOptions = useMemo((): FilterDropdownOption[] => {
//         const addressOptions: FilterDropdownOption[] = [];
//         const addedAddresses = new Set<string>();

//         proposals.forEach(proposal => {
//             // Handle multi-recipient proposals
//             if (Array.isArray(proposal.recipients)) {
//                 proposal.recipients.forEach(recipient => {
//                     if (recipient.addressId) {
//                         const addressEntry = addresses.find(addr => addr.id === recipient.addressId);
//                         if (addressEntry && !addedAddresses.has(addressEntry.id.toString())) {
//                             addedAddresses.add(addressEntry.id.toString());
//                             addressOptions.push({
//                                 value: addressEntry.id.toString(),
//                                 id: addressEntry.id.toString(),
//                                 searchText: addressEntry.name.toLowerCase(),
//                                 display: (
//                                     <div className="flex items-center gap-3 flex-1">
//                                         <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
//                                             <AddressIcon className="w-4 h-4" />
//                                         </div>
//                                         <div className="flex flex-col flex-1 min-w-0">
//                                             <span className="text-[#F8FCFF] font-[Geist] text-sm font-medium truncate">
//                                                 {addressEntry.name}
//                                             </span>
//                                         </div>
//                                     </div>
//                                 ),
//                                 displayProps: {
//                                     fullName: addressEntry.name,
//                                     icon: <AddressIcon className="w-4 h-4" />
//                                 }
//                             });
//                         }
//                     }
//                 });
//             }
//             // Handle single recipient object with addressId
//             else if (!Array.isArray(proposal.recipients) && proposal.recipients && typeof proposal.recipients === 'object' && proposal.recipients.addressId) {
//                 const addressId = proposal.recipients.addressId;
//                 const addressEntry = addresses.find(addr => addr.id === addressId);
//                 if (addressEntry && !addedAddresses.has(addressEntry.id.toString())) {
//                     addedAddresses.add(addressEntry.id.toString());
//                     addressOptions.push({
//                         value: addressEntry.id.toString(),
//                         id: addressEntry.id.toString(),
//                         searchText: addressEntry.name.toLowerCase(),
//                         display: (
//                             <div className="flex items-center gap-3 flex-1">
//                                 <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
//                                     <AddressIcon className="w-4 h-4" />
//                                 </div>
//                                 <div className="flex flex-col flex-1 min-w-0">
//                                     <span className="text-[#F8FCFF] font-[Geist] text-sm font-medium truncate">
//                                         {addressEntry.name}
//                                     </span>
//                                 </div>
//                             </div>
//                         ),
//                         displayProps: {
//                             fullName: addressEntry.name,
//                             icon: <AddressIcon className="w-4 h-4" />
//                         }
//                     });
//                 }
//             }
//         });

//         return addressOptions.sort((a, b) => a.displayProps.fullName.localeCompare(b.displayProps.fullName));
//     }, [proposals, addresses]);

//     // Get classification options
//     const classificationOptions = useMemo((): FilterDropdownOption[] =>
//         uniqueClassifications
//             .filter((classification): classification is string => Boolean(classification))
//             .map(classification => ({
//                 value: classification,
//                 id: classification,
//                 searchText: classification.toLowerCase(),
//                 display: (
//                     <div className="flex items-center gap-3 flex-1">
//                         <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
//                             <TrackedWalletIcon className="w-4 h-4" />
//                         </div>
//                         <div className="flex flex-col flex-1 min-w-0">
//                             <span className="text-[#F8FCFF] font-[Geist] text-sm font-medium truncate">
//                                 {classification}
//                             </span>
//                         </div>
//                     </div>
//                 ),
//                 displayProps: {
//                     fullName: classification,
//                 }
//             })), [uniqueClassifications]);

//     // Apply search and filters to all proposals (without tab filtering)
//     const filteredAllProposals = useMemo(() => {
//         let filtered = categorizedProposals;

//         // Apply search filter
//         if (searchQuery.trim()) {
//             filtered = filtered.filter(proposal =>
//                 searchProposals(proposal, searchQuery)
//             );
//         }

//         // Apply filter criteria
//         if (cleanedFilterCriteria.length > 0) {
//             filtered = filtered.filter(proposal => {
//                 return cleanedFilterCriteria.every(criterion => {
//                     const value = getProposalValue(proposal, criterion.field);

//                     if (Array.isArray(criterion.value)) {
//                         if (Array.isArray(value)) {
//                             return value.some(v => criterion.value.includes(v.toString()));
//                         } else {
//                             return criterion.value.includes(value.toString());
//                         }
//                     }

//                     if (Array.isArray(value)) {
//                         return value.includes(criterion.value);
//                     }

//                     return value.toString() === criterion.value;
//                 });
//             });
//         }

//         return filtered;
//     }, [categorizedProposals, searchQuery, cleanedFilterCriteria, searchProposals]);

//     // Filter proposals based on active tab, search, and filter criteria
//     const filteredProposals = useMemo(() => {
//         return filteredAllProposals.filter(proposal => proposal.category === activeTab);
//     }, [filteredAllProposals, activeTab]);

//     // Count proposals for each category with specific logic - BASED ON FILTERED RESULTS
//     const categoryCounts = useMemo(() => {
//         return {
//             // Needs approval: Only count ACTION_REQUIRED from filtered results
//             [ProposalCategory.NEEDS_APPROVAL]: filteredAllProposals.filter(p =>
//                 p.status === ProposalStatus.ACTION_REQUIRED
//             ).length,

//             // Ready to execute: Count of FAILED + READY from filtered results
//             [ProposalCategory.READY_TO_EXECUTE]: filteredAllProposals.filter(p =>
//                 p.status === ProposalStatus.FAILED ||
//                 p.status === ProposalStatus.READY
//             ).length,

//             // Discarded: Count all discarded proposals from filtered results
//             [ProposalCategory.DISCARDED]: filteredAllProposals.filter(p =>
//                 p.category === ProposalCategory.DISCARDED
//             ).length,

//             // NEW: Special count for NavTab that only includes FAILED_REJECTED
//             navTabDiscardedCount: filteredAllProposals.filter(p =>
//                 p.status === ProposalStatus.FAILED_REJECTED
//             ).length,
//         };
//     }, [filteredAllProposals]);

//     const {
//         [ProposalCategory.NEEDS_APPROVAL]: needsApprovalCount,
//         [ProposalCategory.READY_TO_EXECUTE]: readyToExecuteCount,
//         [ProposalCategory.DISCARDED]: discardedCount,
//         navTabDiscardedCount
//     } = categoryCounts;

//     // Pagination calculations
//     const totalPages = Math.ceil(filteredProposals.length / ITEMS_PER_PAGE);
//     const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//     const endIndex = startIndex + ITEMS_PER_PAGE;
//     const paginatedProposals = filteredProposals.slice(startIndex, endIndex);

//     // Reset to page 1 if current page exceeds total pages after filtering
//     useEffect(() => {
//         if (currentPage > totalPages && totalPages > 0) {
//             setCurrentPage(1);
//         }
//     }, [currentPage, totalPages]);

//     // Get all possible options for a field (status removed)
//     const getAllOptions = (fieldKey: string): FilterDropdownOption[] => {
//         switch (fieldKey) {
//             case 'wallet':
//                 return walletOptions;
//             case 'network':
//                 return networkOptions;
//             case 'address':
//                 return addressOptions;
//             case 'classification':
//                 return classificationOptions;
//             default:
//                 return [];
//         }
//     };

//     // Get available options for a field
//     const getAvailableOptions = (fieldKey: string): FilterDropdownOption[] => {
//         const allOptions = getAllOptions(fieldKey);

//         if (cleanedFilterCriteria.length === 0) {
//             return allOptions;
//         }

//         // For simplicity, return all options (you can implement availability logic if needed)
//         return allOptions;
//     };

//     // Define filter fields (status removed)
//     const filterFields: FilterField[] = useMemo(() => [
//         {
//             key: 'wallet',
//             label: 'Wallet',
//             type: 'multiselect',
//             options: walletOptions,
//             groups: walletGroups,
//             icon: <VaultIcon className="w-4 h-4" />
//         },
//         {
//             key: 'network',
//             label: 'Network',
//             type: 'multiselect',
//             options: networkOptions,
//             icon: <NetworkIcon className="w-4 h-4" />
//         },
//         {
//             key: 'address',
//             label: 'Address',
//             type: 'multiselect',
//             options: addressOptions,
//             icon: <AddressIcon className="w-4 h-4" />
//         },
//         {
//             key: 'classification',
//             label: 'Classification',
//             type: 'multiselect',
//             options: classificationOptions,
//             icon: <TrackedWalletIcon className="w-4 h-4" />
//         }
//     ], [walletOptions, networkOptions, addressOptions, classificationOptions]);

//     const hasActiveFilters = cleanedFilterCriteria.length > 0;

//     // Get active filter fields
//     const activeFilterFields = useMemo(() => {
//         return cleanedFilterCriteria.map(criterion => {
//             const field = filterFields.find(f => f.key === criterion.field);
//             return field ? { field, criterion } : null;
//         }).filter(Boolean) as { field: FilterField; criterion: FilterCriterion }[];
//     }, [cleanedFilterCriteria, filterFields]);

//     const clearSearch = () => {
//         setSearchQuery('');
//         setCurrentPage(1);
//     };

//     // Add ref for search input
//     const searchInputRef = useRef<HTMLInputElement>(null);

//     useEffect(() => {
//         const handleKeyDown = (e: KeyboardEvent) => {
//             if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
//                 e.preventDefault();
//                 searchInputRef.current?.focus();
//             }
//             if (e.key === 'Escape' && searchQuery) {
//                 clearSearch();
//             }
//         };

//         document.addEventListener('keydown', handleKeyDown);
//         return () => document.removeEventListener('keydown', handleKeyDown);
//     }, [searchQuery]);

//     return (
//         <div className="flex flex-col w-full max-w-[1040px] mx-auto items-start gap-16 flex-[1_0_0]">
//             <div className="flex items-end gap-2.5 self-stretch pt-[52px]">
//                 <h1 className="text-[#F8FCFF] font-[Figtree] text-[26px] not-italic font-medium leading-[normal] tracking-[1.04px]">Proposals</h1>
//                 <div className="relative">
//                     <div className="flex w-80 items-center gap-2 rounded-md border-[0.5px] border-solid border-[#F8FCFF]/24 bg-[#F8FCFF]/02 px-3 py-2 transition-all duration-150 ease-in-out hover:border-[#F8FCFF]/48 focus-within:border-[#26C9C9] focus-within:bg-[#F8FCFF]/08">
//                         <SearchIcon className="h-4 w-4 text-[#F8FCFF]/60" />
//                         <input
//                             ref={searchInputRef}
//                             type="text"
//                             placeholder="Search proposals, addresses, hashes, classifications..."
//                             value={searchQuery}
//                             onChange={(e) => {
//                                 setSearchQuery(e.target.value);
//                                 setCurrentPage(1);
//                             }}
//                             className="flex-1 bg-transparent text-[#F8FCFF] placeholder-[#F8FCFF]/40 font-[Geist] text-sm font-light outline-none"
//                         />
//                         {searchQuery && (
//                             <button
//                                 onClick={clearSearch}
//                                 className="flex h-4 w-4 items-center justify-center rounded-full bg-[#F8FCFF]/20 text-[#F8FCFF]/60 hover:bg-[#F8FCFF]/30 hover:text-[#F8FCFF]/80 transition-colors"
//                             >
//                                 ×
//                             </button>
//                         )}
//                     </div>
//                     {/* Search results count badge */}
//                     {searchQuery && (
//                         <div className="absolute -top-2 -right-2">
//                             <div className="rounded-full bg-[#26C9C9] px-2 py-1">
//                                 <span className="text-[#0A1A1F] font-[Geist] text-xs font-medium">
//                                     {filteredAllProposals.length}
//                                 </span>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             <div className="flex flex-col items-start gap-4 self-stretch">
//                 {/* Filters and Pagination */}
//                 <div className="flex items-start gap-8 self-stretch">
//                     <div className="flex items-start gap-5 self-stretch">
//                         <div>
//                             <MultiLevelFilter
//                                 fields={filterFields}
//                                 criteria={cleanedFilterCriteria}
//                                 onCriteriaChange={setFilterCriteria}
//                                 label="Apply filters"
//                             />
//                         </div>
//                         <div className="flex gap-4">
//                             {activeFilterFields.map(({ field, criterion }) => (
//                                 <div key={field.key}>
//                                     <FilterDropdown
//                                         options={getAvailableOptions(field.key)}
//                                         selectedValues={getSelectedValuesForField(field.key)}
//                                         onSelectionChange={(values) => updateFieldCriteria(field.key, values)}
//                                         label={field.label}
//                                         buttonIcon={field.icon}
//                                         groups={field.groups}
//                                     />
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                     <div className={`flex item ${hasActiveFilters ? "justify-between" : "justify-end"} items-center flex-[1_0_0] h-7`}>
//                         {hasActiveFilters && (
//                             <button
//                                 onClick={() => {
//                                     setFilterCriteria([]);
//                                     setCurrentPage(1);
//                                 }}
//                                 className="flex items-center flex-shrink-0 gap-1 pt-[3px] pr-[8px] pb-[3px] pl-[8px] rounded-full bg-[#F8FCFF]/16 hover:bg-[#F8FCFF]/16 border-solid border-[1px] border-[#F8FCFF]/32 hover:border-[#F8FCFF]/64"
//                             >
//                                 <span className="font-[Geist] text-sm">
//                                     Clear all
//                                 </span>
//                             </button>
//                         )}
//                     </div>
//                 </div>


//                 <div className="flex flex-col">
//                     {/* Tabs */}
//                     <div className="flex justify-between items-center">
//                         <div className="flex items-center gap-8 self-stretch border-b-0.8 border-[#1F2122]">
//                             <NavTab
//                                 title="Needs approval"
//                                 titleCount={categoryCounts[ProposalCategory.NEEDS_APPROVAL]}
//                                 titleColor="cyan"
//                                 subtitles={[]}
//                                 isActive={activeTab === ProposalCategory.NEEDS_APPROVAL}
//                                 onClick={() => {
//                                     setActiveTab(ProposalCategory.NEEDS_APPROVAL);
//                                     setCurrentPage(1);
//                                 }}
//                             />
//                             <NavTab
//                                 title="Ready to execute"
//                                 titleCount={categoryCounts[ProposalCategory.READY_TO_EXECUTE]}
//                                 titleColor="white"
//                                 subtitles={[]}
//                                 isActive={activeTab === ProposalCategory.READY_TO_EXECUTE}
//                                 onClick={() => {
//                                     setActiveTab(ProposalCategory.READY_TO_EXECUTE);
//                                     setCurrentPage(1);
//                                 }}
//                             />
//                             <NavTab
//                                 title="Discarded"
//                                 titleCount={navTabDiscardedCount}
//                                 titleColor="red"
//                                 subtitles={[]}
//                                 isActive={activeTab === ProposalCategory.DISCARDED}
//                                 onClick={() => {
//                                     setActiveTab(ProposalCategory.DISCARDED);
//                                     setCurrentPage(1);
//                                 }}
//                             />
//                         </div>



//                         {/* pagination options */}
//                         <div className="flex gap-2 items-center justify-end flex-grow">
//                             {totalPages > 1 && (
//                                 <PageSelector
//                                     currentPage={currentPage}
//                                     totalPages={totalPages}
//                                     onPageChange={setCurrentPage}
//                                 />
//                             )}
//                             {totalPages > 1 && (
//                                 <span className="text-[#E7E8E9] text-sm not-italic font-light leading-[normal] tracking-[0.48px] opacity-80">
//                                     {startIndex + 1}-{Math.min(endIndex, filteredProposals.length)} of {filteredProposals.length}
//                                 </span>
//                             )}
//                             {totalPages === 1 && (
//                                 <span className="text-[#E7E8E9] text-sm not-italic font-light leading-[normal] tracking-[0.48px] opacity-80">
//                                     Showing all {filteredProposals.length} proposals
//                                 </span>
//                             )}
//                             {totalPages > 1 && (
//                                 <div className="flex gap-2 items-center justify-end">
//                                     <IconButton
//                                         size="sm"
//                                         status="neutral"
//                                         icon={<ChevronLeftIcon />}
//                                         onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//                                         disabled={currentPage === 1}
//                                         className={currentPage === 1 ? "opacity-40 cursor-not-allowed" : ""}
//                                     />
//                                     <IconButton
//                                         size="sm"
//                                         status="neutral"
//                                         icon={<ChevronRightIcon />}
//                                         onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
//                                         disabled={currentPage === totalPages}
//                                         className={currentPage === totalPages ? "opacity-40 cursor-not-allowed" : ""}
//                                     />
//                                 </div>
//                             )}
//                         </div>

//                     </div>

//                     <div className="flex flex-col gap-4">
//                         <div className="flex flex-col">
//                             <div className="group/group flex w-full max-w-[1040px] mx-auto flex pt-[10px] pr-[16px] pb-[10px] pl-[8px] items-center gap-4 self-stretch bg-[#18191B]">
//                                 <span className="w-[154px] text-[#F8FCFF] opacity-82 font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px]">Initiated</span>
//                                 <span className="w-[160px] text-[#F8FCFF] opacity-82 font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px]">Wallet & Network</span>
//                                 <span className="w-[160px] text-[#F8FCFF] opacity-82 font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px]">To</span>
//                                 <span className="w-[160px] text-[#F8FCFF] opacity-82 font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px]">Tokens</span>
//                                 <span className="w-[160px] text-[#F8FCFF] opacity-82 font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px]">Classification</span>
//                                 <span className="w-[150px] text-[#F8FCFF] opacity-82 font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px]">Status</span>
//                             </div>


//                             <ProposalList
//                                 proposals={paginatedProposals}
//                                 addresses={addresses}
//                                 uniqueClassifications={uniqueClassifications}
//                             />
//                         </div>
//                         <div className="flex gap-2 items-center justify-end flex-grow">
//                             {totalPages > 1 && (
//                                 <PageSelector
//                                     currentPage={currentPage}
//                                     totalPages={totalPages}
//                                     onPageChange={setCurrentPage}
//                                 />
//                             )}
//                             {totalPages > 1 && (
//                                 <span className="text-[#E7E8E9] text-sm not-italic font-light leading-[normal] tracking-[0.48px] opacity-80">
//                                     {startIndex + 1}-{Math.min(endIndex, filteredProposals.length)} of {filteredProposals.length}
//                                 </span>
//                             )}
//                             {totalPages === 1 && (
//                                 <span className="text-[#E7E8E9] text-sm not-italic font-light leading-[normal] tracking-[0.48px] opacity-80">
//                                     Showing all {filteredProposals.length} proposals
//                                 </span>
//                             )}
//                             {totalPages > 1 && (
//                                 <div className="flex gap-2 items-center justify-end">
//                                     <IconButton
//                                         size="sm"
//                                         status="neutral"
//                                         icon={<ChevronLeftIcon />}
//                                         onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//                                         disabled={currentPage === 1}
//                                         className={currentPage === 1 ? "opacity-40 cursor-not-allowed" : ""}
//                                     />
//                                     <IconButton
//                                         size="sm"
//                                         status="neutral"
//                                         icon={<ChevronRightIcon />}
//                                         onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
//                                         disabled={currentPage === totalPages}
//                                         className={currentPage === totalPages ? "opacity-40 cursor-not-allowed" : ""}
//                                     />
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }









// ProposalListClient.tsx
"use client"
import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { Proposal, ProposalCategory, ProposalStatus } from "./types";
import { AddressCardProps } from "./../../address-book/addresses/types";
import ProposalList from "./ProposalList";
import NavTab from "../../components/buttons/NavTab";
import MultiLevelFilter, { FilterCriterion, FilterField, FilterDropdownOption } from "./../../components/filters/ComplexFilter";
import FilterDropdown from "./../../components/filters/FilterDropdown";
import IconButton from "./../../components/buttons/IconButton";

// Import icons
import {
    SearchIcon,
    VaultIcon,
    GnosisSafeIcon,
    TrackedWalletIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    AddressIcon,
    NetworkIcon,
    BSCIcon,
    EthereumIcon,
    GnosisIcon,
    OPTIMISMIcon,
    PolygonIcon,
    SOLIcon,
    SmallArrowDown
} from "./../../components/icons";

interface ProposalListProps {
    proposals: Proposal[];
    addresses: AddressCardProps[];
    uniqueClassifications: string[];
    initialSearchQuery?: string;
    initialPage?: number;
    initialWalletFilter?: string; // ADD THIS LINE
    initialTab?: ProposalCategory; // ADD THIS LINE
    onSearchChange?: (query: string) => void;
}

// Function to categorize proposals based on their status
function getProposalCategory(status: ProposalStatus): ProposalCategory {
    switch (status) {
        case ProposalStatus.ACTION_REQUIRED:
        case ProposalStatus.NO_ACTION:
        case ProposalStatus.ACTIONED:
            return ProposalCategory.NEEDS_APPROVAL;

        case ProposalStatus.READY:
        case ProposalStatus.FAILED:
        case ProposalStatus.EXECUTING:
        case ProposalStatus.AWAITING_NONCE:
            return ProposalCategory.READY_TO_EXECUTE;

        case ProposalStatus.DECLINED:
        case ProposalStatus.FAILED_REJECTED:
            return ProposalCategory.DISCARDED;

        default:
            return ProposalCategory.NEEDS_APPROVAL;
    }
}

// Define wallet groups
const walletGroups = [
    { key: '1', label: 'Vaults' },
    { key: '2', label: 'Gnosis Safes' },
    { key: '3', label: 'Tracked Wallets' },
];

const ITEMS_PER_PAGE = 25;

const PageSelector = ({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (page: number) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <div
                className="group/dropdown flex py-[2px] px-[8px] items-center gap-[6px] rounded-md border-[0.5px] border-solid border-[#F8FCFF]/24 bg-[#F8FCFF]/02 hover:border-[#F8FCFF] hover:bg-[#F8FCFF]/16 hover:cursor-pointer transition-all duration-150 ease-in-out"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-light leading-[normal] tracking-[0.7px] group-hover/dropdown:text-[#FFFFFF]">
                    Pg. {currentPage}
                </span>
                <SmallArrowDown className="h-[16px] w-[16px] opacity-80 group-hover/dropdown:text-[#FFFFFF]" />
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-32 rounded-md border border-[#F8FCFF]/24 bg-[#1E2A34] shadow-lg z-50 max-h-60 overflow-y-auto">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <div
                            key={page}
                            className={`px-3 py-2 text-sm cursor-pointer transition-colors duration-150 ${page === currentPage
                                ? 'bg-[#26C9C9]/20 text-[#26C9C9] font-medium'
                                : 'text-[#F8FCFF] hover:bg-[#26C9C9]/20 hover:text-[#26C9C9]'
                                }`}
                            onClick={() => {
                                onPageChange(page);
                                setIsOpen(false);
                            }}
                        >
                            Pg. {page}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Wallet icon renderer
const renderWalletIcon = (walletType: number) => {
    switch (walletType) {
        case 1:
            return <VaultIcon className="w-4 h-4 shrink-0 aspect-square" />;
        case 2:
            return <GnosisSafeIcon className="w-4 h-4 shrink-0 aspect-square" />;
        case 3:
            return <TrackedWalletIcon className="w-4 h-4 shrink-0 aspect-square" />;
        default:
            return null;
    }
};

const getBlockchainIcon = (blockchainName: string) => {
    switch (blockchainName) {
        case "BSC":
            return <BSCIcon className="w-4 h-4 shrink-0" />;
        case "Ethereum":
            return <EthereumIcon className="w-4 h-4 shrink-0" />;
        case "Gnosis chain":
            return <GnosisIcon className="w-4 h-4 shrink-0" />;
        case "Optimism":
            return <OPTIMISMIcon className="w-4 h-4 shrink-0" />;
        case "Polygon":
            return <PolygonIcon className="w-4 h-4 shrink-0" />;
        case "Solana":
            return <SOLIcon className="w-4 h-4 shrink-0" />;
        default:
            return null;
    }
};

export default function ProposalListClient({
    proposals,
    addresses,
    uniqueClassifications,
    initialSearchQuery = '',
    initialPage = 1,
    initialWalletFilter,
    initialTab
}: ProposalListProps) {
    const [activeTab, setActiveTab] = useState<ProposalCategory>(
        initialTab || ProposalCategory.NEEDS_APPROVAL
    );

    const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
    const [filterCriteria, setFilterCriteria] = useState<FilterCriterion[]>([]);
    const [currentPage, setCurrentPage] = useState(initialPage);

    // Sync search query when initialSearchQuery changes (from URL)
    useEffect(() => {
        setSearchQuery(initialSearchQuery);
    }, [initialSearchQuery]);

    // Sync current page when initialPage changes (from URL)
    useEffect(() => {
        setCurrentPage(initialPage);
    }, [initialPage]);

    useEffect(() => {
        if (initialTab && initialTab !== activeTab) {
            setActiveTab(initialTab);
        }
    }, [initialTab, activeTab]); // Added activeTab to dependencies

    // Search function for proposals (status removed)
    const searchProposals = useCallback((proposal: Proposal, query: string): boolean => {
        if (!query.trim()) return true;

        const searchTerm = query.toLowerCase().trim();

        // Helper function to safely check if a value contains the search term
        const checkValue = (value: unknown): boolean => {
            if (!value) return false;
            if (typeof value === 'string') {
                return value.toLowerCase().includes(searchTerm);
            }
            return false;
        };

        // Search in basic string fields (status removed)
        if (checkValue(proposal.id) || // Proposal hash/ID
            checkValue(proposal.wallet) ||
            checkValue(proposal.classification) ||
            checkValue(proposal.initiator)) {
            return true;
        }

        // Search in recipients/addresses - handle different formats
        if (proposal.recipients) {
            // Case 1: recipients is a string (raw address)
            if (typeof proposal.recipients === 'string') {
                if (checkValue(proposal.recipients)) {
                    return true;
                }
            }
            // Case 2: recipients is an array (multi-recipient)
            else if (Array.isArray(proposal.recipients)) {
                for (const recipient of proposal.recipients) {
                    // Check if recipient has addressId and look up address name
                    if (recipient.addressId) {
                        const addressEntry = addresses.find(addr => addr.id === recipient.addressId);
                        if (addressEntry?.name && checkValue(addressEntry.name)) {
                            return true;
                        }
                    }
                    // Check raw address in toAddress
                    if (recipient.toAddress && checkValue(recipient.toAddress)) {
                        return true;
                    }
                }
            }
            // Case 3: recipients is an object (single recipient with addressId)
            else if (typeof proposal.recipients === 'object') {
                const recipient = proposal.recipients;

                // Check if recipient has addressId and look up address name
                if (recipient.addressId) {
                    const addressEntry = addresses.find(addr => addr.id === recipient.addressId);
                    if (addressEntry?.name && checkValue(addressEntry.name)) {
                        return true;
                    }
                }
                // Check raw address in toAddress
                if (recipient.toAddress && checkValue(recipient.toAddress)) {
                    return true;
                }
            }
        }

        return false;
    }, [addresses]);

    // Sort proposals by timestamp (newest first)
    const sortedProposals = useMemo(() => {
        return [...proposals].sort((a, b) => {
            // Assuming proposals have a timestamp field like transactions
            const dateA = new Date(a.timestamp).getTime();
            const dateB = new Date(b.timestamp).getTime();
            return dateB - dateA; // Descending order (newest first)
        });
    }, [proposals]);

    // Group proposals by date
    const proposalsByDate = useMemo(() => {
        const groups: { [key: string]: Proposal[] } = {};

        sortedProposals.forEach(proposal => {
            const dateKey = new Date(proposal.timestamp).toDateString(); // This ignores time, only uses date

            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }

            groups[dateKey].push(proposal);
        });

        return groups;
    }, [sortedProposals]);

    // Flatten proposals with date grouping info for the list
    const proposalsWithDateInfo = useMemo(() => {
        const result: Array<Proposal & { showDate: boolean; isFirstOfDate: boolean }> = [];

        Object.values(proposalsByDate).forEach((proposals) => {
            proposals.forEach((proposal, index) => {
                result.push({
                    ...proposal,
                    showDate: index === 0, // Only show date for first proposal of the day
                    isFirstOfDate: index === 0
                });
            });
        });

        return result;
    }, [proposalsByDate]);

    // Categorize proposals
    const categorizedProposals = useMemo(() => {
        return proposalsWithDateInfo.map(proposal => ({
            ...proposal,
            category: getProposalCategory(proposal.status)
        }));
    }, [proposalsWithDateInfo]);

    // Clean up filter criteria - remove any with empty values
    const cleanedFilterCriteria = useMemo(() => {
        return filterCriteria.filter(criterion => {
            if (Array.isArray(criterion.value)) {
                return criterion.value.length > 0;
            }
            return criterion.value !== '' && criterion.value != null;
        });
    }, [filterCriteria]);

    // Helper function to get proposal values for filtering (status removed)
    const getProposalValue = (proposal: Proposal, field: string): string | string[] => {
        switch (field) {
            case 'wallet':
                return proposal.wallet?.toString() || '';
            case 'network':
                return proposal.blockchain || '';
            case 'address':
                // Handle address search for filtering
                if (Array.isArray(proposal.recipients)) {
                    const addresses = proposal.recipients
                        .map(r => {
                            if (r.addressId) {
                                return r.addressId.toString();
                            }
                            return r.toAddress || '';
                        })
                        .filter((addr): addr is string => Boolean(addr));
                    return addresses;
                } else if (typeof proposal.recipients === 'string') {
                    // Handle case where recipients is a raw address string
                    return proposal.recipients;
                } else if (!Array.isArray(proposal.recipients) && proposal.recipients) {
                    // Single recipient object
                    if (proposal.recipients.addressId) {
                        return proposal.recipients.addressId.toString();
                    }
                    return proposal.recipients.toAddress || '';
                }
                return '';
            case 'classification':
                return proposal.classification || '';
            default:
                return '';
        }
    };

    // Get selected values for a specific field from filter criteria
    const getSelectedValuesForField = (fieldKey: string): string[] => {
        const criterion = filterCriteria.find(c => c.field === fieldKey);
        if (!criterion) return [];

        if (Array.isArray(criterion.value)) {
            return criterion.value.map(v => String(v));
        }
        return [String(criterion.value)];
    };

    // Update filter criteria for a specific field
    const updateFieldCriteria = (fieldKey: string, newValues: string[]) => {
        setFilterCriteria(prev => {
            const existingCriterionIndex = prev.findIndex(c => c.field === fieldKey);

            if (newValues.length === 0) {
                return prev.filter(c => c.field !== fieldKey);
            } else {
                const newCriterion: FilterCriterion = {
                    id: existingCriterionIndex >= 0 ? prev[existingCriterionIndex].id : `criterion-${Date.now()}`,
                    field: fieldKey,
                    operator: 'equals',
                    value: newValues,
                };

                if (existingCriterionIndex >= 0) {
                    return prev.map((c, index) =>
                        index === existingCriterionIndex ? newCriterion : c
                    );
                } else {
                    return [...prev, newCriterion];
                }
            }
        });
        setCurrentPage(1); // Reset to first page when filters change
    };

    // Get wallet options
    const walletOptions = useMemo((): FilterDropdownOption[] => {
        const walletMap = new Map();

        proposals.forEach(proposal => {
            if (proposal.wallet && proposal.wallet && !walletMap.has(proposal.wallet)) {
                walletMap.set(proposal.wallet, {
                    id: proposal.wallet,
                    name: proposal.wallet,
                    walletType: proposal.walletType,
                });
            }
        });

        const uniqueWallets = Array.from(walletMap.values())
            .sort((a, b) => a.name.localeCompare(b.name));

        return uniqueWallets.map(wallet => ({
            value: wallet.id.toString(),
            id: wallet.id.toString(),
            searchText: wallet.name.toLowerCase(),
            groupKey: `${wallet.walletType}`,
            display: (
                <div className="flex items-center gap-3 flex-1">
                    <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                        {renderWalletIcon(wallet.walletType)}
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-[#F8FCFF] font-[Geist] text-sm font-medium truncate">
                            {wallet.name}
                        </span>
                    </div>
                </div>
            ),
            displayProps: {
                fullName: wallet.name,
                icon: renderWalletIcon(wallet.walletType)
            }
        }));
    }, [proposals]);

    useEffect(() => {
        if (initialWalletFilter && walletOptions.length > 0) {
            // Find the wallet that matches the wallet name from URL
            const matchingWallet = walletOptions.find(
                option => option.displayProps.fullName.toLowerCase() === initialWalletFilter.toLowerCase()
            );

            if (matchingWallet) {
                // Check if this filter isn't already applied
                const existingWalletFilter = filterCriteria.find(c => c.field === 'wallet');
                const isAlreadyFiltered = existingWalletFilter?.value.includes(matchingWallet.value);

                if (!isAlreadyFiltered) {
                    // Apply the wallet filter using the existing updateFieldCriteria function
                    updateFieldCriteria('wallet', [matchingWallet.value]);
                }
            }
        }
    }, [initialWalletFilter, walletOptions, filterCriteria]);

    // Get network options
    const networkOptions = useMemo((): FilterDropdownOption[] =>
        Array.from(new Set(proposals.map(proposal => proposal.blockchain)))
            .filter((network): network is string => Boolean(network))
            .map(network => ({
                value: network,
                id: network,
                searchText: network.toLowerCase(),
                display: (
                    <div className="flex items-center gap-3 flex-1">
                        <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                            <NetworkIcon className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                            <span className="text-[#F8FCFF] font-[Geist] text-sm font-medium truncate">
                                {network}
                            </span>
                        </div>
                    </div>
                ),
                displayProps: {
                    fullName: network,
                    icon: getBlockchainIcon(network)
                }
            })), [proposals]);

    // Get address options
    const addressOptions = useMemo((): FilterDropdownOption[] => {
        const addressOptions: FilterDropdownOption[] = [];
        const addedAddresses = new Set<string>();

        proposals.forEach(proposal => {
            // Handle multi-recipient proposals
            if (Array.isArray(proposal.recipients)) {
                proposal.recipients.forEach(recipient => {
                    if (recipient.addressId) {
                        const addressEntry = addresses.find(addr => addr.id === recipient.addressId);
                        if (addressEntry && !addedAddresses.has(addressEntry.id.toString())) {
                            addedAddresses.add(addressEntry.id.toString());
                            addressOptions.push({
                                value: addressEntry.id.toString(),
                                id: addressEntry.id.toString(),
                                searchText: addressEntry.name.toLowerCase(),
                                display: (
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                                            <AddressIcon className="w-4 h-4" />
                                        </div>
                                        <div className="flex flex-col flex-1 min-w-0">
                                            <span className="text-[#F8FCFF] font-[Geist] text-sm font-medium truncate">
                                                {addressEntry.name}
                                            </span>
                                        </div>
                                    </div>
                                ),
                                displayProps: {
                                    fullName: addressEntry.name,
                                    icon: <AddressIcon className="w-4 h-4" />
                                }
                            });
                        }
                    }
                });
            }
            // Handle single recipient object with addressId
            else if (!Array.isArray(proposal.recipients) && proposal.recipients && typeof proposal.recipients === 'object' && proposal.recipients.addressId) {
                const addressId = proposal.recipients.addressId;
                const addressEntry = addresses.find(addr => addr.id === addressId);
                if (addressEntry && !addedAddresses.has(addressEntry.id.toString())) {
                    addedAddresses.add(addressEntry.id.toString());
                    addressOptions.push({
                        value: addressEntry.id.toString(),
                        id: addressEntry.id.toString(),
                        searchText: addressEntry.name.toLowerCase(),
                        display: (
                            <div className="flex items-center gap-3 flex-1">
                                <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                                    <AddressIcon className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col flex-1 min-w-0">
                                    <span className="text-[#F8FCFF] font-[Geist] text-sm font-medium truncate">
                                        {addressEntry.name}
                                    </span>
                                </div>
                            </div>
                        ),
                        displayProps: {
                            fullName: addressEntry.name,
                            icon: <AddressIcon className="w-4 h-4" />
                        }
                    });
                }
            }
        });

        return addressOptions.sort((a, b) => a.displayProps.fullName.localeCompare(b.displayProps.fullName));
    }, [proposals, addresses]);

    // Get classification options
    const classificationOptions = useMemo((): FilterDropdownOption[] =>
        uniqueClassifications
            .filter((classification): classification is string => Boolean(classification))
            .map(classification => ({
                value: classification,
                id: classification,
                searchText: classification.toLowerCase(),
                display: (
                    <div className="flex items-center gap-3 flex-1">
                        <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                            <TrackedWalletIcon className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                            <span className="text-[#F8FCFF] font-[Geist] text-sm font-medium truncate">
                                {classification}
                            </span>
                        </div>
                    </div>
                ),
                displayProps: {
                    fullName: classification,
                }
            })), [uniqueClassifications]);

    // Apply search and filters to all proposals (without tab filtering)
    const filteredAllProposals = useMemo(() => {
        let filtered = categorizedProposals;

        // Apply search filter
        if (searchQuery.trim()) {
            filtered = filtered.filter(proposal =>
                searchProposals(proposal, searchQuery)
            );
        }

        // Apply filter criteria
        if (cleanedFilterCriteria.length > 0) {
            filtered = filtered.filter(proposal => {
                return cleanedFilterCriteria.every(criterion => {
                    const value = getProposalValue(proposal, criterion.field);

                    if (Array.isArray(criterion.value)) {
                        if (Array.isArray(value)) {
                            return value.some(v => criterion.value.includes(v.toString()));
                        } else {
                            return criterion.value.includes(value.toString());
                        }
                    }

                    if (Array.isArray(value)) {
                        return value.includes(criterion.value);
                    }

                    return value.toString() === criterion.value;
                });
            });
        }

        return filtered;
    }, [categorizedProposals, searchQuery, cleanedFilterCriteria, searchProposals]);

    // Filter proposals based on active tab, search, and filter criteria
    const filteredProposals = useMemo(() => {
        return filteredAllProposals.filter(proposal => proposal.category === activeTab);
    }, [filteredAllProposals, activeTab]);

    // Count proposals for each category with specific logic - BASED ON FILTERED RESULTS
    const categoryCounts = useMemo(() => {
        return {
            // Needs approval: Only count ACTION_REQUIRED from filtered results
            [ProposalCategory.NEEDS_APPROVAL]: filteredAllProposals.filter(p =>
                p.status === ProposalStatus.ACTION_REQUIRED
            ).length,

            // Ready to execute: Count of FAILED + READY from filtered results
            [ProposalCategory.READY_TO_EXECUTE]: filteredAllProposals.filter(p =>
                p.status === ProposalStatus.FAILED ||
                p.status === ProposalStatus.READY
            ).length,

            // Discarded: Count all discarded proposals from filtered results
            [ProposalCategory.DISCARDED]: filteredAllProposals.filter(p =>
                p.category === ProposalCategory.DISCARDED
            ).length,

            // NEW: Special count for NavTab that only includes FAILED_REJECTED
            navTabDiscardedCount: filteredAllProposals.filter(p =>
                p.status === ProposalStatus.FAILED_REJECTED
            ).length,
        };
    }, [filteredAllProposals]);

    const { navTabDiscardedCount } = categoryCounts;

    // Pagination calculations
    const totalPages = Math.ceil(filteredProposals.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedProposals = filteredProposals.slice(startIndex, endIndex);

    // Reset to page 1 if current page exceeds total pages after filtering
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(1);
        }
    }, [currentPage, totalPages]);

    // Get all possible options for a field (status removed)
    const getAllOptions = (fieldKey: string): FilterDropdownOption[] => {
        switch (fieldKey) {
            case 'wallet':
                return walletOptions;
            case 'network':
                return networkOptions;
            case 'address':
                return addressOptions;
            case 'classification':
                return classificationOptions;
            default:
                return [];
        }
    };

    // Get available options for a field
    const getAvailableOptions = (fieldKey: string): FilterDropdownOption[] => {
        const allOptions = getAllOptions(fieldKey);

        if (cleanedFilterCriteria.length === 0) {
            return allOptions;
        }

        // For simplicity, return all options (you can implement availability logic if needed)
        return allOptions;
    };

    // Define filter fields (status removed)
    const filterFields: FilterField[] = useMemo(() => [
        {
            key: 'wallet',
            label: 'Wallet',
            type: 'multiselect',
            options: walletOptions,
            groups: walletGroups,
            icon: <VaultIcon className="w-4 h-4" />
        },
        {
            key: 'network',
            label: 'Network',
            type: 'multiselect',
            options: networkOptions,
            icon: <NetworkIcon className="w-4 h-4" />
        },
        {
            key: 'address',
            label: 'Address',
            type: 'multiselect',
            options: addressOptions,
            icon: <AddressIcon className="w-4 h-4" />
        },
        {
            key: 'classification',
            label: 'Classification',
            type: 'multiselect',
            options: classificationOptions,
            icon: <TrackedWalletIcon className="w-4 h-4" />
        }
    ], [walletOptions, networkOptions, addressOptions, classificationOptions]);

    const hasActiveFilters = cleanedFilterCriteria.length > 0;

    // Get active filter fields
    const activeFilterFields = useMemo(() => {
        return cleanedFilterCriteria.map(criterion => {
            const field = filterFields.find(f => f.key === criterion.field);
            return field ? { field } : null;
        }).filter(Boolean) as { field: FilterField }[];
    }, [cleanedFilterCriteria, filterFields]);

    const clearSearch = () => {
        setSearchQuery('');
        setCurrentPage(1);
    };

    // Add ref for search input
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
            if (e.key === 'Escape' && searchQuery) {
                clearSearch();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [searchQuery]);

    return (
        <div className="flex flex-col w-full max-w-[1040px] mx-auto items-start gap-16 flex-[1_0_0]">
            <div className="flex items-end gap-2.5 self-stretch pt-[52px]">
                <h1 className="text-[#F8FCFF] font-[Figtree] text-[26px] not-italic font-medium leading-[normal] tracking-[1.04px]">Proposals</h1>
                <div className="relative">
                    <div className="flex w-80 items-center gap-2 rounded-md border-[0.5px] border-solid border-[#F8FCFF]/24 bg-[#F8FCFF]/02 px-3 py-2 transition-all duration-150 ease-in-out hover:border-[#F8FCFF]/48 focus-within:border-[#26C9C9] focus-within:bg-[#F8FCFF]/08">
                        <SearchIcon className="h-4 w-4 text-[#F8FCFF]/60" />
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search proposals, addresses, hashes, classifications..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="flex-1 bg-transparent text-[#F8FCFF] placeholder-[#F8FCFF]/40 font-[Geist] text-sm font-light outline-none"
                        />
                        {searchQuery && (
                            <button
                                onClick={clearSearch}
                                className="flex h-4 w-4 items-center justify-center rounded-full bg-[#F8FCFF]/20 text-[#F8FCFF]/60 hover:bg-[#F8FCFF]/30 hover:text-[#F8FCFF]/80 transition-colors"
                            >
                                ×
                            </button>
                        )}
                    </div>
                    {/* Search results count badge */}
                    {searchQuery && (
                        <div className="absolute -top-2 -right-2">
                            <div className="rounded-full bg-[#26C9C9] px-2 py-1">
                                <span className="text-[#0A1A1F] font-[Geist] text-xs font-medium">
                                    {filteredAllProposals.length}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col items-start gap-4 self-stretch">
                {/* Filters and Pagination */}
                <div className="flex items-start gap-8 self-stretch">
                    <div className="flex items-start gap-5 self-stretch">
                        <div>
                            <MultiLevelFilter
                                fields={filterFields}
                                criteria={cleanedFilterCriteria}
                                onCriteriaChange={setFilterCriteria}
                                label="Apply filters"
                            />
                        </div>
                        <div className="flex gap-4">
                            {activeFilterFields.map(({ field }) => (
                                <div key={field.key}>
                                    <FilterDropdown
                                        options={getAvailableOptions(field.key)}
                                        selectedValues={getSelectedValuesForField(field.key)}
                                        onSelectionChange={(values) => updateFieldCriteria(field.key, values)}
                                        label={field.label}
                                        buttonIcon={field.icon}
                                        groups={field.groups}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={`flex item ${hasActiveFilters ? "justify-between" : "justify-end"} items-center flex-[1_0_0] h-7`}>
                        {hasActiveFilters && (
                            <button
                                onClick={() => {
                                    setFilterCriteria([]);
                                    setCurrentPage(1);
                                }}
                                className="flex items-center flex-shrink-0 gap-1 pt-[3px] pr-[8px] pb-[3px] pl-[8px] rounded-full bg-[#F8FCFF]/16 hover:bg-[#F8FCFF]/16 border-solid border-[1px] border-[#F8FCFF]/32 hover:border-[#F8FCFF]/64"
                            >
                                <span className="font-[Geist] text-sm">
                                    Clear all
                                </span>
                            </button>
                        )}
                    </div>
                </div>


                <div className="flex flex-col">
                    {/* Tabs */}
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-8 self-stretch border-b-0.8 border-[#1F2122]">
                            <NavTab
                                title="Needs approval"
                                titleCount={categoryCounts[ProposalCategory.NEEDS_APPROVAL]}
                                titleColor="cyan"
                                subtitles={[]}
                                isActive={activeTab === ProposalCategory.NEEDS_APPROVAL}
                                onClick={() => {
                                    setActiveTab(ProposalCategory.NEEDS_APPROVAL);
                                    setCurrentPage(1);
                                }}
                            />
                            <NavTab
                                title="Ready to execute"
                                titleCount={categoryCounts[ProposalCategory.READY_TO_EXECUTE]}
                                titleColor="white"
                                subtitles={[]}
                                isActive={activeTab === ProposalCategory.READY_TO_EXECUTE}
                                onClick={() => {
                                    setActiveTab(ProposalCategory.READY_TO_EXECUTE);
                                    setCurrentPage(1);
                                }}
                            />
                            <NavTab
                                title="Discarded"
                                titleCount={navTabDiscardedCount}
                                titleColor="red"
                                subtitles={[]}
                                isActive={activeTab === ProposalCategory.DISCARDED}
                                onClick={() => {
                                    setActiveTab(ProposalCategory.DISCARDED);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>



                        {/* pagination options */}
                        <div className="flex gap-2 items-center justify-end flex-grow">
                            {totalPages > 1 && (
                                <PageSelector
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            )}
                            {totalPages > 1 && (
                                <span className="text-[#E7E8E9] text-sm not-italic font-light leading-[normal] tracking-[0.48px] opacity-80">
                                    {startIndex + 1}-{Math.min(endIndex, filteredProposals.length)} of {filteredProposals.length}
                                </span>
                            )}
                            {totalPages === 1 && (
                                <span className="text-[#E7E8E9] text-sm not-italic font-light leading-[normal] tracking-[0.48px] opacity-80">
                                    Showing all {filteredProposals.length} proposals
                                </span>
                            )}
                            {totalPages > 1 && (
                                <div className="flex gap-2 items-center justify-end">
                                    <IconButton
                                        size="sm"
                                        status="neutral"
                                        icon={<ChevronLeftIcon />}
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className={currentPage === 1 ? "opacity-40 cursor-not-allowed" : ""}
                                    />
                                    <IconButton
                                        size="sm"
                                        status="neutral"
                                        icon={<ChevronRightIcon />}
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        className={currentPage === totalPages ? "opacity-40 cursor-not-allowed" : ""}
                                    />
                                </div>
                            )}
                        </div>

                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col">
                            <div className="group/group flex w-full max-w-[1040px] mx-auto flex pt-[10px] pr-[16px] pb-[10px] pl-[8px] items-center gap-4 self-stretch bg-[#18191B]">
                                <span className="w-[154px] text-[#F8FCFF] opacity-82 font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px]">Initiated</span>
                                <span className="w-[160px] text-[#F8FCFF] opacity-82 font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px]">Wallet & Network</span>
                                <span className="w-[160px] text-[#F8FCFF] opacity-82 font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px]">To</span>
                                <span className="w-[160px] text-[#F8FCFF] opacity-82 font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px]">Tokens</span>
                                <span className="w-[160px] text-[#F8FCFF] opacity-82 font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px]">Classification</span>
                                <span className="w-[150px] text-[#F8FCFF] opacity-82 font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px]">Status</span>
                            </div>


                            <ProposalList
                                proposals={paginatedProposals}
                                addresses={addresses}
                                uniqueClassifications={uniqueClassifications}
                            />
                        </div>
                        <div className="flex gap-2 items-center justify-end flex-grow">
                            {totalPages > 1 && (
                                <PageSelector
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            )}
                            {totalPages > 1 && (
                                <span className="text-[#E7E8E9] text-sm not-italic font-light leading-[normal] tracking-[0.48px] opacity-80">
                                    {startIndex + 1}-{Math.min(endIndex, filteredProposals.length)} of {filteredProposals.length}
                                </span>
                            )}
                            {totalPages === 1 && (
                                <span className="text-[#E7E8E9] text-sm not-italic font-light leading-[normal] tracking-[0.48px] opacity-80">
                                    Showing all {filteredProposals.length} proposals
                                </span>
                            )}
                            {totalPages > 1 && (
                                <div className="flex gap-2 items-center justify-end">
                                    <IconButton
                                        size="sm"
                                        status="neutral"
                                        icon={<ChevronLeftIcon />}
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className={currentPage === 1 ? "opacity-40 cursor-not-allowed" : ""}
                                    />
                                    <IconButton
                                        size="sm"
                                        status="neutral"
                                        icon={<ChevronRightIcon />}
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        className={currentPage === totalPages ? "opacity-40 cursor-not-allowed" : ""}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}