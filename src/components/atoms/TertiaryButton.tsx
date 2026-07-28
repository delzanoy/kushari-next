"use client";

import { forwardRef, useRef, useCallback, useState } from "react";
import { motion, AnimatePresence, animate, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";
import { transitions } from "@/lib/motion";
import type { ButtonVariant, ButtonSize } from "./button.variants";
import { Spinner, type SpinnerSize } from "./Spinner";
import { PRIMITIVES } from "@/lib/tokens";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TertiaryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:      ButtonVariant;
  hoverVariant?: ButtonVariant;
  size?:         ButtonSize;
  loading?:      boolean;
  flat?:         boolean;
  leadingIcon?:  React.ReactNode;
  trailingIcon?: React.ReactNode;
}

// ─── Variant map ──────────────────────────────────────────────────────────────

type TertiaryStyle = {
  text:  string;
  focus: string;
};

const VARIANT: Record<ButtonVariant, TertiaryStyle> = {
  brand:            { text: "text-[var(--color-text-brand)]",    focus: "focus-visible:shadow-[var(--shadow-focus-ring-brand)]"   },
  "brand-gradient": { text: "text-[var(--color-text-brand)]",    focus: "focus-visible:shadow-[var(--shadow-focus-ring-brand)]"   },
  neutral:          { text: "text-[var(--color-text-secondary)]", focus: "focus-visible:shadow-[var(--shadow-focus-ring-neutral)]" },
  danger:           { text: "text-[var(--color-text-danger)]",   focus: "focus-visible:shadow-[var(--shadow-focus-ring-danger)]"  },
  warning:          { text: "text-[var(--color-text-warning)]",  focus: "focus-visible:shadow-[var(--shadow-focus-ring-warning)]" },
  success:          { text: "text-[var(--color-text-success)]",  focus: "focus-visible:shadow-[var(--shadow-focus-ring-success)]" },
};

// ─── Size scale ───────────────────────────────────────────────────────────────

const TYPOGRAPHY: Record<ButtonSize, string> = {
  sm: "text-xs   font-medium tracking-normal",
  md: "text-sm   font-medium tracking-tight",
  lg: "text-base font-medium tracking-tight",
};

const ICON_SIZE: Record<ButtonSize, string> = {
  sm: "w-3   h-3",
  md: "w-3.5 h-3.5",
  lg: "w-4   h-4",
};

const SPINNER_SIZE: Record<ButtonSize, SpinnerSize> = {
  sm: "xs",
  md: "sm",
  lg: "md",
};

const GAP: Record<ButtonSize, string> = {
  sm: "gap-1",
  md: "gap-1.5",
  lg: "gap-2",
};

// ─── Springs — stable object refs, safe as useCallback deps ──────────────────

const TAP_SPRING   = { type: "spring", stiffness: 400, damping: 28, mass: 0.8 } as const;

// ─── Icon slot (decorative, so aria-hidden) ───────────────────────────────────

function IconSlot({ size, children }: { size: ButtonSize; children: React.ReactNode }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex items-center justify-center shrink-0",
        "[&>svg]:w-full [&>svg]:h-full [&>svg]:block [&>svg]:opacity-75",
        ICON_SIZE[size],
      )}
    >
      {children}
    </span>
  );
}

// ─── Motion variant definitions ───────────────────────────────────────────────
// Declared outside the component so the reference is stable across renders.
// The "hover" / "tap" keys propagate down to every child motion element
// that declares matching variant keys — Framer's variant inheritance.

const UNDERLINE_VARIANTS = {
  rest:  { scaleX: 0,    scaleY: PRIMITIVES.stroke.hairline },
  hover: { scaleX: 1,    scaleY: PRIMITIVES.stroke.thin     },
  tap:   { scaleX: 0.95, scaleY: PRIMITIVES.stroke.thin     },
} as const;

const TRAIL_VARIANTS = {
  rest:  { x: 0 },
  hover: { x: 3 },
  tap:   { x: 1 },
} as const;

// ─── Component ───────────────────────────────────────────────────────────────

