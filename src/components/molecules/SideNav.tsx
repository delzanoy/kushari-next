"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiWalletLine,
  RiCoinsLine,
  RiFileTextLine,
  RiCheckboxCircleLine,
  RiGroupLine,
  RiSettings6Line,
  RiUserSettingsLine,
  RiMenuLine,
  RiExpandUpDownLine,
  RiPlanetLine,
  RiEyeLine,
  RiUserLine,
  RiLifebuoyLine,
  RiGlobalLine,
  RiMagicLine,
  RiExternalLinkLine,
  RiLogoutBoxRLine,
} from "@remixicon/react";

import {
  SidebarNavGroup,
  SidebarNavItem,
  SidebarNavToggle,
} from "@/components/molecules/SidebarNav";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSeparator,
} from "@/components/atoms/Dropdown";
import { Tooltip } from "@/components/atoms/Tooltip";
import { Button } from "@/components/atoms/Button";
import { Avatar } from "@/components/atoms/Avatar";
import { IconButton } from "@/components/atoms/IconButton";
import { cn } from "@/lib/utils";
import { useDemoMode } from "@/lib/demo-mode";
import { useOnboarding } from "@/lib/onboarding";
import { useWorkspaces, useMembers } from "@/hooks/useData";
import { useModal, Modal } from "@/components/molecules/modal";
import { SettingsModal } from "@/components/molecules/settings/SettingsModal";

// Define a type for API workspaces if needed, or use any for now
// Since useWorkspaces returns 'data', we'll handle the type in the component.
type ApiWorkspace = any;

// ─── Motion constants ─────────────────────────────────────────────────────────

// Matches molecules docs Full Composition stagger
const STAGGER_CONTAINER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045, delayChildren: 0.05 } },
};
const STAGGER_ITEM: import("framer-motion").Variants = {
  hidden: { opacity: 0, x: -7 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 400, damping: 30, mass: 0.8 } },
};

// Brand RGB — matches --color-interactive-brand-default (#26C9C9)
const B = "38,201,201";

// Top-lit glass panel — light source above, surface catches it at the top rim
const PANEL_BG = "linear-gradient(180deg, rgba(28,28,28,0.82) 0%, rgba(14,14,14,0.74) 18%, rgba(10,10,10,0.60) 100%)";
const PANEL_SHADOW = [
  "0 0 0 0.5px rgba(255,255,255,0.06)",
  "inset 0 0.5px 0 rgba(255,255,255,0.16)",
  "inset 0 -0.5px 0 rgba(0,0,0,0.35)",
  "inset 1px 0 0 rgba(255,255,255,0.04)",
  "inset -1px 0 0 rgba(255,255,255,0.04)",
  "0 24px 64px rgba(0,0,0,0.45)",
].join(", ");

// ─── Types ────────────────────────────────────────────────────────────────────

interface Workspace {
  id: number;
  name: string;
  preset: string;
}

type NavSection =
  | { type: "normal"; label: string; items: NavItem[] }
  | { type: "coming-soon"; label: string };

