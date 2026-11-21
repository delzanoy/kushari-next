"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { DocNav } from "@/components/ui/DocNav";
import { DocsLayout } from "@/components/ui/DocsLayout";
import {
  SidebarNavList,
  SidebarNavItem,
  SidebarNavGroup,
  SidebarNavToggle,
  SidebarNavSeparator,
} from "@/components/molecules/SidebarNav";
import {
  RiWalletLine,
  RiCoinsLine,
  RiFileTextLine,
  RiCheckboxCircleLine,
  RiBarChartLine,
  RiMapPinLine,
  RiGroupLine,
  RiBellLine,
  RiCodeLine,
  RiEyeLine,
  RiFilter3Line,
  RiDatabase2Line,
  RiStackLine,
  RiArrowRightSLine,
} from "@remixicon/react";
import { FilterDropdown } from "@/components/molecules/FilterDropdown";
import { ComplexFilter, FilterField, FilterCriterion } from "@/components/molecules/ComplexFilter";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const NAV_ITEMS = [
  { id: "sidebar-nav", label: "Sidebar Nav", num: "01" },
  { id: "filter-dropdown", label: "Filter Dropdown", num: "02" },
  { id: "complex-filter", label: "Complex Filter", num: "03" },
];

// ---------------------------------------------------------------------------
// Panel style — frosted glass dark with brand ambient top highlight
// ---------------------------------------------------------------------------

const PANEL_STYLE = {
  background: "linear-gradient(160deg, #0D1414 0%, #0A0A0A 65%)",
  boxShadow: [
    "0 0 0 0.5px rgba(255,255,255,0.07)",
    "inset 0 1px 0 rgba(38,201,201,0.06)",
    "0 24px 64px rgba(0,0,0,0.55)",
    "0 0 60px -16px rgba(38,201,201,0.06)",
  ].join(", "),
} as const;

const STAGGER_CONTAINER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045, delayChildren: 0.05 } },
};
const STAGGER_ITEM: import("framer-motion").Variants = {
  hidden: { opacity: 0, x: -7 },
  show:   { opacity: 1, x: 0, transition: { type: "spring", stiffness: 400, damping: 30, mass: 0.8 } },
};

// ---------------------------------------------------------------------------
// SidebarNav Section
// ---------------------------------------------------------------------------

