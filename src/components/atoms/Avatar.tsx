"use client";

import React, { useState, useMemo, useRef, useLayoutEffect, useId, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MeshGradientCard, type Pin } from "./MeshGradientCard";
import { Button } from "./Button";
import { cn } from "@/lib/utils";
import { RiCheckLine, RiRefreshLine } from "@remixicon/react";

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

// ─── Preset from a name ──────────────────────────────────────────────────────

/**
 * The presets name-based avatars pick from. Order matters: changing it, or
 * adding to it, gives existing people a different avatar.
 */
export const NAME_AVATAR_PRESETS = [
  "Cyan Dusk", "Deep Sea", "Midnight", "Ember", "Sunset", "Rose Gold", "Emerald",
  "Aurora", "Neon", "Acid", "Chromatic", "Oil Slick", "Candy",
] as const;

/**
 * A stable avatar preset for a person: the one they chose (`chosen`), or one
 * picked from their name, so the same name always gets the same gradient.
 */
export function presetForName(name: string = "", chosen?: string): string {
  if (chosen) return chosen;
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return NAME_AVATAR_PRESETS[Math.abs(hash) % NAME_AVATAR_PRESETS.length];
}

// ─── Size system ─────────────────────────────────────────────────────────────

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

export const AVATAR_SIZES: Record<AvatarSize, number> = {
  xs:    24,
  sm:    32,
  md:    40,
  lg:    48,
  xl:    64,
  "2xl": 80,
  "3xl": 112,
};

function getInitials(name: string): string {
  if (!name || typeof name !== 'string') return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return parts[0].slice(0, 2);
}

// ─── Canvas 2D gradient renderer (replaces WebGL for static display) ─────────
//
// Implements the same IDW (inverse-distance-weighted) blend as the GLSL shader,
// renders once per preset+size combo, caches result as a PNG data URL.
// This avoids the browser's ~8–16 simultaneous WebGL context limit.

const _gradientCache = new Map<string, string>();

function renderGradientPNG(px: number, presetName?: string, pins?: Pin[]): string {
  const pinData = pins || (presetName ? SHADER_PRESETS[presetName] : null);
  if (!pinData) return "";

  const pinsKey = pins ? `pins_${pins.map(p => `${p.x.toFixed(2)}${p.y.toFixed(2)}${p.color}`).join('_')}` : presetName;
  const key = `${pinsKey}_${px}`;
  const hit = _gradientCache.get(key);
  if (hit) return hit;

  if (typeof document === "undefined") return ""; // SSR guard

  // Render at ≤80px; CSS backgroundSize handles upscaling — fast and cache-friendly
  const res = Math.min(px, 80);
  const canvas = document.createElement("canvas");
  canvas.width  = res;
  canvas.height = res;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const img = ctx.createImageData(res, res);
  const d   = img.data;
  // epsilon matches shader's `1/(d²+0.002)` in UV space, scaled to pixel² space
  const eps = 0.002 * res * res;

  const pinsToRender = pinData.map((p) => {
    const h = p.color.replace("#", "");
    return {
      x: p.x * res,
      y: p.y * res,
      r: parseInt(h.slice(0, 2), 16) / 255,
      g: parseInt(h.slice(2, 4), 16) / 255,
      b: parseInt(h.slice(4, 6), 16) / 255,
    };
  });

  for (let row = 0; row < res; row++) {
    for (let col = 0; col < res; col++) {
      let R = 0, G = 0, B = 0, W = 0;
      for (const p of pinsToRender) {
        const dx = col - p.x, dy = row - p.y;
        const w  = 1 / (dx * dx + dy * dy + eps);
        R += p.r * w; G += p.g * w; B += p.b * w; W += w;
      }
      const i = (row * res + col) * 4;
      d[i]     = Math.min(255, (R / W) * 255);
      d[i + 1] = Math.min(255, (G / W) * 255);
      d[i + 2] = Math.min(255, (B / W) * 255);
      d[i + 3] = 255;
    }
  }

  ctx.putImageData(img, 0, 0);
  const url = canvas.toDataURL("image/png");
  _gradientCache.set(key, url);
  return url;
}

