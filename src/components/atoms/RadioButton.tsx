"use client";

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useId,
  useRef,
  useState,
} from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { cn } from "@/lib/utils";
import { transitions, variants } from "@/lib/motion";
import { Label, Text } from "./Typography";

// ─── Types ────────────────────────────────────────────────────────────────────

export type RadioSize = "sm" | "md" | "lg";
export type RadioState = "default" | "error" | "warning" | "success";

export interface RadioButtonProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  /** Value this radio represents — required when inside a RadioGroup. */
  value: string;
  size?: RadioSize;
  state?: RadioState;
  /** Label text rendered beside the circle. */
  label?: string;
  /** Muted secondary line rendered below the label. */
  description?: string;
  /** Whether the radio should autofocus when mounted. */
  autoFocus?: boolean;
}

export interface RadioGroupProps {
  /** Currently selected value (controlled). */
  value?: string;
  /** Initial value (uncontrolled). */
  defaultValue?: string;
  onChange?: (value: string) => void;
  name?: string;
  size?: RadioSize;
  state?: RadioState;
  disabled?: boolean;
  label?: string;
  required?: boolean;
  optional?: boolean;
  helperText?: string;
  errorMessage?: string;
  warningMessage?: string;
  direction?: "vertical" | "horizontal";
  children: React.ReactNode;
  className?: string;
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface RadioGroupCtx {
  name: string;
  selected: string | undefined;
  onChange: (value: string) => void;
  groupSize: RadioSize;
  groupState: RadioState;
  groupDisabled: boolean;
  required: boolean;
  messageId?: string;          // ID of the helper/error/warning message for aria-describedby
  isInvalid: boolean;         // true when groupState === "error"
}

const RadioGroupContext = createContext<RadioGroupCtx | null>(null);

// ─── Size maps ────────────────────────────────────────────────────────────────

const CIRCLE_SIZE: Record<RadioSize, string> = {
  sm: "w-4 h-4",
  md: "w-[18px] h-[18px]",
  lg: "w-5 h-5",
};

const DOT_SIZE: Record<RadioSize, string> = {
  sm: "w-1.5 h-1.5",
  md: "w-[7px] h-[7px]",
  lg: "w-2 h-2",
};

const BOX_MT_WITH_DESC: Record<RadioSize, string> = {
  sm: "mt-[3px]",
  md: "mt-[3px]",
  lg: "mt-[4px]",
};

const LABEL_SIZE: Record<RadioSize, string> = {
  sm: "text-xs  tracking-normal",
  md: "text-sm  tracking-tight",
  lg: "text-base tracking-tight",
};

const ITEM_GAP: Record<RadioSize, string> = {
  sm: "gap-2",
  md: "gap-2.5",
  lg: "gap-3",
};

// ─── State colour maps ────────────────────────────────────────────────────────

const CIRCLE_BORDER_UNSELECTED: Record<RadioState, string> = {
  default: "border-[var(--color-input-border)]",
  error: "border-[var(--color-input-border-error)]",
  warning: "border-[var(--color-input-border-warning)]",
  success: "border-[var(--color-input-border-success)]",
};

const CIRCLE_FILLED: Record<RadioState, string> = {
  default: "border-[var(--color-control-fill-brand)]",
  error: "border-[var(--color-control-fill-danger)]",
  warning: "border-[var(--color-control-fill-warning)]",
  success: "border-[var(--color-control-fill-success)]",
};

const DOT_COLOR: Record<RadioState, string> = {
  default: "bg-[var(--color-control-fill-brand)]",
  error: "bg-[var(--color-control-fill-danger)]",
  warning: "bg-[var(--color-control-fill-warning)]",
  success: "bg-[var(--color-control-fill-success)]",
};

const HOVER_TINT: Record<RadioState, string> = {
  default: "var(--color-control-tint-brand)",
  error: "var(--color-control-tint-danger)",
  warning: "var(--color-control-tint-warning)",
  success: "var(--color-control-tint-success)",
};

const DOT_GHOST_COLOR: Record<RadioState, string> = {
  default: "bg-[var(--color-control-fill-brand)]",
  error: "bg-[var(--color-control-fill-danger)]",
  warning: "bg-[var(--color-control-fill-warning)]",
  success: "bg-[var(--color-control-fill-success)]",
};

// ─── Focus rings ──────────────────────────────────────────────────────────────
// Concrete rgba strings required — Framer Motion cannot interpolate CSS custom
// properties in box-shadow strings. #0A0A0A = --color-surface-page.

const FOCUS_RING: Record<RadioState, string> = {
  default: "0 0 0 2px #0A0A0A, 0 0 0 4px rgba(38,  201, 201, 0.50)",
  error: "0 0 0 2px #0A0A0A, 0 0 0 4px rgba(239,  68,  68, 0.50)",
  warning: "0 0 0 2px #0A0A0A, 0 0 0 4px rgba(245, 158,  11, 0.50)",
  success: "0 0 0 2px #0A0A0A, 0 0 0 4px rgba( 34, 197,  94, 0.50)",
};

const FOCUS_RING_OFF = "0 0 0 0px rgba(0,0,0,0), 0 0 0 0px rgba(0,0,0,0)";

// ─── Group message colours ────────────────────────────────────────────────────

const GROUP_MSG_COLOR: Record<RadioState, string> = {
  default: "text-[var(--color-text-muted)]",
  error: "text-[var(--color-label-error)]",
  warning: "text-[var(--color-label-warning)]",
  success: "text-[var(--color-label-success)]",
};

// ─── RadioButton ──────────────────────────────────────────────────────────────

export const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(
  function RadioButton(
    {
      value,
      size: sizeProp,
      state: stateProp,
      label,
      description,
      checked: checkedProp,
      defaultChecked,
      disabled: disabledProp,
      onChange: onChangeProp,
      id: externalId,
      name: nameProp,
      autoFocus,
      className,
      ...rest
    },
    forwardedRef,
  ) {
    const ctx = useContext(RadioGroupContext);

    const size = sizeProp ?? ctx?.groupSize ?? "md";
    const state = stateProp ?? ctx?.groupState ?? "default";
    const disabled = disabledProp ?? ctx?.groupDisabled ?? false;
    const name = nameProp ?? ctx?.name;
    const required = ctx?.required ?? false;
    const isInvalid = ctx?.isInvalid ?? false;
    const messageId = ctx?.messageId;

    const generatedId = useId();
    const id = externalId ?? generatedId;
    const inputRef = useRef<HTMLInputElement | null>(null);

    const [focused, setFocused] = useState(false);
    const [hovered, setHovered] = useState(false);

    // Controlled: group context takes precedence
    const isSelected = ctx
      ? ctx.selected === value
      : checkedProp !== undefined
        ? !!checkedProp
        : undefined;

    const [internalSelected, setInternalSelected] = useState(defaultChecked ?? false);
    const isChecked = isSelected !== undefined ? isSelected : internalSelected;
    const isDisabled = !!disabled;

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (ctx) {
          ctx.onChange(value);
        } else {
          setInternalSelected(e.target.checked);
        }
        onChangeProp?.(e);
      },
      [ctx, value, onChangeProp],
    );

