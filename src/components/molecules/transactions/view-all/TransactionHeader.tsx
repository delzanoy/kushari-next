"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
    RiArrowRightUpLine,
    RiArrowLeftDownLine,
    RiSafeLine,
    RiFileTextLine,
    RiExpandDiagonalLine,
    RiWalletLine,
    RiUserLine,
    RiGroupLine,
    RiHashtag,
} from "@remixicon/react";
import { GnosisSafeIcon } from "@/media/icons/GnosisSafeIcon";
import { BlockchainIconStack } from "@/components/atoms/BlockchainIconStack";
import { TransactionHeaderProps } from "./types";
import { determineMultirecipients } from "./calculations";
import { ClassificationDropdown } from "./ClassificationDropdown";
import { RecipientDisplay } from "../RecipientDisplay";

interface ExtendedHeaderProps extends TransactionHeaderProps {
    expanded: boolean;
    hovered?: boolean;
    userGroups?: any[];
    addressGroups?: Record<number, number[]>;
}

export default function TransactionHeader({ transaction, addresses, uniqueClassifications, expanded, hovered, userGroups, addressGroups, onUpdateClassification }: ExtendedHeaderProps) {
    const router = useRouter();

    const getTransactionIcon = () => {
        if (transaction.incoming && transaction.outgoing) return <RiExpandDiagonalLine size={16} className="text-[var(--color-icon-muted)]" />;
        if (transaction.incoming) return <RiArrowLeftDownLine size={16} className="text-[var(--color-icon-muted)]" />;
        if (transaction.outgoing) return <RiArrowRightUpLine size={16} className="text-[var(--color-icon-muted)]" />;
        return <RiFileTextLine size={16} className="text-[var(--color-icon-muted)]" />;
    };

    const getTransactionTypeLabel = () => {
        if (transaction.incoming && transaction.outgoing) return "Interacted";
        if (transaction.incoming) return "Received";
        if (transaction.outgoing) return "Sent";
        return "Unknown";
    };

    const renderWalletIcon = (walletType: number) => {
        switch (walletType) {
            case 1: return <RiSafeLine size={18} className="text-[var(--color-icon-muted)]" />;
            case 2: return <GnosisSafeIcon size={18} color="var(--color-icon-secondary)" />;
            case 3: return <RiWalletLine size={18} className="text-[var(--color-icon-muted)]" />;
            default: return <RiWalletLine size={18} className="text-[var(--color-icon-muted)]" />;
        }
    };



    const dateText = (() => {
        const isHoveredOrExpanded = hovered || expanded;
        if (transaction.showDate) {
            return isHoveredOrExpanded
                ? format(new Date(transaction.timestamp), "MMM d, yyyy, h:mm a")
                : format(new Date(transaction.timestamp), "MMM d, yyyy");
        } else {
            return isHoveredOrExpanded
                ? format(new Date(transaction.timestamp), "h:mm a")
                : "";
        }
    })();

    return (
        <div className="flex flex-col w-full self-stretch py-1">
            {/* Date Row (stably positioned above the columns to keep alignment uniform) */}
            <div className="flex items-center pl-4 select-none min-h-[14px]">
                <span className="text-[var(--color-text-muted)] text-[10px] font-normal leading-none">
                    {dateText}
                </span>
            </div>

            {/* Columns Row */}
            <div className="flex w-full items-center gap-4 self-stretch pb-3">
                {/* Type */}
                <div className="flex w-40 shrink-0 items-center gap-2 pl-4">
                    {getTransactionIcon()}
                    <span className="text-[var(--color-text-primary)] text-sm font-medium tracking-tight truncate leading-tight">
                        {getTransactionTypeLabel()}
                    </span>
                </div>

                {/* Wallet & Network */}
                <div className="flex w-40 shrink-0 items-center gap-2 min-w-0">
                    <span className="shrink-0 relative flex items-center">
                        {renderWalletIcon(transaction.walletType)}
                        <div className="absolute bottom-[14px] left-[12px]">
                            <BlockchainIconStack blockchain={transaction.blockchain} size={12} />
                        </div>
                    </span>
                    <span className="text-[var(--color-text-primary)] text-sm font-medium tracking-tight truncate">{transaction.wallet}</span>
                </div>

                {/* To/From */}
                <div className="flex w-40 shrink-0 items-center gap-2 min-w-0">
                    <RecipientDisplay
                        multiRecipient={transaction.multiRecipient}
                        recipients={transaction.recipients}
                        addresses={addresses}
                        userGroups={userGroups}
                        addressGroups={addressGroups}
                    />
                </div>

                {/* In */}
                <div className="relative flex w-32 shrink-0 flex-col justify-center min-w-0 h-5">
                    {transaction.incoming ? (
                        <>
                            <span className="text-[var(--color-text-success)] text-sm font-medium tracking-tight truncate leading-tight">
                                ${(transaction.incomingUSD ?? (transaction.inTokens && transaction.inUSDPrice ? transaction.inTokens * transaction.inUSDPrice : 0)).toFixed(2)}
                            </span>
                            <span className="absolute top-5 left-0 text-[var(--color-text-muted)] text-[10px] font-light tracking-tight truncate leading-none w-full">
                                {transaction.inTokenSymbol} {transaction.inTokens}
                            </span>
                        </>
                    ) : (
                        <span className="text-[var(--color-text-disabled)] text-sm font-light">-</span>
                    )}
                </div>

                {/* Out */}
                <div className="relative flex w-32 shrink-0 flex-col justify-center min-w-0 h-5">
                    {transaction.outgoing ? (
                        <>
                            <span className="text-[var(--color-text-primary)] text-sm font-medium tracking-tight truncate leading-tight">
                                ${(transaction.outgoingUSD ?? (transaction.outTokens && transaction.outUSDPrice ? transaction.outTokens * transaction.outUSDPrice : 0)).toFixed(2)}
                            </span>
                            <span className="absolute top-5 left-0 text-[var(--color-text-muted)] text-[10px] font-light tracking-tight truncate leading-none w-full">
                                {transaction.outTokenSymbol} {transaction.outTokens}
                            </span>
                        </>
                    ) : (
                        <span className="text-[var(--color-text-disabled)] text-sm font-light">-</span>
                    )}
                </div>

                {/* Classification */}
                <div className="flex flex-1 items-center justify-between min-w-0 pr-4" data-classification>
                    <ClassificationDropdown
                        options={uniqueClassifications}
                        value={transaction.classification}
                        onChange={(newVal) => onUpdateClassification?.(transaction.id, newVal)}
                    />
                </div>
            </div>
        </div>
    );
}