// ─── Avatar (static display) ─────────────────────────────────────────────────

export interface AvatarProps {
  /** Full name — initials are extracted automatically */
  name: string;
  size?: AvatarSize;
  /** Preset gradient name, defaults to "Cyan Dusk" */
  preset?: string;
  /** Custom pin configuration (overrides preset) */
  pins?: Pin[];
  /** Show name beside the circle */
  displayName?: boolean;
  /** Secondary line shown when displayName is true */
  metadata?: string;
  /** Alternative text for screen readers (defaults to `name`) */
  alt?: string;
  className?: string;
}

export function Avatar({
  name,
  size = "md",
  preset = "Cyan Dusk",
  pins,
  displayName,
  metadata,
  alt,
  className,
}: AvatarProps) {
  const px = AVATAR_SIZES[size];
  const allInitials = getInitials(name);
  const visibleInitials = px < 30 ? allInitials[0] : allInitials;
  const borderWidth = px < 40 ? 1.5 : px < 64 ? 2 : px < 100 ? 2.5 : 3;

  // Canvas 2D renders the gradient once and caches as a PNG data URL.
  // useLayoutEffect fires before paint on the client, avoiding any visible flash.
  const [bgUrl, setBgUrl] = useState("");
  useLayoutEffect(() => {
    setBgUrl(renderGradientPNG(px, preset, pins));
  }, [preset, pins, px]);

  const circle = (
    <div
      role="img"
      aria-label={alt ?? name}
      className="relative overflow-hidden shrink-0"
      style={{
        width: px,
        height: px,
        borderRadius: px / 2,
        backgroundImage: bgUrl ? `url(${bgUrl})` : undefined,
        backgroundSize: "cover",
        backgroundColor: "var(--color-surface-elevated)",
      }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        style={{ mixBlendMode: "overlay" }}
      >
        <span
          className="font-display font-black text-white leading-none"
          style={{ fontSize: Math.max(9, Math.round(px * 0.38)) }}
        >
          {visibleInitials}
        </span>
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{ boxShadow: `inset 0 0 0 ${borderWidth}px white`, mixBlendMode: "overlay" }}
      />
    </div>
  );

  if (!displayName && !metadata) {
    return className ? <div className={className}>{circle}</div> : circle;
  }

  const gap     = px >= 56 ? "gap-4" : px >= 36 ? "gap-3" : "gap-2";
  const nameCls = px >= 56 ? "text-sm" : "text-xs";
  const metaCls = px >= 56 ? "text-xs" : "text-2xs";

  return (
    <div className={cn("flex items-center", gap, className)}>
      {circle}
      <div className="flex flex-col min-w-0">
        {displayName && (
          <span className={cn(nameCls, "font-medium text-[var(--color-text-primary)] leading-[1.3] tracking-tight truncate")}>{name}</span>
        )}
        {metadata && (
          <span className={cn(metaCls, "text-[var(--color-text-muted)] leading-[1.3] truncate")}>{metadata}</span>
        )}
      </div>
    </div>
  );
}

// ─── AvatarGroup ─────────────────────────────────────────────────────────────

export interface AvatarGroupProps {
  avatars: Array<{ name: string; preset?: string; pins?: Pin[] }>;
  size?: AvatarSize;
  /** Max circles before "+N" overflow badge (default 5) */
  max?: number;
  className?: string;
}

