// utils/transformProposals.ts
import { Proposal, ProposalStatus, ProposalCategory } from "./types";

export function transformApiDataToProposals(apiData: any[]): Proposal[] {
  return apiData.map(item => {
    // Map API status to ProposalStatus
    let status: ProposalStatus;
    switch (item.status) {
      case "action_required":
        status = ProposalStatus.ACTION_REQUIRED;
        break;
      case "no_action":
        status = ProposalStatus.NO_ACTION;
        break;
      case "actioned":
        status = ProposalStatus.ACTIONED;
        break;
      case "ready":
        status = ProposalStatus.READY;
        break;
      case "failed":
        status = ProposalStatus.FAILED;
        break;
      case "executing":
        status = ProposalStatus.EXECUTING;
        break;
      case "awaiting_nonce":
        status = ProposalStatus.AWAITING_NONCE;
        break;
      case "declined":
        status = ProposalStatus.DECLINED;
        break;
      case "failed_rejected":
        status = ProposalStatus.FAILED_REJECTED; // New status
        break;
      default:
        status = ProposalStatus.NO_ACTION;
    }

    // Calculate outgoing USD
    const outgoingUSD = item.outTokens && item.outUSDPrice
      ? item.outTokens * item.outUSDPrice
      : 0;

    return {
      id: item.id,
      initiator: item.initiator,
      category: getProposalCategory(status), // This will be set dynamically
      timestamp: item.timestamp,
      status,
      outTokenSymbol: item.outTokenSymbol,
      outTokens: item.outTokens,
      outUSDPrice: item.outUSDPrice,
      outAssetId: item.outAssetId,
      multiRecipient: item.multiRecipient,
      recipients: item.recipients,
      outgoingUSD,
      blockchain: item.blockchain,
      wallet: item.wallet,
      walletType: item.walletType,
      classification: item.classification,
    };
  });
}

// Helper function (same as in the component)
function getProposalCategory(status: ProposalStatus): ProposalCategory {
  switch (status) {
    case ProposalStatus.ACTION_REQUIRED:
    case ProposalStatus.NO_ACTION:
    case ProposalStatus.ACTIONED:
      return ProposalCategory.NEEDS_APPROVAL;

    case ProposalStatus.READY:
    case ProposalStatus.FAILED:
    case ProposalStatus.EXECUTING:
    case ProposalStatus.AWAITING_NONCE:
      return ProposalCategory.READY_TO_EXECUTE;

    case ProposalStatus.DECLINED:
    case ProposalStatus.FAILED_REJECTED:
      return ProposalCategory.DISCARDED;

    default:
      return ProposalCategory.NEEDS_APPROVAL;
  }
}