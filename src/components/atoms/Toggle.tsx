"use client";

import { forwardRef, useId, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToggleSize = "sm" | "md" | "lg";
export type ToggleVariant = "brand" | "brand-gradient" | "danger" | "warning" | "success";

export interface ToggleProps {
  /** Controlled checked state. Omit for uncontrolled. */
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  /** Colour of the checked track. Default: "brand". */
  variant?: ToggleVariant;
  size?: ToggleSize;
  disabled?: boolean;
  /** Text label shown next to the toggle. */
  label?: React.ReactNode;
  /** Position of the label relative to the toggle. Default: "right". */
  labelSide?: "left" | "right";
  /** Secondary line of text below the label. */
  description?: React.ReactNode;
  /** Name attribute for form submission. */
  name?: string;
  /** Value attribute for form submission. */
  value?: string;
  /** Autofocus on mount. */
  autoFocus?: boolean;
  id?: string;
  className?: string;
  "aria-label"?: string;
}

// ─── Size maps ────────────────────────────────────────────────────────────────
//
// Track proportions follow the 3:5 width-to-height ratio common in platform
// design guidelines. Thumb diameter is track height minus 2× inset.

const TRACK_W:  Record<ToggleSize, number> = { sm: 28, md: 36, lg: 44 };
const TRACK_H:  Record<ToggleSize, number> = { sm: 16, md: 20, lg: 24 };
const INSET:    Record<ToggleSize, number> = { sm: 3,  md: 3,  lg: 3  };

const LABEL_TEXT: Record<ToggleSize, string> = {
  sm: "text-xs  font-medium tracking-normal",
  md: "text-sm  font-medium tracking-tight",
  lg: "text-base font-medium tracking-tight",
};
const DESC_TEXT: Record<ToggleSize, string> = {
  sm: "text-xs  tracking-normal",
  md: "text-xs  tracking-normal",
  lg: "text-sm  tracking-tight",
};
const GAP: Record<ToggleSize, string> = {
  sm: "gap-2",
  md: "gap-2.5",
  lg: "gap-3",
};

// Alignment adjustment for description text
const TRACK_MT_WITH_DESC: Record<ToggleSize, string> = {
  sm: "mt-[2px]",
  md: "mt-[2px]",
  lg: "mt-[3px]",
};

// ─── Variant styles ───────────────────────────────────────────────────────────

const TRACK_ON_BG: Record<ToggleVariant, string> = {
  brand: "var(--color-control-fill-brand)",
  "brand-gradient": "var(--color-control-fill-brand)",
  danger: "var(--color-control-fill-danger)",
  warning: "var(--color-control-fill-warning)",
  success: "var(--color-control-fill-success)",
};

const HOVER_TINT: Record<ToggleVariant, string> = {
  brand: "var(--color-control-tint-brand)",
  "brand-gradient": "var(--color-control-tint-brand)",
  danger: "var(--color-control-tint-danger)",
  warning: "var(--color-control-tint-warning)",
  success: "var(--color-control-tint-success)",
};

const FOCUS_RING: Record<ToggleVariant, string> = {
  brand: "0 0 0 2px #0A0A0A, 0 0 0 4px rgba(38,  201, 201, 0.50)",
  "brand-gradient": "0 0 0 2px #0A0A0A, 0 0 0 4px rgba(38,  201, 201, 0.50)",
  danger: "0 0 0 2px #0A0A0A, 0 0 0 4px rgba(239,  68,  68, 0.50)",
  warning: "0 0 0 2px #0A0A0A, 0 0 0 4px rgba(245, 158,  11, 0.50)",
  success: "0 0 0 2px #0A0A0A, 0 0 0 4px rgba( 34, 197,  94, 0.50)",
};

const FOCUS_RING_OFF = "0 0 0 0px rgba(0,0,0,0), 0 0 0 0px rgba(0,0,0,0)";

// ─── Motion ───────────────────────────────────────────────────────────────────

const TRACK_SPRING        = { type: "spring", stiffness: 500, damping: 36, mass: 0.6 } as const;
const THUMB_SPRING        = { type: "spring", stiffness: 600, damping: 38, mass: 0.5 } as const;
const THUMB_STRETCH_SPRING = { type: "spring", stiffness: 800, damping: 40, mass: 0.4 } as const;

// ─── Component ────────────────────────────────────────────────────────────────

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  function Toggle(
    {
      checked: controlledChecked,
      defaultChecked = false,
      onChange,
      variant   = "brand",
      size      = "md",
      disabled  = false,
      label,
      labelSide = "right",
      description,
      name,
      value,
      autoFocus = false,
      id: externalId,
      className,
      "aria-label": ariaLabel,
      ...rest
    },
    forwardedRef
  ) {
    const generatedId   = useId();
    const id            = externalId ?? generatedId;
    const descriptionId = description ? `${id}-description` : undefined;
    const inputRef    = useRef<HTMLInputElement | null>(null);

    const [focused, setFocused] = useState(false);
    const [hovered, setHovered] = useState(false);

    const isControlled = controlledChecked !== undefined;
    const [internalChecked, setInternalChecked] = useState(defaultChecked);
    const isChecked    = isControlled ? !!controlledChecked : internalChecked;
    const isDisabled   = !!disabled;

    const trackW = TRACK_W[size];
    const trackH = TRACK_H[size];
    const inset  = INSET[size];
    const thumbD = trackH - inset * 2;   // always fills the track vertically minus inset

    // Thumb stretch amount on hover
    const stretchAmount = thumbD * 0.4;

    // x positions: thumb travels from inset → (trackW - thumbD - inset)
    const xOff = inset;
    const xOn  = trackW - thumbD - inset;

    const hasLabel       = !!label;
    const hasDesc        = !!description;
    const outerAlign     = hasDesc ? "items-start" : "items-center";
    const trackTopOffset = hasDesc ? TRACK_MT_WITH_DESC[size] : "";

    const showGhost = hovered && !isDisabled;
    const isStretching = showGhost;

    // Normal width, or stretched width pulling in the direction of travel
    const currentThumbW = isStretching ? thumbD + stretchAmount : thumbD;
    // When checked and stretching towards off (-), x must offset the extra width so the right edge stays anchored.
    const currentThumbX = isChecked 
      ? (isStretching ? xOn - stretchAmount : xOn) 
      : xOff;

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const next = e.target.checked;
        if (!isControlled) setInternalChecked(next);
        onChange?.(next);
      },
      [isControlled, onChange]
    );

    return (
      <div
        className={cn(
          "inline-flex",
          outerAlign,
          GAP[size],
          labelSide === "left" ? "flex-row-reverse" : "flex-row",
          className,
        )}
        onMouseEnter={() => !isDisabled && setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* ── Track + hidden input ─────────────────────────────────────────── */}
        <div className={cn("relative shrink-0", trackTopOffset)}>

          {/* Native input — accessible, visually hidden */}
          <input
            ref={(node) => {
              inputRef.current = node;
              if (typeof forwardedRef === "function") forwardedRef(node);
              else if (forwardedRef) forwardedRef.current = node;
            }}
            id={id}
            type="checkbox"
            role="switch"
            checked={isControlled ? isChecked : undefined}
            defaultChecked={!isControlled ? defaultChecked : undefined}
            name={name}
            value={value}
            autoFocus={autoFocus}
            disabled={isDisabled}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            aria-checked={isChecked}
            aria-label={(!hasLabel && !hasDesc) ? ariaLabel : undefined}
            aria-describedby={descriptionId}
            className="sr-only"
            {...rest as any}
          />

          <motion.label
            htmlFor={id}
            className={cn(
              "relative flex shrink-0 cursor-pointer select-none outline-none items-center rounded-full overflow-hidden",
              "transition-[background-color,border-color] duration-150 ease-out",
              isDisabled && "cursor-not-allowed opacity-40",
            )}
            style={{ width: trackW, height: trackH }}
            animate={{
              backgroundColor: isChecked ? TRACK_ON_BG[variant] : "var(--color-surface-overlay)",
              boxShadow: focused ? FOCUS_RING[variant] : FOCUS_RING_OFF,
            }}
            transition={{
              boxShadow: { duration: 0.15, ease: "easeOut" },
              backgroundColor: TRACK_SPRING,
            }}
          >
            {/* Hover tint bloom */}
            <AnimatePresence>
              {showGhost && (
                <motion.span
                  key="tint"
                  className="absolute inset-0 pointer-events-none"
                  style={{ backgroundColor: HOVER_TINT[variant] }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                />
              )}
            </AnimatePresence>

            {/* Thumb */}
            <motion.span
              aria-hidden
              className={cn(
                "absolute rounded-full bg-white",
                "shadow-[var(--shadow-sm)]"
              )}
              style={{
                top:    inset,
                height: thumbD,
              }}
              animate={{
                x: currentThumbX,
                width: currentThumbW
              }}
              initial={false}
              transition={isStretching ? THUMB_STRETCH_SPRING : THUMB_SPRING}
            />
          </motion.label>
        </div>

        {/* ── Label + description ───────────────────────────────────────────── */}
        {(hasLabel || hasDesc) && (
          <label
            htmlFor={id}
            className={cn(
              "flex flex-col gap-0.5 select-none",
              isDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
            )}
          >
            {hasLabel && (
              <span className={cn(LABEL_TEXT[size], "text-[var(--color-text-primary)] leading-none")}>
                {label}
              </span>
            )}
            {hasDesc && (
              <span id={descriptionId} className={cn(DESC_TEXT[size], "text-[var(--color-text-muted)] leading-snug")}>
                {description}
              </span>
            )}
          </label>
        )}
      </div>
    );
  }
);
Toggle.displayName = "Toggle";