interface NavItem {
  label: string;
  Icon: React.ComponentType<{ size?: number | string }>;
  href: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const WORKSPACES: Workspace[] = [
  { id: 1, name: "Token Labs", preset: "Cyan Dusk" },
  { id: 2, name: "Personal", preset: "Deep Sea" },
  { id: 3, name: "Acme Corp", preset: "Midnight" },
];

// Icons match the molecules docs Full Composition exactly
const NAV_SECTIONS: NavSection[] = [
  {
    type: "normal",
    label: "View and manage",
    items: [
      { label: "Wallets", Icon: RiWalletLine, href: "/wallets" },
      { label: "Assets", Icon: RiCoinsLine, href: "/assets" },
    ],
  },
  {
    type: "normal",
    label: "Transactions",
    items: [
      { label: "View all", Icon: RiFileTextLine, href: "/transactions/view-all" },
      { label: "Proposals", Icon: RiCheckboxCircleLine, href: "/transactions/proposals" },
    ],
  },
  { type: "coming-soon", label: "Accounting" },
  {
    type: "normal",
    label: "Address book",
    items: [
      { label: "Addresses", Icon: RiUserLine, href: "/address-book/addresses" },
      { label: "Groups", Icon: RiGroupLine, href: "/address-book/groups" },
    ],
  },
];

// ─── WorkspaceSwitcher ────────────────────────────────────────────────────────

function WorkspaceSwitcher({
  value,
  onChange,
}: {
  value: number;
  onChange: (id: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { phase, workspaceName, setWorkspaceName, isWorkspaceSkipped, setIsWorkspaceSkipped } = useOnboarding();
  const { demoMode } = useDemoMode();
  const { workspaces } = useWorkspaces();

  // Derived workspace list
  const activeWorkspaces = useMemo(() => {
    // Always start with the user's current identity from onboarding if set
    const primary = { id: 1, name: workspaceName };
    const hasPrimary = !!workspaceName.trim();

    if (!demoMode) {
      // In production/active mode, we only show current user identity
      // unless we want to extend this with real API-fetched workspaces later.
      return hasPrimary ? [primary] : [];
    }

    // In demo mode, merge onboarding data with sample set from API
    // We map API results to start from ID 2 to avoid collision with ID 1
    const samples = (workspaces || []).map((ws: ApiWorkspace, idx: number) => ({
      id: idx + 2,
      name: ws.name,
    }));

    return hasPrimary ? [primary, ...samples] : samples;
  }, [workspaceName, demoMode, workspaces]);

  const current = activeWorkspaces.find((w) => w.id === value) ?? activeWorkspaces[0];
  const displayLabel = value === 1 ? workspaceName : (current?.name || "");

  return (
    <div className="flex-1 min-w-0">
      <Dropdown open={open} onOpenChange={setOpen} disabled={isEditing}>
        <DropdownTrigger>
          <div
            role="button"
            tabIndex={0}
            className="relative self-start inline-flex items-center gap-[10px] pl-[4px] pr-[10px] py-[7px] rounded-full text-left focus-visible:outline-none select-none cursor-pointer
              border border-transparent
              group-hover/sidebar:bg-[var(--color-interactive-neutral-tonal-bg)]
              group-hover/sidebar:border-[var(--color-interactive-neutral-tonal-border)]
              group-hover/sidebar:hover:bg-[var(--color-interactive-neutral-tonal-bg-hover)]
              group-hover/sidebar:active:bg-[var(--color-interactive-neutral-tonal-bg-active)]
              group-hover/sidebar:active:scale-[0.98]
              transition-all duration-150"
          >
            {/* Icon: planet at rest, expand-up-down on sidebar hover */}
            <span className="relative shrink-0 w-[15px] h-[15px] flex items-center justify-center">
              <span className="absolute transition-opacity duration-200 group-hover/sidebar:opacity-0 text-[var(--color-icon-secondary)]">
                <RiPlanetLine size={15} />
              </span>
              <span className="absolute opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 text-[var(--color-icon-secondary)]">
                <RiExpandUpDownLine size={15} />
              </span>
            </span>

            {value === 1 && (!workspaceName || isEditing) ? (
              <Tooltip
                open={isWorkspaceSkipped && isEditing && phase === "idle"}
                placement="bottom-start"
                variant="brand"
                title="Name your workspace"
                description="You skipped this step earlier. Give your workspace a name to keep things organized."
                actions={[
                  {
                    label: "Confirm",
                    variant: "brand",
                    appearance: "filled",
                    onClick: () => {
                      if (workspaceName.trim()) {
                        setWorkspaceName(workspaceName);
                        setIsEditing(false);
                        setIsWorkspaceSkipped(false);
                      }
                    }
                  }
                ]}
              >
                <input
                  type="text"
                  placeholder="Workspace"
                  value={workspaceName}
                  onFocus={() => setIsEditing(true)}
                  onBlur={() => {
                    // Small delay to allow clicking the confirm button in the tooltip
                    setTimeout(() => setIsEditing(false), 200);
                  }}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full bg-transparent border-none outline-none font-semibold text-sm leading-none tracking-[0.01em] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-disabled)]"
                />
              </Tooltip>
            ) : (
              <span className="font-semibold text-sm leading-none tracking-[0.01em] text-[var(--color-text-secondary)]">
                {displayLabel}
              </span>
            )}
          </div>
        </DropdownTrigger>

        <DropdownMenu minWidth={200} sideOffset={6}>
          {activeWorkspaces.map((ws: { id: number; name: string }) => (
            <DropdownItem
              key={ws.id}
              selected={ws.id === value}
              onSelect={() => onChange(ws.id)}
            >
              {ws.name}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}

// ─── Coming soon section ──────────────────────────────────────────────────────
// Visually identical to a SidebarNavGroup header, but dim + badge instead of items.

function ComingSoonSection({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 px-[11px] pt-[10px] pb-[5px]">
      <span className="flex-1 font-mono text-2xs tracking-[0.28em] uppercase text-text-muted opacity-50">
        {label}
      </span>
      <div
        className="flex items-center px-[8px] py-[4px] rounded-full"
        style={{
          background: "rgba(6,150,104,0.12)",
          border: "0.5px solid rgba(6,150,104,0.25)",
        }}
      >
        <span
          className="font-mono text-[9px] font-semibold tracking-[0.05em] uppercase"
          style={{ color: "rgba(6,150,104,0.85)" }}
        >
          Coming soon
        </span>
      </div>
    </div>
  );
}

// ─── User footer ──────────────────────────────────────────────────────────────

function UserFooter() {
  const [open, setOpen] = useState(false);
  const { userName, userPreset, userPins } = useOnboarding();
  const { open: openModal, closeTop } = useModal();
  const { members } = useMembers();

  const currentUser = members?.find((m: any) => m.isCurrentUser || m.name === "Delanoy Kunil");
  const displayName = currentUser?.name || userName || "Delanoy Kunil";

  return (
    <Dropdown open={open} onOpenChange={setOpen}>
      <DropdownTrigger>
        <button
          type="button"
          className="group/footer relative block w-full text-left select-none rounded-full focus-visible:outline-none cursor-pointer active:scale-[0.98] transition-transform duration-100"
        >
          {/* Hover fill + brand ring — also persists when open */}
          <div
            className={cn(
              "absolute inset-0 rounded-full pointer-events-none transition-opacity duration-[130ms]",
              open ? "opacity-100" : "opacity-0 group-hover/footer:opacity-100",
            )}
            style={{
              background: "var(--color-interactive-brand-tonal-bg-hover)",
              boxShadow: `inset 0 0.5px 0 rgba(${B},0.60), 0 0 0 0.5px rgba(${B},0.18)`,
            }}
          />

          <span className="relative z-10 flex w-full items-center gap-[10px] pl-[10px] pr-[8px] py-[9px]">
            <div className="shrink-0">
              <Avatar name={displayName} size="sm" preset={userPreset} pins={userPins || undefined} />
            </div>

            <div className="flex-1 min-w-0">
              <span className={cn(
                "block font-semibold text-sm leading-none tracking-[0.01em] truncate transition-colors duration-[130ms]",
                open ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)] group-hover/footer:text-[var(--color-text-primary)]",
              )}>
                {displayName}
              </span>
              <span className={cn(
                "block text-xs leading-none tracking-[0.02em] mt-[4px] truncate transition-colors duration-[130ms]",
                open ? "text-[var(--color-text-muted)]" : "text-[var(--color-text-disabled)] group-hover/footer:text-[var(--color-text-muted)]",
              )}>
                Admin
              </span>
            </div>

            {/* Menu icon — appears on hover or when open */}
            <span className={cn(
              "shrink-0 inline-flex items-center justify-center w-[26px] h-[26px] rounded-full text-[var(--color-icon-secondary)] transition-opacity duration-[130ms]",
              open ? "opacity-100" : "opacity-0 group-hover/sidebar:opacity-100",
            )}>
              <RiMenuLine size={15} />
            </span>
          </span>
        </button>
      </DropdownTrigger>

      <DropdownMenu minWidth={220} sideOffset={6}>
        <DropdownItem icon={<RiUserLine size={15} />}>
          Profile
        </DropdownItem>
        <DropdownItem
          icon={<RiUserSettingsLine size={15} />}
          onSelect={() =>
            openModal(
              <Modal onClose={closeTop} animation="slide-up">
                <SettingsModal onClose={closeTop} />
              </Modal>
            )
          }
        >
          Settings
        </DropdownItem>
        <DropdownItem icon={<RiLifebuoyLine size={15} />}>
          Help & support
        </DropdownItem>
        <DropdownSeparator />
        <DropdownItem
          icon={<RiGlobalLine size={15} />}
          trailingIcon={<RiExternalLinkLine size={15} />}
        >
          Website
        </DropdownItem>
        <DropdownItem
          icon={<RiMagicLine size={15} />}
          trailingIcon={<RiExternalLinkLine size={15} />}
        >
          Delanoy&apos;s portfolio
        </DropdownItem>
        <DropdownSeparator />
        <DropdownItem
          trailingIcon={<RiLogoutBoxRLine size={15} />}
        >
          Logout
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

// ─── Active-path helper ───────────────────────────────────────────────────────

function useIsActive() {
  const pathname = usePathname();
  return (href: string) => {
    if (href === "/wallets") return pathname.startsWith("/wallets");
    if (href === "/assets") return pathname.startsWith("/assets");
    if (href === "/transactions/view-all") return pathname === "/transactions/view-all" || pathname === "/transactions";
    if (href === "/transactions/proposals") return pathname.startsWith("/transactions/proposals");
    if (href === "/address-book/addresses") return pathname === "/address-book/addresses" || pathname === "/address-book";
    if (href === "/address-book/groups") return pathname.startsWith("/address-book/groups");
    return pathname === href;
  };
}

// ─── SideNav ──────────────────────────────────────────────────────────────────

export function SideNav({ className }: { className?: string }) {
  const [workspaceId, setWorkspaceId] = useState(1);
  const { demoMode, setDemoMode } = useDemoMode();
  const { phase, start: startOnboarding } = useOnboarding();
  const isActive = useIsActive();
  const { workspaces } = useWorkspaces();
  const { open, closeTop } = useModal();

  useEffect(() => {
    if (demoMode && workspaces && workspaces.length > 0 && workspaceId === 1) {
      setWorkspaceId(2);
    } else if (!demoMode && workspaceId !== 1) {
      setWorkspaceId(1);
    }
  }, [demoMode, workspaces, workspaceId]);

  const handleOpenSettings = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    open(
      <Modal onClose={closeTop} animation="slide-up">
        <SettingsModal onClose={closeTop} />
      </Modal>
    );
  };

  return (
    // Outer shell: provides the padding so the panel floats inside the layout column
    <div className={cn("relative w-[264px] h-full shrink-0 p-3", className)}>
      {/* Ambient light — sits behind the glass panel */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 100% 35% at 50% 0%, rgba(200,210,220,0.12) 0%, transparent 80%)`,
          filter: "blur(20px)",
        }}
      />
      <motion.nav
        className="group/sidebar relative flex flex-col h-full rounded-[24px]"
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
        style={{
          background: PANEL_BG,
          boxShadow: PANEL_SHADOW,
          backdropFilter: phase === "tour" ? "none" : "blur(32px) saturate(180%)",
        }}
      >
        {/* ── Header: workspace switcher + settings ──────────────────────────── */}
        <motion.div
          className="flex items-center justify-between gap-1.5 px-3 py-3 shrink-0"
          animate={{ opacity: phase === "workspace" ? 0 : 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={phase === "workspace" ? { pointerEvents: "none" } : undefined}
        >
          <WorkspaceSwitcher value={workspaceId} onChange={setWorkspaceId} />
          <span className="shrink-0 opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200">
            <IconButton
              size="sm"
              shape="pill"
              appearance="tonal"
              variant="neutral"
              flat
              icon={<RiSettings6Line size={15} />}
              aria-label="Settings"
              onClick={handleOpenSettings}
            />
          </span>
        </motion.div>

        {/* ── Nav body ───────────────────────────────────────────────────────── */}
        <motion.div
          className="flex-1 min-h-0 overflow-y-auto pt-1 pb-1"
          animate={{ opacity: phase === "workspace" ? 0 : 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={phase === "workspace" ? { pointerEvents: "none" } : undefined}
        >

          {NAV_SECTIONS.map((section, si) => (
            <div key={section.label} className={si > 0 ? "mt-3" : undefined}>

              <div className="px-[6px]">
                {section.type === "coming-soon" ? (
                  <ComingSoonSection label={section.label} />
                ) : (
                  <SidebarNavGroup label={section.label}>
                    <motion.div
                      variants={STAGGER_CONTAINER}
                      initial="hidden"
                      animate="show"
                      className="flex flex-col gap-[2px]"
                    >
                      {section.items.map((item) => (
                        <motion.div key={item.href} variants={STAGGER_ITEM}>
                          <SidebarNavItem
                            label={item.label}
                            icon={<item.Icon size={15} />}
                            href={item.href}
                            active={isActive(item.href)}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  </SidebarNavGroup>
                )}
              </div>
            </div>
          ))}


        </motion.div>

        {/* ── Demo data toggle — fixed at bottom, outside scroll ─────────────── */}
        <motion.div
          className="shrink-0 px-[6px] pt-4 pb-1 flex flex-col gap-3"
          animate={{ opacity: phase === "workspace" ? 0 : 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={phase === "workspace" ? { pointerEvents: "none" } : undefined}
        >
          <AnimatePresence>
            {!demoMode && phase === "idle" && (
              <motion.div
                key="onboarding-btn"
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.96, transition: { duration: 0.15 } }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                <Button
                  variant="brand"
                  appearance="filled"
                  className="w-full h-[38px] text-xs font-semibold tracking-tight"
                  onClick={startOnboarding}
                >
                  Show onboarding
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <SidebarNavToggle
              label="Demo mode"
              icon={<RiEyeLine size={15} />}
              checked={demoMode}
              onChange={setDemoMode}
            />
          </div>
        </motion.div>

        {/* ── Footer: avatar + user info ─────────────────────────────────────── */}
        <motion.div
          className="shrink-0 px-[6px] pb-[6px] pt-1"
          animate={{ opacity: phase === "workspace" ? 0 : 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={phase === "workspace" ? { pointerEvents: "none" } : undefined}
        >
          <UserFooter />
        </motion.div>
      </motion.nav>
    </div>
  );
}