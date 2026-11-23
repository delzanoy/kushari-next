"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import {
  RiCloseLine,
  RiCloseCircleFill,
  RiCheckLine,
  RiCheckboxCircleFill,
  RiFileCopyLine,
  RiExternalLinkLine,
  RiDoubleQuotesL,
  RiUser3Line,
  RiGasStationLine,
  RiPencilLine,
  RiCheckFill,
  RiCloseFill,
  RiLoaderFill,
  RiShieldCheckLine,
  RiTimeLine,
  RiArrowUpLine,
  RiInformationLine,
} from "@remixicon/react";

import { useModalContext } from "@/components/molecules/modal/Modal";
import { Button } from "@/components/atoms/Button";
import { IconButton } from "@/components/atoms/IconButton";
import { TertiaryButton } from "@/components/atoms/TertiaryButton";
import { Tooltip } from "@/components/atoms/Tooltip";
import { Avatar, presetForName } from "@/components/atoms/Avatar";
import { TextInput } from "@/components/atoms/TextInput";
import { TextArea } from "@/components/atoms/TextArea";
import { BlockchainIconStack } from "@/components/atoms/BlockchainIconStack";
import { GnosisSafeIcon } from "@/media/icons/GnosisSafeIcon";
import { ClassificationDropdown } from "../../view-all/ClassificationDropdown";
import { RecipientDisplay } from "../../RecipientDisplay";
import { formatDollars, formatCents } from "@/lib/formatters";
import { ProposalStatus, type Proposal } from "../types";
import type { AddressCardProps } from "@/components/molecules/address-book/addresses/types";
import { MODAL_WIDTH } from "@/components/molecules/modal/Modal";
import { walletIcon } from "@/components/atoms/WalletIcon";

const getExplorerUrl = (blockchain: string, id: string) => {
  switch (blockchain.toLowerCase()) {
    case "ethereum": return `https://etherscan.io/tx/${id}`;
    case "polygon": return `https://polygonscan.com/tx/${id}`;
    case "optimism": return `https://optimistic.etherscan.io/tx/${id}`;
    case "bsc": return `https://bscscan.com/tx/${id}`;
    case "solana": return `https://solscan.io/tx/${id}`;
    default: return `https://etherscan.io/tx/${id}`;
  }
};

const getExplorerName = (blockchain: string) => {
  switch (blockchain.toLowerCase()) {
    case "ethereum": return "Etherscan";
    case "polygon": return "Polygonscan";
    case "optimism": return "Optimistic Etherscan";
    case "bsc": return "BscScan";
    case "solana": return "Solscan";
    default: return "Block Explorer";
  }
};

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface ApproverState {
  id: string;
  name: string;
  email?: string;
  status: "approved" | "rejected" | "reviewing" | "pending";
  timestamp?: string;
  comment?: string;
}

