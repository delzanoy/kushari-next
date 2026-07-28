"use client";

import { useRouter } from "next/navigation";
import { useDemoMode } from "@/lib/demo-mode";
import { useWallets, useCryptocurrencies, useMembers } from "@/hooks/useData";
import { motion, AnimatePresence } from "framer-motion";
import { RiWalletLine, RiSafeLine, RiGroupLine, RiUserLine } from "@remixicon/react";
import { GnosisSafeIcon } from "@/media/icons/GnosisSafeIcon";
import { Button } from "@/components/atoms/Button";
import { TertiaryButton } from "@/components/atoms/TertiaryButton";
import { Heading, Text } from "@/components/atoms/Typography";
import { WalletList } from "@/components/molecules/wallet/WalletList";
import { WalletDataPreloader } from "@/components/molecules/wallet/WalletDataPreloader";
import { cn } from "@/lib/utils";
import type { WalletSummary } from "@/components/molecules/wallet/types";
import { enrichWalletsWithPrices } from "@/lib/wallet-enrichment";
import { useMemo } from "react";
import { useModal, Modal } from "@/components/molecules/modal";
import CreateVault from "@/components/molecules/wallet/CreateVault";
import ConnectSafe from "@/components/molecules/wallet/ConnectSafe";
import TrackWallet from "@/components/molecules/wallet/TrackWallet";

// ─── Motion ───────────────────────────────────────────────────────────────────

const SPRING_CARD = { type: "spring", stiffness: 180, damping: 24, mass: 1.1 } as const;
const SPRING_ICON = { type: "spring", stiffness: 220, damping: 28, mass: 0.8 } as const;

const PAGE_VARIANTS = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const ITEM_VARIANTS = {
  hidden: { opacity: 0, scale: 0.98, y: 12 },
  show: { opacity: 1, scale: 1, y: 0, transition: SPRING_CARD },
};

const ICON_VARIANTS = {
  hidden: { opacity: 0, scale: 0.8, rotate: -4 },
  show: { opacity: 1, scale: 1, rotate: 0, transition: SPRING_ICON },
};

// ─── Wallet types (empty state) ───────────────────────────────────────────────

const WALLET_TYPES = [
  {
    id: "mpc-vault",
    icon: <RiSafeLine size={40} strokeWidth={1} />,
    iconColor: "rgba(160,170,180,0.70)",
    name: "MPC Vault",
    scope: "Workspace",
    scopeIcon: <RiGroupLine size={12} />,
    description: "Threshold signing for your team. No one holds the full key, and no one needs to.",
    action: "Create Vault",
    variant: "brand" as const,
  },
  {
    id: "gnosis-safe",
    icon: <GnosisSafeIcon size={40} color="rgba(160,170,180,0.70)" />,
    iconColor: "rgba(160,170,180,0.70)",
    name: "Gnosis Safe",
    scope: "Workspace",
    scopeIcon: <RiGroupLine size={12} />,
    description: "Connect your existing Safe multisig. Nothing changes on-chain — just a better place to operate it.",
    action: "Connect Safe",
    variant: "neutral" as const,
  },
  {
    id: "tracked",
    icon: <RiWalletLine size={40} strokeWidth={1} />,
    iconColor: "rgba(160,170,180,0.70)",
    name: "Tracked Wallet",
    scope: "Personal",
    scopeIcon: <RiUserLine size={12} />,
    description: "Watch any EVM address. Private read-only monitoring.",
    action: "Track Wallet",
    variant: "neutral" as const,
  },
] as const;


// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WalletsPage() {
  const router = useRouter();
  const { demoMode } = useDemoMode();
  const { wallets: apiWallets, isLoading: isWalletsLoading, mutate } = useWallets();
  const { cryptocurrencies, isLoading: isCryptoLoading } = useCryptocurrencies();
  const { members } = useMembers();
  const { open, closeTop } = useModal();

  // In demoMode (API Data on), show the wallets returning from the hook.
  // When off, show a forced empty gallery state.
  // we cast to any[] first, then enrichment adds the USDBalance and percentChange
  // fields required by WalletSummary.
  const rawWallets = demoMode
    ? ((apiWallets as any[]) ?? [])
    : [];

  // Enrich wallets with USD balances and 24h change prices
  const wallets = useMemo(() => {
    return enrichWalletsWithPrices(rawWallets, cryptocurrencies ?? []);
  }, [rawWallets, cryptocurrencies]);

  const handleCreateVault = (rect?: DOMRect) => {
    open(
      <Modal onClose={closeTop} animation={rect ? "expand" : "slide-up"} originRect={rect}>
        <CreateVault
          onClose={closeTop}
          members={members || []}
          onVaultCreated={async () => {
            await mutate();
          }}
        />
      </Modal>
    );
  };

  const handleConnectSafe = (rect?: DOMRect) => {
    open(
      <Modal onClose={closeTop} animation={rect ? "expand" : "slide-up"} originRect={rect}>
        <ConnectSafe
          onClose={closeTop}
          members={members || []}
          onSafeConnected={async () => {
            await mutate();
          }}
        />
      </Modal>
    );
  };

  const handleTrackWallet = (rect?: DOMRect) => {
    open(
      <Modal onClose={closeTop} animation={rect ? "expand" : "slide-up"} originRect={rect}>
        <TrackWallet
          onClose={closeTop}
          onWalletTracked={async () => {
            await mutate();
          }}
        />
      </Modal>
    );
  };

  const handleWalletClick = (id: number) => {
    router.push(`/wallets/${id}`);
  };

  const isLoading = isWalletsLoading || isCryptoLoading;
  const count = wallets.length;
  const hasWallets = count > 0;
  const showList = hasWallets;
  const showLoading = demoMode && isLoading && !hasWallets;
  const showEmpty = (!demoMode) || (demoMode && !isLoading && !hasWallets);

  return (
    <div className="min-h-full bg-black flex flex-col pt-[52px] pb-24 px-8 overflow-x-hidden selection:bg-cyan-500/30">
      <div className="w-full max-w-[1040px] mx-auto">

        <WalletDataPreloader />
        <div className="mb-8 flex items-center self-stretch h-8">
          <h1 className="text-[var(--color-text-primary)] text-[26px] font-medium tracking-tight">
            Wallets
          </h1>
        </div>

        {/* ── Content ─────────────────────────────────────────────────────── */}
        {showLoading && <LoadingRows />}

        {showList && (
          <WalletList 
            wallets={wallets} 
            onWalletClick={handleWalletClick}
            onCreateVault={handleCreateVault} 
            onConnectSafe={handleConnectSafe}
            onTrackWallet={handleTrackWallet}
          />
        )}

        {showEmpty && (
          <EmptyCard 
            onCreateVault={handleCreateVault} 
            onConnectSafe={handleConnectSafe}
            onTrackWallet={handleTrackWallet}
          />
        )}

      </div>
    </div>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function LoadingRows() {
  return (
    <motion.div
      key="loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.1 } }}
      className="flex flex-col gap-3"
    >
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="w-full h-[52px] rounded-[16px] animate-pulse"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "0.5px solid rgba(255,255,255,0.05)",
          }}
        />
      ))}
    </motion.div>
  );
}

// ─── Empty card ───────────────────────────────────────────────────────────────

function EmptyCard({ 
  onCreateVault,
  onConnectSafe,
  onTrackWallet
}: { 
  onCreateVault?: (rect?: DOMRect) => void;
  onConnectSafe?: (rect?: DOMRect) => void;
  onTrackWallet?: (rect?: DOMRect) => void;
}) {
  return (
    <div
      className="relative w-full rounded-[40px] overflow-hidden"
      style={{
        background: "rgba(10,10,10,0.95)",
        boxShadow: [
          "0 0 0 0.5px rgba(255,255,255,0.08)",
          "inset 0 1px 0 rgba(255,255,255,0.16)",
          "inset 0 -0.5px 0 rgba(255,255,255,0.04)",
          "inset 1px 0 0 rgba(255,255,255,0.06)",
          "inset -1px 0 0 rgba(255,255,255,0.06)",
          "0 32px 80px rgba(0,0,0,0.5)",
        ].join(", "),
      }}
    >
      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Columns */}
      <div className="relative z-10 flex flex-col md:flex-row items-stretch">
        {WALLET_TYPES.map((type) => (
          <div key={type.id} className="flex-1">
            <WalletSpecimen 
              type={type} 
              onAction={
                type.id === "mpc-vault" 
                  ? onCreateVault 
                  : type.id === "gnosis-safe" 
                  ? onConnectSafe 
                  : type.id === "tracked"
                  ? onTrackWallet
                  : undefined
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Wallet Specimen ──────────────────────────────────────────────────────────

function WalletSpecimen({ 
  type,
  onAction
}: { 
  type: typeof WALLET_TYPES[number];
  onAction?: (rect?: DOMRect) => void;
}) {
  return (
    <div className="flex flex-col items-start p-10 h-full gap-8">
      {/* Icon */}
      <div
        style={{ color: type.iconColor }}
      >
        {type.icon}
      </div>

      {/* Name + scope + description */}
      <div className="flex flex-col items-start gap-3 flex-1">
        <div className="flex flex-col gap-2">
          <Heading level="h3" size="xl" weight="semibold" font="display" className="tracking-tightest text-white">
            {type.name}
          </Heading>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full border border-white/[0.06] bg-white/[0.03] w-fit">
            {type.scopeIcon}
            <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-400">
              {type.scope}
            </span>
          </div>
        </div>

        <Text size="sm" color="muted" className="leading-relaxed">
          {type.description}
        </Text>
      </div>

      {/* CTA */}
      <div className="mt-auto pt-2 w-full">
        <Button
          size="lg"
          variant={type.variant}
          appearance={type.variant === "brand" ? "filled" : "tonal"}
          className="w-full cursor-pointer"
          onClick={(e) => onAction?.(e.currentTarget.getBoundingClientRect())}
          flat
        >
          {type.action}
        </Button>
      </div>
    </div>
  );
}