export function AvatarGroup({ avatars, size = "md", max = 5, className }: AvatarGroupProps) {
  const px      = AVATAR_SIZES[size];
  const visible = avatars.slice(0, max);
  const overflow = avatars.length - visible.length;
  const shift   = Math.round(px * 0.28);
  const ring    = "0 0 0 2px var(--color-surface-page)";

  return (
    <div role="list" aria-label="Avatars" className={cn("flex items-center", className)}>
      {visible.map((a, i) => (
        <div
          key={i}
          role="listitem"
          className="rounded-full"
          style={{
            marginLeft: i === 0 ? 0 : -shift,
            boxShadow: ring,
            zIndex: visible.length - i,
          }}
        >
          <Avatar name={a.name} size={size} preset={a.preset ?? "Cyan Dusk"} pins={a.pins} />
        </div>
      ))}
      {overflow > 0 && (
        <div
          role="listitem"
          aria-label={`${overflow} more`}
          className="relative rounded-full flex items-center justify-center shrink-0"
          style={{
            width: px,
            height: px,
            marginLeft: -shift,
            background: "var(--color-surface-elevated)",
            boxShadow: ring,
            zIndex: 0,
          }}
        >
          <span
            aria-hidden="true"
            className="font-mono font-semibold text-[var(--color-text-muted)] leading-none select-none"
            style={{ fontSize: Math.max(8, Math.round(px * 0.3)) }}
          >
            +{overflow}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── AvatarForge (interactive creator) ───────────────────────────────────────

// Shared class for the monospace pill buttons (preset selector + reset)
const PILL_BTN = "px-3 py-1.5 rounded-lg font-mono text-[10px] tracking-wider uppercase transition-all duration-200";

// Cursor blinks independently of component state — safe as a module constant
const CursorSpan = (
  <motion.span
    animate={{ opacity: [1, 1, 0, 0] }}
    transition={{ repeat: Infinity, duration: 1.1, times: [0, 0.45, 0.5, 1], ease: "linear" }}
    className="inline-block w-[2px] rounded-sm bg-white shrink-0"
    style={{ height: "0.9em" }}
  />
);

const FORGE_SIZE = 160;
const SPRING = { type: "spring", stiffness: 320, damping: 36 } as const;

export interface AvatarForgeProps {
  /** Placeholder shown on the canvas when no text is entered. Default "Full name" */
  placeholder?: string;
  /** Label for the confirm button. Default "Confirm name" */
  confirmLabel?: string;
  /** Label for the skip button. When set (along with onSkip), a neutral skip button is shown. */
  skipLabel?: string;
  /** Called with the entered name when confirmed. When set, the reset button is
   *  hidden and a layoutId is added to the avatar circle for cross-component morphing. */
  onConfirm?: (name: string, preset: string, pins?: Pin[]) => void;
  /** Called when the user skips this step */
  onSkip?: () => void;
}

export function AvatarForge({
  placeholder = "Full name",
  confirmLabel = "Confirm name",
  skipLabel,
  onConfirm,
  onSkip,
}: AvatarForgeProps = {}) {
  const [preset, setPreset]       = useState<string>("Cyan Dusk");
  const [editedPins, setEditedPins] = useState<Pin[] | null>(null);
  const [draft, setDraft]         = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [focused, setFocused]     = useState(false);
  const [cursorPos, setCursorPos] = useState(0);
  const [hasError, setHasError]   = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const descriptionId = useId();

  const initialPins = useMemo(() => presetPins(preset), [preset]);
  const currentPins = editedPins || initialPins;

  const syncCursor = () => {
    // Small delay to ensure selection state is updated
    requestAnimationFrame(() => {
      setCursorPos(inputRef.current?.selectionStart ?? 0);
    });
  };

  function confirm() {
    if (!draft.trim()) {
      setHasError(true);
      setTimeout(() => setHasError(false), 2000);
      return;
    }
    setHasError(false);
    setConfirmed(true);
    onConfirm?.(draft.trim(), preset, editedPins || initialPins);
  }
  function reset()   { setConfirmed(false); setDraft(""); setHasError(false); }

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">

      {/* ── Preset controls — forge only, staggered entrance ──────────── */}
      <AnimatePresence>
        {!confirmed && (
          <motion.div
            key="presets"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.02, delayChildren: 0.1 } },
              exit: { opacity: 0, y: -8, transition: { duration: 0.3 } },
            }}
            className="flex flex-wrap items-center gap-2"
          >
            {Object.keys(SHADER_PRESETS).map((name) => (
              <motion.button
                key={name}
                type="button"
                onClick={() => {
                  setPreset(name);
                  setEditedPins(null); // Reset custom edits when switching presets
                }}
                variants={{
                  hidden: { opacity: 0, y: 6, scale: 0.92 },
                  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
                }}
                className={cn(
                  PILL_BTN,
                  preset === name
                    ? "bg-interactive-brand-default/20 border border-interactive-brand-default/40 text-text-brand"
                    : "border border-white/[0.06] text-text-muted hover:text-text-secondary hover:border-white/10"
                )}
              >
                {name}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Canvas container — persists; morphs card → circle ─────────── */}
      <div className="flex justify-center items-center" style={{ perspective: 1200, height: 400 }}>
        {/* Outer: layout morph (size + position) — no 3D transforms */}
        <motion.div
          layout
          animate={{ borderRadius: confirmed ? FORGE_SIZE / 2 : 24 }}
          transition={{
            layout: { type: "spring", stiffness: 100, damping: 22 },
            default: SPRING,
          }}
          className={cn(
            "relative",
            !confirmed ? "w-full cursor-text" : "cursor-default select-none"
          )}
          style={{
            height: confirmed ? FORGE_SIZE : 380,
            width: confirmed ? FORGE_SIZE : undefined,
          }}
          onClick={!confirmed ? () => inputRef.current?.focus() : undefined}
        >
          {/* Inner: 3D coin flip + lift — isolated from layout recalc */}
          <motion.div
            animate={{
              rotateY: confirmed ? 360 : 0,
              rotateX: confirmed ? [0, -15, 0] : 0, // Tilt reveal
              z: confirmed ? [0, 160, 0] : 0, // Amplified "Toss"
              scale: confirmed ? [1, 1.3, 1.15] : 1,
              opacity: 1,
            }}
            transition={{
              rotateY: { duration: 1.4, ease: [0.45, 0.05, 0.55, 0.95], delay: 0.1 },
              rotateX: { duration: 1.4, ease: "easeInOut", delay: 0.1 },
              z: { duration: 1.4, ease: "easeInOut", delay: 0.1 },
              scale: { duration: 1.6, ease: "easeOut", delay: 0.1 },
            }}
            className="relative w-full h-full"
            style={{
              borderRadius: "inherit",
              transformStyle: "preserve-3d",
            }}
          >
            {/* ── Coin Rim (Thickness ~16px) ── */}
            {confirmed && (
              <>
                <motion.div 
                  className="absolute inset-[0.5px] rounded-full bg-white/30"
                  animate={{ opacity: [0.1, 0.4, 0.1] }}
                  transition={{ duration: 1.4, times: [0, 0.5, 1], delay: 0.1 }}
                  style={{ transform: "translateZ(-1.5px)" }} 
                />
                <motion.div 
                  className="absolute inset-[0.5px] rounded-full bg-white/25"
                  animate={{ opacity: [0.1, 0.35, 0.1] }}
                  transition={{ duration: 1.4, times: [0, 0.5, 1], delay: 0.15 }}
                  style={{ transform: "translateZ(-3px)" }} 
                />
                <motion.div 
                  className="absolute inset-[0.5px] rounded-full bg-white/20"
                  animate={{ opacity: [0.05, 0.3, 0.05] }}
                  transition={{ duration: 1.4, times: [0, 0.5, 1], delay: 0.2 }}
                  style={{ transform: "translateZ(-4.5px)" }} 
                />
                <motion.div 
                  className="absolute inset-[0.5px] rounded-full bg-white/15"
                  style={{ transform: "translateZ(-6px)" }} 
                />
                <motion.div 
                  className="absolute inset-[0.5px] rounded-full bg-white/10"
                  style={{ transform: "translateZ(-7.5px)" }} 
                />
              </>
            )}

            {/* ── Front Face ── */}
            <div 
              className="absolute inset-0 w-full h-full"
              style={{ 
                transform: "translateZ(8px)", // Increased gap for 16px total thickness
                backfaceVisibility: "hidden",
                borderRadius: "inherit",
                overflow: "hidden" 
              }}
            >
              <div className="w-full h-full">
                <MeshGradientCard
                  height={confirmed ? FORGE_SIZE : 380}
                  initialPins={initialPins}
                  onPinsChange={setEditedPins}
                  noiseOpacity={0.025} // Materiality: subtle noise texture
                  hidePins={confirmed}
                  disableAdd={false} //Restore pin adding on click
                  className="rounded-none h-full"
                />
              </div>

              {/* Surface Glint - Front */}
              {confirmed && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ x: "-150%", opacity: 0 }}
                  animate={{ x: "200%", opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 1.2, ease: "easeInOut", delay: 0.4 }}
                  style={{
                    background: "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.4) 48%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.4) 52%, transparent 80%)",
                    zIndex: 5,
                    mixBlendMode: "overlay",
                  }}
                />
              )}

              {/* Text overlay - Front */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ mixBlendMode: "overlay" }}
                animate={{ fontSize: confirmed ? FORGE_SIZE * 0.38 : "clamp(1.75rem, 5vw, 3rem)" }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <div 
                  className={cn(
                    "flex items-center gap-[0.5px]", // Switch to items-center for better bar balance
                    !confirmed && "cursor-text pointer-events-auto" //Isolate text input area
                  )}
                  onClick={(e) => {
                    if (confirmed) return;
                    e.stopPropagation(); 
                    inputRef.current?.focus();
                    syncCursor();
                  }}
                >
                  {draft ? (
                    <motion.span
                      layout
                      className="font-display font-black tracking-tightest leading-none text-center text-white flex items-center gap-[1.5px]"
                      transition={{ layout: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } }}
                    >
                      {/* 1. Show cursor before first character if at 0 */}
                      {focused && !confirmed && cursorPos === 0 && CursorSpan}

                      {draft.split("").map((char, i) => {
                        const isKept = i < 2;
                        return (
                          <Fragment key={`char-group-${i}`}>
                            <motion.span
                              key={`char-${i}`}
                              layout
                              animate={{
                                opacity: confirmed && !isKept ? 0 : 1,
                                filter: confirmed && !isKept ? "blur(8px)" : "blur(0px)",
                                width: confirmed && !isKept ? 0 : "auto",
                              }}
                              transition={{
                                opacity: { duration: 0.4, delay: !isKept && confirmed ? (i - 2) * 0.03 : 0, ease: "easeInOut" },
                                filter: { duration: 0.4, delay: !isKept && confirmed ? (i - 2) * 0.03 : 0, ease: "easeInOut" },
                                width: { duration: 0.5, delay: !isKept && confirmed ? 0.1 + (i - 2) * 0.02 : 0, ease: [0.4, 0, 0.2, 1] },
                                layout: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
                              }}
                              style={{ display: "inline-block", whiteSpace: "pre", overflow: "hidden" }}
                            >
                              {char}
                            </motion.span>
                            {/* After current character index i, if cursorPos is i+1, show cursor */}
                            {focused && !confirmed && cursorPos === i + 1 && CursorSpan}
                          </Fragment>
                        );
                      })}
                    </motion.span>
                  ) : (
                    !confirmed && (
                      <motion.div 
                        className="flex items-center"
                        animate={hasError ? { x: [-5, 5, -5, 5, 0] } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        {focused && !confirmed && cursorPos === 0 ? (
                          <span className={hasError ? "text-[var(--color-text-danger)]" : ""}>{CursorSpan}</span>
                        ) : null}
                        <span className={cn(
                          "font-display font-black tracking-tightest leading-none text-center transition-all duration-300",
                          hasError ? "text-[var(--color-text-danger)] opacity-100 drop-shadow-md" : "text-white opacity-35"
                        )}>
                          {hasError ? `${placeholder} *` : placeholder}
                        </span>
                      </motion.div>
                    )
                  )}
                </div>
              </motion.div>
            </div>

            {/* ── Back Face (revealed at 180 deg) ── */}
            {confirmed && (
              <div 
                className="absolute inset-0 w-full h-full rounded-full overflow-hidden"
                style={{ 
                  transform: "translateZ(-8.1px) rotateY(180deg)", // Increased gap for 16px total thickness
                  backfaceVisibility: "hidden",
                  backgroundColor: "rgba(20,20,20,0.8)",
                  borderRadius: "inherit",
                }}
              >
                {/* Mirror background for the back face */}
                <div className="absolute inset-0 opacity-80 pointer-events-none">
                  <MeshGradientCard
                    width={FORGE_SIZE}
                    height={FORGE_SIZE}
                    initialPins={currentPins}
                    noiseOpacity={0.025}
                    hidePins={true} //Interaction fix
                    className="rounded-none"
                  />
                </div>

                {/* Surface Glint - Back */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ x: "-150%", opacity: 0 }}
                  animate={{ x: "200%", opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 1.2, ease: "easeInOut", delay: 0.8 }}
                  style={{
                    background: "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.3) 48%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.3) 52%, transparent 80%)",
                    zIndex: 5,
                    mixBlendMode: "overlay",
                  }}
                />
                {/* Texture/Noise for the back face */}
                <div className="absolute inset-0 bg-white/5 mix-blend-overlay pointer-events-none" />

                <div 
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  style={{ mixBlendMode: "overlay" }}
                >
                  <span 
                    className="font-display font-black tracking-tightest leading-none text-center text-white"
                    style={{ fontSize: FORGE_SIZE * 0.38 }}
                  >
                    {draft.slice(0, 2)}
                  </span>
                </div>
              </div>
            )}

          {/* Hidden input — forge only */}
          {!confirmed && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span id={descriptionId} className="sr-only">
                Type your full name, then press Enter or click Confirm name to generate your avatar.
              </span>
              <input
                ref={inputRef}
                type="text"
                value={draft}
                onChange={(e) => {
                  setDraft(e.target.value);
                  if (hasError) setHasError(false);
                  syncCursor();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") confirm();
                  syncCursor();
                }}
                onKeyUp={syncCursor}
                onClick={syncCursor}
                onSelect={syncCursor}
                maxLength={30}
                aria-label="Your display name"
                aria-describedby={descriptionId}
                onFocus={() => {
                  setFocused(true);
                  syncCursor();
                }}
                onBlur={() => setFocused(false)}
                className="pointer-events-auto opacity-0"
                style={{
                  width: "min(360px, 70%)",
                  height: 64,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  caretColor: "transparent",
                }}
              />
            </div>
          )}


          {/* Border — delayed until after coin flip lands */}
          <AnimatePresence>
            {confirmed && (
              <motion.div
                key="border"
                initial={{ boxShadow: "inset 0 0 0 0px white" }}
                animate={{ boxShadow: "inset 0 0 0 3px white" }}
                exit={{ boxShadow: "inset 0 0 0 0px white" }}
                transition={{ duration: 0.5, delay: 2.0, ease: [0, 0, 0.2, 1] }}
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{ mixBlendMode: "overlay" }}
              />
            )}
          </AnimatePresence>
          </motion.div>{/* close inner 3D flip wrapper */}
        </motion.div>{/* close outer layout wrapper */}
      </div>

      {/* ── "Identity Saved" label — outside the coin, below it ─────── */}
      <AnimatePresence>
        {confirmed && (
          <motion.div
            key="identity-saved"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.4, delay: 2.2, ease: "easeOut" }}
            className="flex justify-center -mt-16"
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
              Identity Forged
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bottom controls ───────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {!confirmed && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.3 }}
            className="flex justify-end gap-3"
          >
            {skipLabel && onSkip && (
              <Button
                variant="neutral"
                appearance="outline"
                size="md"
                shape="rounded"
                onClick={onSkip}
              >
                {skipLabel}
              </Button>
            )}
            <Button
              variant="brand"
              appearance="filled"
              size="md"
              shape="rounded"
              leadingIcon={<RiCheckLine />}
              onClick={confirm}
            >
              {confirmLabel}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
