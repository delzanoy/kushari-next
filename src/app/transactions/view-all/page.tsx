// import { Transaction, TransactionObject, TransactionWithCalculations } from "./types";
// import TransactionListClient from "./TransactionListClient";
// import { getTransactions, getAddresses } from "../../api/server-data";

// export default async function TransactionsViewAllPage() {
//   const [transactions, addresses] = await Promise.all([
//     getTransactions(),
//     getAddresses()
//   ])

//   const typedTransactions = transactions as TransactionObject;

//   // Calculate USD values and extend transactions
//   const transactionsWithCalculations: TransactionWithCalculations[] =
//     typedTransactions.transactions.map((transaction: Transaction) => {
//       const incomingUSD = transaction.inTokens && transaction.inUSDPrice
//         ? transaction.inTokens * transaction.inUSDPrice
//         : 0;

//       const outgoingUSD = transaction.outTokens && transaction.outUSDPrice
//         ? transaction.outTokens * transaction.outUSDPrice
//         : 0;

//       return {
//         ...transaction,
//         incomingUSD,
//         outgoingUSD
//       };
//     });


//   // Get unique classifications for filtering
//   const uniqueClassifications: string[] = Array.from(
//     new Set(typedTransactions.transactions.map((tx: Transaction) => tx.classification))
//   ) as string[];

//   return (
//     <TransactionListClient
//       transactions={transactionsWithCalculations}
//       addresses={addresses}
//       uniqueClassifications={uniqueClassifications}
//     />
//   );
// }

// import { Transaction, TransactionObject, TransactionWithCalculations } from "./types";
// import TransactionListClient from "./TransactionListClient";
// import { getTransactions, getAddresses } from "../../api/server-data";

// interface PageProps {
//   searchParams: { [key: string]: string | string[] | undefined };
// }

// export default async function TransactionsViewAllPage({ searchParams }: PageProps) {
//   const transactions = await getTransactions();
//   const addresses = await getAddresses();

//   const typedTransactions = transactions as TransactionObject;

//   // Calculate USD values and extend transactions
//   const transactionsWithCalculations: TransactionWithCalculations[] =
//     typedTransactions.transactions.map((transaction: Transaction) => {
//       const incomingUSD = transaction.inTokens && transaction.inUSDPrice
//         ? transaction.inTokens * transaction.inUSDPrice
//         : 0;

//       const outgoingUSD = transaction.outTokens && transaction.outUSDPrice
//         ? transaction.outTokens * transaction.outUSDPrice
//         : 0;

//       return {
//         ...transaction,
//         incomingUSD,
//         outgoingUSD
//       };
//     });

//   // Get unique classifications for filtering
//   const uniqueClassifications: string[] = Array.from(
//     new Set(typedTransactions.transactions.map((tx: Transaction) => tx.classification))
//   ) as string[];

//   // Extract wallet filter from URL if present
//   const walletFilter = searchParams.wallet as string | undefined;

//   return (
//     <TransactionListClient
//       transactions={transactionsWithCalculations}
//       addresses={addresses}
//       uniqueClassifications={uniqueClassifications}
//       initialWalletFilter={walletFilter}
//     />
//   );
// }





import { Transaction, TransactionObject, TransactionWithCalculations } from "./types";
import TransactionListClient from "./TransactionListClient";
import { getTransactions, getAddresses } from "../../api/server-data";

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
    <TransactionListClient
      transactions={transactionsWithCalculations}
      addresses={addresses}
      uniqueClassifications={uniqueClassifications}
      initialWalletFilter={walletFilter}
    />
  );
}