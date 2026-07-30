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
  RiUser2Line,
  RiCloseLine,
} from "@remixicon/react";
import { useModal } from "@/components/molecules/modal";
import { useOnboarding } from "@/lib/onboarding";
import { Button } from "@/components/atoms/Button";
import { Avatar } from "@/components/atoms/Avatar";
import { TextInput } from "@/components/atoms/TextInput";
import { SidebarNavGroup, SidebarNavItem } from "@/components/molecules/SidebarNav";
import { useMembers } from "@/hooks/useData";

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
          <div className="flex flex-col gap-4 overflow-y-auto pr-1">
            {/* Group 1: WORKSPACE */}
            <SidebarNavGroup label="Workspace">
              <SidebarNavItem
                label="Members"
                icon={<RiUser2Line size={15} />}
                active={activeTab === "members"}
                onClick={() => setActiveTab("members")}
              />
              <SidebarNavItem
                label="Workspace"
                icon={<RiBuilding4Line size={15} />}
                active={activeTab === "workspace"}
                onClick={() => setActiveTab("workspace")}
              />
            </SidebarNavGroup>

            {/* Group 2: NOTIFICATIONS */}
            <SidebarNavGroup label="Notifications">
              <SidebarNavItem
                label="Email"
                icon={<RiAtLine size={15} />}
                active={activeTab === "email"}
                onClick={() => setActiveTab("email")}
              />
              <SidebarNavItem
                label="Others"
                icon={<RiBellLine size={15} />}
                active={activeTab === "others"}
                onClick={() => setActiveTab("others")}
              />
            </SidebarNavGroup>

            {/* Group 3: CONNECTIONS */}
            <SidebarNavGroup label="Connections">
              <SidebarNavItem
                label="Integrations"
                icon={<RiGridFill size={15} />}
                active={activeTab === "integrations"}
                onClick={() => setActiveTab("integrations")}
              />
            </SidebarNavGroup>
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

// ─── Tab 2: Members ────────────────────────────────────────────────────────────

interface MemberRowItem {
  id: string;
  type: "invited" | "member";
  email: string;
  name?: string;
  status: "Invited" | "Active" | "Suspended" | "Authorisation reset";
  role: string;
  vaults?: string;
  avatarColor?: string;
  avatarPreset?: string;
  isCurrentUser?: boolean;
  actions: { label: string; action: string; danger?: boolean }[];
}

