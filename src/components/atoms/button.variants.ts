import type { ReactNode, ButtonHTMLAttributes } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

export type ButtonVariant =
  | "brand"
  | "brand-gradient"
  | "neutral"
  | "danger"
  | "warning"
  | "success";

/** Visual hierarchy of the button.
 *  filled   → primary   (solid opaque bg, white text)
 *  tonal    → secondary (subtle tinted bg, colored text, colored border)
 *  outline  → tertiary-solid (transparent bg, colored border, colored text, fills on hover)
 *  ghost    → minimal   (no bg, no border, colored text)
 *  inverted → contrast  (white bg, dark text — for use on non-dark surfaces)
 */
export type ButtonAppearance = "filled" | "tonal" | "outline" | "ghost" | "inverted";

export type ButtonSize  = "sm" | "md" | "lg";
export type ButtonShape = "rounded" | "pill";

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:     ButtonVariant;
  appearance?:  ButtonAppearance;
  /** Sentiment to cross-fade into on hover. */
  hoverVariant?: ButtonVariant;
  size?:        ButtonSize;
  shape?:       ButtonShape;
  loading?:     boolean;
  flat?:        boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

// ─── Variant style shape ──────────────────────────────────────────────────────

export type VariantStyle = {
  bg:       string;  // base bg (no pseudo-prefix)
  hoverBg:  string;  // CSS :hover bg  — only used when hoverVariant is NOT set
  activeBg: string;  // CSS :active bg
  text:     string;  // text color
  border:   string;  // border classes (empty string = no border)
  focus:    string;  // focus ring shadow
  shadow:   string;  // hover elevation shadow (rgba, Framer-animatable)
};

// ─── Appearance × Variant maps ───────────────────────────────────────────────
// Each appearance has a full record so hoverVariant cross-transitions work
// consistently at every hierarchy level.

// ── filled (primary) ─────────────────────────────────────────────────────────

export const FILLED: Record<ButtonVariant, VariantStyle> = {
  brand: {
    bg:       "bg-[var(--color-button-brand-bg)]",
    hoverBg:  "hover:bg-[var(--color-button-brand-hover)]",
    activeBg: "active:bg-[var(--color-button-brand-active)]",
    text:     "text-[var(--color-text-primary)]",
    border:   "",
    focus:    "focus-visible:shadow-[var(--shadow-focus-ring-brand)]",
    shadow:   "0 8px 28px rgba(14,116,144,0.50), 0 3px 8px rgba(0,0,0,0.22)",
  },
  "brand-gradient": {
    bg:       "bg-gradient-to-br from-[var(--color-cyan-700)] to-[var(--color-emerald-700)]",
    hoverBg:  "hover:from-[var(--color-cyan-600)] hover:to-[var(--color-emerald-600)]",
    activeBg: "active:from-[var(--color-cyan-800)] active:to-[var(--color-emerald-800)]",
    text:     "text-[var(--color-text-primary)]",
    border:   "",
    focus:    "focus-visible:shadow-[var(--shadow-focus-ring-brand)]",
    shadow:   "0 8px 28px rgba(14,116,144,0.45), 0 3px 8px rgba(0,0,0,0.22)",
  },
  neutral: {
    bg:       "bg-[var(--color-interactive-neutral-default)]",
    hoverBg:  "hover:bg-[var(--color-interactive-neutral-hover)]",
    activeBg: "active:bg-[var(--color-interactive-neutral-active)]",
    text:     "text-[var(--color-text-primary)]",
    border:   "",
    focus:    "focus-visible:shadow-[var(--shadow-focus-ring-neutral)]",
    shadow:   "0 8px 28px rgba(0,0,0,0.50), 0 3px 8px rgba(0,0,0,0.22)",
  },
  danger: {
    bg:       "bg-[var(--color-button-danger-bg)]",
    hoverBg:  "hover:bg-[var(--color-button-danger-hover)]",
    activeBg: "active:bg-[var(--color-button-danger-active)]",
    text:     "text-[var(--color-text-primary)]",
    border:   "",
    focus:    "focus-visible:shadow-[var(--shadow-focus-ring-danger)]",
    shadow:   "0 8px 28px rgba(220,38,38,0.55), 0 3px 8px rgba(0,0,0,0.22)",
  },
  warning: {
    bg:       "bg-[var(--color-button-warning-bg)]",
    hoverBg:  "hover:bg-[var(--color-button-warning-hover)]",
    activeBg: "active:bg-[var(--color-button-warning-active)]",
    text:     "text-[var(--color-text-primary)]",
    border:   "",
    focus:    "focus-visible:shadow-[var(--shadow-focus-ring-warning)]",
    shadow:   "0 8px 28px rgba(180,83,9,0.55), 0 3px 8px rgba(0,0,0,0.22)",
  },
  success: {
    bg:       "bg-[var(--color-button-success-bg)]",
    hoverBg:  "hover:bg-[var(--color-button-success-hover)]",
    activeBg: "active:bg-[var(--color-button-success-active)]",
    text:     "text-[var(--color-text-primary)]",
    border:   "",
    focus:    "focus-visible:shadow-[var(--shadow-focus-ring-success)]",
    shadow:   "0 8px 28px rgba(21,128,61,0.55), 0 3px 8px rgba(0,0,0,0.22)",
  },
};

