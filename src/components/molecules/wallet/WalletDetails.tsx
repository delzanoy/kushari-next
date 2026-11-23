"use client";

import React, { useState, useMemo, useEffect, useCallback, memo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';

// Design System components
import { Button } from "@/components/atoms/Button";
import { TertiaryButton } from "@/components/atoms/TertiaryButton";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, DropdownLabel } from "@/components/atoms/Dropdown";
import { BlockchainIconStack } from "@/components/atoms/BlockchainIconStack";
import NavTab from "@/components/atoms/NavTab";
import { Tooltip } from "@/components/atoms/Tooltip";
import { useModal, Modal } from "@/components/molecules/modal";
import { useMembers } from "@/hooks/useData";

// Icons
import { RiQrCodeLine, RiSendPlaneFill, RiArrowRightUpLine, RiSafeLine, RiWalletLine } from "@remixicon/react";
import { GnosisSafeIcon } from "@/media/icons/GnosisSafeIcon";

// Types
import type { Wallet, Member } from "./types";
import type { Cryptocurrency } from "@/components/molecules/assets/types";
import type { Transaction } from "@/components/molecules/transactions/view-all/types";
import { PROPOSAL_CATEGORY_LABEL, ProposalCategory, ProposalStatus, type Proposal } from "@/components/molecules/transactions/proposals/types";
import { AddressCardProps } from "@/components/molecules/address-book/addresses/types";
import { WalletInfo } from "@/components/molecules/assets/types";

// Utils
import { formatDollars, formatCents } from "@/lib/formatters";
import { transformApiDataToProposals } from "@/components/molecules/transactions/proposals/utils/transformProposals";

// Children components
import ProposalList from "@/components/molecules/transactions/proposals/ProposalList";
import TransactionList from "@/components/molecules/transactions/view-all/TransactionList";
import { AssetList } from "@/components/molecules/assets/AssetList";
import PolicyContent from "./components/PolicyContent";
import MakeDeposit from "./modals/MakeDeposit";
import SendTokens from "./modals/SendTokens";
import FeatureUnderDevelopment from "@/components/molecules/FeatureUnderDevelopment";
import { walletIcon } from "@/components/atoms/WalletIcon";

interface TransactionWithDateInfo extends Transaction {
    showDate: boolean;
    isFirstOfDate: boolean;
}

// --- Constants ---
const TAB_ORDER = ['proposals', 'assets', 'transactions', 'policy'] as const;
const PREVIEW_ITEMS_COUNT = 8;
type TabType = typeof TAB_ORDER[number];

const getTabOrder = (walletType: number) => {
    if (walletType === 3) return ['assets', 'transactions'] as const;
    return ['proposals', 'assets', 'transactions', 'policy'] as const;
};

// --- Helper Functions ---
const getHumanReadableCategory = (category: ProposalCategory): string =>
    PROPOSAL_CATEGORY_LABEL[category] || PROPOSAL_CATEGORY_LABEL[ProposalCategory.NEEDS_APPROVAL];

const getCategoryFromHumanReadable = (humanReadableName: string): ProposalCategory =>
    (Object.keys(PROPOSAL_CATEGORY_LABEL) as ProposalCategory[]).find(
        (c) => PROPOSAL_CATEGORY_LABEL[c] === humanReadableName,
    ) || ProposalCategory.NEEDS_APPROVAL;

const capitalizeFirstLetter = (str: string): string => {
    if (!str || str.length === 0) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
};

// --- Icon Helper Functions ---
const renderTitleWalletIcon = (walletType: number) => {
    const iconMap: Record<number, React.ReactElement> = {
        1: <RiSafeLine size={24} />,
        2: <GnosisSafeIcon size={24} />,
        3: <RiWalletLine size={24} />,
    };
    return iconMap[walletType] || null;
};

const BalanceDisplay = memo(({ label, value, viewTransitionName }: { label: string; value: number; viewTransitionName?: string }) => (
    <div
        className="flex flex-col justify-center items-start gap-[7px]"
        style={viewTransitionName ? { viewTransitionName } as any : {}}
    >
        <span className="text-[var(--color-text-muted)] font-mono text-xs not-italic font-medium leading-[normal] tracking-[0.96px] uppercase">
            {label}
        </span>
        <div className="flex items-baseline">
            <span className="text-[var(--color-text-primary)] font-display text-[26px] not-italic font-medium leading-[normal] tracking-[0.88px]">
                $ {formatDollars(value)}
            </span>
            <span className="text-[var(--color-text-muted)] font-display text-[26px] not-italic font-medium leading-[normal] tracking-[0.88px]">
                .{formatCents(value)}
            </span>
        </div>
    </div>
));

