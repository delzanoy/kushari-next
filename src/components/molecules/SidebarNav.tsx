"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Toggle, type ToggleVariant } from "@/components/atoms/Toggle";
import { RiArrowRightSLine } from "@remixicon/react";

// ─── Motion constants ─────────────────────────────────────────────────────────

const SPRING_PRESS   = { type: "spring", stiffness: 480, damping: 38, mass: 0.7 } as const;
const SPRING_CHEVRON = { type: "spring", stiffness: 360, damping: 28, mass: 0.7 } as const;
const SPRING_COLLAPSE= { type: "spring", stiffness: 500, damping: 44, mass: 0.6 } as const;
const FAST           = { duration: 0.13, ease: [0, 0, 0.2, 1]                  } as const;

// Brand RGB channels — matches --color-interactive-brand-default (#26C9C9)
const B = "38,201,201";

const MotionLink = motion.create(Link);

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SidebarNavListProps {
  children: React.ReactNode;
  className?: string;
}

export interface SidebarNavItemProps {
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  /** Count badge, or "dot" for a glowing presence pip. */
  badge?: number | "dot";
  /** Replaces badge — freeform trailing slot. */
  trailingContent?: React.ReactNode;
  className?: string;
}

export interface SidebarNavGroupProps {
  label?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

export interface SidebarNavToggleProps {
  label: string;
  description?: string;
  icon?: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  variant?: ToggleVariant;
  disabled?: boolean;
  className?: string;
}

// ─── SidebarNavList ───────────────────────────────────────────────────────────
// Semantic container — flex column with consistent gap between items.

export function SidebarNavList({ children, className }: SidebarNavListProps) {
  return (
    <div className={cn("flex flex-col gap-[2px]", className)}>
      {children}
    </div>
  );
}

// ─── SidebarNavItem ───────────────────────────────────────────────────────────
//
// Visual states:
//  rest   — hairline ring, label text-text-muted, icon white/45%
//  hover  — tonal-bg-hover + brand ring, label text-text-secondary, icon white/80%
//  active — elevated bg (#1B1B1B) + brand ring, label text-text-primary, icon brand
//
// Hover/active backgrounds: absolutely positioned divs, opacity-animated.
// Box-shadow ring on hairline and hover: stays inside the element — no overflow.

export function SidebarNavItem({
  label,
  icon,
  href,
  onClick,
  active    = false,
  disabled  = false,
  badge,
  trailingContent,
  className,
}: SidebarNavItemProps) {
  const [hovered, setHovered] = useState(false);
  const [externalHover, setExternalHover] = useState(false);

  useEffect(() => {
    if (!href) return;
    const handleNavHover = (e: Event) => {
      const customEvent = e as CustomEvent<{ isHovering: boolean; targetNav: string }>;
      if (customEvent.detail?.targetNav === href) {
        setExternalHover(customEvent.detail.isHovering);
      }
    };
    window.addEventListener('groupCardHover', handleNavHover);
    return () => window.removeEventListener('groupCardHover', handleNavHover);
  }, [href]);

  const isHovered = hovered || externalHover;

  const layers = (
    <>
      {/* Active bg — fades in/out (no layout animation). #1B1B1B is a neutral
          elevated surface; teal-tinted surface tokens would clash here. */}
      <motion.div
        className="absolute inset-0 rounded-[10.5px] pointer-events-none"
        animate={{ opacity: active ? 1 : 0 }}
        transition={FAST}
        style={{ background: "#1B1B1B" }}
      />

      {/* Active: brand top highlight + ring */}
      <motion.div
        className="absolute inset-0 rounded-[10.5px] pointer-events-none"
        animate={{ opacity: active ? 1 : 0 }}
        transition={FAST}
        style={{ boxShadow: `inset 0 0.5px 0 rgba(${B},0.45), inset 0 0 0 0.5px rgba(${B},0.15)` }}
      />

      {/* Hover: tonal-bg-hover fill + brand ring */}
      <motion.div
        className="absolute inset-0 rounded-[10.5px] pointer-events-none"
        animate={{ opacity: isHovered && !active ? 1 : 0 }}
        transition={FAST}
        style={{
          background: "var(--color-interactive-brand-tonal-bg-hover)",
          boxShadow: `inset 0 0.5px 0 rgba(${B},0.60), inset 0 0 0 0.5px rgba(${B},0.18)`,
        }}
      />

      {/* Resting hairline (removed per request) */}
    </>
  );

  const content = (
    // text-left overrides <button>'s default text-align:center
    <span className="relative z-10 flex w-full items-center gap-[10px] pl-[10px] pr-[12px] py-[9px] text-left">
      {icon && (
        <motion.span
          className="inline-flex items-center justify-center shrink-0 w-[15px] h-[15px]"
          animate={{
            color: active
              ? `rgba(${B},0.95)`
              : isHovered
              ? "var(--color-icon-primary)"
              : "var(--color-icon-secondary)",
            x: isHovered && !active ? 1 : 0,
          }}
          transition={{ color: FAST, x: SPRING_PRESS }}
        >
          {icon}
        </motion.span>
      )}

      <motion.span
        className="flex-1 min-w-0 text-base font-medium leading-none tracking-wide truncate"
        animate={{
          color: active
            ? "var(--color-text-primary)"
            : isHovered
            ? "var(--color-text-primary)"
            : "var(--color-text-secondary)",
        }}
        transition={FAST}
      >
        {label}
      </motion.span>

      {trailingContent ??
        (badge !== undefined &&
          (badge === "dot" ? (
            <motion.span
              className="shrink-0 w-[5px] h-[5px] rounded-full"
              style={{
                backgroundColor: `rgba(${B},1)`,
                boxShadow: `0 0 5px rgba(${B},0.65), 0 0 10px rgba(${B},0.20)`,
              }}
              animate={{ scale: [1, 1.18, 1] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut", repeatDelay: 2 }}
            />
          ) : (
            <span
              className="shrink-0 text-2xs font-mono leading-none tabular-nums px-[5px] pt-[3px] pb-[2px] rounded-[5px]"
              style={{
                color: "var(--color-text-muted)",
                background: "rgba(255,255,255,0.08)",
                border: "0.5px solid rgba(255,255,255,0.10)",
              }}
            >
              {badge}
            </span>
          )))}
    </span>
  );

  const rootClass = cn(
    // block ensures full-width stretch; text-left overrides button default
    "relative block w-full text-left select-none rounded-[10.5px]",
    "focus-visible:outline-none",
    disabled ? "opacity-40 pointer-events-none" : "cursor-pointer",
    className,
  );

  const motionEvents = {
    onHoverStart: () => !disabled && setHovered(true),
    onHoverEnd:   () => setHovered(false),
    whileTap:     disabled ? undefined : ({ scale: 0.975 } as const),
    transition:   { scale: SPRING_PRESS },
  };

  if (href) {
    return (
      <MotionLink href={href} aria-current={active ? "page" : undefined} className={rootClass} {...motionEvents}>
        {layers}{content}
      </MotionLink>
    );
  }

  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      aria-current={active ? "page" : undefined}
      className={rootClass}
      {...motionEvents}
    >
      {layers}{content}
    </motion.button>
  );
}

// ─── SidebarNavGroup ──────────────────────────────────────────────────────────

export function SidebarNavGroup({
  label,
  collapsible  = false,
  defaultOpen  = true,
  open: controlledOpen,
  onOpenChange,
  children,
  className,
}: SidebarNavGroupProps) {
  const isControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = isControlled ? !!controlledOpen : internalOpen;

  const toggle = () => {
    if (!collapsible) return;
    const next = !isOpen;
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  return (
    <div className={cn("flex flex-col", className)}>
      {label && (
        <motion.button
          type="button"
          onClick={collapsible ? toggle : undefined}
          whileTap={collapsible ? { scale: 0.98 } : undefined}
          transition={{ scale: SPRING_PRESS }}
          className={cn(
            "group/hdr flex items-center gap-1 px-[11px] pt-[10px] pb-[5px] w-full text-left select-none",
            collapsible ? "cursor-pointer" : "cursor-default",
          )}
        >
          <span className="flex-1 font-mono text-2xs tracking-[0.28em] uppercase transition-colors duration-150 text-text-muted group-hover/hdr:text-text-secondary">
            {label}
          </span>
          {collapsible && (
            <motion.span
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={SPRING_CHEVRON}
              className="inline-flex text-text-muted group-hover/hdr:text-text-secondary transition-colors duration-150"
            >
              <RiArrowRightSLine size={11} />
            </motion.span>
          )}
        </motion.button>
      )}

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ height: SPRING_COLLAPSE, opacity: FAST }}
            className="overflow-hidden px-[1px]"
          >
            <div className="flex flex-col gap-[2px] pb-[2px]">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── SidebarNavToggle ─────────────────────────────────────────────────────────
// Full row click toggles the value. Toggle's container stopPropagation prevents
// double-fire — the Toggle's native onChange handles that click path.

export function SidebarNavToggle({
  label,
  description,
  icon,
  checked,
  defaultChecked,
  onChange,
  variant  = "brand",
  disabled = false,
  className,
}: SidebarNavToggleProps) {
  const [hovered, setHovered] = useState(false);

  const isControlled = checked !== undefined;
  const [internal, setInternal] = useState(defaultChecked ?? false);
  const isChecked = isControlled ? !!checked : internal;

  const handleToggle = () => {
    if (disabled) return;
    const next = !isChecked;
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  const toggleLayers = (
    <>
      {/* Checked bg — same neutral elevated surface as active nav item */}
      <motion.div
        className="absolute inset-0 rounded-[10.5px] pointer-events-none"
        animate={{ opacity: isChecked && !hovered ? 1 : 0 }}
        transition={FAST}
        style={{ background: "#1B1B1B" }}
      />
      {/* Checked ring — softer brand glow than active nav item */}
      <motion.div
        className="absolute inset-0 rounded-[10.5px] pointer-events-none"
        animate={{ opacity: isChecked && !hovered ? 1 : 0 }}
        transition={FAST}
        style={{ boxShadow: `inset 0 0.5px 0 rgba(${B},0.30), inset 0 0 0 0.5px rgba(${B},0.10)` }}
      />
      {/* Hover fill + brand ring — same as nav item hover */}
      <motion.div
        className="absolute inset-0 rounded-[10.5px] pointer-events-none"
        animate={{ opacity: hovered && !disabled ? 1 : 0 }}
        transition={FAST}
        style={{
          background: "var(--color-interactive-brand-tonal-bg-hover)",
          boxShadow: `inset 0 0.5px 0 rgba(${B},0.60), inset 0 0 0 0.5px rgba(${B},0.18)`,
        }}
      />
      {/* Resting hairline removed per request */}
    </>
  );

  return (
    <motion.button
      type="button"
      onClick={handleToggle}
      disabled={disabled}
      onHoverStart={() => !disabled && setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileTap={disabled ? undefined : { scale: 0.975 }}
      transition={{ scale: SPRING_PRESS }}
      className={cn(
        "relative flex items-center w-full text-left select-none rounded-[10.5px] focus-visible:outline-none",
        disabled ? "opacity-40 pointer-events-none" : "cursor-pointer",
        className,
      )}
    >
      {toggleLayers}

      <span className="relative z-10 flex w-full items-center gap-[10px] pl-[10px] pr-[8px] py-[9px]">
        {icon && (
          <motion.span
            className="inline-flex items-center justify-center shrink-0 w-[15px] h-[15px]"
            animate={{
              color: hovered
                ? "var(--color-icon-primary)"
                : isChecked
                ? `rgba(${B},0.90)`
                : "var(--color-icon-secondary)",
            }}
            transition={FAST}
          >
            {icon}
          </motion.span>
        )}

        <div className="flex-1 min-w-0">
          <motion.span
            className="block text-base font-medium tracking-wide leading-none truncate"
            animate={{
              color: hovered || isChecked
                ? "var(--color-text-primary)"
                : "var(--color-text-secondary)",
            }}
            transition={FAST}
          >
            {label}
          </motion.span>
          {description && (
            <motion.span
              className="block text-xs tracking-[0.005em] leading-snug truncate mt-1"
              animate={{ color: hovered ? "var(--color-text-muted)" : "var(--color-text-disabled)" }}
              transition={FAST}
            >
              {description}
            </motion.span>
          )}
        </div>

        {/* stopPropagation so row click and Toggle click don't both fire */}
        <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
          <Toggle
            size="sm"
            variant={variant}
            checked={isChecked}
            onChange={handleToggle}
            disabled={disabled}
            aria-label={label}
          />
        </div>
      </span>
    </motion.button>
  );
}

// ─── SidebarNavSeparator ──────────────────────────────────────────────────────

export function SidebarNavSeparator({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("mx-[10px] my-1_5 h-px shrink-0", className)}
      style={{
        background:
          "linear-gradient(90deg, transparent 0%, var(--color-border-subtle) 20%, var(--color-border-subtle) 80%, transparent 100%)",
      }}
    />
  );
}
