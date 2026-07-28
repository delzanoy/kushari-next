"use client";

import { Proposal } from "./types";
import { AddressCardProps } from "@/components/molecules/address-book/addresses/types";
import ProposalCard from "./ProposalCard";

interface ProposalListProps {
    proposals: (Proposal & { showDate?: boolean; isFirstOfDate?: boolean })[];
    addresses: AddressCardProps[];
    uniqueClassifications: string[];
    userGroups?: any[];
    addressGroups?: Record<number, number[]>;
    onUpdateClassification?: (proposalId: string, newClassification: string) => void;
}

export default function ProposalList({
    proposals,
    addresses,
    uniqueClassifications,
    userGroups,
    addressGroups,
    onUpdateClassification
}: ProposalListProps) {
    return (
        <div className="flex flex-col w-full">
            {proposals.length > 0 && (
                <div className="flex w-full items-center gap-4 py-2 px-0 border-b border-[var(--color-border-subtle)] text-xs text-[var(--color-text-muted)]">
                    <span className="w-40 tracking-tight shrink-0 pl-4">Initiated</span>
                    <span className="w-40 tracking-tight shrink-0">Wallet & Network</span>
                    <span className="w-40 tracking-tight shrink-0">To</span>
                    <span className="w-32 tracking-tight shrink-0">Outgoing</span>
                    <span className="w-40 tracking-tight shrink-0">Classification</span>
                    <span className="w-40 tracking-tight shrink-0">Status</span>
                </div>
            )}
            {proposals.map((proposal, index) => (
                <ProposalCard
                    key={proposal.id || `proposal-${index}`}
                    proposal={proposal}
                    uniqueClassifications={uniqueClassifications}
                    addresses={addresses}
                    userGroups={userGroups}
                    addressGroups={addressGroups}
                    onUpdateClassification={onUpdateClassification}
                />
            ))}
            {proposals.length === 0 && (
                <div className="flex items-center justify-center py-12 text-[var(--color-text-muted)] text-sm">
                    No proposals found.
                </div>
            )}
        </div>
    );
}
