"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useOnboarding } from "@/lib/onboarding";
import { Avatar, AvatarForge } from "@/components/atoms/Avatar";
import { Button } from "@/components/atoms/Button";
import { Heading, Text } from "@/components/atoms/Typography";
import { RiArrowRightSLine, RiMenuLine, RiPlanetLine, RiSafeLine, RiWalletLine, RiGroupLine, RiUserLine } from "@remixicon/react";
import { GnosisSafeIcon } from "@/media/icons/GnosisSafeIcon";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import { OnboardingTooltip } from "@/components/atoms/OnboardingTooltip";

// ─── Constants ───────────────────────────────────────────────────────────────

const PANEL_WIDTH = "min(520px, calc(100vw - 64px))";
const TOOLTIP_WIDTH = 340;

// ─── Manual Controls for Tour Alignment ─────────────────────────────────────
// Adjust these values to perfectly align the clone and tooltip vertically.
const TOUR_ALIGNMENT = {
  headerSpacer: 80, // Height of the "Wallets" header area
  tooltipTop: 560,  // Vertical position (top offset) of the tooltip below the card
};

const TopArrow = () => (
  <div className="absolute -top-[14px] left-1/2 -translate-x-1/2 w-[28px] h-[14px] overflow-hidden pointer-events-none">
    <div 
      className="w-full h-full border-b-[14px] border-l-[14px] border-r-[14px] border-l-transparent border-r-transparent"
      style={{ borderBottomColor: "rgba(255,255,255,0.08)" }}
    />
  </div>
);

const PANEL_STYLING = "relative overflow-hidden rounded-[24px] border border-white/10 bg-[#0a0a0a]/80 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:border-white/20";

const NOISE_OVERLAY = (
  <div
    className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    }}
  />
);

const TOP_HIGHLIGHT = (
  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
);

// ─── Tooltip arrow ───────────────────────────────────────────────────────────

function LeftArrow({ top = 20 }: { top?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute -left-[5px] w-[10px] h-[10px] border-l border-b border-white/[0.1] bg-[var(--color-surface-sunken)]/90 backdrop-blur-3xl rotate-45"
      style={{ top, zIndex: -1 }}
    />
  );
}

// ─── Clones (Unblurred / Unscaled during Workspace Setup) ────────────────────

function WorkspaceInputClone({ onEnter }: { onEnter: () => void }) {
  const { setWorkspaceName } = useOnboarding();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed z-[9995]"
      style={{ top: 24, left: 24 }}
    >
      <input
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        type="text"
        placeholder="Workspace name"
        maxLength={40}
        onChange={(e) => setWorkspaceName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.target as HTMLInputElement).value.trim()) onEnter();
        }}
        className="w-48 h-9 px-3 rounded-xl text-sm font-semibold bg-[var(--color-surface-elevated)] border border-[var(--color-border-brand)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-disabled)] outline-none focus:ring-1 focus:ring-[var(--color-border-brand)] transition-colors shadow-lg"
      />
    </motion.div>
  );
}

function UserFooterClone() {
  const { userName, userPreset, userPins } = useOnboarding();
  const targetRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <motion.div
        ref={targetRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed z-[9995]"
        style={{ bottom: 18, left: 18, width: 228 }}
      >
        <button
          type="button"
          className="group/footer relative block w-full text-left select-none rounded-full cursor-default"
        >
          <span
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{ boxShadow: "0 0 0 0.5px var(--color-border-subtle)" }}
          />
          <span className="relative z-10 flex w-full items-center gap-[10px] pl-[10px] pr-[8px] py-[9px]">
            <div className="shrink-0">
              <Avatar name={userName} size="sm" preset={userPreset} pins={userPins || undefined} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="block font-semibold text-sm leading-none tracking-[0.01em] truncate transition-colors duration-[130ms] text-[var(--color-text-secondary)]">
                {userName}
              </span>
              <span className="block text-xs leading-none tracking-[0.02em] mt-[4px] truncate transition-colors duration-[130ms] text-[var(--color-text-disabled)]">
                Admin
              </span>
            </div>
            <span className="shrink-0 inline-flex items-center justify-center w-[26px] h-[26px] rounded-full text-[var(--color-icon-secondary)] opacity-0">
              <RiMenuLine size={15} />
            </span>
          </span>
        </button>
      </motion.div>
    </>
  );
}

function WorkspaceSwitcherClone() {
  const { workspaceName } = useOnboarding();
  const displayLabel = workspaceName || "Workspace";
  const targetRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <motion.div
        ref={targetRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed z-[9995]"
        style={{ top: 24, left: 24 }}
      >
        <div className="relative inline-flex items-center gap-[10px] pl-[4px] pr-[10px] py-[7px] rounded-full">
          <span className="relative shrink-0 w-[15px] h-[15px] flex items-center justify-center">
            <span className="text-[var(--color-icon-secondary)]">
              <RiPlanetLine size={15} />
            </span>
          </span>
          <span className="font-medium text-[13px] leading-none text-white whitespace-nowrap pt-px">
            {displayLabel}
          </span>
        </div>
      </motion.div>
    </>
  );
}

