"use client"
import { Transaction } from "./types";
import { AddressCardProps } from "./../../address-book/addresses/types";
import TransactionList from "./TransactionList";
import MultiLevelFilter, { FilterCriterion, FilterField, FilterDropdownOption } from "./../../components/filters/ComplexFilter";
import FilterDropdown from "./../../components/filters/FilterDropdown";
import IconButton from "./../../components/buttons/IconButton";
import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import PageSelector from "@/app/components/PageSelector";
import { format } from "date-fns";
import { determineMultirecipients } from "./calculations";

// Import icons
import {
    SearchIcon,
    InteractedArrowIcon,
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
    SOLIcon
} from "./../../components/icons";
import PrimaryButton from "@/app/components/buttons/PrimaryButton";

interface TransactionListProps {
    transactions: Transaction[];
    addresses: AddressCardProps[];
    uniqueClassifications: string[];
    initialSearchQuery?: string;
    initialPage?: number;
    initialWalletFilter?: string; // ADD THIS LINE
    onSearchChange?: (query: string) => void;
}

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

// Define wallet groups
const walletGroups = [
    { key: '1', label: 'Vaults' },
    { key: '2', label: 'Gnosis Safes' },
    { key: '3', label: 'Tracked Wallets' },
];

const ITEMS_PER_PAGE = 25;

