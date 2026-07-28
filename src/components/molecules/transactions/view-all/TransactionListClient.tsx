"use client"
import { Transaction, TransactionWithCalculations } from "./types";
import { AddressCardProps } from "@/components/molecules/address-book/addresses/types";
import TransactionList from "./TransactionList";
import { ComplexFilter, FilterCriterion, FilterField } from "@/components/molecules/ComplexFilter";
import { IconButton } from "@/components/atoms/IconButton";
import { Button } from "@/components/atoms/Button";
import { TextInput } from "@/components/atoms/TextInput";
import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { determineMultirecipients } from "./calculations";
import { BlockchainIconStack } from "@/components/atoms/BlockchainIconStack";

import {
    RiSearchLine,
    RiCloseCircleFill,
    RiExchangeLine,
    RiSafe2Line,
    RiSafeLine,
    RiWalletLine,
    RiArrowLeftSLine,
    RiArrowRightSLine,
    RiGlobalLine,
    RiDownloadCloud2Line,
    RiBox3Line,
    RiFilter3Line,
    RiArrowLeftDownLine,
    RiArrowRightUpLine,
    RiPriceTag3Line
} from "@remixicon/react";

interface TransactionListProps {
    transactions: TransactionWithCalculations[];
    addresses: AddressCardProps[];
    uniqueClassifications: string[];
    initialSearchQuery?: string;
    initialPage?: number;
    initialWalletFilter?: string;
}

const ITEMS_PER_PAGE = 25;

