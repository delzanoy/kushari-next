import { Transaction, TransactionObject, TransactionWithCalculations } from "@/components/molecules/transactions/view-all/types";
import TransactionListClient from "@/components/molecules/transactions/view-all/TransactionListClient";
import { getTransactions, getAddresses } from "@/lib/server-data";
import { Heading } from "@/components/atoms/Typography";
import { Suspense } from "react";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function TransactionsViewAllPage({ searchParams }: PageProps) {
  // Await the searchParams promise
  const params = await searchParams;

  const transactions = await getTransactions();
  const addresses = await getAddresses();

  const typedTransactions = transactions as TransactionObject;

  // Calculate USD values and extend transactions
  const transactionsWithCalculations: TransactionWithCalculations[] =
    typedTransactions.transactions.map((transaction: Transaction) => {
      const incomingUSD = transaction.inTokens && transaction.inUSDPrice
        ? transaction.inTokens * transaction.inUSDPrice
        : 0;

      const outgoingUSD = transaction.outTokens && transaction.outUSDPrice
        ? transaction.outTokens * transaction.outUSDPrice
        : 0;

      return {
        ...transaction,
        incomingUSD,
        outgoingUSD
      };
    });

  // Get unique classifications for filtering
  const uniqueClassifications: string[] = Array.from(
    new Set(typedTransactions.transactions.map((tx: Transaction) => tx.classification))
  ) as string[];

  // Extract wallet filter from URL if present
  const walletFilter = params.wallet as string | undefined;

  return (
    <div className="min-h-full bg-black flex flex-col pt-[52px] pb-24 px-8 overflow-x-hidden selection:bg-cyan-500/30">
      <div className="w-full max-w-[1040px] mx-auto">
        <Suspense fallback={<div className="animate-pulse w-full h-[400px] bg-[rgba(255,255,255,0.03)] rounded-[16px]" />}>
          <TransactionListClient
            transactions={transactionsWithCalculations}
            addresses={addresses}
            uniqueClassifications={uniqueClassifications}
            initialWalletFilter={walletFilter}
          />
        </Suspense>
      </div>
    </div>
  );
}
