"use client";

import { useState, useCallback } from "react";
import { RiExternalLinkLine, RiCheckboxCircleLine, RiRefreshLine } from "@remixicon/react";
import { TertiaryButton } from "@/components/atoms/TertiaryButton";
import { IconButton } from "@/components/atoms/IconButton";
import { TransactionDetailsProps } from "./types";
import { format } from "date-fns";
import { Tooltip } from "@/components/atoms/Tooltip";

export default function TransactionDetails({ transaction }: TransactionDetailsProps) {
    const [copied, setCopied] = useState(false);

    const getExplorerName = useCallback((blockchain: string) => {
        switch (blockchain.toLowerCase()) {
            case "ethereum":
            case "eth":
                return "Etherscan";
            case "polygon":
            case "matic":
                return "Polyscan";
            case "optimism":
            case "op":
                return "Optimism Explorer";
            case "base":
                return "Basescan";
            case "bsc":
            case "bnb":
                return "BscScan";
            case "solana":
            case "sol":
                return "Solscan";
            default:
                return "Block Explorer";
        }
    }, []);

    const getExplorerUrl = useCallback((blockchain: string, id: string) => {
        switch (blockchain.toLowerCase()) {
            case "ethereum":
            case "eth":
                return `https://etherscan.io/tx/${id}`;
            case "polygon":
            case "matic":
                return `https://polygonscan.com/tx/${id}`;
            case "optimism":
            case "op":
                return `https://optimistic.etherscan.io/tx/${id}`;
            case "base":
                return `https://basescan.org/tx/${id}`;
            case "bsc":
            case "bnb":
                return `https://bscscan.com/tx/${id}`;
            case "solana":
            case "sol":
                return `https://solscan.io/tx/${id}`;
            default:
                return `https://etherscan.io/tx/${id}`;
        }
    }, []);

    const showApprovalSteps =
        (transaction.walletType === 1 || transaction.walletType === 2) &&
        transaction.outgoing &&
        !transaction.incoming;

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return {
            date: format(date, "d MMM yyyy"),
            time: format(date, "HH:mm")
        };
    };

    const formattedDate = formatDate(transaction.timestamp);
    const initiator = transaction.initiator || "Unknown";
    const executer = transaction.executer || "Unknown";

    const handleCopyHash = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        (async () => {
            try {
                await navigator.clipboard.writeText(transaction.id);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error("Failed to copy hash:", err);
                const textArea = document.createElement("textarea");
                textArea.value = transaction.id;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand("copy");
                document.body.removeChild(textArea);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        })();
    }, [transaction.id]);

    const handleHashContainerClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
    }, []);

    const handleExplorerClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        window.open(getExplorerUrl(transaction.blockchain, transaction.id), "_blank");
    }, [transaction.blockchain, transaction.id, getExplorerUrl]);

    const gasTokenSymbol = transaction.gasTokenSymbol || "ETH";
    const gasFee = transaction.gasFee !== undefined ? transaction.gasFee : 0.00000002;
    // Token amounts keep full precision but as a plain decimal: 2e-8 reads "0.00000002".
    const gasFeeText = gasFee.toLocaleString("en-US", { useGrouping: false, maximumSignificantDigits: 15 });
    const gasFeeUSD = transaction.gasFeeUSD !== undefined ? transaction.gasFeeUSD : 0.000037;
    // Dollar amounts show at most 2 decimals; a fee too small for that reads "<$0.01", not "$0.00".
    const gasFeeUSDText = gasFeeUSD > 0 && gasFeeUSD < 0.01 ? "<$0.01" : `$${gasFeeUSD.toFixed(2)}`;

    return (
        <div className="flex flex-col items-start w-full bg-transparent px-4 py-3">
            {showApprovalSteps && (
                <div className="flex -mx-4 py-3 items-start gap-4 self-stretch mb-3">
                    {/* Initiated Step */}
                    <div className="flex w-40 shrink-0 flex-col items-start gap-1 pl-4">
                        <div className="flex w-full items-center gap-1.5 text-[var(--color-text-brand)]">
                            <RiCheckboxCircleLine size={16} />
                            <span className="text-sm font-medium tracking-tight">Initiated</span>
                        </div>
                        <div className="flex pl-[22px] flex-col items-start">
                            <span className="text-[var(--color-text-primary)] text-xs font-semibold">{initiator}</span>
                            <span className="text-[var(--color-text-muted)] text-[10px]">
                                {formattedDate.date} <span className="font-light">{formattedDate.time}</span>
                            </span>
                        </div>
                    </div>

                    {/* Approved Step */}
                    <div className="flex w-40 shrink-0 flex-col items-start gap-1">
                        <div className="flex w-full items-center gap-1.5 text-[var(--color-text-brand)]">
                            <RiCheckboxCircleLine size={16} />
                            <span className="text-sm font-medium tracking-tight">Approved</span>
                        </div>
                        <div className="flex pl-[22px] flex-col items-start gap-1">
                            <TertiaryButton variant="neutral" hoverVariant="brand" size="sm">Details</TertiaryButton>
                            <span className="text-[var(--color-text-muted)] text-[10px]">
                                {formattedDate.date} <span className="font-light">{formattedDate.time}</span>
                            </span>
                        </div>
                    </div>

                    {/* Executed Step */}
                    <div className="flex w-40 shrink-0 flex-col items-start gap-1">
                        <div className="flex w-full items-center gap-1.5 text-[var(--color-text-brand)]">
                            <RiCheckboxCircleLine size={16} />
                            <span className="text-sm font-medium tracking-tight">Executed</span>
                        </div>
                        <div className="flex pl-[22px] flex-col items-start">
                            <span className="text-[var(--color-text-primary)] text-xs font-semibold">{executer}</span>
                            <span className="text-[var(--color-text-muted)] text-[10px]">
                                {formattedDate.date} <span className="font-light">{formattedDate.time}</span>
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Transaction Hash and Gas Fees */}
            <div className="flex justify-between items-center self-stretch w-full">
                {/* Gas Fees */}
                <div className="flex items-center gap-2">
                    <span className="text-[var(--color-text-muted)] text-xs font-normal">
                        Gas fees
                    </span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-[var(--color-text-primary)] text-xs font-medium">
                            {gasTokenSymbol} {gasFeeText}
                        </span>
                        <span className="text-[var(--color-text-muted)] text-[10px] font-light">
                            ({gasFeeUSDText})
                        </span>
                    </div>
                </div>

                {/* Transaction Hash */}
                <div className="flex items-center gap-2" onClick={handleHashContainerClick}>
                    <span className="text-[var(--color-text-muted)] text-xs font-normal">Transaction hash</span>
                    <Tooltip content="Copy hash">
                        <TertiaryButton
                            size="sm"
                            variant={copied ? "brand" : "neutral"}
                            hoverVariant="brand"
                            onClick={handleCopyHash}
                        >
                            {copied ? "Copied!" : transaction.id}
                        </TertiaryButton>
                    </Tooltip>
                    <Tooltip content={`Explore on ${getExplorerName(transaction.blockchain)}`}>
                        <IconButton
                            icon={<RiExternalLinkLine />}
                            size="sm"
                            variant="neutral"
                            appearance="ghost"
                            flat
                            aria-label="View on explorer"
                            onClick={handleExplorerClick}
                        />
                    </Tooltip>
                </div>
            </div>
        </div>
    );
}
