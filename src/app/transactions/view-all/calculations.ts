import { Transaction, TransactionWithCalculations } from './types';
import { AddressCardProps } from "./../../address-book/addresses/types";

export function calculateAllTransactionAmounts(transactions: Transaction[]): TransactionWithCalculations[] {
  return transactions.map(transaction => {
    let incomingUSD = 0;
    let outgoingUSD = 0;

    // Calculate incoming USD value - check for both tokens and price existence
    if (transaction.incoming && 
        transaction.inTokens !== null && 
        transaction.inUSDPrice !== undefined && 
        transaction.inUSDPrice !== null) {
      incomingUSD = transaction.inTokens * transaction.inUSDPrice;
    }

    // Calculate outgoing USD value - check for both tokens and price existence
    if (transaction.outgoing && 
        transaction.outTokens !== null && 
        transaction.outUSDPrice !== undefined && 
        transaction.outUSDPrice !== null) {
      outgoingUSD = transaction.outTokens * transaction.outUSDPrice;
    }

    return {
      ...transaction,
      incomingUSD,
      outgoingUSD
    };
  });
}


export function getUniqueClassifications(transactions: Transaction[]): string[] {
  const classifications = transactions
    .map(transaction => transaction.classification)
    .filter((classification): classification is string => 
      classification !== null && classification !== undefined
    );
  return Array.from(new Set(classifications));
}

// Define the RecipientInput type based on your transaction data structure
export const determineMultirecipients = (
  multiRecipient: boolean,
  recipients: any,
  addresses: AddressCardProps[]
): string => {
  // Multi recipient - array of toAddress objects
  if (multiRecipient && Array.isArray(recipients)) {
    return `${recipients.length} recipients`;
  }
  
  // Single recipient - object with addressId
  if (recipients && typeof recipients === "object" && recipients.addressId) {
    const foundAddress = addresses.find(addr => addr.id === recipients.addressId);
    return foundAddress ? foundAddress.name : `Unknown (ID: ${recipients.addressId})`;
  }
  
  // Unknown recipient - hash address (string)
  if (typeof recipients === "string") {
    const addressString = recipients;
    return addressString.length <= 10 
      ? addressString 
      : `${addressString.slice(0, 5)}...${addressString.slice(-5)}`;
  }
  
  // Fallback
  return "Unknown recipient";
};