// ─── Wallet Specimen Clone ───────────────────────────────────────────────────

const CLONE_WALLET_TYPES = [
  {
    id: "mpc-vault",
    iconPath: RiSafeLine,
    iconColor: "rgba(160,170,180,0.70)",
    name: "MPC Vault",
    scope: "Workspace",
    scopeIcon: RiGroupLine,
    description: "Threshold signing for your team. No one holds the full key, and no one needs to.",
    action: "Create Vault",
    variant: "brand" as const,
  },
  {
    id: "gnosis-safe",
    iconPath: GnosisSafeIcon,
    iconColor: "rgba(160,170,180,0.70)",
    name: "Gnosis Safe",
    scope: "Workspace",
    scopeIcon: RiGroupLine,
    description: "Connect your existing Safe multisig. Nothing changes on-chain — just a better place to operate it.",
    action: "Connect Safe",
    variant: "neutral" as const,
  },
  {
    id: "tracked",
    iconPath: RiWalletLine,
    iconColor: "rgba(160,170,180,0.70)",
    name: "Tracked Wallet",
    scope: "Personal",
    scopeIcon: RiUserLine,
    description: "Watch any EVM address. Private read-only monitoring.",
    action: "Track Wallet",
    variant: "neutral" as const,
  },
] as const;

