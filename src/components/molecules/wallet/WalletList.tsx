"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/atoms/Button";
import { TertiaryButton } from "@/components/atoms/TertiaryButton";
import { BlockchainIconStack } from "@/components/atoms/BlockchainIconStack";
import { MPCVaultCard } from "./cards/MPCVaultCard";
import { GnosisSafeCard } from "./cards/GnosisSafeCard";
import { TrackedWalletCard } from "./cards/TrackedWalletCard";
import type { WalletSummary, BlockchainInfo } from "./types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WalletListProps {
  wallets: WalletSummary[];
  onWalletClick?: (id: number) => void;
  onCreateVault?: (rect?: DOMRect) => void;
  onConnectSafe?: (rect?: DOMRect) => void;
  onTrackWallet?: (rect?: DOMRect) => void;
}

// ─── Motion ───────────────────────────────────────────────────────────────────

const LIST_VARIANTS = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.02 } },
};

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 28, mass: 0.8 } },
} as const;

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({
  label,
  action,
  onAction,
  chains,
}: {
  label: string;
  action: string;
  onAction?: (rect?: DOMRect) => void;
  chains?: string[];
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">
          {label}
        </span>
        {chains && chains.length > 0 && (
          <BlockchainIconStack blockchain={chains} />
        )}
      </div>
      <TertiaryButton
        size="lg"
        variant="brand"
        className="cursor-pointer"
        onClick={(e) => onAction?.(e.currentTarget.getBoundingClientRect())}
      >
        {action}
      </TertiaryButton>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

import { useModal, Modal } from "@/components/molecules/modal";
import MakeDeposit from "./modals/MakeDeposit";
import SendTokens from "./modals/SendTokens";

export function WalletList({
  wallets,
  onWalletClick,
  onCreateVault,
  onConnectSafe,
  onTrackWallet,
}: WalletListProps) {
  const { open, closeTop } = useModal();

  const handleDeposit = (wallet: WalletSummary, rect?: DOMRect) => {
    open(
      <Modal onClose={closeTop} animation={rect ? "expand" : "slide-up"} originRect={rect}>
        <MakeDeposit wallet={wallet} onClose={closeTop} />
      </Modal>
    );
  };

  const handleSend = (wallet: WalletSummary, rect?: DOMRect) => {
    open(
      <Modal onClose={closeTop} animation={rect ? "expand" : "slide-up"} originRect={rect}>
        <SendTokens selectedWallet={wallet} wallets={wallets} onClose={closeTop} />
      </Modal>
    );
  };

  const vaults = wallets.filter((w) => w.type === 1);
  const safes = wallets.filter((w) => w.type === 2);
  const tracked = wallets.filter((w) => w.type === 3);

  // Unique chains across all vaults — shown in the section header
  const vaultChains = Array.from(new Set(
    vaults.flatMap((w) =>
      typeof w.blockchain === "string"
        ? [w.blockchain]
        : (w.blockchain as BlockchainInfo[]).map((b) => b.blockchain)
    )
  ));

  return (
    <div className="flex flex-col gap-10">

      {/* ── Vaults ─────────────────────────────────────────────────────────── */}
      <section className="flex flex-col gap-4">
        <SectionHeader
          label="Vaults"
          action="Create Vault"
          onAction={onCreateVault}
          chains={vaultChains}
        />
        {vaults.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            variants={LIST_VARIANTS}
            initial="hidden"
            animate="show"
          >
            {vaults.map((wallet) => (
              <motion.div key={wallet.id} variants={ITEM_VARIANTS}>
                <MPCVaultCard
                  wallet={wallet}
                  onClick={() => onWalletClick?.(wallet.id)}
                  onDeposit={(rect) => handleDeposit(wallet, rect)}
                  onSend={(rect) => handleSend(wallet, rect)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <EmptyRow label="No vaults yet" />
        )}
      </section>

      {/* ── Gnosis Safe ────────────────────────────────────────────────────── */}
      <section className="flex flex-col gap-4">
        <SectionHeader
          label="Gnosis Safe"
          action="Connect Safe"
          onAction={onConnectSafe}
        />
        {safes.length > 0 ? (
          <motion.div
            className="flex flex-col gap-2"
            variants={LIST_VARIANTS}
            initial="hidden"
            animate="show"
          >
            {safes.map((wallet) => (
              <motion.div key={wallet.id} variants={ITEM_VARIANTS}>
                <GnosisSafeCard
                  wallet={wallet}
                  onClick={() => onWalletClick?.(wallet.id)}
                  onDeposit={(rect) => handleDeposit(wallet, rect)}
                  onSend={(rect) => handleSend(wallet, rect)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <EmptyRow label="No Gnosis Safes connected" />
        )}
      </section>

      {/* ── Tracked wallets ─────────────────────────────────────────────────── */}
      <section className="flex flex-col gap-4">
        <SectionHeader
          label="Tracked Wallets"
          action="Track Wallet"
          onAction={onTrackWallet}
        />
        {tracked.length > 0 ? (
          <motion.div
            className="flex flex-col gap-2"
            variants={LIST_VARIANTS}
            initial="hidden"
            animate="show"
          >
            {tracked.map((wallet) => (
              <motion.div key={wallet.id} variants={ITEM_VARIANTS}>
                <TrackedWalletCard
                  wallet={wallet}
                  onClick={() => onWalletClick?.(wallet.id)}
                  onDeposit={(rect) => handleDeposit(wallet, rect)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <EmptyRow label="No tracked wallets" />
        )}
      </section>

    </div>
  );
}

// ─── Empty row ────────────────────────────────────────────────────────────────

function EmptyRow({ label }: { label: string }) {
  return (
    <div
      className="flex items-center justify-center py-6 rounded-[32px]"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "0.5px solid rgba(255,255,255,0.05)",
      }}
    >
      <span className="font-mono text-[11px] tracking-[0.08em] text-[var(--color-text-disabled)]">
        {label}
      </span>
    </div>
  );
}
