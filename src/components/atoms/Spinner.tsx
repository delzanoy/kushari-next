"use client";

import { motion } from "framer-motion";
import { RiLoader5Line } from "@remixicon/react";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

export type SpinnerSize    = "xs" | "sm" | "md" | "lg" | "xl";
export type SpinnerVariant = "brand" | "neutral" | "danger" | "warning" | "success";

export interface SpinnerProps {
  size?:      SpinnerSize;
  variant?:   SpinnerVariant;
  speed?:     "slow" | "default" | "fast";
  className?: string;
}

// ─── Maps ─────────────────────────────────────────────────────────────────────

const SIZE: Record<SpinnerSize, string> = {
  xs: "w-3   h-3",
  sm: "w-3.5 h-3.5",
  md: "w-4   h-4",
  lg: "w-5   h-5",
  xl: "w-6   h-6",
};

const VARIANT_COLOR: Record<SpinnerVariant, string> = {
  brand:   "text-[var(--color-text-brand)]",
  neutral: "text-[var(--color-text-secondary)]",
  danger:  "text-[var(--color-text-danger)]",
  warning: "text-[var(--color-text-warning)]",
  success: "text-[var(--color-text-success)]",
};

const SPEED_DURATION: Record<"slow" | "default" | "fast", number> = {
  slow:    1.2,
  default: 0.75,
  fast:    0.45,
};

// ─── Component ───────────────────────────────────────────────────────────────

export function Spinner({
  size    = "md",
  variant = "brand",
  speed   = "default",
  className,
}: SpinnerProps) {
  return (
    <motion.span
      aria-hidden
      inherit={false}
      className={cn(
        "inline-flex items-center justify-center shrink-0 animate-spin",
        "[&>svg]:w-full [&>svg]:h-full [&>svg]:block",
        SIZE[size],
        VARIANT_COLOR[variant],
        className,
      )}
      style={{
        animationDuration: `${SPEED_DURATION[speed]}s`,
      }}
    >
      <RiLoader5Line />
    </motion.span>
  );
}
