"use client";

import { useState, useMemo, useRef, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { DocNav } from "@/components/ui/DocNav";
import { DocsLayout } from "@/components/ui/DocsLayout";
import { BlockchainIcon } from "@/components/ui/BlockchainIcon";
import { ParticleCard } from "@/components/atoms/ParticleCard";
import { ParticleText } from "@/components/atoms/ParticleText";
import { BurstParticles, useBurst } from "@/components/atoms/BurstParticles";
import { MeshGradientCard, type Pin, type BlendMode } from "@/components/atoms/MeshGradientCard";
import { Button } from "@/components/atoms/Button";
import { TertiaryButton } from "@/components/atoms/TertiaryButton";
import { IconButton } from "@/components/atoms/IconButton";
import { Spinner } from "@/components/atoms/Spinner";
import { TextInput } from "@/components/atoms/TextInput";
import { TextArea } from "@/components/atoms/TextArea";
import { Checkbox, CheckboxGroup } from "@/components/atoms/Checkbox";
import { RadioButton, RadioGroup, type RadioSize, type RadioState } from "@/components/atoms/RadioButton";
import { Toggle } from "@/components/atoms/Toggle";
import ButtonPlayground from "@/components/molecules/designsystem/ButtonPlayground";
import { Avatar, AvatarForge, AvatarGroup, type AvatarSize } from "@/components/atoms/Avatar";
import { Tooltip, TooltipGroup, type TooltipPlacement } from "@/components/atoms/Tooltip";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
  DropdownSearch,
  DropdownCreateNew,
} from "@/components/atoms/Dropdown";
import { cn } from "@/lib/utils";
import {
  siEthereum, siBitcoin, siSolana, siBinance,
  siPolygon, siOptimism, siCardano, siPolkadot,
  siFantom, siCoinbase, siLitecoin, siRipple,
} from "simple-icons";
import {
  RiHomeLine, RiHome2Line, RiMenuLine, RiMenu2Line, RiArrowLeftLine, RiArrowRightLine,
  RiArrowUpLine, RiArrowDownLine, RiCloseLine, RiCloseCircleLine, RiCheckLine, RiAddLine, RiSubtractLine,
  RiSearchLine, RiFilterLine, RiMore2Line, RiExternalLinkLine, RiShareLine, RiDownloadLine,
  RiUploadLine, RiRefreshLine, RiDeleteBinLine, RiEditLine, RiEyeLine, RiEyeOffLine,
  RiSettingsLine, RiSettings2Line, RiNotificationLine, RiBellLine, RiMailLine, RiMailOpenLine,
  RiChat1Line, RiChat3Line, RiSendPlaneLine, RiAttachmentLine,
  RiCheckboxCircleLine, RiErrorWarningLine, RiAlertLine, RiInformationLine,
  RiShieldCheckLine, RiShieldLine, RiTimeLine, RiCalendarLine,
  RiWalletLine, RiWallet3Line, RiBankLine, RiExchangeLine, RiCoinsLine, RiExpandDiagonalLine,
  RiBarChartLine, RiLineChartLine, RiPieChartLine, RiDashboardLine,
  RiLockLine, RiLockUnlockLine, RiKeyLine, RiFingerprint2Line,
  RiFileCopyLine, RiFileTextLine, RiClipboardLine, RiQrCodeLine,
  RiUserLine, RiUser3Line, RiGroupLine, RiTeamLine,
  RiGlobalLine, RiEarthLine, RiLinksLine,
  RiCodeLine, RiTerminalLine, RiDatabase2Line, RiServerLine,
  RiSunLine, RiMoonLine, RiStarLine, RiHeartLine,
  RiPlayLine, RiPauseLine, RiStopLine, RiFullscreenLine,
  RiImageLine, RiCameraLine,
  RiFlagLine, RiBookmarkLine, RiMapPinLine, RiCompassLine,
  RiPrinterLine, RiSaveLine, RiLoginBoxLine,
  RiLoaderLine, RiLoader2Line, RiLoader4Line, RiLoader5Line,
} from "@remixicon/react";

/* ============================================================
   /atoms — Component Gallery
   Token v2 — Layer 4 Visual Documentation
   ============================================================ */

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const NAV_ITEMS = [
  { id: "typography", label: "Typography", num: "01" },
  { id: "iconography", label: "Iconography", num: "02" },
  { id: "particles", label: "Particles", num: "03" },
  { id: "shaders", label: "Shaders", num: "04" },
  { id: "buttons", label: "Buttons", num: "05" },
  { id: "flat-buttons", label: "Flat Buttons", num: "05.b" },
  { id: "secondary-buttons", label: "Secondary Buttons", num: "06" },
  { id: "tertiary-buttons", label: "Tertiary Buttons", num: "07" },
  { id: "icon-buttons", label: "Icon Buttons", num: "08" },
  { id: "text-input", label: "Text Input", num: "09" },
  { id: "textarea", label: "Textarea", num: "10" },
  { id: "checkboxes", label: "Checkboxes", num: "11" },
  { id: "radio-buttons", label: "Radio Buttons", num: "12" },
  { id: "dropdowns", label: "Dropdowns", num: "13" },
  { id: "toggles", label: "Toggles", num: "14" },
  { id: "avatars", label: "Avatars", num: "15" },
  { id: "tooltips", label: "Tooltips", num: "16" },
];

// ---------------------------------------------------------------------------
// Iconography Data
// ---------------------------------------------------------------------------

const ICON_CATEGORIES = [
  {
    name: "Navigation",
    icons: [
      { name: "RiHomeLine", Icon: RiHomeLine },
      { name: "RiHome2Line", Icon: RiHome2Line },
      { name: "RiMenuLine", Icon: RiMenuLine },
      { name: "RiMenu2Line", Icon: RiMenu2Line },
      { name: "RiArrowLeftLine", Icon: RiArrowLeftLine },
      { name: "RiArrowRightLine", Icon: RiArrowRightLine },
      { name: "RiArrowUpLine", Icon: RiArrowUpLine },
      { name: "RiArrowDownLine", Icon: RiArrowDownLine },
      { name: "RiExternalLinkLine", Icon: RiExternalLinkLine },
      { name: "RiCompassLine", Icon: RiCompassLine },
      { name: "RiMapPinLine", Icon: RiMapPinLine },
      { name: "RiGlobalLine", Icon: RiGlobalLine },
    ],
  },
  {
    name: "Actions",
    icons: [
      { name: "RiSearchLine", Icon: RiSearchLine },
      { name: "RiFilterLine", Icon: RiFilterLine },
      { name: "RiAddLine", Icon: RiAddLine },
      { name: "RiSubtractLine", Icon: RiSubtractLine },
      { name: "RiCloseLine", Icon: RiCloseLine },
      { name: "RiCheckLine", Icon: RiCheckLine },
      { name: "RiEditLine", Icon: RiEditLine },
      { name: "RiDeleteBinLine", Icon: RiDeleteBinLine },
      { name: "RiRefreshLine", Icon: RiRefreshLine },
      { name: "RiMore2Line", Icon: RiMore2Line },
      { name: "RiShareLine", Icon: RiShareLine },
      { name: "RiSaveLine", Icon: RiSaveLine },
    ],
  },
  {
    name: "Status & Feedback",
    icons: [
      { name: "RiCheckboxCircleLine", Icon: RiCheckboxCircleLine },
      { name: "RiErrorWarningLine", Icon: RiErrorWarningLine },
      { name: "RiAlertLine", Icon: RiAlertLine },
      { name: "RiInformationLine", Icon: RiInformationLine },
      { name: "RiShieldCheckLine", Icon: RiShieldCheckLine },
      { name: "RiShieldLine", Icon: RiShieldLine },
      { name: "RiTimeLine", Icon: RiTimeLine },
      { name: "RiCalendarLine", Icon: RiCalendarLine },
      { name: "RiEyeLine", Icon: RiEyeLine },
      { name: "RiEyeOffLine", Icon: RiEyeOffLine },
      { name: "RiFlagLine", Icon: RiFlagLine },
      { name: "RiBookmarkLine", Icon: RiBookmarkLine },
    ],
  },
  {
    name: "Data & Finance",
    icons: [
      { name: "RiWalletLine", Icon: RiWalletLine },
      { name: "RiWallet3Line", Icon: RiWallet3Line },
      { name: "RiBankLine", Icon: RiBankLine },
      { name: "RiExchangeLine", Icon: RiExchangeLine },
      { name: "RiCoinsLine", Icon: RiCoinsLine },
      { name: "RiBarChartLine", Icon: RiBarChartLine },
      { name: "RiLineChartLine", Icon: RiLineChartLine },
      { name: "RiPieChartLine", Icon: RiPieChartLine },
      { name: "RiDashboardLine", Icon: RiDashboardLine },
      { name: "RiQrCodeLine", Icon: RiQrCodeLine },
      { name: "RiDatabase2Line", Icon: RiDatabase2Line },
      { name: "RiServerLine", Icon: RiServerLine },
    ],
  },
  {
    name: "Objects & Security",
    icons: [
      { name: "RiLockLine", Icon: RiLockLine },
      { name: "RiLockUnlockLine", Icon: RiLockUnlockLine },
      { name: "RiKeyLine", Icon: RiKeyLine },
      { name: "RiFingerprint2Line", Icon: RiFingerprint2Line },
      { name: "RiSettingsLine", Icon: RiSettingsLine },
      { name: "RiSettings2Line", Icon: RiSettings2Line },
      { name: "RiFileCopyLine", Icon: RiFileCopyLine },
      { name: "RiFileTextLine", Icon: RiFileTextLine },
      { name: "RiClipboardLine", Icon: RiClipboardLine },
      { name: "RiPrinterLine", Icon: RiPrinterLine },
      { name: "RiDownloadLine", Icon: RiDownloadLine },
      { name: "RiUploadLine", Icon: RiUploadLine },
    ],
  },
  {
    name: "Communication",
    icons: [
      { name: "RiNotificationLine", Icon: RiNotificationLine },
      { name: "RiBellLine", Icon: RiBellLine },
      { name: "RiMailLine", Icon: RiMailLine },
      { name: "RiMailOpenLine", Icon: RiMailOpenLine },
      { name: "RiChat1Line", Icon: RiChat1Line },
      { name: "RiChat3Line", Icon: RiChat3Line },
      { name: "RiSendPlaneLine", Icon: RiSendPlaneLine },
      { name: "RiAttachmentLine", Icon: RiAttachmentLine },
      { name: "RiUserLine", Icon: RiUserLine },
      { name: "RiUser3Line", Icon: RiUser3Line },
      { name: "RiGroupLine", Icon: RiGroupLine },
      { name: "RiTeamLine", Icon: RiTeamLine },
    ],
  },
  {
    name: "Media & Misc",
    icons: [
      { name: "RiPlayLine", Icon: RiPlayLine },
      { name: "RiPauseLine", Icon: RiPauseLine },
      { name: "RiStopLine", Icon: RiStopLine },
      { name: "RiFullscreenLine", Icon: RiFullscreenLine },
      { name: "RiImageLine", Icon: RiImageLine },
      { name: "RiCameraLine", Icon: RiCameraLine },
      { name: "RiSunLine", Icon: RiSunLine },
      { name: "RiMoonLine", Icon: RiMoonLine },
      { name: "RiCodeLine", Icon: RiCodeLine },
      { name: "RiTerminalLine", Icon: RiTerminalLine },
      { name: "RiLinksLine", Icon: RiLinksLine },
      { name: "RiLoginBoxLine", Icon: RiLoginBoxLine },
    ],
  },
];

// ---------------------------------------------------------------------------
// CryptoFonts Data
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Blockchain Networks Data
// ---------------------------------------------------------------------------

const BLOCKCHAIN_NETWORKS = [
  { icon: siEthereum, name: "Ethereum" },
  { icon: siBitcoin, name: "Bitcoin" },
  { icon: siSolana, name: "Solana" },
  { icon: siBinance, name: "BNB Chain" },
  { icon: siPolygon, name: "Polygon" },
  { icon: siOptimism, name: "Optimism" },
  { icon: siCardano, name: "Cardano" },
  { icon: siPolkadot, name: "Polkadot" },
  { icon: siFantom, name: "Fantom" },
  { icon: siCoinbase, name: "Base" },
  { icon: siLitecoin, name: "Litecoin" },
  { icon: siRipple, name: "XRP" },
];

const CRYPTO_CATEGORIES = [
  {
    name: "Major Assets",
    tokens: [
      { symbol: "btc", name: "Bitcoin" },
      { symbol: "eth", name: "Ethereum" },
      { symbol: "sol", name: "Solana" },
      { symbol: "bnb", name: "BNB" },
      { symbol: "xrp", name: "XRP" },
      { symbol: "ada", name: "Cardano" },
      { symbol: "avax", name: "Avalanche" },
      { symbol: "dot", name: "Polkadot" },
      { symbol: "ltc", name: "Litecoin" },
      { symbol: "link", name: "Chainlink" },
      { symbol: "trx", name: "TRON" },
      { symbol: "xlm", name: "Stellar" },
    ],
  },
  {
    name: "Stablecoins",
    tokens: [
      { symbol: "usdt", name: "Tether" },
      { symbol: "usdc", name: "USDC" },
      { symbol: "dai", name: "DAI" },
      { symbol: "wbtc", name: "Wrapped BTC" },
    ],
  },
  {
    name: "DeFi",
    tokens: [
      { symbol: "uni", name: "Uniswap" },
      { symbol: "aave", name: "Aave" },
      { symbol: "mkr", name: "Maker" },
      { symbol: "comp", name: "Compound" },
      { symbol: "snx", name: "Synthetix" },
      { symbol: "grt", name: "The Graph" },
      { symbol: "bal", name: "Balancer" },
      { symbol: "yfi", name: "Yearn" },
      { symbol: "rune", name: "THORChain" },
      { symbol: "cake", name: "PancakeSwap" },
      { symbol: "1inch", name: "1inch" },
    ],
  }
];

const ICON_SIZES = [
  { name: "xs", px: 12, class: "w-3 h-3" },
  { name: "sm", px: 14, class: "w-3.5 h-3.5" },
  { name: "md", px: 16, class: "w-4 h-4" },
  { name: "lg", px: 20, class: "w-5 h-5" },
  { name: "xl", px: 24, class: "w-6 h-6" },
];

const ICON_COLORS = [
  { name: "primary", class: "text-text-primary", token: "text-primary" },
  { name: "secondary", class: "text-text-secondary", token: "text-secondary" },
  { name: "muted", class: "text-text-muted", token: "text-muted" },
  { name: "brand", class: "text-text-brand", token: "text-brand" },
  { name: "danger", class: "text-text-danger", token: "text-danger" },
  { name: "success", class: "text-text-success", token: "text-success" },
];

// ---------------------------------------------------------------------------
// Typography Data — Pure Primitives (no prescribed usage)
// ---------------------------------------------------------------------------

const SAMPLE_TEXT = "The quick brown fox jumps over the lazy dog";
const SAMPLE_SHORT = "Token UI";

const FAMILY_SPECIMENS = [
  { token: "font-display", family: "General Sans", classes: "font-display text-xl font-medium text-text-primary", sample: SAMPLE_TEXT },
  { token: "font-sans", family: "Geist", classes: "font-sans text-xl font-medium text-text-primary", sample: SAMPLE_TEXT },
  { token: "font-mono", family: "Geist Mono", classes: "font-mono text-xl font-medium text-text-primary", sample: SAMPLE_TEXT },
];

const SCALE_SPECIMENS = [
  { token: "text-4xl", size: "26px / 1.625rem", classes: "font-sans text-4xl font-medium text-text-primary" },
  { token: "text-3xl", size: "24px / 1.5rem", classes: "font-sans text-3xl font-medium text-text-primary" },
  { token: "text-2xl", size: "20px / 1.25rem", classes: "font-sans text-2xl font-medium text-text-primary" },
  { token: "text-xl", size: "18px / 1.125rem", classes: "font-sans text-xl font-medium text-text-primary" },
  { token: "text-lg", size: "16px / 1rem", classes: "font-sans text-lg font-medium text-text-primary" },
  { token: "text-md", size: "14px / 0.875rem", classes: "font-sans text-md font-medium text-text-primary" },
  { token: "text-base", size: "13px / 0.8125rem", classes: "font-sans text-base font-medium text-text-primary" },
  { token: "text-sm", size: "12px / 0.75rem", classes: "font-sans text-sm font-medium text-text-primary" },
  { token: "text-xs", size: "11px / 0.6875rem", classes: "font-sans text-xs font-medium text-text-primary" },
  { token: "text-2xs", size: "10px / 0.625rem", classes: "font-sans text-2xs font-medium text-text-primary" },
];

const WEIGHT_SPECIMENS = [
  { token: "font-bold", weight: "700", classes: "font-sans text-xl font-bold text-text-primary" },
  { token: "font-semibold", weight: "600", classes: "font-sans text-xl font-semibold text-text-primary" },
  { token: "font-medium", weight: "500", classes: "font-sans text-xl font-medium text-text-primary" },
  { token: "font-normal", weight: "400", classes: "font-sans text-xl font-normal text-text-primary" },
];

const TRACKING_SPECIMENS = [
  { token: "tracking-tightest", value: "-0.03em", classes: "font-sans text-xl font-medium tracking-tightest text-text-primary" },
  { token: "tracking-tight", value: "-0.015em", classes: "font-sans text-xl font-medium tracking-tight text-text-primary" },
  { token: "tracking-normal", value: "0em", classes: "font-sans text-xl font-medium tracking-normal text-text-primary" },
  { token: "tracking-wide", value: "0.025em", classes: "font-sans text-xl font-medium tracking-wide text-text-primary" },
  { token: "tracking-widest", value: "0.06em", classes: "font-sans text-xl font-medium tracking-widest text-text-primary" },
];

const TEXT_COLOR_SPECIMENS = [
  { token: "text-text-primary", alias: "neutral-0", classes: "font-sans text-lg font-medium text-text-primary" },
  { token: "text-text-secondary", alias: "neutral-300", classes: "font-sans text-lg font-medium text-text-secondary" },
  { token: "text-text-muted", alias: "neutral-500", classes: "font-sans text-lg font-medium text-text-muted" },
  { token: "text-text-disabled", alias: "neutral-700", classes: "font-sans text-lg font-medium text-text-disabled" },
  { token: "text-text-inverse", alias: "neutral-950", classes: "font-sans text-lg font-medium text-text-inverse" },
  { token: "text-text-brand", alias: "cyan-400", classes: "font-sans text-lg font-medium text-text-brand" },
  { token: "text-text-danger", alias: "red-400", classes: "font-sans text-lg font-medium text-text-danger" },
  { token: "text-text-success", alias: "green-400", classes: "font-sans text-lg font-medium text-text-success" },
  { token: "text-text-warning", alias: "amber-400", classes: "font-sans text-lg font-medium text-text-warning" },
];

const STRIKETHROUGH_SPECIMENS = [
  { token: "line-through · text-2xl", classes: "font-sans text-2xl font-medium text-text-primary line-through" },
  { token: "line-through · text-xl", classes: "font-sans text-xl font-medium text-text-primary line-through" },
  { token: "line-through · text-lg", classes: "font-sans text-lg font-medium text-text-primary line-through" },
  { token: "line-through · text-md", classes: "font-sans text-md font-medium text-text-secondary line-through" },
  { token: "line-through · text-sm", classes: "font-sans text-sm font-medium text-text-muted line-through" },
];

// ---------------------------------------------------------------------------
// Typography Sub-Components
// ---------------------------------------------------------------------------

function TokenRow({ token, meta, classes, sample, idx }: { token: string; meta?: string; classes: string; sample: string; idx: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: idx * 0.03 }}
      className="group flex flex-col gap-3 px-8 py-6 hover:bg-white/[0.02] transition-colors"
    >
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
        {/* Token info */}
        <div className="w-52 shrink-0 flex flex-col gap-1">
          <span className="font-mono text-xs font-semibold text-text-brand tracking-tight">{token}</span>
          {meta && <span className="font-mono text-2xs text-text-muted">{meta}</span>}
        </div>

        {/* Live sample */}
        <div className="flex-1 min-w-0">
          <div className={cn(classes, "transition-all duration-300 group-hover:pl-2")}>{sample}</div>
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Burst Demo Sub-Component (needs its own hook call)
// ---------------------------------------------------------------------------


