"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  useId,
  useEffect,
  useCallback,
  isValidElement,
  cloneElement,
  forwardRef,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Label, Text } from "./Typography";
import { CheckboxIndicator, type CheckboxSize } from "./Checkbox";
import {
  RiArrowDownSLine,
  RiCheckLine,
  RiSearchLine,
  RiCloseLine,
  RiAddLine,
} from "@remixicon/react";
import { cn } from "@/lib/utils";
import { transitions } from "@/lib/motion";

// ─── Types ────────────────────────────────────────────────────────────────────

export type DropdownSize = "sm" | "md" | "lg";
export type DropdownState = "default" | "error" | "warning" | "success";
export type DropdownItemVariant = "default" | "danger" | "warning" | "success";

// ─── Context ──────────────────────────────────────────────────────────────────

interface DropdownCtx {
  open: boolean;
  setOpen: (v: boolean) => void;
  toggle: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  menuId: string;
  triggerId: string;
  activeIndex: number;
  setActiveIndex: (i: number) => void;
  size: DropdownSize;
  state: DropdownState;
  focused: boolean;
  setFocused: (v: boolean) => void;
  ignoredRefs?: React.RefObject<HTMLElement | null>[];
  /** ID of the helper/error/warning message element, for aria-describedby */
  messageId?: string;
  /** Whether the dropdown is in an error state (for aria-invalid) */
  isInvalid: boolean;
  /** Whether the dropdown is required (for aria-required) */
  required: boolean;
  /** Whether the dropdown is disabled */
  disabled: boolean;
}

const DropdownContext = createContext<DropdownCtx | null>(null);

function useDropdown() {
  const ctx = useContext(DropdownContext);
  if (!ctx) throw new Error("Dropdown sub-components must be inside <Dropdown>");
  return ctx;
}

// ─── Dropdown (Root) ─────────────────────────────────────────────────────────

export interface DropdownProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  /** Controlled open state. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  size?: DropdownSize;
  state?: DropdownState;
  label?: string;
  required?: boolean;
  optional?: boolean;
  /** Disable the entire dropdown. */
  disabled?: boolean;
  /** Helper text shown below the trigger. */
  helperText?: string;
  /** Error message shown instead of helperText when state="error". */
  errorMessage?: string;
  /** Warning message shown instead of helperText when state="warning". */
  warningMessage?: string;
  /** Optional refs to exclude from click-outside behavior (e.g. external trigger buttons). */
  ignoredRefs?: React.RefObject<HTMLElement | null>[];
}

