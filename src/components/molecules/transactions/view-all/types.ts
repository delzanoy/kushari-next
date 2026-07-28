import { AddressCardProps } from "./../../address-book/addresses/types";

export interface Recipient {
  addressId?: number; // For single recipient transactions
  toAddress?: string; // For multi-recipient transactions
}

export interface Transaction {
  id: string;
  timestamp: number;
  moreThan3: boolean;
  titleTransaction: boolean;
  expanded: boolean;
  incoming: boolean;
  outgoing: boolean;
  walletId: number;
  wallet: string;
  walletType: number;
  blockchain: string;
  multiRecipient: boolean;
  recipients: Recipient | Recipient[]; // Can be single object or array
  inTokens: number | null;
  outTokens: number | null;
  classification: string;
  executer: string;
  initiator: string;
  inTokenSymbol?: string; // Optional since outgoing txs don't have it
  inUSDPrice?: number; // Optional since outgoing txs don't have it
  outTokenSymbol?: string; // Optional since incoming txs don't have it
  outUSDPrice?: number; // Optional since incoming txs don't have it
  gasFee?: number;
  gasFeeUSD?: number;
  gasTokenSymbol?: string;
  toAddress?: string;
  incomingUSD?: number; 
  outgoingUSD?: number; 
  showDate?: boolean;
  isFirstOfDate?: boolean;
}

export interface TransactionObject {
  transactions: Transaction[];
  transactionsCount: number;
}

export interface TransactionWithCalculations extends Transaction {
  incomingUSD: number; 
  outgoingUSD: number; 
}

export interface TransactionCardProps {
  transaction: TransactionWithCalculations;
  onExpand?: (id: string) => void;
  uniqueClassifications: string[];
  addresses: AddressCardProps[];
  onUpdateClassification?: (txId: string, newClassification: string) => void;
}

export interface TransactionHeaderProps {
  transaction: TransactionWithCalculations;
  uniqueClassifications: string[];
  addresses: AddressCardProps[];
  onUpdateClassification?: (txId: string, newClassification: string) => void;
}

export interface CalculatedAmounts {
  incomingUSD: number;
  outgoingUSD: number;
}

export interface TransactionDetailsProps {
  transaction: TransactionWithCalculations;
  addresses: AddressCardProps[];
}
