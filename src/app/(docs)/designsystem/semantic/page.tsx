"use client";

import { useState, Fragment } from "react";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { DocNav } from "@/components/ui/DocNav";
import { DocsLayout } from "@/components/ui/DocsLayout";
import { cn } from "@/lib/utils";
import {
  RiCheckLine, RiSearchLine, RiCloseLine, RiAlertLine, RiErrorWarningLine,
  RiSettingsLine, RiEyeLine, RiFileCopyLine,
} from "@remixicon/react";

/* ============================================================
   /semantic — Layer 2: Semantic Tokens
   Token v2 — Intent-driven color mapping
   ============================================================ */

// ---------------------------------------------------------------------------
// NAV
// ---------------------------------------------------------------------------

const NAV_ITEMS = [
  { id: "surfaces",    label: "Surfaces",    num: "01" },
  { id: "border",      label: "Border",      num: "02" },
  { id: "text",        label: "Text",        num: "03" },
  { id: "icon",        label: "Icon",        num: "04" },
  { id: "interactive", label: "Interactive",  num: "05" },
  { id: "button",      label: "Button",      num: "06" },
  { id: "input",       label: "Input & Control", num: "07" },
];

// ---------------------------------------------------------------------------
// Token row data type
// ---------------------------------------------------------------------------

type TokenDef = {
  token: string;          // CSS var name (without --)
  primitive: string;      // Which primitive it maps to
  hex: string;            // Resolved hex
  consumers?: string[];   // Which components use it
  note?: string;          // Extra info
};