export function Dropdown({
  children,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  size = "md",
  state = "default",
  label,
  required = false,
  optional,
  disabled = false,
  helperText,
  errorMessage,
  warningMessage,
  ignoredRefs,
}: DropdownProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const triggerRef = useRef<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [focused, setFocused] = useState(false);
  const baseId = useId();
  const menuId = `${baseId}-menu`;
  const triggerId = `${baseId}-trigger`;

  const setOpen = useCallback(
    (v: boolean) => {
      if (!isControlled) setUncontrolledOpen(v);
      onOpenChange?.(v);
      if (!v) setActiveIndex(-1);
    },
    [isControlled, onOpenChange],
  );

  const toggle = useCallback(() => setOpen(!open), [open, setOpen]);

  const message =
    state === "error" ? errorMessage
      : state === "warning" ? warningMessage
        : helperText;

  const messageId = message ? `${baseId}-message` : undefined;

  return (
    <DropdownContext.Provider
      value={{
        open,
        setOpen,
        toggle,
        triggerRef,
        menuId,
        triggerId,
        activeIndex,
        setActiveIndex,
        size,
        state,
        focused,
        setFocused,
        ignoredRefs,
        messageId,
        isInvalid: state === "error",
        required,
        disabled,
      }}
    >
      <div className="flex flex-col gap-1.5">
        {label && (
          <div className="flex items-baseline justify-between gap-2">
            <Label
              htmlFor={triggerId}
              size={size === "lg" ? "sm" : "xs"}
              weight="medium"
              required={required}
              className={cn(
                "transition-colors duration-150 select-none",
                focused
                  ? LABEL_FOCUSED_COLOR[state]
                  : "text-[var(--color-label-default)]",
              )}
            >
              {label}
            </Label>
            {optional && !required && (
              <Text
                as="span"
                size={size === "lg" ? "sm" : "xs"}
                color="disabled"
                inline
                className="shrink-0 leading-none"
              >
                optional
              </Text>
            )}
          </div>
        )}
        {children}

        {/* ── Below-field message ──────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {message && (
            <motion.p
              key={state + "-" + message}
              id={messageId}
              initial={{ opacity: 0, y: -3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className={cn(
                "text-xs font-normal leading-snug",
                MESSAGE_COLOR[state],
              )}
            >
              {message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </DropdownContext.Provider>
  );
}

// ─── Color maps ───────────────────────────────────────────────────────────────

const LABEL_FOCUSED_COLOR: Record<DropdownState, string> = {
  default: "text-[var(--color-label-focused)]",
  error: "text-[var(--color-label-error)]",
  warning: "text-[var(--color-label-warning)]",
  success: "text-[var(--color-label-success)]",
};

const MESSAGE_COLOR: Record<DropdownState, string> = {
  default: "text-[var(--color-text-muted)]",
  error: "text-[var(--color-text-danger)]",
  warning: "text-[var(--color-text-warning)]",
  success: "text-[var(--color-text-success)]",
};

// ─── Size maps ────────────────────────────────────────────────────────────────

const TRIGGER_H: Record<DropdownSize, string> = {
  sm: "h-8",
  md: "h-10",
  lg: "h-12",
};

const TRIGGER_PX: Record<DropdownSize, string> = {
  sm: "px-3",
  md: "px-3.5",
  lg: "px-4",
};

const TRIGGER_RADIUS: Record<DropdownSize, string> = {
  sm: "rounded-lg",
  md: "rounded-xl",
  lg: "rounded-xl",
};

const TRIGGER_TEXT: Record<DropdownSize, string> = {
  sm: "text-xs  tracking-normal",
  md: "text-sm  tracking-tight",
  lg: "text-base tracking-tight",
};

const DROPDOWN_ICON_SIZE: Record<DropdownSize, string> = {
  sm: "w-3.5 h-3.5",
  md: "w-4   h-4",
  lg: "w-5   h-5",
};

const TRIGGER_BORDER: Record<DropdownState, string> = {
  default: "border-[var(--color-input-border)] hover:border-[var(--color-input-border-hover)]",
  error: "border-[var(--color-input-border-error)]",
  warning: "border-[var(--color-input-border-warning)]",
  success: "border-[var(--color-input-border-success)]",
};

// ─── DropdownTrigger ──────────────────────────────────────────────────────────

export interface DropdownTriggerProps {
  /**
   * When provided, the single child element becomes the trigger (asChild pattern).
   * Useful for using a <Button> or <IconButton> as the dropdown trigger.
   */
  children?: React.ReactNode;
  // ── Default form-control trigger props (used when no children) ──
  label?: string;
  description?: string;
  trailingText?: string;
  trailingIconButton?: React.ReactNode;
  placeholder?: string;
  size?: DropdownSize;
  state?: DropdownState;
  disabled?: boolean;
  leadingIcon?: React.ReactNode;
  className?: string;
}

export const DropdownTrigger = forwardRef<HTMLButtonElement, DropdownTriggerProps>(
  (
    {
      children,
      label,
      description,
      trailingText,
      trailingIconButton,
      placeholder = "Select…",
      size: propSize,
      state: propState,
      disabled: propDisabled = false,
      leadingIcon,
      className,
    },
    ref,
  ) => {
    const {
      open,
      toggle,
      triggerRef,
      menuId,
      triggerId,
      size: ctxSize,
      state: ctxState,
      focused,
      setFocused,
      messageId,
      isInvalid,
      required,
      disabled: ctxDisabled,
    } = useDropdown();

    const size = propSize ?? ctxSize;
    const state = propState ?? ctxState;
    const isDisabled = propDisabled || ctxDisabled;

    const ariaAttrs = {
      id: triggerId,
      "aria-haspopup": "listbox" as const,
      "aria-expanded": open,
      "aria-controls": menuId,
      "aria-describedby": messageId,
      "aria-invalid": isInvalid || undefined,
      "aria-required": required || undefined,
    };

    if (children && isValidElement(children)) {
      return cloneElement(
        children as React.ReactElement<Record<string, unknown>>,
        {
          ref: (node: HTMLElement | null) => {
            (triggerRef as React.RefObject<HTMLElement | null>).current = node;
            const origRef = (children as { ref?: React.Ref<unknown> }).ref;
            if (typeof origRef === "function") origRef(node);
            else if (origRef && typeof origRef === "object")
              (origRef as React.RefObject<unknown>).current = node;
          },
          ...ariaAttrs,
          onClick: (e: React.MouseEvent) => {
            (
              children as React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>
            ).props?.onClick?.(e);
            if (!isDisabled) toggle();
          },
        },
      );
    }

    // ── Default form-control trigger ─────────────────────────────────────────
    const isInteractiveContainer = Boolean(trailingIconButton);
    const TriggerComp = (isInteractiveContainer ? motion.div : motion.button) as React.ElementType;

    const isFocusedOrOpen = (open || focused);

    return (
      <TriggerComp
        ref={(node: HTMLElement | null) => {
          (triggerRef as React.RefObject<HTMLElement | null>).current = node;
          if (typeof ref === "function") ref(node as any);
          else if (ref) (ref as React.MutableRefObject<HTMLElement | null>).current = node;
        }}
        {...(!isInteractiveContainer
          ? { type: "button", disabled: isDisabled }
          : { tabIndex: isDisabled ? -1 : 0, "aria-disabled": isDisabled || undefined })}
        role="combobox"
        onClick={() => !isDisabled && toggle()}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (isDisabled) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle();
          }
        }}
        onFocus={() => !isDisabled && setFocused(true)}
        onBlur={() => setFocused(false)}
        className={cn(
          "relative flex w-full items-center gap-2 border outline-none",
          "bg-[var(--color-input-bg)] transition-[border-color,background-color] duration-150 ease-out",
          TRIGGER_H[size],
          TRIGGER_PX[size],
          TRIGGER_RADIUS[size],
          TRIGGER_BORDER[state],
          isDisabled
            ? "cursor-not-allowed opacity-40"
            : "cursor-pointer focus-visible:border-[var(--color-input-border-focus)]",
          isFocusedOrOpen && state === "default" && "border-[var(--color-input-border-focus)]",
          className,
        )}
        style={{
          boxShadow: isFocusedOrOpen && state === "default"
            ? "0 0 0 2px #0A0A0A, 0 0 0 4px rgba(38, 201, 201, 0.50)"
            : "0 0 0 0px rgba(0,0,0,0)",
        }}
        {...ariaAttrs}
      >
        {/* Leading icon */}
        {leadingIcon && (
          <span className={cn("flex shrink-0 items-center justify-center text-[var(--color-icon-muted)]", DROPDOWN_ICON_SIZE[size])}>
            {leadingIcon}
          </span>
        )}

        {/* Label / Placeholder + optional description */}
        <span className="flex-1 min-w-0 flex items-baseline justify-start gap-2">
          <span
            className={cn(
              "truncate text-left",
              TRIGGER_TEXT[size],
              label ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-muted)]",
            )}
          >
            {label ?? placeholder}
          </span>
          {description && (
            <span className="shrink-0 text-xs text-[var(--color-text-muted)]">
              {description}
            </span>
          )}
        </span>

        {/* Trailing text (styled same as description) */}
        {trailingText && (
          <span className="shrink-0 text-xs text-[var(--color-text-muted)]">
            {trailingText}
          </span>
        )}

        {/* Trailing Icon Button (size matched with dropdown size) */}
        {trailingIconButton && (
          <span
            className="flex shrink-0 items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {isValidElement(trailingIconButton)
              ? cloneElement(trailingIconButton as React.ReactElement<{ size?: DropdownSize }>, {
                  size: (trailingIconButton.props as any).size ?? size,
                })
              : trailingIconButton}
          </span>
        )}

        {/* Chevron */}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={transitions.standard}
          className={cn("flex shrink-0 items-center justify-center text-[var(--color-icon-muted)]", DROPDOWN_ICON_SIZE[size])}
        >
          <RiArrowDownSLine className="h-full w-full" />
        </motion.span>
      </TriggerComp>
    );
  },
);
DropdownTrigger.displayName = "DropdownTrigger";

