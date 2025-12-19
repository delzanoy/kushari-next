import { Transaction, TransactionWithCalculations, Recipient } from './types';
import { AddressCardProps } from "./../../address-book/addresses/types";

// Use the actual Recipient type from the transaction types
type RecipientsType = string | Recipient | Recipient[];

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

// Updated function to handle the actual Recipient type
export const determineMultirecipients = (
  multiRecipient: boolean,
  recipients: RecipientsType,
  addresses: AddressCardProps[]
): string => {
  // Multi recipient - array of recipient objects
  if (multiRecipient && Array.isArray(recipients)) {
    return `${recipients.length} recipients`;
  }
  
  // Single recipient - object with addressId
  if (recipients && typeof recipients === "object" && !Array.isArray(recipients)) {
    // Check if it has an addressId - store it to ensure proper type narrowing
    if ('addressId' in recipients && recipients.addressId !== undefined) {
      const addressId = recipients.addressId; // Type is now narrowed to number
      const foundAddress = addresses.find(addr => addr.id === addressId);
      return foundAddress ? foundAddress.name : `Unknown (ID: ${addressId})`;
    }
    
    // Check if it has a toAddress - store it to ensure proper type narrowing
    if ('toAddress' in recipients && recipients.toAddress) {
      const addressString = recipients.toAddress; // Type is now narrowed to string
      return addressString.length <= 10 
        ? addressString 
        : `${addressString.slice(0, 5)}...${addressString.slice(-5)}`;
    }
  }
  
  // Unknown recipient - hash address (string)
  if (typeof recipients === "string") {
    return recipients.length <= 10 
      ? recipients 
      : `${recipients.slice(0, 5)}...${recipients.slice(-5)}`;
  }
  
  // Fallback
  return "Unknown recipient";
};