export const TertiaryButton = forwardRef<HTMLButtonElement, TertiaryButtonProps>(
  function TertiaryButton(
    {
      variant  = "brand",
      hoverVariant,
      size     = "md",
      loading  = false,
      flat     = false,
      leadingIcon,
      trailingIcon,
      disabled,
      children,
      className,
      onPointerDown,
      onPointerUp,
      onPointerLeave,
      ...rest
    },
    ref
  ) {
    const isDisabled       = disabled || loading;
    const isActualDisabled = !!disabled;

    const [hovered, setHovered] = useState(false);
    const hoverRef = useRef(false);
    const pressedRef = useRef(false);
    const pressScale = useMotionValue(1);
    const pressY = useMotionValue(0);
    const downTimeRef = useRef(0);
    const releaseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handlePointerDown = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
      if (!isDisabled) {
        pressedRef.current = true;
        downTimeRef.current = Date.now();
        if (releaseTimeoutRef.current) clearTimeout(releaseTimeoutRef.current);
        animate(pressScale, 0.99, TAP_SPRING);
        animate(pressY, 0.5, TAP_SPRING);
      }
      onPointerDown?.(e);
    }, [isDisabled, onPointerDown, pressScale, pressY]);

    const handlePointerUp = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
      pressedRef.current = false;
      const release = () => {
        animate(pressScale, 1, TAP_SPRING);
        animate(pressY, hoverRef.current ? (flat ? 0 : -0.25) : 0, TAP_SPRING);
      };

      const elapsed = Date.now() - downTimeRef.current;
      if (elapsed < 150) {
        releaseTimeoutRef.current = setTimeout(release, 150 - elapsed);
      } else {
        release();
      }
      onPointerUp?.(e);
    }, [onPointerUp, pressScale, pressY]);

    const handlePointerLeave = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
      pressedRef.current = false;
      if (releaseTimeoutRef.current) clearTimeout(releaseTimeoutRef.current);
      animate(pressScale, 1, TAP_SPRING);
      animate(pressY, 0, TAP_SPRING);
      onPointerLeave?.(e);
    }, [onPointerLeave, pressScale, pressY]);

    const handlePointerCancel = useCallback(() => {
      pressedRef.current = false;
      if (releaseTimeoutRef.current) clearTimeout(releaseTimeoutRef.current);
      animate(pressScale, 1, TAP_SPRING);
      animate(pressY, 0, TAP_SPRING);
    }, [pressScale, pressY]);

    const v = VARIANT[variant];
    const effectiveVariant = hovered && hoverVariant && !isDisabled ? hoverVariant : variant;
    const ev = VARIANT[effectiveVariant];

    return (
      <motion.button
        ref={ref}
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
            if (!pressedRef.current) animate(pressY, flat ? 0 : -0.25, transitions.standard);
          }
        }}
        onHoverEnd={() => {
          hoverRef.current = false;
          setHovered(false);
          if (!pressedRef.current) animate(pressY, 0, transitions.standard);
        }}
        style={{ scale: pressScale, y: pressY }}
        whileHover={isDisabled ? undefined : "hover"}
        whileTap={isDisabled ? undefined : "tap"}
        transition={transitions.standard}
        className={cn(
          // Inline-level element — no height, no padding (except tiny horizontal for focus ring)
          "relative inline-flex items-center select-none",
          "focus-visible:outline-none rounded-sm px-0.5",
          GAP[size],
          TYPOGRAPHY[size],
          ev.text,
          ev.focus,
          isActualDisabled ? "opacity-40 cursor-not-allowed" : loading ? "cursor-wait" : "cursor-pointer",
          className,
        )}
        {...(rest as React.ComponentProps<typeof motion.button>)}
      >
        {/* ── Leading icon / spinner swap ─────────────────────────────────
            AnimatePresence handles the cross-fade between spinner + icon.  */}
        <AnimatePresence mode="popLayout" initial={false}>
          {loading ? (
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
          ) : leadingIcon ? (
            <motion.span
              key="leading"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{   opacity: 0, scale: 0.5 }}
              transition={transitions.fast}
              className="inline-flex"
            >
              <IconSlot size={size}>{leadingIcon}</IconSlot>
            </motion.span>
          ) : null}
        </AnimatePresence>

        {/* ── Label + animated underline ──────────────────────────────────
            Two layers:
            1. Resting hairline  — always-on, 20% opacity, shows affordance.
            2. Hover underline   — scaleX: 0 → 1, wipes in from the left.
               When fully grown it covers the resting line, reading as solid. */}
        <span className="relative leading-none">
          {children}

          {/* Resting hairline */}
          <span
            aria-hidden
            className="absolute left-0 right-0 bottom-[-2px] h-px bg-current opacity-20 rounded-full"
          />

          {/* Hover underline — variant propagation drives scaleX */}
          <motion.span
            aria-hidden
            className="absolute left-0 right-0 bottom-[-2px] h-px bg-current rounded-full origin-left"
            variants={UNDERLINE_VARIANTS}
            transition={transitions.spring}
          />
        </span>

        {/* ── Trailing icon — slides forward on hover ──────────────────── */}
        <AnimatePresence mode="popLayout" initial={false}>
          {trailingIcon && !loading && (
            <motion.span
              key="trailing"
              initial={{ opacity: 0, scale: 0.5, x: -4 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{   opacity: 0, scale: 0.5, x: 4 }}
              variants={TRAIL_VARIANTS}
              transition={transitions.spring}
              className="inline-flex"
            >
              <IconSlot size={size}>{trailingIcon}</IconSlot>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    );
  }
);

TertiaryButton.displayName = "TertiaryButton";
