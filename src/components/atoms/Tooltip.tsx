"use client";

import React, {
  useRef,
  useState,
  useCallback,
  useLayoutEffect,
  useEffect,
  useId,
  createContext,
  useContext,
  useMemo,
} from "react";
import { createPortal } from "react-dom";
import {
  motion, AnimatePresence,
  useMotionValue,
  animate as fmAnimate,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { transitions } from "@/lib/motion";
import {
  RiCloseLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
} from "@remixicon/react";
import { Button } from "./Button";
import { IconButton } from "./IconButton";
import type { ButtonVariant, ButtonAppearance } from "./button.variants";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TooltipAction {
  label: string;
  onClick?: () => void;
  variant?: ButtonVariant;
  appearance?: ButtonAppearance;
}

export type TooltipPlacement =
  | "top" | "top-start" | "top-end"
  | "bottom" | "bottom-start" | "bottom-end"
  | "left" | "left-start" | "left-end"
  | "right" | "right-start" | "right-end";

export interface TooltipStep {
  title: string;
  description: string;
}

export interface TooltipProps {
  children: React.ReactNode;
  /** Simple compact label */
  content?: React.ReactNode;
  /** Rich / action variant: heading */
  title?: string;
  /** Rich / action variant: body */
  description?: React.ReactNode;
  /** Action variant: buttons rendered below description */
  actions?: TooltipAction[];
  /** Tour variant: ordered steps */
  steps?: TooltipStep[];
  /** Tour: active 0-based step index */
  currentStep?: number;
  onNext?: () => void;
  onPrev?: () => void;
  onClose?: () => void;
  /** "hover" (default) | "click" */
  trigger?: "hover" | "click";
  placement?: TooltipPlacement;
  /** Hover show delay in ms (default 500) */
  delay?: number;
  /** Gap between tooltip and trigger in px (default 8) */
  offset?: number;
  /** Max width in px (defaults per variant) */
  maxWidth?: number;
  /** Arrow pointing at trigger (default true) */
  showArrow?: boolean;
  /** Keyboard shortcut badge shown in label variant */
  shortcut?: string;
  /** Accent border / dot color */
  variant?: "default" | "brand" | "danger" | "warning" | "success";
  /** Controlled open */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  className?: string;
}

// ─── Motion variants (direction-aware) ───────────────────────────────────────

const MOTION: Record<string, object> = {
  top: { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 4 } },
  bottom: { initial: { opacity: 0, y: -6 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -4 } },
  left: { initial: { opacity: 0, x: 6 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 4 } },
  right: { initial: { opacity: 0, x: -6 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -4 } },
};

// ─── Accent tokens ────────────────────────────────────────────────────────────

const ACCENT_BORDER: Record<string, string> = {
  default: "border-[var(--color-border-default)]",
  brand: "border-[var(--color-border-brand)]",
  danger: "border-[var(--color-border-danger)]",
  warning: "border-[var(--color-border-warning)]",
  success: "border-[var(--color-border-success)]",
};

const ACCENT_DOT: Record<string, string> = {
  default: "bg-[var(--color-text-muted)]",
  brand: "bg-[var(--color-text-brand)]",
  danger: "bg-[var(--color-text-danger)]",
  warning: "bg-[var(--color-text-warning)]",
  success: "bg-[var(--color-text-success)]",
};

const ACCENT_TEXT: Record<string, string> = {
  default: "text-[var(--color-text-secondary)]",
  brand: "text-[var(--color-text-brand)]",
  danger: "text-[var(--color-text-danger)]",
  warning: "text-[var(--color-text-warning)]",
  success: "text-[var(--color-text-success)]",
};

// ─── Positioning ──────────────────────────────────────────────────────────────

