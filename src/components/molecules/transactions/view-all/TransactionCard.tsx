"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { TransactionWithCalculations } from "./types";
import { AddressCardProps } from "@/components/molecules/address-book/addresses/types";
import TransactionHeader from "./TransactionHeader";
import TransactionDetails from "./TransactionDetails";

interface Props {
    transaction: TransactionWithCalculations & { showDate?: boolean; isFirstOfDate?: boolean };
    uniqueClassifications: string[];
    addresses: AddressCardProps[];
    userGroups?: any[];
    addressGroups?: Record<number, number[]>;
    onUpdateClassification?: (txId: string, newClassification: string) => void;
}

export default function TransactionCard({ transaction, addresses, uniqueClassifications, userGroups, addressGroups, onUpdateClassification }: Props) {
    const [expanded, setExpanded] = useState(transaction.expanded || false);
    const [hovered, setHovered] = useState(false);

    const toggleExpanded = () => setExpanded((prev) => !prev);

    const handleCardClick = (e: React.MouseEvent) => {
        // Check if the click came from the classification area
        const target = e.target as HTMLElement;
        const isClassificationClick = target.closest("[data-classification]");

        if (!isClassificationClick) {
            toggleExpanded();
        }
    };

    return (
        <div className="flex flex-col w-full">
            <motion.div
                className={cn(
                    "group/tx flex flex-col w-full max-w-[1040px] mx-auto cursor-pointer",
                    "border-b transition-colors duration-200",
                    expanded || hovered
                        ? "bg-[rgba(255,255,255,0.06)] border-[var(--color-border-default)]"
                        : "border-[var(--color-border-subtle)]"
                )}
                onHoverStart={() => setHovered(true)}
                onHoverEnd={() => setHovered(false)}
                onClick={handleCardClick}
            >
                <TransactionHeader
                    transaction={transaction}
                    uniqueClassifications={uniqueClassifications}
                    addresses={addresses}
                    expanded={expanded}
                    hovered={hovered}
                    userGroups={userGroups}
                    addressGroups={addressGroups}
                    onUpdateClassification={onUpdateClassification}
                />

                {expanded && (
                    <TransactionDetails
                        transaction={transaction}
                        addresses={addresses}
                    />
                )}
            </motion.div>
        </div>
    );
}
