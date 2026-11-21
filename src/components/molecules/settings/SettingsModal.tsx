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
import { Toggle } from "@/components/atoms/Toggle";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSearch,
} from "@/components/atoms/Dropdown";
import { Checkbox } from "@/components/atoms/Checkbox";
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
  initialTab = "members",
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
        <div className="w-[240px] shrink-0 border-r border-white/[0.06] pr-4 flex flex-col gap-6">
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
          <div className="flex flex-col gap-4 overflow-y-auto px-1 py-1">
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
        <div className="flex-1 min-h-0 overflow-y-auto px-4 pt-1 pb-4">
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
              {activeTab === "email" && <EmailTab />}
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
    <div className="flex flex-col h-full overflow-hidden relative">
      {/* Header Row (Fixed at top) */}
      <div className="flex items-center justify-between pt-1 pb-4 shrink-0">
        <h1 className="text-3xl font-semibold tracking-tight text-white">Members</h1>
        <button
          type="button"
          onClick={() => setInviteModalOpen(true)}
          className="px-5 py-2 text-sm font-medium rounded-full bg-[#D5D7E8] text-black hover:bg-white active:scale-95 transition-all cursor-pointer shadow-sm"
        >
          Invite member
        </button>
      </div>

      {/* Members List Table (Scrollable container) */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-2 flex flex-col border-t border-white/[0.08] divide-y divide-white/[0.08]">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className="grid grid-cols-12 px-2 py-4 items-center hover:bg-white/[0.02] transition-colors"
          >
            {/* Col 1: Identity (Reduced to col-span-4 for action space) */}
            <div className="col-span-4 flex items-center gap-3 pl-1 min-w-0 pr-2">
              {member.type === "invited" ? (
                <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center shrink-0 text-white/70">
                  <RiMailLine size={18} />
                </div>
              ) : (
                <Avatar name={member.name || member.email} size="md" preset={member.avatarPreset} />
              )}

              <div className="flex flex-col min-w-0 truncate">
                {member.name ? (
                  <>
                    <span className="text-sm font-medium text-white tracking-tight truncate">{member.name}</span>
                    <span className="text-xs text-[var(--color-text-muted)] font-mono truncate">{member.email}</span>
                  </>
                ) : (
                  <span className="text-sm font-medium text-white/90 font-mono tracking-tight truncate">{member.email}</span>
                )}
              </div>
            </div>

            {/* Col 2: Status Indicator (col-span-2) */}
            <div className="col-span-2 flex items-center gap-2 text-sm font-medium pr-2">
              {member.status === "Active" && (
                <>
                  <span className="w-2 h-2 rounded-full bg-[#26C9C9] shadow-[0_0_8px_rgba(38,201,201,0.6)] shrink-0" />
                  <span className="text-white/90 truncate">Active</span>
                </>
              )}
              {member.status === "Invited" && (
                <>
                  <span className="w-2 h-2 rounded-full bg-white/40 shrink-0" />
                  <span className="text-white/60 truncate">Invited</span>
                </>
              )}
              {member.status === "Suspended" && (
                <>
                  <span className="w-2 h-2 rounded-full bg-[#EF4444] shadow-[0_0_8px_rgba(239,68,68,0.5)] shrink-0" />
                  <span className="text-white/90 truncate">Suspended</span>
                </>
              )}
              {member.status === "Authorisation reset" && (
                <>
                  <span className="w-2 h-2 rounded-full bg-[#F59E0B] shadow-[0_0_8px_rgba(245,158,11,0.5)] shrink-0" />
                  <span className="text-white/90 truncate">Authorisation reset</span>
                </>
              )}
            </div>

            {/* Col 3: Role & Vault Access (col-span-2) */}
            <div className="col-span-2 flex flex-col justify-center min-w-0 pr-2">
              <span className="text-sm font-medium text-white/90 truncate">{member.role}</span>
              {member.vaults && (
                <span className="text-xs text-[var(--color-text-muted)] mt-0.5 truncate">{member.vaults}</span>
              )}
            </div>

            {/* Col 4: Action Buttons (Expanded to col-span-4) */}
            <div className="col-span-4 flex items-center justify-end gap-3.5 pr-2">
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
                  <Dropdown>
                    <DropdownTrigger placeholder="Select role" label={inviteRole} />
                    <DropdownMenu minWidth={200}>
                      <DropdownItem selected={inviteRole === "Approver"} onSelect={() => setInviteRole("Approver")}>
                        Approver
                      </DropdownItem>
                      <DropdownItem selected={inviteRole === "Admin"} onSelect={() => setInviteRole("Admin")}>
                        Admin
                      </DropdownItem>
                      <DropdownItem selected={inviteRole === "Viewer"} onSelect={() => setInviteRole("Viewer")}>
                        Viewer
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
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

const CURRENCY_LIST = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CAD", symbol: "$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "$", name: "Australian Dollar" },
  { code: "CHF", symbol: "Fr", name: "Swiss Franc" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "SGD", symbol: "$", name: "Singapore Dollar" },
  { code: "HKD", symbol: "$", name: "Hong Kong Dollar" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real" },
  { code: "BTC", symbol: "₿", name: "Bitcoin" },
  { code: "ETH", symbol: "Ξ", name: "Ethereum" },
  { code: "SOL", symbol: "◎", name: "Solana" },
  { code: "USDC", symbol: "$", name: "USD Coin" },
  { code: "USDT", symbol: "$", name: "Tether" },
];