function WalletCardClone() {
  return (
    <div className="fixed inset-0 z-[9995] flex pointer-events-none">
      {/* 1. Sidebar spacer (mirrors SideNav width) */}
      <div className="w-[264px] shrink-0" />

      {/* 2. Main content area (mirrors MainLayout + WalletsPage padding) */}
        <div className="flex-1 h-full pt-[52px] px-8 overflow-hidden">
        <div className="w-full max-w-[1040px] mx-auto">
          {/* 3. Heading spacer (mirrors Wallets header + margin) */}
          <div style={{ height: TOUR_ALIGNMENT.headerSpacer }} className="mb-8" />

          {/* 4. The actual sharp card clone */}
          <motion.div
            layoutId="onboarding-wallet-card"
            className="relative w-full rounded-[40px] overflow-hidden pointer-events-auto"
            animate={{ 
              scale: 1, 
              filter: "blur(0px)",
              opacity: 1,
            }}
            transition={{ type: "spring", stiffness: 200, damping: 26 }}
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
            <div
              className="absolute inset-0 opacity-[0.015] pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              }}
            />
            <div className="relative z-10 flex flex-col md:flex-row items-stretch justify-between">
              {CLONE_WALLET_TYPES.map((type) => (
                <div key={type.id} className="flex-1">
                  <div className="flex flex-col items-start p-10 h-full gap-8">
                    <div style={{ color: type.iconColor }}>
                      <type.iconPath size={40} />
                    </div>
                    <div className="flex flex-col items-start gap-3 flex-1">
                      <div className="flex flex-col gap-2">
                        <Heading level="h3" size="xl" weight="semibold" font="display" className="tracking-tightest text-white">
                          {type.name}
                        </Heading>
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full border border-white/[0.06] bg-white/[0.03] w-fit">
                          <type.scopeIcon size={12} />
                          <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-400">
                            {type.scope}
                          </span>
                        </div>
                      </div>
                      <Text size="sm" color="muted" className="leading-relaxed">
                        {type.description}
                      </Text>
                    </div>
                    <Button
                      size="lg"
                      variant={type.variant}
                      appearance={type.variant === "brand" ? "filled" : "tonal"}
                      className="w-full"
                    >
                      {type.action}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ─── OnboardingShell ─────────────────────────────────────────────────────────

export function OnboardingShell({ children }: { children: React.ReactNode }) {
  const { active, phase, setIdentity, advancePhase, completeWorkspace, close } = useOnboarding();

  const scaleDown = active;

  return (
    <>
      {/* ── App content — scales down when any onboarding phase is active ─── */}
      <motion.div
        className="flex h-screen w-full overflow-hidden"
        animate={{
          scale: scaleDown ? 0.92 : 1,
          borderRadius: scaleDown ? 32 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
      >
        {children}
      </motion.div>

      <AnimatePresence>
        {scaleDown && (
          <motion.div
            className="fixed inset-0 z-[9990]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{
              backdropFilter: "blur(8px)",
              background: "rgba(0,0,0,0.3)",
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === "workspace" && (
          <WorkspaceInputClone onEnter={() => completeWorkspace(false)} key="ws-input" />
        )}
        {(phase === "workspace" || phase === "tour") && (
          <UserFooterClone key="user-footer" />
        )}
        {phase === "tour" && (
          <WorkspaceSwitcherClone key="ws-switcher" />
        )}
        {phase === "tour" && (
          <WalletCardClone key="wallet-gallery" />
        )}
      </AnimatePresence>

      {/* ── Unified Floating Tooltip ────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {active && (
          <div className={cn(
            "fixed inset-0 z-[9999] pointer-events-none flex",
            phase === "tour" ? "flex-row" : "flex-col"
          )}>
            {phase === "tour" && <div className="w-[264px] shrink-0" />}
            
            <div className="relative flex-1">
              <motion.div
                key={`tooltip-${phase}`}
                layoutId="onboarding-tooltip-container"
                className="absolute"
                initial={{
                  opacity: 0,
                  scale: 0.97,
                  filter: "blur(6px)",
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  filter: "blur(0px)",
                  bottom: phase === "welcome" ? 32 : "auto",
                  top: phase === "welcome" ? "auto" : (phase === "workspace" ? 24 : TOUR_ALIGNMENT.tooltipTop),
                  left: phase === "welcome" ? 32 : (phase === "workspace" ? 272 : "50%"),
                  x: phase === "tour" ? "-50%" : 0,
                  y: 0,
                }}
                exit={{ opacity: 0, scale: 0.97, filter: "blur(6px)" }}
                transition={{
                  default: { type: "spring", stiffness: 240, damping: 28 },
                  opacity: { duration: 0.45, ease: "easeOut" },
                  filter: { duration: 0.5 },
                  layout: { type: "spring", stiffness: 240, damping: 28 },
                }}
                style={{ originX: 0.5, originY: 0.5 }}
              >
                <motion.div
                  layoutId="onboarding-tooltip-panel"
                  className={cn(PANEL_STYLING, "pointer-events-auto")}
                  style={{
                    width: phase === "welcome" ? "100%" : TOOLTIP_WIDTH,
                    maxWidth: phase === "welcome" ? "520px" : undefined,
                    padding: 24,
                  }}
                  role="dialog"
                  aria-modal="true"
                >
                  {NOISE_OVERLAY}
                  {TOP_HIGHLIGHT}

                  <AnimatePresence mode="popLayout">
                    {phase === "welcome" && (
                      <motion.div
                        key="phase-welcome"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={{
                          hidden: {},
                          visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
                          exit: { opacity: 0, scale: 0.96, transition: { duration: 0.15 } },
                        }}
                        className="flex flex-col gap-8"
                      >
                        <motion.div
                          className="flex flex-col gap-2"
                          variants={{
                            hidden: { opacity: 0, y: 12 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
                          }}
                        >
                          <Heading level="h2" size="xl" weight="semibold">
                            Set your identity
                          </Heading>
                          <Text size="sm" color="secondary" className="max-w-[400px] leading-relaxed">
                            Choose a name and signature color. This is how you&apos;ll be
                            represented in shared workspaces and transaction logs.
                          </Text>
                        </motion.div>

                        <motion.div
                          variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
                          }}
                        >
                          <AvatarForge
                            placeholder="Display name"
                            confirmLabel="Save & continue"
                            onConfirm={(name, preset, pins) => {
                              setIdentity(name, preset, pins);
                              setTimeout(advancePhase, 3800);
                            }}
                          />
                        </motion.div>
                      </motion.div>
                    )}
                    {phase === "workspace" && (
                      <motion.div
                        key="phase-workspace"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10, transition: { duration: 0.15 } }}
                        className="flex flex-col gap-4 relative"
                      >
                        <div className="flex flex-col gap-1.5 pt-1">
                          <Heading level="h4" size="md" weight="semibold">Your Workspace</Heading>
                          <Text size="sm" color="secondary" className="leading-relaxed">
                            Enter a team name to manage wallets and transaction flows.
                          </Text>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="neutral"
                            appearance="outline"
                            onClick={() => completeWorkspace(true)}
                          >
                            Skip & continue
                          </Button>
                          <Button
                            size="sm"
                            variant="brand"
                            appearance="filled"
                            trailingIcon={<RiArrowRightSLine size={14} />}
                            onClick={() => completeWorkspace(false)}
                          >
                            Save & continue
                          </Button>
                        </div>
                      </motion.div>
                    )}
                    {phase === "tour" && (
                      <motion.div
                        key="phase-tour"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.15 } }}
                        className="flex flex-col gap-4 relative"
                      >
                        <div className="flex flex-col gap-1.5 pt-1">
                          <Heading level="h4" size="md" weight="semibold">Wallets Gallery</Heading>
                          <Text size="sm" color="secondary" className="leading-relaxed">
                            Choose how you want to manage your assets. Token supports MPC Vaults, Gnosis Safes, and Read-only monitoring.
                          </Text>
                        </div>
                        <div className="flex justify-end gap-2">
                           <Button onClick={close} size="sm" variant="brand" appearance="filled">
                            Finish Tour
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