const WalletHeader = memo(({
    wallet,
    proposed,
    available,
    totalBalance,
    wallets = [],
    members = [],
    onWalletChange,
    onBackToWallets
}: {
    wallet: Wallet;
    proposed: number;
    available: number;
    totalBalance: number;
    wallets?: Wallet[];
    members?: Member[];
    onWalletChange?: (walletId: number) => void;
    onBackToWallets?: () => void;
}) => {
    const [copiedAddress, setCopiedAddress] = useState(false);
    const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const displayName = capitalizeFirstLetter(wallet.name);
    const { open, closeTop } = useModal();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleWalletChange = useCallback((walletId: number) => {
        onWalletChange?.(walletId);
    }, [onWalletChange]);

    const handleCopyAddress = useCallback(async () => {
        if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
        try {
            await navigator.clipboard.writeText(wallet.address);
            setCopiedAddress(true);
            copyTimeoutRef.current = setTimeout(() => setCopiedAddress(false), 5000);
        } catch (err) { }
    }, [wallet.address]);

    return (
        <div className="flex flex-col items-start gap-12 self-stretch mb-4">
            <div className="flex flex-col items-start gap-2 self-stretch">
                <div className="flex items-center gap-1 self-stretch">
                    <TertiaryButton size="sm" onClick={onBackToWallets} variant="neutral">Wallets</TertiaryButton>
                    <span className="text-xs text-[var(--color-text-muted)]">/</span>
                    <Dropdown open={dropdownOpen} onOpenChange={setDropdownOpen}>
                        <DropdownTrigger>
                            <TertiaryButton
                                size="sm"
                                leadingIcon={walletIcon(wallet.type)}
                                variant="neutral"
                            >
                                {displayName}
                            </TertiaryButton>
                        </DropdownTrigger>
                        <DropdownMenu align="start" minWidth={240}>
                            <DropdownLabel>Vaults</DropdownLabel>
                            {wallets.filter(w => w.type === 1).map(w => (
                                <DropdownItem key={w.id} onSelect={() => handleWalletChange(w.id)} icon={walletIcon(w.type)}>
                                    {capitalizeFirstLetter(w.name)}
                                </DropdownItem>
                            ))}
                            <DropdownLabel>Gnosis Safes</DropdownLabel>
                            {wallets.filter(w => w.type === 2).map(w => (
                                <DropdownItem key={w.id} onSelect={() => handleWalletChange(w.id)} icon={walletIcon(w.type)}>
                                    {capitalizeFirstLetter(w.name)}
                                </DropdownItem>
                            ))}
                            <DropdownLabel>Tracked Wallets</DropdownLabel>
                            {wallets.filter(w => w.type === 3).map(w => (
                                <DropdownItem key={w.id} onSelect={() => handleWalletChange(w.id)} icon={walletIcon(w.type)}>
                                    {capitalizeFirstLetter(w.name)}
                                </DropdownItem>
                            ))}
                        </DropdownMenu>
                    </Dropdown>
                </div>

                <div className="flex justify-between items-start self-stretch">
                    <div className="flex flex-col items-start gap-1">
                        <div className="flex items-center gap-3">
                            <div className="text-[var(--color-icon-primary)]">
                                {renderTitleWalletIcon(wallet.type)}
                            </div>
                            <h1 className="text-[var(--color-text-primary)] font-display text-[28px] not-italic font-medium tracking-tight">
                                {displayName}
                            </h1>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <BlockchainIconStack blockchain={wallet.blockchain} size={16} max={4} />
                            <Tooltip content="Copy address" placement="top" delay={200}>
                                <div>
                                    <TertiaryButton
                                        onClick={handleCopyAddress}
                                        variant="neutral"
                                    >
                                        {`${wallet.address}`}
                                    </TertiaryButton>
                                </div>
                            </Tooltip>
                            {copiedAddress && <span className="text-xs text-[var(--color-text-brand)]">Copied</span>}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant={totalBalance === 0 ? "brand" : "neutral"}
                            appearance="filled"
                            flat
                            size="md"
                            leadingIcon={<RiQrCodeLine size={18} />}
                            onClick={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                open(
                                    <Modal onClose={closeTop} animation="expand" originRect={rect}>
                                        <MakeDeposit wallet={wallet} onClose={closeTop} />
                                    </Modal>
                                );
                            }}
                        >
                            Make deposit
                        </Button>
                        {totalBalance > 0 && wallet.type !== 3 && (
                            <Button
                                variant="neutral"
                                appearance="filled"
                                flat
                                size="md"
                                leadingIcon={<RiSendPlaneFill size={18} />}
                                onClick={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    open(
                                        <Modal onClose={closeTop} animation="expand" originRect={rect}>
                                            <SendTokens wallet={wallet} wallets={wallets} members={members} onClose={closeTop} />
                                        </Modal>
                                    );
                                }}>
                                Send tokens
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex w-full items-center gap-12 border-t border-white/5">
                <BalanceDisplay label="Proposed" value={proposed} />
                <BalanceDisplay label="Available" value={available} />
                <BalanceDisplay label="Total" value={totalBalance} />
            </div>
        </div>
    );
});