function SidebarNavSection() {
  const [demoMode, setDemoMode]               = useState(false);
  const [activeItem, setActiveItem]           = useState("wallets");
  const [manageOpen, setManageOpen]           = useState(true);
  const [transactionsOpen, setTransactionsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-16">

      {/* ── 1. Nav Items ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)]">
          Nav Items
        </h3>
        <p className="text-xs text-[var(--color-text-muted)] -mt-3">
          Default, active, icon, count badge, dot pip, and disabled states.
        </p>
        <div className="w-56 p-[6px] rounded-[16px]" style={PANEL_STYLE}>
          <SidebarNavList>
            <SidebarNavItem label="Wallets"    icon={<RiWalletLine         size={15} />} active />
            <SidebarNavItem label="Assets"     icon={<RiCoinsLine          size={15} />} />
            <SidebarNavItem label="View all"   icon={<RiFileTextLine       size={15} />} badge={12} />
            <SidebarNavItem label="Proposals"  icon={<RiCheckboxCircleLine size={15} />} badge="dot" />
            <SidebarNavItem label="Accounting" icon={<RiBarChartLine       size={15} />} disabled />
          </SidebarNavList>
        </div>
      </div>

      {/* ── 2. Groups ────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)]">
          Groups
        </h3>
        <p className="text-xs text-[var(--color-text-muted)] -mt-3">
          Mono-caps section labels. Collapsible: spring height animation, chevron spring-rotates.
        </p>
        <div className="w-56 p-[6px] rounded-[16px]" style={PANEL_STYLE}>
          <SidebarNavList>
            <SidebarNavGroup label="View and manage" collapsible open={manageOpen} onOpenChange={setManageOpen}>
              <SidebarNavItem label="Wallets" icon={<RiWalletLine size={15} />} active />
              <SidebarNavItem label="Assets"  icon={<RiCoinsLine  size={15} />} />
            </SidebarNavGroup>
            <SidebarNavSeparator />
            <SidebarNavGroup label="Transactions" collapsible open={transactionsOpen} onOpenChange={setTransactionsOpen}>
              <SidebarNavItem label="View all"  icon={<RiFileTextLine       size={15} />} />
              <SidebarNavItem label="Proposals" icon={<RiCheckboxCircleLine size={15} />} badge={3} />
            </SidebarNavGroup>
          </SidebarNavList>
        </div>
      </div>

      {/* ── 3. Toggle Items ──────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)]">
          Toggle Items
        </h3>
        <p className="text-xs text-[var(--color-text-muted)] -mt-3">
          Clicking anywhere on the row toggles. Checked state shows a subtle brand-tinted bg and icon.
        </p>
        <div className="w-[260px] p-[6px] rounded-[16px]" style={PANEL_STYLE}>
          <SidebarNavToggle
            label="Demo data"
            description="Show mock data and previews"
            icon={<RiEyeLine  size={15} />}
            checked={demoMode}
            onChange={setDemoMode}
          />
          <SidebarNavToggle
            label="Notifications"
            icon={<RiBellLine size={15} />}
            defaultChecked
            variant="success"
          />
          <SidebarNavToggle
            label="Beta features"
            description="Access experimental UI"
            icon={<RiCodeLine size={15} />}
            disabled
          />
        </div>
      </div>

      {/* ── 4. Full Composition ──────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)]">
          Full Composition
        </h3>
        <p className="text-xs text-[var(--color-text-muted)] -mt-3">
          Real Token nav structure. Items stagger in on mount.
        </p>

        <div className="relative w-fit">
          {/* Ambient glow — makes backdrop-blur visible on near-black bg */}
          <div
            className="absolute -inset-12 rounded-[48px] pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 40% 50%, rgba(38,201,201,0.05) 0%, transparent 65%)" }}
          />

          {/* overflow-hidden removed — clips item box-shadow rings at panel edge */}
          <div className="relative w-[240px] rounded-[18px]" style={{ ...PANEL_STYLE, backdropFilter: "blur(24px) saturate(150%)" }}>

            {/* Brand wordmark */}
            <div className="flex items-center gap-[10px] px-[14px] pt-[15px] pb-[10px]">
              <div
                className="w-[20px] h-[20px] rounded-[6px] flex items-center justify-center shrink-0"
                style={{ background: "rgba(38,201,201,1)", boxShadow: "0 0 12px rgba(38,201,201,0.35)" }}
              >
                <div className="w-[7px] h-[7px] rounded-full bg-white/95" />
              </div>
              <span className="text-[13px] font-bold tracking-[-0.01em] text-[#E0E4F5]">Token</span>
            </div>

            <SidebarNavSeparator />

            <div className="px-[6px]">
              <SidebarNavGroup label="View and manage">
                <motion.div variants={STAGGER_CONTAINER} initial="hidden" animate="show" className="flex flex-col gap-[2px]">
                  {(["wallets", "assets"] as const).map((id) => {
                    const META = {
                      wallets: { label: "Wallets", icon: <RiWalletLine size={15} /> },
                      assets:  { label: "Assets",  icon: <RiCoinsLine  size={15} /> },
                    };
                    const m = META[id];
                    return (
                      <motion.div key={id} variants={STAGGER_ITEM}>
                        <SidebarNavItem label={m.label} icon={m.icon} active={activeItem === id} onClick={() => setActiveItem(id)} />
                      </motion.div>
                    );
                  })}
                </motion.div>
              </SidebarNavGroup>
            </div>

            <SidebarNavSeparator />

            <div className="px-[6px]">
              <SidebarNavGroup label="Transactions">
                <motion.div variants={STAGGER_CONTAINER} initial="hidden" animate="show" className="flex flex-col gap-[2px]">
                  {(["view-all", "proposals"] as const).map((id) => {
                    const META = {
                      "view-all":  { label: "View all",  icon: <RiFileTextLine       size={15} /> },
                      "proposals": { label: "Proposals", icon: <RiCheckboxCircleLine size={15} />, badge: 4 as number },
                    };
                    const m = META[id];
                    return (
                      <motion.div key={id} variants={STAGGER_ITEM}>
                        <SidebarNavItem
                          label={m.label}
                          icon={m.icon}
                          active={activeItem === id}
                          badge={"badge" in m ? m.badge : undefined}
                          onClick={() => setActiveItem(id)}
                        />
                      </motion.div>
                    );
                  })}
                </motion.div>
              </SidebarNavGroup>
            </div>

            <SidebarNavSeparator />

            <div className="px-[6px]">
              <SidebarNavGroup label="Address book">
                <motion.div variants={STAGGER_CONTAINER} initial="hidden" animate="show" className="flex flex-col gap-[2px]">
                  {(["addresses", "groups"] as const).map((id) => {
                    const META = {
                      addresses: { label: "Addresses", icon: <RiMapPinLine size={15} /> },
                      groups:    { label: "Groups",    icon: <RiGroupLine  size={15} /> },
                    };
                    const m = META[id];
                    return (
                      <motion.div key={id} variants={STAGGER_ITEM}>
                        <SidebarNavItem label={m.label} icon={m.icon} active={activeItem === id} onClick={() => setActiveItem(id)} />
                      </motion.div>
                    );
                  })}
                </motion.div>
              </SidebarNavGroup>
            </div>

            <SidebarNavSeparator />

            <div className="px-[6px] pb-[8px]">
              <SidebarNavToggle
                label="Demo data"
                icon={<RiEyeLine size={15} />}
                checked={demoMode}
                onChange={setDemoMode}
              />
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}