// ── tonal (secondary) ─────────────────────────────────────────────────────────

export const TONAL: Record<ButtonVariant, VariantStyle> = {
  brand: {
    bg:       "bg-[var(--color-interactive-brand-tonal-bg)]",
    hoverBg:  "hover:bg-[var(--color-interactive-brand-tonal-bg-hover)]",
    activeBg: "active:bg-[var(--color-interactive-brand-tonal-bg-active)]",
    text:     "text-[var(--color-text-brand)]",
    border:   "border border-[var(--color-interactive-brand-tonal-border)]",
    focus:    "focus-visible:shadow-[var(--shadow-focus-ring-brand)]",
    shadow:   "0 4px 16px rgba(14,116,144,0.30), 0 2px 6px rgba(0,0,0,0.18)",
  },
  "brand-gradient": {
    bg:       "bg-[var(--color-interactive-brand-tonal-bg)]",
    hoverBg:  "hover:bg-[var(--color-interactive-brand-tonal-bg-hover)]",
    activeBg: "active:bg-[var(--color-interactive-brand-tonal-bg-active)]",
    text:     "text-[var(--color-text-brand)]",
    border:   "border border-[var(--color-interactive-brand-tonal-border)]",
    focus:    "focus-visible:shadow-[var(--shadow-focus-ring-brand)]",
    shadow:   "0 4px 16px rgba(14,116,144,0.30), 0 2px 6px rgba(0,0,0,0.18)",
  },
  neutral: {
    bg:       "bg-[var(--color-interactive-neutral-tonal-bg)]",
    hoverBg:  "hover:bg-[var(--color-interactive-neutral-tonal-bg-hover)]",
    activeBg: "active:bg-[var(--color-interactive-neutral-tonal-bg-active)]",
    text:     "text-[var(--color-text-secondary)]",
    border:   "border border-[var(--color-interactive-neutral-tonal-border)]",
    focus:    "focus-visible:shadow-[var(--shadow-focus-ring-neutral)]",
    shadow:   "0 4px 16px rgba(0,0,0,0.35), 0 2px 6px rgba(0,0,0,0.18)",
  },
  danger: {
    bg:       "bg-[var(--color-interactive-danger-tonal-bg)]",
    hoverBg:  "hover:bg-[var(--color-interactive-danger-tonal-bg-hover)]",
    activeBg: "active:bg-[var(--color-interactive-danger-tonal-bg-active)]",
    text:     "text-[var(--color-text-danger)]",
    border:   "border border-[var(--color-interactive-danger-tonal-border)]",
    focus:    "focus-visible:shadow-[var(--shadow-focus-ring-danger)]",
    shadow:   "0 4px 16px rgba(220,38,38,0.30), 0 2px 6px rgba(0,0,0,0.18)",
  },
  warning: {
    bg:       "bg-[var(--color-interactive-warning-tonal-bg)]",
    hoverBg:  "hover:bg-[var(--color-interactive-warning-tonal-bg-hover)]",
    activeBg: "active:bg-[var(--color-interactive-warning-tonal-bg-active)]",
    text:     "text-[var(--color-text-warning)]",
    border:   "border border-[var(--color-interactive-warning-tonal-border)]",
    focus:    "focus-visible:shadow-[var(--shadow-focus-ring-warning)]",
    shadow:   "0 4px 16px rgba(180,83,9,0.30), 0 2px 6px rgba(0,0,0,0.18)",
  },
  success: {
    bg:       "bg-[var(--color-interactive-success-tonal-bg)]",
    hoverBg:  "hover:bg-[var(--color-interactive-success-tonal-bg-hover)]",
    activeBg: "active:bg-[var(--color-interactive-success-tonal-bg-active)]",
    text:     "text-[var(--color-text-success)]",
    border:   "border border-[var(--color-interactive-success-tonal-border)]",
    focus:    "focus-visible:shadow-[var(--shadow-focus-ring-success)]",
    shadow:   "0 4px 16px rgba(21,128,61,0.30), 0 2px 6px rgba(0,0,0,0.18)",
  },
};

