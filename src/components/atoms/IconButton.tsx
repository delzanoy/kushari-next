"use client";

import { forwardRef, useRef, useState } from "react";
import {
  motion, AnimatePresence,
  useMotionValue,
  animate,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { transitions } from "@/lib/motion";
import { APPEARANCE_MAP, HOVER_GLOW_BG, FLAT_HOVER_GLOW_BG, FLAT_NOISE_URL, BUTTON_ICON_SIZE, FLAT_OUTLINE_HOVER_BORDER } from "./button.variants";
import type { ButtonVariant, ButtonAppearance, ButtonSize, ButtonShape, ButtonProps } from "./button.variants";
import { Spinner, type SpinnerSize } from "./Spinner";

// ─── Types ───────────────────────────────────────────────────────────────────

// aria-label is made required — icon-only buttons must have an accessible name.
export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "aria-label"> {
  "aria-label": string;
  icon: React.ReactNode;
  variant?: ButtonVariant;
  appearance?: ButtonAppearance;
  hoverVariant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  loading?: boolean;
  flat?: boolean;
  /** Type of button – "button", "submit", or "reset". Default "button". */
  type?: "button" | "submit" | "reset";
  /** Name attribute for form submission. */
  name?: string;
  /** Value attribute for form submission. */
  value?: string;
  /** Whether the button should autofocus when mounted. */
  autoFocus?: boolean;
  /** ID of the form element this button belongs to. */
  form?: string;
}

// ─── Size scale ───────────────────────────────────────────────────────────────
// Square containers — width === height === button height token.

const SIZE: Record<ButtonSize, string> = {
  sm: "h-8  w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

// Icon sizes imported from shared BUTTON_ICON_SIZE in button.variants.ts

const SPINNER_SIZE: Record<ButtonSize, SpinnerSize> = {
  sm: "sm",
  md: "md",
  lg: "lg",
};

const STROKE_W: Record<ButtonSize, string> = {
  sm: "0.6px",
  md: "1px",
  lg: "1.2px",
};

const SHAPE: Record<ButtonShape, string> = {
  rounded: "rounded-xl",
  pill: "rounded-full",  // produces a circle
};

// ─── Component ───────────────────────────────────────────────────────────────

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    {
      "aria-label": ariaLabel,
      icon,
      variant = "brand",
      appearance = "filled",
      hoverVariant,
      size = "md",
      shape = "rounded",
      loading = false,
      flat = false,
      disabled,
      type = "button",
      name,
      value,
      autoFocus,
      form,
      className,
      onPointerDown,
      onPointerUp,
      onClick,
      ...rest
    },
    forwardedRef
  ) {
    const isDisabled = disabled || loading;
    const isActualDisabled = !!disabled;

    // ── Hover / press tracking ──────────────────────────────────────────────
    const [hovered, setHovered] = useState(false);
    const hoverRef = useRef(false);
    const pressedRef = useRef(false);
    const effectiveVariant = hovered && hoverVariant && !isDisabled ? hoverVariant : variant;

    // Apple-grade tactile springs
    const tapSpring = { type: "spring", stiffness: 400, damping: 28, mass: 0.8 } as const;
    const hoverSpring = { type: "spring", stiffness: 300, damping: 20, mass: 1 } as const;

    const variantMap = APPEARANCE_MAP[appearance];
    const v = variantMap[variant];
    const ev = variantMap[effectiveVariant];

    // ── Internal ref for pointer math ──────────────────────────────────────
    const buttonRef = useRef<HTMLButtonElement>(null);

    // ── Press state tracking ───────────────────────────────────────────────
    const pressScale = useMotionValue(1);
    const pressY = useMotionValue(0);
    const downTimeRef = useRef(0);
    const releaseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ── Handlers ───────────────────────────────────────────────────────────
    const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
      if (!isDisabled) {
        pressedRef.current = true;
        downTimeRef.current = Date.now();
        if (releaseTimeoutRef.current) clearTimeout(releaseTimeoutRef.current);

        animate(pressScale, 0.96, tapSpring);
        animate(pressY, 0, tapSpring);
      }
      onPointerDown?.(e);
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
      pressedRef.current = false;
      const release = () => {
        animate(pressScale, hoverRef.current ? 1.02 : 1, tapSpring);
        animate(pressY, hoverRef.current ? liftAmount : 0, tapSpring);
      };

      const elapsed = Date.now() - downTimeRef.current;
      if (elapsed < 150) {
        releaseTimeoutRef.current = setTimeout(release, 150 - elapsed);
      } else {
        release();
      }
      onPointerUp?.(e);
    };

    const handlePointerLeave = (e: React.PointerEvent<HTMLButtonElement>) => {
      pressedRef.current = false;
      if (releaseTimeoutRef.current) clearTimeout(releaseTimeoutRef.current);
      animate(pressScale, 1, tapSpring);
      animate(pressY, 0, tapSpring);
    };

    const handlePointerCancel = () => {
      pressedRef.current = false;
      if (releaseTimeoutRef.current) clearTimeout(releaseTimeoutRef.current);
      animate(pressScale, 1, tapSpring);
      animate(pressY, 0, tapSpring);
    };

    const isFilled = appearance === "filled";
    const isShimmer = isFilled && (effectiveVariant === "brand" || effectiveVariant === "brand-gradient");
    const showStroke = isFilled;
    const isGhost = appearance === "ghost";
    const showShadow = !isGhost && !flat;
    const liftAmount = flat ? 0 : -1;

    // ── Background class logic ──────────────────────────────────────────────
    // Ghost bg lives on the root (pointer-events: auto → CSS :hover/:active work).
    // All other appearances use the isolated bg span so loading can dim bg without touching content.
    const bgClass = hoverVariant
      ? cn(hovered ? ev.bg : v.bg, hovered ? ev.activeBg : v.activeBg)
      : isGhost
        ? v.bg   // span stays transparent; root carries the hover (see className below)
        : cn(v.bg, v.hoverBg, v.activeBg);

    return (
      <motion.button
        ref={(node) => {
          buttonRef.current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        type={type}
        name={name}
        value={value}
        autoFocus={autoFocus}
        form={form}
        aria-label={ariaLabel}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        aria-disabled={isDisabled || undefined}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        onPointerCancel={handlePointerCancel}
        onClick={(e) => {
          if (!isDisabled) {
            onClick?.(e);
          }
        }}
        onHoverStart={() => {
          if (!isDisabled) {
            hoverRef.current = true;
            setHovered(true);
            if (!pressedRef.current) {
              animate(pressScale, 1.02, hoverSpring);
              animate(pressY, liftAmount, hoverSpring);
            }
          }
        }}
        onHoverEnd={() => {
          hoverRef.current = false;
          setHovered(false);
          if (!pressedRef.current) {
            animate(pressScale, 1, hoverSpring);
            animate(pressY, 0, hoverSpring);
          }
        }}
        whileHover={isDisabled ? undefined : {
          boxShadow: showShadow ? ev.shadow : "0 0 0 0 rgba(0,0,0,0)"
        }}
        style={{ scale: pressScale, y: pressY }}
        transition={hovered ? hoverSpring : tapSpring}
        className={cn(
          "relative isolate overflow-hidden inline-flex items-center justify-center select-none",
          "transform-gpu shrink-0 touch-manipulation",
          SIZE[size],
          SHAPE[shape],
          ev.text,
          v.focus, "focus-visible:outline-none",
          isActualDisabled ? "opacity-40 cursor-not-allowed" : loading ? "cursor-wait" : "cursor-pointer",
          className
        )}
        {...(rest as React.ComponentProps<typeof motion.button>)}
      >
        {/* ── 0. Background + border layer — isolated so loading can dim them without touching content */}
        <span
          aria-hidden
          className={cn(
            "absolute inset-0 rounded-[inherit] pointer-events-none z-[0]",
            bgClass,
            (flat && appearance === "outline") ? v.border : ev.border,
            "transition-[background-color,background-image,border-color,opacity] duration-200 ease-out",
            loading && "opacity-40",
          )}
        />

        {/* ── 0b. Flat Interaction Overlays ──────────────────────────────── */}
        {flat && appearance === "filled" && !isDisabled && (
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-[inherit] pointer-events-none z-[1]"
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            style={{
              boxShadow: variant === "neutral"
                ? "inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.2)"
                : "inset 0 1.5px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.3)",
            }}
          />
        )}

        {flat && (appearance === "tonal" || appearance === "ghost") && !isDisabled && (
          <>
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-[inherit] pointer-events-none z-[1]"
              animate={{ opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.15 }}
              style={{ background: FLAT_HOVER_GLOW_BG[effectiveVariant] }}
            />
            <motion.div
              aria-hidden
              className="absolute inset-0 opacity-0 pointer-events-none mix-blend-overlay z-[2]"
              animate={{ opacity: hovered ? 0.08 : 0 }}
              style={{ backgroundImage: FLAT_NOISE_URL }}
            />
          </>
        )}

        {flat && appearance === "outline" && !isDisabled && (
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-[inherit] pointer-events-none z-[1]"
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.15 }}
            style={{
              border: FLAT_OUTLINE_HOVER_BORDER[effectiveVariant],
            }}
          />
        )}

        {/* ── 1. Hover glow — outline/ghost only ──────────────────────────
            Tonal-bg substrate that appears on hover so the white+overlay ripple
            produces a sentiment-tinted brightening (same mechanism as tonal).   */}
        {!flat && (appearance === "outline" || appearance === "ghost") && !isDisabled && (
          <motion.span
            aria-hidden
            className={cn(
              "absolute rounded-[inherit] pointer-events-none z-[1]",
              appearance === "outline" ? "inset-px" : "inset-0",
            )}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            style={{ background: HOVER_GLOW_BG[effectiveVariant] }}
          />
        )}

        {/* ── 1. Shimmer — filled brand only ───────────────────────────────  */}
        {isShimmer && !isDisabled && (
          <motion.span
            aria-hidden
            initial={{ x: "-110%" }}
            animate={{ x: "210%" }}
            transition={{ repeat: Infinity, duration: 3.5, ease: "linear", repeatDelay: 2.5 }}
            className="absolute inset-0 pointer-events-none z-[1]"
            style={{
              background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.14) 50%, transparent 70%)",
              mixBlendMode: "screen",
            }}
          />
        )}

        {/* ── 3. Stroke — filled only ───────────────────────────────────────  */}
        {showStroke && (
          <span
            aria-hidden
            className="absolute inset-0 rounded-[inherit] pointer-events-none z-[4]"
            style={{
              border: `${STROKE_W[size]} solid white`,
              mixBlendMode: "overlay",
              opacity: 0.55,
              boxShadow: "inset 0 1.5px 0 rgba(255,255,255,0.20)",
            }}
          />
        )}

        {/* ── 5. Icon / spinner swap ────────────────────────────────────────  */}
        <span className="relative z-[5] inline-flex items-center justify-center">
          <AnimatePresence mode="popLayout" initial={false}>
            {loading ? (
              <motion.span
                key="spinner"
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.4 }}
                transition={{ opacity: transitions.fast, scale: transitions.fast }}
                className="inline-flex"
                aria-hidden="true"
              >
                <Spinner size={SPINNER_SIZE[size]} className="text-current" />
              </motion.span>
            ) : (
              <motion.span
                key="icon"
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.4 }}
                transition={transitions.fast}
                className={cn(
                  "inline-flex items-center justify-center",
                  "[&>svg]:w-full [&>svg]:h-full [&>svg]:block",
                  isFilled && "[&>svg]:drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]",
                  "[&>svg]:opacity-90",
                  BUTTON_ICON_SIZE[size],
                )}
                aria-hidden="true"
              >
                {icon}
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </motion.button>
    );
  }
);