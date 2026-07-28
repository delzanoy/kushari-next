"use client";

import { forwardRef, useRef, useState } from "react";
import {
  motion, AnimatePresence,
  useMotionValue,
  animate,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { transitions } from "@/lib/motion";
import { Spinner, type SpinnerSize } from "./Spinner";
import {
  type ButtonVariant,
  type ButtonAppearance,
  type ButtonSize,
  type ButtonShape,
  type ButtonProps,
  APPEARANCE_MAP,
  HOVER_GLOW_BG,
  BUTTON_SIZE_STYLES,
  BUTTON_TYPOGRAPHY,
  BUTTON_ICON_SIZE,
  BUTTON_STROKE_W,
  BUTTON_SHAPE,
  FLAT_HOVER_GLOW_BG,
  FLAT_NOISE_URL,
  FLAT_OUTLINE_HOVER_BORDER
} from "./button.variants";

export type { ButtonVariant, ButtonAppearance, ButtonSize, ButtonShape, ButtonProps };

const SPINNER_SIZE: Record<ButtonSize, SpinnerSize> = {
  sm: "sm",
  md: "md",
  lg: "lg",
};

// ─── Icon slot ───────────────────────────────────────────────────────────────

function IconSlot({ size, isFilled, children }: { size: ButtonSize; isFilled?: boolean; children: React.ReactNode }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex items-center justify-center shrink-0 overflow-hidden",
        "[&>svg]:w-full [&>svg]:h-full [&>svg]:block",
        isFilled && "[&>svg]:drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]",
        BUTTON_ICON_SIZE[size],
      )}
    >
      {children}
    </span>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant     = "brand",
      appearance  = "filled",
      hoverVariant,
      size        = "md",
      shape       = "rounded",
      loading     = false,
      flat        = false,
      leadingIcon,
      trailingIcon,
      disabled,
      children,
      className,
      type        = "button",
      name,
      value,
      autoFocus,
      form,
      onPointerDown,
      onPointerUp,
      onPointerLeave,
      ...rest
    },
    forwardedRef
  ) {
    const isDisabled   = disabled || loading;  // blocks interaction
    const isActualDisabled = !!disabled;         // drives visual opacity-40

    // ── Hover / press tracking ──────────────────────────────────────────────
    const [hovered, setHovered] = useState(false);
    // Refs mirror state so imperative callbacks always see fresh values without stale closures.
    const hoverRef   = useRef(false);
    const pressedRef = useRef(false);
    const effectiveVariant = hovered && hoverVariant && !isDisabled ? hoverVariant : variant;

    // Apple-grade tactile springs
    const tapSpring = { type: "spring", stiffness: 400, damping: 28, mass: 0.8 } as const;
    const hoverSpring = { type: "spring", stiffness: 300, damping: 20, mass: 1 } as const;

    const variantMap = APPEARANCE_MAP[appearance];
    const v  = variantMap[variant];           // stable: focus ring, default bg
    const ev = variantMap[effectiveVariant];  // live:   bg, shadow, shimmer

    // ── Internal ref for pointer math ──────────────────────────────────────
    const buttonRef = useRef<HTMLButtonElement>(null);

    // ── Press scale (replaces whileTap — reliable on trackpads) ────────────
    const pressScale = useMotionValue(1);
    const downTimeRef = useRef(0);
    const releaseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ── Handlers ───────────────────────────────────────────────────────────
    const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
      if (!isDisabled) {
        pressedRef.current = true;
        downTimeRef.current = Date.now();
        if (releaseTimeoutRef.current) clearTimeout(releaseTimeoutRef.current);

        animate(pressScale, 0.97, tapSpring);
      }
      onPointerDown?.(e);
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
      pressedRef.current = false;
      const release = () => {
        animate(pressScale, hoverRef.current ? 1.01 : 1, tapSpring);
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
      onPointerLeave?.(e);
    };

    const handlePointerCancel = () => {
      pressedRef.current = false;
      if (releaseTimeoutRef.current) clearTimeout(releaseTimeoutRef.current);
      animate(pressScale, 1, tapSpring);
    };

    // Filled-only features
    const isFilled  = appearance === "filled";
    const isShimmer       = isFilled && (effectiveVariant === "brand" || effectiveVariant === "brand-gradient");
    const showTextShimmer = loading && !leadingIcon;
    const showStroke = isFilled;
    const hasIcons   = !!(leadingIcon || trailingIcon);

    // Ghost has no elevation shadow
    const showShadow = appearance !== "ghost" && !flat;

    // ── Background class logic ──────────────────────────────────────────────
    // Ghost bg lives on the root element (pointer-events: auto → CSS :hover/:active work).
    // All other appearances use the isolated bg span so loading can dim bg without touching content.
    const isGhost = appearance === "ghost";
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
        disabled={isDisabled}
        aria-busy={loading || undefined}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        onPointerCancel={handlePointerCancel}
        onHoverStart={() => {
          if (!isDisabled) {
            hoverRef.current = true;
            setHovered(true);
            if (!pressedRef.current) animate(pressScale, 1.01, hoverSpring);
          }
        }}
        onHoverEnd={() => {
          hoverRef.current = false;
          setHovered(false);
          if (!pressedRef.current) animate(pressScale, 1, hoverSpring);
        }}
        whileHover={isDisabled ? undefined : {
          y: showShadow ? -1 : 0,
          boxShadow: showShadow ? ev.shadow : "0 0 0 0 rgba(0,0,0,0)"
        }}
        transition={hovered ? hoverSpring : tapSpring}
        style={{ scale: pressScale }}
        className={cn(
          "relative isolate overflow-hidden inline-flex items-center justify-center select-none",
          "transform-gpu whitespace-nowrap shrink-0 touch-manipulation",
          BUTTON_TYPOGRAPHY[size],
          ev.text,
          v.focus, "focus-visible:outline-none",
          isActualDisabled ? "opacity-40 cursor-not-allowed" : loading ? "cursor-wait" : "cursor-pointer",
          BUTTON_SIZE_STYLES[size],
          BUTTON_SHAPE[shape],
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

        {/* ── 1. Hover glow — outline/ghost only (Elevated only) ────────── */}
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

        {/* ── 2. Stroke — filled only ───────────────────────────────────────
            White overlay border at mix-blend-mode: overlay reacts to hue.     */}
        {showStroke && (
          <span
            aria-hidden
            className="absolute inset-0 rounded-[inherit] pointer-events-none z-[4]"
            style={{
              border: `${BUTTON_STROKE_W[size]} solid white`,
              mixBlendMode: "overlay",
              opacity: 0.55,
              boxShadow: "inset 0 1.5px 0 rgba(255,255,255,0.20)",
            }}
          />
        )}

        {/* ── 5. Content ───────────────────────────────────────────────────  */}
        <span className="relative z-[5] inline-flex items-center justify-center gap-[inherit]">
          <AnimatePresence mode="popLayout" initial={false}>
            {loading && leadingIcon ? (
              <motion.span
                key="spinner"
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{   opacity: 0, scale: 0.4 }}
                transition={{ opacity: transitions.fast, scale: transitions.fast }}
                className="inline-flex"
                aria-hidden="true"
              >
                <Spinner size={SPINNER_SIZE[size]} className="text-current" />
              </motion.span>
            ) : !loading && leadingIcon ? (
              <motion.span
                key="leading"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={transitions.fast}
                className="inline-flex"
              >
                <IconSlot size={size} isFilled={isFilled}>{leadingIcon}</IconSlot>
              </motion.span>
            ) : null}
          </AnimatePresence>

          <span className={cn(
              hasIcons && "mx-0.5",
              isFilled && "drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]",
            )}>
            {showTextShimmer ? (
              <motion.span
                animate={{ backgroundPositionX: ["-50%", "150%"] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "linear", repeatDelay: 0.4 }}
                style={{
                  background: "linear-gradient(90deg, color-mix(in srgb, currentColor 20%, transparent) 0%, currentColor 50%, color-mix(in srgb, currentColor 20%, transparent) 100%)",
                  backgroundSize: "200% 100%",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {children}
              </motion.span>
            ) : children}
          </span>

          <AnimatePresence mode="popLayout" initial={false}>
            {trailingIcon && !loading && (
              <motion.span
                key="trailing"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{   opacity: 0, scale: 0.5 }}
                transition={transitions.fast}
                className="inline-flex"
              >
                <IconSlot size={size} isFilled={isFilled}>{trailingIcon}</IconSlot>
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </motion.button>
    );
  }
);