function calcPos(
  tr: DOMRect,
  tw: number,
  th: number,
  placement: TooltipPlacement,
  offset: number,
): { top: number; left: number } {
  const [side, align = "center"] = placement.split("-");
  let top = 0, left = 0;

  switch (side) {
    case "top": top = tr.top - th - offset; break;
    case "bottom": top = tr.bottom + offset; break;
    case "left": left = tr.left - tw - offset; break;
    case "right": left = tr.right + offset; break;
  }

  if (side === "top" || side === "bottom") {
    if (align === "start") left = tr.left;
    else if (align === "end") left = tr.right - tw;
    else left = tr.left + tr.width / 2 - tw / 2;
  } else {
    if (align === "start") top = tr.top;
    else if (align === "end") top = tr.bottom - th;
    else top = tr.top + tr.height / 2 - th / 2;
  }

  const pad = 8;
  left = Math.max(pad, Math.min(left, window.innerWidth - tw - pad));
  top = Math.max(pad, Math.min(top, window.innerHeight - th - pad));
  return { top, left };
}

// ─── Arrow ────────────────────────────────────────────────────────────────────

const ARROW_SIDES: Record<string, string> = {
  top: "border-r border-b",
  bottom: "border-l border-t",
  left: "border-r border-t",
  right: "border-l border-b",
};

function Arrow({
  placement,
  accent,
}: {
  placement: TooltipPlacement;
  accent: string;
}) {
  const [side, align = "center"] = placement.split("-");
  const sz = 9;
  const half = -(sz / 2 + 0.5);

  const base: React.CSSProperties = {
    position: "absolute",
    width: sz,
    height: sz,
    background: "var(--color-surface-sunken)",
    transform: "rotate(45deg)",
    zIndex: 1,
  };

  if (side === "top" || side === "bottom") {
    if (side === "top") base.bottom = half; else base.top = half;
    if (align === "start") { base.left = 16; }
    else if (align === "end") { base.right = 16; }
    else { base.left = "50%"; base.transform = "translateX(-50%) rotate(45deg)"; }
  } else {
    if (side === "left") base.right = half; else base.left = half;
    if (align === "start") { base.top = 16; }
    else if (align === "end") { base.bottom = 16; }
    else { base.top = "50%"; base.transform = "translateY(-50%) rotate(45deg)"; }
  }

  const borderCls = ARROW_SIDES[side] ?? "";
  const accentBorder = accent === "default"
    ? "border-[var(--color-border-default)]"
    : ACCENT_BORDER[accent];

  return <div className={cn(borderCls, accentBorder)} style={base} />;
}

// ─── Tooltip body variants ────────────────────────────────────────────────────

function LabelBody({
  content,
  shortcut,
}: {
  content: React.ReactNode;
  shortcut?: string;
}) {
  return (
    <div className="flex items-center gap-2 px-2.5 py-1.5">
      <span className="text-xs font-medium text-[var(--color-text-primary)] leading-[1.3]">
        {content}
      </span>
      {shortcut && (
        <kbd className="inline-flex items-center rounded px-1 py-0.5 text-2xs font-mono text-[var(--color-text-muted)] bg-[var(--color-surface-elevated)] border border-[var(--color-border-subtle)] leading-none">
          {shortcut}
        </kbd>
      )}
    </div>
  );
}

function RichBody({
  title,
  description,
  accent,
}: {
  title?: string;
  description?: React.ReactNode;
  accent: string;
}) {
  return (
    <div className="flex flex-col gap-1 p-3">
      {title && (
        <span className={cn("text-sm font-semibold leading-[1.3] tracking-tight", ACCENT_TEXT[accent] === ACCENT_TEXT.default ? "text-[var(--color-text-primary)]" : ACCENT_TEXT[accent])}>
          {title}
        </span>
      )}
      {description && (
        <span className="text-xs text-[var(--color-text-secondary)] leading-[1.3]">
          {description}
        </span>
      )}
    </div>
  );
}