export default function TransactionListClient({
    transactions,
    addresses,
    uniqueClassifications,
    initialSearchQuery = '',
    initialPage = 1,
    initialWalletFilter
}: TransactionListProps) {
    const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
    
    const formatRecipientsForCSV = (transaction: Transaction): string => {
    if (!transaction.recipients) return '';

    // Handle multi-recipient transactions
    if (Array.isArray(transaction.recipients)) {
        return transaction.recipients
            .map(recipient => {
                if (recipient.addressId) {
                    const addressEntry = addresses.find(addr => addr.id === recipient.addressId);
                    return addressEntry?.name || recipient.toAddress || '';
                }
                return recipient.toAddress || '';
            })
            .filter(Boolean)
            .join('; ');
    }

    // Handle single recipient object
    if (typeof transaction.recipients === 'object') {
        // CORRECTION: Access the recipient object's properties directly
        if (transaction.recipients.addressId) {
                return determineMultirecipients(transaction.multiRecipient, transaction.recipients, addresses);
        }
        return transaction.recipients.toAddress || '';
    }

    // Handle string recipient
    if (typeof transaction.recipients === 'string') {
        return transaction.recipients;
    }

    return '';
};

    // Function to determine transaction type
    const getTransactionType = (transaction: Transaction): string => {
        if (transaction.incoming && transaction.outgoing) return 'Interacted';
        if (transaction.incoming) return 'Received';
        if (transaction.outgoing) return 'Sent';
        return '';
    };

    // Function to format date for CSV
    const formatDateForCSV = (timestamp: string | number | Date): string => {
        try {
            const date = new Date(timestamp);
            return format(date, 'yyyy-MM-dd HH:mm:ss');
        } catch (error) {
            return '';
        }
    };

    // Function to convert transactions to CSV
    const convertToCSV = (transactions: Transaction[]): string => {
        if (transactions.length === 0) return '';

        // Define CSV headers
        const headers = [
            'Date',
            'Type',
            'Transaction Hash',
            'Wallet',
            'Wallet Type',
            'Network',
            'To/From',
            'In Token Symbol',
            'In Token Amount',
            'In USD Value',
            'Out Token Symbol',
            'Out Token Amount',
            'Out USD Value',
            'Classification',
            'Initiator',
            'Executer'
        ];

        // Convert each transaction to CSV row
        const rows = transactions.map(transaction => {
            const type = getTransactionType(transaction);
            const formattedRecipients = formatRecipientsForCSV(transaction);
            const walletType = transaction.walletType === 1 ? 'Vault' : 
                              transaction.walletType === 2 ? 'Gnosis Safe' : 
                              transaction.walletType === 3 ? 'Tracked Wallet' : '';

            return [
                formatDateForCSV(transaction.timestamp),
                type,
                transaction.id || '',
                transaction.wallet || '',
                walletType,
                transaction.blockchain || '',
                formattedRecipients,
                transaction.inTokenSymbol || '',
                transaction.inTokens?.toString() || '0',
                transaction.incomingUSD?.toString() || '0',
                transaction.outTokenSymbol || '',
                transaction.outTokens?.toString() || '0',
                transaction.outgoingUSD?.toString() || '0',
                transaction.classification || '',
                transaction.initiator || '',
                transaction.executer || ''
            ].map(field => {
                // Escape fields that contain commas, quotes, or newlines
                if (typeof field === 'string' && (field.includes(',') || field.includes('"') || field.includes('\n'))) {
                    return `"${field.replace(/"/g, '""')}"`;
                }
                return field;
            }).join(',');
        });

        // Combine headers and rows
        return [headers.join(','), ...rows].join('\n');
    };

    // Function to trigger CSV download
    const handleExportCSV = () => {
        // Use filteredTransactions for export (all filtered items, not just paginated)
        const csvContent = convertToCSV(filteredTransactions);
        
        if (!csvContent) {
            alert('No data to export');
            return;
        }

        // Create blob and download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const fileName = `transactions_${format(new Date(), 'yyyy-MM-dd_HH-mm')}.csv`;
        
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up
        URL.revokeObjectURL(url);
    };

    // Sync search query when initialSearchQuery changes (from URL)
    useEffect(() => {
        setSearchQuery(initialSearchQuery);
    }, [initialSearchQuery]);

    // Sync current page when initialPage changes (from URL)
    useEffect(() => {
        setCurrentPage(initialPage);
    }, [initialPage]);
    

    const searchTransactions = useCallback((transaction: Transaction, query: string): boolean => {
        if (!query.trim()) return true;

        const searchTerm = query.toLowerCase().trim();

        // Helper function to safely check if a value contains the search term
        const checkValue = (value: string | number | undefined | null): boolean => {
            if (!value) return false;
            if (typeof value === 'string') {
                return value.toLowerCase().includes(searchTerm);
            }
            if (typeof value === 'number') {
                return value.toString().toLowerCase().includes(searchTerm);
            }
            return false;
        };

        // Search in basic string fields
        if (checkValue(transaction.id) || // Transaction hash
            checkValue(transaction.wallet) ||
            checkValue(transaction.classification) ||
            checkValue(transaction.inTokenSymbol) ||
            checkValue(transaction.outTokenSymbol) ||
            checkValue(transaction.executer) ||
            checkValue(transaction.initiator)) {
            return true;
        }

        // Search in recipients - handle all different formats
        if (transaction.recipients) {
            // Case 1: recipients is a string (raw address)
            if (typeof transaction.recipients === 'string') {
                if (checkValue(transaction.recipients)) {
                    return true;
                }
            }
            // Case 2: recipients is an array (multi-recipient)
            else if (Array.isArray(transaction.recipients)) {
                for (const recipient of transaction.recipients) {
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
            else if (typeof transaction.recipients === 'object') {
                const recipient = transaction.recipients;

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

    const sortedTransactions = useMemo(() => {
        return [...transactions].sort((a, b) => {
            // Convert timestamps to Date objects for comparison
            const dateA = new Date(a.timestamp).getTime();
            const dateB = new Date(b.timestamp).getTime();

            // For descending order (newest first)
            return dateB - dateA;
        });
    }, [transactions]);

    // Group transactions by date
    const transactionsByDate = useMemo(() => {
        const groups: { [key: string]: Transaction[] } = {};

        sortedTransactions.forEach(transaction => {
            const dateKey = new Date(transaction.timestamp).toDateString(); // This ignores time, only uses date

            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }

            groups[dateKey].push(transaction);
        });

        return groups;
    }, [sortedTransactions]);
    // Flatten transactions with date grouping info for the list
    const transactionsWithDateInfo = useMemo(() => {
        const result: Array<Transaction & { showDate: boolean; isFirstOfDate: boolean }> = [];

        Object.entries(transactionsByDate).forEach(([dateKey, transactions]) => {
            void dateKey; // Mark as intentionally unused
            transactions.forEach((transaction, index) => {
                result.push({
                    ...transaction,
                    showDate: index === 0, // Only show date for first transaction of the day
                    isFirstOfDate: index === 0
                });
            });
        });

        return result;
    }, [transactionsByDate]);


    const [filterCriteria, setFilterCriteria] = useState<FilterCriterion[]>([]);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const hasAppliedInitialFilter = useRef(false);


    // Clean up filter criteria - remove any with empty values
    const cleanedFilterCriteria = useMemo(() => {
        return filterCriteria.filter(criterion => {
            if (Array.isArray(criterion.value)) {
                return criterion.value.length > 0;
            }
            return criterion.value !== '' && criterion.value != null;
        });
    }, [filterCriteria]);


    // Helper function to get transaction values for filtering
    const getTransactionValue = (transaction: Transaction, field: string): string | string[] => {
        switch (field) {
            case 'type':
                if (transaction.incoming && transaction.outgoing) return 'interacted';
                if (transaction.incoming) return 'received';
                if (transaction.outgoing) return 'sent';
                return '';
            case 'wallet':
                return transaction.walletId?.toString() || '';
            case 'network':
                return transaction.blockchain || '';
            case 'address':
                // Handle address search for filtering
                if (transaction.multiRecipient && Array.isArray(transaction.recipients)) {
                    return transaction.recipients
                        .map(r => {
                            if (r.addressId) {
                                return r.addressId.toString();
                            }
                            return r.toAddress || '';
                        })
                        .filter((addr): addr is string => Boolean(addr));
                } else if (typeof transaction.recipients === 'string') {
                    // Handle case where recipients is a raw address string
                    return transaction.recipients;
                } else if (!Array.isArray(transaction.recipients) && transaction.recipients) {
                    // Single recipient object
                    if (transaction.recipients.addressId) {
                        return transaction.recipients.addressId.toString();
                    }
                    return transaction.recipients.toAddress || '';
                }
                return '';
            case 'classification':
                return transaction.classification || '';
            default:
                const val = transaction[field as keyof Transaction];
                if (Array.isArray(val)) {
                    return val.map(v => v?.toString() || '');
                }
                return val?.toString() || '';
        }
    };

    // Get selected values for a specific field from filter criteria
    const getSelectedValuesForField = (fieldKey: string): string[] => {
        const criterion = filterCriteria.find(c => c.field === fieldKey);
        if (!criterion) return [];

        if (Array.isArray(criterion.value)) {
            return criterion.value;
        }
        return [criterion.value];
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

        transactions.forEach(tx => {
            if (tx.walletId && tx.wallet && !walletMap.has(tx.walletId)) {
                walletMap.set(tx.walletId, {
                    id: tx.walletId,
                    name: tx.wallet,
                    walletType: tx.walletType,
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
    }, [transactions]);

    useEffect(() => {
        if (initialWalletFilter && walletOptions.length > 0 && !hasAppliedInitialFilter.current) {
            // Find the wallet ID that matches the wallet name
            const matchingWallet = walletOptions.find(
                option => option.displayProps.fullName.toLowerCase() === initialWalletFilter.toLowerCase()
            );

            if (matchingWallet) {
                // Set the wallet filter
                updateFieldCriteria('wallet', [matchingWallet.value]);
                hasAppliedInitialFilter.current = true;
            }
        }
    }, [initialWalletFilter, walletOptions]);

    // Get network options
    const networkOptions = useMemo((): FilterDropdownOption[] =>
        Array.from(new Set(transactions.map(tx => tx.blockchain)))
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
            })), [transactions]);

    // Get address options
    const addressOptions = useMemo((): FilterDropdownOption[] => {
        const addressOptions: FilterDropdownOption[] = [];
        const addedAddresses = new Set<string>();

        transactions.forEach(tx => {
            // Handle multi-recipient transactions
            if (tx.multiRecipient && Array.isArray(tx.recipients)) {
                tx.recipients.forEach(recipient => {
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
            else if (!Array.isArray(tx.recipients) && tx.recipients && typeof tx.recipients === 'object' && tx.recipients.addressId) {
                const addressId = tx.recipients.addressId;
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
            // Note: We don't include raw address strings in the filter options since they're not in the address book
        });

        return addressOptions.sort((a, b) => a.displayProps.fullName.localeCompare(b.displayProps.fullName));
    }, [transactions, addresses]);

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

    // Filter transactions based on criteria
    const filteredTransactions = useMemo(() => {
        let filtered = transactionsWithDateInfo;

        // Apply search filter first
        if (searchQuery.trim()) {
            filtered = filtered.filter(transaction =>
                searchTransactions(transaction, searchQuery)
            );
        }

        // Then apply existing filter criteria
        if (cleanedFilterCriteria.length > 0) {
            filtered = filtered.filter(transactionWithInfo => {
                const transaction = transactionWithInfo;
                return cleanedFilterCriteria.every(criterion => {
                    const value = getTransactionValue(transaction, criterion.field);

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
    }, [transactionsWithDateInfo, searchQuery, cleanedFilterCriteria, searchTransactions]);

    // Pagination calculations
    const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

    // Reset to page 1 if current page exceeds total pages after filtering
    if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(1);
    }

    // Reset to page 1 if current page exceeds total pages after filtering
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(1);
        }
    }, [currentPage, totalPages]);

    // Get all possible options for a field
    const getAllOptions = useMemo(() => (fieldKey: string): FilterDropdownOption[] => {
        switch (fieldKey) {
            case 'type':
                return [
                    {
                        value: 'sent',
                        id: 'sent',
                        searchText: 'sent',
                        display: <span>Sent</span>,
                        displayProps: { fullName: 'Sent' },
                    },
                    {
                        value: 'received',
                        id: 'received',
                        searchText: 'received',
                        display: <span>Received</span>,
                        displayProps: { fullName: 'Received' }
                    },
                    {
                        value: 'interacted',
                        id: 'interacted',
                        searchText: 'interacted',
                        display: <span>Interacted</span>,
                        displayProps: { fullName: 'Interacted' }
                    }
                ];
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
    }, [walletOptions, networkOptions, addressOptions, classificationOptions]);

    // Get available values for each field
    const getAvailableValuesForField = useCallback((fieldKey: string): Set<string> => {
        const criteriaExcludingCurrentField = cleanedFilterCriteria.filter(c => c.field !== fieldKey);

        let transactionsToCheck = sortedTransactions;

        if (criteriaExcludingCurrentField.length > 0) {
            transactionsToCheck = sortedTransactions.filter(transaction => {
                return criteriaExcludingCurrentField.every(criterion => {
                    const value = getTransactionValue(transaction, criterion.field);

                    if (criterion.value === '' || criterion.value == null || criterion.value.length === 0) return true;

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

        const values = new Set<string>();

        transactionsToCheck.forEach(transaction => {
            const value = getTransactionValue(transaction, fieldKey);

            if (Array.isArray(value)) {
                value.forEach(v => values.add(v.toString()));
            } else if (value !== '' && value != null) {
                values.add(value.toString());
            }
        });

        return values;
    }, [cleanedFilterCriteria, sortedTransactions]);

    // Get available options for a field
    const getAvailableOptions = useMemo(() => (fieldKey: string): FilterDropdownOption[] => {
        const allOptions = getAllOptions(fieldKey);

        if (cleanedFilterCriteria.length === 0) {
            return allOptions;
        }

        const availableValues = getAvailableValuesForField(fieldKey);
        const filteredOptions = allOptions.filter(option =>
            availableValues.has(option.value.toString())
        );

        return filteredOptions;
    }, [cleanedFilterCriteria, getAllOptions, getAvailableValuesForField]);

    // Create a map of available values for all fields
    const availableValuesByField = useMemo(() => {
        const map = new Map<string, Set<string>>();

        ['type', 'wallet', 'network', 'address', 'classification'].forEach(fieldKey => {
            map.set(fieldKey, getAvailableValuesForField(fieldKey));
        });

        return map;
    }, [getAvailableValuesForField]);

    // Define filter fields
    const filterFields: FilterField[] = useMemo(() => [
        {
            key: 'type',
            label: 'Type',
            type: 'multiselect',
            options: getAllOptions('type'),
            icon: <InteractedArrowIcon className="w-4 h-4" />
        },
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
    ], [walletOptions, networkOptions, addressOptions, classificationOptions, getAllOptions]);

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

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                // Focus search input - you'll need to add a ref to the input
                searchInputRef.current?.focus();
            }
            if (e.key === 'Escape' && searchQuery) {
                clearSearch();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [searchQuery]);

    // Add ref for search input
    const searchInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="flex flex-col w-full max-w-[1040px] mx-auto items-start gap-16 flex-[1_0_0]">
            <div className="flex items-end gap-2.5 self-stretch pt-[52px]">
                <h1 className="text-[#F8FCFF] font-[Figtree] text-[26px] not-italic font-medium leading-[normal] tracking-[1.04px]">Transactions</h1>
                <div>
                    <div className="flex w-80 items-center gap-2 rounded-md border-[0.5px] border-solid border-[#F8FCFF]/24 bg-[#F8FCFF]/02 px-3 py-2 transition-all duration-150 ease-in-out hover:border-[#F8FCFF]/48 focus-within:border-[#26C9C9] focus-within:bg-[#F8FCFF]/08">
                        <SearchIcon className="h-4 w-4 text-[#F8FCFF]/60" />
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search wallets, addresses, hashes, classifications..."
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
                                    {filteredTransactions.length}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col items-start gap-4 self-stretch">

                <div className="flex items-start gap-8 self-stretch">
                    <div className="flex items-start gap-5 self-stretch">
                        <div>
                            <MultiLevelFilter
                                fields={filterFields}
                                criteria={cleanedFilterCriteria}
                                onCriteriaChange={setFilterCriteria}
                                label="Apply filters"
                                availableValuesByField={availableValuesByField}
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
                                className="flex items-center flex-shrink-0 gap-1 pt-[3px] pr-[8px] pb-[3px] pl-[8px] rounded-full bg-[#F8FCFF]/16 hover:bg-[#F8FCFF]/16 border-solid border-[1px] border-[#F8FCFF]/32 hover:border-[#F8FCFF]/64 cursor-pointer transition-all"
                            >
                                <span className="font-[Geist] text-sm">
                                    Clear all
                                </span>
                            </button>
                        )}





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
                                    {startIndex + 1}-{Math.min(endIndex, filteredTransactions.length)} of {filteredTransactions.length}
                                </span>
                            )}
                            {totalPages === 1 && (
                                <span className="text-[#E7E8E9] text-sm not-italic font-light leading-[normal] tracking-[0.48px] opacity-80">
                                    Showing all {filteredTransactions.length} transactions
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
                            <PrimaryButton size="sm" onClick={handleExportCSV} label="Export csv" variant="neutral" />
                        </div>
                    </div>
                </div>


                <div className="flex flex-col">
                    <div className="group/group flex w-full max-w-[1040px] mx-auto flex pt-[10px] pr-[16px] pb-[10px] pl-[8px] items-center gap-4 self-stretch bg-[#18191B]">
                        <span className="w-[154px] text-[#F8FCFF] opacity-82 font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px]">Type & time</span>
                        <span className="w-[160px] text-[#F8FCFF] opacity-82 font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px]">Wallet & Network</span>
                        <span className="w-[160px] text-[#F8FCFF] opacity-82 font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px]">To/From</span>
                        <span className="w-[160px] text-[#F8FCFF] opacity-82 font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px]">In</span>
                        <span className="w-[160px] text-[#F8FCFF] opacity-82 font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px]">Out</span>
                        <span className="w-[150px] text-[#F8FCFF] opacity-82 font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px]">Classification</span>
                    </div>
                    <TransactionList
                        transactions={paginatedTransactions}
                        addresses={addresses}
                        uniqueClassifications={uniqueClassifications}
                    />
                </div>

                {totalPages > 1 && (
                    <div className="flex gap-2 items-center justify-end self-stretch">
                        <PageSelector
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                        <span className="text-[#E7E8E9] text-sm not-italic font-light leading-[normal] tracking-[0.48px] opacity-80">
                            {startIndex + 1}-{Math.min(endIndex, filteredTransactions.length)} of {filteredTransactions.length}
                        </span>
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
    );
}