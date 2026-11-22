import { Transaction } from "../transactions/view-all/types";
import { Proposal } from "../transactions/proposals/types";

// ─── Core ─────────────────────────────────────────────────────────────────────

export type WalletType = 1 | 2 | 3; // 1: MPC Vault, 2: Gnosis Safe, 3: Tracked Wallet

export interface BlockchainInfo {
  blockchain: string;
}

export interface Member {
  id: number;
  name: string;
  email: string;
  colour: string;
  avatarColor?: string;
  avatarPreset?: string;
  isCurrentUser?: boolean;
}

export interface WalletMember {
  memberId: number;
  role?: string | string[];
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

// ─── Base wallet ──────────────────────────────────────────────────────────────

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

// ─── Wallet variants ──────────────────────────────────────────────────────────

export interface MPCVaultWallet extends BaseWallet {
  type: 1;
  blockchain: BlockchainInfo[] | string;
  members: WalletMember[];
  threshold: number;
  transactionLimit?: number;
  blockedAssets?: BlockedAsset[];
  blockedNetworks?: string;
  allowedAssets?: AllowedAsset[];
  allowedNetworks?: string;
}

export interface GnosisSafeWallet extends BaseWallet {
  type: 2;
  blockchain: BlockchainInfo[] | string;
  threshold: number;
  members: WalletMember[];
  transactionLimit?: number;
  blockedAssets?: BlockedAsset[];
  blockedNetworks?: string;
  allowedAssets?: AllowedAsset[];
  allowedNetworks?: string;
}

export interface TrackedWallet extends BaseWallet {
  type: 3;
  blockchain: BlockchainInfo[] | string;
}

export type Wallet = MPCVaultWallet | GnosisSafeWallet | TrackedWallet;

export type WalletsData = Wallet[];

// ─── Summary (used in cards / list views) ─────────────────────────────────────

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