function ActionBody({
  title,
  description,
  actions,
}: {
  title?: string;
  description?: React.ReactNode;
  actions: TooltipAction[];
}) {
  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="flex flex-col gap-1">
        {title && (
          <span className="text-sm font-semibold text-[var(--color-text-primary)] leading-[1.3] tracking-tight">
            {title}
          </span>
        )}
        {description && (
          <span className="text-xs text-[var(--color-text-secondary)] leading-[1.3]">
            {description}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {actions.map((action, i) => (
          <Button
            key={i}
            size="sm"
            variant={action.variant ?? "neutral"}
            appearance={action.appearance ?? (i === actions.length - 1 ? "filled" : "outline")}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

function TourBody({
  steps,
  currentStep,
  onNext,
  onPrev,
  onClose,
  accent,
}: {
  steps: TooltipStep[];
  currentStep: number;
  onNext?: () => void;
  onPrev?: () => void;
  onClose?: () => void;
  accent: string;
}) {
  const total = steps.length;
  const step = steps[Math.min(currentStep, total - 1)];
  const isFirst = currentStep === 0;
  const isLast = currentStep === total - 1;
  const accentVariant = (accent === "default" ? "neutral" : accent) as ButtonVariant;

  return (
    <div className="flex flex-col gap-3 p-3">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-sm font-semibold text-[var(--color-text-primary)] leading-[1.3] tracking-tight">
            {step.title}
          </span>
          <span className="text-xs text-[var(--color-text-secondary)] leading-[1.3]">
            {step.description}
          </span>
        </div>
        {onClose && (
          <IconButton
            size="sm"
            appearance="ghost"
            variant="neutral"
            shape="pill"
            icon={<RiCloseLine size={14} />}
            aria-label="Dismiss"
            className="shrink-0 -mr-1 -mt-0.5"
            onClick={onClose}
          />
        )}
      </div>

      {/* Footer: dots + nav */}
      <div className="flex items-center justify-between gap-2">
        {/* Step dots */}
        <div className="flex items-center gap-1">
          {steps.map((_, i) => (
            <div
              key={i}
              className={cn(
                "rounded-full transition-all duration-200",
                i === currentStep
                  ? cn("w-3 h-1.5", ACCENT_DOT[accent])
                  : "w-1.5 h-1.5 bg-[var(--color-surface-elevated)]",
              )}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-1">
          {!isFirst && (
            <Button
              size="sm"
              appearance="ghost"
              variant="neutral"
              leadingIcon={<RiArrowLeftSLine size={14} />}
              onClick={onPrev}
            >
              Prev
            </Button>
          )}
          <Button
            size="sm"
            appearance="ghost"
            variant={accentVariant}
            trailingIcon={!isLast ? <RiArrowRightSLine size={14} /> : undefined}
            onClick={isLast ? onClose : onNext}
          >
            {isLast ? "Done" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Floating panel (portal-rendered, standalone) ─────────────────────────────

interface FloatingPanelProps {
  open: boolean;
  triggerRef: React.RefObject<HTMLElement | null>;
  placement: TooltipPlacement;
  offset: number;
  maxWidth: number;
  showArrow: boolean;
  variant: string;
  interactive: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  className?: string;
  children: React.ReactNode;
  id?: string; // added for accessibility
}

function FloatingPanel({
  open,
  triggerRef,
  placement,
  offset,
  maxWidth,
  showArrow,
  variant,
  interactive,
  onMouseEnter,
  onMouseLeave,
  className,
  children,
  id,
}: FloatingPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: -9999, left: -9999 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // update position on scroll/resize and when content changes
  const updatePosition = useCallback(() => {
    if (!open || !triggerRef.current || !panelRef.current) return;
    const tr = triggerRef.current.getBoundingClientRect();
    const pr = panelRef.current.getBoundingClientRect();
    setPos(calcPos(tr, pr.width, pr.height, placement, offset));
  }, [open, placement, offset, triggerRef]);

  useLayoutEffect(() => {
    updatePosition();
  }, [updatePosition]);

  useEffect(() => {
    if (!open) return;
    let rafId: number;
    const handleUpdate = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updatePosition);
    };
    window.addEventListener('scroll', handleUpdate, true);
    window.addEventListener('resize', handleUpdate);
    const observer = new ResizeObserver(handleUpdate);
    if (panelRef.current) observer.observe(panelRef.current);
    return () => {
      window.removeEventListener('scroll', handleUpdate, true);
      window.removeEventListener('resize', handleUpdate);
      observer.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [open, updatePosition]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          id={id}
          role="tooltip"
          data-tooltip-panel
          {...(MOTION[placement.split("-")[0]] ?? MOTION.top) as object}
          transition={transitions.fast}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          style={{ position: "fixed", top: pos.top, left: pos.left, maxWidth, zIndex: 9999 }}
          className={cn(
            "relative rounded-2xl border",
            ACCENT_BORDER[variant],
            "bg-[var(--color-surface-sunken)]/95 backdrop-blur-xl",
            "shadow-[var(--shadow-lg)]",
            !interactive && "pointer-events-none",
            className,
          )}
        >
          {children}
          {showArrow && <Arrow placement={placement} accent={variant} />}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

// ─── TooltipGroup — shared panel that moves between triggers ──────────────────

interface GroupSlot {
  id: string;               // unique id for accessibility
  triggerEl: HTMLElement;
  placement: TooltipPlacement;
  offset: number;
  maxWidth: number;
  showArrow: boolean;
  variant: string;
  interactive: boolean;
  // body props
  content?: React.ReactNode;
  title?: string;
  description?: React.ReactNode;
  actions?: TooltipAction[];
  steps?: TooltipStep[];
  currentStep?: number;
  onNext?: () => void;
  onPrev?: () => void;
  onClose?: () => void;
  shortcut?: string;
  isTour: boolean;
  isAction: boolean;
  isRich: boolean;
  // store the delay for first show
  delay: number;
}

interface GroupCtxValue {
  show: (slot: GroupSlot) => void;
  hide: (id: string, immediate?: boolean) => void;
  cancelHide: () => void;
  isOpenRef: React.RefObject<boolean>;
}

const GroupCtx = createContext<GroupCtxValue | null>(null);

// Render the appropriate body from a slot's props
function renderSlotBody(slot: GroupSlot, onClose: () => void): React.ReactNode {
  if (slot.isTour) {
    return (
      <TourBody
        steps={slot.steps!}
        currentStep={slot.currentStep ?? 0}
        onNext={slot.onNext}
        onPrev={slot.onPrev}
        onClose={() => { slot.onClose?.(); onClose(); }}
        accent={slot.variant}
      />
    );
  }
  if (slot.isAction) {
    return (
      <ActionBody
        title={slot.title}
        description={slot.description}
        actions={slot.actions!}
      />
    );
  }
  if (slot.isRich) {
    return (
      <RichBody title={slot.title} description={slot.description} accent={slot.variant} />
    );
  }
  return <LabelBody content={slot.content} shortcut={slot.shortcut} />;
}

const GROUP_SPRING = { stiffness: 500, damping: 36, mass: 0.6 };

function GroupSharedPanel({
  active,
  isOpen,
  onMouseEnter,
  onMouseLeave,
  onClose,
}: {
  active: GroupSlot | null;
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const wasOpen = useRef(false);

  const posX = useMotionValue(-9999);
  const posY = useMotionValue(-9999);

  useEffect(() => { setMounted(true); }, []);

  const updatePosition = useCallback(() => {
    if (!isOpen || !active || !panelRef.current) return;
    const tr = active.triggerEl.getBoundingClientRect();
    const pr = panelRef.current.getBoundingClientRect();
    const { top, left } = calcPos(tr, pr.width, pr.height, active.placement, active.offset);

    if (wasOpen.current) {
      fmAnimate(posX, left, { type: "spring", ...GROUP_SPRING });
      fmAnimate(posY, top, { type: "spring", ...GROUP_SPRING });
    } else {
      posX.set(left);
      posY.set(top);
      wasOpen.current = true;
    }
  }, [active, isOpen, posX, posY]);

  // initial position and whenever active changes
  useLayoutEffect(() => {
    if (!isOpen || !active) return;
    updatePosition();
  }, [active, isOpen, updatePosition]);

  // scroll/resize and content change detection
  useEffect(() => {
    if (!isOpen || !active) return;
    let rafId: number;
    const handleUpdate = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updatePosition);
    };
    window.addEventListener('scroll', handleUpdate, true);
    window.addEventListener('resize', handleUpdate);
    const observer = new ResizeObserver(handleUpdate);
    if (panelRef.current) observer.observe(panelRef.current);
    return () => {
      window.removeEventListener('scroll', handleUpdate, true);
      window.removeEventListener('resize', handleUpdate);
      observer.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [active, isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen) wasOpen.current = false;
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && active && (
        <motion.div
          ref={panelRef}
          id={active.id}
          role="tooltip"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={transitions.fast}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            x: posX,
            y: posY,
            maxWidth: active.maxWidth,
            zIndex: 9999,
          }}
          className={cn(
            "relative rounded-2xl border",
            ACCENT_BORDER[active.variant],
            "bg-[var(--color-surface-sunken)]/95 backdrop-blur-xl",
            "shadow-[var(--shadow-lg)]",
            !active.interactive && "pointer-events-none",
          )}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={active.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.08 }}
            >
              {renderSlotBody(active, onClose)}
            </motion.div>
          </AnimatePresence>
          {active.showArrow && <Arrow placement={active.placement} accent={active.variant} />}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export function TooltipGroup({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState<GroupSlot | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const isOpenRef = useRef(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeIdRef = useRef<string | null>(null);

  const setOpenState = useCallback((v: boolean) => {
    isOpenRef.current = v;
    setIsOpen(v);
  }, []);

  const show = useCallback((slot: GroupSlot) => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    activeIdRef.current = slot.id;
    setActive(slot);
    setOpenState(true);
  }, [setOpenState]);

  const hide = useCallback((id: string, immediate = false) => {
    const doHide = () => {
      if (activeIdRef.current === id) {
        activeIdRef.current = null;
        setOpenState(false);
        setActive(null);
      }
    };
    if (immediate) {
      doHide();
    } else {
      hideTimer.current = setTimeout(doHide, 120);
    }
  }, [setOpenState]);

  const cancelHide = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
  }, []);

  useEffect(() => () => { if (hideTimer.current) clearTimeout(hideTimer.current); }, []);

  const ctx = useMemo<GroupCtxValue>(
    () => ({ show, hide, cancelHide, isOpenRef }),
    [show, hide, cancelHide],
  );

  return (
    <GroupCtx.Provider value={ctx}>
      {children}
      <GroupSharedPanel
        active={active}
        isOpen={isOpen}
        onMouseEnter={cancelHide}
        onMouseLeave={() => active && hide(active.id)}
        onClose={() => active && hide(active.id, true)}
      />
    </GroupCtx.Provider>
  );
}

// ─── Tooltip (main) ───────────────────────────────────────────────────────────

export function Tooltip({
  children,
  content,
  title,
  description,
  actions,
  steps,
  currentStep = 0,
  onNext,
  onPrev,
  onClose,
  trigger = "hover",
  placement = "top",
  delay = 500,
  offset = 8,
  maxWidth,
  showArrow = true,
  shortcut,
  variant = "default",
  open: controlledOpen,
  onOpenChange,
  disabled = false,
  className,
}: TooltipProps) {
  const group = useContext(GroupCtx);
  const id = useId();                     // unique ID for accessibility
  const triggerRef = useRef<HTMLSpanElement>(null);
  const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = useCallback((v: boolean) => {
    if (!isControlled) setInternalOpen(v);
    onOpenChange?.(v);
  }, [isControlled, onOpenChange]);

  // Auto-detect variant
  const isTour = Boolean(steps?.length);
  const isAction = !isTour && Boolean(actions);
  const isRich = !isTour && !isAction && Boolean(title || description);
  const isLabel = !isTour && !isAction && !isRich;
  const interactive = isTour || isAction;

  const resolvedMaxWidth = maxWidth ?? (isTour ? 320 : isRich || isAction ? 280 : 220);

  function clearTimers() {
    if (showTimer.current) clearTimeout(showTimer.current);
    if (hideTimer.current) clearTimeout(hideTimer.current);
  }

  useEffect(() => () => clearTimers(), []);

  // ── Group mode ─────────────────────────────────────────────────────────────
  if (group) {
    const buildSlot = (): GroupSlot => ({
      id,                               // use unique ID
      triggerEl: triggerRef.current!,
      placement,
      offset,
      maxWidth: resolvedMaxWidth,
      showArrow,
      variant,
      interactive,
      content, title, description, actions, steps,
      currentStep, onNext, onPrev, onClose,
      shortcut,
      isTour, isAction, isRich,
      delay,                            // pass delay for initial show
    });

    const handleEnter = () => {
      if (disabled || !triggerRef.current) return;
      clearTimers();
      const doShow = () => {
        if (triggerRef.current) group.show(buildSlot());
      };
      // If group is already open → switch immediately (no delay)
      if (group.isOpenRef.current) {
        doShow();
      } else {
        showTimer.current = setTimeout(doShow, trigger === "hover" ? delay : 0);
      }
    };

    const handleLeave = () => {
      clearTimers();
      group.hide(id);
    };

    return (
      <span
        ref={triggerRef}
        className="inline-flex"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onFocus={handleEnter}
        onBlur={handleLeave}
      >
        {children}
      </span>
    );
  }

  // ── Standalone mode ────────────────────────────────────────────────────────

  function scheduleShow() {
    if (disabled) return;
    clearTimers();
    showTimer.current = setTimeout(() => setOpen(true), trigger === "hover" ? delay : 0);
  }

  function scheduleHide(immediate = false) {
    clearTimers();
    hideTimer.current = setTimeout(() => setOpen(false), immediate || !interactive ? 0 : 120);
  }

  function cancelHide() {
    if (hideTimer.current) clearTimeout(hideTimer.current);
  }

  // Click-outside for click-triggered tooltips
  useEffect(() => {
    if (trigger !== "click" || !open) return;
    function onDown(e: MouseEvent) {
      const target = e.target as Element;
      const insideTrigger = triggerRef.current?.contains(target);
      const insidePanel = !!target.closest?.("[data-tooltip-panel]");
      if (!insideTrigger && !insidePanel) scheduleHide(true);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [trigger, open]);

  // Escape key
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { scheduleHide(true); onClose?.(); }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const triggerProps =
    trigger === "hover"
      ? {
        onMouseEnter: scheduleShow,
        onMouseLeave: () => scheduleHide(),
        onFocus: scheduleShow,
        onBlur: () => scheduleHide(true),
      }
      : {
        onClick: () => (open ? scheduleHide(true) : scheduleShow()),
      };

  // Generate a unique ID for the tooltip panel (used for aria-describedby)
  const tooltipId = `tooltip-${id}`;

  return (
    <>
      <span
        ref={triggerRef}
        className="inline-flex"
        {...triggerProps}
        aria-describedby={open ? tooltipId : undefined}
      >
        {children}
      </span>

      <FloatingPanel
        open={open}
        triggerRef={triggerRef}
        placement={placement}
        offset={offset}
        maxWidth={resolvedMaxWidth}
        showArrow={showArrow}
        variant={variant}
        interactive={interactive}
        onMouseEnter={interactive ? cancelHide : undefined}
        onMouseLeave={interactive ? () => scheduleHide() : undefined}
        className={className}
        id={tooltipId}
      >
        {isTour && (
          <TourBody
            steps={steps!}
            currentStep={currentStep}
            onNext={onNext}
            onPrev={onPrev}
            onClose={() => { onClose?.(); scheduleHide(true); }}
            accent={variant}
          />
        )}
        {isAction && (
          <ActionBody
            title={title}
            description={description}
            actions={actions!}
          />
        )}
        {isRich && (
          <RichBody title={title} description={description} accent={variant} />
        )}
        {isLabel && (
          <LabelBody content={content} shortcut={shortcut} />
        )}
      </FloatingPanel>
    </>
  );
}