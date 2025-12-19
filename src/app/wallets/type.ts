import { Transaction } from "../transactions/view-all/types";
import { Proposal } from "../transactions/proposals/types"
// Core wallet types
export type WalletType = 1 | 2 | 3; // 1: MPC Vault, 2: Gnosis Safe, 3: Tracked Wallet

export interface BlockchainInfo {
  blockchain: string;
}

export interface Member {
  id: number;
  role?: string | string[];
  email?: string;
  name?: string;
}

export interface AssetBalance {
  uniqueId: string;
  assetId: number;
  tokens: number;
  USD: number;
  price: number;
  symbol: string;
  fullName: string;
  name: string;
}

export interface BlockedAsset {
  assetId: number;
}

export interface AllowedAsset {
  assetId: number;
}

export interface ToAddressItem {
  toAddress: string;
}

export interface AddressId {
  addressId: number;
}

export type ToAddress = string | ToAddressItem[] | AddressId;

export interface Approval {
  approverId: number;
}


// Base wallet interface with common properties
export interface BaseWallet {
  id: number;
  address: string;
  type: WalletType;
  name: string;
  balance: AssetBalance[];
  transactions: Transaction[];
  proposals: Proposal[];
  blockchain: BlockchainInfo[] | string;
  percent_change_24h: number;
}

// MPC Vault Wallet (type 1)
export interface MPCVaultWallet extends BaseWallet {
  type: 1;
  blockchain: BlockchainInfo[] | string;
  members: Member[];
  threshold: number;
  transactionLimit?: number;
  blockedAssets?: BlockedAsset[];
  blockedNetworks?: string;
  allowedAssets?: AllowedAsset[];
  allowedNetworks?: string;
}

// Gnosis Safe Wallet (type 2)
export interface GnosisSafeWallet extends BaseWallet {
  type: 2;
  blockchain: BlockchainInfo[] | string;
  threshold: number;
  members: Member[];
  transactionLimit?: number;
  blockedAssets?: BlockedAsset[];
  blockedNetworks?: string;
  allowedAssets?: AllowedAsset[];
  allowedNetworks?: string;
}

// Tracked Wallet (type 3)
export interface TrackedWallet extends BaseWallet {
  type: 3;
  blockchain: BlockchainInfo[] | string;
  // No members, threshold, or transaction limits for tracked wallets
}

export type Wallet = MPCVaultWallet | GnosisSafeWallet | TrackedWallet;

export type WalletsData = Wallet[];

export interface WalletSummary {
  id: number;
  name: string;
  type: WalletType;
  address: string;
  totalBalance: number;
  balance: AssetBalance[];
  blockchain: BlockchainInfo[] | string;
  memberCount?: number;
  percent_change_24h: number;
  USDBalance: number;
}