// Main component
interface WalletDetailsProps {
    wallet: Wallet;
    addresses?: AddressCardProps[];
    wallets?: Wallet[];
    cryptocurrencies?: Cryptocurrency[];
    members?: Member[];
    onWalletChange?: (walletId: number, activeTab?: string, activeProposalFilter?: ProposalCategory | null) => void;
}

export default function WalletDetails({
    wallet,
    addresses = [],
    wallets = [],
    cryptocurrencies = [],
    members = [],
    onWalletChange
}: WalletDetailsProps) {
    const router = useRouter();
    const { members: fetchedMembers } = useMembers();
    const effectiveMembers = useMemo(() => {
        return members.length > 0 ? members : (fetchedMembers || []);
    }, [members, fetchedMembers]);

    const tabOrder = useMemo(() => getTabOrder(wallet.type), [wallet.type]);
    const searchParams = useSearchParams();
    
    // Initialize tab state from URL params if available, otherwise default to first valid tab.
    // The algorithmic default logic runs below via useEffect.
    const [activeTab, setActiveTab] = useState<string>(() => {
        const urlTab = searchParams.get('tab');
        if (urlTab && tabOrder.includes(urlTab as any)) {
            return urlTab;
        }
        return tabOrder[0];
    });

    const [activeProposalFilter, setActiveProposalFilter] = useState<ProposalCategory | null>(() => {
        const urlSubTab = searchParams.get('subtab');
        if (urlSubTab) {
            return urlSubTab as ProposalCategory;
        }
        return null;
    });

    // Derived values
    const transformedProposals = useMemo(() => {
        if (!wallet.proposals) return [];
        const proposalsWithCalculations = wallet.proposals.map(proposal => {
            const outgoingUSD = proposal.outTokens && proposal.outUSDPrice
                ? proposal.outTokens * proposal.outUSDPrice
                : 0;

            let initiatorName = proposal.initiator;
            if (typeof (proposal.initiator as any) === 'number') {
                const member = members?.find(m => m.id === (proposal.initiator as any));
                if (member) {
                    initiatorName = member.name;
                }
            }

            return { ...proposal, initiator: initiatorName, outgoingUSD, wallet: wallet.name, walletType: wallet.type };
        });
        return transformApiDataToProposals(proposalsWithCalculations);
    }, [wallet.proposals, members, wallet.name, wallet.type]);

    const uniqueClassifications = useMemo(() => {
        return Array.from(
            new Set(transformedProposals.map((proposal: Proposal) => proposal.classification).filter(Boolean))
        ) as string[];
    }, [transformedProposals]);

    const proposalCategoryCounts = useMemo(() => {
        return {
            [ProposalCategory.NEEDS_APPROVAL]: transformedProposals.filter(p => p.status === ProposalStatus.ACTION_REQUIRED).length,
            [ProposalCategory.READY_TO_EXECUTE]: transformedProposals.filter(p => p.status === ProposalStatus.FAILED || p.status === ProposalStatus.READY).length,
            [ProposalCategory.DISCARDED]: transformedProposals.filter(p => p.status === ProposalStatus.FAILED_REJECTED || p.status === ProposalStatus.DECLINED).length,
        };
    }, [transformedProposals]);

    const filteredProposals = useMemo(() => {
        let proposalsList = transformedProposals;
        if (activeProposalFilter === ProposalCategory.NEEDS_APPROVAL) {
            proposalsList = transformedProposals.filter(p => p.status === ProposalStatus.ACTION_REQUIRED);
        } else if (activeProposalFilter === ProposalCategory.READY_TO_EXECUTE) {
            proposalsList = transformedProposals.filter(p => p.status === ProposalStatus.FAILED || p.status === ProposalStatus.READY);
        } else if (activeProposalFilter === ProposalCategory.DISCARDED) {
            proposalsList = transformedProposals.filter(p => p.status === ProposalStatus.FAILED_REJECTED || p.status === ProposalStatus.DECLINED);
        }

        return proposalsList.map((proposal, index, array) => {
            const currentDate = new Date(proposal.timestamp).toDateString();
            const prevDate = index > 0 ? new Date(array[index - 1].timestamp).toDateString() : null;
            const isFirstOfDate = index === 0 || currentDate !== prevDate;
            return {
                ...proposal,
                showDate: isFirstOfDate,
                isFirstOfDate
            };
        });
    }, [transformedProposals, activeProposalFilter]);

    const memoizedTransformedTransactions = useMemo(() => {
        return (wallet.transactions || []).map((transaction, index, array) => {
            const currentDate = new Date(transaction.timestamp).toDateString();
            const prevDate = index > 0 ? new Date(array[index - 1].timestamp).toDateString() : null;
            const isFirstOfDate = currentDate !== prevDate;

            let initiatorName = transaction.initiator;
            if (typeof (transaction.initiator as any) === 'number') {
                const member = members?.find(m => m.id === (transaction.initiator as any));
                if (member) {
                    initiatorName = member.name;
                }
            }

            const recipients = transaction.recipients || (transaction as any).toAddress;

            const incomingUSD = transaction.inTokens && transaction.inUSDPrice
                ? transaction.inTokens * transaction.inUSDPrice
                : 0;

            const outgoingUSD = transaction.outTokens && transaction.outUSDPrice
                ? transaction.outTokens * transaction.outUSDPrice
                : 0;

            const incoming = transaction.incoming ?? Boolean(transaction.inTokens && transaction.inTokens > 0);
            const outgoing = transaction.outgoing ?? Boolean(transaction.outTokens && transaction.outTokens > 0);
            const walletName = transaction.wallet || wallet.name;
            const walletType = transaction.walletType || wallet.type;
            const blockchain = transaction.blockchain || (typeof wallet.blockchain === 'string' ? wallet.blockchain : wallet.blockchain?.[0]?.blockchain || 'Unknown');

            return {
                ...transaction,
                incomingUSD,
                outgoingUSD,
                incoming,
                outgoing,
                wallet: walletName,
                walletType,
                blockchain,
                initiator: initiatorName,
                recipients,
                showDate: isFirstOfDate,
                isFirstOfDate
            };
        });
    }, [wallet.transactions, members, wallet.name, wallet.type, wallet.blockchain]);

    const transformedAssets = useMemo(() => {
        if (!wallet.balance) return [];

        const totalWalletUSD = wallet.balance.reduce((sum, asset) => sum + (asset.USD || 0), 0);

        return wallet.balance.map(asset => {
            return {
                uniqueId: asset.uniqueId || `${wallet.id}-${asset.assetId}`,
                assetId: asset.assetId,
                name: asset.name || '',
                fullName: asset.fullName || asset.name || '',
                symbol: asset.symbol || '',
                price: asset.price || 0,
                percent_change_24h: (asset as any).percent_change_24h || 0,
                tokens: asset.tokens || 0,
                totalTokens: asset.tokens || 0,
                USD: asset.USD || 0,
                percentageShareInUSD: totalWalletUSD > 0 ? ((asset.USD || 0) / totalWalletUSD) * 100 : 0,
                blockchain: typeof wallet.blockchain === 'string' ? wallet.blockchain : (wallet.blockchain && wallet.blockchain[0]?.blockchain) || "Ethereum",
                wallets: [{
                    id: wallet.id,
                    name: wallet.name,
                    walletType: wallet.type,
                    address: wallet.address,
                    tokens: asset.tokens || 0,
                    USD: asset.USD || 0
                }]
            };
        });
    }, [wallet]);

    const { totalBalance, proposed, available } = useMemo(() => {
        const total = (wallet.balance || []).reduce((sum, asset) => sum + (asset.tokens * asset.price), 0);
        const proposedAmount = transformedProposals
            .filter(proposal =>
                [ProposalStatus.ACTION_REQUIRED, ProposalStatus.NO_ACTION, ProposalStatus.ACTIONED,
                ProposalStatus.READY, ProposalStatus.EXECUTING, ProposalStatus.AWAITING_NONCE].includes(proposal.status)
            )
            .reduce((sum: number, proposal: Proposal) =>
                sum + (proposal.outTokens * (proposal.outUSDPrice || 0)), 0);
        return { totalBalance: total, proposed: proposedAmount, available: total - proposedAmount };
    }, [wallet.balance, transformedProposals]);

    const calculateHighestCountSubtitle = useCallback(() => {
        const counts = proposalCategoryCounts;
        let highestCategory: ProposalCategory = ProposalCategory.NEEDS_APPROVAL;
        let highestCount = -1;
        const mainCategories = [ProposalCategory.NEEDS_APPROVAL, ProposalCategory.READY_TO_EXECUTE, ProposalCategory.DISCARDED];
        mainCategories.forEach((category) => {
            if (counts[category] > highestCount) {
                highestCount = counts[category];
                highestCategory = category;
            }
        });
        return highestCategory;
    }, [proposalCategoryCounts]);

    const getDefaultTabForWallet = useCallback(() => {
        if (wallet.type === 3) {
            return { tab: 'assets', proposalFilter: null };
        }

        const needsApprovalCount = proposalCategoryCounts[ProposalCategory.NEEDS_APPROVAL];
        const readyToExecuteCount = proposalCategoryCounts[ProposalCategory.READY_TO_EXECUTE];
        const discardedCount = proposalCategoryCounts[ProposalCategory.DISCARDED];

        const shouldAutoSwitch = totalBalance === 0 &&
            needsApprovalCount === 0 &&
            readyToExecuteCount === 0 &&
            discardedCount === 0;

        if (shouldAutoSwitch) {
            return { tab: 'assets', proposalFilter: null };
        }

        const highestSubtitle = calculateHighestCountSubtitle();
        return { tab: 'proposals', proposalFilter: highestSubtitle };
    }, [wallet.type, totalBalance, proposalCategoryCounts, calculateHighestCountSubtitle]);

    const isInitialMount = useRef(true);
    const prevWalletId = useRef(wallet.id);

    useEffect(() => {
        const defaultTabState = getDefaultTabForWallet();
        const currentTabOrder = getTabOrder(wallet.type);
        
        if (isInitialMount.current) {
            isInitialMount.current = false;
            prevWalletId.current = wallet.id;
            
            // If URL provided a specific tab, don't override it with the algorithm
            if (!searchParams.has('tab')) {
                setActiveTab(defaultTabState.tab);
                if (defaultTabState.proposalFilter) {
                    setActiveProposalFilter(defaultTabState.proposalFilter);
                }
            }
        } else if (prevWalletId.current !== wallet.id) {
            prevWalletId.current = wallet.id;
            
            const isCurrentTabValid = currentTabOrder.includes(activeTab as any);

            // When navigating via URL params (like from dropdown), the state will already be 
            // initialized correctly if the component remounted, but if it didn't remount, 
            // we should still validate it.
            if (!isCurrentTabValid) {
                setActiveTab(defaultTabState.tab);
                if (defaultTabState.proposalFilter) {
                    setActiveProposalFilter(defaultTabState.proposalFilter);
                }
            } else if (activeTab === 'proposals') {
                const highestSubtitle = calculateHighestCountSubtitle();
                if (!activeProposalFilter) {
                    setActiveProposalFilter(highestSubtitle);
                }
            }
        }
    }, [wallet.id, wallet.type, activeTab, activeProposalFilter, getDefaultTabForWallet, calculateHighestCountSubtitle, searchParams]);

    const handleBackToWallets = useCallback(() => {
        router.push('/wallets');
    }, [router]);

    // Renders
    return (
        <div className="w-full flex flex-col">
            <div className="w-full">
                <WalletHeader
                    wallet={wallet}
                    proposed={proposed}
                    available={available}
                    totalBalance={totalBalance}
                    wallets={wallets}
                    members={members}
                    onWalletChange={(id) => onWalletChange?.(id, activeTab, activeProposalFilter || undefined)}
                    onBackToWallets={handleBackToWallets}
                />

                <div className="flex items-stretch gap-8 self-stretch border-b border-[var(--color-border-subtle)] w-full">
                    {wallet.type !== 3 && (
                        <NavTab
                            title="Proposals"
                            isActive={activeTab === 'proposals'}
                            onClick={() => setActiveTab('proposals')}
                            subtitles={[
                                { name: PROPOSAL_CATEGORY_LABEL[ProposalCategory.NEEDS_APPROVAL], count: proposalCategoryCounts[ProposalCategory.NEEDS_APPROVAL], color: "cyan" },
                                { name: PROPOSAL_CATEGORY_LABEL[ProposalCategory.READY_TO_EXECUTE], count: proposalCategoryCounts[ProposalCategory.READY_TO_EXECUTE], color: "white" },
                                { name: PROPOSAL_CATEGORY_LABEL[ProposalCategory.DISCARDED], count: proposalCategoryCounts[ProposalCategory.DISCARDED], color: "red" }
                            ]}
                            activeSubtitle={activeProposalFilter ? getHumanReadableCategory(activeProposalFilter) : null}
                            onSubtitleClick={(subtitleName) => {
                                setActiveTab('proposals');
                                setActiveProposalFilter(getCategoryFromHumanReadable(subtitleName));
                            }}
                        />
                    )}
                    <NavTab
                        title="Assets"
                        titleCount={wallet.balance?.length ?? 0}
                        isActive={activeTab === 'assets'}
                        onClick={() => setActiveTab('assets')}
                    />
                    <NavTab
                        title="Transactions"
                        titleCount={wallet.transactions?.length ?? 0}
                        isActive={activeTab === 'transactions'}
                        onClick={() => setActiveTab('transactions')}
                    />
                    {wallet.type !== 3 && (
                        <NavTab
                            title="Policy"
                            isActive={activeTab === 'policy'}
                            onClick={() => setActiveTab('policy')}
                        />
                    )}
                </div>
            </div>

            {/* Content Tabs */}
            <div className="w-full">
                {activeTab === 'proposals' && (
                    <div className="w-full">
                        {filteredProposals.length === 0 ? (
                            <div className="text-center py-16 text-[var(--color-text-muted)] border border-white/5 rounded-3xl">
                                No proposals found
                            </div>
                        ) : (
                            <ProposalList
                                proposals={filteredProposals}
                                addresses={addresses}
                                uniqueClassifications={uniqueClassifications}
                            />
                        )}
                    </div>
                )}

                {activeTab === 'assets' && (
                    <div className="w-full">
                        {transformedAssets.length > 0 ? (
                            <div className="flex flex-col w-full">
                                <div className="flex w-full items-center gap-4 py-2 px-4 border-b border-[var(--color-border-subtle)] text-xs text-[var(--color-text-muted)]">
                                    <span className="w-[242px] tracking-tight shrink-0">Token & Network</span>
                                    <div className="flex w-[248px] items-center justify-between shrink-0">
                                        <span className="w-[116px] text-right tracking-tight">Price</span>
                                        <span className="w-[116px] tracking-tight text-left">Last 24 Hrs</span>
                                    </div>
                                    <div className="flex w-[336px] items-center justify-between shrink-0">
                                        <span className="w-[160px] text-right tracking-tight">Token value</span>
                                        <span className="w-[160px] text-left">USD</span>
                                    </div>
                                    <span className="w-[146px] tracking-tight shrink-0">Wallets</span>
                                </div>
                                <AssetList assets={transformedAssets as any} />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center py-16 border border-white/5 rounded-3xl bg-[var(--color-surface-sunken)]">
                                <span className="text-[var(--color-text-primary)] text-xl font-medium mb-1">
                                    {wallet.name} has no assets
                                </span>
                                <span className="text-[var(--color-text-muted)] text-sm mb-8">
                                    Make deposit to start using wallet
                                </span>
                                <QRCodeSVG
                                    value={wallet.address}
                                    size={200}
                                    bgColor="transparent"
                                    fgColor="white"
                                    level="L"
                                />
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'transactions' && (
                    <div className="w-full">
                        {wallet.transactions && wallet.transactions.length > 0 ? (
                            <div className="flex flex-col items-end self-stretch w-full">
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
                                    transactions={memoizedTransformedTransactions as any}
                                    addresses={addresses}
                                    uniqueClassifications={uniqueClassifications}
                                />
                            </div>
                        ) : (
                            <div className="text-center py-16 text-[var(--color-text-muted)] border border-white/5 rounded-3xl">
                                No transactions found
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'policy' && wallet.type !== 3 && (
                    <div className="w-full">
                        <PolicyContent wallet={wallet} cryptocurrencies={cryptocurrencies} members={effectiveMembers} />
                    </div>
                )}
            </div>
        </div>
    );
}