export default function TransactionListClient({
    transactions,
    addresses,
    uniqueClassifications,
    initialSearchQuery = '',
    initialPage = 1,
    initialWalletFilter
}: TransactionListProps) {
    const [txList, setTxList] = useState(transactions);
    const [classifications, setClassifications] = useState(uniqueClassifications);
    const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Complex Filter states
    const [filterCriteria, setFilterCriteria] = useState<FilterCriterion[]>([]);
    const hasAppliedInitialFilter = useRef(false);

    const [userGroups, setUserGroups] = useState<any[]>([]);
    const [addressGroups, setAddressGroups] = useState<Record<number, number[]>>({});

    useEffect(() => {
        const loadGroupsData = async () => {
            try {
                const { getUserGroups, getAllAddressGroups } = await import("@/lib/mock-cache");
                const [groupsData, relationships] = await Promise.all([
                    getUserGroups(),
                    getAllAddressGroups()
                ]);
                setUserGroups(groupsData);
                setAddressGroups(relationships);
            } catch (err) {
                console.error("Failed to load address groups for transactions:", err);
            }
        };
        loadGroupsData();
    }, []);

    useEffect(() => {
        setTxList(transactions);
    }, [transactions]);

    useEffect(() => {
        setClassifications(uniqueClassifications);
    }, [uniqueClassifications]);

    const handleUpdateClassification = useCallback((txId: string, newClassification: string) => {
        setTxList(prev => prev.map(tx => tx.id === txId ? { ...tx, classification: newClassification } : tx));
        setClassifications(prev => {
            if (newClassification && !prev.includes(newClassification)) {
                return [...prev, newClassification].sort((a, b) => a.localeCompare(b));
            }
            return prev;
        });
    }, []);

    const renderWalletIcon = (walletType: number) => {
        switch (walletType) {
            case 1: return <RiSafeLine size={16} />;
            case 2: return <RiSafe2Line size={16} />;
            case 3: return <RiWalletLine size={16} />;
            default: return <RiSafeLine size={16} />;
        }
    };

    const typeOptions = [
        { value: 'received', label: 'Received', icon: <RiArrowLeftDownLine size={16} /> },
        { value: 'sent', label: 'Sent', icon: <RiArrowRightUpLine size={16} /> },
        { value: 'interacted', label: 'Interacted', icon: <RiExchangeLine size={16} /> }
    ];

    const filterFields = useMemo<FilterField[]>(() => {
        const uniqueWallets = Array.from(new Map(txList.map(tx => [tx.wallet, { id: tx.walletId, name: tx.wallet, type: tx.walletType }])).values());
        uniqueWallets.sort((a, b) => a.name.localeCompare(b.name));
        const walletOptions = uniqueWallets.map(w => ({
            id: w.id?.toString() || w.name,
            value: w.id?.toString() || w.name,
            displayProps: { fullName: w.name, icon: renderWalletIcon(w.type) }
        }));

        const uniqueBlockchains = Array.from(new Set(txList.map(tx => tx.blockchain).filter(Boolean)));
        uniqueBlockchains.sort((a, b) => a.localeCompare(b));
        const blockchainOptions = uniqueBlockchains.map(bc => ({
            id: bc,
            value: bc,
            displayProps: { fullName: bc, icon: <BlockchainIconStack blockchain={bc} size={16} max={1} /> }
        }));

        const activeClassifications = classifications.filter(Boolean).sort((a, b) => a.localeCompare(b));
        const classificationOptions = activeClassifications.map(c => ({
            id: c,
            value: c,
            displayProps: { fullName: c, icon: <RiPriceTag3Line size={16} /> }
        }));

        return [
            {
                key: 'type',
                label: 'Type',
                type: 'multiselect',
                icon: <RiFilter3Line size={16} />,
                options: typeOptions.map(opt => ({
                    id: opt.value,
                    value: opt.value,
                    displayProps: { fullName: opt.label, icon: opt.icon }
                }))
            },
            {
                key: 'wallet',
                label: 'Wallet',
                type: 'multiselect',
                icon: <RiWalletLine size={16} />,
                options: walletOptions
            },
            {
                key: 'blockchain',
                label: 'Blockchain',
                type: 'multiselect',
                icon: <RiGlobalLine size={16} />,
                options: blockchainOptions
            },
            {
                key: 'classification',
                label: 'Classification',
                type: 'multiselect',
                icon: <RiPriceTag3Line size={16} />,
                options: classificationOptions
            }
        ];
    }, [txList, classifications]);

    useEffect(() => {
        if (initialWalletFilter && filterFields.length > 0 && !hasAppliedInitialFilter.current) {
            const walletField = filterFields.find(f => f.key === 'wallet');
            if (walletField && walletField.options) {
                const matchingWallet = walletField.options.find(opt => opt.displayProps.fullName.toLowerCase() === initialWalletFilter.toLowerCase());
                if (matchingWallet) {
                    setFilterCriteria(prev => {
                        hasAppliedInitialFilter.current = true;
                        return [...prev, {
                            id: `criterion-${Date.now()}`,
                            field: 'wallet',
                            operator: 'equals',
                            value: [matchingWallet.value]
                        }];
                    });
                }
            }
        }
    }, [initialWalletFilter, filterFields]);

    const searchTransactions = useCallback((transaction: Transaction, query: string): boolean => {
        if (!query.trim()) return true;
        const searchTerm = query.toLowerCase().trim();
        const checkValue = (value: string | number | undefined | null): boolean => {
            if (!value) return false;
            return value.toString().toLowerCase().includes(searchTerm);
        };

        if (checkValue(transaction.id) ||
            checkValue(transaction.wallet) ||
            checkValue(transaction.classification) ||
            checkValue(transaction.inTokenSymbol) ||
            checkValue(transaction.outTokenSymbol) ||
            checkValue(transaction.executer) ||
            checkValue(transaction.initiator)) {
            return true;
        }

        const recipientsText = determineMultirecipients(transaction.multiRecipient, transaction.recipients, addresses);
        if (checkValue(recipientsText)) return true;

        return false;
    }, [addresses]);

    const getTransactionType = (transaction: Transaction): string => {
        if (transaction.incoming && transaction.outgoing) return 'interacted';
        if (transaction.incoming) return 'received';
        if (transaction.outgoing) return 'sent';
        return '';
    };

    const sortedTransactions = useMemo(() => {
        return [...txList].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [txList]);

    const filteredTransactions = useMemo(() => {
        let filtered = sortedTransactions;

        if (searchQuery.trim()) {
            filtered = filtered.filter(transaction => searchTransactions(transaction, searchQuery));
        }

        if (filterCriteria.length > 0) {
            filtered = filtered.filter(tx => {
                return filterCriteria.every(criterion => {
                    const values = Array.isArray(criterion.value) ? criterion.value : [criterion.value];
                    if (values.length === 0) return true;

                    switch (criterion.field) {
                        case 'type':
                            return values.includes(getTransactionType(tx));
                        case 'wallet':
                            return values.includes(tx.walletId?.toString() || tx.wallet);
                        case 'blockchain':
                            return values.includes(tx.blockchain);
                        case 'classification':
                            return values.includes(tx.classification);
                        default:
                            return true;
                    }
                });
            });
        }

        return filtered;
    }, [sortedTransactions, searchQuery, searchTransactions, filterCriteria]);

    const transactionsByDate = useMemo(() => {
        const groups: { [key: string]: TransactionWithCalculations[] } = {};
        filteredTransactions.forEach(transaction => {
            const dateKey = new Date(transaction.timestamp).toDateString();
            if (!groups[dateKey]) groups[dateKey] = [];
            groups[dateKey].push(transaction);
        });
        return groups;
    }, [filteredTransactions]);

    const transactionsWithDateInfo = useMemo(() => {
        const result: Array<TransactionWithCalculations & { showDate: boolean; isFirstOfDate: boolean }> = [];
        Object.values(transactionsByDate).forEach((txs) => {
            txs.forEach((transaction, index) => {
                result.push({
                    ...transaction,
                    showDate: index === 0,
                    isFirstOfDate: index === 0
                });
            });
        });
        return result;
    }, [transactionsByDate]);

    const totalPages = Math.ceil(transactionsWithDateInfo.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedTransactions = transactionsWithDateInfo.slice(startIndex, endIndex);

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(1);
        }
    }, [currentPage, totalPages]);

    const clearSearch = () => {
        setSearchQuery('');
        setCurrentPage(1);
    };

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
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [searchQuery]);

    const handleExportCSV = () => {
        alert("Exporting CSV...");
    };

    return (
        <div className="flex flex-col w-full max-w-[1040px] mx-auto items-start gap-12 flex-[1_0_0]">
            {/* Header Section: Title & Search */}
            <div className="flex justify-between items-center self-stretch">
                <div className="flex items-center gap-4 flex-1">
                    <h1 className="text-[var(--color-text-primary)] text-[26px] font-medium tracking-tight">Transactions</h1>

                    <div className="w-[280px]">
                        <TextInput
                            ref={searchInputRef}
                            placeholder="Search hashes, wallets... (⌘K)"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            leadingIcon={<RiSearchLine size={16} className="text-[var(--color-icon-muted)]" />}
                            trailingIcon={
                                searchQuery ? (
                                    <IconButton
                                        icon={<RiCloseCircleFill size={16} />}
                                        onClick={clearSearch}
                                        size="sm"
                                        variant="neutral"
                                        appearance="ghost"
                                        aria-label="Clear search"
                                    />
                                ) : undefined
                            }
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Button size="sm" variant="neutral" appearance="tonal" onClick={handleExportCSV} leadingIcon={<RiDownloadCloud2Line />} flat>
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* Filter & Pagination Row */}
            <div className="flex items-center justify-between self-stretch -mt-4 min-h-8">
                <div className="flex items-center gap-4">
                    <ComplexFilter
                        fields={filterFields}
                        criteria={filterCriteria}
                        onCriteriaChange={setFilterCriteria}
                        label="Filter"
                        buttonIcon={<RiFilter3Line size={16} />}
                    />

                    {filterCriteria.length > 0 && (
                        <Button
                            variant="neutral"
                            appearance="tonal"
                            size="sm"
                            onClick={() => setFilterCriteria([])}
                            flat
                        >
                            Clear all
                        </Button>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-sm text-[var(--color-text-muted)] tracking-tight hidden md:inline-block">
                        {transactionsWithDateInfo.length > 0 ? (
                            <>
                                Showing <span className="font-medium text-[var(--color-text-primary)]">{startIndex + 1}-{Math.min(endIndex, transactionsWithDateInfo.length)}</span> of{" "}
                                <span className="font-medium text-[var(--color-text-primary)]">{transactionsWithDateInfo.length}</span> transactions
                            </>
                        ) : (
                            <>No transactions found</>
                        )}
                    </span>

                    {totalPages > 1 && (
                        <div>
                            <IconButton
                                size="sm"
                                variant="neutral"
                                appearance="ghost"
                                aria-label="Previous page"
                                icon={<RiArrowLeftSLine size={16} />}
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                flat
                            />
                            <IconButton
                                size="sm"
                                variant="neutral"
                                appearance="ghost"
                                aria-label="Next page"
                                icon={<RiArrowRightSLine size={16} />}
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                flat
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col items-end self-stretch w-full -mt-4">
                {/* List Header */}
                <div className="flex w-full items-center gap-4 py-2 px-0 border-b border-[var(--color-border-subtle)] text-xs text-[var(--color-text-muted)]">
                    <span className="w-40 tracking-tight shrink-0 pl-4">Type & time</span>
                    <span className="w-40 tracking-tight shrink-0">Wallet & Network</span>
                    <span className="w-40 tracking-tight shrink-0">To/From</span>
                    <span className="w-32 tracking-tight shrink-0">In</span>
                    <span className="w-32 tracking-tight shrink-0">Out</span>
                    <span className="flex-1 tracking-tight shrink-0">Classification</span>
                </div>

                <TransactionList
                    transactions={paginatedTransactions}
                    addresses={addresses}
                    uniqueClassifications={classifications}
                    userGroups={userGroups}
                    addressGroups={addressGroups}
                    onUpdateClassification={handleUpdateClassification}
                />
            </div>
        </div>
    );
}
