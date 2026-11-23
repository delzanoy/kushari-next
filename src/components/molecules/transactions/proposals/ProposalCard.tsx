"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  RiCheckboxCircleLine,
  RiExternalLinkLine,
  RiLoaderFill,
  RiInformationFill,
} from "@remixicon/react";
import { cn } from "@/lib/utils";
import { Proposal, ProposalStatus } from "./types";
import { AddressCardProps } from "@/components/molecules/address-book/addresses/types";
import { BlockchainIconStack } from "@/components/atoms/BlockchainIconStack";
import { RecipientDisplay } from "../RecipientDisplay";
import { ClassificationDropdown } from "../view-all/ClassificationDropdown";
import { useModal } from "@/components/molecules/modal/useModal";
import { Modal } from "@/components/molecules/modal/Modal";
import ReviewProposalModal from "./modals/ReviewProposalModal";
import { Tooltip } from "@/components/atoms/Tooltip";
import { TertiaryButton } from "@/components/atoms/TertiaryButton";
import { IconButton } from "@/components/atoms/IconButton";
import { Avatar, presetForName } from "@/components/atoms/Avatar";
import { Button } from "@/components/atoms/Button";
import { MODAL_WIDTH } from "@/components/molecules/modal/Modal";
import { pressable } from "@/lib/pressable";
import { walletIcon } from "@/components/atoms/WalletIcon";

interface Props {
    proposal: Proposal & { showDate?: boolean; isFirstOfDate?: boolean };
    uniqueClassifications: string[];
    addresses: AddressCardProps[];
    wallets?: any[];
    userGroups?: any[];
    addressGroups?: Record<number, number[]>;
    onUpdateClassification?: (proposalId: string, newClassification: string) => void;
}

const getExplorerUrl = (blockchain: string, id: string) => {
    switch (blockchain.toLowerCase()) {
        case "ethereum": return `https://etherscan.io/tx/${id}`;
        case "polygon": return `https://polygonscan.com/tx/${id}`;
        case "optimism": return `https://optimistic.etherscan.io/tx/${id}`;
        case "bsc": return `https://bscscan.com/tx/${id}`;
        case "solana": return `https://solscan.io/tx/${id}`;
        default: return `https://etherscan.io/tx/${id}`;
    }
};

const getExplorerName = (blockchain: string) => {
    switch (blockchain.toLowerCase()) {
        case "ethereum": return "Etherscan";
        case "polygon": return "Polygonscan";
        case "optimism": return "Optimistic Etherscan";
        case "bsc": return "BscScan";
        case "solana": return "Solscan";
        default: return "Block Explorer";
    }
};