const COMPANY_TYPES = [
  { id: "DAO", label: "DAO" },
  { id: "LLC", label: "LLC" },
  { id: "C-Corp", label: "C-Corp" },
  { id: "S-Corp", label: "S-Corp" },
  { id: "Venture Fund", label: "Venture Fund" },
  { id: "Non-Profit", label: "Non-Profit" },
  { id: "Sole Proprietorship", label: "Sole Proprietorship" },
  { id: "Other", label: "Other" },
];

function WorkspaceTab() {
  const { workspaceName, setWorkspaceName } = useOnboarding();

  const [companyName, setCompanyName] = useState("Acme Inc.");
  const [sameAsCompany, setSameAsCompany] = useState(false);
  const [name, setName] = useState(workspaceName || "Acme co.");
  const [companyType, setCompanyType] = useState("DAO");
  const [currency, setCurrency] = useState("USD");
  const [currencySearch, setCurrencySearch] = useState("");
  const [saved, setSaved] = useState(false);

  const handleCompanyNameChange = (val: string) => {
    setCompanyName(val);
    if (sameAsCompany) {
      setName(val);
    }
  };

  const handleSameAsCompanyToggle = (checked: boolean) => {
    setSameAsCompany(checked);
    if (checked) {
      setName(companyName);
    }
  };

  const handleSave = () => {
    const finalName = sameAsCompany ? companyName : name;
    if (finalName.trim()) {
      setWorkspaceName(finalName.trim());
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const selectedCurrencyObj =
    CURRENCY_LIST.find((c) => c.code === currency) || CURRENCY_LIST[0];

  const selectedCompanyTypeObj =
    COMPANY_TYPES.find((ct) => ct.id === companyType) || COMPANY_TYPES[0];

  const filteredCurrencies = CURRENCY_LIST.filter((c) => {
    const q = currencySearch.toLowerCase().trim();
    return (
      c.code.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.symbol.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl pb-6">
      <div>
        <h1 className="text-3xl font-medium tracking-tight text-white">Workspace</h1>
      </div>

      <div className="flex flex-col gap-5">
        {/* Company name - Text Input */}
        <TextInput
          fullWidth
          label="Company name"
          placeholder="Enter company name"
          value={companyName}
          onChange={(e) => handleCompanyNameChange(e.target.value)}
        />

        {/* Workspace name - Text Input with Helper Text & Checkbox */}
        <div className="flex flex-col gap-2">
          <TextInput
            fullWidth
            label="Workspace name"
            placeholder="Workspace name"
            value={sameAsCompany ? companyName : name}
            disabled={sameAsCompany}
            onChange={(e) => setName(e.target.value)}
            helperText="Visible to you and invited members of this workspace."
          />
          <div className="pt-0.5">
            <Checkbox
              label="Same as company name"
              checked={sameAsCompany}
              onChange={(e) => handleSameAsCompanyToggle(e.target.checked)}
            />
          </div>
        </div>

        {/* Company type - Dropdown */}
        <Dropdown label="Company type">
          <DropdownTrigger
            placeholder="Select company type"
            label={selectedCompanyTypeObj.label}
          />
          <DropdownMenu minWidth="100%">
            {COMPANY_TYPES.map((type) => (
              <DropdownItem
                key={type.id}
                selected={companyType === type.id}
                onSelect={() => setCompanyType(type.id)}
              >
                {type.label}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>

        {/* Base currency - Dropdown with Search option */}
        <Dropdown label="Base currency">
          <DropdownTrigger
            placeholder="Select base currency"
            label={`${selectedCurrencyObj.code} (${selectedCurrencyObj.symbol}) - ${selectedCurrencyObj.name}`}
          />
          <DropdownMenu minWidth="100%">
            <DropdownSearch
              value={currencySearch}
              onChange={setCurrencySearch}
              placeholder="Search currency..."
            />
            <div className="max-h-56 overflow-y-auto pt-1">
              {filteredCurrencies.map((c) => (
                <DropdownItem
                  key={c.code}
                  selected={currency === c.code}
                  onSelect={() => {
                    setCurrency(c.code);
                    setCurrencySearch("");
                  }}
                >
                  {c.code} ({c.symbol}) - {c.name}
                </DropdownItem>
              ))}
              {filteredCurrencies.length === 0 && (
                <div className="px-3 py-2 text-xs text-[var(--color-text-muted)]">
                  No currencies found
                </div>
              )}
            </div>
          </DropdownMenu>
        </Dropdown>

        {/* Save changes Button */}
        <div className="pt-2 flex items-center gap-3">
          <Button
            variant="brand"
            appearance="filled"
            size="sm"
            flat
            onClick={handleSave}
            className="rounded-full px-6"
          >
            Save changes
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

function EmailTab() {
  const [enabled, setEnabled] = useState(true);
  const [allNotifications, setAllNotifications] = useState(false);

  const [items, setItems] = useState<Record<string, boolean>>({
    transactions: true,
    mpcWallets: true,
    gnosisSafe: true,
    policy: true,
    members: false,
    trackedWallets: false,
  });

  const toggleItem = (key: string) => {
    setItems((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      const allChecked = Object.values(next).every(Boolean);
      setAllNotifications(allChecked);
      return next;
    });
  };

  const handleAllToggle = () => {
    const nextVal = !allNotifications;
    setAllNotifications(nextVal);
    setItems({
      transactions: nextVal,
      mpcWallets: nextVal,
      gnosisSafe: nextVal,
      policy: nextVal,
      members: nextVal,
      trackedWallets: nextVal,
    });
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl pb-6">
      <div>
        <h1 className="text-3xl font-medium tracking-tight text-white">Email Notifications</h1>
      </div>

      <div className="flex flex-col gap-4">
        {/* Item 1: Enable email notifications - Toggle */}
        <ToggleRow
          title="Enable email notifications"
          description="Inform workspace members about activities over email."
          checked={enabled}
          onChange={() => setEnabled((v) => !v)}
        />

        {/* Item 2: All notifications - Checkbox */}
        <CheckboxRow
          title="All notifications"
          description="All activity will be notified to all members."
          checked={allNotifications}
          disabled={!enabled}
          onChange={handleAllToggle}
        />

        {/* Grouped Container for remaining items (separator removed) */}
        <div className="border border-white/[0.08] bg-white/[0.02] rounded-2xl divide-y divide-white/[0.06] overflow-hidden mt-1">
          <CheckboxRow
            grouped
            title="Transactions"
            description="All transactions will be notified to their approvers."
            checked={items.transactions}
            disabled={!enabled}
            onChange={() => toggleItem("transactions")}
          />

          <CheckboxRow
            grouped
            title="MPC Wallets"
            description="Activities in an MPC wallet will be notified to their approvers & admin"
            checked={items.mpcWallets}
            disabled={!enabled}
            onChange={() => toggleItem("mpcWallets")}
          />

          <CheckboxRow
            grouped
            title="Gnosis Safe"
            description="Safe activity will be notified to their signers & admin"
            checked={items.gnosisSafe}
            disabled={!enabled}
            onChange={() => toggleItem("gnosisSafe")}
          />

          <CheckboxRow
            grouped
            title="Policy"
            description="Any change in MPC vault / Gnosis Safe policy will be notified to approvers."
            checked={items.policy}
            disabled={!enabled}
            onChange={() => toggleItem("policy")}
          />

          <CheckboxRow
            grouped
            title="Members"
            description="New invitation, suspension will be notified to existing members."
            checked={items.members}
            disabled={!enabled}
            onChange={() => toggleItem("members")}
          />

          <CheckboxRow
            grouped
            title="Tracked wallets"
            description="Tracked wallet transactions will be notified to all members."
            checked={items.trackedWallets}
            disabled={!enabled}
            onChange={() => toggleItem("trackedWallets")}
          />
        </div>
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
    <div className="flex flex-col gap-6 max-w-2xl pb-6">
      <div>
        <h1 className="text-3xl font-medium tracking-tight text-white">Other Preferences</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Browser notifications, sound effects, and custom webhook configurations.
        </p>
      </div>

      {/* Toggle Rows directly without redundant outer container box */}
      <div className="flex flex-col gap-3">
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

      {/* Webhooks Section directly without redundant outer card box */}
      <div className="flex flex-col gap-3 pt-2">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-medium text-white">Custom Webhook Endpoint</h3>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Stream real-time vault event JSON payloads to your backend infrastructure.
          </p>
        </div>
        <TextInput fullWidth placeholder="https://api.yourdomain.com/webhooks/kushari" />
        <div className="pt-1">
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
  disabled,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
}) {
  return (
    <div
      onClick={() => !disabled && onChange()}
      className={cn(
        "p-4.5 flex items-center justify-between gap-4 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.05] transition-all cursor-pointer select-none",
        disabled && "opacity-40 cursor-not-allowed hover:bg-white/[0.03]"
      )}
    >
      <div className="flex flex-col gap-1 min-w-0 pr-2">
        <span className="text-sm font-semibold text-white tracking-tight">{title}</span>
        <span className="text-xs text-[var(--color-text-secondary)] leading-normal">{description}</span>
      </div>

      <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
        <Toggle
          checked={checked}
          disabled={disabled}
          onChange={onChange}
          variant="brand"
          size="sm"
          aria-label={title}
        />
      </div>
    </div>
  );
}

function CheckboxRow({
  title,
  description,
  checked,
  disabled,
  grouped = false,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  grouped?: boolean;
  onChange: () => void;
}) {
  return (
    <div
      onClick={() => !disabled && onChange()}
      className={cn(
        "flex items-start justify-between gap-4 transition-all cursor-pointer select-none",
        grouped
          ? "p-4.5 hover:bg-white/[0.02]"
          : "p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]",
        disabled && "opacity-40 cursor-not-allowed hover:bg-transparent"
      )}
    >
      <div className="flex flex-col gap-1 min-w-0 pr-2">
        <span className="text-sm font-medium text-white tracking-tight">{title}</span>
        <span className="text-xs text-[var(--color-text-secondary)] leading-normal">{description}</span>
      </div>

      <div className="shrink-0 pt-0.5" onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={checked}
          disabled={disabled}
          onChange={onChange}
          aria-label={title}
        />
      </div>
    </div>
  );
}
