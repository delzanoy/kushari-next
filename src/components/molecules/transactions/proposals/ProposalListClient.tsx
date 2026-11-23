"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { PROPOSAL_CATEGORY_LABEL, Proposal, ProposalCategory, ProposalStatus } from "./types";
import { AddressCardProps } from "@/components/molecules/address-book/addresses/types";
import ProposalList from "./ProposalList";
import NavTab from "@/components/atoms/NavTab";
import { walletIcon } from "@/components/atoms/WalletIcon";
import { BlockchainIconStack } from "@/components/atoms/BlockchainIconStack";
import { ComplexFilter, FilterCriterion, FilterField, FilterDropdownOption } from "@/components/molecules/ComplexFilter";
import { IconButton } from "@/components/atoms/IconButton";
import { TextInput } from "@/components/atoms/TextInput";
import { Button } from "@/components/atoms/Button";
import { UNCLASSIFIED, unclassifiedOption } from "../unclassified";
import { motion } from "framer-motion";
import {
    RiSearchLine,
    RiWalletLine,
    RiNetworkLine,
    RiUserLine,
    RiShapesLine,
    RiProgress3Line,
    RiFilter3Line,
    RiArrowLeftSLine,
    RiArrowRightSLine,
    RiCloseCircleFill,
    RiCheckboxBlankCircleLine,
    RiCheckboxCircleLine,
    RiLoaderFill
} from "@remixicon/react";

interface ProposalListProps {
    proposals: Proposal[];
    addresses: AddressCardProps[];
    wallets?: any[];
    uniqueClassifications: string[];
    initialSearchQuery?: string;
    initialPage?: number;
    initialWalletFilter?: string;
    initialTab?: ProposalCategory;
}

const walletGroups = [
    { key: "1", label: "Vaults" },
    { key: "2", label: "Gnosis Safes" },
    { key: "3", label: "Tracked Wallets" },
];

const ITEMS_PER_PAGE = 25;

const renderStatusIcon = (status: ProposalStatus) => {
    switch (status) {
        case ProposalStatus.ACTION_REQUIRED:
            return (
                <div className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                    <div className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-text-brand)] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-text-brand)]"></span>
                    </div>
                </div>
            );
        case ProposalStatus.FAILED:
        case ProposalStatus.FAILED_REJECTED:
            return (
                <div className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                    <div className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-text-danger)] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-text-danger)]"></span>
                    </div>
                </div>
            );
        case ProposalStatus.EXECUTING:
            return (
                <motion.span
                    animate={{ rotate: 360 }}
                    transition={{
                        repeat: Infinity,
                        duration: 1.2,
                        ease: "easeInOut"
                    }}
                    className="inline-flex text-[var(--color-text-brand)] shrink-0 w-3.5 h-3.5 items-center justify-center"
                >
                    <RiLoaderFill className="w-3.5 h-3.5" />
                </motion.span>
            );
        case ProposalStatus.READY:
            return <RiLoaderFill className="text-[var(--color-text-success)] shrink-0 w-3.5 h-3.5" />;
        case ProposalStatus.DECLINED:
            return (
                <div className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                    <span className="inline-flex rounded-full h-2 w-2 bg-[var(--color-text-warning)]" />
                </div>
            );
        case ProposalStatus.AWAITING_NONCE:
        case ProposalStatus.NO_ACTION:
        case ProposalStatus.ACTIONED:
            return (
                <div className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                    <span className="inline-flex rounded-full h-2 w-2 bg-[var(--color-text-muted)]" />
                </div>
            );
        default:
            return null;
    }
};

const formatStatusName = (status: ProposalStatus): string => {
    switch (status) {
        case ProposalStatus.ACTION_REQUIRED:
            return "Action required";
        case ProposalStatus.NO_ACTION:
            return "No action";
        case ProposalStatus.ACTIONED:
            return "Actioned";
        case ProposalStatus.READY:
            return "Ready";
        case ProposalStatus.FAILED:
            return "Failed to execute";
        case ProposalStatus.EXECUTING:
            return "Executing";
        case ProposalStatus.AWAITING_NONCE:
            return "Awaiting nonce";
        case ProposalStatus.DECLINED:
            return "Declined";
        case ProposalStatus.FAILED_REJECTED:
            return "Failed";
        default:
            return status;
    }
};

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