export interface ReviewProposalModalProps {
  proposal: Proposal;
  addresses?: AddressCardProps[];
  uniqueClassifications?: string[];
  userGroups?: any[];
  wallets?: any[];
  addressGroups?: Record<number, number[]>;
  onClose?: () => void;
  onUpdateClassification?: (proposalId: string, newClassification: string) => void;
  onApprove?: (proposalId: string, comment?: string) => void;
  onReject?: (proposalId: string, comment?: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ReviewProposalModal({
  proposal,
  addresses = [],
  wallets,
  uniqueClassifications = ["Payroll", "Marketing", "Treasury", "Operations", "Grants"],
  userGroups,
  addressGroups,
  onClose,
  onUpdateClassification,
  onApprove,
  onReject,
}: ReviewProposalModalProps) {
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [classification, setClassification] = useState(proposal.classification || "Payroll");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userDecision, setUserDecision] = useState<"approved" | "rejected" | null>(null);

  const [confirmStage, setConfirmStage] = useState(false);
  const [pendingAction, setPendingAction] = useState<"approve" | "reject" | null>(null);
  const [twoFactorCode, setTwoFactorCode] = useState("");

  const [loadedWallets, setLoadedWallets] = useState<any[]>(wallets || []);

  useEffect(() => {
    if (wallets && wallets.length > 0) {
      setLoadedWallets(wallets);
    } else {
      import("@/lib/mock-cache").then(({ getUserWallets }) => {
        getUserWallets().then((wList) => {
          if (wList && wList.length > 0) {
            setLoadedWallets(wList);
          }
        });
      }).catch(() => { });
    }
  }, [wallets]);

  const { escStage, isTopModal } = useModalContext();
  const [showEscTooltip, setShowEscTooltip] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (escStage === 1 && isTopModal) {
      setShowEscTooltip(true);
    } else {
      setShowEscTooltip(false);
    }
  }, [escStage, isTopModal]);

  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  // Proposer info
  const initiatorName = proposal.initiator || "Elon Musk";
  const formattedProposalDate = format(
    new Date(proposal.timestamp || Date.now()),
    "dd MMM yyyy HH:mm"
  );

  // Proposal hash / ID
  const proposalHash = proposal.id || "0x7aD34e9A12fC7e8B56c9fCe9b6dE14F73fA9Cd3F";

  const KNOWN_MEMBERS_MAP: Record<number | string, { name: string; email: string }> = {
    1: { name: "Delanoy Kunil", email: "delanoykunil@fmail.com" },
    2: { name: "Sandeep Nailwal", email: "sandeep@polygon.technology" },
    3: { name: "Vitalik Buterin", email: "vitalik@ethereum.org" },
    4: { name: "Elon Musk", email: "elon@x.com" },
    5: { name: "Robert Kiyosaki", email: "robertkiyosaki@hotmail.com" },
    6: { name: "Donald Trump", email: "trump@truth.social" },
    7: { name: "Brian Armstrong", email: "barmstrong@coinbase.com" },
    8: { name: "John McAfee", email: "mcafee@sec.org" },
  };

  // 1. Resolve matching wallet from policy data
  const matchedWallet = useMemo(() => {
    if (!loadedWallets || loadedWallets.length === 0) return null;
    return loadedWallets.find(
      (w) =>
        (w.name && w.name.toLowerCase() === proposal.wallet?.toLowerCase()) ||
        String(w.id) === String((proposal as any).walletId) ||
        String(w.id) === String(proposal.wallet)
    );
  }, [loadedWallets, proposal.wallet]);

  // 2. Extract policy approvers for this specific wallet
  const initialApprovers = useMemo<ApproverState[]>(() => {
    const w = matchedWallet as any;
    if (w) {
      let rawApprovers: Array<{ name: string; email?: string }> = [];

      if (Array.isArray(w.members) && w.members.length > 0) {
        rawApprovers = w.members.map((m: any, idx: number) => {
          if (typeof m === "string") return { name: m };
          const targetId = typeof m === "number" ? m : (m?.memberId ?? m?.id);
          const matchedAddress = addresses?.find((a: any) => String(a.id) === String(targetId));
          const knownMember = KNOWN_MEMBERS_MAP[targetId];
          const name = m.name || matchedAddress?.name || knownMember?.name || `Approver ${idx + 1}`;
          const email = m.email || (matchedAddress as any)?.email || knownMember?.email;
          return { name, email };
        });
      } else if (Array.isArray(w.approvers) && w.approvers.length > 0) {
        rawApprovers = w.approvers.map((a: any, idx: number) => {
          if (typeof a === "string") return { name: a };
          const targetId = typeof a === "number" ? a : (a?.memberId ?? a?.id);
          const knownMember = KNOWN_MEMBERS_MAP[targetId];
          const name = a.name || knownMember?.name || `Approver ${idx + 1}`;
          const email = a.email || knownMember?.email;
          return { name, email };
        });
      } else if (Array.isArray(w.owners) && w.owners.length > 0) {
        rawApprovers = w.owners.map((o: any, idx: number) => {
          if (typeof o === "string") return { name: o.split("@")[0] };
          const targetId = typeof o === "number" ? o : (o?.memberId ?? o?.id);
          const knownMember = KNOWN_MEMBERS_MAP[targetId];
          const name = o.name || knownMember?.name || `Owner ${idx + 1}`;
          const email = o.email || knownMember?.email;
          return { name, email };
        });
      }

      if (rawApprovers.length === 0) {
        rawApprovers = [
          { name: "Elon Musk", email: "elon@x.com" },
          { name: "Delanoy Kunil", email: "delanoykunil@fmail.com" },
          { name: "Robert Kiyosaki", email: "robertkiyosaki@hotmail.com" },
          { name: "Vitalik Buterin", email: "vitalik@ethereum.org" },
        ];
      }

      // Ensure Delanoy Kunil is present in rawApprovers
      let delanoyIndex = rawApprovers.findIndex((a) => a.name.toLowerCase().includes("delanoy"));
      if (delanoyIndex === -1) {
        if (rawApprovers.length > 1) {
          rawApprovers[1] = { name: "Delanoy Kunil", email: "delanoykunil@fmail.com" };
          delanoyIndex = 1;
        } else {
          rawApprovers.push({ name: "Delanoy Kunil", email: "delanoykunil@fmail.com" });
          delanoyIndex = rawApprovers.length - 1;
        }
      }

      // Delanoy Kunil is the ONE AND ONLY reviewing approver
      const reviewingIndex = delanoyIndex;

      return rawApprovers.map((item, idx) => {
        let status: ApproverState["status"] = "pending";
        let timestamp: string | undefined = undefined;
        let comment: string | undefined = undefined;

        if (idx === reviewingIndex) {
          status = "reviewing";
        } else if (idx < reviewingIndex) {
          status = "approved";
          timestamp = format(new Date(proposal.timestamp || Date.now() - 3600000), "dd MMM yyyy HH:mm");
          comment = idx === 0 ? "Initiated transfer request" : "Approved via policy";
        } else {
          status = "pending";
        }

        return {
          id: String(idx + 1),
          name: item.name,
          status,
          timestamp,
          comment,
        };
      });
    }

    // Default policy approvers fallback with Delanoy Kunil as sole reviewer
    return [
      {
        id: "1",
        name: "Elon Musk",
        status: "approved",
        timestamp: "15 May 2024 10:38",
        comment: "Initiated transfer request",
      },
      {
        id: "2",
        name: "Delanoy Kunil",
        status: "reviewing",
      },
      {
        id: "3",
        name: "Robert Kiyosaki",
        status: "pending",
      },
      {
        id: "4",
        name: "Vitalik Buterin",
        status: "pending",
      },
    ];
  }, [matchedWallet, proposal]);

  const [approvers, setApprovers] = useState<ApproverState[]>(initialApprovers);

  useEffect(() => {
    setApprovers(initialApprovers);
  }, [initialApprovers]);

  const handleCopyHash = useCallback(async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      await navigator.clipboard.writeText(proposalHash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2500);
    } catch {
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2500);
    }
  }, [proposalHash]);

  const handleExplorerClick = useCallback(() => {
    window.open(getExplorerUrl(proposal.blockchain || "Ethereum", proposalHash), "_blank");
  }, [proposal.blockchain, proposalHash]);

  const handleClassificationChange = (newVal: string) => {
    setClassification(newVal);
    onUpdateClassification?.(proposal.id, newVal);
  };

  const handleUserApproveClick = () => {
    setPendingAction("approve");
    setConfirmStage(true);
  };

  const handleUserRejectClick = () => {
    setPendingAction("reject");
    setConfirmStage(true);
  };

  const handleBackToReview = () => {
    setConfirmStage(false);
    setPendingAction(null);
  };

  const handleConfirmAction = async () => {
    if (!pendingAction) return;
    setIsSubmitting(true);
    const isApprove = pendingAction === "approve";
    setUserDecision(isApprove ? "approved" : "rejected");

    setApprovers((prev) =>
      prev.map((app) =>
        app.status === "reviewing"
          ? {
            ...app,
            status: isApprove ? "approved" : "rejected",
            timestamp: format(new Date(), "dd MMM yyyy HH:mm"),
            comment: commentText.trim() || (isApprove ? "Approved via 2FA" : "Rejected via 2FA"),
          }
          : app
      )
    );

    setTimeout(() => {
      if (isApprove) {
        onApprove?.(proposal.id, commentText);
      } else {
        onReject?.(proposal.id, commentText);
      }
      setIsSubmitting(false);
      setConfirmStage(false);
      setPendingAction(null);
      setTimeout(() => onClose?.(), 800);
    }, 600);
  };

  const calculateApprovedCount = useMemo(() => {
    return approvers.filter((a) => a.status === "approved").length;
  }, [approvers]);

  return (
    <div
      ref={modalRef}
      tabIndex={-1}
      className={`flex flex-col ${MODAL_WIDTH.wide} p-4 rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-sunken)] backdrop-blur-xl shadow-2xl gap-6 outline-none select-none`}
      role="dialog"
      aria-label="Review proposal modal"
    >
      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col items-start gap-3 self-stretch pb-4 border-b border-[var(--color-border-subtle)] flex-shrink-0">
        <div className="flex justify-between items-center self-stretch">
          <div className="flex p-2.5 items-center justify-center rounded-xl bg-[var(--color-text-brand)]/[0.08] border border-[var(--color-text-brand)]/[0.12]">
            <GnosisSafeIcon className="w-6 h-6 text-[var(--color-text-brand)]" color="currentColor" />
          </div>
          <Tooltip content="Esc again to confirm" open={showEscTooltip} placement="bottom">
            <div>
              <IconButton
                icon={showEscTooltip ? <RiCloseCircleFill size={20} /> : <RiCloseLine size={20} />}
                size="sm"
                flat
                variant={showEscTooltip ? "danger" : "neutral"}
                appearance="ghost"
                onClick={onClose}
                aria-label="Close modal"
              />
            </div>
          </Tooltip>
        </div>

        <div className="flex flex-col items-start gap-2 self-stretch mt-1 px-2">
          {/* Title */}
          <h2 className="text-[var(--color-text-primary)] text-xl font-medium tracking-tight">
            Review proposal
          </h2>

          {/* Full hash - Next line, copyable TertiaryButton in neutral */}
          <div className="flex items-center gap-2 flex-wrap">
            <Tooltip content={copiedHash ? "Copied!" : "Copy proposal hash"} placement="top">
              <div>
                <TertiaryButton
                  size="sm"
                  variant="neutral"
                  onClick={handleCopyHash}
                >
                  {proposalHash}
                </TertiaryButton>
              </div>
            </Tooltip>
            {copiedHash && (
              <span className="text-xs font-medium text-[var(--color-text-brand)]">Copied</span>
            )}
          </div>

          {/* Proposed by "Avatar + proposer name" on date */}
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-sm text-[var(--color-text-muted)] font-normal">
              Proposed by
            </span>
            <Avatar name={initiatorName} size="xs" preset={presetForName(initiatorName)} />
            <span className="text-sm font-medium text-[var(--color-text-primary)]">
              {initiatorName}
            </span>
            <span className="text-sm text-[var(--color-text-muted)] font-normal">
              on {formattedProposalDate}
            </span>
          </div>

          {/* Comment - remove box, keep just icon and text */}
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)] italic mt-0.5">
            <RiDoubleQuotesL size={15} className="text-[var(--color-text-muted)] shrink-0 not-italic" />
            <span>Payroll for the month of Feb.</span>
          </div>
        </div>
      </div>

      {/* ── Key Metadata Grid (Borderless, clean position) ──────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-12 self-stretch px-2 pt-2">
        {/* Source Wallet */}
        <div className="flex flex-col gap-1.5 min-w-0">
          <span className="text-xs font-normal text-[var(--color-text-muted)] tracking-tight">
            Source wallet
          </span>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              {walletIcon(proposal.walletType, { size: 18, muted: true, fallback: 2 })}
              <span className="text-sm font-medium text-[var(--color-text-primary)] tracking-tight truncate">
                {proposal.wallet || "Company Treasury"}
              </span>
              <span className="font-mono text-xs font-medium text-[var(--color-text-muted)] ml-1 shrink-0">
                {calculateApprovedCount}/4
              </span>
            </div>
            <span className="font-mono text-xs text-[var(--color-text-muted)] shrink-0">
              0x91C5...D057F1
            </span>
          </div>
        </div>

        {/* Recipients */}
        <div className="flex flex-col gap-1.5 min-w-0">
          <span className="text-xs font-normal text-[var(--color-text-muted)] tracking-tight">
            Recipients
          </span>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <RiUser3Line size={16} className="text-[var(--color-icon-secondary)] shrink-0" />
              <span className="text-sm font-medium text-[var(--color-text-primary)] tracking-tight truncate">
                Charles Hoskinson
              </span>
            </div>
            <span className="font-mono text-xs text-[var(--color-text-muted)] shrink-0">
              0xb424...52135
            </span>
          </div>
        </div>

        {/* Network */}
        <div className="flex flex-col gap-1.5 min-w-0">
          <span className="text-xs font-normal text-[var(--color-text-muted)] tracking-tight">
            Network
          </span>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <BlockchainIconStack blockchain={proposal.blockchain || "Ethereum"} size={16} />
              <span className="text-sm font-medium text-[var(--color-text-primary)] tracking-tight truncate">
                {proposal.blockchain || "Ethereum"}
              </span>
            </div>
            <span className="font-mono text-xs text-[var(--color-text-muted)] shrink-0">
              Gas 0.0000000041 Eth
            </span>
          </div>
        </div>

        {/* Asset to Send */}
        <div className="flex flex-col gap-1.5 min-w-0">
          <span className="text-xs font-normal text-[var(--color-text-muted)] tracking-tight">
            Asset to send
          </span>
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-[var(--color-text-primary)] tracking-tight truncate">
              {proposal.outTokenSymbol || "ETH"} {proposal.outTokens || "0.84197445028"}
            </span>
            <span className="font-mono text-sm font-semibold text-[var(--color-text-primary)] shrink-0">
              ${formatDollars(proposal.outgoingUSD || 1537.98)}.{formatCents(proposal.outgoingUSD || 1537.98)}
            </span>
          </div>
        </div>

        {/* Classification */}
        <div className="flex flex-col gap-1.5 min-w-0">
          <span className="text-xs font-normal text-[var(--color-text-muted)] tracking-tight">
            Classification
          </span>
          <div className="flex items-center">
            <ClassificationDropdown
              options={uniqueClassifications}
              value={classification}
              onChange={handleClassificationChange}
            />
          </div>
        </div>
      </div>

      {/* ── Approvers Status Row (Multisig Approvals) ────────────────────────── */}
      <div className="flex flex-col gap-3 self-stretch pt-3">
        <div className="flex items-center justify-between px-2">
          <span className="text-xs font-normal text-[var(--color-text-muted)] tracking-tight">
            Approvals & Signatures ({calculateApprovedCount}/{approvers.length} confirmed)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-12 self-stretch px-2">
          {approvers.map((app) => (
            <div
              key={app.id}
              className="flex flex-col gap-1.5 min-w-0"
            >
              <div className="flex items-center gap-2.5">
                <Avatar name={app.name} size="xs" preset={presetForName(app.name)} />
                <span className="text-sm font-medium text-[var(--color-text-primary)] tracking-tight truncate">
                  {app.name}
                  {app.name.toLowerCase().includes("delanoy") && (
                    <span className="text-xs text-[var(--color-text-brand)] font-normal ml-1.5">(You)</span>
                  )}
                </span>
              </div>

              {/* Status Indicator & Timestamp (Aligned pl-[30px] directly under name) */}
              <div className="flex flex-col gap-1 pl-[30px]">
                <div className="flex items-center gap-2 h-5">
                  {app.status === "approved" && (
                    <>
                      <RiCheckboxCircleFill className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="font-mono text-xs text-[var(--color-text-muted)] truncate">
                        {app.timestamp || "15 May 2024 10:38"}
                      </span>
                    </>
                  )}
                  {app.status === "rejected" && (
                    <>
                      <div className="w-2 h-2 rounded-full bg-[var(--color-text-danger)] shrink-0" />
                      <span className="font-mono text-xs text-[var(--color-text-danger)]">
                        Rejected
                      </span>
                    </>
                  )}
                  {app.status === "reviewing" && (
                    <>
                      <div className="relative flex h-2 w-2 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
                      </div>
                      <span className="font-mono text-xs text-cyan-400 font-medium">
                        Reviewing
                      </span>
                    </>
                  )}
                  {app.status === "pending" && (
                    <>
                      <div className="w-2 h-2 rounded-full bg-white/20 shrink-0" />
                      <span className="font-mono text-xs text-[var(--color-text-muted)]">
                        Yet to review
                      </span>
                    </>
                  )}
                </div>

                {/* Comment quote if present */}
                {app.comment && (
                  <p className="text-xs text-[var(--color-text-secondary)] italic leading-snug">
                    “ {app.comment} ”
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer: Comment & Action Controls ───────────────────────────── */}
      <div className="flex flex-col items-end gap-4 pt-4 self-stretch px-2">
        {/* Comment input on the right (Always visible, disabled during 2FA confirmation) */}
        <div className="w-full sm:w-1/2 lg:w-1/4 max-w-[320px]">
          <TextArea
            placeholder="Add your comment"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            disabled={confirmStage || isSubmitting}
            leadingIcon={<RiDoubleQuotesL className="text-[var(--color-text-muted)]" />}
            minRows={2}
            size="sm"
          />
        </div>

        {/* Action Controls Row */}
        {!confirmStage ? (
          <div className="flex items-center justify-end gap-3 w-full">
            <Button
              size="md"
              variant="neutral"
              appearance="tonal"
              flat
              disabled={isSubmitting}
              onClick={handleUserRejectClick}
              leadingIcon={<RiCloseLine size={18} />}
            >
              Reject
            </Button>

            <Button
              size="md"
              variant="neutral"
              appearance="tonal"
              flat
              disabled={isSubmitting}
              onClick={handleUserApproveClick}
              leadingIcon={<RiCheckLine size={18} />}
            >
              Approve
            </Button>
          </div>
        ) : (
          <div className="flex items-end justify-between w-full gap-4">
            {/* Left side: Back to review button with up arrow */}
            <div>
              <Button
                size="md"
                variant="neutral"
                appearance="tonal"
                flat
                disabled={isSubmitting}
                onClick={handleBackToReview}
                leadingIcon={<RiArrowUpLine size={18} />}
              >
                Back to review
              </Button>
            </div>

            {/* Right side: 2FA input + Confirm button */}
            <div className="flex flex-col items-end gap-3 w-full sm:w-1/2 lg:w-1/4 max-w-[320px]">
              <div className="w-full flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-xs font-normal text-[var(--color-text-muted)]">
                  <span>2FA Code</span>
                  <Tooltip content="Find your 6-digit verification code in your authenticator app">
                    <span className="inline-flex cursor-pointer hover:text-white transition-colors">
                      <RiInformationLine size={14} />
                    </span>
                  </Tooltip>
                </div>
                <TextInput
                  placeholder="Find the OTP on your 2FA app"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  disabled={isSubmitting}
                  size="sm"
                  autoFocus
                />
              </div>

              <Button
                size="md"
                variant="neutral"
                appearance="tonal"
                flat
                disabled={isSubmitting}
                onClick={handleConfirmAction}
                leadingIcon={
                  isSubmitting ? (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                      className="inline-flex"
                    >
                      <RiLoaderFill size={18} />
                    </motion.span>
                  ) : pendingAction === "approve" ? (
                    <RiCheckLine size={18} />
                  ) : (
                    <RiCloseLine size={18} />
                  )
                }
              >
                {pendingAction === "approve" ? "Confirm approve" : "Confirm reject"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