// ── outline ───────────────────────────────────────────────────────────────────

export const OUTLINE: Record<ButtonVariant, VariantStyle> = {
  brand: {
    bg:       "bg-transparent",
    hoverBg:  "hover:bg-[var(--color-interactive-brand-tonal-bg)]",
    activeBg: "active:bg-[var(--color-interactive-brand-tonal-bg-hover)]",
    text:     "text-[var(--color-text-brand)]",
    border:   "border border-[var(--color-interactive-brand-default)]",
    focus:    "focus-visible:shadow-[var(--shadow-focus-ring-brand)]",
    shadow:   "0 4px 14px rgba(14,116,144,0.25), 0 2px 5px rgba(0,0,0,0.15)",
  },
  "brand-gradient": {
    bg:       "bg-transparent",
    hoverBg:  "hover:bg-[var(--color-interactive-brand-tonal-bg)]",
    activeBg: "active:bg-[var(--color-interactive-brand-tonal-bg-hover)]",
    text:     "text-[var(--color-text-brand)]",
    border:   "border border-[var(--color-interactive-brand-default)]",
    focus:    "focus-visible:shadow-[var(--shadow-focus-ring-brand)]",
    shadow:   "0 4px 14px rgba(14,116,144,0.25), 0 2px 5px rgba(0,0,0,0.15)",
  },
  neutral: {
    bg:       "bg-transparent",
    hoverBg:  "hover:bg-[var(--color-interactive-neutral-tonal-bg)]",
    activeBg: "active:bg-[var(--color-interactive-neutral-tonal-bg-hover)]",
    text:     "text-[var(--color-text-secondary)]",
    border:   "border border-[var(--color-interactive-neutral-outline-border)]",
    focus:    "focus-visible:shadow-[var(--shadow-focus-ring-neutral)]",
    shadow:   "0 4px 14px rgba(0,0,0,0.30), 0 2px 5px rgba(0,0,0,0.15)",
  },
  danger: {
    bg:       "bg-transparent",
    hoverBg:  "hover:bg-[var(--color-interactive-danger-tonal-bg)]",
    activeBg: "active:bg-[var(--color-interactive-danger-tonal-bg-hover)]",
    text:     "text-[var(--color-text-danger)]",
    border:   "border border-[var(--color-interactive-danger-default)]",
    focus:    "focus-visible:shadow-[var(--shadow-focus-ring-danger)]",
    shadow:   "0 4px 14px rgba(220,38,38,0.25), 0 2px 5px rgba(0,0,0,0.15)",
  },
  warning: {
    bg:       "bg-transparent",
    hoverBg:  "hover:bg-[var(--color-interactive-warning-tonal-bg)]",
    activeBg: "active:bg-[var(--color-interactive-warning-tonal-bg-hover)]",
    text:     "text-[var(--color-text-warning)]",
    border:   "border border-[var(--color-interactive-warning-default)]",
    focus:    "focus-visible:shadow-[var(--shadow-focus-ring-warning)]",
    shadow:   "0 4px 14px rgba(180,83,9,0.25), 0 2px 5px rgba(0,0,0,0.15)",
  },
  success: {
    bg:       "bg-transparent",
    hoverBg:  "hover:bg-[var(--color-interactive-success-tonal-bg)]",
    activeBg: "active:bg-[var(--color-interactive-success-tonal-bg-hover)]",
    text:     "text-[var(--color-text-success)]",
    border:   "border border-[var(--color-interactive-success-default)]",
    focus:    "focus-visible:shadow-[var(--shadow-focus-ring-success)]",
    shadow:   "0 4px 14px rgba(21,128,61,0.25), 0 2px 5px rgba(0,0,0,0.15)",
  },
};

// ── ghost ─────────────────────────────────────────────────────────────────────

