// ProposalList.tsx
"use client";

import { AddressCardProps } from "@/app/address-book/addresses/types";
import ProposalCard from "./ProposalCard";
import { Proposal } from "./types";
import { useMemo } from "react";

interface ProposalWithDateInfo extends Proposal {
  showDate: boolean;
  isFirstOfDate: boolean;
}

interface ProposalListProps {
    proposals: Proposal[];
    addresses: AddressCardProps[];
    uniqueClassifications: string[];
    onSearchChange?: (query: string) => void;
}

export default function ProposalList({
    proposals,
    addresses,
    uniqueClassifications
}: ProposalListProps) {
    // Group by date for the current list - same logic as TransactionList
    const proposalsWithDateInfo = useMemo(() => {
        const groups: { [key: string]: Proposal[] } = {};

        proposals.forEach(proposal => {
            const dateKey = new Date(proposal.timestamp).toDateString();
            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }
            groups[dateKey].push(proposal);
        });

        const result: ProposalWithDateInfo[] = [];
        Object.entries(groups).forEach(([dateKey, proposals]) => {
            proposals.forEach((proposal, index) => {
                result.push({
                    ...proposal,
                    showDate: index === 0,
                    isFirstOfDate: index === 0
                });
            });
        });

        return result.reverse(); // Reverse for styling - same as TransactionList
    }, [proposals]);

    return (
        <div className="flex flex-col-reverse">
            {proposalsWithDateInfo.map((proposal) => (
                <ProposalCard 
                    key={proposal.id} 
                    proposal={proposal} 
                    uniqueClassifications={uniqueClassifications} 
                    addresses={addresses} 
                />
            ))}
        </div>
    );
}