    const hasDesc = !!description;
    const outerAlign = hasDesc ? "items-start" : "items-center";
    const circleTopOffset = hasDesc ? BOX_MT_WITH_DESC[size] : "";
    const showGhost = hovered && !isChecked && !isDisabled;

    return (
      <div
        className={cn("inline-flex", outerAlign, ITEM_GAP[size], className)}
        onMouseEnter={() => !isDisabled && setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* ── Circle + hidden input ─────────────────────────────────────── */}
        <div className={cn("relative shrink-0", circleTopOffset)}>

          {/* Native input — accessible, visually hidden */}
          <input
            ref={(node) => {
              inputRef.current = node;
              if (typeof forwardedRef === "function") forwardedRef(node);
              else if (forwardedRef) forwardedRef.current = node;
            }}
            id={id}
            type="radio"
            value={value}
            name={name}
            autoFocus={autoFocus}
            checked={isSelected !== undefined ? isChecked : undefined}
            defaultChecked={isSelected === undefined ? defaultChecked : undefined}
            disabled={disabled}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            aria-describedby={messageId}
            aria-required={required || undefined}
            aria-invalid={isInvalid || undefined}
            className="sr-only"
            {...rest}
          />

          {/* Styled circle */}
          <motion.label
            htmlFor={id}
            animate={{
              boxShadow: focused ? FOCUS_RING[state] : FOCUS_RING_OFF,
              scale: hovered && !isDisabled ? 1.06 : 1,
            }}
            whileTap={!isDisabled ? { scale: 0.82 } : undefined}
            transition={{
              boxShadow: { duration: 0.15, ease: "easeOut" },
              scale: { type: "spring", stiffness: 500, damping: 28, mass: 0.6 },
            }}
            className={cn(
              "relative flex cursor-pointer select-none items-center justify-center",
              "rounded-full border-2 transition-[border-color,background-color] duration-150 ease-out",
              CIRCLE_SIZE[size],
              isChecked
                ? cn("bg-[var(--color-input-bg)]", CIRCLE_FILLED[state])
                : cn("bg-[var(--color-input-bg)]", CIRCLE_BORDER_UNSELECTED[state]),
              isDisabled && "cursor-not-allowed opacity-40",
            )}
          >
            {/* Hover tint bloom */}
            <AnimatePresence>
              {showGhost && (
                <motion.span
                  key="tint"
                  className="absolute inset-0 pointer-events-none rounded-full"
                  style={{ backgroundColor: HOVER_TINT[state] }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                />
              )}
            </AnimatePresence>

            {/* Selected dot — flies between circles via shared layout animation.
                No AnimatePresence: removing it lets Framer Motion capture A's
                bounding box in the same synchronous commit that mounts B, then
                project B from A's full-size position. With AnimatePresence the
                exit animation collapses A to scale:0 before relegate() fires,
                so the captured source bbox is a point — the flight degrades to
                a normal pop-in. LayoutGroup id={name} scopes "rd" per group. */}
            {isChecked && (
              <motion.span
                layout
                layoutId={ctx ? "rd" : undefined}
                className={cn("rounded-full", DOT_SIZE[size], DOT_COLOR[state])}
                variants={variants.blur}
                initial="initial"
                animate="animate"
                style={{ willChange: "filter" }}
                transition={{
                  layout: transitions.springHeavy,
                  filter: transitions.springHeavy,
                  default: { type: "spring", stiffness: 600, damping: 30, mass: 0.5 },
                }}
              />
            )}

            {/* Ghost dot preview on hover */}
            <AnimatePresence>
              {showGhost && (
                <motion.span
                  key="ghost-dot"
                  className={cn("rounded-full", DOT_SIZE[size], DOT_GHOST_COLOR[state])}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.28 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.1 }}
                />
              )}
            </AnimatePresence>
          </motion.label>
        </div>