// ---------------------------------------------------------------------------
// Utility: copy to clipboard
// ---------------------------------------------------------------------------

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  return (
    <button
      onClick={handleCopy}
      className="p-1 rounded hover:bg-white/[0.06] transition-colors"
      title="Copy"
    >
      {copied ? (
        <RiCheckLine className="w-3 h-3 text-text-brand" />
      ) : (
        <RiFileCopyLine className="w-3 h-3 text-text-disabled hover:text-text-muted transition-colors" />
      )}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Token swatch row — reusable for all sections
// ---------------------------------------------------------------------------

function TokenRow({
  token,
  primitive,
  hex,
  consumers,
  note,
  idx,
  mode = "swatch",
}: TokenDef & { idx: number; mode?: "swatch" | "text" | "border" | "icon" }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: idx * 0.025 }}
      className="group flex items-center gap-4 px-6 py-4 hover:bg-white/[0.015] transition-colors border-b border-white/[0.03] last:border-b-0"
    >
      {/* Swatch */}
      <div className="shrink-0">
        {mode === "swatch" && (
          <div
            className="w-10 h-10 rounded-xl border border-white/[0.06] shadow-sm"
            style={{ backgroundColor: hex }}
          />
        )}
        {mode === "text" && (
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
          >
            <span className="font-display text-lg font-bold" style={{ color: hex }}>Aa</span>
          </div>
        )}
        {mode === "border" && (
          <div
            className="w-10 h-10 rounded-xl bg-transparent"
            style={{ border: `2px solid ${hex}` }}
          />
        )}
        {mode === "icon" && (
          <div className="w-10 h-10 rounded-xl flex items-center justify-center">
            <RiSettingsLine className="w-5 h-5" style={{ color: hex }} />
          </div>
        )}
      </div>

      {/* Token name + primitive */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold text-text-brand tracking-tight">
            --{token}
          </span>
          <CopyButton text={`var(--${token})`} />
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="font-mono text-2xs text-text-muted">
            → {primitive}
          </span>
          <span className="font-mono text-2xs text-text-disabled uppercase tracking-wider">
            {hex}
          </span>
          {note && (
            <span className="font-mono text-2xs text-text-disabled italic">
              {note}
            </span>
          )}
        </div>
      </div>

      {/* Consumers */}
      {consumers && consumers.length > 0 && (
        <div className="hidden md:flex flex-wrap gap-1 shrink-0 max-w-[240px] justify-end">
          {consumers.map((c) => (
            <span
              key={c}
              className="px-2 py-0.5 rounded-md font-mono text-[9px] tracking-wider text-text-muted bg-white/[0.03] border border-white/[0.04]"
            >
              {c}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Token group — wraps rows in a card with a label
// ---------------------------------------------------------------------------

function TokenGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-10 last:mb-0">
      <div className="flex items-center gap-3 mb-4">
        <h3 className="font-mono text-[10px] tracking-[0.3em] text-text-muted uppercase">{label}</h3>
        <div className="flex-1 h-px bg-border-subtle" />
      </div>
      <div className="rounded-2xl border border-white/[0.04] bg-surface-sunken/30 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  SECTION DATA
// ═══════════════════════════════════════════════════════════════════════════

// S01 — Surface
const SURFACE_TOKENS: TokenDef[] = [
  { token: "color-surface-page",     primitive: "neutral-950",   hex: "#0A0A0A", consumers: ["Avatar"], note: "Root canvas · ring separator" },
  { token: "color-surface-sunken",   primitive: "neutral-925",   hex: "#0E1011", consumers: ["Dropdown", "Tooltip"], note: "Inset containers" },
  { token: "color-surface-surface",  primitive: "neutral-800",   hex: "#1C1E1F", consumers: [], note: "No atom consumers yet" },
  { token: "color-surface-elevated", primitive: "neutral-750",   hex: "#2D3436", consumers: ["Avatar", "Tooltip"], note: "Overflow badge, kbd" },
  { token: "color-surface-overlay",  primitive: "neutral-700",   hex: "#454545", consumers: ["Toggle", "Dropdown"], note: "Track off-state, item hover" },
  { token: "color-surface-scrim",    primitive: "rgba(0,0,0,0.6)", hex: "rgba(0,0,0,0.6)", consumers: [], note: "No atom consumers yet" },
];

// S02 — Border
const BORDER_TOKENS: TokenDef[] = [
  { token: "color-border-subtle",  primitive: "neutral-800",  hex: "#1C1E1F", consumers: ["SidebarNav", "Tooltip"] },
  { token: "color-border-default", primitive: "neutral-750",  hex: "#2D3436", consumers: ["Dropdown", "Tooltip"] },
  { token: "color-border-strong",  primitive: "neutral-600",  hex: "#52525B", consumers: ["TextInput", "TextArea"] },
  { token: "color-border-focus",   primitive: "cyan-500",     hex: "#26C9C9", consumers: ["TextInput", "TextArea", "Dropdown"] },
  { token: "color-border-brand",   primitive: "cyan-500",     hex: "#26C9C9", consumers: ["Tooltip"] },
  { token: "color-border-danger",  primitive: "red-500",      hex: "#EF4444", consumers: ["Tooltip"] },
  { token: "color-border-success", primitive: "green-500",    hex: "#22C55E", consumers: ["Tooltip"] },
  { token: "color-border-warning", primitive: "amber-500",    hex: "#F59E0B", consumers: ["Tooltip"] },
];

// S03 — Text
const TEXT_TOKENS: TokenDef[] = [
  { token: "color-text-primary",         primitive: "neutral-0",    hex: "#FFFFFF", consumers: ["Button", "Typography"] },
  { token: "color-text-secondary",       primitive: "neutral-300",  hex: "#C8CACB", consumers: ["Button (tonal)", "TextInput", "Dropdown"] },
  { token: "color-text-muted",           primitive: "neutral-500",  hex: "#6B7280", consumers: ["TextInput", "Dropdown", "SidebarNav"] },
  { token: "color-text-disabled",        primitive: "neutral-700",  hex: "#454545", consumers: ["TextInput", "TextArea"], note: "40% opacity" },
  { token: "color-text-inverse",         primitive: "neutral-950",  hex: "#0A0A0A", consumers: ["Button (inverted)"] },
  { token: "color-text-brand",           primitive: "cyan-400",     hex: "#3CC8C8", consumers: ["Button", "TertiaryButton", "Toggle", "RadioButton"] },
  { token: "color-text-danger",          primitive: "red-400",      hex: "#F87171", consumers: ["Button", "Checkbox", "RadioButton"] },
  { token: "color-text-success",         primitive: "green-400",    hex: "#34D471", consumers: ["Button", "Checkbox", "RadioButton"] },
  { token: "color-text-warning",         primitive: "amber-400",    hex: "#FBBF24", consumers: ["Button", "Checkbox", "RadioButton"] },
  { token: "color-text-danger-on-light", primitive: "red-600",      hex: "#DC2626", consumers: ["Button (inverted)"], note: "White bg context" },
  { token: "color-text-warning-on-light", primitive: "amber-700",   hex: "#B45309", consumers: ["Button (inverted)"], note: "White bg context" },
  { token: "color-text-success-on-light", primitive: "green-700",   hex: "#15803D", consumers: ["Button (inverted)"], note: "White bg context" },
];

// S04 — Icon
const ICON_TOKENS: TokenDef[] = [
  { token: "color-icon-primary",   primitive: "neutral-0",   hex: "#FFFFFF", consumers: [] },
  { token: "color-icon-secondary", primitive: "neutral-300", hex: "#C8CACB", consumers: ["SidebarNav", "Dropdown"] },
  { token: "color-icon-muted",     primitive: "neutral-600", hex: "#52525B", consumers: ["TextInput", "TextArea", "Dropdown", "SidebarNav"] },
  { token: "color-icon-brand",     primitive: "cyan-500",    hex: "#26C9C9", consumers: ["TextInput"] },
  { token: "color-icon-danger",    primitive: "red-500",     hex: "#EF4444", consumers: ["TextInput", "TextArea", "Dropdown"] },
  { token: "color-icon-warning",   primitive: "amber-500",   hex: "#F59E0B", consumers: ["TextInput", "TextArea", "Dropdown"] },
  { token: "color-icon-success",   primitive: "green-500",   hex: "#22C55E", consumers: ["TextInput", "TextArea", "Dropdown"] },
  { token: "color-icon-on-fill",   primitive: "neutral-0",   hex: "#FFFFFF", consumers: ["Checkbox"], note: "On filled controls" },
];

// S05 — Interactive
const INTERACTIVE_BRAND: TokenDef[] = [
  { token: "color-interactive-brand-default",        primitive: "cyan-500",     hex: "#26C9C9", consumers: ["Button (outline)"] },
  { token: "color-interactive-brand-hover",          primitive: "cyan-400",     hex: "#3CC8C8", consumers: [] },
  { token: "color-interactive-brand-active",         primitive: "cyan-600",     hex: "#1EA3A3", consumers: [] },
  { token: "color-interactive-brand-tonal-bg",        primitive: "cyan-950",    hex: "#030F0F", consumers: ["Button (tonal/outline)"] },
  { token: "color-interactive-brand-tonal-bg-hover",  primitive: "cyan-900",    hex: "#072727", consumers: ["Button (tonal/outline)"] },
  { token: "color-interactive-brand-tonal-bg-active", primitive: "cyan-925",    hex: "#051C1C", consumers: ["Button (tonal)"] },
  { token: "color-interactive-brand-tonal-border",    primitive: "cyan-850",    hex: "#0A3535", consumers: ["Button (tonal)"] },
  { token: "color-interactive-brand-ghost-bg-hover",  primitive: "cyan-500 @18%", hex: "color-mix 18%", consumers: ["Button (ghost/outline)"] },
  { token: "color-interactive-brand-ghost-bg-active", primitive: "cyan-500 @26%", hex: "color-mix 26%", consumers: ["Button (ghost)"] },
];

const INTERACTIVE_NEUTRAL: TokenDef[] = [
  { token: "color-interactive-neutral-default",          primitive: "neutral-800",  hex: "#1C1E1F", consumers: ["Button (filled)"] },
  { token: "color-interactive-neutral-hover",            primitive: "neutral-750",  hex: "#2D3436", consumers: ["Button (filled)"] },
  { token: "color-interactive-neutral-active",           primitive: "neutral-900",  hex: "#121315", consumers: ["Button (filled)"] },
  { token: "color-interactive-neutral-tonal-bg",         primitive: "neutral-900",  hex: "#121315", consumers: ["Button (tonal)"] },
  { token: "color-interactive-neutral-tonal-bg-hover",   primitive: "neutral-850",  hex: "#151819", consumers: ["Button (tonal/outline)"] },
  { token: "color-interactive-neutral-tonal-bg-active",  primitive: "neutral-925",  hex: "#0E1011", consumers: ["Button (tonal)"] },
  { token: "color-interactive-neutral-tonal-border",     primitive: "neutral-750",  hex: "#2D3436", consumers: ["Button (tonal)"] },
  { token: "color-interactive-neutral-outline-border",   primitive: "neutral-400",  hex: "#A3A7A8", consumers: ["Button (outline)"] },
  { token: "color-interactive-neutral-ghost-bg-hover",   primitive: "neutral-300 @22%", hex: "color-mix 22%", consumers: ["Button (ghost)"] },
  { token: "color-interactive-neutral-ghost-bg-active",  primitive: "neutral-300 @32%", hex: "color-mix 32%", consumers: ["Button (ghost)"] },
];

const INTERACTIVE_DANGER: TokenDef[] = [
  { token: "color-interactive-danger-default",          primitive: "red-500",   hex: "#EF4444", consumers: ["Button (outline)"] },
  { token: "color-interactive-danger-hover",            primitive: "red-400",   hex: "#F87171", consumers: [] },
  { token: "color-interactive-danger-active",           primitive: "red-600",   hex: "#DC2626", consumers: [] },
  { token: "color-interactive-danger-tonal-bg",         primitive: "red-950",   hex: "#450A0A", consumers: ["Button (tonal/outline)"] },
  { token: "color-interactive-danger-tonal-bg-hover",   primitive: "red-900",   hex: "#7F1D1D", consumers: ["Button (tonal/outline)"] },
  { token: "color-interactive-danger-tonal-bg-active",  primitive: "red-925",   hex: "#621414", consumers: ["Button (tonal)"] },
  { token: "color-interactive-danger-tonal-border",     primitive: "red-900",   hex: "#7F1D1D", consumers: ["Button (tonal)"] },
  { token: "color-interactive-danger-ghost-bg-hover",   primitive: "red-500 @8%",  hex: "color-mix 8%",  consumers: ["Button (ghost)"] },
  { token: "color-interactive-danger-ghost-bg-active",  primitive: "red-500 @13%", hex: "color-mix 13%", consumers: ["Button (ghost)"] },
];

const INTERACTIVE_WARNING: TokenDef[] = [
  { token: "color-interactive-warning-default",          primitive: "amber-500",  hex: "#F59E0B", consumers: ["Button (outline)"] },
  { token: "color-interactive-warning-hover",            primitive: "amber-400",  hex: "#FBBF24", consumers: [] },
  { token: "color-interactive-warning-active",           primitive: "amber-600",  hex: "#D97706", consumers: [] },
  { token: "color-interactive-warning-tonal-bg",         primitive: "amber-950",  hex: "#1F1104", consumers: ["Button (tonal/outline)"] },
  { token: "color-interactive-warning-tonal-bg-hover",   primitive: "amber-900",  hex: "#422006", consumers: ["Button (tonal/outline)"] },
  { token: "color-interactive-warning-tonal-bg-active",  primitive: "amber-925",  hex: "#311A05", consumers: ["Button (tonal)"] },
  { token: "color-interactive-warning-tonal-border",     primitive: "amber-900",  hex: "#422006", consumers: ["Button (tonal)"] },
  { token: "color-interactive-warning-ghost-bg-hover",   primitive: "amber-500 @8%",  hex: "color-mix 8%",  consumers: ["Button (ghost)"] },
  { token: "color-interactive-warning-ghost-bg-active",  primitive: "amber-500 @13%", hex: "color-mix 13%", consumers: ["Button (ghost)"] },
];

const INTERACTIVE_SUCCESS: TokenDef[] = [
  { token: "color-interactive-success-default",          primitive: "green-500",  hex: "#22C55E", consumers: ["Button (outline)"] },
  { token: "color-interactive-success-hover",            primitive: "green-400",  hex: "#34D471", consumers: [] },
  { token: "color-interactive-success-active",           primitive: "green-600",  hex: "#16A34A", consumers: [] },
  { token: "color-interactive-success-tonal-bg",         primitive: "green-950",  hex: "#031710", consumers: ["Button (tonal/outline)"] },
  { token: "color-interactive-success-tonal-bg-hover",   primitive: "green-900",  hex: "#052E21", consumers: ["Button (tonal/outline)"] },
  { token: "color-interactive-success-tonal-bg-active",  primitive: "green-925",  hex: "#042218", consumers: ["Button (tonal)"] },
  { token: "color-interactive-success-tonal-border",     primitive: "green-900",  hex: "#052E21", consumers: ["Button (tonal)"] },
  { token: "color-interactive-success-ghost-bg-hover",   primitive: "green-500 @8%",  hex: "color-mix 8%",  consumers: ["Button (ghost)"] },
  { token: "color-interactive-success-ghost-bg-active",  primitive: "green-500 @13%", hex: "color-mix 13%", consumers: ["Button (ghost)"] },
];

// S06 — Button Component Tokens
const BUTTON_FILLED_TOKENS: TokenDef[] = [
  { token: "color-button-brand-bg",      primitive: "cyan-700",    hex: "#1A7E7E", consumers: ["Button"], note: "4.57:1 WCAG AA ✓" },
  { token: "color-button-brand-hover",   primitive: "cyan-600",    hex: "#1EA3A3", consumers: ["Button"] },
  { token: "color-button-brand-active",  primitive: "cyan-800",    hex: "#0E4949", consumers: ["Button"] },
  { token: "color-button-danger-bg",     primitive: "red-600",     hex: "#DC2626", consumers: ["Button"], note: "4.88:1 WCAG AA ✓" },
  { token: "color-button-danger-hover",  primitive: "red-500",     hex: "#EF4444", consumers: ["Button"] },
  { token: "color-button-danger-active", primitive: "red-700",     hex: "#B91C1C", consumers: ["Button"] },
  { token: "color-button-warning-bg",    primitive: "amber-700",   hex: "#B45309", consumers: ["Button"], note: "4.77:1 WCAG AA ✓" },
  { token: "color-button-warning-hover", primitive: "amber-600",   hex: "#D97706", consumers: ["Button"] },
  { token: "color-button-warning-active", primitive: "amber-750",  hex: "#92400E", consumers: ["Button"] },
  { token: "color-button-success-bg",    primitive: "green-700",   hex: "#15803D", consumers: ["Button"], note: "4.86:1 WCAG AA ✓" },
  { token: "color-button-success-hover", primitive: "green-600",   hex: "#16A34A", consumers: ["Button"] },
  { token: "color-button-success-active", primitive: "green-750",  hex: "#0F6B35", consumers: ["Button"] },
];

const BUTTON_INVERTED_TOKENS: TokenDef[] = [
  { token: "color-button-inverted-bg",              primitive: "neutral-0",    hex: "#FFFFFF", consumers: ["Button"] },
  { token: "color-button-inverted-hover",           primitive: "neutral-50",   hex: "#F8FCFF", consumers: ["Button"] },
  { token: "color-button-inverted-active",          primitive: "neutral-100",  hex: "#EDEEEE", consumers: ["Button"] },
  { token: "color-button-inverted-danger-hover",    primitive: "red-50",       hex: "#FEF2F2", consumers: ["Button"] },
  { token: "color-button-inverted-danger-active",   primitive: "red-100",      hex: "#FEE2E2", consumers: ["Button"] },
  { token: "color-button-inverted-warning-hover",   primitive: "amber-50",     hex: "#FFFBEB", consumers: ["Button"] },
  { token: "color-button-inverted-warning-active",  primitive: "amber-100",    hex: "#FEF3C7", consumers: ["Button"] },
  { token: "color-button-inverted-success-hover",   primitive: "green-50",     hex: "#EDFFF4", consumers: ["Button"] },
  { token: "color-button-inverted-success-active",  primitive: "green-100",    hex: "#D1FAE5", consumers: ["Button"] },
];

// S07 — Input & Control Component Tokens
const INPUT_TOKENS: TokenDef[] = [
  { token: "color-input-bg",             primitive: "surface-sunken", hex: "#0E1011", consumers: ["TextInput", "TextArea", "Checkbox", "RadioButton", "Dropdown"] },
  { token: "color-input-bg-readonly",    primitive: "neutral-900",    hex: "#121315", consumers: ["TextInput", "TextArea"] },
  { token: "color-input-border",         primitive: "border-default", hex: "#2D3436", consumers: ["TextInput", "TextArea", "Checkbox", "RadioButton", "Dropdown"] },
  { token: "color-input-border-hover",   primitive: "border-strong",  hex: "#52525B", consumers: ["TextInput", "TextArea", "Dropdown"] },
  { token: "color-input-border-focus",   primitive: "border-brand",   hex: "#26C9C9", consumers: ["TextInput", "TextArea", "Dropdown"] },
  { token: "color-input-border-error",   primitive: "border-danger",  hex: "#EF4444", consumers: ["TextInput", "TextArea", "Checkbox", "RadioButton", "Dropdown"] },
  { token: "color-input-border-warning", primitive: "border-warning", hex: "#F59E0B", consumers: ["TextInput", "TextArea", "Checkbox", "RadioButton", "Dropdown"] },
  { token: "color-input-border-success", primitive: "border-success", hex: "#22C55E", consumers: ["TextInput", "TextArea", "Checkbox", "RadioButton", "Dropdown"] },
];

const LABEL_TOKENS: TokenDef[] = [
  { token: "color-label-default",  primitive: "text-secondary", hex: "#C8CACB", consumers: ["TextInput", "TextArea", "Checkbox", "RadioButton", "Dropdown"] },
  { token: "color-label-focused",  primitive: "text-primary",   hex: "#FFFFFF", consumers: ["TextInput", "TextArea", "Dropdown"] },
  { token: "color-label-disabled", primitive: "text-disabled",  hex: "#454545", consumers: ["Typography"] },
  { token: "color-label-error",    primitive: "text-danger",    hex: "#F87171", consumers: ["TextInput", "TextArea", "Checkbox", "RadioButton", "Dropdown"] },
  { token: "color-label-warning",  primitive: "text-warning",   hex: "#FBBF24", consumers: ["TextInput", "TextArea", "Checkbox", "RadioButton", "Dropdown"] },
  { token: "color-label-success",  primitive: "text-success",   hex: "#34D471", consumers: ["TextInput", "TextArea", "Checkbox", "RadioButton", "Dropdown"] },
  { token: "color-label-required", primitive: "text-danger",    hex: "#F87171", consumers: ["Typography (Label)"] },
  { token: "color-label-optional", primitive: "text-muted",     hex: "#6B7280", consumers: ["Typography (Label)"] },
];

const CONTROL_TOKENS: TokenDef[] = [
  { token: "color-control-fill-brand",   primitive: "cyan-700",  hex: "#1A7E7E", consumers: ["Checkbox", "RadioButton", "Toggle"], note: "4.45:1 ✓" },
  { token: "color-control-fill-danger",  primitive: "red-600",   hex: "#DC2626", consumers: ["Checkbox", "RadioButton", "Toggle"], note: "4.79:1 ✓" },
  { token: "color-control-fill-warning", primitive: "amber-700", hex: "#B45309", consumers: ["Checkbox", "RadioButton", "Toggle"], note: "4.63:1 ✓" },
  { token: "color-control-fill-success", primitive: "green-700", hex: "#15803D", consumers: ["Checkbox", "RadioButton", "Toggle"], note: "4.61:1 ✓" },
  { token: "color-control-tint-brand",   primitive: "cyan-500 @8%",  hex: "color-mix 8%",  consumers: ["Checkbox", "RadioButton", "Toggle", "Dropdown"] },
  { token: "color-control-tint-danger",  primitive: "red-500 @8%",   hex: "color-mix 8%",  consumers: ["Checkbox", "RadioButton", "Toggle", "Dropdown"] },
  { token: "color-control-tint-warning", primitive: "amber-500 @8%", hex: "color-mix 8%",  consumers: ["Checkbox", "RadioButton", "Toggle", "Dropdown"] },
  { token: "color-control-tint-success", primitive: "green-500 @8%", hex: "color-mix 8%",  consumers: ["Checkbox", "RadioButton", "Toggle", "Dropdown"] },
];


// ═══════════════════════════════════════════════════════════════════════════
//  SECTIONS
// ═══════════════════════════════════════════════════════════════════════════

// --- Surface Z-Stack visualizer ---

function SurfacesSection() {
  const layers = SURFACE_TOKENS.filter(t => t.token !== "color-surface-scrim");
  return (
    <div className="space-y-8">
      {/* Visual stack */}
      <div className="relative h-[320px] rounded-2xl border border-white/[0.04] bg-[#0A0A0A] overflow-hidden p-6">
        <div className="absolute inset-0 pointer-events-none">
          {/* Nested rectangles representing depth layers */}
          {layers.map((layer, i) => {
            const inset = 16 + i * 28;
            const opacity = 0.6 + (i * 0.08);
            return (
              <motion.div
                key={layer.token}
                className="absolute rounded-xl border border-white/[0.06]"
                style={{
                  top: inset,
                  left: inset,
                  right: inset,
                  bottom: 320 - inset - (280 - i * 48),
                  backgroundColor: layer.hex,
                  opacity,
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <div className="absolute top-2 left-3 flex items-center gap-2">
                  <span className="font-mono text-[9px] text-white/60 tracking-wider uppercase">{layer.note}</span>
                  <span className="font-mono text-[8px] text-white/30">{layer.hex}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Scrim demo */}
      <div className="flex items-center gap-4 px-6 py-4 rounded-2xl border border-white/[0.04] bg-surface-sunken/30">
        <div className="w-10 h-10 rounded-xl bg-black/60 border border-white/[0.06] flex items-center justify-center">
          <span className="font-mono text-[8px] text-white/40">60%</span>
        </div>
        <div className="flex-1">
          <span className="font-mono text-xs font-semibold text-text-brand tracking-tight">--color-surface-scrim</span>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="font-mono text-2xs text-text-muted">→ rgba(0,0,0,0.6)</span>
            <span className="font-mono text-2xs text-text-disabled italic">Dimming layer for modals/drawers</span>
          </div>
        </div>
      </div>

      {/* Token table */}
      <TokenGroup label="Surface Tokens">
        {SURFACE_TOKENS.map((t, i) => (
          <TokenRow key={t.token} {...t} idx={i} />
        ))}
      </TokenGroup>
    </div>
  );
}

// --- Interactive states visualizer ---

function InteractiveStateStrip({ tokens, label, sentiment }: { tokens: TokenDef[]; label: string; sentiment: string }) {
  const colorTokens = tokens.filter(t => !t.token.includes("ghost") && !t.token.includes("tonal-border"));
  const tonalTokens = tokens.filter(t => t.token.includes("tonal") && !t.token.includes("ghost"));
  const ghostTokens = tokens.filter(t => t.token.includes("ghost"));

  return (
    <div className="mb-10 last:mb-0">
      <div className="flex items-center gap-3 mb-4">
        <h3 className="font-mono text-[10px] tracking-[0.3em] text-text-muted uppercase">{label}</h3>
        <div className="flex-1 h-px bg-border-subtle" />
        <span className="font-mono text-[9px] text-text-disabled">{tokens.length} tokens</span>
      </div>

      {/* State transition strip */}
      <div className="rounded-xl border border-white/[0.04] bg-surface-sunken/30 overflow-hidden mb-4">
        {/* Solid states */}
        <div className="p-4">
          <p className="font-mono text-[8px] text-text-disabled uppercase tracking-[0.2em] mb-3">Solid states</p>
          <div className="flex gap-2">
            {colorTokens.slice(0, 3).map((t, i) => (
              <div key={t.token} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full h-10 rounded-lg border border-white/[0.06]"
                  style={{ backgroundColor: t.hex }}
                />
                <span className="font-mono text-[8px] text-text-muted">
                  {t.token.split("-").pop()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tonal + Ghost */}
        {tonalTokens.length > 0 && (
          <div className="p-4 border-t border-white/[0.03]">
            <p className="font-mono text-[8px] text-text-disabled uppercase tracking-[0.2em] mb-3">Tonal substrates</p>
            <div className="flex gap-2">
              {tonalTokens.map((t) => (
                <div key={t.token} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full h-8 rounded-lg border border-white/[0.08]"
                    style={{ backgroundColor: t.hex.startsWith("#") ? t.hex : undefined }}
                  />
                  <span className="font-mono text-[7px] text-text-disabled leading-tight text-center">
                    {t.token.replace(`color-interactive-${sentiment}-`, "")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Full token table */}
      <div className="rounded-2xl border border-white/[0.04] bg-surface-sunken/30 overflow-hidden">
        {tokens.map((t, i) => (
          <TokenRow key={t.token} {...t} idx={i} />
        ))}
      </div>
    </div>
  );
}

// --- Button WCAG badge ---
function WcagNote({ ratio }: { ratio: string }) {
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded font-mono text-[8px] tracking-wider bg-green-500/10 text-green-400 border border-green-500/20">
      {ratio} ✓ AA
    </span>
  );
}

// --- Button Filled specimens ---
function ButtonFilledSpecimens() {
  const sentiments: { label: string; bgToken: string; hex: string; ratio: string }[] = [
    { label: "Brand",   bgToken: "color-button-brand-bg",   hex: "#1A7E7E", ratio: "4.57:1" },
    { label: "Danger",  bgToken: "color-button-danger-bg",  hex: "#DC2626", ratio: "4.88:1" },
    { label: "Warning", bgToken: "color-button-warning-bg", hex: "#B45309", ratio: "4.77:1" },
    { label: "Success", bgToken: "color-button-success-bg", hex: "#15803D", ratio: "4.86:1" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {sentiments.map(({ label, hex, ratio }) => (
        <div key={label} className="flex flex-col items-center gap-3">
          <div
            className="w-full h-12 rounded-xl flex items-center justify-center border border-white/[0.08]"
            style={{ backgroundColor: hex }}
          >
            <span className="font-sans text-sm font-medium text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
              {label}
            </span>
          </div>
          <WcagNote ratio={ratio} />
        </div>
      ))}
    </div>
  );
}

// --- Control Fill specimens ---
function ControlFillSpecimens() {
  const fills = [
    { label: "Brand",   hex: "#1A7E7E" },
    { label: "Danger",  hex: "#DC2626" },
    { label: "Warning", hex: "#B45309" },
    { label: "Success", hex: "#15803D" },
  ];

  const tints = [
    { label: "Brand",   css: "var(--color-control-tint-brand)" },
    { label: "Danger",  css: "var(--color-control-tint-danger)" },
    { label: "Warning", css: "var(--color-control-tint-warning)" },
    { label: "Success", css: "var(--color-control-tint-success)" },
  ];

  return (
    <div className="space-y-6 mb-8">
      {/* Fill swatches */}
      <div>
        <p className="font-mono text-[8px] text-text-disabled uppercase tracking-[0.2em] mb-3">Fills — opaque backgrounds for checked controls</p>
        <div className="grid grid-cols-4 gap-3">
          {fills.map(({ label, hex }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div className="w-full aspect-square rounded-xl border border-white/[0.06]" style={{ backgroundColor: hex }}>
                <div className="w-full h-full flex items-center justify-center">
                  <RiCheckLine className="w-5 h-5 text-white" />
                </div>
              </div>
              <span className="font-mono text-[9px] text-text-muted">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tint swatches */}
      <div>
        <p className="font-mono text-[8px] text-text-disabled uppercase tracking-[0.2em] mb-3">Tints — 8% opacity hover substrates</p>
        <div className="grid grid-cols-4 gap-3">
          {tints.map(({ label, css }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div
                className="w-full aspect-square rounded-xl border border-white/[0.06]"
                style={{ backgroundColor: css }}
              />
              <span className="font-mono text-[9px] text-text-muted">{label} 8%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  PAGE
// ═══════════════════════════════════════════════════════════════════════════

export default function SemanticTokensPage() {
  return (
    <DocsLayout currentLayer="/designsystem/semantic" items={NAV_ITEMS}>
      {/* ================================================================
          HERO
          ================================================================ */}
      <header className="relative min-h-[70vh] flex flex-col justify-center overflow-hidden border-b border-white/[0.03]">
        {/* Ambient */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] pointer-events-none opacity-15"
            style={{
              background: "radial-gradient(circle at center, rgba(38,201,201,0.12) 0%, transparent 70%)",
            }}
          />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay pointer-events-none" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-12 relative z-10"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-2.5 h-2.5 rounded-full bg-interactive-brand-default" />
              <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-interactive-brand-default animate-ping opacity-40" />
            </div>
            <span className="font-mono text-2xs tracking-[0.2em] text-interactive-brand-default/80 uppercase">
              Intent Mapping — Layer 2
            </span>
          </div>

          <div className="max-w-3xl">
            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tightest leading-[0.95] text-text-primary mb-8">
              Semantic <br />
              <span className="text-text-disabled italic">
                Intent
              </span>
            </h1>
            <p className="text-lg text-text-secondary leading-relaxed font-light max-w-2xl">
              Primitives have no opinion. Semantic tokens assign <em>meaning</em> — mapping
              raw color scales to functional roles like surface, text, border, and interactive
              state. Every component in the system consumes these tokens, never raw values.
            </p>
          </div>

          <div className="flex flex-wrap gap-8 pt-4">
            {[
              { num: "~100", label: "Tokens", detail: "semantic mappings" },
              { num: "19",   label: "Consumers", detail: "atom components" },
              { num: "8",    label: "Categories", detail: "functional groups" },
              { num: "5",    label: "Sentiments", detail: "brand · neutral · danger · warning · success" },
            ].map(({ num, label, detail }) => (
              <div key={label} className="flex flex-col gap-1">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display text-2xl font-bold text-text-primary">{num}</span>
                </div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-interactive-brand-default/60">{label}</span>
                <span className="text-[9px] font-mono text-text-muted">{detail}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </header>

      {/* ================================================================
          CONTENT
          ================================================================ */}
      <div className="py-32 space-y-48">

        {/* ── 01. SURFACES ────────────────────────────────────────────── */}
        <Section
          id="surfaces"
          num="01"
          title="Surfaces"
          subtitle="6 background tiers from page canvas to overlay scrim. Each step lighter than the last — perceived elevation without shadows on a pure-black base."
        >
          <SurfacesSection />
        </Section>

        {/* ── 02. BORDER ──────────────────────────────────────────────── */}
        <Section
          id="border"
          num="02"
          title="Border"
          subtitle="Structural dividers and focus indicators. Neutral hairlines for layout; brand and status colors for interactive feedback."
        >
          <TokenGroup label="Border Tokens">
            {BORDER_TOKENS.map((t, i) => (
              <TokenRow key={t.token} {...t} idx={i} mode="border" />
            ))}
          </TokenGroup>
        </Section>

        {/* ── 03. TEXT ────────────────────────────────────────────────── */}
        <Section
          id="text"
          num="03"
          title="Text"
          subtitle="12 text color tokens spanning the full hierarchy from primary white through disabled gray, plus sentiment colors and on-light variants for inverted contexts."
        >
          <div className="space-y-8">
            <TokenGroup label="Core hierarchy">
              {TEXT_TOKENS.slice(0, 5).map((t, i) => (
                <TokenRow key={t.token} {...t} idx={i} mode="text" />
              ))}
            </TokenGroup>
            <TokenGroup label="Sentiment colors">
              {TEXT_TOKENS.slice(5, 9).map((t, i) => (
                <TokenRow key={t.token} {...t} idx={i} mode="text" />
              ))}
            </TokenGroup>
            <TokenGroup label="On-light variants (inverted surfaces)">
              {TEXT_TOKENS.slice(9).map((t, i) => (
                <TokenRow key={t.token} {...t} idx={i} mode="text" />
              ))}
            </TokenGroup>
          </div>
        </Section>

        {/* ── 04. ICON ───────────────────────────────────────────────── */}
        <Section
          id="icon"
          num="04"
          title="Icon"
          subtitle="8 icon color tokens. Parallel to text hierarchy with an additional on-fill token for icons rendered on filled control backgrounds."
        >
          <TokenGroup label="Icon Tokens">
            {ICON_TOKENS.map((t, i) => (
              <TokenRow key={t.token} {...t} idx={i} mode="icon" />
            ))}
          </TokenGroup>
        </Section>

        {/* ── 05. INTERACTIVE ────────────────────────────────────────── */}
        <Section
          id="interactive"
          num="05"
          title="Interactive States"
          subtitle="5 sentiment palettes × 3 state tiers (solid, tonal, ghost). Drives every button appearance, hover effect, and pressure response across the system."
        >
          <div className="space-y-2">
            <InteractiveStateStrip tokens={INTERACTIVE_BRAND}   label="Brand"   sentiment="brand" />
            <InteractiveStateStrip tokens={INTERACTIVE_NEUTRAL} label="Neutral" sentiment="neutral" />
            <InteractiveStateStrip tokens={INTERACTIVE_DANGER}  label="Danger"  sentiment="danger" />
            <InteractiveStateStrip tokens={INTERACTIVE_WARNING} label="Warning" sentiment="warning" />
            <InteractiveStateStrip tokens={INTERACTIVE_SUCCESS} label="Success" sentiment="success" />
          </div>
        </Section>

        {/* ── 06. BUTTON ─────────────────────────────────────────────── */}
        <Section
          id="button"
          num="06"
          title="Component — Button"
          subtitle="21 component-specific tokens for filled and inverted button backgrounds. WCAG AA compliant (≥4.5:1 with white text) for all filled sentiments."
        >
          <div className="space-y-8">
            {/* Visual specimens */}
            <ButtonFilledSpecimens />

            <TokenGroup label="Filled backgrounds (default · hover · active)">
              {BUTTON_FILLED_TOKENS.map((t, i) => (
                <TokenRow key={t.token} {...t} idx={i} />
              ))}
            </TokenGroup>

            <TokenGroup label="Inverted (white bg on dark surfaces)">
              {BUTTON_INVERTED_TOKENS.map((t, i) => (
                <TokenRow key={t.token} {...t} idx={i} />
              ))}
            </TokenGroup>
          </div>
        </Section>

        {/* ── 07. INPUT & CONTROL ────────────────────────────────────── */}
        <Section
          id="input"
          num="07"
          title="Component — Input & Control"
          subtitle="Form-field backgrounds, borders, label colors, and control fill/tint tokens. Shared by TextInput, TextArea, Checkbox, RadioButton, Toggle, and Dropdown."
        >
          <div className="space-y-8">
            {/* Control specimens */}
            <ControlFillSpecimens />

            <TokenGroup label="Input backgrounds & borders">
              {INPUT_TOKENS.map((t, i) => (
                <TokenRow key={t.token} {...t} idx={i} />
              ))}
            </TokenGroup>

            <TokenGroup label="Label colors">
              {LABEL_TOKENS.map((t, i) => (
                <TokenRow key={t.token} {...t} idx={i} mode="text" />
              ))}
            </TokenGroup>

            <TokenGroup label="Control fills & tints">
              {CONTROL_TOKENS.map((t, i) => (
                <TokenRow key={t.token} {...t} idx={i} />
              ))}
            </TokenGroup>
          </div>
        </Section>

        {/* ── Footer Nav ─────────────────────────────────────────────── */}
        <div className="max-w-[1040px] mx-auto w-full pt-32 border-t border-white/[0.04]">
          <DocNav current="/designsystem/semantic" />
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
            <p className="text-sm text-text-muted font-light">Layer 2 Semantic Tokens</p>
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