export const GHOST: Record<ButtonVariant, VariantStyle> = {
  brand: {
    bg:       "bg-transparent",
    hoverBg:  "hover:bg-[var(--color-interactive-brand-ghost-bg-hover)]",
    activeBg: "active:bg-[var(--color-interactive-brand-ghost-bg-active)]",
    text:     "text-[var(--color-text-brand)]",
    border:   "",
    focus:    "focus-visible:shadow-[var(--shadow-focus-ring-brand)]",
    shadow:   "0 0 0 0 rgba(0,0,0,0)",
  },
  "brand-gradient": {
    bg:       "bg-transparent",
    hoverBg:  "hover:bg-[var(--color-interactive-brand-ghost-bg-hover)]",
    activeBg: "active:bg-[var(--color-interactive-brand-ghost-bg-active)]",
    text:     "text-[var(--color-text-brand)]",
    border:   "",
    focus:    "focus-visible:shadow-[var(--shadow-focus-ring-brand)]",
    shadow:   "0 0 0 0 rgba(0,0,0,0)",
  },
  neutral: {
    bg:       "bg-transparent",
    hoverBg:  "hover:bg-[var(--color-interactive-neutral-ghost-bg-hover)]",
    activeBg: "active:bg-[var(--color-interactive-neutral-ghost-bg-active)]",
    text:     "text-[var(--color-text-secondary)]",
    border:   "",
    focus:    "focus-visible:shadow-[var(--shadow-focus-ring-neutral)]",
    shadow:   "0 0 0 0 rgba(0,0,0,0)",
  },
  danger: {
    bg:       "bg-transparent",
    hoverBg:  "hover:bg-[var(--color-interactive-danger-ghost-bg-hover)]",
    activeBg: "active:bg-[var(--color-interactive-danger-ghost-bg-active)]",
    text:     "text-[var(--color-text-danger)]",
    border:   "",
    focus:    "focus-visible:shadow-[var(--shadow-focus-ring-danger)]",
    shadow:   "0 0 0 0 rgba(0,0,0,0)",
  },
  warning: {
    bg:       "bg-transparent",
    hoverBg:  "hover:bg-[var(--color-interactive-warning-ghost-bg-hover)]",
    activeBg: "active:bg-[var(--color-interactive-warning-ghost-bg-active)]",
    text:     "text-[var(--color-text-warning)]",
    border:   "",
    focus:    "focus-visible:shadow-[var(--shadow-focus-ring-warning)]",
    shadow:   "0 0 0 0 rgba(0,0,0,0)",
  },
  success: {
    bg:       "bg-transparent",
    hoverBg:  "hover:bg-[var(--color-interactive-success-ghost-bg-hover)]",
    activeBg: "active:bg-[var(--color-interactive-success-ghost-bg-active)]",
    text:     "text-[var(--color-text-success)]",
    border:   "",
    focus:    "focus-visible:shadow-[var(--shadow-focus-ring-success)]",
    shadow:   "0 0 0 0 rgba(0,0,0,0)",
  },
};

// ── inverted ──────────────────────────────────────────────────────────────────

export const INVERTED: Record<ButtonVariant, VariantStyle> = {
  brand: {
    bg:       "bg-[var(--color-button-inverted-bg)]",
    hoverBg:  "hover:bg-[var(--color-button-inverted-hover)]",
    activeBg: "active:bg-[var(--color-button-inverted-active)]",
    text:     "text-[var(--color-text-inverse)]",
    border:   "",
    focus:    "focus-visible:shadow-[var(--shadow-focus-ring-brand)]",
    shadow:   "0 6px 20px rgba(0,0,0,0.30), 0 2px 6px rgba(14,116,144,0.15)",
  },
  "brand-gradient": {
    bg:       "bg-[var(--color-button-inverted-bg)]",
    hoverBg:  "hover:bg-[var(--color-button-inverted-hover)]",
    activeBg: "active:bg-[var(--color-button-inverted-active)]",
    text:     "text-[var(--color-text-inverse)]",
    border:   "",
    focus:    "focus-visible:shadow-[var(--shadow-focus-ring-brand)]",
    shadow:   "0 6px 20px rgba(0,0,0,0.30), 0 2px 6px rgba(14,116,144,0.15)",
  },
  neutral: {
    bg:       "bg-[var(--color-button-inverted-bg)]",
    hoverBg:  "hover:bg-[var(--color-button-inverted-hover)]",
    activeBg: "active:bg-[var(--color-button-inverted-active)]",
    text:     "text-[var(--color-text-inverse)]",
    border:   "",
    focus:    "focus-visible:shadow-[var(--shadow-focus-ring-neutral)]",
    shadow:   "0 6px 20px rgba(0,0,0,0.30), 0 2px 6px rgba(0,0,0,0.12)",
  },
  danger: {
    bg:       "bg-[var(--color-button-inverted-bg)]",
    hoverBg:  "hover:bg-[var(--color-button-inverted-danger-hover)]",
    activeBg: "active:bg-[var(--color-button-inverted-danger-active)]",
    text:     "text-[var(--color-text-danger-on-light)]",
    border:   "",
    focus:    "focus-visible:shadow-[var(--shadow-focus-ring-danger)]",
    shadow:   "0 6px 20px rgba(0,0,0,0.30), 0 2px 6px rgba(220,38,38,0.15)",
  },
  warning: {
    bg:       "bg-[var(--color-button-inverted-bg)]",
    hoverBg:  "hover:bg-[var(--color-button-inverted-warning-hover)]",
    activeBg: "active:bg-[var(--color-button-inverted-warning-active)]",
    text:     "text-[var(--color-text-warning-on-light)]",
    border:   "",
    focus:    "focus-visible:shadow-[var(--shadow-focus-ring-neutral)]",
    shadow:   "0 6px 20px rgba(0,0,0,0.30), 0 2px 6px rgba(180,83,9,0.15)",
  },
  success: {
    bg:       "bg-[var(--color-button-inverted-bg)]",
    hoverBg:  "hover:bg-[var(--color-button-inverted-success-hover)]",
    activeBg: "active:bg-[var(--color-button-inverted-success-active)]",
    text:     "text-[var(--color-text-success-on-light)]",
    border:   "",
    focus:    "focus-visible:shadow-[var(--shadow-focus-ring-neutral)]",
    shadow:   "0 6px 20px rgba(0,0,0,0.30), 0 2px 6px rgba(21,128,61,0.15)",
  },
};

