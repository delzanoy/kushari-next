export enum ProposalCategory {
  NEEDS_APPROVAL = "NEEDS_APPROVAL",
  READY_TO_EXECUTE = "READY_TO_EXECUTE",
  DISCARDED = "DISCARDED",
}

/** How each proposal category is named in tabs and filters. */
export const PROPOSAL_CATEGORY_LABEL: Record<ProposalCategory, string> = {
  [ProposalCategory.NEEDS_APPROVAL]: "Needs approval",
  [ProposalCategory.READY_TO_EXECUTE]: "Ready to execute",
  [ProposalCategory.DISCARDED]: "Discarded",
};

export enum ProposalStatus {
  // Needs Approval statuses
  ACTION_REQUIRED = "ACTION_REQUIRED",
  NO_ACTION = "NO_ACTION",
  ACTIONED = "ACTIONED",

  // Ready to Execute statuses
  READY = "READY",
  FAILED = "FAILED",
  EXECUTING = "EXECUTING",
  AWAITING_NONCE = "AWAITING_NONCE",
  
  // Discarded statuses
  FAILED_REJECTED = "FAILED_REJECTED", 
  DECLINED = "DECLINED",
}

export interface Recipient {
  addressId?: number;
  toAddress?: string;
}

export interface Proposal {
  id: string;
  timestamp: number;
  initiator: string;
  category: ProposalCategory;
  status: ProposalStatus;
  outTokenSymbol: string;
  outAssetId: number | null
  outTokens: number;
  outUSDPrice?: number;
  multiRecipient: boolean;
  recipients: Recipient | Recipient[];
  outgoingUSD: number;
  wallet: string;
  blockchain: string;
  walletType: number;
  classification: string;
  showDate?: boolean;
  isFirstOfDate?: boolean;
}

export interface ProposalCardProps {
  Proposal: Proposal;
}

export interface ProposalWithCalculations extends Proposal {
  outgoingUSD: number;
}