        {/* ── Label + description ───────────────────────────────────────── */}
        {(label || description) && (
          <label
            htmlFor={id}
            className={cn(
              "flex cursor-pointer select-none flex-col gap-0.5",
              isDisabled && "cursor-not-allowed opacity-40",
            )}
          >
            {label && (
              <span
                className={cn(
                  LABEL_SIZE[size],
                  "font-medium text-[var(--color-text-primary)] leading-none",
                )}
              >
                {label}
              </span>
            )}
            {description && (
              <span className="text-xs leading-snug tracking-tight text-[var(--color-text-muted)]">
                {description}
              </span>
            )}
          </label>
        )}
      </div>
    );
  },
);
RadioButton.displayName = "RadioButton";

// ─── RadioGroup ───────────────────────────────────────────────────────────────

export function RadioGroup({
  value,
  defaultValue,
  onChange,
  name: nameProp,
  size = "md",
  state = "default",
  disabled = false,
  label,
  required,
  optional,
  helperText,
  errorMessage,
  warningMessage,
  direction = "vertical",
  children,
  className,
}: RadioGroupProps) {
  const generatedName = useId();
  const name = nameProp ?? generatedName;

  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue ?? "");
  const selected = isControlled ? value : internal;

  const handleChange = useCallback(
    (v: string) => {
      if (!isControlled) setInternal(v);
      onChange?.(v);
    },
    [isControlled, onChange],
  );

  const message =
    state === "error" ? errorMessage
      : state === "warning" ? warningMessage
        : helperText;

  const messageId = useId(); // unique ID for the message element

  return (
    <RadioGroupContext.Provider
      value={{
        name,
        selected,
        onChange: handleChange,
        groupSize: size,
        groupState: state,
        groupDisabled: disabled,
        required: !!required,
        messageId: message ? messageId : undefined,
        isInvalid: state === "error",
      }}
    >
      <div role="radiogroup" className={cn("flex flex-col gap-2", className)}>

        {label && (
          <div className="flex items-baseline justify-between gap-2">
            <Label
              size="xs"
              weight="medium"
              className="text-[var(--color-label-default)] select-none cursor-default"
              required={required}
            >
              {label}
            </Label>
            {optional && !required && (
              <Text as="span" size="xs" color="disabled" inline className="shrink-0 leading-none">
                optional
              </Text>
            )}
          </div>
        )}

        {/* LayoutGroup scopes the dot's layoutId to this specific group, so
            multiple RadioGroups on the same page don't share the flying dot. */}
        <LayoutGroup id={name}>
          <div
            className={cn(
              direction === "horizontal"
                ? "flex flex-wrap gap-x-6 gap-y-3"
                : "flex flex-col gap-3",
            )}
          >
            {children}
          </div>
        </LayoutGroup>

        {message && (
          <Text
            id={messageId}
            as="p"
            size="xs"
            className={cn("leading-snug", GROUP_MSG_COLOR[state])}
          >
            {message}
          </Text>
        )}
      </div>
    </RadioGroupContext.Provider>
  );
}