// ---------------------------------------------------------------------------
// FilterDropdown Section
// ---------------------------------------------------------------------------

function FilterDropdownSection() {
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  
  const tokenOptions = [
    { value: "BTC", displayProps: { fullName: "Bitcoin", metaData: "BTC" } },
    { value: "ETH", displayProps: { fullName: "Ethereum", metaData: "ETH" } },
    { value: "USDC", displayProps: { fullName: "USD Coin", metaData: "USDC" } },
    { value: "SOL", displayProps: { fullName: "Solana", metaData: "SOL" } },
  ];

  return (
    <div className="flex flex-col gap-16">
      <div className="flex flex-col gap-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)]">
          Pill-shaped Trigger
        </h3>
        <p className="text-xs text-[var(--color-text-muted)] -mt-3">
          Responsive to selection state, embedded clear button, sticky search.
        </p>
        <div className="w-[400px] h-[300px] p-[24px] rounded-[16px] flex items-start" style={PANEL_STYLE}>
          <FilterDropdown
            label="Tokens"
            buttonIcon={<RiCoinsLine size={16} />}
            options={tokenOptions}
            selectedValues={selectedTokens}
            onSelectionChange={setSelectedTokens}
          />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ComplexFilter Section
// ---------------------------------------------------------------------------

function ComplexFilterSection() {
  const [criteria, setCriteria] = useState<FilterCriterion[]>([]);

  const fields: FilterField[] = [
    {
      key: "assetType",
      label: "Asset Type",
      type: "multiselect",
      icon: <RiDatabase2Line size={14} />,
      options: [
        { id: "1", value: "crypto", displayProps: { fullName: "Cryptocurrency" } },
        { id: "2", value: "stablecoin", displayProps: { fullName: "Stablecoin" } },
        { id: "3", value: "nft", displayProps: { fullName: "NFT" } },
      ],
    },
    {
      key: "network",
      label: "Network",
      type: "multiselect",
      icon: <RiStackLine size={14} />,
      options: [
        { id: "eth", value: "ethereum", displayProps: { fullName: "Ethereum" } },
        { id: "opt", value: "optimism", displayProps: { fullName: "Optimism" } },
        { id: "arb", value: "arbitrum", displayProps: { fullName: "Arbitrum" } },
        { id: "sol", value: "solana", displayProps: { fullName: "Solana" } },
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-16">
      <div className="flex flex-col gap-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)]">
          Two-Pane Hover Interface
        </h3>
        <p className="text-xs text-[var(--color-text-muted)] -mt-3">
          Extremely scalable split-pane interface. Hover a field on the left to reveal options on the right.
        </p>
        <div className="w-full h-[400px] p-[24px] rounded-[16px] flex items-start" style={PANEL_STYLE}>
          <ComplexFilter
            label="Filter"
            buttonIcon={<RiFilter3Line size={16} />}
            fields={fields}
            criteria={criteria}
            onCriteriaChange={setCriteria}
          />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function MoleculesPage() {
  return (
    <DocsLayout currentLayer="/designsystem/molecules" items={NAV_ITEMS}>

      {/* ================================================================
          HERO
          ================================================================ */}
      <header className="relative min-h-[70vh] flex flex-col justify-center overflow-hidden border-b border-white/[0.03]">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] pointer-events-none opacity-20"
            style={{ background: "radial-gradient(circle at center, rgba(38,201,201,0.15) 0%, transparent 70%)" }}
          />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-[1040px] mx-auto px-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-8"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-interactive-brand-default" />
                <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-interactive-brand-default animate-ping opacity-40" />
              </div>
              <span className="font-mono text-2xs tracking-[0.2em] text-interactive-brand-default/80 uppercase">
                Composed — Layer 5
              </span>
            </div>

            <div className="max-w-4xl">
              <h1 className="font-display text-5xl md:text-[5rem] font-bold tracking-tightest leading-[0.95] text-text-primary">
                Molecules <br />
                <span className="relative text-text-disabled italic">
                  Gallery
                </span>
              </h1>
            </div>

            <p className="text-lg md:text-xl text-text-secondary font-light leading-relaxed max-w-2xl">
              Business-aware components composed from atoms. Navigation, layout
              chrome, and structural patterns that form the skeleton of every
              Token view.
            </p>
          </motion.div>
        </div>
      </header>

      {/* ================================================================
          CONTENT
          ================================================================ */}
      <div className="py-32 space-y-48">

        <Section
          id="sidebar-nav"
          num="01"
          title="Sidebar Nav"
          subtitle="Navigation primitives for vertical sidebars — items, collapsible groups, and inline toggle rows."
        >
          <SidebarNavSection />
        </Section>

        {/* ==============================================================
            02. FILTER DROPDOWN
            ============================================================== */}
        <Section
          id="filter-dropdown"
          num="02"
          title="Filter Dropdown"
          subtitle="A specialized dropdown utilizing a pill-shaped chip trigger, sticky search, and active clear states."
        >
          <FilterDropdownSection />
        </Section>

        {/* ==============================================================
            03. COMPLEX FILTER
            ============================================================== */}
        <Section
          id="complex-filter"
          num="03"
          title="Complex Filter"
          subtitle="A two-pane filtering interface for querying multiple fields and options simultaneously."
        >
          <ComplexFilterSection />
        </Section>

        {/* ── Footer Nav ─────────────────────────────────────────────── */}
        <div className="max-w-[1040px] mx-auto w-full pt-32 border-t border-white/[0.04]">
          <DocNav current="/designsystem/molecules" />
        </div>
      </div>

      {/* ================================================================
          FOOTER
          ================================================================ */}
      <footer className="border-t border-white/[0.03] py-24 bg-surface-page relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-full bg-interactive-brand-default/[0.02] transform translate-x-1/2 -skew-x-12" />
        <div className="max-w-[1040px] mx-auto px-8 relative z-10 flex flex-col items-center justify-between gap-12 sm:flex-row">
          <div className="flex flex-col gap-4 items-center sm:items-start">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="w-5 h-5 rounded-full border-2 border-interactive-brand-default/30 flex items-center justify-center group-hover:border-interactive-brand-default transition-colors">
                <div className="w-1.5 h-1.5 rounded-full bg-interactive-brand-default" />
              </div>
              <span className="font-display text-xl font-bold text-text-primary">Token</span>
            </div>
            <p className="text-sm text-text-muted font-light">Layer 5 Molecules Gallery</p>
          </div>

          <div className="flex items-center gap-8">
            <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">&copy; 2026 Token Systems</span>
            <div className="w-[1px] h-4 bg-white/10 hidden sm:block" />
            <button className="text-[10px] font-mono text-text-muted hover:text-text-brand transition-colors uppercase tracking-[0.2em]">Build &mdash; v2.4.0</button>
          </div>
        </div>
      </footer>
    </DocsLayout>
  );
}
