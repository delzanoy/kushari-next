"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  RiArrowLeftLine,
  RiGroupLine,
  RiBuilding4Line,
  RiAtLine,
  RiBellLine,
  RiGridFill,
  RiSlackFill,
  RiDiscordFill,
  RiTelegramFill,
  RiPlanetLine,
  RiSearchLine,
  RiUserAddLine,
  RiCheckLine,
  RiExternalLinkLine,
  RiShieldUserLine,
  RiMailLine,
  RiNotification3Line,
} from "@remixicon/react";
import { useModal } from "@/components/molecules/modal";
import { useOnboarding } from "@/lib/onboarding";
import { Button } from "@/components/atoms/Button";
import { Avatar } from "@/components/atoms/Avatar";
import { TextInput } from "@/components/atoms/TextInput";

export type SettingsTab = "members" | "workspace" | "email" | "others" | "integrations";

// Custom Zapier 5-spoke asterisk logo SVG
function ZapierIcon({ size = 26, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2V22M4.93 4.93L19.07 19.07M2 12H22M4.93 19.07L19.07 4.93"
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SettingsModal({
  initialTab = "integrations",
  onClose,
}: {
  initialTab?: SettingsTab;
  onClose?: () => void;
}) {
  const { closeTop } = useModal();
  const { workspaceName } = useOnboarding();
  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab);

  // Connection states for integrations
  const [connected, setConnected] = useState<Record<string, boolean>>({
    slack: false,
    discord: false,
    telegram: false,
    zapier: false,
  });

  // Toggle notification states
  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    proposalApprovals: true,
    executedTransactions: true,
    securityAlerts: true,
    weeklyReport: false,
    pushNotifications: true,
    soundEffects: true,
  });

  const toggleIntegration = (id: string) => {
    setConnected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleNotification = (id: string) => {
    setNotifications((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      closeTop();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, y: 8 }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      className="relative flex flex-col w-[1372px] max-w-[calc(100vw-32px)] h-[840px] max-h-[calc(100vh-32px)] rounded-[28px] border border-[var(--color-border-subtle)] bg-[var(--color-surface-sunken)] backdrop-blur-2xl text-white shadow-2xl overflow-hidden outline-none select-none"
    >
      {/* ── Top Left Header Bar: Workspace back button ─────────────────── */}
      <div className="flex items-center justify-between px-6 pt-5 pb-2 shrink-0">
        <button
          type="button"
          onClick={handleClose}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] active:scale-[0.98] transition-all text-xs font-medium text-white border border-white/[0.06] cursor-pointer"
        >
          <RiArrowLeftLine size={14} className="text-white/80" />
          <span>Workspace</span>
        </button>
      </div>

      {/* ── Main Layout: Left Navigation + Right Content Pane ──────────── */}
      <div className="flex flex-1 min-h-0 w-full px-6 pb-6 gap-8 pt-2">
        {/* ── Left Sidebar Navigation ────────────────────────────────────── */}
        <div className="w-[240px] shrink-0 border-r border-white/[0.06] pr-6 flex flex-col gap-6">
          {/* Workspace Title Header */}
          <div className="flex items-center gap-2.5 pb-4 border-b border-white/[0.08]">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500/20 to-teal-400/30 flex items-center justify-center border border-teal-500/30 shrink-0">
              <RiPlanetLine size={16} className="text-[var(--color-text-brand)]" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-white truncate">
              {workspaceName?.trim() || "Acme co."}
            </span>
          </div>

          {/* Navigation Groups */}
          <div className="flex flex-col gap-6 overflow-y-auto pr-1">
            {/* Group 1: WORKSPACE */}
            <div className="flex flex-col gap-1">
              <div className="text-[11px] font-mono font-semibold tracking-wider text-[var(--color-text-muted)] uppercase px-3 pb-1.5">
                Workspace
              </div>
              <NavItem
                label="Members"
                icon={<RiGroupLine size={16} />}
                active={activeTab === "members"}
                onClick={() => setActiveTab("members")}
              />
              <NavItem
                label="Workspace"
                icon={<RiBuilding4Line size={16} />}
                active={activeTab === "workspace"}
                onClick={() => setActiveTab("workspace")}
              />
            </div>

            {/* Group 2: NOTIFICATIONS */}
            <div className="flex flex-col gap-1">
              <div className="text-[11px] font-mono font-semibold tracking-wider text-[var(--color-text-muted)] uppercase px-3 pb-1.5">
                Notifications
              </div>
              <NavItem
                label="Email"
                icon={<RiAtLine size={16} />}
                active={activeTab === "email"}
                onClick={() => setActiveTab("email")}
              />
              <NavItem
                label="Others"
                icon={<RiBellLine size={16} />}
                active={activeTab === "others"}
                onClick={() => setActiveTab("others")}
              />
            </div>

            {/* Group 3: CONNECTIONS */}
            <div className="flex flex-col gap-1">
              <div className="text-[11px] font-mono font-semibold tracking-wider text-[var(--color-text-muted)] uppercase px-3 pb-1.5">
                Connections
              </div>
              <NavItem
                label="Integrations"
                icon={<RiGridFill size={16} />}
                active={activeTab === "integrations"}
                onClick={() => setActiveTab("integrations")}
              />
            </div>
          </div>
        </div>

        {/* ── Right Content Pane ─────────────────────────────────────────── */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-2 pt-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="h-full"
            >
              {activeTab === "integrations" && (
                <IntegrationsTab
                  connected={connected}
                  onToggle={toggleIntegration}
                />
              )}
              {activeTab === "members" && <MembersTab />}
              {activeTab === "workspace" && <WorkspaceTab />}
              {activeTab === "email" && (
                <EmailTab
                  notifications={notifications}
                  onToggle={toggleNotification}
                />
              )}
              {activeTab === "others" && (
                <OthersTab
                  notifications={notifications}
                  onToggle={toggleNotification}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Subcomponents ────────────────────────────────────────────────────────────

function NavItem({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer text-left",
        active
          ? "bg-white/[0.12] text-white shadow-sm border border-white/[0.08]"
          : "text-[var(--color-text-secondary)] hover:text-white hover:bg-white/[0.05]"
      )}
    >
      <span className={cn("shrink-0", active ? "text-white" : "text-[var(--color-text-muted)]")}>
        {icon}
      </span>
      <span className="truncate">{label}</span>
    </button>
  );
}

// ─── Tab 1: Integrations (Matches screenshot) ─────────────────────────────────

function IntegrationsTab({
  connected,
  onToggle,
}: {
  connected: Record<string, boolean>;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-medium tracking-tight text-white">Integrations</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Stay updated, no matter where you work.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
        {/* Slack Card */}
        <IntegrationCard
          icon={<RiSlackFill size={28} className="text-[#ECB22E]" />}
          title="Slack"
          description="Send updates directly to Slack channels or teammates faster collaboration, fewer surprises."
          buttonLabel={connected.slack ? "Connected" : "Connect Slack"}
          isConnected={connected.slack}
          onClick={() => onToggle("slack")}
        />

        {/* Discord Card */}
        <IntegrationCard
          icon={<RiDiscordFill size={28} className="text-[#5865F2]" />}
          title="Discord"
          description="Send updates to your Discord server so everyone stays in sync."
          buttonLabel={connected.discord ? "Connected" : "Connect Discord"}
          isConnected={connected.discord}
          onClick={() => onToggle("discord")}
        />

        {/* Telegram Card */}
        <IntegrationCard
          icon={<RiTelegramFill size={28} className="text-[#24A1DE]" />}
          title="Telegram"
          description="Push important updates to your Telegram chats in real time."
          buttonLabel={connected.telegram ? "Connected" : "Connect Telegram"}
          isConnected={connected.telegram}
          onClick={() => onToggle("telegram")}
        />

        {/* Zapier Card */}
        <IntegrationCard
          icon={<ZapierIcon size={26} className="text-[#FF4F00]" />}
          title="Zapier"
          description="Automate your workflows by connecting to 5,000+ apps with Zapier. From approvals to alerts, trigger actions based on vault activity."
          buttonLabel={connected.zapier ? "Connected" : "Connect Zapier"}
          isConnected={connected.zapier}
          onClick={() => onToggle("zapier")}
        />
      </div>
    </div>
  );
}

function IntegrationCard({
  icon,
  title,
  description,
  buttonLabel,
  isConnected,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonLabel: string;
  isConnected: boolean;
  onClick: () => void;
}) {
  return (
    <div className="border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] transition-all rounded-2xl p-6 flex flex-col justify-between min-h-[220px]">
      <div>
        <div className="flex items-center gap-3">
          <div className="shrink-0">{icon}</div>
          <h3 className="text-xl font-medium text-white">{title}</h3>
        </div>
        <p className="text-xs text-[var(--color-text-secondary)] pt-4 leading-relaxed font-normal">
          {description}
        </p>
      </div>

      <div className="pt-6 flex justify-end">
        <button
          type="button"
          onClick={onClick}
          className={cn(
            "px-4 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer border active:scale-95",
            isConnected
              ? "bg-teal-500/20 text-teal-300 border-teal-500/40 hover:bg-teal-500/30"
              : "bg-white text-black border-white hover:bg-white/90"
          )}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}

// ─── Tab 2: Members ────────────────────────────────────────────────────────────

function MembersTab() {
  const [search, setSearch] = useState("");

  const members = [
    { name: "Alex Rivera", email: "alex@tokenlabs.io", role: "Owner", status: "Active" },
    { name: "Sarah Chen", email: "sarah@tokenlabs.io", role: "Admin", status: "Active" },
    { name: "Elena Rostova", email: "elena@tokenlabs.io", role: "Approver", status: "Active" },
    { name: "Marcus Vance", email: "marcus@tokenlabs.io", role: "Viewer", status: "Invited" },
  ];

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium tracking-tight text-white">Members</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Manage team members, roles, and vault approval permissions.
          </p>
        </div>
        <Button variant="brand" appearance="filled" size="sm" className="rounded-full gap-1.5">
          <RiUserAddLine size={15} />
          <span>Invite Member</span>
        </Button>
      </div>

      {/* Search Input */}
      <div className="relative w-72">
        <TextInput
          placeholder="Search member..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leadingIcon={<RiSearchLine size={15} className="text-[var(--color-icon-muted)]" />}
        />
      </div>

      {/* Member List */}
      <div className="border border-white/[0.08] rounded-2xl overflow-hidden bg-white/[0.01]">
        <div className="grid grid-cols-12 px-5 py-3 border-b border-white/[0.08] text-xs font-mono font-medium text-[var(--color-text-muted)] uppercase">
          <div className="col-span-5">Member</div>
          <div className="col-span-4">Role</div>
          <div className="col-span-3 text-right">Status</div>
        </div>

        <div className="divide-y divide-white/[0.06]">
          {filteredMembers.map((member, i) => (
            <div key={i} className="grid grid-cols-12 px-5 py-3.5 items-center hover:bg-white/[0.03] transition-all">
              <div className="col-span-5 flex items-center gap-3">
                <Avatar name={member.name} size="sm" />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium text-white truncate">{member.name}</span>
                  <span className="text-xs text-[var(--color-text-muted)] truncate">{member.email}</span>
                </div>
              </div>
              <div className="col-span-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/[0.08] text-white/90 border border-white/[0.08]">
                  {member.role}
                </span>
              </div>
              <div className="col-span-3 text-right">
                <span
                  className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                    member.status === "Active"
                      ? "bg-teal-500/10 text-teal-300 border-teal-500/20"
                      : "bg-amber-500/10 text-amber-300 border-amber-500/20"
                  )}
                >
                  {member.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Tab 3: Workspace ──────────────────────────────────────────────────────────

function WorkspaceTab() {
  const { workspaceName, setWorkspaceName } = useOnboarding();
  const [name, setName] = useState(workspaceName || "Acme co.");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (name.trim()) {
      setWorkspaceName(name.trim());
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-medium tracking-tight text-white">Workspace</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Configure general workspace branding, threshold policies, and regional settings.
        </p>
      </div>

      <div className="border border-white/[0.08] bg-white/[0.02] rounded-2xl p-6 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-[var(--color-text-secondary)]">
            Workspace Name
          </label>
          <TextInput
            placeholder="Workspace name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-[var(--color-text-secondary)]">
            Default Base Currency
          </label>
          <select className="w-full bg-white/[0.06] border border-white/[0.1] rounded-xl px-3.5 py-2 text-sm text-white outline-none focus:border-[var(--color-border-brand)]">
            <option value="USD" className="bg-neutral-900 text-white">USD ($) - US Dollar</option>
            <option value="EUR" className="bg-neutral-900 text-white">EUR (€) - Euro</option>
            <option value="GBP" className="bg-neutral-900 text-white">GBP (£) - British Pound</option>
            <option value="BTC" className="bg-neutral-900 text-white">BTC (₿) - Bitcoin</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-[var(--color-text-secondary)]">
            Default Signature Threshold
          </label>
          <select className="w-full bg-white/[0.06] border border-white/[0.1] rounded-xl px-3.5 py-2 text-sm text-white outline-none focus:border-[var(--color-border-brand)]">
            <option value="2-3" className="bg-neutral-900 text-white">2 of 3 signatures required</option>
            <option value="3-5" className="bg-neutral-900 text-white">3 of 5 signatures required</option>
            <option value="1-1" className="bg-neutral-900 text-white">1 of 1 single owner</option>
          </select>
        </div>

        <div className="pt-4 flex items-center gap-3">
          <Button variant="brand" appearance="filled" size="sm" onClick={handleSave} className="rounded-full">
            Save Changes
          </Button>
          {saved && (
            <span className="inline-flex items-center gap-1 text-xs text-teal-400 font-medium animate-fade-in">
              <RiCheckLine size={14} /> Saved!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Tab 4: Email ──────────────────────────────────────────────────────────────

function EmailTab({
  notifications,
  onToggle,
}: {
  notifications: Record<string, boolean>;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-medium tracking-tight text-white">Email Notifications</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Choose which transaction and proposal notifications are delivered to your inbox.
        </p>
      </div>

      <div className="border border-white/[0.08] bg-white/[0.02] rounded-2xl divide-y divide-white/[0.06] overflow-hidden">
        <ToggleRow
          title="Proposal Approvals"
          description="Receive an instant email alert when a new proposal requires your signature."
          checked={notifications.proposalApprovals}
          onChange={() => onToggle("proposalApprovals")}
        />
        <ToggleRow
          title="Executed Transactions"
          description="Receive email notification when a transaction completes execution on-chain."
          checked={notifications.executedTransactions}
          onChange={() => onToggle("executedTransactions")}
        />
        <ToggleRow
          title="Security & Threshold Updates"
          description="Get notified immediately when vault owners or signature thresholds change."
          checked={notifications.securityAlerts}
          onChange={() => onToggle("securityAlerts")}
        />
        <ToggleRow
          title="Weekly Summary Digest"
          description="Receive a weekly report of wallet balances, spent gas, and activity logs."
          checked={notifications.weeklyReport}
          onChange={() => onToggle("weeklyReport")}
        />
      </div>
    </div>
  );
}

// ─── Tab 5: Others ─────────────────────────────────────────────────────────────

function OthersTab({
  notifications,
  onToggle,
}: {
  notifications: Record<string, boolean>;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-medium tracking-tight text-white">Other Preferences</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Browser notifications, sound effects, and custom webhook configurations.
        </p>
      </div>

      <div className="border border-white/[0.08] bg-white/[0.02] rounded-2xl divide-y divide-white/[0.06] overflow-hidden">
        <ToggleRow
          title="Browser Push Notifications"
          description="Show desktop notifications when active proposals are updated."
          checked={notifications.pushNotifications}
          onChange={() => onToggle("pushNotifications")}
        />
        <ToggleRow
          title="Tactile Sound Effects"
          description="Play subtle audio chimes when signing or approving vault requests."
          checked={notifications.soundEffects}
          onChange={() => onToggle("soundEffects")}
        />
      </div>

      {/* Webhooks Section */}
      <div className="border border-white/[0.08] bg-white/[0.02] rounded-2xl p-6 flex flex-col gap-4 mt-2">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-medium text-white">Custom Webhook Endpoint</h3>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Stream real-time vault event JSON payloads to your backend infrastructure.
          </p>
        </div>
        <TextInput placeholder="https://api.yourdomain.com/webhooks/kushari" />
        <div className="pt-2">
          <Button variant="neutral" appearance="tonal" size="sm" className="rounded-full">
            Test Endpoint
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Toggle Row Helper ────────────────────────────────────────────────────────

function ToggleRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="p-5 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-all">
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-sm font-medium text-white">{title}</span>
        <span className="text-xs text-[var(--color-text-secondary)]">{description}</span>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
          checked ? "bg-[var(--color-interactive-brand-default)]" : "bg-white/[0.16]"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}