function MembersTab() {
  const [search, setSearch] = useState("");
  const { members: apiMembers } = useMembers();

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Approver");

  const [memberList, setMemberList] = useState<MemberRowItem[]>([]);

  useEffect(() => {
    if (apiMembers && apiMembers.length > 0) {
      const mappedApiMembers: MemberRowItem[] = apiMembers.map((m: any) => {
        const isInvited = m.status === "Invited" || !m.name;
        if (isInvited) {
          return {
            id: String(m.id),
            type: "invited",
            email: m.email,
            status: "Invited",
            role: m.role || "Approver",
            actions: [
              { label: "Withdraw", action: "withdraw", danger: true },
              { label: "Resend", action: "resend" },
            ],
          };
        }

        const isDelanoy = m.isCurrentUser || m.name === "Delanoy Kunil";
        let status: MemberRowItem["status"] = m.status || "Active";
        if (m.name === "Elon Musk") status = "Suspended";
        if (m.name === "Robert Kiyosaki") status = "Authorisation reset";

        let role = m.role || "Approver";
        if (m.name === "Vitalik Buterin") role = "Admin, Approver";

        let vaults = m.vaults;
        if (!vaults) {
          if (m.name === "Elon Musk") vaults = "2 MPC vault, 1 Safe";
          else if (m.name === "Robert Kiyosaki") vaults = "3 MPC vault";
          else if (m.name === "Sandeep Nailwal") vaults = "1 MPC vault, 1 Safe";
          else vaults = "2 MPC vault";
        }

        let actions: MemberRowItem["actions"] = [];
        if (status === "Suspended" || isDelanoy) {
          actions = [{ label: "Resume access", action: "resume" }];
        } else if (status === "Active") {
          actions = [
            { label: "Suspend", action: "suspend", danger: true },
            { label: "Reset authentication", action: "reset_auth" },
          ];
        }

        return {
          id: String(m.id),
          type: "member",
          name: m.name,
          email: m.email,
          status,
          role,
          vaults,
          avatarColor: m.avatarColor || m.colour,
          avatarPreset: m.avatarPreset,
          isCurrentUser: isDelanoy,
          actions,
        };
      });

      setMemberList((prev) => {
        const customInvites = prev.filter((item) => Number(item.id) > 1000);
        return [...customInvites, ...mappedApiMembers];
      });
    }
  }, [apiMembers]);

  const handleAction = (id: string, actionType: string) => {
    if (actionType === "withdraw") {
      setMemberList((prev) => prev.filter((m) => m.id !== id));
    } else if (actionType === "suspend") {
      setMemberList((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: "Suspended" as const } : m))
      );
    } else if (actionType === "resume") {
      setMemberList((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: "Active" as const } : m))
      );
    }
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    const newMember: MemberRowItem = {
      id: String(Date.now()),
      type: "invited",
      email: inviteEmail.trim(),
      status: "Invited",
      role: inviteRole,
      actions: [
        { label: "Withdraw", action: "withdraw", danger: true },
        { label: "Resend", action: "resend" },
      ],
    };
    setMemberList((prev) => [newMember, ...prev]);
    setInviteEmail("");
    setInviteModalOpen(false);
  };

  const filteredMembers = memberList.filter((m) => {
    const query = search.toLowerCase();
    return (
      m.email.toLowerCase().includes(query) ||
      (m.name && m.name.toLowerCase().includes(query)) ||
      m.role.toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex flex-col gap-6 h-full overflow-y-auto pr-2 relative">
      {/* Header Row */}
      <div className="flex items-center justify-between pt-1 pb-2">
        <h1 className="text-3xl font-semibold tracking-tight text-white">Members</h1>
        <button
          type="button"
          onClick={() => setInviteModalOpen(true)}
          className="px-5 py-2 text-sm font-medium rounded-full bg-[#D5D7E8] text-black hover:bg-white active:scale-95 transition-all cursor-pointer shadow-sm"
        >
          Invite member
        </button>
      </div>

      {/* Members List Table */}
      <div className="flex flex-col border-t border-white/[0.08] divide-y divide-white/[0.08]">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className="grid grid-cols-12 px-2 py-4 items-center hover:bg-white/[0.02] transition-colors"
          >
            {/* Col 1: Identity */}
            <div className="col-span-5 flex items-center gap-3.5 pl-1">
              {member.type === "invited" ? (
                <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center shrink-0 text-white/70">
                  <RiMailLine size={18} />
                </div>
              ) : (
                <Avatar name={member.name || member.email} size="md" preset={member.avatarPreset} />
              )}

              <div className="flex flex-col min-w-0">
                {member.name ? (
                  <>
                    <span className="text-sm font-medium text-white tracking-tight">{member.name}</span>
                    <span className="text-xs text-[var(--color-text-muted)] font-mono">{member.email}</span>
                  </>
                ) : (
                  <span className="text-sm font-medium text-white/90 font-mono tracking-tight">{member.email}</span>
                )}
              </div>
            </div>

            {/* Col 2: Status Indicator */}
            <div className="col-span-3 flex items-center gap-2 text-sm font-medium">
              {member.status === "Active" && (
                <>
                  <span className="w-2 h-2 rounded-full bg-[#26C9C9] shadow-[0_0_8px_rgba(38,201,201,0.6)]" />
                  <span className="text-white/90">Active</span>
                </>
              )}
              {member.status === "Invited" && (
                <>
                  <span className="w-2 h-2 rounded-full bg-white/40" />
                  <span className="text-white/60">Invited</span>
                </>
              )}
              {member.status === "Suspended" && (
                <>
                  <span className="w-2 h-2 rounded-full bg-[#EF4444] shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                  <span className="text-white/90">Suspended</span>
                </>
              )}
              {member.status === "Authorisation reset" && (
                <>
                  <span className="w-2 h-2 rounded-full bg-[#F59E0B] shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                  <span className="text-white/90">Authorisation reset</span>
                </>
              )}
            </div>

            {/* Col 3: Role & Vault Access */}
            <div className="col-span-2 flex flex-col justify-center">
              <span className="text-sm font-medium text-white/90">{member.role}</span>
              {member.vaults && (
                <span className="text-xs text-[var(--color-text-muted)] mt-0.5">{member.vaults}</span>
              )}
            </div>

            {/* Col 4: Action Buttons */}
            <div className="col-span-2 flex items-center justify-end gap-4 pr-2">
              {member.actions.map((act, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAction(member.id, act.action)}
                  className={cn(
                    "text-xs font-medium transition-all cursor-pointer hover:underline",
                    act.danger ? "text-[#EF4444] hover:text-red-400" : "text-white/90 hover:text-white"
                  )}
                >
                  {act.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Invite Member Popup Modal */}
      <AnimatePresence>
        {inviteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-[420px] max-w-full rounded-2xl border border-white/10 bg-[#161618] p-6 shadow-2xl flex flex-col gap-4 text-white"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold tracking-tight">Invite new member</h3>
                <button
                  type="button"
                  onClick={() => setInviteModalOpen(false)}
                  className="text-white/60 hover:text-white transition-colors cursor-pointer"
                >
                  <RiCloseLine size={20} />
                </button>
              </div>

              <form onSubmit={handleInviteSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1.5">Email address</label>
                  <TextInput
                    placeholder="name@company.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1.5">Role</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Approver" className="bg-[#161618]">Approver</option>
                    <option value="Admin" className="bg-[#161618]">Admin</option>
                    <option value="Viewer" className="bg-[#161618]">Viewer</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button
                    variant="neutral"
                    appearance="filled"
                    size="sm"
                    flat
                    type="button"
                    onClick={() => setInviteModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="brand" appearance="filled" size="sm" type="submit">
                    Send invite
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