function ParticleTextDemo() {
  const [text, setText] = useState("TOKEN");
  return (
    <div>
      <div className="flex items-center gap-4 mb-3">
        <h3 className="font-mono text-[10px] tracking-[0.3em] text-text-muted uppercase">Ambient — Particle Text</h3>
        <div className="flex-1 h-px bg-border-subtle" />
        <span className="font-mono text-[9px] text-text-disabled">WebGL · OGL point sprites</span>
      </div>
      <p className="text-xs text-text-muted font-light mb-6 max-w-xl">
        Text sampled to pixel positions via offscreen canvas. Rendered as WebGL point sprites
        that converge into letterforms via spring physics. Cursor pushes particles aside,
        while a diagonal shimmer wave travels across the strokes.
      </p>
      <div className="relative overflow-hidden" style={{ height: 300 }}>
        <ParticleText text={text} className="absolute inset-0" />
        <div className="absolute bottom-4 left-5 font-mono text-[9px] text-text-disabled/40 pointer-events-none">
          Move cursor · deform and release
        </div>
      </div>
      <div className="mt-4">
        <input
          value={text}
          onChange={e => setText(e.target.value.slice(0, 20).toUpperCase())}
          placeholder="Type something…"
          className="w-full bg-surface-sunken border border-white/[0.06] rounded-xl px-4 py-3 font-mono text-sm text-text-primary placeholder:text-text-disabled focus:outline-none focus:border-text-brand/40 tracking-widest uppercase"
        />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4">
        {[
          { label: "Spring constant", val: "0.042", note: "pull toward home" },
          { label: "Push radius", val: "72px", note: "cursor influence" },
          { label: "Sample step", val: "11 px", note: "matched to grid" },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-2xl border border-white/[0.03] bg-surface-page/50 space-y-1">
            <span className="font-mono text-[9px] text-text-brand/60 uppercase tracking-widest block">{s.label}</span>
            <span className="font-display text-xl font-bold text-text-primary">{s.val}</span>
            <span className="font-mono text-[9px] text-text-disabled block">{s.note}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Shader presets ──────────────────────────────────────────────────────────

const SHADER_PRESETS: Record<string, Omit<Pin, "id">[]> = {
  // ── Cool ──────────────────────────────────────────────────────────────────
  "Cyan Dusk": [
    { x: 0.05, y: 0.05, color: "#26c9c9" },
    { x: 0.95, y: 0.05, color: "#1d4ed8" },
    { x: 0.05, y: 0.95, color: "#0f172a" },
    { x: 0.95, y: 0.95, color: "#7c3aed" },
    { x: 0.50, y: 0.45, color: "#0ea5e9" },
  ],
  "Deep Sea": [
    { x: 0.05, y: 0.05, color: "#0c4a6e" },
    { x: 0.95, y: 0.05, color: "#0e7490" },
    { x: 0.05, y: 0.95, color: "#020617" },
    { x: 0.95, y: 0.95, color: "#164e63" },
    { x: 0.50, y: 0.30, color: "#22d3ee" },
    { x: 0.25, y: 0.75, color: "#0369a1" },
  ],
  "Midnight": [
    { x: 0.05, y: 0.05, color: "#1e1b4b" },
    { x: 0.95, y: 0.05, color: "#3730a3" },
    { x: 0.05, y: 0.95, color: "#020617" },
    { x: 0.95, y: 0.95, color: "#1e3a5f" },
    { x: 0.50, y: 0.45, color: "#6366f1" },
    { x: 0.75, y: 0.25, color: "#818cf8" },
  ],
  // ── Warm ──────────────────────────────────────────────────────────────────
  "Ember": [
    { x: 0.05, y: 0.05, color: "#f97316" },
    { x: 0.95, y: 0.05, color: "#dc2626" },
    { x: 0.05, y: 0.95, color: "#1c0700" },
    { x: 0.95, y: 0.95, color: "#7c2d12" },
    { x: 0.50, y: 0.40, color: "#fbbf24" },
  ],
  "Sunset": [
    { x: 0.05, y: 0.05, color: "#7c3aed" },
    { x: 0.95, y: 0.05, color: "#f97316" },
    { x: 0.05, y: 0.95, color: "#1e1b4b" },
    { x: 0.95, y: 0.95, color: "#9f1239" },
    { x: 0.55, y: 0.40, color: "#fb923c" },
    { x: 0.20, y: 0.65, color: "#ec4899" },
  ],
  "Rose Gold": [
    { x: 0.05, y: 0.05, color: "#fda4af" },
    { x: 0.95, y: 0.05, color: "#f59e0b" },
    { x: 0.05, y: 0.95, color: "#881337" },
    { x: 0.95, y: 0.95, color: "#92400e" },
    { x: 0.50, y: 0.45, color: "#fcd34d" },
    { x: 0.30, y: 0.25, color: "#fb7185" },
  ],
  // ── Nature ────────────────────────────────────────────────────────────────
  "Emerald": [
    { x: 0.05, y: 0.05, color: "#34d399" },
    { x: 0.95, y: 0.05, color: "#059669" },
    { x: 0.05, y: 0.95, color: "#022c22" },
    { x: 0.95, y: 0.95, color: "#0d9488" },
    { x: 0.50, y: 0.45, color: "#a7f3d0" },
  ],
  "Aurora": [
    { x: 0.05, y: 0.05, color: "#059669" },
    { x: 0.95, y: 0.05, color: "#7c3aed" },
    { x: 0.05, y: 0.95, color: "#0c4a6e" },
    { x: 0.95, y: 0.95, color: "#0d9488" },
    { x: 0.50, y: 0.35, color: "#34d399" },
    { x: 0.75, y: 0.70, color: "#818cf8" },
    { x: 0.20, y: 0.55, color: "#06b6d4" },
  ],
  // ── Neon / Chromatic ──────────────────────────────────────────────────────
  "Neon": [
    { x: 0.05, y: 0.05, color: "#ec4899" },
    { x: 0.95, y: 0.05, color: "#06b6d4" },
    { x: 0.05, y: 0.95, color: "#0a0014" },
    { x: 0.95, y: 0.95, color: "#7c3aed" },
    { x: 0.50, y: 0.45, color: "#f0abfc" },
    { x: 0.75, y: 0.20, color: "#a5f3fc" },
  ],
  "Acid": [
    { x: 0.05, y: 0.05, color: "#84cc16" },
    { x: 0.95, y: 0.05, color: "#facc15" },
    { x: 0.05, y: 0.95, color: "#052e16" },
    { x: 0.95, y: 0.95, color: "#3f6212" },
    { x: 0.50, y: 0.40, color: "#d9f99d" },
    { x: 0.25, y: 0.70, color: "#a3e635" },
    { x: 0.80, y: 0.65, color: "#fde047" },
  ],
  "Chromatic": [
    { x: 0.05, y: 0.10, color: "#f43f5e" },
    { x: 0.38, y: 0.05, color: "#f97316" },
    { x: 0.62, y: 0.05, color: "#eab308" },
    { x: 0.95, y: 0.10, color: "#22c55e" },
    { x: 0.95, y: 0.80, color: "#3b82f6" },
    { x: 0.50, y: 0.95, color: "#8b5cf6" },
    { x: 0.05, y: 0.80, color: "#ec4899" },
    { x: 0.50, y: 0.48, color: "#ffffff" },
  ],
  "Oil Slick": [
    { x: 0.10, y: 0.10, color: "#0d9488" },
    { x: 0.90, y: 0.10, color: "#7c3aed" },
    { x: 0.10, y: 0.90, color: "#0a0a0a" },
    { x: 0.90, y: 0.90, color: "#b45309" },
    { x: 0.50, y: 0.45, color: "#1e293b" },
    { x: 0.30, y: 0.30, color: "#4f46e5" },
    { x: 0.70, y: 0.70, color: "#d97706" },
  ],
  // ── Soft / Pastel ─────────────────────────────────────────────────────────
  "Candy": [
    { x: 0.05, y: 0.05, color: "#f9a8d4" },
    { x: 0.95, y: 0.05, color: "#c4b5fd" },
    { x: 0.05, y: 0.95, color: "#fbcfe8" },
    { x: 0.95, y: 0.95, color: "#a5f3fc" },
    { x: 0.50, y: 0.45, color: "#fde68a" },
    { x: 0.25, y: 0.55, color: "#bbf7d0" },
  ],
  "Ice": [
    { x: 0.05, y: 0.05, color: "#f0f9ff" },
    { x: 0.95, y: 0.05, color: "#bae6fd" },
    { x: 0.05, y: 0.95, color: "#0c4a6e" },
    { x: 0.95, y: 0.95, color: "#075985" },
    { x: 0.50, y: 0.40, color: "#e0f2fe" },
    { x: 0.70, y: 0.70, color: "#0369a1" },
  ],
  "Sakura": [
    { x: 0.05, y: 0.05, color: "#fce7f3" },
    { x: 0.95, y: 0.05, color: "#fbcfe8" },
    { x: 0.05, y: 0.95, color: "#be185d" },
    { x: 0.95, y: 0.95, color: "#9f1239" },
    { x: 0.50, y: 0.40, color: "#fda4af" },
    { x: 0.30, y: 0.70, color: "#f43f5e" },
  ],
  // ── Metallic ──────────────────────────────────────────────────────────────
  "Copper": [
    { x: 0.05, y: 0.05, color: "#92400e" },
    { x: 0.95, y: 0.05, color: "#d97706" },
    { x: 0.05, y: 0.95, color: "#1c0700" },
    { x: 0.95, y: 0.95, color: "#78350f" },
    { x: 0.50, y: 0.35, color: "#fbbf24" },
    { x: 0.25, y: 0.65, color: "#b45309" },
    { x: 0.80, y: 0.60, color: "#fde68a" },
  ],
  "Platinum": [
    { x: 0.05, y: 0.05, color: "#e4e4e7" },
    { x: 0.95, y: 0.05, color: "#a1a1aa" },
    { x: 0.05, y: 0.95, color: "#18181b" },
    { x: 0.95, y: 0.95, color: "#3f3f46" },
    { x: 0.50, y: 0.40, color: "#f4f4f5" },
    { x: 0.35, y: 0.70, color: "#71717a" },
  ],
  // ── Dark / Cosmic ─────────────────────────────────────────────────────────
  "Blood Moon": [
    { x: 0.05, y: 0.05, color: "#450a0a" },
    { x: 0.95, y: 0.05, color: "#7f1d1d" },
    { x: 0.05, y: 0.95, color: "#0a0000" },
    { x: 0.95, y: 0.95, color: "#3b0000" },
    { x: 0.50, y: 0.40, color: "#ef4444" },
    { x: 0.30, y: 0.65, color: "#991b1b" },
  ],
  "Cosmic Dust": [
    { x: 0.05, y: 0.05, color: "#2e1065" },
    { x: 0.95, y: 0.05, color: "#0f172a" },
    { x: 0.05, y: 0.95, color: "#030712" },
    { x: 0.95, y: 0.95, color: "#1e1b4b" },
    { x: 0.50, y: 0.35, color: "#7c3aed" },
    { x: 0.75, y: 0.65, color: "#4f46e5" },
    { x: 0.20, y: 0.60, color: "#6d28d9" },
  ],
  // ── Neutral ───────────────────────────────────────────────────────────────
  "Void": [
    { x: 0.05, y: 0.05, color: "#27272a" },
    { x: 0.95, y: 0.05, color: "#3f3f46" },
    { x: 0.05, y: 0.95, color: "#09090b" },
    { x: 0.95, y: 0.95, color: "#1c1c1e" },
    { x: 0.50, y: 0.45, color: "#71717a" },
  ],
  "Solar Flare": [
    { x: 0.10, y: 0.10, color: "#fef3c7" },
    { x: 0.90, y: 0.10, color: "#fbbf24" },
    { x: 0.10, y: 0.90, color: "#7c2d12" },
    { x: 0.90, y: 0.90, color: "#dc2626" },
    { x: 0.50, y: 0.40, color: "#ffffff" },
    { x: 0.25, y: 0.60, color: "#f97316" },
    { x: 0.75, y: 0.65, color: "#b91c1c" },
  ],
};

let _psc = 0;
function presetPins(name: string): Pin[] {
  return SHADER_PRESETS[name].map((d) => ({ ...d, id: `ps-${++_psc}` }));
}

// Each combo pairs a blend mode with a tuned default opacity so the effect
// reads clearly against the gradient without manual tweaking.
const BLEND_COMBOS: { label: string; mode: BlendMode; opacity: number }[] = [
  { label: "overlay", mode: "overlay", opacity: 1.00 },
  { label: "soft light", mode: "soft-light", opacity: 1.00 },
  { label: "screen", mode: "screen", opacity: 0.75 },
  { label: "hard light", mode: "hard-light", opacity: 0.90 },
  { label: "difference", mode: "difference", opacity: 0.85 },
  { label: "exclusion", mode: "exclusion", opacity: 0.80 },
  { label: "color dodge", mode: "color-dodge", opacity: 0.45 },
  { label: "color burn", mode: "color-burn", opacity: 0.60 },
  { label: "luminosity", mode: "luminosity", opacity: 1.00 },
];


function ShaderDemo() {
  const [preset, setPreset] = useState<string>("Cyan Dusk");
  const [animated, setAnimated] = useState(false);
  const [blend, setBlend] = useState<BlendMode>("overlay");
  const [opacity, setOpacity] = useState(1);
  const [noiseOpacity, setNoiseOpacity] = useState(0.35);

  // Stable reference — only changes when preset changes, so MeshGradientCard
  // only resets its pin state when the preset actually switches.
  const initialPins = useMemo(() => presetPins(preset), [preset]);

  return (
    <div className="space-y-6">

      {/* Preset + animated controls */}
      <div className="flex flex-wrap items-center gap-2">
        {Object.keys(SHADER_PRESETS).map((name) => (
          <button
            key={name}
            onClick={() => setPreset(name)}
            className={cn(
              "px-3 py-1.5 rounded-lg font-mono text-[10px] tracking-wider uppercase transition-all duration-200",
              preset === name
                ? "bg-interactive-brand-default/20 border border-interactive-brand-default/40 text-text-brand"
                : "border border-white/[0.06] text-text-muted hover:text-text-secondary hover:border-white/10"
            )}
          >
            {name}
          </button>
        ))}
        <div className="flex-1" />
        <button
          onClick={() => setAnimated((a) => !a)}
          className={cn(
            "px-3 py-1.5 rounded-lg font-mono text-[10px] tracking-wider uppercase transition-all duration-200",
            animated
              ? "bg-interactive-brand-default/20 border border-interactive-brand-default/40 text-text-brand"
              : "border border-white/[0.06] text-text-muted hover:text-text-secondary"
          )}
        >
          {animated ? "● Animated" : "○ Static"}
        </button>
      </div>

      {/* Card */}
      <MeshGradientCard
        height={380}
        initialPins={initialPins}
        animated={animated}
        textBlend={blend}
        textOpacity={opacity}
        noiseOpacity={noiseOpacity}
        label="Token"
      />

      {/* Blend mode + opacity */}
      <div className="space-y-4">
        <div>
          <p className="font-mono text-[9px] text-text-muted uppercase tracking-[0.3em] mb-3">Text blend mode</p>
          <div className="flex flex-wrap gap-2">
            {BLEND_COMBOS.map((combo) => (
              <button
                key={combo.mode}
                onClick={() => { setBlend(combo.mode); setOpacity(combo.opacity); }}
                className={cn(
                  "px-3 py-1.5 rounded-lg font-mono text-[10px] tracking-wider transition-all duration-200",
                  blend === combo.mode
                    ? "bg-interactive-brand-default/20 border border-interactive-brand-default/40 text-text-brand"
                    : "border border-white/[0.06] text-text-muted hover:text-text-secondary"
                )}
              >
                {combo.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <p className="font-mono text-[9px] text-text-muted uppercase tracking-[0.3em] shrink-0">Opacity</p>
          <input
            type="range"
            min={0} max={1} step={0.05}
            value={opacity}
            onChange={(e) => setOpacity(Number(e.target.value))}
            className="flex-1 accent-interactive-brand-default h-0.5 cursor-pointer"
          />
          <span className="font-mono text-[9px] text-text-disabled w-8 text-right">
            {Math.round(opacity * 100)}%
          </span>
        </div>
      </div>

      {/* Grain intensity */}
      <div className="flex items-center gap-4">
        <p className="font-mono text-[9px] text-text-muted uppercase tracking-[0.3em] shrink-0">Grain</p>
        <input
          type="range"
          min={0} max={1} step={0.01}
          value={noiseOpacity}
          onChange={(e) => setNoiseOpacity(Number(e.target.value))}
          className="flex-1 accent-interactive-brand-default h-0.5 cursor-pointer"
        />
        <span className="font-mono text-[9px] text-text-disabled w-8 text-right">
          {Math.round(noiseOpacity * 100)}%
        </span>
      </div>

      <p className="font-mono text-[9px] text-text-disabled">
        Drag pins · click canvas to add · right-click pin to remove
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Algorithm", val: "IDW", note: "inverse distance weighting" },
          { label: "Max pins", val: "16", note: "per gradient" },
          { label: "Shader", val: "GLSL ES 3.0", note: "WebGL2 fragment" },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-2xl border border-white/[0.03] bg-surface-page/50 space-y-1">
            <span className="font-mono text-[9px] text-text-brand/60 uppercase tracking-widest block">{s.label}</span>
            <span className="font-display text-xl font-bold text-text-primary">{s.val}</span>
            <span className="font-mono text-[9px] text-text-disabled block">{s.note}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BurstDemo() {
  const { sparks, trigger } = useBurst(28);
  const [confirmed, setConfirmed] = useState(false);

  function handleClick() {
    if (confirmed) return;
    trigger();
    setConfirmed(true);
    setTimeout(() => setConfirmed(false), 1400);
  }

  return (
    <div className="relative inline-flex">
      <BurstParticles sparks={sparks} />
      <Button
        onClick={handleClick}
        variant="brand"
        appearance={confirmed ? "tonal" : "filled"}
        size="md"
        shape="rounded"
        leadingIcon={confirmed ? <RiCheckLine /> : <RiSendPlaneLine />}
      >
        {confirmed ? "Confirmed" : "Confirm Transaction"}
      </Button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Checkboxes Section
// ---------------------------------------------------------------------------

function CheckboxesSection() {
  // ── Controlled examples ────────────────────────────────────────────────────
  const [notifPrice, setNotifPrice] = useState(true);
  const [notifTx, setNotifTx] = useState(true);
  const [notifProposal, setNotifProposal] = useState(false);
  const [notifNews, setNotifNews] = useState(false);

  const [termsAccepted, setTermsAccepted] = useState(false);

  // Indeterminate "select all" demo
  const [items, setItems] = useState([true, false, true]);
  const allChecked = items.every(Boolean);
  const someChecked = items.some(Boolean) && !allChecked;

  return (
    <div className="flex flex-col gap-16">

      {/* ── Sizes ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)]">Sizes</h3>
        <div className="flex items-center gap-8">
          {(["sm", "md", "lg"] as const).map((size) => (
            <div key={size} className="flex flex-col gap-3">
              <Checkbox size={size} defaultChecked label={size.toUpperCase()} />
              <Checkbox size={size} label={size.toUpperCase()} />
            </div>
          ))}
        </div>
      </div>

      {/* ── States ────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)]">States</h3>
        <div className="grid grid-cols-4 gap-6">
          {(["default", "error", "warning", "success"] as const).map((state) => (
            <div key={state} className="flex flex-col gap-3">
              <span className="text-xs capitalize text-[var(--color-text-muted)] font-medium">{state}</span>
              <Checkbox state={state} defaultChecked label="Checked" />
              <Checkbox state={state} label="Unchecked" />
              <Checkbox state={state} disabled defaultChecked label="Disabled" />
            </div>
          ))}
        </div>
      </div>

      {/* ── Indeterminate ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)]">Indeterminate</h3>
        <div className="flex flex-col gap-3 max-w-xs">
          <Checkbox
            label="Select all wallets"
            checked={allChecked}
            indeterminate={someChecked}
            onChange={(e) => setItems(items.map(() => e.target.checked))}
          />
          <div className="ml-6 flex flex-col gap-3 border-l border-[var(--color-border-subtle)] pl-4">
            {["Vault · 0x4e…f3a2", "Safe · 0x91…c7b1", "Watch · 0xd3…09fe"].map((name, i) => (
              <Checkbox
                key={name}
                label={name}
                checked={items[i]}
                onChange={(e) => {
                  const next = [...items];
                  next[i] = e.target.checked;
                  setItems(next);
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── With Description ──────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)]">With Description</h3>
        <div className="flex flex-col gap-4 max-w-sm">
          <Checkbox
            defaultChecked
            label="Enable notifications"
            description="Receive alerts for on-chain activity and proposals."
          />
          <Checkbox
            label="Two-factor authentication"
            description="Require a second factor when signing transactions."
          />
          <Checkbox
            disabled
            label="Hardware key (YubiKey)"
            description="Connect a physical security key to your account."
          />
        </div>
      </div>

      {/* ── Checkbox Groups ───────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)]">Checkbox Groups</h3>
        <div className="grid grid-cols-2 gap-8 px-8 py-8 rounded-3xl border border-white/[0.04] bg-[var(--color-surface-sunken)]/40">

          {/* Vertical */}
          <CheckboxGroup label="Notification preferences" helperText="Choose which events trigger alerts.">
            <Checkbox label="Price alerts" checked={notifPrice} onChange={(e) => setNotifPrice(e.target.checked)} />
            <Checkbox label="Transaction confirmed" checked={notifTx} onChange={(e) => setNotifTx(e.target.checked)} />
            <Checkbox label="New proposal" checked={notifProposal} onChange={(e) => setNotifProposal(e.target.checked)} />
            <Checkbox label="Protocol news" checked={notifNews} onChange={(e) => setNotifNews(e.target.checked)} />
          </CheckboxGroup>

          {/* With error */}
          <CheckboxGroup
            label="Required confirmations"
            required
            state="error"
            errorMessage="Select at least one confirmation method."
          >
            <Checkbox state="error" label="Email" description="Sent to your registered address" />
            <Checkbox state="error" label="Push notification" description="Requires the mobile app" />
            <Checkbox state="error" label="SMS" description="Standard messaging rates apply" disabled />
          </CheckboxGroup>

          {/* Horizontal */}
          <CheckboxGroup label="Supported networks" optional direction="horizontal" className="col-span-2">
            {["Ethereum", "Polygon", "Arbitrum", "Optimism", "Base", "Solana"].map((n) => (
              <Checkbox key={n} defaultChecked={n === "Ethereum" || n === "Arbitrum"} label={n} />
            ))}
          </CheckboxGroup>

        </div>
      </div>

      {/* ── Real-world Examples ───────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)]">Real-world Examples</h3>
        <div className="grid grid-cols-2 gap-6 px-8 py-8 rounded-3xl border border-white/[0.04] bg-[var(--color-surface-sunken)]/40">

          {/* Terms acceptance */}
          <div className="flex flex-col gap-4">
            <p className="text-xs text-[var(--color-text-muted)]">Terms acceptance</p>
            <Checkbox
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              state={!termsAccepted ? "error" : "success"}
              label="I agree to the Terms of Service"
              description="By checking this box you confirm you have read and accept our terms."
            />
          </div>

          {/* Transaction options */}
          <div className="flex flex-col gap-4">
            <p className="text-xs text-[var(--color-text-muted)]">Transaction options</p>
            <div className="flex flex-col gap-3">
              <Checkbox defaultChecked label="Simulate before signing" description="Run a dry-run to detect reverts" />
              <Checkbox defaultChecked label="Broadcast immediately" description="Skip mempool monitoring" />
              <Checkbox label="Replace by fee (RBF)" description="Allow fee bumping if stuck" />
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

// ---------------------------------------------------------------------------
// Radio Buttons Section
// ---------------------------------------------------------------------------

const RADIO_SIZES: RadioSize[] = ["sm", "md", "lg"];
const RADIO_STATES: RadioState[] = ["default", "error", "warning", "success"];

function RadioButtonsSection() {
  const [payMethod, setPayMethod] = useState("card");
  const [network, setNetwork] = useState("ethereum");
  const [notify, setNotify] = useState("all");

  return (
    <div className="flex flex-col gap-16">

      {/* ── Sizes ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Sizes</h3>
          <p className="text-xs text-[var(--color-text-muted)]">sm · md · lg</p>
        </div>
        <div className="flex flex-wrap items-center gap-8">
          {RADIO_SIZES.map((size) => (
            <RadioButton key={size} value={size} size={size} label={`Size ${size}`} defaultChecked={size === "md"} />
          ))}
        </div>
      </div>

      {/* ── States ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">States</h3>
          <p className="text-xs text-[var(--color-text-muted)]">Static visual reference — buttons are isolated, not grouped. See Radio Groups below for live interaction.</p>
        </div>
        <div className="grid grid-cols-1 gap-y-5 gap-x-12 sm:grid-cols-2 lg:grid-cols-4">
          {RADIO_STATES.map((state) => (
            <div key={state} className="flex flex-col gap-3">
              <span className="text-xs font-mono text-[var(--color-text-muted)] capitalize">{state}</span>
              <RadioButton value="a" state={state} label="Unchecked" />
              <RadioButton value="b" state={state} label="Checked" defaultChecked />
              <RadioButton value="c" state={state} label="Disabled" disabled />
              <RadioButton value="d" state={state} label="Disabled checked" disabled defaultChecked />
            </div>
          ))}
        </div>
      </div>

      {/* ── With Description ───────────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">With Description</h3>
          <p className="text-xs text-[var(--color-text-muted)]">
            Circle aligns to the cap-height of the first label line.
          </p>
        </div>
        <div className="flex flex-wrap gap-8">
          <RadioButton
            value="fast"
            label="Instant settlement"
            description="Clears in under 2 seconds using optimistic confirmation."
          />
          <RadioButton
            value="standard"
            label="Standard"
            description="Clears in 1–3 minutes after on-chain confirmation."
            defaultChecked
          />
          <RadioButton
            value="slow"
            label="Economy"
            description="Low-fee option — clears within 15–60 minutes."
          />
        </div>
      </div>

      {/* ── Radio Groups ───────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Radio Groups</h3>
          <p className="text-xs text-[var(--color-text-muted)]">
            Exclusive selection via context. The dot flies between circles — vertically in column groups, horizontally in row groups. Click between options to see it.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">

          {/* Vertical */}
          <RadioGroup
            label="Notification frequency"
            value={notify}
            onChange={setNotify}
            helperText="You can change this in settings at any time."
          >
            <RadioButton value="all" label="All activity" />
            <RadioButton value="mentions" label="Mentions only" />
            <RadioButton value="none" label="None" />
          </RadioGroup>

          {/* Error state */}
          <RadioGroup
            label="Settlement speed"
            state="error"
            errorMessage="Please select a settlement option to continue."
            required
          >
            <RadioButton value="instant" label="Instant" description="~2 sec" />
            <RadioButton value="standard" label="Standard" description="1–3 min" />
            <RadioButton value="economy" label="Economy" description="15–60 min" />
          </RadioGroup>

          {/* Horizontal */}
          <RadioGroup
            label="Chart interval"
            direction="horizontal"
            defaultValue="1d"
            helperText="Determines the candle resolution on the chart."
          >
            <RadioButton value="1h" label="1H" />
            <RadioButton value="4h" label="4H" />
            <RadioButton value="1d" label="1D" />
            <RadioButton value="1w" label="1W" />
          </RadioGroup>

        </div>
      </div>

      {/* ── Real-world Examples ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Real-world Examples</h3>
          <p className="text-xs text-[var(--color-text-muted)]">
            Realistic DeFi/fintech use cases.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">

          {/* Payment method */}
          <RadioGroup
            label="Payment method"
            required
            value={payMethod}
            onChange={setPayMethod}
            helperText={`Selected: ${payMethod}`}
          >
            <RadioButton value="card" label="Credit / Debit card" description="Visa, Mastercard, Amex" />
            <RadioButton value="bank" label="Bank transfer (ACH)" description="2–3 business days" />
            <RadioButton value="crypto" label="Crypto wallet" description="Instant — pay with ETH or USDC" />
          </RadioGroup>

          {/* Network selector */}
          <RadioGroup
            label="Source network"
            value={network}
            onChange={setNetwork}
            helperText="Bridge fees vary by network."
          >
            <RadioButton value="ethereum" label="Ethereum" description="Highest security, higher fees" />
            <RadioButton value="optimism" label="Optimism" description="L2 rollup — low fees" />
            <RadioButton value="base" label="Base" description="Coinbase L2 — lowest fees" />
            <RadioButton value="polygon" label="Polygon" description="Sidechain — ultra-low fees" />
          </RadioGroup>

          {/* KYC tier */}
          <RadioGroup
            label="Verification tier"
            required
            optional={false}
            defaultValue="basic"
            helperText="Higher tiers unlock larger transaction limits."
          >
            <RadioButton
              value="basic"
              label="Basic"
              description="Up to $1,000 / day — email verification only"
            />
            <RadioButton
              value="standard"
              label="Standard"
              description="Up to $25,000 / day — ID + selfie required"
            />
            <RadioButton
              value="pro"
              label="Professional"
              description="Unlimited — full KYC + proof of address"
              disabled
            />
          </RadioGroup>

        </div>
      </div>

    </div>
  );
}

// ---------------------------------------------------------------------------
// Toggles Section
// ---------------------------------------------------------------------------

function TogglesSection() {
  // Real-world demo state
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [biometrics, setBiometrics] = useState(false);
  const [autoSign, setAutoSign] = useState(false);
  const [simMode, setSimMode] = useState(true);
  const [broadcastNow, setBroadcastNow] = useState(true);
  const [rbf, setRbf] = useState(false);
  const [simulate, setSimulate] = useState(true);

  return (
    <div className="flex flex-col gap-16">

      {/* ── Sizes ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Sizes</h3>
          <p className="text-xs text-[var(--color-text-muted)]">sm · md · lg — both on and off states shown.</p>
        </div>
        <div className="flex flex-wrap items-center gap-10">
          {(["sm", "md", "lg"] as const).map((s) => (
            <div key={s} className="flex flex-col gap-3">
              <Toggle size={s} defaultChecked label={`${s.toUpperCase()} on`} />
              <Toggle size={s} label={`${s.toUpperCase()} off`} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Variants ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Variants</h3>
          <p className="text-xs text-[var(--color-text-muted)]">Track colour expresses the semantic intent of the setting.</p>
        </div>
        <div className="flex flex-wrap gap-8">
          {(["brand", "danger", "warning", "success"] as const).map((v) => (
            <div key={v} className="flex flex-col gap-3">
              <span className="text-xs font-mono text-[var(--color-text-muted)] capitalize">{v}</span>
              <Toggle variant={v} defaultChecked />
              <Toggle variant={v} />
            </div>
          ))}
        </div>
      </div>

      {/* ── States ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">States</h3>
          <p className="text-xs text-[var(--color-text-muted)]">On · Off · Disabled on · Disabled off</p>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <Toggle defaultChecked label="On" />
          <Toggle label="Off" />
          <Toggle defaultChecked label="Disabled on" disabled />
          <Toggle label="Disabled off" disabled />
        </div>
      </div>

      {/* ── With Description ───────────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">With Description</h3>
          <p className="text-xs text-[var(--color-text-muted)]">
            Secondary line aligns to the cap-height of the label, toggle aligns to the first line.
          </p>
        </div>
        <div className="flex flex-wrap gap-8">
          <Toggle
            defaultChecked
            label="Push notifications"
            description="Receive alerts for transactions and proposals."
          />
          <Toggle
            label="Hardware 2FA"
            description="Require physical key on every sign."
            variant="success"
          />
          <Toggle
            defaultChecked
            label="Simulation mode"
            description="Preview transactions before broadcasting."
            variant="warning"
          />
          <Toggle
            defaultChecked
            label="Auto-sign"
            description="Bypasses threshold review — use with caution."
            variant="danger"
            disabled
          />
        </div>
      </div>

      {/* ── Label side ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Label Side</h3>
          <p className="text-xs text-[var(--color-text-muted)]">Default is right — left is common in settings rows that need the toggle flush to the trailing edge.</p>
        </div>
        <div className="flex flex-wrap items-center gap-8">
          <Toggle defaultChecked label="Label right" labelSide="right" />
          <Toggle defaultChecked label="Label left" labelSide="left" />
        </div>
      </div>

      {/* ── Real-world ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Real-world Examples</h3>
          <p className="text-xs text-[var(--color-text-muted)]">Settings panels — the primary toggle use case.</p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 px-8 py-8 rounded-3xl border border-white/[0.04] bg-[var(--color-surface-sunken)]/40">

          {/* App preferences */}
          <div className="flex flex-col gap-1">
            <p className="text-xs text-[var(--color-text-muted)] mb-3">App preferences</p>
            <div className="flex flex-col divide-y divide-[var(--color-border-subtle)] rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
              {[
                { label: "Dark interface", desc: "Always use dark theme", checked: darkMode, set: setDarkMode, variant: "brand" },
                { label: "Notifications", desc: "Price alerts & tx confirmations", checked: notifications, set: setNotifications, variant: "brand" },
                { label: "Biometric unlock", desc: "Face ID / Touch ID", checked: biometrics, set: setBiometrics, variant: "success" },
              ].map(({ label, desc, checked, set, variant }) => (
                <div key={label} className="flex items-center justify-between px-3.5 py-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-[var(--color-text-primary)]">{label}</span>
                    <span className="text-xs text-[var(--color-text-muted)]">{desc}</span>
                  </div>
                  <Toggle checked={checked} onChange={set} variant={variant as any} aria-label={label} />
                </div>
              ))}
            </div>
          </div>

          {/* Security settings */}
          <div className="flex flex-col gap-1">
            <p className="text-xs text-[var(--color-text-muted)] mb-3">Security</p>
            <div className="flex flex-col divide-y divide-[var(--color-border-subtle)] rounded-xl border border-[var(--color-border-subtle)] overflow-hidden">
              {[
                { label: "Auto-sign proposals", desc: "Bypasses threshold review", checked: autoSign, set: setAutoSign, variant: "danger" },
                { label: "Simulation mode", desc: "Preview before broadcast", checked: simMode, set: setSimMode, variant: "warning" },
              ].map(({ label, desc, checked, set, variant }) => (
                <div key={label} className="flex items-center justify-between px-3.5 py-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-[var(--color-text-primary)]">{label}</span>
                    <span className="text-xs text-[var(--color-text-muted)]">{desc}</span>
                  </div>
                  <Toggle checked={checked} onChange={set} variant={variant as any} aria-label={label} />
                </div>
              ))}
            </div>
          </div>

          {/* Transaction options */}
          <div className="flex flex-col gap-1">
            <p className="text-xs text-[var(--color-text-muted)] mb-3">Transaction options</p>
            <div className="flex flex-col gap-3.5">
              <Toggle
                checked={simulate}
                onChange={setSimulate}
                label="Simulate before signing"
                description="Run a dry-run to detect reverts."
                variant="brand"
              />
              <Toggle
                checked={broadcastNow}
                onChange={setBroadcastNow}
                label="Broadcast immediately"
                description="Skip mempool monitoring."
              />
              <Toggle
                checked={rbf}
                onChange={setRbf}
                label="Replace by fee (RBF)"
                description="Allow fee bumping if stuck."
              />
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

// ---------------------------------------------------------------------------
// Dropdowns Section
// ---------------------------------------------------------------------------

function DropdownsSection() {
  const [network, setNetwork] = useState("ethereum");
  const [sortBy, setSortBy] = useState("");
  const [currency, setCurrency] = useState("");
  const [controlledOpen, setControlledOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCreateQuery, setSearchCreateQuery] = useState("");
  const [searchSelected, setSearchSelected] = useState<string[]>(["ethereum"]);
  const toggleSearchSel = (v: string) =>
    setSearchSelected(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);

  const externalTriggerRef = useRef<HTMLButtonElement | null>(null);

  // Multi-select state
  const [txTypes, setTxTypes] = useState<string[]>(["buy", "sell"]);
  const [selectedNets, setSelectedNets] = useState<string[]>(["ethereum", "solana"]);
  const toggleTxType = (v: string) =>
    setTxTypes(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
  const toggleNet = (v: string) =>
    setSelectedNets(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);

  const NETWORKS = [
    { value: "ethereum", label: "Ethereum", icon: <i className="cf cf-eth" style={{ fontSize: "1em", lineHeight: 1 }} /> },
    { value: "bitcoin", label: "Bitcoin", icon: <i className="cf cf-btc" style={{ fontSize: "1em", lineHeight: 1 }} /> },
    { value: "solana", label: "Solana", icon: <i className="cf cf-sol" style={{ fontSize: "1em", lineHeight: 1 }} /> },
    { value: "bnb", label: "BNB Chain", icon: <i className="cf cf-bnb" style={{ fontSize: "1em", lineHeight: 1 }} /> },
    { value: "polygon", label: "Polygon", icon: <i className="cf cf-matic" style={{ fontSize: "1em", lineHeight: 1 }} /> },
    { value: "avax", label: "Avalanche", icon: <i className="cf cf-avax" style={{ fontSize: "1em", lineHeight: 1 }} /> },
    { value: "dot", label: "Polkadot", icon: <i className="cf cf-dot" style={{ fontSize: "1em", lineHeight: 1 }} /> },
    { value: "ada", label: "Cardano", icon: <i className="cf cf-ada" style={{ fontSize: "1em", lineHeight: 1 }} /> },
    { value: "near", label: "NEAR", icon: <i className="cf cf-near" style={{ fontSize: "1em", lineHeight: 1 }} /> },
    { value: "ftm", label: "Fantom", icon: <i className="cf cf-ftm" style={{ fontSize: "1em", lineHeight: 1 }} /> },
  ];

  const TX_TYPES = [
    { value: "buy", label: "Buy" },
    { value: "sell", label: "Sell" },
    { value: "transfer", label: "Transfer" },
    { value: "swap", label: "Swap" },
    { value: "stake", label: "Stake" },
    { value: "unstake", label: "Unstake" },
  ];

  const SORT_OPTIONS = [
    { value: "value-desc", label: "Value: High → Low" },
    { value: "value-asc", label: "Value: Low → High" },
    { value: "name-asc", label: "Name: A → Z" },
    { value: "recent", label: "Most Recent" },
  ];

  const selectedNetwork = NETWORKS.find(n => n.value === network);
  const selectedSort = SORT_OPTIONS.find(s => s.value === sortBy);
  const selectedCurrency = ["USD", "EUR", "GBP", "ETH", "BTC"].find(c => c === currency);

  return (
    <div className="flex flex-col gap-16">

      {/* ── 1. Trigger Sizes ──────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)]">
          Trigger Sizes
        </h3>
        <div className="flex flex-col gap-4 max-w-xs">
          {(["sm", "md", "lg"] as const).map((size) => (
            <Dropdown key={size}>
              <DropdownTrigger size={size} placeholder={`${size.toUpperCase()} — Select option`} />
              <DropdownMenu>
                <DropdownItem>Option A</DropdownItem>
                <DropdownItem>Option B</DropdownItem>
                <DropdownItem>Option C</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ))}
        </div>
      </div>

      {/* ── 2. Trigger States ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)]">
          Trigger States
        </h3>
        <div className="grid grid-cols-2 gap-4 max-w-lg">
          {(["default", "error", "warning", "success"] as const).map((state) => (
            <Dropdown key={state} label={state.charAt(0).toUpperCase() + state.slice(1)} state={state}>
              <DropdownTrigger state={state} placeholder="Select…" />
              <DropdownMenu>
                <DropdownItem>Option A</DropdownItem>
                <DropdownItem>Option B</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ))}
          <Dropdown label="Disabled">
            <DropdownTrigger disabled placeholder="Select…" />
            <DropdownMenu>
              <DropdownItem>Option A</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      {/* ── 3. Label Variations ───────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)]">
          Label Variations
        </h3>
        <div className="grid grid-cols-3 gap-4 px-8 py-8 rounded-3xl border border-white/[0.04] bg-[var(--color-surface-sunken)]/40">
          <Dropdown label="Wallet Network" required>
            <DropdownTrigger placeholder="Select network" />
            <DropdownMenu>
              <DropdownItem>Ethereum</DropdownItem>
              <DropdownItem>Solana</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Dropdown label="Display Currency" optional>
            <DropdownTrigger placeholder="Select currency" />
            <DropdownMenu>
              <DropdownItem>USD</DropdownItem>
              <DropdownItem>EUR</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Dropdown>
            <DropdownTrigger placeholder="No label — placeholder only" />
            <DropdownMenu>
              <DropdownItem>Option A</DropdownItem>
              <DropdownItem>Option B</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      {/* ── 4. Trigger — Leading Icon ─────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)]">
          Trigger — Leading Icon
        </h3>
        <p className="text-xs text-[var(--color-text-muted)] -mt-3">
          The <code className="font-mono text-[var(--color-text-primary)]">leadingIcon</code> prop accepts any React node. Typically mirrors the selected item&apos;s icon for richer selection feedback.
        </p>
        <div className="grid grid-cols-3 gap-6 px-8 py-8 rounded-3xl border border-white/[0.04] bg-[var(--color-surface-sunken)]/40">

          {/* Static icon — always shown regardless of selection */}
          <Dropdown label="Static icon">
            <DropdownTrigger
              leadingIcon={<RiBarChartLine className="w-full h-full" />}
              label={selectedSort?.label}
              placeholder="Sort by…"
            />
            <DropdownMenu>
              {SORT_OPTIONS.map((s) => (
                <DropdownItem key={s.value} selected={sortBy === s.value} onSelect={() => setSortBy(s.value)}>
                  {s.label}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          {/* Icon mirrors selected item */}
          <Dropdown label="Mirrors selected item">
            <DropdownTrigger
              leadingIcon={selectedNetwork?.icon}
              label={selectedNetwork?.label}
              placeholder="Select network"
            />
            <DropdownMenu>
              {NETWORKS.map((n) => (
                <DropdownItem key={n.value} icon={n.icon} selected={network === n.value} onSelect={() => setNetwork(n.value)}>
                  {n.label}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          {/* sm size with icon */}
          <Dropdown label="sm — with icon" size="sm">
            <DropdownTrigger
              leadingIcon={<RiWalletLine className="w-full h-full" />}
              placeholder="Select wallet…"
            />
            <DropdownMenu>
              <DropdownItem icon={<RiWalletLine />}>MetaMask</DropdownItem>
              <DropdownItem icon={<RiWallet3Line />}>Phantom</DropdownItem>
              <DropdownItem icon={<RiKeyLine />}>Ledger</DropdownItem>
            </DropdownMenu>
          </Dropdown>

        </div>
      </div>

      {/* ── 5. Item Anatomy ───────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)]">
          Item Anatomy
        </h3>
        <div className="grid grid-cols-[1fr_1fr] gap-6">
          {/* Left: Live menu (open by default) */}
          <Dropdown defaultOpen>
            <DropdownTrigger label="Open menu" />
            <DropdownMenu>
              <DropdownLabel>Assets</DropdownLabel>
              <DropdownItem icon={<RiWalletLine />} shortcut="⌘W">My Wallets</DropdownItem>
              <DropdownItem icon={<RiExchangeLine />} selected>Transactions</DropdownItem>
              <DropdownItem icon={<RiBarChartLine />} description="Portfolio breakdown by token">Assets</DropdownItem>
              <DropdownItem icon={<RiLockLine />} disabled>Staking (soon)</DropdownItem>
              <DropdownSeparator />
              <DropdownLabel>Danger Zone</DropdownLabel>
              <DropdownItem variant="danger" icon={<RiDeleteBinLine />}>Delete Wallet</DropdownItem>
            </DropdownMenu>
          </Dropdown>

          {/* Right: Feature matrix */}
          <div className="flex flex-col gap-0 py-2 px-4 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-sunken)]">
            {[
              { label: "Leading icon", desc: "16px icon — sets item colour via variant" },
              { label: "Shortcut", desc: "Trailing kbd label (⌘K style)" },
              { label: "Trailing icon", desc: "trailingIcon — links, external nav" },
              { label: "Selected", desc: "Tint bg + trailing checkmark" },
              { label: "Multi-select", desc: "checkStyle=\"checkbox\" — always-visible trailing checkbox" },
              { label: "Description", desc: "Muted secondary line below label" },
              { label: "Disabled", desc: "opacity-40, pointer-events-none" },
              { label: "Separator", desc: "Subtle horizontal rule" },
              { label: "Group label", desc: "Section header, non-interactive" },
            ].map(({ label, desc }) => (
              <div key={label} className="flex items-center gap-3 py-1.5 border-b border-[var(--color-border-subtle)] last:border-0">
                <span className="w-28 shrink-0 text-xs font-medium text-[var(--color-text-primary)]">{label}</span>
                <span className="text-xs text-[var(--color-text-muted)]">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 6. Item Slot Combinations ─────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)]">
          Item Slot Combinations
        </h3>
        <p className="text-xs text-[var(--color-text-muted)] -mt-3">
          Every possible leading + trailing slot configuration. Open each dropdown to inspect.
        </p>
        <div className="flex flex-wrap gap-4">

          {/* Plain text */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-disabled)]">Plain</span>
            <Dropdown>
              <DropdownTrigger placeholder="Text only" className="min-w-[172px]" />
              <DropdownMenu>
                <DropdownItem>Send</DropdownItem>
                <DropdownItem>Receive</DropdownItem>
                <DropdownItem>Swap</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>

          {/* Leading icon */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-disabled)]">Leading icon</span>
            <Dropdown>
              <DropdownTrigger placeholder="With icons" className="min-w-[172px]" />
              <DropdownMenu>
                <DropdownItem icon={<RiSendPlaneLine />}>Send</DropdownItem>
                <DropdownItem icon={<RiDownloadLine />}>Receive</DropdownItem>
                <DropdownItem icon={<RiExpandDiagonalLine />}>Swap</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>

          {/* Shortcut */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-disabled)]">Shortcut</span>
            <Dropdown>
              <DropdownTrigger placeholder="With shortcuts" className="min-w-[172px]" />
              <DropdownMenu>
                <DropdownItem icon={<RiEditLine />} shortcut="⌘E">Edit</DropdownItem>
                <DropdownItem icon={<RiFileCopyLine />} shortcut="⌘D">Duplicate</DropdownItem>
                <DropdownItem icon={<RiShareLine />} shortcut="⌘⇧S">Share</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>

          {/* Trailing icon (trailingIcon prop) */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-disabled)]">Trailing icon</span>
            <Dropdown>
              <DropdownTrigger placeholder="Trailing icons" className="min-w-[172px]" />
              <DropdownMenu>
                <DropdownItem icon={<RiLinksLine />} trailingIcon={<RiExternalLinkLine />}>Block Explorer</DropdownItem>
                <DropdownItem icon={<RiQrCodeLine />} trailingIcon={<RiExternalLinkLine />}>View Address</DropdownItem>
                <DropdownItem icon={<RiCodeLine />} trailingIcon={<RiExternalLinkLine />}>Dev Docs</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>

          {/* Selected (check) */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-disabled)]">Selected</span>
            <Dropdown>
              <DropdownTrigger placeholder="Selected item" className="min-w-[172px]" />
              <DropdownMenu>
                <DropdownItem icon={<RiLineChartLine />}>Line</DropdownItem>
                <DropdownItem icon={<RiBarChartLine />} selected>Bar (active)</DropdownItem>
                <DropdownItem icon={<RiPieChartLine />}>Pie</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>

          {/* Disabled items */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-disabled)]">Disabled</span>
            <Dropdown>
              <DropdownTrigger placeholder="With disabled" className="min-w-[172px]" />
              <DropdownMenu>
                <DropdownItem icon={<RiCheckboxCircleLine />}>Active</DropdownItem>
                <DropdownItem icon={<RiTimeLine />} disabled>Pending (locked)</DropdownItem>
                <DropdownItem icon={<RiLockLine />} disabled>Staking (soon)</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>

        </div>
      </div>

      {/* ── 7. Item Descriptions ──────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)]">
          Item Descriptions
        </h3>
        <p className="text-xs text-[var(--color-text-muted)] -mt-3">
          Secondary descriptive text rendered below the item label — composable with all other slots.
        </p>
        <div className="flex flex-wrap gap-4">

          {/* Description only */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-disabled)]">Text + desc</span>
            <Dropdown>
              <DropdownTrigger placeholder="Descriptions" className="min-w-[200px]" />
              <DropdownMenu minWidth={220}>
                <DropdownItem description="Receive funds from any wallet">Deposit</DropdownItem>
                <DropdownItem description="Move to external address">Withdraw</DropdownItem>
                <DropdownItem description="Exchange between tokens">Swap</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>

          {/* Icon + description */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-disabled)]">Icon + desc</span>
            <Dropdown>
              <DropdownTrigger placeholder="Icon + desc" className="min-w-[200px]" />
              <DropdownMenu minWidth={240}>
                <DropdownItem icon={<RiShieldCheckLine />} description="2FA and biometric unlock">Security</DropdownItem>
                <DropdownItem icon={<RiBellLine />} description="Price alerts and activity">Notifications</DropdownItem>
                <DropdownItem icon={<RiGlobalLine />} description="Language and region">Localization</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>

          {/* Icon + description + shortcut */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-disabled)]">Icon + desc + shortcut</span>
            <Dropdown>
              <DropdownTrigger placeholder="Full anatomy" className="min-w-[200px]" />
              <DropdownMenu minWidth={260}>
                <DropdownItem icon={<RiSendPlaneLine />} description="Send to saved contacts" shortcut="⌘S">Send</DropdownItem>
                <DropdownItem icon={<RiDownloadLine />} description="Generate deposit address" shortcut="⌘D">Deposit</DropdownItem>
                <DropdownItem icon={<RiExpandDiagonalLine />} description="Cross-chain bridge" shortcut="⌘B">Bridge</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>

          {/* Description + selected */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-disabled)]">Icon + desc + selected</span>
            <Dropdown>
              <DropdownTrigger placeholder="Selected + desc" className="min-w-[200px]" />
              <DropdownMenu minWidth={240}>
                <DropdownItem icon={<RiDatabase2Line />} description="High throughput, low fees">Solana</DropdownItem>
                <DropdownItem icon={<RiServerLine />} description="EVM compatible, established" selected>Ethereum</DropdownItem>
                <DropdownItem icon={<RiCoinsLine />} description="Bitcoin-native ecosystem">Stacks</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>

        </div>
      </div>

      {/* ── 8. Item Variants ──────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)]">
          Item Variants
        </h3>
        <p className="text-xs text-[var(--color-text-muted)] -mt-3">
          Each variant applies to the item&apos;s text, icon, hover tint, and selected check colour independently.
        </p>
        <div className="flex gap-4 flex-wrap">
          {(["default", "danger", "warning", "success"] as const).map((v) => (
            <Dropdown key={v}>
              <DropdownTrigger
                label={v.charAt(0).toUpperCase() + v.slice(1)}
                className="min-w-[160px]"
              />
              <DropdownMenu>
                <DropdownItem variant={v}>Plain</DropdownItem>
                <DropdownItem variant={v} icon={<RiEditLine />}>With icon</DropdownItem>
                <DropdownItem variant={v} shortcut="⌘↵">With shortcut</DropdownItem>
                <DropdownItem variant={v} icon={<RiCheckboxCircleLine />} selected>Selected</DropdownItem>
                <DropdownItem variant={v} disabled>Disabled</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ))}
        </div>
      </div>

      {/* ── 9. Grouped Sections ───────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)]">
          Grouped Sections
        </h3>
        <p className="text-xs text-[var(--color-text-muted)] -mt-3">
          <code className="font-mono text-[var(--color-text-primary)]">DropdownLabel</code> and <code className="font-mono text-[var(--color-text-primary)]">DropdownSeparator</code> divide items into named sections.
        </p>
        <div className="flex flex-wrap gap-4">

          {/* Single group */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-disabled)]">Single group</span>
            <Dropdown>
              <DropdownTrigger placeholder="One section" className="min-w-[180px]" />
              <DropdownMenu>
                <DropdownLabel>Wallet Actions</DropdownLabel>
                <DropdownItem icon={<RiSendPlaneLine />} shortcut="⌘S">Send</DropdownItem>
                <DropdownItem icon={<RiDownloadLine />} shortcut="⌘D">Deposit</DropdownItem>
                <DropdownItem icon={<RiExpandDiagonalLine />} shortcut="⌘B">Swap</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>

          {/* Multiple groups */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-disabled)]">Multiple groups</span>
            <Dropdown>
              <DropdownTrigger placeholder="Two sections" className="min-w-[180px]" />
              <DropdownMenu>
                <DropdownLabel>Assets</DropdownLabel>
                <DropdownItem icon={<RiWalletLine />}>Wallets</DropdownItem>
                <DropdownItem icon={<RiBarChartLine />}>Portfolio</DropdownItem>
                <DropdownSeparator />
                <DropdownLabel>Settings</DropdownLabel>
                <DropdownItem icon={<RiSettings2Line />}>Preferences</DropdownItem>
                <DropdownItem icon={<RiShieldCheckLine />}>Security</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>

          {/* Separator only (no labels) */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-disabled)]">Separator only</span>
            <Dropdown>
              <DropdownTrigger placeholder="Separator" className="min-w-[180px]" />
              <DropdownMenu>
                <DropdownItem icon={<RiEditLine />}>Edit</DropdownItem>
                <DropdownItem icon={<RiFileCopyLine />}>Duplicate</DropdownItem>
                <DropdownItem icon={<RiShareLine />}>Share</DropdownItem>
                <DropdownSeparator />
                <DropdownItem variant="danger" icon={<RiDeleteBinLine />}>Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>

          {/* Mixed: label + separator + danger footer */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-disabled)]">Label + separator + danger</span>
            <Dropdown>
              <DropdownTrigger placeholder="Full structure" className="min-w-[180px]" />
              <DropdownMenu>
                <DropdownLabel>Account</DropdownLabel>
                <DropdownItem icon={<RiUserLine />}>Profile</DropdownItem>
                <DropdownItem icon={<RiBellLine />}>Notifications</DropdownItem>
                <DropdownSeparator />
                <DropdownLabel>Danger Zone</DropdownLabel>
                <DropdownItem icon={<RiLockLine />} variant="warning">Freeze Wallet</DropdownItem>
                <DropdownItem icon={<RiDeleteBinLine />} variant="danger">Delete Account</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>

        </div>
      </div>

      {/* ── 10. Menu Alignment ────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)]">
          Menu Alignment
        </h3>
        <p className="text-xs text-[var(--color-text-muted)] -mt-3">
          The <code className="font-mono text-[var(--color-text-primary)]">align</code> prop on <code className="font-mono text-[var(--color-text-primary)]">DropdownMenu</code> controls how the panel aligns relative to the trigger edge.
        </p>
        <div className="grid grid-cols-3 gap-4">
          {(["start", "center", "end"] as const).map((align) => (
            <div key={align} className="flex flex-col gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-disabled)]">
                align=&quot;{align}&quot;
              </span>
              <Dropdown>
                <DropdownTrigger placeholder={`align="${align}"`} />
                <DropdownMenu align={align} minWidth={200}>
                  <DropdownItem icon={<RiCheckboxCircleLine />}>Confirmed</DropdownItem>
                  <DropdownItem icon={<RiTimeLine />}>Pending</DropdownItem>
                  <DropdownItem icon={<RiCloseCircleLine />}>Failed</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          ))}
        </div>
      </div>

      {/* ── 11. Sizes — Full Anatomy ──────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)]">
          Sizes — Full Anatomy
        </h3>
        <p className="text-xs text-[var(--color-text-muted)] -mt-3">
          <code className="font-mono text-[var(--color-text-primary)]">size</code> flows from the root <code className="font-mono text-[var(--color-text-primary)]">Dropdown</code> to both trigger and items — text, icon, and height all scale together.
        </p>
        <div className="grid grid-cols-3 gap-6">
          {(["sm", "md", "lg"] as const).map((size) => (
            <div key={size} className="flex flex-col gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-disabled)]">size=&quot;{size}&quot;</span>
              <Dropdown size={size} defaultOpen>
                <DropdownTrigger placeholder={`${size.toUpperCase()} trigger`} />
                <DropdownMenu>
                  <DropdownLabel>Wallet</DropdownLabel>
                  <DropdownItem icon={<RiWalletLine />} shortcut="⌘W">My Wallets</DropdownItem>
                  <DropdownItem icon={<RiExchangeLine />} selected>Transactions</DropdownItem>
                  <DropdownItem icon={<RiBarChartLine />} description="By token">Assets</DropdownItem>
                  <DropdownItem icon={<RiLockLine />} disabled>Staking (soon)</DropdownItem>
                  <DropdownSeparator />
                  <DropdownItem variant="danger" icon={<RiDeleteBinLine />}>Delete</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          ))}
        </div>
      </div>

      {/* ── 12. Button Triggers ───────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)]">
          Button Triggers (asChild)
        </h3>
        <p className="text-xs text-[var(--color-text-muted)] -mt-3">
          Pass any element as the single child of <code className="font-mono text-[var(--color-text-primary)]">DropdownTrigger</code> to use it as the trigger — ARIA attributes and click handling are injected automatically.
        </p>
        <div className="flex flex-wrap items-center gap-4">

          {/* IconButton */}
          <div className="flex flex-col gap-2 items-start">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-disabled)]">IconButton</span>
            <Dropdown>
              <DropdownTrigger>
                <IconButton icon={<RiMore2Line />} appearance="ghost" variant="neutral" aria-label="More actions" />
              </DropdownTrigger>
              <DropdownMenu align="end" minWidth={180}>
                <DropdownItem icon={<RiEditLine />}>Edit</DropdownItem>
                <DropdownItem icon={<RiFileCopyLine />}>Duplicate</DropdownItem>
                <DropdownItem icon={<RiShareLine />}>Share</DropdownItem>
                <DropdownSeparator />
                <DropdownItem variant="danger" icon={<RiDeleteBinLine />}>Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>

          {/* Filled button */}
          <div className="flex flex-col gap-2 items-start">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-disabled)]">Filled</span>
            <Dropdown>
              <DropdownTrigger>
                <Button appearance="filled" variant="brand" trailingIcon={<RiArrowDownLine />}>Actions</Button>
              </DropdownTrigger>
              <DropdownMenu minWidth={200}>
                <DropdownItem icon={<RiSendPlaneLine />} shortcut="⌘S">Send</DropdownItem>
                <DropdownItem icon={<RiDownloadLine />} shortcut="⌘D">Deposit</DropdownItem>
                <DropdownItem icon={<RiExpandDiagonalLine />}>Swap</DropdownItem>
                <DropdownSeparator />
                <DropdownItem icon={<RiQrCodeLine />}>Show Address</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>

          {/* Tonal button */}
          <div className="flex flex-col gap-2 items-start">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-disabled)]">Tonal</span>
            <Dropdown>
              <DropdownTrigger>
                <Button appearance="tonal" variant="neutral" trailingIcon={<RiArrowDownLine />}>Filter</Button>
              </DropdownTrigger>
              <DropdownMenu minWidth={180}>
                <DropdownLabel>Status</DropdownLabel>
                <DropdownItem icon={<RiCheckboxCircleLine />}>Confirmed</DropdownItem>
                <DropdownItem icon={<RiTimeLine />}>Pending</DropdownItem>
                <DropdownItem icon={<RiCloseCircleLine />}>Failed</DropdownItem>
                <DropdownSeparator />
                <DropdownLabel>Type</DropdownLabel>
                <DropdownItem>Send</DropdownItem>
                <DropdownItem>Receive</DropdownItem>
                <DropdownItem>Swap</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>

          {/* Ghost button */}
          <div className="flex flex-col gap-2 items-start">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-disabled)]">Ghost</span>
            <Dropdown>
              <DropdownTrigger>
                <Button appearance="ghost" variant="neutral" trailingIcon={<RiArrowDownLine />} leadingIcon={<RiSettingsLine />}>
                  Settings
                </Button>
              </DropdownTrigger>
              <DropdownMenu minWidth={200}>
                <DropdownItem icon={<RiSettings2Line />}>Preferences</DropdownItem>
                <DropdownItem icon={<RiShieldCheckLine />}>Security</DropdownItem>
                <DropdownItem icon={<RiBellLine />}>Notifications</DropdownItem>
                <DropdownSeparator />
                <DropdownItem icon={<RiLoginBoxLine />} variant="danger">Sign Out</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>

        </div>
      </div>

      {/* ── 13. Multi-select ──────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)]">
          Multi-select (checkStyle=&quot;checkbox&quot;)
        </h3>
        <p className="text-xs text-[var(--color-text-muted)] -mt-3">
          Checkbox is in the <strong className="text-[var(--color-text-primary)] font-medium">trailing</strong> slot — always visible so users can see all selectable items at a glance.
          Adjacent selections merge into a connected pill. Menu stays open on select.
        </p>
        <div className="grid grid-cols-2 gap-6 px-8 py-8 rounded-3xl border border-white/[0.04] bg-[var(--color-surface-sunken)]/40">

          {/* Text only */}
          <div className="flex flex-col gap-3">
            <span className="text-xs text-[var(--color-text-muted)]">Text only</span>
            <Dropdown label="Transaction type">
              <DropdownTrigger
                label={txTypes.length ? `${txTypes.length} type${txTypes.length > 1 ? "s" : ""}` : undefined}
                placeholder="Filter types…"
              />
              <DropdownMenu>
                {TX_TYPES.map(t => (
                  <DropdownItem
                    key={t.value}
                    checkStyle="checkbox"
                    selected={txTypes.includes(t.value)}
                    onSelect={() => toggleTxType(t.value)}
                  >
                    {t.label}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            {/* Chips with adjacent-merge animation */}
            {(() => {
              const sorted = TX_TYPES.filter(t => txTypes.includes(t.value));
              return (
                <div className="flex flex-wrap items-center gap-0 min-h-[22px]">
                  {sorted.length === 0 ? (
                    <span className="text-xs text-[var(--color-text-disabled)]">None selected</span>
                  ) : (
                    <AnimatePresence mode="popLayout" initial={false}>
                      {sorted.map((t, i) => {
                        const ci = TX_TYPES.findIndex(x => x.value === t.value);
                        const pi = i > 0 ? TX_TYPES.findIndex(x => x.value === sorted[i - 1].value) : -2;
                        const ni = i < sorted.length - 1 ? TX_TYPES.findIndex(x => x.value === sorted[i + 1].value) : -2;
                        const mL = pi === ci - 1;
                        const mR = ni === ci + 1;
                        return (
                          <motion.span
                            key={t.value}
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ type: "spring", stiffness: 500, damping: 36, mass: 0.6 }}
                            className={cn(
                              "inline-flex items-center bg-[var(--color-control-tint-brand)] px-2 py-1",
                              "text-xs font-medium text-[var(--color-text-brand)]",
                              mL ? "rounded-l-none" : "rounded-l",
                              mR ? "rounded-r-none" : "rounded-r",
                              mL ? "ml-[1px]" : i > 0 ? "ml-1.5" : "ml-0",
                            )}
                          >
                            {t.label}
                          </motion.span>
                        );
                      })}
                    </AnimatePresence>
                  )}
                </div>
              );
            })()}
          </div>

          {/* With leading icons */}
          <div className="flex flex-col gap-3">
            <span className="text-xs text-[var(--color-text-muted)]">With leading icons</span>
            <Dropdown label="Networks">
              <DropdownTrigger
                label={selectedNets.length ? `${selectedNets.length} network${selectedNets.length > 1 ? "s" : ""}` : undefined}
                placeholder="Select networks…"
              />
              <DropdownMenu>
                {NETWORKS.map(n => (
                  <DropdownItem
                    key={n.value}
                    icon={n.icon}
                    checkStyle="checkbox"
                    selected={selectedNets.includes(n.value)}
                    onSelect={() => toggleNet(n.value)}
                  >
                    {n.label}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            {/* Chips with adjacent-merge animation */}
            {(() => {
              const sorted = NETWORKS.filter(n => selectedNets.includes(n.value));
              return (
                <div className="flex flex-wrap items-center gap-0 min-h-[22px]">
                  {sorted.length === 0 ? (
                    <span className="text-xs text-[var(--color-text-disabled)]">None selected</span>
                  ) : (
                    <AnimatePresence mode="popLayout" initial={false}>
                      {sorted.map((n, i) => {
                        const ci = NETWORKS.findIndex(x => x.value === n.value);
                        const pi = i > 0 ? NETWORKS.findIndex(x => x.value === sorted[i - 1].value) : -2;
                        const ni = i < sorted.length - 1 ? NETWORKS.findIndex(x => x.value === sorted[i + 1].value) : -2;
                        const mL = pi === ci - 1;
                        const mR = ni === ci + 1;
                        return (
                          <motion.span
                            key={n.value}
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ type: "spring", stiffness: 500, damping: 36, mass: 0.6 }}
                            className={cn(
                              "inline-flex items-center bg-[var(--color-control-tint-brand)] px-2 py-1",
                              "text-xs font-medium text-[var(--color-text-brand)]",
                              mL ? "rounded-l-none" : "rounded-l",
                              mR ? "rounded-r-none" : "rounded-r",
                              mL ? "ml-[1px]" : i > 0 ? "ml-1.5" : "ml-0",
                            )}
                          >
                            {n.label}
                          </motion.span>
                        );
                      })}
                    </AnimatePresence>
                  )}
                </div>
              );
            })()}
          </div>

        </div>
      </div>

      {/* ── 14. Controlled Open ───────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)]">
          Controlled Open
        </h3>
        <p className="text-xs text-[var(--color-text-muted)] -mt-3">
          Pass <code className="font-mono text-[var(--color-text-primary)]">open</code> + <code className="font-mono text-[var(--color-text-primary)]">onOpenChange</code> to control open state from the parent — useful for programmatic triggers and confirmation flows.
        </p>
        <div className="flex items-end gap-4">
          <Dropdown
            label="Controlled dropdown"
            open={controlledOpen}
            onOpenChange={setControlledOpen}
            ignoredRefs={[externalTriggerRef]}
          >
            <DropdownTrigger placeholder="Externally controlled…" />
            <DropdownMenu minWidth={200}>
              <DropdownItem icon={<RiCheckboxCircleLine />} onSelect={() => setControlledOpen(false)}>
                Confirm action
              </DropdownItem>
              <DropdownItem icon={<RiCloseLine />} onSelect={() => setControlledOpen(false)}>
                Cancel
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Button
            ref={externalTriggerRef}
            appearance="tonal"
            variant={controlledOpen ? "danger" : "brand"}
            onClick={() => setControlledOpen(!controlledOpen)}
          >
            {controlledOpen ? "Close" : "Open"} externally
          </Button>
          <span className={cn(
            "self-center text-xs font-mono px-2 py-1 rounded-md",
            controlledOpen
              ? "bg-[var(--color-control-tint-brand)] text-[var(--color-text-brand)]"
              : "bg-[var(--color-surface-sunken)] text-[var(--color-text-muted)]",
          )}>
            open={controlledOpen ? "true" : "false"}
          </span>
        </div>
      </div>

      {/* ── 16. Search ────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)]">
          Search
        </h3>
        <p className="text-xs text-[var(--color-text-muted)] -mt-3">
          <code className="font-mono text-[var(--color-text-primary)]">DropdownSearch</code> renders a sticky search input at the top of the menu.
          Parent filters the item list — keeps the component stateless and composable.
        </p>
        <div className="grid grid-cols-2 gap-6 px-8 py-8 rounded-3xl border border-white/[0.04] bg-[var(--color-surface-sunken)]/40">

          {/* Single-select with search */}
          <div className="flex flex-col gap-3">
            <span className="text-xs text-[var(--color-text-muted)]">Single-select</span>
            <Dropdown label="Network">
              <DropdownTrigger
                label={NETWORKS.find(n => n.value === network)?.label}
                leadingIcon={NETWORKS.find(n => n.value === network)?.icon}
                placeholder="Select network…"
              />
              <DropdownMenu maxHeight={260}>
                <DropdownSearch value={searchQuery} onChange={setSearchQuery} placeholder="Search networks…" />
                {NETWORKS.filter(n => n.label.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 ? (
                  <div className="px-3.5 py-4 text-center text-xs text-[var(--color-text-muted)]">
                    No networks match &ldquo;{searchQuery}&rdquo;
                  </div>
                ) : (
                  NETWORKS
                    .filter(n => n.label.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(n => (
                      <DropdownItem
                        key={n.value}
                        icon={n.icon}
                        selected={network === n.value}
                        onSelect={() => { setNetwork(n.value); setSearchQuery(""); }}
                      >
                        {n.label}
                      </DropdownItem>
                    ))
                )}
              </DropdownMenu>
            </Dropdown>
          </div>

          {/* Multi-select with search */}
          <div className="flex flex-col gap-3">
            <span className="text-xs text-[var(--color-text-muted)]">Multi-select</span>
            <Dropdown label="Networks">
              <DropdownTrigger
                label={searchSelected.length ? `${searchSelected.length} selected` : undefined}
                placeholder="Select networks…"
              />
              <DropdownMenu maxHeight={260}>
                <DropdownSearch value={searchQuery} onChange={setSearchQuery} placeholder="Search networks…" />
                {NETWORKS.filter(n => n.label.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 ? (
                  <div className="px-3.5 py-4 text-center text-xs text-[var(--color-text-muted)]">
                    No networks match &ldquo;{searchQuery}&rdquo;
                  </div>
                ) : (
                  NETWORKS
                    .filter(n => n.label.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(n => (
                      <DropdownItem
                        key={n.value}
                        icon={n.icon}
                        checkStyle="checkbox"
                        selected={searchSelected.includes(n.value)}
                        onSelect={() => toggleSearchSel(n.value)}
                      >
                        {n.label}
                      </DropdownItem>
                    ))
                )}
              </DropdownMenu>
            </Dropdown>
          </div>

        </div>
      </div>

      {/* ── 17. Search + Create New ───────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)]">
          Search + Create New
        </h3>
        <p className="text-xs text-[var(--color-text-muted)] -mt-3">
          <code className="font-mono text-[var(--color-text-primary)]">DropdownCreateNew</code> appends a sticky &ldquo;Create&rdquo; action below the filtered list.
          Shows when no items match the query — or always for free-text creation.
        </p>
        <div className="grid grid-cols-2 gap-6 px-8 py-8 rounded-3xl border border-white/[0.04] bg-[var(--color-surface-sunken)]/40">

          {/* Always-visible create */}
          <div className="flex flex-col gap-3">
            <span className="text-xs text-[var(--color-text-muted)]">Always visible create</span>
            <Dropdown label="Wallet tag">
              <DropdownTrigger placeholder="Add tag…" />
              <DropdownMenu maxHeight={280}>
                <DropdownSearch value={searchCreateQuery} onChange={setSearchCreateQuery} placeholder="Search or create…" />
                {["DeFi", "NFT", "CEX", "Long-term", "Staking"].filter(t =>
                  t.toLowerCase().includes(searchCreateQuery.toLowerCase())
                ).map(tag => (
                  <DropdownItem key={tag}>{tag}</DropdownItem>
                ))}
                {searchCreateQuery.trim() && (
                  <DropdownCreateNew
                    label={searchCreateQuery.trim()}
                    onAction={() => setSearchCreateQuery("")}
                  />
                )}
              </DropdownMenu>
            </Dropdown>
          </div>

          {/* Create only when no match */}
          <div className="flex flex-col gap-3">
            <span className="text-xs text-[var(--color-text-muted)]">Create on no-match only</span>
            <Dropdown label="Chain label">
              <DropdownTrigger placeholder="Add label…" />
              <DropdownMenu maxHeight={280}>
                <DropdownSearch value={searchCreateQuery} onChange={setSearchCreateQuery} placeholder="Search labels…" />
                {(() => {
                  const tags = ["Mainnet", "Testnet", "Layer 2", "Sidechain", "Rollup"];
                  const match = tags.filter(t => t.toLowerCase().includes(searchCreateQuery.toLowerCase()));
                  return match.length > 0 ? (
                    match.map(tag => <DropdownItem key={tag}>{tag}</DropdownItem>)
                  ) : (
                    <>
                      <div className="px-3.5 py-3 text-center text-xs text-[var(--color-text-muted)]">
                        No match for &ldquo;{searchCreateQuery}&rdquo;
                      </div>
                      <DropdownCreateNew
                        label={searchCreateQuery}
                        onAction={() => setSearchCreateQuery("")}
                      />
                    </>
                  );
                })()}
              </DropdownMenu>
            </Dropdown>
          </div>

        </div>
      </div>

      {/* ── 15. Real-world Examples ───────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)]">
          Real-world Examples
        </h3>
        <div className="grid grid-cols-3 gap-6 px-8 py-8 rounded-3xl border border-white/[0.04] bg-[var(--color-surface-sunken)]/40">

          {/* Network selector */}
          <Dropdown label="Network">
            <DropdownTrigger
              label={selectedNetwork?.label}
              placeholder="Select network"
              leadingIcon={selectedNetwork?.icon}
            />
            <DropdownMenu>
              {NETWORKS.map((n) => (
                <DropdownItem key={n.value} icon={n.icon} selected={network === n.value} onSelect={() => setNetwork(n.value)}>
                  {n.label}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          {/* Sort dropdown */}
          <Dropdown label="Sort by">
            <DropdownTrigger
              label={selectedSort?.label}
              placeholder="Sort by…"
              leadingIcon={<RiArrowUpLine className="w-full h-full" />}
            />
            <DropdownMenu>
              {SORT_OPTIONS.map((s) => (
                <DropdownItem key={s.value} selected={sortBy === s.value} onSelect={() => setSortBy(s.value)}>
                  {s.label}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          {/* Currency selector */}
          <Dropdown label="Display currency">
            <DropdownTrigger label={selectedCurrency} placeholder="Currency" />
            <DropdownMenu>
              <DropdownLabel>Fiat</DropdownLabel>
              {["USD", "EUR", "GBP"].map((c) => (
                <DropdownItem key={c} selected={currency === c} onSelect={() => setCurrency(c)}>{c}</DropdownItem>
              ))}
              <DropdownSeparator />
              <DropdownLabel>Crypto</DropdownLabel>
              {["ETH", "BTC"].map((c) => (
                <DropdownItem key={c} selected={currency === c} onSelect={() => setCurrency(c)}>{c}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

        </div>
      </div>

    </div>
  );
}


// ---------------------------------------------------------------------------
// Avatars Section
// ---------------------------------------------------------------------------

const DEMO_PEOPLE: Array<{ name: string; role: string; preset: string }> = [
  { name: "Alex Chen", role: "Lead Designer", preset: "Cyan Dusk" },
  { name: "Sam Rivera", role: "Engineering Lead", preset: "Aurora" },
  { name: "Jordan Park", role: "Product Manager", preset: "Sunset" },
  { name: "Maya Patel", role: "Data Scientist", preset: "Emerald" },
  { name: "Chris Wu", role: "DevOps Engineer", preset: "Neon" },
  { name: "Taylor Kim", role: "UX Researcher", preset: "Rose Gold" },
  { name: "Riley Johnson", role: "Security Lead", preset: "Blood Moon" },
  { name: "Drew Santos", role: "Protocol Engineer", preset: "Deep Sea" },
];

const ALL_SIZES: AvatarSize[] = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl"];

function AvatarsSection() {
  return (
    <div className="flex flex-col gap-16">

      {/* ── Sizes ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)]">Sizes</h3>
        <div className="flex items-end gap-6 flex-wrap">
          {ALL_SIZES.map((size) => (
            <div key={size} className="flex flex-col items-center gap-3">
              <Avatar name="Alex Chen" size={size} preset="Cyan Dusk" />
              <span className="text-[10px] font-mono text-[var(--color-text-muted)] uppercase">{size}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── With name ──────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)]">With name</h3>
        <div className="flex flex-wrap gap-8 items-center">
          {(["sm", "md", "lg", "xl"] as AvatarSize[]).map((size, i) => (
            <Avatar
              key={size}
              name={DEMO_PEOPLE[i].name}
              preset={DEMO_PEOPLE[i].preset}
              size={size}
              displayName
            />
          ))}
        </div>
      </div>

      {/* ── With metadata ──────────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)]">With metadata</h3>
        <div className="grid grid-cols-2 gap-x-10 gap-y-5 max-w-xl">
          {DEMO_PEOPLE.map((p) => (
            <Avatar
              key={p.name}
              name={p.name}
              preset={p.preset}
              size="md"
              displayName
              metadata={p.role}
            />
          ))}
        </div>
      </div>

      {/* ── Group ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)]">Group</h3>
        <div className="flex flex-col gap-5">
          {(["xs", "sm", "md", "lg"] as AvatarSize[]).map((size) => (
            <div key={size} className="flex items-center gap-6">
              <span className="text-[10px] font-mono text-[var(--color-text-muted)] uppercase w-6 shrink-0">{size}</span>
              <AvatarGroup avatars={DEMO_PEOPLE} size={size} max={6} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Presets ────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)]">Presets</h3>
        <div className="flex flex-wrap gap-5">
          {DEMO_PEOPLE.map((p) => (
            <div key={p.preset} className="flex flex-col items-center gap-2">
              <Avatar name={p.name} size="lg" preset={p.preset} />
              <span className="text-[10px] font-mono text-[var(--color-text-muted)] text-center">{p.preset}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Forge ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)]">Forge</h3>
        <AvatarForge />
      </div>

    </div>
  );
}

// ---------------------------------------------------------------------------
// Tooltips Section
// ---------------------------------------------------------------------------

const PLACEMENT_GRID: TooltipPlacement[] = [
  "top-start", "top", "top-end",
  "right-start", "right", "right-end",
  "bottom-end", "bottom", "bottom-start",
  "left-end", "left", "left-start",
];

const TOUR_STEPS = [
  { title: "Welcome to Token", description: "A motion-first design system built for high-performance crypto interfaces." },
  { title: "Token-driven styling", description: "Every colour, spacing value, and shadow is referenced from a shared primitive token layer." },
  { title: "WebGL gradients", description: "Avatar and card surfaces use inverse-distance-weighted mesh gradients rendered via Canvas 2D." },
  { title: "Spring physics", description: "All transitions use Framer Motion spring configs tuned for feel — not just duration." },
];

function TourDemo() {
  const [step, setStep] = useState<number | null>(0);
  return (
    <div className="flex items-center gap-4">
      <Tooltip
        steps={TOUR_STEPS}
        currentStep={step ?? 0}
        placement="bottom"
        trigger="click"
        variant="brand"
        open={step !== null}
        onOpenChange={(v) => { if (!v) setStep(null); }}
        onNext={() => setStep((s) => Math.min((s ?? 0) + 1, TOUR_STEPS.length - 1))}
        onPrev={() => setStep((s) => Math.max((s ?? 0) - 1, 0))}
        onClose={() => setStep(null)}
      >
        <button
          onClick={() => setStep(0)}
          className="px-3 py-1.5 rounded-lg border border-[var(--color-border-default)] text-xs font-mono tracking-wider uppercase text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-strong)] transition-colors"
        >
          {step === null ? "Start tour" : `Step ${(step ?? 0) + 1} / ${TOUR_STEPS.length}`}
        </button>
      </Tooltip>
    </div>
  );
}

function TooltipsSection() {
  return (
    <div className="flex flex-col gap-16">

      {/* ── Label ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)]">Label</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Tooltip content="Saved to drafts">
            <button className="px-3 py-1.5 rounded-lg border border-[var(--color-border-default)] text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">Hover me</button>
          </Tooltip>
          <Tooltip content="Copy address" shortcut="⌘C">
            <button className="px-3 py-1.5 rounded-lg border border-[var(--color-border-default)] text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">With shortcut</button>
          </Tooltip>
          <Tooltip content="Open command palette" shortcut="⌘K">
            <button className="px-3 py-1.5 rounded-lg border border-[var(--color-border-default)] text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">⌘K shortcut</button>
          </Tooltip>
          <Tooltip content="Disabled — tooltip never shows" disabled>
            <button className="px-3 py-1.5 rounded-lg border border-[var(--color-border-subtle)] text-xs text-[var(--color-text-disabled)] cursor-not-allowed">Disabled</button>
          </Tooltip>
        </div>
      </div>

      {/* ── Rich ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)]">Rich</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Tooltip
            title="Transaction fee"
            description="Network fee paid to validators to process your transaction. Varies with congestion."
          >
            <button className="px-3 py-1.5 rounded-lg border border-[var(--color-border-default)] text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">Header + body</button>
          </Tooltip>
          <Tooltip
            title="Slippage tolerance"
            description="Maximum price movement you accept. Higher tolerance means faster execution but worse price."
          >
            <button className="px-3 py-1.5 rounded-lg border border-[var(--color-border-default)] text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">Longer description</button>
          </Tooltip>
          <Tooltip
            title="Smart contract"
            description="Verified on Etherscan. Audited by Trail of Bits — no critical issues found."
            variant="success"
          >
            <button className="px-3 py-1.5 rounded-lg border border-[var(--color-border-default)] text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">Success accent</button>
          </Tooltip>
          <Tooltip
            title="High gas price"
            description="Network is congested. Consider waiting for lower fees."
            variant="warning"
          >
            <button className="px-3 py-1.5 rounded-lg border border-[var(--color-border-default)] text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">Warning accent</button>
          </Tooltip>
          <Tooltip
            title="Contract unverified"
            description="Source code not verified. Interact with caution."
            variant="danger"
          >
            <button className="px-3 py-1.5 rounded-lg border border-[var(--color-border-default)] text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">Danger accent</button>
          </Tooltip>
        </div>
      </div>

      {/* ── With actions ───────────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)]">With actions</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Tooltip
            title="Connect wallet"
            description="Link your wallet to sign transactions and access all features."
            trigger="click"
            placement="bottom"
            actions={[
              { label: "Later", appearance: "outline", variant: "neutral" },
              { label: "Connect", appearance: "filled", variant: "brand" },
            ]}
          >
            <button className="px-3 py-1.5 rounded-lg border border-[var(--color-border-default)] text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">Click — actions</button>
          </Tooltip>
          <Tooltip
            title="New feature"
            description="You can now batch-sign multiple transactions in a single approval."
            trigger="click"
            placement="bottom"
            variant="brand"
            actions={[
              { label: "Got it", appearance: "filled", variant: "brand" },
            ]}
          >
            <button className="px-3 py-1.5 rounded-lg border border-[var(--color-border-brand)]/40 text-xs text-[var(--color-text-brand)] hover:bg-[var(--color-interactive-brand-default)]/10 transition-colors">What's new</button>
          </Tooltip>
        </div>
      </div>

      {/* ── Group (shared panel — moves between triggers) ───────────────── */}
      <div className="flex flex-col gap-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)]">Group — tooltip follows cursor</h3>
        <div className="flex flex-col gap-8">

          {/* 1. Editor toolbar — label + shortcut */}
          <div className="flex flex-col gap-3">
            <p className="text-2xs font-mono text-[var(--color-text-muted)] uppercase tracking-widest">Toolbar</p>
            <div className="w-fit p-4 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-surface)]">
              <TooltipGroup>
                <div className="inline-flex items-center gap-0.5 p-1 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-sunken)]">
                  {[
                    { icon: "B", label: "Bold", shortcut: "⌘ B", style: "font-bold" },
                    { icon: "I", label: "Italic", shortcut: "⌘ I", style: "italic" },
                    { icon: "U", label: "Underline", shortcut: "⌘ U", style: "underline" },
                    { icon: "S", label: "Strikethrough", shortcut: "⌘ ⇧ X", style: "line-through" },
                    { icon: "</>", label: "Code", shortcut: "⌘ E", style: "font-mono text-2xs" },
                    { icon: "∫", label: "Link", shortcut: "⌘ K", style: "" },
                  ].map(({ icon, label, shortcut, style }) => (
                    <Tooltip key={label} content={label} shortcut={shortcut} delay={200} placement="top">
                      <button className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)] transition-colors ${style}`}>
                        {icon}
                      </button>
                    </Tooltip>
                  ))}
                </div>
              </TooltipGroup>
            </div>
          </div>

          {/* 3. Asset row — mixed placements */}
          <div className="flex flex-col gap-2">
            <p className="text-2xs font-mono text-[var(--color-text-muted)] uppercase tracking-widest">Asset cards — placement top</p>
            <TooltipGroup>
              <div className="inline-flex items-center gap-2">
                {[
                  { ticker: "ETH", name: "Ethereum", change: "+2.4%", variant: "brand" as const },
                  { ticker: "BTC", name: "Bitcoin", change: "+1.1%", variant: "success" as const },
                  { ticker: "SOL", name: "Solana", change: "-0.8%", variant: "warning" as const },
                  { ticker: "USDC", name: "USD Coin", change: "+0.01%", variant: "default" as const },
                  { ticker: "ARB", name: "Arbitrum", change: "-1.6%", variant: "danger" as const },
                ].map(({ ticker, name, change, variant }) => (
                  <Tooltip
                    key={ticker}
                    title={name}
                    description={`24h change: ${change}`}
                    variant={variant}
                    delay={150}
                    placement="top"
                  >
                    <button className="px-3 py-2 rounded-lg border border-[var(--color-border-default)] text-xs font-mono font-medium text-[var(--color-text-primary)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-elevated)] transition-colors">
                      {ticker}
                    </button>
                  </Tooltip>
                ))}
              </div>
            </TooltipGroup>
          </div>

          {/* 4. Settings row — actions tooltips */}
          <div className="flex flex-col gap-2">
            <p className="text-2xs font-mono text-[var(--color-text-muted)] uppercase tracking-widest">Settings — with actions</p>
            <TooltipGroup>
              <div className="inline-flex items-center gap-2">
                {[
                  {
                    label: "Notifications",
                    title: "Push notifications",
                    description: "Receive alerts for price movements and order fills.",
                    actions: [
                      { label: "Dismiss", appearance: "outline" as const, variant: "neutral" as const },
                      { label: "Enable", appearance: "filled" as const, variant: "brand" as const },
                    ],
                  },
                  {
                    label: "2FA",
                    title: "Two-factor auth",
                    description: "Add an extra layer of security to your account.",
                    actions: [
                      { label: "Later", appearance: "outline" as const, variant: "neutral" as const },
                      { label: "Set up", appearance: "filled" as const, variant: "success" as const },
                    ],
                  },
                  {
                    label: "API Key",
                    title: "Revoke API key",
                    description: "This will immediately invalidate the selected key.",
                    actions: [
                      { label: "Cancel", appearance: "outline" as const, variant: "neutral" as const },
                      { label: "Revoke", appearance: "filled" as const, variant: "danger" as const },
                    ],
                  },
                ].map(({ label, title, description, actions }) => (
                  <Tooltip key={label} title={title} description={description} actions={actions} trigger="click" placement="bottom" delay={0}>
                    <button className="px-3 py-1.5 rounded-lg border border-[var(--color-border-default)] text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-strong)] transition-colors">
                      {label}
                    </button>
                  </Tooltip>
                ))}
              </div>
            </TooltipGroup>
          </div>

        </div>
      </div>

      {/* ── Tour ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)]">Tour</h3>
        <TourDemo />
      </div>

      {/* ── All placements ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)]">Placements</h3>
        <div className="grid grid-cols-3 gap-3 max-w-sm">
          {PLACEMENT_GRID.map((p) => (
            <Tooltip key={p} content={p} placement={p} delay={100}>
              <button className="w-full px-2 py-1.5 rounded-lg border border-[var(--color-border-default)] text-2xs font-mono text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-strong)] transition-colors">
                {p}
              </button>
            </Tooltip>
          ))}
        </div>
      </div>

      {/* ── Accent variants ────────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)]">Accent variants</h3>
        <div className="flex flex-wrap items-center gap-4">
          {(["default", "brand", "danger", "warning", "success"] as const).map((v) => (
            <Tooltip
              key={v}
              title={v.charAt(0).toUpperCase() + v.slice(1)}
              description={`${v} accent border on the tooltip panel.`}
              variant={v}
              placement="bottom"
            >
              <button className="px-3 py-1.5 rounded-lg border border-[var(--color-border-default)] text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors capitalize">{v}</button>
            </Tooltip>
          ))}
        </div>
      </div>

      {/* ── No arrow ───────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)]">No arrow</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Tooltip content="No arrow shown" showArrow={false}>
            <button className="px-3 py-1.5 rounded-lg border border-[var(--color-border-default)] text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">Label</button>
          </Tooltip>
          <Tooltip title="Rich tooltip" description="Arrow suppressed via showArrow={false}." showArrow={false} placement="bottom">
            <button className="px-3 py-1.5 rounded-lg border border-[var(--color-border-default)] text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">Rich</button>
          </Tooltip>
        </div>
      </div>

    </div>
  );
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function AtomsPage() {
  return (
    <DocsLayout currentLayer="/designsystem/atoms" items={NAV_ITEMS}>

      {/* ================================================================
          HERO
          ================================================================ */}
      <header className="relative min-h-[70vh] flex flex-col justify-center overflow-hidden border-b border-white/[0.03]">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] pointer-events-none opacity-20"
            style={{
              background: "radial-gradient(circle at center, rgba(38,201,201,0.15) 0%, transparent 70%)",
            }}
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
                The Gallery — Layer 4
              </span>
            </div>

            <div className="max-w-4xl">
              <h1 className="font-display text-5xl md:text-[5rem] font-bold tracking-tightest leading-[0.95] text-text-primary">
                Atoms <br />
                <span className="relative text-text-disabled italic">
                  Gallery
                </span>
              </h1>
            </div>

            <p className="text-lg md:text-xl text-text-secondary font-light leading-relaxed max-w-2xl">
              Foundation-level components built with specular highlights,
              mathematical spacing, and tactile response. These are the physical
              units that compose the Token platform.
            </p>
          </motion.div>
        </div>
      </header>


      {/* ================================================================
          CONTENT
          ================================================================ */}
      <div className="py-32 space-y-48">

        {/* ==============================================================
            01. TYPOGRAPHY
            ============================================================== */}
        <Section
          id="typography"
          num="01"
          title="Typography"
          subtitle="Pure typographic primitives. Styles are context-free — any combination can be applied to any element depending on the design context."
        >
          <div className="space-y-24">

            {/* --- Font Families --- */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <h3 className="font-mono text-[10px] tracking-[0.3em] text-text-muted uppercase">Font Families</h3>
                <div className="flex-1 h-px bg-border-subtle" />
                <span className="font-mono text-[9px] text-text-disabled">3 families</span>
              </div>
              <div className="rounded-3xl border border-white/[0.03] bg-surface-page/50 divide-y divide-white/[0.03] overflow-hidden">
                {FAMILY_SPECIMENS.map((s, idx) => (
                  <TokenRow key={s.token} token={s.token} meta={s.family} classes={s.classes} sample={s.sample} idx={idx} />
                ))}
              </div>
            </div>

            {/* --- Type Scale --- */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <h3 className="font-mono text-[10px] tracking-[0.3em] text-text-muted uppercase">Type Scale</h3>
                <div className="flex-1 h-px bg-border-subtle" />
                <span className="font-mono text-[9px] text-text-disabled">10 steps · 10px–26px</span>
              </div>
              <div className="rounded-3xl border border-white/[0.03] bg-surface-page/50 divide-y divide-white/[0.03] overflow-hidden">
                {SCALE_SPECIMENS.map((s, idx) => (
                  <TokenRow key={s.token} token={s.token} meta={s.size} classes={s.classes} sample={SAMPLE_SHORT} idx={idx} />
                ))}
              </div>
            </div>

            {/* --- Font Weights --- */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <h3 className="font-mono text-[10px] tracking-[0.3em] text-text-muted uppercase">Font Weights</h3>
                <div className="flex-1 h-px bg-border-subtle" />
                <span className="font-mono text-[9px] text-text-disabled">4 weights</span>
              </div>
              <div className="rounded-3xl border border-white/[0.03] bg-surface-page/50 divide-y divide-white/[0.03] overflow-hidden">
                {WEIGHT_SPECIMENS.map((s, idx) => (
                  <TokenRow key={s.token} token={s.token} meta={s.weight} classes={s.classes} sample={SAMPLE_TEXT} idx={idx} />
                ))}
              </div>
            </div>

            {/* --- Letter Spacing --- */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <h3 className="font-mono text-[10px] tracking-[0.3em] text-text-muted uppercase">Letter Spacing</h3>
                <div className="flex-1 h-px bg-border-subtle" />
                <span className="font-mono text-[9px] text-text-disabled">5 values</span>
              </div>
              <div className="rounded-3xl border border-white/[0.03] bg-surface-page/50 divide-y divide-white/[0.03] overflow-hidden">
                {TRACKING_SPECIMENS.map((s, idx) => (
                  <TokenRow key={s.token} token={s.token} meta={s.value} classes={s.classes} sample={SAMPLE_TEXT} idx={idx} />
                ))}
              </div>
            </div>

            {/* --- Text Colors --- */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <h3 className="font-mono text-[10px] tracking-[0.3em] text-text-muted uppercase">Text Colors</h3>
                <div className="flex-1 h-px bg-border-subtle" />
                <span className="font-mono text-[9px] text-text-disabled">9 semantic colors</span>
              </div>
              <div className="rounded-3xl border border-white/[0.03] bg-surface-page/50 divide-y divide-white/[0.03] overflow-hidden">
                {TEXT_COLOR_SPECIMENS.map((s, idx) => (
                  <div key={s.token}>
                    <TokenRow
                      token={s.token}
                      meta={`→ ${s.alias}`}
                      classes={cn(s.classes, s.token === "text-text-inverse" && "bg-surface-elevated rounded px-3 py-1 inline-block")}
                      sample={SAMPLE_SHORT}
                      idx={idx}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* --- Strikethrough --- */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <h3 className="font-mono text-[10px] tracking-[0.3em] text-text-muted uppercase">Strikethrough</h3>
                <div className="flex-1 h-px bg-border-subtle" />
                <span className="font-mono text-[9px] text-text-disabled">line-through · 5 sizes</span>
              </div>
              <div className="rounded-3xl border border-white/[0.03] bg-surface-page/50 divide-y divide-white/[0.03] overflow-hidden">
                {STRIKETHROUGH_SPECIMENS.map((s, idx) => (
                  <TokenRow key={s.token} token={s.token} classes={s.classes} sample={SAMPLE_SHORT} idx={idx} />
                ))}
              </div>
            </div>

            {/* --- Reference Summary --- */}
            <div className="p-10 rounded-3xl border border-white/[0.03] bg-surface-sunken/50">
              <h4 className="font-display text-xl font-bold text-text-primary mb-8">Typography Primitives Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
                {[
                  { label: "Families", val: "3", items: "General Sans · Geist · Geist Mono" },
                  { label: "Scale Steps", val: "10", items: "2xs (10px) → 4xl (26px)" },
                  { label: "Weights", val: "4", items: "400 · 500 · 600 · 700" },
                  { label: "Tracking", val: "5", items: "tightest · tight · normal · wide · widest" },
                  { label: "Colors", val: "9", items: "primary · secondary · muted · disabled · inverse · brand · danger · success · warning" },
                ].map((item) => (
                  <div key={item.label} className="space-y-3">
                    <div className="w-8 h-1 bg-interactive-brand-default/20 rounded-full" />
                    <span className="font-mono text-[9px] text-text-brand/60 uppercase tracking-widest block">{item.label}</span>
                    <h5 className="font-display text-3xl font-bold text-text-primary tracking-tightest">{item.val}</h5>
                    <p className="text-xs text-text-muted font-light leading-relaxed">{item.items}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* ==============================================================
            02. ICONOGRAPHY
            ============================================================== */}
        <Section
          id="iconography"
          num="02"
          title="Iconography"
          subtitle="Three-layer icon system: Remix Icons for interface elements, custom SVGs for blockchain networks, and CryptoFonts for token assets. Consistent sizing and semantic color mapping."
        >
          <div className="space-y-24">

            {/* --- Sources --- */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <h3 className="font-mono text-[10px] tracking-[0.3em] text-text-muted uppercase">Icon Sources</h3>
                <div className="flex-1 h-px bg-border-subtle" />
                <span className="font-mono text-[9px] text-text-disabled">3 layers</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    label: "Remix Icons",
                    role: "General Purpose",
                    desc: "2800+ open-source icons with line and fill variants. Used for all interface actions, navigation, and status indicators.",
                    link: "remixicon.com",
                    Icon: RiCodeLine,
                  },
                  {
                    label: "Custom SVGs",
                    role: "Blockchain Networks",
                    desc: "Hand-crafted network logos for Ethereum, Polygon, Arbitrum, etc. Sized to match the Remix icon grid.",
                    link: "Internal",
                    Icon: RiEarthLine,
                  },
                  {
                    label: "CryptoFonts",
                    role: "Crypto Assets",
                    desc: "1500+ SVG token logos via API. Designer-grade vector icons for all supported cryptocurrencies.",
                    link: "cryptofonts.com",
                    Icon: RiCoinsLine,
                  },
                ].map((source, idx) => (
                  <motion.div
                    key={source.label}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                    className="p-8 rounded-3xl border border-white/[0.03] bg-surface-page/50 hover:border-white/[0.06] transition-all group"
                  >
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-center group-hover:scale-110 transition-transform">
                        <source.Icon className="w-5 h-5 text-text-brand/60" />
                      </div>
                      <div>
                        <h4 className="font-display text-base font-semibold text-text-primary tracking-tight">{source.label}</h4>
                        <span className="font-mono text-[9px] text-text-brand/60 uppercase tracking-widest">{source.role}</span>
                      </div>
                    </div>
                    <p className="text-xs text-text-muted font-light leading-relaxed mb-4">{source.desc}</p>
                    <span className="font-mono text-[10px] text-text-disabled">{source.link}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* --- Blockchain Networks --- */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <h3 className="font-mono text-[10px] tracking-[0.3em] text-text-muted uppercase">Custom SVGs · Blockchain Networks</h3>
                <div className="flex-1 h-px bg-border-subtle" />
                <span className="font-mono text-[9px] text-text-disabled">{BLOCKCHAIN_NETWORKS.length} networks</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3">
                {BLOCKCHAIN_NETWORKS.map((network, idx) => (
                  <motion.div
                    key={network.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: idx * 0.03 }}
                    className="group flex flex-col items-center gap-2 p-4 rounded-2xl border border-white/[0.02] hover:border-white/[0.06] hover:bg-white/[0.02] transition-all cursor-default"
                    title={network.name}
                  >
                    <BlockchainIcon icon={network.icon} size={32} className="group-hover:scale-110 transition-transform" />
                    <span className="font-mono text-[8px] text-text-disabled group-hover:text-text-muted transition-colors text-center leading-tight truncate w-full">
                      {network.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* --- Icon Specimens by Category --- */}
            {ICON_CATEGORIES.map((category, catIdx) => (
              <div key={category.name}>
                <div className="flex items-center gap-4 mb-8">
                  <h3 className="font-mono text-[10px] tracking-[0.3em] text-text-muted uppercase">{category.name}</h3>
                  <div className="flex-1 h-px bg-border-subtle" />
                  <span className="font-mono text-[9px] text-text-disabled">{category.icons.length} icons</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3">
                  {category.icons.map((icon, idx) => (
                    <motion.div
                      key={icon.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: (catIdx * 0.02) + (idx * 0.02) }}
                      className="group flex flex-col items-center gap-2 p-4 rounded-2xl border border-white/[0.02] hover:border-white/[0.06] hover:bg-white/[0.02] transition-all cursor-default"
                      title={icon.name}
                    >
                      <icon.Icon className="w-5 h-5 text-text-secondary group-hover:text-text-brand transition-colors" />
                      <span className="font-mono text-[8px] text-text-disabled group-hover:text-text-muted transition-colors text-center leading-tight truncate w-full">
                        {icon.name.replace("Ri", "").replace("Line", "")}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}

            {/* --- CryptoFonts Token Assets --- */}
            {CRYPTO_CATEGORIES.map((category, catIdx) => (
              <div key={category.name}>
                <div className="flex items-center gap-4 mb-8">
                  <h3 className="font-mono text-[10px] tracking-[0.3em] text-text-muted uppercase">
                    CryptoFonts · {category.name}
                  </h3>
                  <div className="flex-1 h-px bg-border-subtle" />
                  <span className="font-mono text-[9px] text-text-disabled">{category.tokens.length} tokens</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3">
                  {category.tokens.map((token, idx) => (
                    <motion.div
                      key={`${token.symbol}-${idx}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: (catIdx * 0.02) + (idx * 0.02) }}
                      className="group flex flex-col items-center gap-2 p-4 rounded-2xl border border-white/[0.02] hover:border-white/[0.06] hover:bg-white/[0.02] transition-all cursor-default"
                      title={token.name}
                    >
                      <i className={`cf cf-${token.symbol} group-hover:scale-110 transition-transform inline-block`} style={{ fontSize: 28, lineHeight: 1 }} />
                      <span className="font-mono text-[8px] text-text-disabled group-hover:text-text-muted transition-colors text-center leading-tight uppercase truncate w-full">
                        {token.symbol}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}

            {/* --- Sizing Scale --- */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <h3 className="font-mono text-[10px] tracking-[0.3em] text-text-muted uppercase">Sizing Scale</h3>
                <div className="flex-1 h-px bg-border-subtle" />
                <span className="font-mono text-[9px] text-text-disabled">5 sizes · 12px–24px</span>
              </div>
              <div className="rounded-3xl border border-white/[0.03] bg-surface-page/50 divide-y divide-white/[0.03] overflow-hidden">
                {ICON_SIZES.map((size, idx) => (
                  <motion.div
                    key={size.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.04 }}
                    className="group flex items-center gap-8 px-8 py-6 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="w-32 shrink-0 flex flex-col gap-1">
                      <span className="font-mono text-xs font-semibold text-text-brand tracking-tight">{size.name}</span>
                      <span className="font-mono text-2xs text-text-muted">{size.px}px · {size.class}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      {[RiHomeLine, RiSearchLine, RiCheckLine, RiWalletLine, RiSettingsLine].map((SampleIcon, i) => (
                        <SampleIcon key={i} className={cn(size.class, "text-text-secondary group-hover:text-text-primary transition-colors")} />
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* --- Color Token Mapping --- */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <h3 className="font-mono text-[10px] tracking-[0.3em] text-text-muted uppercase">Color Token Mapping</h3>
                <div className="flex-1 h-px bg-border-subtle" />
                <span className="font-mono text-[9px] text-text-disabled">6 semantic states</span>
              </div>
              <div className="rounded-3xl border border-white/[0.03] bg-surface-page/50 divide-y divide-white/[0.03] overflow-hidden">
                {ICON_COLORS.map((color, idx) => (
                  <motion.div
                    key={color.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.04 }}
                    className="group flex items-center gap-8 px-8 py-6 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="w-32 shrink-0 flex flex-col gap-1">
                      <span className="font-mono text-xs font-semibold text-text-brand tracking-tight">{color.name}</span>
                      <span className="font-mono text-2xs text-text-muted">{color.token}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      {[RiHomeLine, RiSearchLine, RiCheckboxCircleLine, RiWalletLine, RiLockLine, RiStarLine, RiHeartLine, RiBellLine].map((SampleIcon, i) => (
                        <SampleIcon key={i} className={cn("w-5 h-5", color.class, "transition-colors")} />
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* --- Loading & Spinners --- */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <h3 className="font-mono text-[10px] tracking-[0.3em] text-text-muted uppercase">Loading &amp; Spinners</h3>
                <div className="flex-1 h-px bg-border-subtle" />
                <span className="font-mono text-[9px] text-text-disabled">4 loaders · 5 sizes · 5 sentiments</span>
              </div>

              <div className="space-y-6">

                {/* System spinner — sizes */}
                <div className="rounded-3xl border border-white/[0.03] bg-surface-page/50 overflow-hidden">
                  <div className="px-8 py-5 border-b border-white/[0.03] flex items-center justify-between">
                    <span className="font-mono text-[10px] text-text-brand uppercase tracking-widest">System Spinner · Sizes</span>
                    <span className="font-mono text-[9px] text-text-disabled">xs → xl</span>
                  </div>
                  <div className="flex items-center gap-12 px-8 py-10">
                    {(["xs", "sm", "md", "lg", "xl"] as const).map((sz) => (
                      <div key={sz} className="flex flex-col items-center gap-4">
                        <Spinner size={sz} variant="brand" />
                        <span className="font-mono text-[9px] text-text-disabled">{sz}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* System spinner — sentiments */}
                <div className="rounded-3xl border border-white/[0.03] bg-surface-page/50 overflow-hidden">
                  <div className="px-8 py-5 border-b border-white/[0.03] flex items-center justify-between">
                    <span className="font-mono text-[10px] text-text-brand uppercase tracking-widest">System Spinner · Sentiments</span>
                    <span className="font-mono text-[9px] text-text-disabled">5 variants</span>
                  </div>
                  <div className="flex items-center gap-12 px-8 py-10">
                    {([
                      { v: "brand", label: "Brand" },
                      { v: "neutral", label: "Neutral" },
                      { v: "danger", label: "Danger" },
                      { v: "warning", label: "Warning" },
                      { v: "success", label: "Success" },
                    ] as const).map(({ v, label }) => (
                      <div key={v} className="flex flex-col items-center gap-4">
                        <Spinner size="lg" variant={v} />
                        <span className="font-mono text-[9px] text-text-disabled">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* System spinner — speed */}
                <div className="rounded-3xl border border-white/[0.03] bg-surface-page/50 overflow-hidden">
                  <div className="px-8 py-5 border-b border-white/[0.03] flex items-center justify-between">
                    <span className="font-mono text-[10px] text-text-brand uppercase tracking-widest">System Spinner · Speed</span>
                    <span className="font-mono text-[9px] text-text-disabled">3 speeds</span>
                  </div>
                  <div className="flex items-center gap-16 px-8 py-10">
                    {([
                      { s: "slow", label: "Slow", sub: "1.2s" },
                      { s: "default", label: "Default", sub: "0.75s" },
                      { s: "fast", label: "Fast", sub: "0.45s" },
                    ] as const).map(({ s, label, sub }) => (
                      <div key={s} className="flex flex-col items-center gap-4">
                        <Spinner size="lg" variant="brand" speed={s} />
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="font-mono text-[9px] text-text-muted">{label}</span>
                          <span className="font-mono text-[8px] text-text-disabled">{sub}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Remix Icon loaders — each with a distinct motion personality */}
                <div className="rounded-3xl border border-white/[0.03] bg-surface-page/50 overflow-hidden">
                  <div className="px-8 py-5 border-b border-white/[0.03] flex items-center justify-between">
                    <span className="font-mono text-[10px] text-text-brand uppercase tracking-widest">Remix Icon Loaders</span>
                    <span className="font-mono text-[9px] text-text-disabled">loader · loader-2 · loader-4 · loader-5</span>
                  </div>
                  <div className="flex items-center gap-20 px-8 py-10">

                    {/* Loader — Steady pulse
                        12 radial lines, each a different opacity. Pure linear constant
                        rotation — no tricks, no personality. The original. */}
                    <div className="flex flex-col items-center gap-4">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 0.9,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="text-text-brand"
                      >
                        <RiLoaderLine className="w-6 h-6" />
                      </motion.div>
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="font-mono text-[9px] text-text-muted">Loader</span>
                        <span className="font-mono text-[8px] text-text-disabled">constant</span>
                      </div>
                    </div>

                    {/* Loader 2 — Sprint & coast
                        Rushes through 260° in 55% of the cycle (easeIn = building momentum),
                        then glides the final 100° in 45% (easeOut = graceful coast-down).
                        Feels like a flywheel that charges up then rolls. */}
                    <div className="flex flex-col items-center gap-4">
                      <motion.div
                        animate={{ rotate: [0, 260, 360] }}
                        transition={{
                          duration: 1.3,
                          repeat: Infinity,
                          times: [0, 0.55, 1],
                          ease: ["easeIn", "easeOut"],
                        }}
                        className="text-text-brand"
                      >
                        <RiLoader2Line className="w-6 h-6" />
                      </motion.div>
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="font-mono text-[9px] text-text-muted">Loader 2</span>
                        <span className="font-mono text-[8px] text-text-disabled">sprint · coast</span>
                      </div>
                    </div>

                    {/* Loader 4 — Momentum sweep
                        0°→270° at constant speed (linear, 75% of the cycle),
                        270°→360° decelerates (easeOut, remaining 25%).
                        Feels like a heavy disc that builds momentum then brakes. */}
                    <div className="flex flex-col items-center gap-4">
                      <motion.div
                        animate={{ rotate: [0, 270, 360] }}
                        transition={{
                          duration: 1.4,
                          repeat: Infinity,
                          times: [0, 0.75, 1],
                          ease: ["linear", "easeOut"],
                        }}
                        className="text-text-brand"
                      >
                        <RiLoader4Line className="w-6 h-6" />
                      </motion.div>
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="font-mono text-[9px] text-text-muted">Loader 4</span>
                        <span className="font-mono text-[8px] text-text-disabled">constant · decelerate</span>
                      </div>
                    </div>

                    {/* Loader 5 — Wind-up & release
                        Snaps 8° counter-clockwise in the first 6% of the cycle (the coil),
                        then easeInOut carries it forward — slow tension release, accelerates
                        through the middle, decelerates softly into the next coil.
                        Feels like a spring-loaded mechanism. */}
                    <div className="flex flex-col items-center gap-4">
                      <motion.div
                        animate={{
                          rotate: [0, -8, 360],
                          scale: [1, 1.08, 1],
                        }}
                        transition={{
                          rotate: { duration: 1.1, repeat: Infinity, times: [0, 0.06, 1], ease: ["easeOut", "easeInOut"] },
                          scale: { duration: 1.1, repeat: Infinity, times: [0, 0.06, 1], ease: ["linear", "easeIn"] },
                        }}
                        className="text-text-brand"
                      >
                        <RiLoader5Line className="w-6 h-6" />
                      </motion.div>
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="font-mono text-[9px] text-text-muted">Loader 5</span>
                        <span className="font-mono text-[8px] text-text-disabled">wind-up · release</span>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </div>

            {/* --- Reference Summary --- */}
            <div className="p-10 rounded-3xl border border-white/[0.03] bg-surface-sunken/50">
              <h4 className="font-display text-xl font-bold text-text-primary mb-8">Iconography System Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                {[
                  { label: "General Purpose", val: "2800+", items: "Remix Icons · Line variants" },
                  { label: "Categories", val: "7", items: "Navigation · Actions · Status · Finance · Objects · Communication · Media" },
                  { label: "Sizes", val: "5", items: "xs (12) · sm (14) · md (16) · lg (20) · xl (24)" },
                  { label: "Crypto Assets", val: "1500+", items: "CryptoFonts SVG API" },
                ].map((item) => (
                  <div key={item.label} className="space-y-3">
                    <div className="w-8 h-1 bg-interactive-brand-default/20 rounded-full" />
                    <span className="font-mono text-[9px] text-text-brand/60 uppercase tracking-widest block">{item.label}</span>
                    <h5 className="font-display text-3xl font-bold text-text-primary tracking-tightest">{item.val}</h5>
                    <p className="text-xs text-text-muted font-light leading-relaxed">{item.items}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* ==============================================================
            03. PARTICLE SYSTEM
            ============================================================== */}
        <Section
          id="particles"
          num="03"
          title="Particle System"
          subtitle="Two-tier motion layer — a persistent ambient field for depth, and a reactive burst for confirmation moments."
        >
          <div className="space-y-20">

            {/* --- Particle Card --- */}
            <div>
              <div className="flex items-center gap-4 mb-3">
                <h3 className="font-mono text-[10px] tracking-[0.3em] text-text-muted uppercase">Ambient — Particle Card</h3>
                <div className="flex-1 h-px bg-border-subtle" />
                <span className="font-mono text-[9px] text-text-disabled">canvas · spring physics</span>
              </div>
              <p className="text-xs text-text-muted font-light mb-6 max-w-xl">
                Particles converge from scatter into a card formation via spring physics.
                Cursor pushes particles aside — they spring back on leave. A diagonal shimmer
                travels across the field continuously.
              </p>
              <div className="relative overflow-hidden" style={{ height: 300 }}>
                <ParticleCard className="absolute inset-0" />
                <div className="absolute bottom-4 left-5 font-mono text-[9px] text-text-disabled/40 pointer-events-none">
                  Move cursor · particles spring back
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4">
                {[
                  { label: "Spring constant", val: "0.042", note: "pull toward home" },
                  { label: "Push radius", val: "72px", note: "cursor influence" },
                  { label: "Shimmer period", val: "~3.5s", note: "diagonal wave" },
                ].map((s) => (
                  <div key={s.label} className="p-4 rounded-2xl border border-white/[0.03] bg-surface-page/50 space-y-1">
                    <span className="font-mono text-[9px] text-text-brand/60 uppercase tracking-widest block">{s.label}</span>
                    <span className="font-display text-xl font-bold text-text-primary">{s.val}</span>
                    <span className="font-mono text-[9px] text-text-disabled block">{s.note}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* --- Particle Text --- */}
            <ParticleTextDemo />

            {/* --- Transaction Burst --- */}
            <div>
              <div className="flex items-center gap-4 mb-3">
                <h3 className="font-mono text-[10px] tracking-[0.3em] text-text-muted uppercase">Reactive — Transaction Burst</h3>
                <div className="flex-1 h-px bg-border-subtle" />
                <span className="font-mono text-[9px] text-text-disabled">Framer Motion · AnimatePresence</span>
              </div>
              <p className="text-xs text-text-muted font-light mb-8 max-w-xl">
                Sparks radiate from the action origin on transaction confirmation. Brand cyan + white,
                staggered distances, variable durations.
              </p>
              <div className="flex flex-col items-center justify-center rounded-3xl border border-white/[0.04] bg-surface-sunken/40 py-20 gap-8">
                <BurstDemo />
                <span className="font-mono text-[9px] text-text-disabled">Click to trigger burst</span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4">
                {[
                  { label: "Particle count", val: "28", note: "per burst" },
                  { label: "Spread radius", val: "36–88px", note: "randomised dist" },
                  { label: "Duration", val: "450–700ms", note: "staggered decay" },
                ].map((s) => (
                  <div key={s.label} className="p-4 rounded-2xl border border-white/[0.03] bg-surface-page/50 space-y-1">
                    <span className="font-mono text-[9px] text-text-brand/60 uppercase tracking-widest block">{s.label}</span>
                    <span className="font-display text-xl font-bold text-text-primary">{s.val}</span>
                    <span className="font-mono text-[9px] text-text-disabled block">{s.note}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </Section>

        {/* ==============================================================
            04. SHADER SYSTEM
            ============================================================== */}
        <Section
          id="shaders"
          num="04"
          title="Shader System"
          subtitle="WebGL2 mesh gradient driven by user-placed color pins. A GLSL fragment shader interpolates between pins using inverse-distance weighting — drag pins, add new ones, tune colors in real time."
        >
          <ShaderDemo />
        </Section>

        {/* ==============================================================
            05. BUTTONS
            ============================================================== */}
        <Section
          id="buttons"
          num="05"
          title="Buttons"
          subtitle="Token-driven, Framer Motion animated. Five sentiment variants × three sizes × two shapes — all states covered."
        >
          <div className="space-y-20">

            <ButtonPlayground />

            {/* ── Sentiment matrix ─────────────────────────────────────── */}
            <div className="space-y-6">
              <p className="font-mono text-2xs tracking-[0.15em] text-text-muted uppercase">Sentiment variants</p>
              {/* Header */}
              <div className="grid grid-cols-[80px_1fr_1fr_1fr] gap-x-4 gap-y-3 items-center">
                <span />
                <span className="font-mono text-[10px] text-text-disabled uppercase tracking-widest text-center">sm</span>
                <span className="font-mono text-[10px] text-text-disabled uppercase tracking-widest text-center">md</span>
                <span className="font-mono text-[10px] text-text-disabled uppercase tracking-widest text-center">lg</span>

                {/* Brand */}
                <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">brand</span>
                <div className="flex justify-center"><Button variant="brand" size="sm">Action</Button></div>
                <div className="flex justify-center"><Button variant="brand" size="md">Action</Button></div>
                <div className="flex justify-center"><Button variant="brand" size="lg">Action</Button></div>

                {/* Brand gradient */}
                <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">brand ✦</span>
                <div className="flex justify-center"><Button variant="brand-gradient" size="sm">Action</Button></div>
                <div className="flex justify-center"><Button variant="brand-gradient" size="md">Action</Button></div>
                <div className="flex justify-center"><Button variant="brand-gradient" size="lg">Action</Button></div>

                {/* Neutral */}
                <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">neutral</span>
                <div className="flex justify-center"><Button variant="neutral" size="sm">Action</Button></div>
                <div className="flex justify-center"><Button variant="neutral" size="md">Action</Button></div>
                <div className="flex justify-center"><Button variant="neutral" size="lg">Action</Button></div>

                {/* Warning */}
                <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">warning</span>
                <div className="flex justify-center"><Button variant="warning" size="sm">Action</Button></div>
                <div className="flex justify-center"><Button variant="warning" size="md">Action</Button></div>
                <div className="flex justify-center"><Button variant="warning" size="lg">Action</Button></div>

                {/* Danger */}
                <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">danger</span>
                <div className="flex justify-center"><Button variant="danger" size="sm">Action</Button></div>
                <div className="flex justify-center"><Button variant="danger" size="md">Action</Button></div>
                <div className="flex justify-center"><Button variant="danger" size="lg">Action</Button></div>

                {/* Success */}
                <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">success</span>
                <div className="flex justify-center"><Button variant="success" size="sm">Action</Button></div>
                <div className="flex justify-center"><Button variant="success" size="md">Action</Button></div>
                <div className="flex justify-center"><Button variant="success" size="lg">Action</Button></div>
              </div>
            </div>

            {/* ── States ───────────────────────────────────────────────── */}
            <div className="space-y-6">
              <p className="font-mono text-2xs tracking-[0.15em] text-text-muted uppercase">States — all variants</p>
              <div className="grid grid-cols-[80px_1fr_1fr_1fr] gap-x-4 gap-y-3 items-center">
                <span />
                <span className="font-mono text-[10px] text-text-disabled uppercase tracking-widest text-center">default</span>
                <span className="font-mono text-[10px] text-text-disabled uppercase tracking-widest text-center">disabled</span>
                <span className="font-mono text-[10px] text-text-disabled uppercase tracking-widest text-center">loading</span>

                {(["brand", "brand-gradient", "neutral", "warning", "danger", "success"] as const).map((v) => (
                  <Fragment key={v}>
                    <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">{v}</span>
                    <div className="flex justify-center"><Button variant={v}>Confirm</Button></div>
                    <div className="flex justify-center"><Button variant={v} disabled>Confirm</Button></div>
                    <div className="flex justify-center"><Button variant={v} loading>Working…</Button></div>
                  </Fragment>
                ))}
              </div>
            </div>

            {/* ── Shapes ───────────────────────────────────────────────── */}
            <div className="space-y-6">
              <p className="font-mono text-2xs tracking-[0.15em] text-text-muted uppercase">Shapes</p>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="brand" shape="rounded" size="md">Rounded</Button>
                <Button variant="brand" shape="pill" size="md">Pill</Button>
                <Button variant="brand-gradient" shape="rounded" size="md">Rounded</Button>
                <Button variant="brand-gradient" shape="pill" size="md">Pill</Button>
                <Button variant="neutral" shape="rounded" size="md">Rounded</Button>
                <Button variant="neutral" shape="pill" size="md">Pill</Button>
                <Button variant="danger" shape="rounded" size="md">Rounded</Button>
                <Button variant="danger" shape="pill" size="md">Pill</Button>
              </div>
            </div>

            {/* ── Icon variants ────────────────────────────────────────── */}
            <div className="space-y-6">
              <p className="font-mono text-2xs tracking-[0.15em] text-text-muted uppercase">With icons</p>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="brand" size="sm" leadingIcon={<RiAddLine />}>New vault</Button>
                <Button variant="brand" size="md" leadingIcon={<RiSendPlaneLine />} trailingIcon={<RiArrowRightLine />}>Send tokens</Button>
                <Button variant="brand-gradient" size="lg" leadingIcon={<RiWalletLine />} trailingIcon={<RiArrowRightLine />}>Connect wallet</Button>
                <Button variant="neutral" size="md" leadingIcon={<RiRefreshLine />}>Refresh</Button>
                <Button variant="neutral" size="md" trailingIcon={<RiExternalLinkLine />}>Explorer</Button>
                <Button variant="warning" size="md" leadingIcon={<RiAlertLine />}>Review risk</Button>
                <Button variant="danger" size="md" leadingIcon={<RiDeleteBinLine />} shape="pill">Delete</Button>
                <Button variant="success" size="md" leadingIcon={<RiCheckboxCircleLine />}>Confirmed</Button>
              </div>
            </div>

            {/* ── Loading → icon swap ──────────────────────────────────── */}
            <div className="space-y-6">
              <p className="font-mono text-2xs tracking-[0.15em] text-text-muted uppercase">Loading — spinner replaces leading icon</p>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="brand" size="sm" loading leadingIcon={<RiSendPlaneLine />}>Sending…</Button>
                <Button variant="brand" size="md" loading>Confirming…</Button>
                <Button variant="danger" size="md" loading leadingIcon={<RiDeleteBinLine />}>Deleting…</Button>
                <Button variant="success" size="lg" loading leadingIcon={<RiShieldCheckLine />}>Signing…</Button>
              </div>
            </div>

            {/* ── Cross-variant transitions ─────────────────────────────── */}
            <div className="space-y-6">
              <p className="font-mono text-2xs tracking-[0.15em] text-text-muted uppercase">Cross-variant — hover to reveal intent</p>
              <p className="text-xs text-text-muted max-w-lg">
                A button can idle in a neutral/passive state and reveal its true sentiment on hover.
                Background transitions via CSS <code className="text-text-secondary">transition-colors</code>,
                shadow color switches to match the hover variant.
              </p>
              <div className="flex flex-wrap items-end gap-6">
                {/* Neutral → Danger: destructive confirm */}
                <div className="flex flex-col items-center gap-2">
                  <Button
                    variant="neutral"
                    hoverVariant="danger"
                    size="md"
                    leadingIcon={<RiDeleteBinLine />}
                  >
                    Delete account
                  </Button>
                  <span className="font-mono text-[9px] text-text-disabled uppercase tracking-widest">neutral → danger</span>
                </div>

                {/* Neutral → Warning: risky action */}
                <div className="flex flex-col items-center gap-2">
                  <Button
                    variant="neutral"
                    hoverVariant="warning"
                    size="md"
                    leadingIcon={<RiAlertLine />}
                  >
                    Revoke access
                  </Button>
                  <span className="font-mono text-[9px] text-text-disabled uppercase tracking-widest">neutral → warning</span>
                </div>

                {/* Brand → Success: optimistic submit */}
                <div className="flex flex-col items-center gap-2">
                  <Button
                    variant="brand"
                    hoverVariant="success"
                    size="md"
                    trailingIcon={<RiArrowRightLine />}
                  >
                    Submit
                  </Button>
                  <span className="font-mono text-[9px] text-text-disabled uppercase tracking-widest">brand → success</span>
                </div>

                {/* Neutral → Brand: call to action reveal */}
                <div className="flex flex-col items-center gap-2">
                  <Button
                    variant="neutral"
                    hoverVariant="brand"
                    size="md"
                    leadingIcon={<RiWalletLine />}
                  >
                    Connect wallet
                  </Button>
                  <span className="font-mono text-[9px] text-text-disabled uppercase tracking-widest">neutral → brand</span>
                </div>

                {/* Warning → Danger: escalation */}
                <div className="flex flex-col items-center gap-2">
                  <Button
                    variant="warning"
                    hoverVariant="danger"
                    size="md"
                    leadingIcon={<RiAlertLine />}
                    shape="pill"
                  >
                    Confirm wipe
                  </Button>
                  <span className="font-mono text-[9px] text-text-disabled uppercase tracking-widest">warning → danger</span>
                </div>

                {/* Brand gradient → Danger */}
                <div className="flex flex-col items-center gap-2">
                  <Button
                    variant="brand-gradient"
                    hoverVariant="danger"
                    size="lg"
                    leadingIcon={<RiShieldCheckLine />}
                  >
                    Emergency stop
                  </Button>
                  <span className="font-mono text-[9px] text-text-disabled uppercase tracking-widest">brand-gradient → danger</span>
                </div>
              </div>
            </div>

          </div>
        </Section>

        {/* ==============================================================
            05b. FLAT BUTTONS
            ============================================================== */}
        <Section
          id="flat-buttons"
          num="05b"
          title="Flat Buttons & Icon Buttons"
          subtitle="Non-elevated variations tailored specifically for dense, datagrid, or in-product layouts. They retain all logic but drop external shadows and vertical lifts."
        >
          <div className="space-y-20">

            {/* ── Sentiment matrix ─────────────────────────────────────── */}
            <div className="space-y-6">
              <p className="font-mono text-2xs tracking-[0.15em] text-text-muted uppercase">Mapped Interaction Architectures</p>
              <div className="grid grid-cols-[100px_1fr_1fr_1fr] gap-x-4 gap-y-6 items-center">
                <span />
                <div className="text-center space-y-1">
                  <span className="font-mono text-[10px] text-text-disabled uppercase tracking-widest block">filled</span>
                  <span className="font-mono text-[9px] text-text-disabled/60 block">Machined Edge</span>
                </div>
                <div className="text-center space-y-1">
                  <span className="font-mono text-[10px] text-text-disabled uppercase tracking-widest block">tonal</span>
                  <span className="font-mono text-[9px] text-text-disabled/60 block">Surface Reaction</span>
                </div>
                <div className="text-center space-y-1">
                  <span className="font-mono text-[10px] text-text-disabled uppercase tracking-widest block">outline</span>
                  <span className="font-mono text-[9px] text-text-disabled/60 block">Tonal Stroke</span>
                </div>

                {(["brand", "brand-gradient", "neutral", "warning", "danger", "success"] as const).map((v) => (
                  <Fragment key={v}>
                    <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">{v.replace('-gradient', ' ✦')}</span>
                    <div className="flex justify-center"><Button flat variant={v} appearance="filled">Action</Button></div>
                    <div className="flex justify-center"><Button flat variant={v} appearance="tonal">Action</Button></div>
                    <div className="flex justify-center"><Button flat variant={v} appearance="outline">Action</Button></div>
                  </Fragment>
                ))}
              </div>
            </div>

            {/* ── Icon variants ────────────────────────────────────────── */}
            <div className="space-y-6">
              <p className="font-mono text-2xs tracking-[0.15em] text-text-muted uppercase">Flat Icon Buttons</p>
              <div className="grid grid-cols-[100px_1fr_1fr_1fr] gap-x-4 gap-y-6 items-center">
                <span />
                <div className="text-center space-y-1">
                  <span className="font-mono text-[10px] text-text-disabled uppercase tracking-widest block">filled</span>
                </div>
                <div className="text-center space-y-1">
                  <span className="font-mono text-[10px] text-text-disabled uppercase tracking-widest block">tonal</span>
                </div>
                <div className="text-center space-y-1">
                  <span className="font-mono text-[10px] text-text-disabled uppercase tracking-widest block">outline</span>
                </div>

                {(["brand", "brand-gradient", "neutral", "warning", "danger", "success"] as const).map((v) => (
                  <Fragment key={v}>
                    <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">{v.replace('-gradient', ' ✦')}</span>
                    <div className="flex justify-center"><IconButton flat variant={v} appearance="filled" size="md" aria-label={`${v} filled`} icon={<RiAddLine />} /></div>
                    <div className="flex justify-center"><IconButton flat variant={v} appearance="tonal" size="md" aria-label={`${v} tonal`} icon={<RiAddLine />} /></div>
                    <div className="flex justify-center"><IconButton flat variant={v} appearance="outline" size="md" aria-label={`${v} outline`} icon={<RiAddLine />} /></div>
                  </Fragment>
                ))}
              </div>
            </div>

            {/* ── Shapes ───────────────────────────────────────────────── */}
            <div className="space-y-6">
              <p className="font-mono text-2xs tracking-[0.15em] text-text-muted uppercase">Pill Shapes & Sizes</p>
              <div className="flex flex-wrap items-center gap-4">
                <Button flat variant="brand" appearance="filled" shape="pill" size="sm">Small text</Button>
                <Button flat variant="neutral" appearance="tonal" shape="pill" size="md">Medium action</Button>
                <Button flat variant="brand-gradient" appearance="outline" shape="pill" size="lg">Large action area</Button>
              </div>
            </div>
          </div>
        </Section>

        {/* ================================================================
            06. SECONDARY BUTTONS (tonal + outline + ghost + inverted)
            ============================================================== */}
        <Section
          id="secondary-buttons"
          num="06"
          title="Secondary Buttons"
          subtitle="Lower hierarchy — appearance × sentiment matrix. Same motion system, no shimmer."
        >
          <div className="space-y-20">

            {/* ── Tonal (secondary) ──────────────────────────────────────── */}
            <div className="space-y-6">
              <p className="font-mono text-2xs tracking-[0.15em] text-text-muted uppercase">Tonal — subtle tinted bg · colored text · hairline border</p>
              <div className="grid grid-cols-[80px_1fr_1fr_1fr] gap-x-4 gap-y-3 items-center">
                <span />
                <span className="font-mono text-[10px] text-text-disabled uppercase tracking-widest text-center">sm</span>
                <span className="font-mono text-[10px] text-text-disabled uppercase tracking-widest text-center">md</span>
                <span className="font-mono text-[10px] text-text-disabled uppercase tracking-widest text-center">lg</span>

                {(["brand", "neutral", "danger", "warning", "success"] as const).map((v) => (
                  <Fragment key={v}>
                    <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">{v}</span>
                    <div className="flex justify-center"><Button appearance="tonal" variant={v} size="sm">Action</Button></div>
                    <div className="flex justify-center"><Button appearance="tonal" variant={v} size="md">Action</Button></div>
                    <div className="flex justify-center"><Button appearance="tonal" variant={v} size="lg">Action</Button></div>
                  </Fragment>
                ))}
              </div>
            </div>

            {/* ── Outline ────────────────────────────────────────────────── */}
            <div className="space-y-6">
              <p className="font-mono text-2xs tracking-[0.15em] text-text-muted uppercase">Outline — transparent bg · colored border · fills on hover</p>
              <div className="grid grid-cols-[80px_1fr_1fr_1fr] gap-x-4 gap-y-3 items-center">
                <span />
                <span className="font-mono text-[10px] text-text-disabled uppercase tracking-widest text-center">sm</span>
                <span className="font-mono text-[10px] text-text-disabled uppercase tracking-widest text-center">md</span>
                <span className="font-mono text-[10px] text-text-disabled uppercase tracking-widest text-center">lg</span>

                {(["brand", "neutral", "danger", "warning", "success"] as const).map((v) => (
                  <Fragment key={v}>
                    <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">{v}</span>
                    <div className="flex justify-center"><Button appearance="outline" variant={v} size="sm">Action</Button></div>
                    <div className="flex justify-center"><Button appearance="outline" variant={v} size="md">Action</Button></div>
                    <div className="flex justify-center"><Button appearance="outline" variant={v} size="lg">Action</Button></div>
                  </Fragment>
                ))}
              </div>
            </div>

            {/* ── Ghost ──────────────────────────────────────────────────── */}
            <div className="space-y-6">
              <p className="font-mono text-2xs tracking-[0.15em] text-text-muted uppercase">Ghost — no bg · no border · faintest hover scrim</p>
              <div className="flex flex-wrap items-center gap-4">
                {(["brand", "neutral", "danger", "warning", "success"] as const).map((v) => (
                  <Button key={v} appearance="ghost" variant={v} size="md">{v.charAt(0).toUpperCase() + v.slice(1)}</Button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Button appearance="ghost" variant="brand" size="sm" leadingIcon={<RiAddLine />}>New item</Button>
                <Button appearance="ghost" variant="neutral" size="md" trailingIcon={<RiArrowRightLine />}>See all</Button>
                <Button appearance="ghost" variant="danger" size="md" leadingIcon={<RiDeleteBinLine />}>Remove</Button>
                <Button appearance="ghost" variant="warning" size="sm" leadingIcon={<RiAlertLine />}>Dismiss</Button>
                <Button appearance="ghost" variant="brand" size="lg" shape="pill" trailingIcon={<RiExternalLinkLine />}>Explorer</Button>
              </div>
            </div>

            {/* ── Inverted ───────────────────────────────────────────────── */}
            <div className="space-y-6">
              <p className="font-mono text-2xs tracking-[0.15em] text-text-muted uppercase">Inverted — white bg · dark text · dark or coloured surfaces only · not for light backgrounds</p>
              <div className="rounded-2xl bg-gradient-to-br from-[var(--color-cyan-950)] via-[var(--color-neutral-900)] to-[var(--color-neutral-800)] p-8 flex flex-wrap items-center gap-4">
                <Button appearance="inverted" variant="neutral" size="md">Neutral</Button>
                <Button appearance="inverted" variant="brand" size="md" leadingIcon={<RiWalletLine />}>Connect</Button>
                <Button appearance="inverted" variant="danger" size="md" leadingIcon={<RiDeleteBinLine />}>Delete</Button>
                <Button appearance="inverted" variant="warning" size="md" leadingIcon={<RiAlertLine />}>Warning</Button>
                <Button appearance="inverted" variant="success" size="md" leadingIcon={<RiCheckboxCircleLine />}>Confirm</Button>
                <Button appearance="inverted" variant="brand" size="lg" shape="pill" trailingIcon={<RiArrowRightLine />}>Get started</Button>
              </div>
            </div>

            {/* ── States across appearances ───────────────────────────────── */}
            <div className="space-y-6">
              <p className="font-mono text-2xs tracking-[0.15em] text-text-muted uppercase">States — tonal brand · all conditions</p>
              <div className="flex flex-wrap items-center gap-4">
                <Button appearance="tonal" variant="brand" size="md">Default</Button>
                <Button appearance="tonal" variant="brand" size="md" disabled>Disabled</Button>
                <Button appearance="tonal" variant="brand" size="md" loading>Working…</Button>
                <Button appearance="tonal" variant="brand" size="md" leadingIcon={<RiSendPlaneLine />}>With icon</Button>
                <Button appearance="tonal" variant="brand" size="md" shape="pill" trailingIcon={<RiArrowRightLine />}>Pill</Button>
              </div>
            </div>

            {/* ── Cross-appearance hover transitions ─────────────────────── */}
            <div className="space-y-6">
              <p className="font-mono text-2xs tracking-[0.15em] text-text-muted uppercase">Cross-variant — works at every appearance level</p>
              <div className="flex flex-wrap items-end gap-6">
                <div className="flex flex-col items-center gap-2">
                  <Button appearance="tonal" variant="neutral" hoverVariant="danger" size="md" leadingIcon={<RiDeleteBinLine />}>Delete</Button>
                  <span className="font-mono text-[9px] text-text-disabled uppercase tracking-widest">tonal neutral → danger</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Button appearance="outline" variant="neutral" hoverVariant="brand" size="md" leadingIcon={<RiWalletLine />}>Connect</Button>
                  <span className="font-mono text-[9px] text-text-disabled uppercase tracking-widest">outline neutral → brand</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Button appearance="ghost" variant="neutral" hoverVariant="danger" size="md" leadingIcon={<RiDeleteBinLine />}>Remove</Button>
                  <span className="font-mono text-[9px] text-text-disabled uppercase tracking-widest">ghost neutral → danger</span>
                </div>
              </div>
            </div>

          </div>
        </Section>

        {/* ================================================================
            07. TERTIARY BUTTON
            ============================================================== */}
        <Section
          id="tertiary-buttons"
          num="07"
          title="Tertiary Button"
          subtitle="Underline-only. No background, no border — the label and line carry the whole interaction."
        >
          <div className="space-y-20">

            {/* ── Sentiment × size ─────────────────────────────────────── */}
            <div className="space-y-6">
              <p className="font-mono text-2xs tracking-[0.15em] text-text-muted uppercase">Sentiment variants</p>
              <div className="grid grid-cols-[80px_1fr_1fr_1fr] gap-x-4 gap-y-4 items-center">
                <span />
                <span className="font-mono text-[10px] text-text-disabled uppercase tracking-widest text-center">sm</span>
                <span className="font-mono text-[10px] text-text-disabled uppercase tracking-widest text-center">md</span>
                <span className="font-mono text-[10px] text-text-disabled uppercase tracking-widest text-center">lg</span>

                {(["brand", "neutral", "danger", "warning", "success"] as const).map((v) => (
                  <Fragment key={v}>
                    <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">{v}</span>
                    <div className="flex justify-center"><TertiaryButton variant={v} size="sm">Action</TertiaryButton></div>
                    <div className="flex justify-center"><TertiaryButton variant={v} size="md">Action</TertiaryButton></div>
                    <div className="flex justify-center"><TertiaryButton variant={v} size="lg">Action</TertiaryButton></div>
                  </Fragment>
                ))}
              </div>
            </div>

            {/* ── With trailing icons ───────────────────────────────────── */}
            <div className="space-y-6">
              <p className="font-mono text-2xs tracking-[0.15em] text-text-muted uppercase">Trailing icon — slides forward on hover</p>
              <div className="flex flex-wrap items-center gap-8">
                <TertiaryButton variant="brand" size="md" trailingIcon={<RiArrowRightLine />}>View portfolio</TertiaryButton>
                <TertiaryButton variant="brand" size="lg" trailingIcon={<RiExternalLinkLine />}>Open explorer</TertiaryButton>
                <TertiaryButton variant="neutral" size="md" trailingIcon={<RiArrowRightLine />}>See all</TertiaryButton>
                <TertiaryButton variant="danger" size="md" trailingIcon={<RiArrowRightLine />}>Revoke access</TertiaryButton>
                <TertiaryButton variant="success" size="md" trailingIcon={<RiCheckboxCircleLine />}>Verified</TertiaryButton>
              </div>
            </div>

            {/* ── With leading icons ────────────────────────────────────── */}
            <div className="space-y-6">
              <p className="font-mono text-2xs tracking-[0.15em] text-text-muted uppercase">Leading icon</p>
              <div className="flex flex-wrap items-center gap-8">
                <TertiaryButton variant="brand" size="md" leadingIcon={<RiAddLine />}>New vault</TertiaryButton>
                <TertiaryButton variant="neutral" size="md" leadingIcon={<RiRefreshLine />}>Refresh</TertiaryButton>
                <TertiaryButton variant="danger" size="md" leadingIcon={<RiDeleteBinLine />}>Remove wallet</TertiaryButton>
                <TertiaryButton variant="warning" size="md" leadingIcon={<RiAlertLine />}>Review risk</TertiaryButton>
                <TertiaryButton variant="brand" size="sm" leadingIcon={<RiWalletLine />}>Connect</TertiaryButton>
              </div>
            </div>

            {/* ── States ───────────────────────────────────────────────── */}
            <div className="space-y-6">
              <p className="font-mono text-2xs tracking-[0.15em] text-text-muted uppercase">States</p>
              <div className="flex flex-wrap items-center gap-8">
                <TertiaryButton variant="brand" size="md">Default</TertiaryButton>
                <TertiaryButton variant="brand" size="md" disabled>Disabled</TertiaryButton>
                <TertiaryButton variant="brand" size="md" loading>Loading…</TertiaryButton>
                <TertiaryButton variant="brand" size="md" loading leadingIcon={<RiSendPlaneLine />}>Sending…</TertiaryButton>
              </div>
            </div>

            {/* ── Inline context ───────────────────────────────────────── */}
            <div className="space-y-6">
              <p className="font-mono text-2xs tracking-[0.15em] text-text-muted uppercase">Inline — sits naturally in flowing text</p>
              <p className="text-sm text-text-secondary leading-relaxed max-w-xl">
                Your portfolio is up 12.4% this month.{" "}
                <TertiaryButton variant="brand" size="sm" trailingIcon={<RiArrowRightLine />}>
                  View breakdown
                </TertiaryButton>{" "}
                or{" "}
                <TertiaryButton variant="neutral" size="sm">
                  export CSV
                </TertiaryButton>{" "}
                to share with your accountant.
              </p>
              <p className="text-sm text-text-secondary leading-relaxed max-w-xl">
                Transaction requires 2 of 3 signatures.{" "}
                <TertiaryButton variant="warning" size="sm" leadingIcon={<RiAlertLine />}>
                  Review signers
                </TertiaryButton>{" "}
                before proceeding.{" "}
                <TertiaryButton variant="danger" size="sm">
                  Cancel proposal
                </TertiaryButton>
              </p>
            </div>

          </div>
        </Section>

        {/* ================================================================
            08. ICON BUTTON
            ============================================================== */}
        <Section
          id="icon-buttons"
          num="08"
          title="Icon Button"
          subtitle="Square, icon-only. Every appearance × sentiment × size — aria-label required."
        >
          <div className="space-y-20">

            {/* ── Appearance × size grid ───────────────────────────────── */}
            <div className="space-y-6">
              <p className="font-mono text-2xs tracking-[0.15em] text-text-muted uppercase">Filled — brand · all sizes</p>
              <div className="flex items-end gap-3">
                <IconButton aria-label="Add item" icon={<RiAddLine />} variant="brand" appearance="filled" size="sm" />
                <IconButton aria-label="Add item" icon={<RiAddLine />} variant="brand" appearance="filled" size="md" />
                <IconButton aria-label="Add item" icon={<RiAddLine />} variant="brand" appearance="filled" size="lg" />
                <div className="w-px h-10 bg-white/[0.06] mx-2" />
                <IconButton aria-label="Add item" icon={<RiAddLine />} variant="brand" appearance="filled" size="sm" shape="pill" />
                <IconButton aria-label="Add item" icon={<RiAddLine />} variant="brand" appearance="filled" size="md" shape="pill" />
                <IconButton aria-label="Add item" icon={<RiAddLine />} variant="brand" appearance="filled" size="lg" shape="pill" />
              </div>
            </div>

            {/* ── Sentiment × appearance matrix (md) ──────────────────── */}
            <div className="space-y-6">
              <p className="font-mono text-2xs tracking-[0.15em] text-text-muted uppercase">Appearance × sentiment matrix — md</p>
              <div className="grid grid-cols-[80px_repeat(5,1fr)] gap-x-3 gap-y-4 items-center">
                <span />
                {(["brand", "neutral", "danger", "warning", "success"] as const).map(v => (
                  <span key={v} className="font-mono text-[10px] text-text-disabled uppercase tracking-widest text-center">{v}</span>
                ))}

                {(["filled", "tonal", "outline", "ghost"] as const).map(app => (
                  <Fragment key={app}>
                    <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">{app}</span>
                    {(["brand", "neutral", "danger", "warning", "success"] as const).map(v => (
                      <div key={v} className="flex justify-center">
                        <IconButton
                          aria-label={`${app} ${v}`}
                          icon={<RiAddLine />}
                          variant={v}
                          appearance={app}
                          size="md"
                        />
                      </div>
                    ))}
                  </Fragment>
                ))}

                {/* Inverted on dark bg */}
                <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest">inverted</span>
                {(["brand", "neutral", "danger", "warning", "success"] as const).map(v => (
                  <div key={v} className="flex justify-center rounded-lg bg-gradient-to-br from-[var(--color-cyan-950)] to-[var(--color-neutral-800)] p-1.5">
                    <IconButton
                      aria-label={`inverted ${v}`}
                      icon={<RiAddLine />}
                      variant={v}
                      appearance="inverted"
                      size="md"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* ── Contextual icons ─────────────────────────────────────── */}
            <div className="space-y-6">
              <p className="font-mono text-2xs tracking-[0.15em] text-text-muted uppercase">Contextual — real-world actions</p>
              <div className="flex flex-wrap items-center gap-3">
                <IconButton aria-label="Send" icon={<RiSendPlaneLine />} variant="brand" appearance="filled" size="md" />
                <IconButton aria-label="Add" icon={<RiAddLine />} variant="brand" appearance="tonal" size="md" />
                <IconButton aria-label="Refresh" icon={<RiRefreshLine />} variant="neutral" appearance="outline" size="md" />
                <IconButton aria-label="External link" icon={<RiExternalLinkLine />} variant="neutral" appearance="ghost" size="md" />
                <IconButton aria-label="Delete" icon={<RiDeleteBinLine />} variant="danger" appearance="tonal" size="md" />
                <IconButton aria-label="Alert" icon={<RiAlertLine />} variant="warning" appearance="tonal" size="md" />
                <IconButton aria-label="Confirmed" icon={<RiCheckboxCircleLine />} variant="success" appearance="tonal" size="md" />
                <IconButton aria-label="Wallet" icon={<RiWalletLine />} variant="brand" appearance="filled" size="md" shape="pill" />
                <IconButton aria-label="Shield" icon={<RiShieldCheckLine />} variant="success" appearance="filled" size="md" shape="pill" />
                <IconButton aria-label="Delete" icon={<RiDeleteBinLine />} variant="danger" appearance="filled" size="md" shape="pill" />
              </div>
            </div>

            {/* ── States ───────────────────────────────────────────────── */}
            <div className="space-y-6">
              <p className="font-mono text-2xs tracking-[0.15em] text-text-muted uppercase">States — filled brand</p>
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center gap-2">
                  <IconButton aria-label="Default" icon={<RiSendPlaneLine />} variant="brand" size="md" />
                  <span className="font-mono text-[9px] text-text-disabled uppercase tracking-widest">default</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <IconButton aria-label="Disabled" icon={<RiSendPlaneLine />} variant="brand" size="md" disabled />
                  <span className="font-mono text-[9px] text-text-disabled uppercase tracking-widest">disabled</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <IconButton aria-label="Loading" icon={<RiSendPlaneLine />} variant="brand" size="md" loading />
                  <span className="font-mono text-[9px] text-text-disabled uppercase tracking-widest">loading</span>
                </div>
                <div className="w-px h-10 bg-white/[0.06]" />
                <div className="flex flex-col items-center gap-2">
                  <IconButton aria-label="Tonal loading" icon={<RiRefreshLine />} variant="brand" appearance="tonal" size="md" loading />
                  <span className="font-mono text-[9px] text-text-disabled uppercase tracking-widest">tonal loading</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <IconButton aria-label="Ghost loading" icon={<RiRefreshLine />} variant="neutral" appearance="ghost" size="md" loading />
                  <span className="font-mono text-[9px] text-text-disabled uppercase tracking-widest">ghost loading</span>
                </div>
              </div>
            </div>

            {/* ── Cross-variant hover ───────────────────────────────────── */}
            <div className="space-y-6">
              <p className="font-mono text-2xs tracking-[0.15em] text-text-muted uppercase">Cross-variant hover — icon buttons too</p>
              <div className="flex flex-wrap items-end gap-6">
                <div className="flex flex-col items-center gap-2">
                  <IconButton aria-label="Delete" icon={<RiDeleteBinLine />} variant="neutral" hoverVariant="danger" appearance="tonal" size="md" />
                  <span className="font-mono text-[9px] text-text-disabled uppercase tracking-widest">tonal neutral → danger</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <IconButton aria-label="Delete" icon={<RiDeleteBinLine />} variant="neutral" hoverVariant="danger" appearance="outline" size="md" />
                  <span className="font-mono text-[9px] text-text-disabled uppercase tracking-widest">outline neutral → danger</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <IconButton aria-label="Alert" icon={<RiAlertLine />} variant="neutral" hoverVariant="warning" appearance="ghost" size="md" />
                  <span className="font-mono text-[9px] text-text-disabled uppercase tracking-widest">ghost neutral → warning</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <IconButton aria-label="Send" icon={<RiSendPlaneLine />} variant="neutral" hoverVariant="brand" appearance="filled" size="md" shape="pill" />
                  <span className="font-mono text-[9px] text-text-disabled uppercase tracking-widest">filled neutral → brand</span>
                </div>
              </div>
            </div>

          </div>
        </Section>

        {/* ==============================================================
            09. TEXT INPUT
            ============================================================== */}
        <Section
          id="text-input"
          num="09"
          title="Text Input"
          subtitle="Token-driven, Framer Motion animated focus ring. All states, all adornment slots, prefix/suffix text, clear, password toggle, and character count."
        >
          <div className="space-y-20">

            {/* --- Sizes × Icons --- */}
            <div>
              <div className="flex items-center gap-4 mb-3">
                <h3 className="font-mono text-[10px] tracking-[0.3em] text-text-muted uppercase">Sizes</h3>
                <div className="flex-1 h-px bg-border-subtle" />
                <span className="font-mono text-[9px] text-text-disabled">sm · md · lg  ×  plain · leading · trailing · combined · clear · password · error · warning · success · loading</span>
              </div>
              <div className="flex flex-col gap-8 px-8 py-8 rounded-3xl border border-white/[0.04] bg-surface-sunken/40">
                {(["sm", "md", "lg"] as const).map((sz) => (
                  <div key={sz} className="flex flex-col gap-3">
                    {/* Size label */}
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[9px] text-text-brand uppercase tracking-widest shrink-0">{sz}</span>
                      <div className="flex-1 h-px bg-white/[0.04]" />
                    </div>
                    {/* 5-col grid — 2 rows of 5 */}
                    <div className="grid grid-cols-5 gap-x-3 gap-y-4">

                      <div className="flex flex-col gap-1">
                        <TextInput size={sz} placeholder="Placeholder" />
                        <span className="font-mono text-[8px] text-text-disabled">plain</span>
                      </div>

                      <div className="flex flex-col gap-1">
                        <TextInput size={sz} leadingIcon={<RiSearchLine />} placeholder="Search…" />
                        <span className="font-mono text-[8px] text-text-disabled">leading icon</span>
                      </div>

                      <div className="flex flex-col gap-1">
                        <TextInput size={sz} trailingIcon={<RiCalendarLine />} placeholder="Pick date" />
                        <span className="font-mono text-[8px] text-text-disabled">trailing icon</span>
                      </div>

                      <div className="flex flex-col gap-1">
                        <TextInput size={sz} leadingIcon={<RiMailLine />} trailingIcon={<RiAttachmentLine />} placeholder="Compose" />
                        <span className="font-mono text-[8px] text-text-disabled">leading + trailing</span>
                      </div>

                      <div className="flex flex-col gap-1">
                        <TextInput size={sz} clearable defaultValue="USDC / ETH" />
                        <span className="font-mono text-[8px] text-text-disabled">clearable</span>
                      </div>

                      <div className="flex flex-col gap-1">
                        <TextInput size={sz} type="password" defaultValue="s3cr3t!" />
                        <span className="font-mono text-[8px] text-text-disabled">password toggle</span>
                      </div>

                      <div className="flex flex-col gap-1">
                        <TextInput size={sz} state="error" defaultValue="bad@" />
                        <span className="font-mono text-[8px] text-text-disabled">error</span>
                      </div>

                      <div className="flex flex-col gap-1">
                        <TextInput size={sz} state="warning" defaultValue="weak123" />
                        <span className="font-mono text-[8px] text-text-disabled">warning</span>
                      </div>

                      <div className="flex flex-col gap-1">
                        <TextInput size={sz} state="success" defaultValue="valid.eth" />
                        <span className="font-mono text-[8px] text-text-disabled">success</span>
                      </div>

                      <div className="flex flex-col gap-1">
                        <TextInput size={sz} state="loading" defaultValue="checking…" />
                        <span className="font-mono text-[8px] text-text-disabled">loading</span>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* --- Core states --- */}
            <div>
              <div className="flex items-center gap-4 mb-3">
                <h3 className="font-mono text-[10px] tracking-[0.3em] text-text-muted uppercase">Core States</h3>
                <div className="flex-1 h-px bg-border-subtle" />
                <span className="font-mono text-[9px] text-text-disabled">default · filled · disabled · read-only</span>
              </div>
              <div className="grid grid-cols-2 gap-4 px-8 py-8 rounded-3xl border border-white/[0.04] bg-surface-sunken/40">
                <div className="flex flex-col gap-1.5">
                  <TextInput label="Default" placeholder="Click to focus" />
                  <span className="font-mono text-[8px] text-text-disabled">hover + focus border animates to brand</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <TextInput label="Filled" defaultValue="0x4f3e...9aB2" placeholder="Value" />
                  <span className="font-mono text-[8px] text-text-disabled">has value, unfocused</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <TextInput label="Disabled" placeholder="Not interactive" disabled />
                  <span className="font-mono text-[8px] text-text-disabled">opacity-40, pointer-events-none</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <TextInput label="Read-only" defaultValue="0x4f3e...9aB2" readOnly />
                  <span className="font-mono text-[8px] text-text-disabled">selectable, not editable, lighter bg</span>
                </div>
              </div>
            </div>

            {/* --- Validation states --- */}
            <div>
              <div className="flex items-center gap-4 mb-3">
                <h3 className="font-mono text-[10px] tracking-[0.3em] text-text-muted uppercase">Validation States</h3>
                <div className="flex-1 h-px bg-border-subtle" />
                <span className="font-mono text-[9px] text-text-disabled">error · warning · success · loading</span>
              </div>
              <div className="grid grid-cols-2 gap-4 px-8 py-8 rounded-3xl border border-white/[0.04] bg-surface-sunken/40">
                <TextInput
                  label="Error"
                  state="error"
                  defaultValue="name@"
                  errorMessage="Enter a valid email address"
                />
                <TextInput
                  label="Warning"
                  state="warning"
                  defaultValue="password123"
                  warningMessage="Weak password — add symbols or uppercase"
                />
                <TextInput
                  label="Success"
                  state="success"
                  defaultValue="delanoy.eth"
                  helperText="Handle is available"
                />
                <TextInput
                  label="Loading"
                  state="loading"
                  defaultValue="delanoy"
                  helperText="Checking availability…"
                />
              </div>
            </div>

            {/* --- Label variations --- */}
            <div>
              <div className="flex items-center gap-4 mb-3">
                <h3 className="font-mono text-[10px] tracking-[0.3em] text-text-muted uppercase">Label Variations</h3>
                <div className="flex-1 h-px bg-border-subtle" />
                <span className="font-mono text-[9px] text-text-disabled">required · optional · no label</span>
              </div>
              <div className="grid grid-cols-3 gap-4 px-8 py-8 rounded-3xl border border-white/[0.04] bg-surface-sunken/40">
                <TextInput label="Wallet Address" required placeholder="0x…" />
                <TextInput label="Display Name" optional placeholder="Satoshi" />
                <TextInput placeholder="No label — placeholder only" />
              </div>
            </div>

            {/* --- Leading slot --- */}
            <div>
              <div className="flex items-center gap-4 mb-3">
                <h3 className="font-mono text-[10px] tracking-[0.3em] text-text-muted uppercase">Leading Slot</h3>
                <div className="flex-1 h-px bg-border-subtle" />
                <span className="font-mono text-[9px] text-text-disabled">icon · prefix text</span>
              </div>
              <div className="grid grid-cols-2 gap-4 px-8 py-8 rounded-3xl border border-white/[0.04] bg-surface-sunken/40">
                <div className="flex flex-col gap-1.5">
                  <TextInput label="Leading icon" leadingIcon={<RiSearchLine />} placeholder="Search transactions…" />
                  <span className="font-mono text-[8px] text-text-disabled">icon shifts to brand on focus</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <TextInput label="Leading icon" leadingIcon={<RiMailLine />} placeholder="name@domain.com" type="email" />
                  <span className="font-mono text-[8px] text-text-disabled">email field</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <TextInput label="Prefix text" prefix="$" placeholder="0.00" />
                  <span className="font-mono text-[8px] text-text-disabled">inline currency symbol</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <TextInput label="Prefix text" prefix="+1 " placeholder="(555) 000-0000" />
                  <span className="font-mono text-[8px] text-text-disabled">country code</span>
                </div>
              </div>
            </div>

            {/* --- Trailing slot --- */}
            <div>
              <div className="flex items-center gap-4 mb-3">
                <h3 className="font-mono text-[10px] tracking-[0.3em] text-text-muted uppercase">Trailing Slot</h3>
                <div className="flex-1 h-px bg-border-subtle" />
                <span className="font-mono text-[9px] text-text-disabled">icon · clear · password toggle</span>
              </div>
              <div className="grid grid-cols-2 gap-4 px-8 py-8 rounded-3xl border border-white/[0.04] bg-surface-sunken/40">
                <div className="flex flex-col gap-1.5">
                  <TextInput label="Trailing icon" trailingIcon={<RiCalendarLine />} placeholder="DD / MM / YYYY" />
                  <span className="font-mono text-[8px] text-text-disabled">static icon, always visible</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <TextInput label="Clear button" clearable defaultValue="USDC / ETH" placeholder="Token pair" />
                  <span className="font-mono text-[8px] text-text-disabled">× appears when has value</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <TextInput label="Password toggle" type="password" defaultValue="s3cr3tPassphrase!" />
                  <span className="font-mono text-[8px] text-text-disabled">eye toggle swaps text ↔ password type</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <TextInput
                    label="Leading + trailing"
                    leadingIcon={<RiWalletLine />}
                    trailingIcon={<RiQrCodeLine />}
                    placeholder="Paste or scan address"
                  />
                  <span className="font-mono text-[8px] text-text-disabled">both slots occupied</span>
                </div>
              </div>
            </div>

            {/* --- Suffix text --- */}
            <div>
              <div className="flex items-center gap-4 mb-3">
                <h3 className="font-mono text-[10px] tracking-[0.3em] text-text-muted uppercase">Prefix + Suffix</h3>
                <div className="flex-1 h-px bg-border-subtle" />
                <span className="font-mono text-[9px] text-text-disabled">inline text adornments</span>
              </div>
              <div className="grid grid-cols-3 gap-4 px-8 py-8 rounded-3xl border border-white/[0.04] bg-surface-sunken/40">
                <TextInput label="Amount" prefix="$" suffix="USD" placeholder="0.00" />
                <TextInput label="Handle" suffix=".eth" placeholder="yourname" />
                <TextInput label="Subdomain" prefix="https://" suffix=".token.xyz" placeholder="team" />
              </div>
            </div>

            {/* --- Character count --- */}
            <div>
              <div className="flex items-center gap-4 mb-3">
                <h3 className="font-mono text-[10px] tracking-[0.3em] text-text-muted uppercase">Character Count</h3>
                <div className="flex-1 h-px bg-border-subtle" />
                <span className="font-mono text-[9px] text-text-disabled">amber at 90% · red at 100%</span>
              </div>
              <div className="grid grid-cols-2 gap-6 px-8 py-8 rounded-3xl border border-white/[0.04] bg-surface-sunken/40">
                <TextInput
                  label="Bio"
                  maxLength={160}
                  helperText="Shown on your public profile"
                  placeholder="Tell the network who you are…"
                />
                <TextInput
                  label="Memo"
                  maxLength={32}
                  defaultValue="Payment for ETH →"
                  helperText="Attached to the transaction"
                />
              </div>
            </div>

            {/* --- Width --- */}
            <div>
              <div className="flex items-center gap-4 mb-3">
                <h3 className="font-mono text-[10px] tracking-[0.3em] text-text-muted uppercase">Width</h3>
                <div className="flex-1 h-px bg-border-subtle" />
                <span className="font-mono text-[9px] text-text-disabled">fullWidth (default) · fixed via className</span>
              </div>
              <div className="flex flex-col gap-4 px-8 py-8 rounded-3xl border border-white/[0.04] bg-surface-sunken/40">
                {/* Full width */}
                <div className="flex flex-col gap-1.5">
                  <TextInput placeholder="Full width — stretches to container" />
                  <span className="font-mono text-[8px] text-text-disabled">fullWidth={"{true}"} (default)</span>
                </div>
                {/* Fixed widths */}
                <div className="flex flex-wrap items-end gap-4">
                  {([
                    { label: "w-32 (128px)", cls: "w-32" },
                    { label: "w-48 (192px)", cls: "w-48" },
                    { label: "w-64 (256px)", cls: "w-64" },
                    { label: "w-80 (320px)", cls: "w-80" },
                    { label: "w-96 (384px)", cls: "w-96" },
                  ] as const).map(({ label, cls }) => (
                    <div key={cls} className="flex flex-col gap-1.5">
                      <TextInput fullWidth={false} className={cls} placeholder={label} />
                      <span className="font-mono text-[8px] text-text-disabled">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* --- Real-world examples --- */}
            <div>
              <div className="flex items-center gap-4 mb-3">
                <h3 className="font-mono text-[10px] tracking-[0.3em] text-text-muted uppercase">Real-world Examples</h3>
                <div className="flex-1 h-px bg-border-subtle" />
                <span className="font-mono text-[9px] text-text-disabled">wallet · email · password · search</span>
              </div>
              <div className="grid grid-cols-2 gap-6 px-8 py-8 rounded-3xl border border-white/[0.04] bg-surface-sunken/40">
                <TextInput
                  label="Recipient Address"
                  required
                  leadingIcon={<RiWalletLine />}
                  clearable
                  placeholder="0x or ENS name"
                  helperText="Ethereum mainnet · double-check before sending"
                />
                <TextInput
                  label="Email"
                  type="email"
                  leadingIcon={<RiMailLine />}
                  state="error"
                  defaultValue="delanoy@"
                  errorMessage="Enter a valid email address"
                />
                <TextInput
                  label="Passphrase"
                  required
                  type="password"
                  leadingIcon={<RiLockLine />}
                  defaultValue="correcthorsebatterystaple"
                  helperText="Min. 12 chars · mixed case + symbols"
                />
                <TextInput
                  placeholder="Search assets, txns, addresses…"
                  leadingIcon={<RiSearchLine />}
                  clearable
                  defaultValue="USDC"
                  size="md"
                />
              </div>
            </div>

          </div>
        </Section>

        {/* ================================================================
            SECTION 10 — TEXTAREA
            ================================================================ */}
        <Section id="textarea" num="10" title="Textarea" subtitle="Auto-resize, minRows/maxRows, clearable, full validation states, and character count — same token system as TextInput.">
          <div className="flex flex-col gap-16">

            {/* ── Sizes ───────────────────────────────────────────────── */}
            <div className="flex flex-col gap-6">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)]">Sizes</h3>
              <div className="grid grid-cols-3 gap-6">
                {(["sm", "md", "lg"] as const).map((sz) => (
                  <div key={sz} className="flex flex-col gap-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-disabled)]">{sz}</span>
                    <TextArea size={sz} placeholder="Type something…" minRows={3} />
                  </div>
                ))}
              </div>
            </div>

            {/* ── Core States ─────────────────────────────────────────── */}
            <div className="flex flex-col gap-6">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)]">Core States</h3>
              <div className="grid grid-cols-2 gap-6">
                <TextArea label="Default" placeholder="Click to focus" />
                <TextArea label="Filled" defaultValue={"Ethereum is a decentralised platform that runs smart contracts.\nNo downtime, censorship, fraud or third-party interference."} />
                <TextArea label="Disabled" placeholder="Not interactive" disabled />
                <TextArea label="Read-only" defaultValue={"This content cannot be edited.\nIt is displayed as-is."} readOnly />
              </div>
            </div>

            {/* ── Validation States ───────────────────────────────────── */}
            <div className="flex flex-col gap-6">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)]">Validation States</h3>
              <div className="grid grid-cols-2 gap-6">
                <TextArea
                  label="Error"
                  state="error"
                  defaultValue="This text contains a problem."
                  errorMessage="Please revise the content above."
                />
                <TextArea
                  label="Warning"
                  state="warning"
                  defaultValue="Proceed with caution on this one."
                  warningMessage="This may cause unintended side effects."
                />
                <TextArea
                  label="Success"
                  state="success"
                  defaultValue="Verified and approved content."
                  helperText="Looks good — ready to submit."
                />
                <TextArea
                  label="Loading"
                  state="loading"
                  defaultValue="Checking content…"
                  helperText="Running validation, please wait."
                />
              </div>
            </div>

            {/* ── Label Variations ────────────────────────────────────── */}
            <div className="flex flex-col gap-6">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)]">Label Variations</h3>
              <div className="grid grid-cols-3 gap-6">
                <TextArea label="With label" placeholder="Enter notes…" />
                <TextArea label="Required field" required placeholder="Must be filled" />
                <TextArea label="Optional field" optional placeholder="Feel free to skip" />
                <TextArea placeholder="No label" helperText="Helper text without a label above" />
                <TextArea
                  label="With helper text"
                  helperText="Supports markdown formatting."
                  placeholder="Write your bio…"
                />
                <TextArea
                  label="Label + required + helper"
                  required
                  helperText="Used for display on your public profile."
                  placeholder="Describe your project…"
                />
              </div>
            </div>

            {/* ── Auto-resize ─────────────────────────────────────────── */}
            <div className="flex flex-col gap-6">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)]">Auto-resize</h3>
              <div className="grid grid-cols-2 gap-6">
                <TextArea
                  label="Auto-resize (default)"
                  placeholder="Type to grow…"
                  helperText="Grows with content, no upper limit."
                  minRows={2}
                />
                <TextArea
                  label="Capped at 5 rows"
                  placeholder="Type past 5 lines to see scroll…"
                  helperText="maxRows={5} — scrolls beyond the cap."
                  minRows={2}
                  maxRows={5}
                />
                <TextArea
                  label="Fixed height (no auto-resize)"
                  placeholder="Native resize handle visible…"
                  helperText="autoResize={false} — drag the corner to resize."
                  autoResize={false}
                  minRows={4}
                />
                <TextArea
                  label="No resize handle"
                  placeholder="Size locked…"
                  helperText="autoResize={false} resize=&quot;none&quot;"
                  autoResize={false}
                  resize="none"
                  minRows={4}
                />
              </div>
            </div>

            {/* ── Character Count ─────────────────────────────────────── */}
            <div className="flex flex-col gap-6">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)]">Character Count</h3>
              <div className="grid grid-cols-3 gap-6">
                <TextArea
                  label="280 char limit"
                  maxLength={280}
                  placeholder="What's on your mind?"
                  helperText="Tweet-length note."
                  minRows={3}
                />
                <TextArea
                  label="Near limit (warning)"
                  maxLength={280}
                  defaultValue={"Almost at the limit — just a few more words and the counter turns amber to signal you are getting close to the maximum allowed character count."}
                  minRows={3}
                />
                <TextArea
                  label="At limit (danger)"
                  maxLength={100}
                  defaultValue={"This textarea has exactly one hundred characters of content to show the danger counter state!!"}
                  minRows={3}
                />
              </div>
            </div>

            {/* ── Clearable ───────────────────────────────────────────── */}
            <div className="flex flex-col gap-6">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)]">Clearable</h3>
              <div className="grid grid-cols-2 gap-6">
                <TextArea
                  label="Clearable"
                  clearable
                  defaultValue={"Click the × in the corner to erase all content in one go."}
                  helperText="Clear button appears when field has content."
                  minRows={3}
                />
                <TextArea
                  label="Clearable + char count"
                  clearable
                  maxLength={200}
                  defaultValue={"Combined clear button with character counter below."}
                  minRows={3}
                />
              </div>
            </div>

            {/* ── Width ───────────────────────────────────────────────── */}
            <div className="flex flex-col gap-6">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)]">Width</h3>
              <TextArea label="Full width (default)" placeholder="Stretches to fill container" />
              <div className="flex flex-wrap gap-4 items-start">
                {(["w-48", "w-64", "w-80", "w-96"] as const).map((w) => (
                  <TextArea
                    key={w}
                    fullWidth={false}
                    className={w}
                    label={w}
                    placeholder="Fixed width"
                    minRows={2}
                  />
                ))}
              </div>
            </div>

            {/* ── Real-world Example ──────────────────────────────────── */}
            <div className="flex flex-col gap-6">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)]">Real-world Example</h3>
              <div className="grid grid-cols-2 gap-6 px-8 py-8 rounded-3xl border border-white/[0.04] bg-surface-sunken/40">
                <TextArea
                  label="Transaction Note"
                  optional
                  placeholder="Add a private memo for this transaction…"
                  helperText="Visible only to you · stored off-chain"
                  maxLength={140}
                  minRows={2}
                  maxRows={6}
                />
                <TextArea
                  label="Smart Contract ABI"
                  required
                  placeholder='[{"inputs":[],"name":"balanceOf"…}]'
                  helperText="Paste a valid JSON ABI fragment"
                  autoResize={false}
                  resize="vertical"
                  minRows={4}
                  state="error"
                  errorMessage="Invalid JSON — check formatting"
                />
                <TextArea
                  label="Project Description"
                  required
                  placeholder="Describe your DeFi protocol in a few sentences…"
                  maxLength={300}
                  minRows={3}
                  maxRows={8}
                  clearable
                  className="col-span-2"
                />
              </div>
            </div>

          </div>
        </Section>

        {/* ================================================================
            CHECKBOXES
            ================================================================ */}
        <Section id="checkboxes" num="11" title="Checkboxes">
          <CheckboxesSection />
        </Section>

        {/* ================================================================
            RADIO BUTTONS
            ================================================================ */}
        <Section id="radio-buttons" num="12" title="Radio Buttons">
          <RadioButtonsSection />
        </Section>

        {/* ================================================================
            DROPDOWNS
            ================================================================ */}
        <Section id="dropdowns" num="13" title="Dropdowns">
          <DropdownsSection />
        </Section>

        {/* ================================================================
            TOGGLES
            ================================================================ */}
        <Section id="toggles" num="14" title="Toggles" subtitle="Binary on/off controls. Spring-animated thumb with track colour cross-fading to match sentiment.">
          <TogglesSection />
        </Section>

        {/* ================================================================
            AVATARS
            ================================================================ */}
        <Section id="avatars" num="15" title="Avatars" subtitle="Identity components — initials, and silhouette fallbacks. Circle for people, square for vaults and tokens.">
          <AvatarsSection />
        </Section>

        {/* ================================================================
            TOOLTIPS
            ================================================================ */}
        <Section id="tooltips" num="16" title="Tooltips" subtitle="Contextual overlays — label, rich, action, and guided tour. Portal-rendered with direction-aware spring animations and 12 placements.">
          <TooltipsSection />
        </Section>

        <div className="max-w-[1040px] mx-auto w-full pt-32 border-t border-white/[0.04]">
          <DocNav current="/designsystem/atoms" />
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
            <p className="text-sm text-text-muted font-light">Layer 4 Atoms Gallery</p>
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
