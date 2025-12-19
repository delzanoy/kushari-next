"use client"
import TransactionCard from "./TransactionCard";
import { Transaction } from "./types";
import { AddressCardProps } from "./../../address-book/addresses/types"
import { useMemo } from "react";
import { calculateAllTransactionAmounts } from './calculations';

interface TransactionWithDateInfo extends Transaction {
  showDate: boolean;
  isFirstOfDate: boolean;
}

interface TransactionListProps {
  transactions: TransactionWithDateInfo[]; // Update this line
  addresses: AddressCardProps[];
  uniqueClassifications: string[];
}

// In TransactionList.tsx
export default function TransactionList({ transactions, addresses, uniqueClassifications }: TransactionListProps) {
  const transactionsWithCalculations = calculateAllTransactionAmounts(transactions);

  // Group by date for the current list
  const transactionsWithDateInfo = useMemo(() => {
    const groups: { [key: string]: typeof transactionsWithCalculations } = {};

    transactionsWithCalculations.forEach(transaction => {
      const dateKey = new Date(transaction.timestamp).toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(transaction);
    });

    const result: typeof transactionsWithCalculations = [];
    Object.entries(groups).forEach(([_, transactions]) => {
      transactions.forEach((transaction, index) => {
        result.push({
          ...transaction,
          showDate: index === 0,
          isFirstOfDate: index === 0
        });
      });
    });

    return result.reverse();
  }, [transactionsWithCalculations]);

  return (
    <div className="flex flex-col-reverse">
      {transactionsWithDateInfo.map((transaction) => (
        <TransactionCard key={transaction.id} transaction={transaction} uniqueClassifications={uniqueClassifications} addresses={addresses} />
      ))}
    </div>
  );
}