export const HOVER_GLOW_BG: Record<ButtonVariant, string> = {
  brand:           "var(--color-interactive-brand-tonal-bg-hover)",
  "brand-gradient":"var(--color-interactive-brand-tonal-bg-hover)",
  neutral:         "var(--color-interactive-neutral-tonal-bg-hover)",
  danger:          "var(--color-interactive-danger-tonal-bg-hover)",
  warning:         "var(--color-interactive-warning-tonal-bg-hover)",
  success:         "var(--color-interactive-success-tonal-bg-hover)",
};

export const APPEARANCE_MAP = {
  filled:   FILLED,
  tonal:    TONAL,
  outline:  OUTLINE,
  ghost:    GHOST,
  inverted: INVERTED,
} as const;

// ─── Shared Structural Options ───────────────────────────────────────────────────

export const BUTTON_SIZE_STYLES: Record<ButtonSize, string> = {
  sm: "h-8 px-2.5 gap-1.5",
  md: "h-10 px-3 gap-2",
  lg: "h-12 px-4 gap-2",
};

export const BUTTON_TYPOGRAPHY: Record<ButtonSize, string> = {
  sm: "text-xs font-medium tracking-normal",
  md: "text-sm font-medium tracking-tight",
  lg: "text-base font-medium tracking-tight",
};

export const BUTTON_ICON_SIZE: Record<ButtonSize, string> = {
  sm: "w-4 h-4",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

export const BUTTON_STROKE_W: Record<ButtonSize, string> = {
  sm: "0.6px",
  md: "1px",
  lg: "1.2px",
};

export const BUTTON_SHAPE: Record<ButtonShape, string> = {
  rounded: "rounded-xl",
  pill:    "rounded-full",
};

// ─── Flat Interaction Maps ───────────────────────────────────────────────────

// A flat version of the glow bg for interaction 2 (tonal/ghost)
export const FLAT_HOVER_GLOW_BG: Record<ButtonVariant, string> = {
  brand: "rgba(14,116,144,0.12)",
  "brand-gradient": "rgba(14,116,144,0.12)",
  neutral: "rgba(255,255,255,0.06)",
  danger: "rgba(220,38,38,0.12)",
  warning: "rgba(180,83,9,0.12)",
  success: "rgba(21,128,61,0.12)",
};

export const FLAT_NOISE_URL = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;

// Flat outline hover border — sentiment-colored to match floating outline buttons
export const FLAT_OUTLINE_HOVER_BORDER: Record<ButtonVariant, string> = {
  brand:           "1px solid rgba(14,116,144,0.45)",
  "brand-gradient":"1px solid rgba(14,116,144,0.45)",
  neutral:         "1px solid rgba(255,255,255,0.15)",
  danger:          "1px solid rgba(220,38,38,0.45)",
  warning:         "1px solid rgba(180,83,9,0.45)",
  success:         "1px solid rgba(21,128,61,0.45)",
};