// ─── Menu position state ──────────────────────────────────────────────────────

interface MenuPos {
  top?: number;
  bottom?: number;
  left: number;
  width: number;
  placement: "bottom" | "top";
}

// ─── Menu animation variants ──────────────────────────────────────────────────

const MENU_VARIANTS_BOTTOM = {
  hidden: { opacity: 0, scale: 0.97, y: -4 },
  visible: { opacity: 1, scale: 1, y: 0, transition: transitions.standard },
  exit: { opacity: 0, scale: 0.97, y: -4, transition: transitions.fast },
};

const MENU_VARIANTS_TOP = {
  hidden: { opacity: 0, scale: 0.97, y: 4 },
  visible: { opacity: 1, scale: 1, y: 0, transition: transitions.standard },
  exit: { opacity: 0, scale: 0.97, y: 4, transition: transitions.fast },
};

// ─── DropdownMenu ─────────────────────────────────────────────────────────────

export interface DropdownMenuProps {
  children: React.ReactNode;
  className?: string;
  /** Max pixel height before the menu scrolls. Default 320. */
  maxHeight?: number;
  /** Minimum pixel width. Defaults to trigger width. */
  minWidth?: number;
  /** Horizontal alignment relative to the trigger. Default "start". */
  align?: "start" | "end" | "center";
  /** Gap between trigger and menu in px. Default 4. */
  sideOffset?: number;
}

