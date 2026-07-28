"use client"
import { TransactionWithCalculations } from "./types";
import { AddressCardProps } from "@/components/molecules/address-book/addresses/types";
import TransactionCard from "./TransactionCard";

interface TransactionListProps {
  transactions: (TransactionWithCalculations & { showDate?: boolean; isFirstOfDate?: boolean })[];
  addresses: AddressCardProps[];
  uniqueClassifications: string[];
  userGroups?: any[];
  addressGroups?: Record<number, number[]>;
  onUpdateClassification?: (txId: string, newClassification: string) => void;
}

export default function TransactionList({ transactions, addresses, uniqueClassifications, userGroups, addressGroups, onUpdateClassification }: TransactionListProps) {
  return (
    <div className="flex flex-col w-full">
      {transactions.map((tx, index) => (
        <TransactionCard
          key={tx.id || `tx-${index}`}
          transaction={tx}
          uniqueClassifications={uniqueClassifications}
          addresses={addresses}
          userGroups={userGroups}
          addressGroups={addressGroups}
          onUpdateClassification={onUpdateClassification}
        />
      ))}
      {transactions.length === 0 && (
        <div className="flex items-center justify-center py-12 text-[var(--color-text-muted)] text-sm">
          No transactions found.
        </div>
      )}
    </div>
  );
}