export default function ProposalListClient({
    proposals,
    addresses,
    wallets,
    uniqueClassifications,
    initialSearchQuery = "",
    initialPage = 1,
    initialWalletFilter,
    initialTab
}: ProposalListProps) {
    const [activeTab, setActiveTab] = useState<ProposalCategory>(
        initialTab || ProposalCategory.NEEDS_APPROVAL
    );

    const [proposalList, setProposalList] = useState(proposals);
    const [classificationsList, setClassificationsList] = useState(uniqueClassifications);
    const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
    const [filterCriteria, setFilterCriteria] = useState<FilterCriterion[]>([]);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [showMyActions, setShowMyActions] = useState(false);
    const hasAppliedInitialFilter = useRef(false);
    const hasAppliedInitialTab = useRef(false);

    const [userGroups, setUserGroups] = useState<any[]>([]);
    const [addressGroups, setAddressGroups] = useState<Record<number, number[]>>({});

    useEffect(() => {
        setProposalList(proposals);
    }, [proposals]);

    useEffect(() => {
        setClassificationsList(uniqueClassifications);
    }, [uniqueClassifications]);

    const handleUpdateClassification = useCallback((proposalId: string, newClassification: string) => {
        setProposalList(prev => prev.map(p => p.id === proposalId ? { ...p, classification: newClassification } : p));
        setClassificationsList(prev => {
            if (newClassification && !prev.includes(newClassification)) {
                return [...prev, newClassification].sort((a, b) => a.localeCompare(b));
            }
            return prev;
        });
    }, []);

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
                console.error("Failed to load address groups for proposals:", err);
            }
        };
        loadGroupsData();
    }, []);

    const myActionsStatuses = useMemo(() => [
        ProposalStatus.ACTION_REQUIRED,
        ProposalStatus.READY,
        ProposalStatus.FAILED,
        ProposalStatus.FAILED_REJECTED
    ], []);

    const toggleShowMyActions = () => {
        setShowMyActions(prev => !prev);
        setCurrentPage(1);
    };

    useEffect(() => {
        setSearchQuery(initialSearchQuery);
    }, [initialSearchQuery]);

    useEffect(() => {
        setCurrentPage(initialPage);
    }, [initialPage]);

    useEffect(() => {
        if (initialTab && !hasAppliedInitialTab.current) {
            setActiveTab(initialTab);
            hasAppliedInitialTab.current = true;
        }
    }, [initialTab]);

    const searchProposals = useCallback((proposal: Proposal, query: string): boolean => {
        if (!query.trim()) return true;
        const searchTerm = query.toLowerCase().trim();

        const checkValue = (value: unknown): boolean => {
            if (!value) return false;
            return value.toString().toLowerCase().includes(searchTerm);
        };

        if (checkValue(proposal.id) ||
            checkValue(proposal.wallet) ||
            checkValue(proposal.classification) ||
            checkValue(proposal.initiator) ||
            checkValue(formatStatusName(proposal.status))) {
            return true;
        }

        if (proposal.recipients) {
            if (typeof proposal.recipients === "string") {
                if (checkValue(proposal.recipients)) return true;
            } else if (Array.isArray(proposal.recipients)) {
                for (const recipient of proposal.recipients) {
                    if (recipient.addressId) {
                        const addressEntry = addresses.find(addr => addr.id === recipient.addressId);
                        if (addressEntry?.name && checkValue(addressEntry.name)) return true;
                    }
                    if (recipient.toAddress && checkValue(recipient.toAddress)) return true;
                }
            } else if (typeof proposal.recipients === "object") {
                const recipient = proposal.recipients;
                if (recipient.addressId) {
                    const addressEntry = addresses.find(addr => addr.id === recipient.addressId);
                    if (addressEntry?.name && checkValue(addressEntry.name)) return true;
                }
                if (recipient.toAddress && checkValue(recipient.toAddress)) return true;
            }
        }

        return false;
    }, [addresses]);

    const sortedProposals = useMemo(() => {
        return [...proposalList].sort((a, b) => b.timestamp - a.timestamp);
    }, [proposalList]);

    const proposalsByDate = useMemo(() => {
        const groups: { [key: string]: Proposal[] } = {};
        sortedProposals.forEach(proposal => {
            const dateKey = new Date(proposal.timestamp).toDateString();
            if (!groups[dateKey]) groups[dateKey] = [];
            groups[dateKey].push(proposal);
        });
        return groups;
    }, [sortedProposals]);

    const proposalsWithDateInfo = useMemo(() => {
        const result: Array<Proposal & { showDate: boolean; isFirstOfDate: boolean }> = [];
        Object.values(proposalsByDate).forEach((proposals) => {
            proposals.forEach((proposal, index) => {
                result.push({
                    ...proposal,
                    showDate: index === 0,
                    isFirstOfDate: index === 0
                });
            });
        });
        return result;
    }, [proposalsByDate]);

    const categorizedProposals = useMemo(() => {
        return proposalsWithDateInfo.map(proposal => ({
            ...proposal,
            category: getProposalCategory(proposal.status)
        }));
    }, [proposalsWithDateInfo]);

    const cleanedFilterCriteria = useMemo(() => {
        return filterCriteria.filter(criterion => {
            if (Array.isArray(criterion.value)) return criterion.value.length > 0;
            return criterion.value !== "" && criterion.value != null;
        });
    }, [filterCriteria]);

    const getProposalValue = (proposal: Proposal, field: string): string | string[] => {
        switch (field) {
            case "wallet":
                return proposal.wallet?.toString() || "";
            case "network":
                return proposal.blockchain || "";
            case "address":
                if (Array.isArray(proposal.recipients)) {
                    return proposal.recipients
                        .map(r => r.addressId?.toString() || r.toAddress || "")
                        .filter(Boolean);
                } else if (proposal.recipients && typeof proposal.recipients === "object") {
                    return proposal.recipients.addressId?.toString() || proposal.recipients.toAddress || "";
                }
                return "";
            case "classification":
                return proposal.classification || UNCLASSIFIED;
            case "status":
                return proposal.status || "";
            default:
                return "";
        }
    };

    const statusOptions = useMemo((): FilterDropdownOption[] => {
        return Object.values(ProposalStatus).map(status => ({
            value: status,
            id: status,
            searchText: formatStatusName(status).toLowerCase(),
            display: (
                <div className="flex items-center gap-3 flex-1">
                    <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                        {renderStatusIcon(status)}
                    </div>
                    <span className="text-[var(--color-text-primary)] text-sm font-medium truncate">
                        {formatStatusName(status)}
                    </span>
                </div>
            ),
            displayProps: {
                fullName: formatStatusName(status),
                icon: renderStatusIcon(status)
            }
        }));
    }, []);

    const getSelectedValuesForField = (fieldKey: string): string[] => {
        const criterion = filterCriteria.find(c => c.field === fieldKey);
        if (!criterion) return [];
        return Array.isArray(criterion.value) ? criterion.value.map(String) : [String(criterion.value)];
    };

    const updateFieldCriteria = (fieldKey: string, newValues: string[]) => {
        setFilterCriteria(prev => {
            const idx = prev.findIndex(c => c.field === fieldKey);
            if (newValues.length === 0) {
                return prev.filter(c => c.field !== fieldKey);
            }
            const newCriterion: FilterCriterion = {
                id: idx >= 0 ? prev[idx].id : `criterion-${Date.now()}`,
                field: fieldKey,
                operator: "equals",
                value: newValues,
            };
            if (idx >= 0) {
                return prev.map((c, i) => i === idx ? newCriterion : c);
            }
            return [...prev, newCriterion];
        });
        setCurrentPage(1);
    };

    const walletOptions = useMemo((): FilterDropdownOption[] => {
        const walletMap = new Map();
        proposalList.forEach(proposal => {
            if (proposal.wallet && !walletMap.has(proposal.wallet)) {
                walletMap.set(proposal.wallet, {
                    id: proposal.wallet,
                    name: proposal.wallet,
                    walletType: proposal.walletType,
                });
            }
        });

        return Array.from(walletMap.values())
            .sort((a, b) => (a?.name || '').localeCompare(b?.name || ''))
            .map(wallet => ({
                value: wallet.id.toString(),
                id: wallet.id.toString(),
                searchText: wallet.name.toLowerCase(),
                groupKey: `${wallet.walletType}`,
                display: (
                    <div className="flex items-center gap-3 flex-1">
                        <span className="text-[var(--color-text-primary)] text-sm font-medium truncate">
                            {wallet.name}
                        </span>
                    </div>
                ),
                displayProps: {
                    fullName: wallet.name,
                    icon: walletIcon(wallet.walletType, { fallback: 1 })
                }
            }));
    }, [proposals]);

    useEffect(() => {
        if (initialWalletFilter && walletOptions.length > 0 && !hasAppliedInitialFilter.current) {
            const match = walletOptions.find(o => o.displayProps.fullName.toLowerCase() === initialWalletFilter.toLowerCase());
            if (match) {
                const exist = filterCriteria.find(c => c.field === "wallet");
                if (!exist?.value.includes(match.value)) {
                    updateFieldCriteria("wallet", [match.value]);
                    hasAppliedInitialFilter.current = true;
                }
            }
        }
    }, [initialWalletFilter, walletOptions]);

    const networkOptions = useMemo((): FilterDropdownOption[] => {
        const networks = Array.from(new Set(proposalList.map(p => p.blockchain))).filter(Boolean);
        return networks.map(network => ({
            value: network,
            id: network,
            searchText: network.toLowerCase(),
            display: (
                <div className="flex items-center gap-3 flex-1">
                    <span className="text-[var(--color-text-primary)] text-sm font-medium truncate">
                        {network}
                    </span>
                </div>
            ),
            displayProps: {
                fullName: network,
                icon: <BlockchainIconStack blockchain={network} size={16} max={1} />,
            }
        }));
    }, [proposals]);

    const addressOptions = useMemo((): FilterDropdownOption[] => {
        const options: FilterDropdownOption[] = [];
        const added = new Set<string>();

        proposalList.forEach(p => {
            const addRecipient = (addressId?: number, toAddress?: string) => {
                if (addressId) {
                    const entry = addresses.find(a => a.id === addressId);
                    if (entry && !added.has(entry.id.toString())) {
                        added.add(entry.id.toString());
                        options.push({
                            value: entry.id.toString(),
                            id: entry.id.toString(),
                            searchText: entry.name.toLowerCase(),
                            display: (
                                <div className="flex items-center gap-3 flex-1">
                                    <span className="text-[var(--color-text-primary)] text-sm font-medium truncate">{entry.name}</span>
                                </div>
                            ),
                            displayProps: { fullName: entry.name }
                        });
                    }
                }
            };

            if (Array.isArray(p.recipients)) {
                p.recipients.forEach(r => addRecipient(r.addressId, r.toAddress));
            } else if (p.recipients) {
                addRecipient(p.recipients.addressId, p.recipients.toAddress);
            }
        });

        return options.sort((a, b) => (a?.displayProps?.fullName || '').localeCompare(b?.displayProps?.fullName || ''));
    }, [proposals, addresses]);

    const classificationOptions = useMemo((): FilterDropdownOption[] => {
        const unclassified = unclassifiedOption(proposalList.filter(p => !p.classification).length);
        return [...(unclassified ? [unclassified] : []), ...classificationsList.filter(Boolean).map(c => ({
            value: c,
            id: c,
            searchText: c.toLowerCase(),
            display: (
                <div className="flex items-center gap-3 flex-1">
                    <span className="text-[var(--color-text-primary)] text-sm font-medium truncate">{c}</span>
                </div>
            ),
            displayProps: { fullName: c }
        }))];
    }, [classificationsList, proposalList]);

    const filteredAllProposals = useMemo(() => {
        let filtered = categorizedProposals;
        if (searchQuery.trim()) {
            filtered = filtered.filter(p => searchProposals(p, searchQuery));
        }
        if (showMyActions) {
            filtered = filtered.filter(p => myActionsStatuses.includes(p.status));
        }
        if (cleanedFilterCriteria.length > 0) {
            filtered = filtered.filter(p => {
                return cleanedFilterCriteria.every(criterion => {
                    const val = getProposalValue(p, criterion.field);
                    if (Array.isArray(criterion.value)) {
                        if (Array.isArray(val)) {
                            return val.some(v => criterion.value.includes(v.toString()));
                        }
                        return criterion.value.includes(val.toString());
                    }
                    if (Array.isArray(val)) return val.includes(criterion.value);
                    return val.toString() === criterion.value;
                });
            });
        }
        return filtered;
    }, [categorizedProposals, searchQuery, cleanedFilterCriteria, searchProposals, showMyActions, myActionsStatuses]);

    const filteredProposals = useMemo(() => {
        return filteredAllProposals.filter(p => p.category === activeTab);
    }, [filteredAllProposals, activeTab]);

    const categoryCounts = useMemo(() => {
        return {
            [ProposalCategory.NEEDS_APPROVAL]: filteredAllProposals.filter(p => p.status === ProposalStatus.ACTION_REQUIRED).length,
            [ProposalCategory.READY_TO_EXECUTE]: filteredAllProposals.filter(p => p.status === ProposalStatus.FAILED || p.status === ProposalStatus.READY).length,
            [ProposalCategory.DISCARDED]: filteredAllProposals.filter(p => p.status === ProposalStatus.FAILED_REJECTED || p.status === ProposalStatus.DECLINED).length,
        };
    }, [filteredAllProposals]);

    const totalPages = Math.ceil(filteredProposals.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedProposals = useMemo(() => {
        const sliced = filteredProposals.slice(startIndex, endIndex);
        return sliced.map((prop, index, arr) => {
            const currentDate = new Date(prop.timestamp).toDateString();
            const prevDate = index > 0 ? new Date(arr[index - 1].timestamp).toDateString() : null;
            const isFirstOfDate = index === 0 || currentDate !== prevDate;
            return {
                ...prop,
                showDate: isFirstOfDate,
                isFirstOfDate
            };
        });
    }, [filteredProposals, startIndex, endIndex]);

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(1);
        }
    }, [currentPage, totalPages]);

    const filterFields: FilterField[] = useMemo(() => [
        { key: "wallet", label: "Wallet", type: "multiselect", icon: <RiWalletLine size={16} />, options: walletOptions, groups: walletGroups },
        { key: "network", label: "Network", type: "multiselect", icon: <RiNetworkLine size={16} />, options: networkOptions },
        { key: "address", label: "Address", type: "multiselect", icon: <RiUserLine size={16} />, options: addressOptions },
        { key: "classification", label: "Classification", type: "multiselect", icon: <RiShapesLine size={16} />, options: classificationOptions },
        { key: "status", label: "Status", type: "multiselect", icon: <RiProgress3Line size={16} />, options: statusOptions }
    ], [walletOptions, networkOptions, addressOptions, classificationOptions, statusOptions]);

    const activeFilterFields = useMemo(() => {
        return cleanedFilterCriteria.map(criterion => {
            const field = filterFields.find(f => f.key === criterion.field);
            return field ? { field } : null;
        }).filter(Boolean) as { field: FilterField }[];
    }, [cleanedFilterCriteria, filterFields]);

    const clearSearch = () => {
        setSearchQuery("");
        setCurrentPage(1);
    };

    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <div className="flex flex-col w-full max-w-[1040px] mx-auto items-start gap-12 flex-[1_0_0]">
            {/* Header Section: Title, Search & Show My Actions */}
            <div className="flex justify-between items-center self-stretch">
                <div className="flex items-center gap-4 flex-1">
                    <h1 className="text-[var(--color-text-primary)] text-[26px] font-medium tracking-tight">Proposals</h1>

                    <div className="w-[280px]">
                        <TextInput
                            ref={searchInputRef}
                            placeholder="Search proposals... (⌘K)"
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

                <Button
                    variant={showMyActions ? "brand" : "neutral"}
                    appearance="tonal"
                    size="sm"
                    onClick={toggleShowMyActions}
                    flat
                    leadingIcon={showMyActions ? <RiCheckboxCircleLine /> : <RiCheckboxBlankCircleLine />}
                >
                    {showMyActions ? "Showing your actions" : "Show my actions"}
                </Button>
            </div>

            {/* Filter Row */}
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
            </div>

            {/* Navigation Tabs and Content */}
            <div className="flex flex-col items-end self-stretch w-full -mt-4">
                <div className="flex items-center justify-between w-full border-b border-[var(--color-border-subtle)] pb-px">
                    <div className="flex items-center gap-8">
                        <NavTab
                            title={PROPOSAL_CATEGORY_LABEL[ProposalCategory.NEEDS_APPROVAL]}
                            titleCount={categoryCounts[ProposalCategory.NEEDS_APPROVAL]}
                            titleColor="cyan"
                            isActive={activeTab === ProposalCategory.NEEDS_APPROVAL}
                            onClick={() => {
                                setActiveTab(ProposalCategory.NEEDS_APPROVAL);
                                setCurrentPage(1);
                            }}
                        />
                        <NavTab
                            title={PROPOSAL_CATEGORY_LABEL[ProposalCategory.READY_TO_EXECUTE]}
                            titleCount={categoryCounts[ProposalCategory.READY_TO_EXECUTE]}
                            titleColor="white"
                            isActive={activeTab === ProposalCategory.READY_TO_EXECUTE}
                            onClick={() => {
                                setActiveTab(ProposalCategory.READY_TO_EXECUTE);
                                setCurrentPage(1);
                            }}
                        />
                        <NavTab
                            title={PROPOSAL_CATEGORY_LABEL[ProposalCategory.DISCARDED]}
                            titleCount={categoryCounts[ProposalCategory.DISCARDED]}
                            titleColor="red"
                            isActive={activeTab === ProposalCategory.DISCARDED}
                            onClick={() => {
                                setActiveTab(ProposalCategory.DISCARDED);
                                setCurrentPage(1);
                            }}
                        />
                    </div>

                    <div className="flex items-center gap-4 pb-2 h-8">
                        <span className="text-sm text-[var(--color-text-muted)] tracking-tight hidden md:inline-block">
                            {filteredProposals.length > 0 ? (
                                totalPages <= 1 ? (
                                    <>
                                        Showing all <span className="font-medium text-[var(--color-text-primary)]">{filteredProposals.length}</span> proposals
                                    </>
                                ) : (
                                    <>
                                        Showing <span className="font-medium text-[var(--color-text-primary)]">{startIndex + 1}-{Math.min(endIndex, filteredProposals.length)}</span> of{" "}
                                        <span className="font-medium text-[var(--color-text-primary)]">{filteredProposals.length}</span> proposals
                                    </>
                                )
                            ) : (
                                <>No proposals found</>
                            )}
                        </span>

                        {totalPages > 1 && (
                            <div className="flex items-center">
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



                <ProposalList
                    proposals={paginatedProposals}
                    addresses={addresses}
                    wallets={wallets}
                    uniqueClassifications={classificationsList}
                    userGroups={userGroups}
                    addressGroups={addressGroups}
                    onUpdateClassification={handleUpdateClassification}
                />
            </div>
        </div>
    );
}