export default function ProposalCard({ proposal, addresses, wallets, uniqueClassifications, userGroups, addressGroups, onUpdateClassification }: Props) {
    const [hovered, setHovered] = useState(false);
    const [copied, setCopied] = useState(false);
    const { open, closeTop } = useModal();

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
            case ProposalStatus.ACTION_REQUIRED: return "Action required";
            case ProposalStatus.NO_ACTION: return "No action";
            case ProposalStatus.ACTIONED: return "Actioned";
            case ProposalStatus.READY: return "Ready";
            case ProposalStatus.FAILED: return "Failed";
            case ProposalStatus.EXECUTING: return "Executing";
            case ProposalStatus.AWAITING_NONCE: return "Awaiting nonce";
            case ProposalStatus.DECLINED: return "Declined";
            case ProposalStatus.FAILED_REJECTED: return "Failed";
            default: return status;
        }
    };

    const handleCopyHash = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        (async () => {
            try {
                await navigator.clipboard.writeText(proposal.id);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error("Failed to copy hash:", err);
                const textArea = document.createElement("textarea");
                textArea.value = proposal.id;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand("copy");
                document.body.removeChild(textArea);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        })();
    }, [proposal.id]);

    const handleExplorerClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        window.open(getExplorerUrl(proposal.blockchain, proposal.id), "_blank");
    }, [proposal.blockchain, proposal.id]);

    const formattedDate = format(new Date(proposal.timestamp), "d MMM yyyy HH:mm");
    const initiator = proposal.initiator || "Unknown";
    const executer = "Multisig Executor";
    const hasAction = (proposal.status === ProposalStatus.READY ||
        proposal.status === ProposalStatus.FAILED ||
        proposal.status === ProposalStatus.FAILED_REJECTED ||
        proposal.status === ProposalStatus.DECLINED);

    const formatDateHeader = (timestamp: number | string | Date): string => {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) return "";

        const today = new Date();
        const targetStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

        const diffInDays = Math.round((todayStart - targetStart) / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) {
            return "Today";
        } else if (diffInDays === 1) {
            return "Yesterday";
        } else if (diffInDays === 2) {
            return "2 days ago";
        } else {
            return format(date, "MMM d, yyyy");
        }
    };

    const dateText = (() => {
        const isHovered = hovered;
        const isTopCardOfDate = proposal.showDate ?? (proposal as any).isFirstOfDate ?? (proposal as any).titleTransaction ?? false;

        // Hover: Always show full date and time no matter what
        if (isHovered) {
            return format(new Date(proposal.timestamp), "MMM d, yyyy, h:mm a");
        }

        // Not hovered: Show relative date header on top proposal card of each date group
        if (isTopCardOfDate) {
            return formatDateHeader(proposal.timestamp);
        }

        return "";
    })();

    const getStatusStyle = () => {
        switch (proposal.status) {
            case ProposalStatus.ACTION_REQUIRED:
                return hovered
                    ? "bg-[color-mix(in_srgb,var(--color-text-brand)_8%,transparent)] border-[color-mix(in_srgb,var(--color-text-brand)_30%,transparent)]"
                    : "bg-[color-mix(in_srgb,var(--color-text-brand)_4%,transparent)] border-[var(--color-border-subtle)]";
            case ProposalStatus.FAILED:
            case ProposalStatus.FAILED_REJECTED:
                return hovered
                    ? "bg-[color-mix(in_srgb,var(--color-text-danger)_8%,transparent)] border-[color-mix(in_srgb,var(--color-text-danger)_30%,transparent)]"
                    : "bg-[color-mix(in_srgb,var(--color-text-danger)_4%,transparent)] border-[var(--color-border-subtle)]";
            default:
                return hovered
                    ? "bg-[rgba(255,255,255,0.06)] border-[var(--color-border-default)]"
                    : "bg-transparent border-[var(--color-border-subtle)]";
        }
    };

    const handleAction = () => {
        open(
            <Modal onClose={closeTop}>
                <div className={`flex ${MODAL_WIDTH.small} p-6 flex-col items-center gap-4 rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-sunken)] shadow-2xl text-center`}>
                    <h3 className="text-[var(--color-text-primary)] text-lg font-semibold">
                        {proposal.status === ProposalStatus.READY ? "Execute Proposal" :
                            proposal.status === ProposalStatus.FAILED || proposal.status === ProposalStatus.FAILED_REJECTED ? "Retry Proposal" :
                                proposal.status === ProposalStatus.DECLINED ? "Edit Proposal" : "Proposal Action"}
                    </h3>
                    <p className="text-[var(--color-text-muted)] text-sm">
                        This action is simulated for demo purposes.
                    </p>
                    <Button size="sm" variant="brand" appearance="filled" onClick={closeTop}>
                        Dismiss
                    </Button>
                </div>
            </Modal>
        );
    };

    const handleCardClick = (e: React.MouseEvent) => {
        const target = e.target as HTMLElement;
        const isClassificationClick = target.closest("[data-classification]");

        if (!isClassificationClick) {
            const rect = e.currentTarget.getBoundingClientRect();
            open(
                <Modal onClose={closeTop} animation="expand" originRect={rect}>
                    <ReviewProposalModal
                        proposal={proposal}
                        addresses={addresses}
                        wallets={wallets}
                        uniqueClassifications={uniqueClassifications}
                        userGroups={userGroups}
                        addressGroups={addressGroups}
                        onClose={closeTop}
                        onUpdateClassification={onUpdateClassification}
                    />
                </Modal>
            );
        }
    };

    return (
        <div className="flex flex-col w-full">
            <motion.div {...pressable()}
                className={cn(
                    "group/tx flex flex-col w-full max-w-[1040px] mx-auto cursor-pointer border-b transition-all duration-200",
                    getStatusStyle()
                )}
                onHoverStart={() => setHovered(true)}
                onHoverEnd={() => setHovered(false)}
                onClick={handleCardClick}
            >
                <div className="flex flex-col w-full self-stretch py-1">
                    {/* Date Row */}
                    <div className="flex items-center pl-4 select-none min-h-[14px]">
                        <Tooltip content={format(new Date(proposal.timestamp), "MMM d, yyyy, h:mm a")} placement="top" delay={200}>
                            <span className="text-[var(--color-text-muted)] text-[10px] font-normal leading-none transition-colors duration-150">
                                {dateText}
                            </span>
                        </Tooltip>
                    </div>

                    {/* Columns Row */}
                    <div className="flex w-full items-center gap-4 self-stretch pb-3">
                        {/* Initiated */}
                        <div className="flex w-40 shrink-0 items-center gap-2 pl-4 min-w-0">
                            <Avatar name={initiator} size="sm" preset={presetForName(initiator)} />
                            <span className="text-[var(--color-text-primary)] text-sm font-medium tracking-tight truncate leading-tight">
                                {initiator}
                            </span>
                        </div>

                        {/* Wallet & Network */}
                        <div className="flex w-40 shrink-0 items-center gap-2 min-w-0">
                            <span className="shrink-0 relative flex items-center">
                                {walletIcon(proposal.walletType, { size: 18, muted: true, fallback: 3 })}
                                <div className="absolute bottom-[14px] left-[12px]">
                                    <BlockchainIconStack blockchain={proposal.blockchain} size={12} />
                                </div>
                            </span>
                            <span className="text-[var(--color-text-primary)] text-sm font-medium tracking-tight truncate">
                                {proposal.wallet}
                            </span>
                        </div>

                        {/* To/From */}
                        <div className="flex w-40 shrink-0 items-center gap-2 min-w-0">
                            <RecipientDisplay
                                multiRecipient={proposal.multiRecipient}
                                recipients={proposal.recipients}
                                addresses={addresses}
                                userGroups={userGroups}
                                addressGroups={addressGroups}
                            />
                        </div>

                        {/* Outgoing */}
                        <div className="relative flex w-32 shrink-0 flex-col justify-center min-w-0 h-5">
                            <span className="text-[var(--color-text-primary)] text-sm font-medium tracking-tight truncate leading-tight">
                                ${(proposal.outgoingUSD ?? (proposal.outTokens && proposal.outUSDPrice ? proposal.outTokens * proposal.outUSDPrice : 0)).toFixed(2)}
                            </span>
                            <span className="absolute top-5 left-0 text-[var(--color-text-muted)] text-[10px] font-light tracking-tight truncate leading-none w-full">
                                {proposal.outTokenSymbol} {proposal.outTokens}
                            </span>
                        </div>

                        {/* Classification */}
                        <div className="flex w-40 shrink-0 items-center justify-between min-w-0" data-classification>
                            <ClassificationDropdown
                                options={uniqueClassifications}
                                value={proposal.classification}
                                onChange={(newVal) => onUpdateClassification?.(proposal.id, newVal)}
                            />
                        </div>

                        {/* Status */}
                        <div className="relative flex w-40 shrink-0 items-center min-w-0 pr-4 h-8">
                            <div className={cn(
                                "flex items-center transition-opacity duration-200 w-fit",
                                (proposal.status === ProposalStatus.ACTION_REQUIRED ||
                                    proposal.status === ProposalStatus.FAILED ||
                                    proposal.status === ProposalStatus.FAILED_REJECTED)
                                    ? "gap-1.5 pl-1 pr-2.5 py-0.5 rounded-full border border-solid ml-[-5px]"
                                    : "gap-1.5",
                                proposal.status === ProposalStatus.ACTION_REQUIRED && "border-[var(--color-border-brand)] bg-[color-mix(in_srgb,var(--color-text-brand)_8%,transparent)]",
                                (proposal.status === ProposalStatus.FAILED || proposal.status === ProposalStatus.FAILED_REJECTED) && "border-[var(--color-text-danger)] bg-[color-mix(in_srgb,var(--color-text-danger)_8%,transparent)]"
                            )}>
                                {renderStatusIcon(proposal.status)}
                                <span className={cn(
                                    "text-[var(--color-text-primary)] text-xs whitespace-nowrap leading-none",
                                    (proposal.status === ProposalStatus.ACTION_REQUIRED ||
                                        proposal.status === ProposalStatus.FAILED ||
                                        proposal.status === ProposalStatus.FAILED_REJECTED)
                                        ? "font-semibold"
                                        : "font-medium"
                                )}>
                                    {formatStatusName(proposal.status)}
                                </span>
                                {proposal.status === ProposalStatus.AWAITING_NONCE && hovered && (
                                    <Tooltip content="This transaction is queued because a previous transaction must complete first.">
                                        <span className="inline-flex shrink-0 ml-0.5">
                                            <RiInformationFill className="text-[var(--color-text-brand)] w-3.5 h-3.5" />
                                        </span>
                                    </Tooltip>
                                )}
                            </div>
                            {/* Action Button on Hover */}
                            {hasAction && (
                                <div className="absolute inset-0 flex items-center justify-end opacity-0 group-hover/tx:opacity-100 group-focus-within/tx:opacity-100 transition-opacity duration-200 pointer-events-none group-hover/tx:pointer-events-auto pr-4">
                                    <TertiaryButton
                                        size="sm"
                                        variant={proposal.status === ProposalStatus.READY ? "brand" : "neutral"}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAction();
                                        }}
                                    >
                                        {proposal.status === ProposalStatus.READY ? "Execute" :
                                            proposal.status === ProposalStatus.FAILED ? "Retry" :
                                                proposal.status === ProposalStatus.FAILED_REJECTED ? "Re-submit" :
                                                    proposal.status === ProposalStatus.DECLINED ? "Edit" : "Action"}
                                    </TertiaryButton>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