export function DropdownMenu({
  children,
  className,
  maxHeight = 320,
  minWidth,
  align = "start",
  sideOffset = 4,
}: DropdownMenuProps) {
  const {
    open, setOpen, triggerRef, menuId, triggerId,
    activeIndex, setActiveIndex, ignoredRefs,
  } = useDropdown();

  const menuRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<MenuPos | null>(null);
  const [mounted, setMounted] = useState(false);

  // Hydration guard — portals are client-only
  useEffect(() => { setMounted(true); }, []);

  // ── Position computation ─────────────────────────────────────────────────
  const compute = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const viewH = window.innerHeight;
    const menuW = Math.max(minWidth ?? 0, rect.width);

    const spaceBelow = viewH - rect.bottom - sideOffset;
    const spaceAbove = rect.top - sideOffset;
    const placement: "bottom" | "top" =
      spaceBelow >= 160 || spaceBelow >= spaceAbove ? "bottom" : "top";

    let left: number;
    if (align === "end") {
      left = rect.right - menuW;
    } else if (align === "center") {
      left = rect.left + rect.width / 2 - menuW / 2;
    } else {
      left = rect.left;
    }
    // Clamp to viewport with 8px padding
    left = Math.max(8, Math.min(left, window.innerWidth - menuW - 8));

    setPos({
      top: placement === "bottom" ? rect.bottom + sideOffset : undefined,
      bottom: placement === "top" ? viewH - rect.top + sideOffset : undefined,
      left,
      width: menuW,
      placement,
    });
  }, [triggerRef, align, minWidth, sideOffset]);

  useEffect(() => {
    if (!open) return;
    compute();
    window.addEventListener("resize", compute);
    window.addEventListener("scroll", compute, true);
    return () => {
      window.removeEventListener("resize", compute);
      window.removeEventListener("scroll", compute, true);
    };
  }, [open, compute]);

  // ── Close on outside pointer ─────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (
        !menuRef.current?.contains(e.target as Node) &&
        !triggerRef.current?.contains(e.target as Node) &&
        !ignoredRefs?.some(ref => ref.current?.contains(e.target as Node))
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, setOpen, triggerRef]);

  // ── Keyboard navigation ──────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (e.key === "Tab") {
        setOpen(false);
        return;
      }

      const items = Array.from(
        menuRef.current?.querySelectorAll<HTMLElement>(
          '[role="option"]:not([aria-disabled="true"])',
        ) ?? [],
      );
      if (!items.length) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = activeIndex < items.length - 1 ? activeIndex + 1 : 0;
        setActiveIndex(next);
        items[next].focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = activeIndex > 0 ? activeIndex - 1 : items.length - 1;
        setActiveIndex(prev);
        items[prev].focus();
      } else if (e.key === "Home") {
        e.preventDefault();
        setActiveIndex(0);
        items[0].focus();
      } else if (e.key === "End") {
        e.preventDefault();
        setActiveIndex(items.length - 1);
        items[items.length - 1].focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, activeIndex, setActiveIndex, setOpen, triggerRef]);

  if (!mounted) return null;

  const isFlipped = pos?.placement === "top";

  return createPortal(
    <AnimatePresence>
      {open && pos && (
        <motion.div
          ref={menuRef}
          id={menuId}
          role="listbox"
          aria-labelledby={triggerId}
          variants={isFlipped ? MENU_VARIANTS_TOP : MENU_VARIANTS_BOTTOM}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{
            position: "fixed",
            top: pos.top,
            bottom: pos.bottom,
            left: pos.left,
            minWidth: pos.width,
            maxHeight,
            transformOrigin: isFlipped ? "bottom center" : "top center",
            zIndex: 9999,
          }}
          className={cn(
            "flex flex-col gap-0.5 overflow-y-auto overflow-x-hidden py-1 outline-none",
            "rounded-xl border border-[var(--color-border-default)]",
            "bg-[var(--color-surface-sunken)]/95 backdrop-blur-xl",
            "shadow-[var(--shadow-xl)]",
            "[scrollbar-width:thin]",
            "[scrollbar-color:var(--color-border-default)_transparent]",
            className,
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

// ─── Item style maps ──────────────────────────────────────────────────────────

const ITEM_TEXT: Record<DropdownItemVariant, string> = {
  default: "text-[var(--color-text-primary)]",
  danger: "text-[var(--color-text-danger)]",
  warning: "text-[var(--color-text-warning)]",
  success: "text-[var(--color-text-success)]",
};

const ITEM_ICON: Record<DropdownItemVariant, string> = {
  default: "text-[var(--color-icon-secondary)]",
  danger: "text-[var(--color-icon-danger)]",
  warning: "text-[var(--color-icon-warning)]",
  success: "text-[var(--color-icon-success)]",
};

const ITEM_HOVER: Record<DropdownItemVariant, string> = {
  default: "hover:bg-[var(--color-surface-overlay)]/50 active:bg-[var(--color-surface-overlay)]",
  danger: "hover:bg-[var(--color-interactive-danger-tonal-bg-hover)]  active:bg-[var(--color-interactive-danger-tonal-bg-active)]",
  warning: "hover:bg-[var(--color-interactive-warning-tonal-bg-hover)] active:bg-[var(--color-interactive-warning-tonal-bg-active)]",
  success: "hover:bg-[var(--color-interactive-success-tonal-bg-hover)] active:bg-[var(--color-interactive-success-tonal-bg-active)]",
};

// Selected item: same 8% tint as the hover-tint on Checkbox/RadioButton —
// consistent across all form atoms and clearly lighter than the menu surface.
const ITEM_SELECTED_BG: Record<DropdownItemVariant, string> = {
  default: "bg-[var(--color-control-tint-brand)]",
  danger: "bg-[var(--color-control-tint-danger)]",
  warning: "bg-[var(--color-control-tint-warning)]",
  success: "bg-[var(--color-control-tint-success)]",
};

// Trailing check color follows the variant (danger → red, etc.)
const ITEM_CHECK_COLOR: Record<DropdownItemVariant, string> = {
  default: "text-[var(--color-text-brand)]",
  danger: "text-[var(--color-text-danger)]",
  warning: "text-[var(--color-text-warning)]",
  success: "text-[var(--color-text-success)]",
};

// Maps dropdown size to the appropriate CheckboxIndicator size
const ITEM_CHECKBOX_SIZE: Record<DropdownSize, CheckboxSize> = {
  sm: "sm",
  md: "sm",
  lg: "md",
};

// Size-adaptive item text + padding — items scale with dropdown size
const ITEM_SIZE_TEXT: Record<DropdownSize, string> = {
  sm: "text-xs  tracking-normal",
  md: "text-sm  tracking-tight",
  lg: "text-sm  tracking-tight",
};

const ITEM_SIZE_PY: Record<DropdownSize, string> = {
  sm: "py-1.5",
  md: "py-2",
  lg: "py-2.5",
};

const ITEM_SIZE_PX: Record<DropdownSize, string> = {
  sm: "px-2",
  md: "px-2.5",
  lg: "px-3",
};

const ITEM_SIZE_MX: Record<DropdownSize, string> = {
  sm: "mx-1",
  md: "mx-1",
  lg: "mx-1",
};

const ITEM_SIZE_RADIUS: Record<DropdownSize, string> = {
  sm: "rounded-md",
  md: "rounded-lg",
  lg: "rounded-lg",
};

const ITEM_SIZE_GAP: Record<DropdownSize, string> = {
  sm: "gap-2",
  md: "gap-2",
  lg: "gap-2",
};

// ─── DropdownItem ─────────────────────────────────────────────────────────────

export interface DropdownItemProps {
  children: React.ReactNode;
  /** Leading icon node (16×16 recommended). */
  icon?: React.ReactNode;
  /** Trailing icon node — shown when no shortcut is present. */
  trailingIcon?: React.ReactNode;
  /** Secondary text shown on the right side of the option. */
  trailingText?: string;
  /** Keyboard shortcut label, e.g. "⌘K". */
  shortcut?: string;
  /** Secondary descriptive line rendered below the label. */
  description?: string;
  variant?: DropdownItemVariant;
  disabled?: boolean;
  /** Renders a check-mark in the trailing slot and applies a selected background. */
  selected?: boolean;
  /** Indicates if the adjacent previous item is also selected (for background merging) */
  isPrevSelected?: boolean;
  /** Indicates if the adjacent next item is also selected (for background merging) */
  isNextSelected?: boolean;
  /**
   * "check" (default) — trailing RiCheckLine when selected.
   * "checkbox" — leading CheckboxIndicator for multi-select lists; also
   *   defaults closeOnSelect to false so the menu stays open.
   */
  checkStyle?: "check" | "checkbox";
  /** Whether the dropdown should close when this item is selected.
   *  Defaults to false when checkStyle="checkbox", true otherwise. */
  closeOnSelect?: boolean;
  /** Called (and menu closed if closeOnSelect is true) when the item is activated. */
  onSelect?: () => void;
  className?: string;
}

export function DropdownItem({
  children,
  icon,
  trailingIcon,
  trailingText,
  shortcut,
  description,
  variant = "default",
  disabled = false,
  selected = false,
  isPrevSelected = false,
  isNextSelected = false,
  checkStyle = "check",
  closeOnSelect: closeOnSelectProp,
  onSelect,
  className,
}: DropdownItemProps) {
  const { setOpen, triggerRef, size } = useDropdown();
  const closeOnSelect = closeOnSelectProp ?? (checkStyle === "checkbox" ? false : true);

  const handleSelect = () => {
    if (disabled) return;
    onSelect?.();
    if (closeOnSelect) {
      setOpen(false);
      triggerRef.current?.focus();
    }
  };

  return (
    <motion.div
      role="option"
      aria-selected={selected}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onClick={handleSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleSelect();
        }
      }}
      className={cn(
        "relative flex cursor-pointer items-center outline-none select-none z-[1]",
        ITEM_SIZE_MX[size],
        ITEM_SIZE_PX[size],
        ITEM_SIZE_RADIUS[size],
        ITEM_SIZE_TEXT[size],
        ITEM_SIZE_PY[size],
        ITEM_SIZE_GAP[size],
        "transition-[color,background-color] duration-[75ms] ease-out",
        ITEM_TEXT[variant],
        disabled
          ? "pointer-events-none cursor-not-allowed opacity-40"
          : ITEM_HOVER[variant],
        "focus-visible:bg-[var(--color-surface-overlay)]",
        className,
      )}
    >
      {/* Background layer for selected state to allow merging adjacent items */}
      {selected && (
        <span
          className={cn(
            "absolute left-0 right-0 top-0 pointer-events-none rounded-[inherit]",
            ITEM_SELECTED_BG[variant]
          )}
          style={{
            bottom: isNextSelected ? "-2px" : "0px",
            borderTopLeftRadius: isPrevSelected ? 0 : undefined,
            borderTopRightRadius: isPrevSelected ? 0 : undefined,
            borderBottomLeftRadius: isNextSelected ? 0 : undefined,
            borderBottomRightRadius: isNextSelected ? 0 : undefined,
            zIndex: -1,
          }}
        />
      )}
      {/* Leading icon */}
      {icon && (
        <span className={cn("flex shrink-0 items-center justify-center", ITEM_ICON[variant], DROPDOWN_ICON_SIZE[size])}>
          {icon}
        </span>
      )}

      {/* Label + optional description */}
      <span className="min-w-0 flex-1 flex items-baseline justify-start gap-2">
        <span className="truncate">{children}</span>
        {description && (
          <span className="shrink-0 text-xs text-[var(--color-text-muted)]">
            {description}
          </span>
        )}
      </span>

      {/* Trailing text */}
      {trailingText && (
        <span className="shrink-0 text-xs text-[var(--color-text-muted)]">
          {trailingText}
        </span>
      )}

      {/* Trailing slot — unified for both styles */}
      {checkStyle === "checkbox" ? (
        /* Multi-select: always visible checkbox (checked or unchecked) */
        <CheckboxIndicator checked={selected} size={ITEM_CHECKBOX_SIZE[size]} />
      ) : (
        selected ? (
          <span className={cn("flex shrink-0 items-center justify-center", ITEM_CHECK_COLOR[variant], DROPDOWN_ICON_SIZE[size])}>
            <RiCheckLine className="h-full w-full" />
          </span>
        ) : trailingIcon ? (
          <span className={cn("flex shrink-0 items-center justify-center", ITEM_ICON[variant], DROPDOWN_ICON_SIZE[size])}>
            {trailingIcon}
          </span>
        ) : shortcut ? (
          <span className="shrink-0 tabular-nums text-xs font-medium tracking-wide text-[var(--color-text-muted)]">
            {shortcut}
          </span>
        ) : null
      )}
    </motion.div>
  );
}

// ─── DropdownLabel ────────────────────────────────────────────────────────────

export interface DropdownLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function DropdownLabel({ children, className }: DropdownLabelProps) {
  return (
    <div
      className={cn(
        "px-3.5 pb-1 pt-2 text-2xs font-semibold uppercase tracking-widest",
        "text-[var(--color-text-muted)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

// ─── DropdownSeparator ────────────────────────────────────────────────────────

export interface DropdownSeparatorProps {
  className?: string;
}

export function DropdownSeparator({ className }: DropdownSeparatorProps) {
  return (
    <div
      role="separator"
      className={cn(
        "mx-1.5 my-1 h-px bg-[var(--color-border-default)]/40",
        className,
      )}
    />
  );
}

// ─── DropdownSearch ───────────────────────────────────────────────────────────

export interface DropdownSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SEARCH_INPUT_H: Record<DropdownSize, string> = {
  sm: "h-7",
  md: "h-8",
  lg: "h-9",
};

const SEARCH_INPUT_TEXT: Record<DropdownSize, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-sm",
};

export function DropdownSearch({
  value,
  onChange,
  placeholder = "Search…",
  className,
}: DropdownSearchProps) {
  const { size } = useDropdown();

  return (
    <div
      className={cn(
        "sticky top-0 z-10 mx-1.5 mb-0.5 mt-1",
        "bg-[var(--color-surface-sunken)]/95 backdrop-blur-sm",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2 rounded-lg border px-2.5",
          "bg-[var(--color-input-bg)] border-[var(--color-input-border)]",
          "transition-[border-color] duration-150",
          "focus-within:border-[var(--color-input-border-focus)]",
          SEARCH_INPUT_H[size],
        )}
      >
        <RiSearchLine className="h-3.5 w-3.5 shrink-0 text-[var(--color-icon-muted)]" />
        <input
          type="text"
          autoFocus
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "flex-1 bg-transparent outline-none",
            "text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]",
            SEARCH_INPUT_TEXT[size],
          )}
          /* Prevent clicks from bubbling up and closing the menu */
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            /* Let ArrowDown/ArrowUp fall through to menu keyboard nav */
            if (e.key !== "ArrowDown" && e.key !== "ArrowUp") {
              e.stopPropagation();
            }
          }}
        />
        {value && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => onChange("")}
            className="shrink-0 text-[var(--color-icon-muted)] transition-colors hover:text-[var(--color-icon-secondary)]"
          >
            <RiCloseLine className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── DropdownCreateNew ────────────────────────────────────────────────────────

export interface DropdownCreateNewProps {
  /** The label to create, shown as "Create …" */
  label: string;
  onAction: () => void;
  className?: string;
  customText?: string;
}

export function DropdownCreateNew({ label, onAction, className, customText }: DropdownCreateNewProps) {
  return (
    <>
      <DropdownSeparator />
      <DropdownItem
        icon={<RiAddLine className="h-full w-full" />}
        onSelect={onAction}
        className={className}
      >
        {customText ? `${customText} (${label})` : <>Create &ldquo;{label}&rdquo;</>}
      </DropdownItem>
    </>
  );
}
