// "use client";

// import { forwardRef, useRef, useId, useState, useCallback, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { cn } from "@/lib/utils";
// import { Spinner } from "./Spinner";
// import { Label, Text, Mono } from "./Typography";
// import {
//   RiErrorWarningLine,
//   RiAlertLine,
//   RiCheckLine,
//   RiCloseCircleLine,
// } from "@remixicon/react";

// // ─── Types ────────────────────────────────────────────────────────────────────

// export type TextAreaSize  = "sm" | "md" | "lg";
// export type TextAreaState = "default" | "error" | "warning" | "success" | "loading";

// export interface TextAreaProps
//   extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
//   size?:           TextAreaSize;
//   /** Validation / async state. Controls border colour, focus ring, corner icon. */
//   state?:          TextAreaState;
//   label?:          string;
//   required?:       boolean;
//   /** Renders "(optional)" label tag — mutually exclusive with required. */
//   optional?:       boolean;
//   helperText?:     string;
//   /** Shown instead of helperText when state="error". */
//   errorMessage?:   string;
//   /** Shown instead of helperText when state="warning". */
//   warningMessage?: string;
//   /** Enables a character counter below the field. Also sets the native maxLength attribute. */
//   maxLength?:      number;
//   /**
//    * When true (default) the component stretches to fill its container.
//    * When false it takes no explicit width — set width via className or a parent container.
//    */
//   fullWidth?:      boolean;
//   /** Minimum visible rows (default 3). */
//   minRows?:        number;
//   /** Maximum rows before content scrolls — only with autoResize. Omit for unlimited growth. */
//   maxRows?:        number;
//   /** Automatically grow/shrink the field to fit content (default true). */
//   autoResize?:     boolean;
//   /**
//    * CSS resize handle. Defaults to "vertical".
//    * Forced to "none" when autoResize=true (size is managed programmatically).
//    */
//   resize?:         "none" | "vertical" | "both";
//   /** Show a × clear button when the field has content. */
//   clearable?:      boolean;
// }

// // ─── Size maps ────────────────────────────────────────────────────────────────

// const PADDING_X: Record<TextAreaSize, string> = {
//   sm: "px-3",
//   md: "px-3.5",
//   lg: "px-4",
// };

// const PADDING_Y: Record<TextAreaSize, string> = {
//   sm: "py-2",
//   md: "py-2.5",
//   lg: "py-3",
// };

// const WRAPPER_RADIUS: Record<TextAreaSize, string> = {
//   sm: "rounded-lg",
//   md: "rounded-xl",
//   lg: "rounded-xl",
// };

// const INPUT_TEXT: Record<TextAreaSize, string> = {
//   sm: "text-xs  tracking-normal",
//   md: "text-sm  tracking-tight",
//   lg: "text-base tracking-tight",
// };

// const ICON_SIZE: Record<TextAreaSize, string> = {
//   sm: "w-3   h-3",
//   md: "w-3.5 h-3.5",
//   lg: "w-4   h-4",
// };

// // ─── Corner slot position (aligns with wrapper padding) ───────────────────────

// const CORNER_POS: Record<TextAreaSize, string> = {
//   sm: "top-2   right-2.5",
//   md: "top-2.5 right-3",
//   lg: "top-3   right-3.5",
// };

// // Extra right padding on the <textarea> element to avoid text overlapping corner icon.
// // Calculated as: wrapper_px + icon_width + visual_gap
// const TEXTAREA_PR_ICON: Record<TextAreaSize, string> = {
//   sm: "pr-[1.625rem]",  // 26px = 12px(wrapper) + 12px(icon) + 2px(gap)
//   md: "pr-[1.875rem]",  // 30px = 14px(wrapper) + 14px(icon) + 2px(gap)
//   lg: "pr-[2.125rem]",  // 34px = 16px(wrapper) + 16px(icon) + 2px(gap)
// };

// // ─── State → border colour ────────────────────────────────────────────────────

// const STATE_BORDER: Record<TextAreaState, string> = {
//   default: "border-[var(--color-input-border)]",
//   loading: "border-[var(--color-input-border)]",
//   error:   "border-[var(--color-input-border-error)]",
//   warning: "border-[var(--color-input-border-warning)]",
//   success: "border-[var(--color-input-border-success)]",
// };

// // ─── Focus ring — concrete rgba strings so Framer can interpolate ─────────────

// const FOCUS_RING: Record<TextAreaState, string> = {
//   default: "0 0 0 2px #0A0A0A, 0 0 0 4px rgba(38,  201, 201, 0.50)",
//   loading: "0 0 0 2px #0A0A0A, 0 0 0 4px rgba(38,  201, 201, 0.50)",
//   error:   "0 0 0 2px #0A0A0A, 0 0 0 4px rgba(239,  68,  68, 0.50)",
//   warning: "0 0 0 2px #0A0A0A, 0 0 0 4px rgba(245, 158,  11, 0.50)",
//   success: "0 0 0 2px #0A0A0A, 0 0 0 4px rgba( 34, 197,  94, 0.50)",
// };

// const FOCUS_RING_OFF = "0 0 0 0px rgba(0,0,0,0), 0 0 0 0px rgba(0,0,0,0)";

// // ─── Below-field message colour ───────────────────────────────────────────────

// const MESSAGE_COLOR: Record<TextAreaState, string> = {
//   default: "text-[var(--color-text-muted)]",
//   loading: "text-[var(--color-text-muted)]",
//   error:   "text-[var(--color-text-danger)]",
//   warning: "text-[var(--color-text-warning)]",
//   success: "text-[var(--color-text-success)]",
// };

// // ─── Label colour on focus ────────────────────────────────────────────────────

// const LABEL_FOCUSED_COLOR: Record<TextAreaState, string> = {
//   default: "text-[var(--color-label-focused)]",
//   loading: "text-[var(--color-text-brand)]",
//   error:   "text-[var(--color-label-error)]",
//   warning: "text-[var(--color-label-warning)]",
//   success: "text-[var(--color-label-success)]",
// };

// // ─── Component ────────────────────────────────────────────────────────────────

// export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
//   function TextArea(
//     {
//       size          = "md",
//       state         = "default",
//       label,
//       required,
//       optional,
//       helperText,
//       errorMessage,
//       warningMessage,
//       maxLength,
//       fullWidth     = true,
//       minRows       = 3,
//       maxRows,
//       autoResize    = true,
//       resize        = "vertical",
//       clearable     = false,
//       // native attrs we control explicitly
//       id:           externalId,
//       value,
//       defaultValue,
//       disabled,
//       readOnly,
//       onChange,
//       onFocus,
//       onBlur,
//       className,
//       ...rest
//     },
//     forwardedRef,
//   ) {
//     const generatedId  = useId();
//     const id           = externalId ?? generatedId;
//     const textareaRef  = useRef<HTMLTextAreaElement>(null);

//     const [focused, setFocused] = useState(false);

//     // ── Value tracking (char count + clear) ──────────────────────────────────
//     const [internalValue, setInternalValue] = useState(
//       typeof defaultValue === "string" ? defaultValue : "",
//     );
//     const currentValue = typeof value === "string" ? value : internalValue;
//     const hasValue     = currentValue.length > 0;

//     const handleChange = useCallback(
//       (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//         if (value === undefined) setInternalValue(e.target.value);
//         onChange?.(e);
//       },
//       [value, onChange],
//     );

//     // ── Auto-resize ──────────────────────────────────────────────────────────
//     const adjustHeight = useCallback(() => {
//       const el = textareaRef.current;
//       if (!el || !autoResize) return;

//       // Shrink to auto first so scrollHeight reflects content, not prior forced height
//       el.style.height = "auto";

//       const cs         = getComputedStyle(el);
//       const lineHeight = parseFloat(cs.lineHeight) || 20;
//       const padTop     = parseFloat(cs.paddingTop) || 0;
//       const padBot     = parseFloat(cs.paddingBottom) || 0;
//       const minH       = minRows * lineHeight + padTop + padBot;
//       const rawH       = Math.max(el.scrollHeight, minH);

//       if (maxRows) {
//         const maxH         = maxRows * lineHeight + padTop + padBot;
//         el.style.height    = Math.min(rawH, maxH) + "px";
//         el.style.overflowY = rawH > maxH ? "auto" : "hidden";
//       } else {
//         el.style.height    = rawH + "px";
//         el.style.overflowY = "hidden";
//       }
//     }, [autoResize, minRows, maxRows]);

//     // Run on mount and on every value change
//     useEffect(() => { adjustHeight(); }, [currentValue, adjustHeight]);

//     // ── Clear ────────────────────────────────────────────────────────────────
//     const handleClear = () => {
//       setInternalValue("");
//       const el = textareaRef.current;
//       if (el) {
//         const nativeSetter = Object.getOwnPropertyDescriptor(
//           HTMLTextAreaElement.prototype, "value",
//         )?.set;
//         nativeSetter?.call(el, "");
//         el.dispatchEvent(new Event("input", { bubbles: true }));
//         el.focus();
//       }
//     };

//     // ── Derived flags ────────────────────────────────────────────────────────
//     const isDisabled      = !!disabled;
//     const isReadOnly      = !!readOnly;
//     const effectiveResize = autoResize ? "none" : resize;

//     // ── Corner slot — priority: loading > state > clear ───────────────────────
//     type CornerKey = "loading" | "error" | "warning" | "success" | "clear" | null;

//     const cornerKey: CornerKey =
//       state === "loading"    ? "loading"
//       : state === "error"    ? "error"
//       : state === "warning"  ? "warning"
//       : state === "success"  ? "success"
//       : clearable && hasValue ? "clear"
//       : null;

//     const iconCls = cn(ICON_SIZE[size], "shrink-0");

//     const cornerNode: React.ReactNode =
//       state === "loading" ? (
//         <Spinner size={({ sm: "xs", md: "sm", lg: "md" } as const)[size]} variant="brand" />
//       ) : state === "error" ? (
//         <RiErrorWarningLine className={cn(iconCls, "text-[var(--color-icon-danger)]")} />
//       ) : state === "warning" ? (
//         <RiAlertLine className={cn(iconCls, "text-[var(--color-icon-warning)]")} />
//       ) : state === "success" ? (
//         <RiCheckLine className={cn(iconCls, "text-[var(--color-icon-success)]")} />
//       ) : clearable && hasValue ? (
//         <button
//           type="button"
//           tabIndex={-1}
//           onClick={handleClear}
//           className="inline-flex text-[var(--color-icon-muted)] hover:text-[var(--color-icon-secondary)] transition-colors duration-150 focus:outline-none"
//         >
//           <RiCloseCircleLine className={iconCls} />
//         </button>
//       ) : null;

//     // ── Char count colour ────────────────────────────────────────────────────
//     const charCountColor = !maxLength ? "" :
//       currentValue.length >= maxLength           ? "text-[var(--color-text-danger)]"
//       : currentValue.length >= maxLength * 0.90  ? "text-[var(--color-text-warning)]"
//       : "text-[var(--color-text-disabled)]";

//     // ── Message to show below ────────────────────────────────────────────────
//     const message =
//       state === "error"   ? errorMessage
//       : state === "warning" ? warningMessage
//       : helperText;

//     const hasBelow = !!(helperText || errorMessage || warningMessage || maxLength);

//     return (
//       <div className={cn("flex flex-col gap-1.5", fullWidth && "w-full", className)}>

//         {/* ── Label row ─────────────────────────────────────────────────── */}
//         {label && (
//           <div className="flex items-baseline justify-between gap-2">
//             <Label
//               htmlFor={id}
//               size={size === "lg" ? "sm" : "xs"}
//               weight="medium"
//               required={required}
//               className={cn(
//                 "transition-colors duration-150 select-none",
//                 focused
//                   ? LABEL_FOCUSED_COLOR[state]
//                   : "text-[var(--color-label-default)]",
//                 isDisabled && "opacity-40 cursor-not-allowed",
//               )}
//             >
//               {label}
//             </Label>
//             {optional && !required && (
//               <Text
//                 as="span"
//                 size={size === "lg" ? "sm" : "xs"}
//                 color="disabled"
//                 inline
//                 className="shrink-0 leading-none"
//               >
//                 optional
//               </Text>
//             )}
//           </div>
//         )}

//         {/* ── Textarea wrapper ──────────────────────────────────────────── */}
//         <motion.div
//           animate={{
//             boxShadow: focused ? FOCUS_RING[state] : FOCUS_RING_OFF,
//           }}
//           transition={{ duration: 0.15, ease: "easeOut" }}
//           className={cn(
//             "relative border bg-[var(--color-input-bg)]",
//             "transition-[border-color,background-color] duration-150 ease-out",
//             PADDING_X[size],
//             PADDING_Y[size],
//             WRAPPER_RADIUS[size],
//             // border state
//             STATE_BORDER[state],
//             // hover — only for default/loading, not disabled, not readonly
//             !isDisabled && !isReadOnly && (state === "default" || state === "loading") &&
//               "hover:border-[var(--color-input-border-hover)]",
//             // focused border upgrade for default/loading
//             focused && (state === "default" || state === "loading") &&
//               "border-[var(--color-input-border-focus)]",
//             // disabled
//             isDisabled && "opacity-40 cursor-not-allowed pointer-events-none",
//             // readonly
//             isReadOnly && "bg-[var(--color-input-bg-readonly)]",
//           )}
//           onClick={() => !isDisabled && textareaRef.current?.focus()}
//         >
//           {/* Native textarea */}
//           <textarea
//             ref={(node) => {
//               textareaRef.current = node;
//               if (typeof forwardedRef === "function") forwardedRef(node);
//               else if (forwardedRef) forwardedRef.current = node;
//             }}
//             id={id}
//             value={value}
//             defaultValue={value !== undefined ? undefined : defaultValue}
//             disabled={isDisabled}
//             readOnly={isReadOnly}
//             maxLength={maxLength}
//             rows={minRows}
//             onChange={handleChange}
//             onFocus={(e) => { setFocused(true);  onFocus?.(e); }}
//             onBlur={(e)  => { setFocused(false); onBlur?.(e);  }}
//             className={cn(
//               "block w-full bg-transparent border-none outline-none",
//               INPUT_TEXT[size],
//               "font-normal leading-relaxed",
//               "text-[var(--color-text-primary)]",
//               "placeholder:text-[var(--color-text-disabled)]",
//               "disabled:cursor-not-allowed",
//               isReadOnly && "cursor-default select-all",
//               // Extra right padding when corner slot is occupied, so text clears the icon
//               cornerKey && TEXTAREA_PR_ICON[size],
//             )}
//             style={{
//               resize: effectiveResize,
//               ...(autoResize && { overflowY: "hidden" }),
//             }}
//             {...rest}
//           />

//           {/* ── Corner slot (top-right) — state icon or clear button ─── */}
//           <div className={cn("absolute pointer-events-none", CORNER_POS[size])}>
//             <AnimatePresence mode="wait" initial={false}>
//               {cornerKey && cornerNode && (
//                 <motion.span
//                   key={cornerKey}
//                   initial={{ opacity: 0, scale: 0.6 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   exit={{ opacity: 0, scale: 0.6 }}
//                   transition={{ duration: 0.12, ease: "easeOut" }}
//                   className={cn(
//                     "inline-flex items-center",
//                     cornerKey === "clear" && "pointer-events-auto",
//                   )}
//                 >
//                   {cornerNode}
//                 </motion.span>
//               )}
//             </AnimatePresence>
//           </div>
//         </motion.div>

//         {/* ── Below row: message + char count ──────────────────────────── */}
//         {hasBelow && (
//           <div className="flex items-start justify-between gap-3 min-h-[1rem]">
//             {/* Message — animated swap between helper / error / warning */}
//             <div className="flex-1">
//               <AnimatePresence mode="wait" initial={false}>
//                 {message && (
//                   <motion.p
//                     key={state + "-" + message}
//                     initial={{ opacity: 0, y: -3 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -3 }}
//                     transition={{ duration: 0.15, ease: "easeOut" }}
//                     className={cn(
//                       "text-xs font-normal leading-snug",
//                       MESSAGE_COLOR[state],
//                     )}
//                   >
//                     {message}
//                   </motion.p>
//                 )}
//               </AnimatePresence>
//             </div>

//             {/* Character count */}
//             {maxLength && (
//               <Mono
//                 size="xs"
//                 className={cn("tabular-nums shrink-0 transition-colors duration-200", charCountColor)}
//               >
//                 {currentValue.length}/{maxLength}
//               </Mono>
//             )}
//           </div>
//         )}

//       </div>
//     );
//   },
// );

// TextArea.displayName = "TextArea";


"use client";

import { forwardRef, useRef, useId, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Spinner } from "./Spinner";
import { Label, Text, Mono } from "./Typography";
import {
  RiErrorWarningLine,
  RiAlertLine,
  RiCheckLine,
  RiCloseCircleLine,
} from "@remixicon/react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TextAreaSize = "sm" | "md" | "lg";
export type TextAreaState = "default" | "error" | "warning" | "success" | "loading";

export interface TextAreaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  size?: TextAreaSize;
  /** Validation / async state. Controls border colour, focus ring, corner icon. */
  state?: TextAreaState;
  label?: string;
  required?: boolean;
  /** Renders "(optional)" label tag — mutually exclusive with required. */
  optional?: boolean;
  /** Icon node rendered in the leading slot (top-left). */
  leadingIcon?: React.ReactNode;
  helperText?: string;
  /** Shown instead of helperText when state="error". */
  errorMessage?: string;
  /** Shown instead of helperText when state="warning". */
  warningMessage?: string;
  /** Enables a character counter below the field. Also sets the native maxLength attribute. */
  maxLength?: number;
  /**
   * When true (default) the component stretches to fill its container.
   * When false it takes no explicit width — set width via className or a parent container.
   */
  fullWidth?: boolean;
  /** Minimum visible rows (default 3). */
  minRows?: number;
  /** Maximum rows before content scrolls — only with autoResize. Omit for unlimited growth. */
  maxRows?: number;
  /** Automatically grow/shrink the field to fit content (default true). */
  autoResize?: boolean;
  /**
   * CSS resize handle. Defaults to "vertical".
   * Forced to "none" when autoResize=true (size is managed programmatically).
   */
  resize?: "none" | "vertical" | "both";
  /** Show a × clear button when the field has content. */
  clearable?: boolean;
  /** Name attribute for form submission. */
  name?: string;
  /** Whether the textarea should autofocus when mounted. */
  autoFocus?: boolean;
}

// ─── Size maps ────────────────────────────────────────────────────────────────

const PADDING_X: Record<TextAreaSize, string> = {
  sm: "px-3",
  md: "px-3.5",
  lg: "px-4",
};

const PADDING_Y: Record<TextAreaSize, string> = {
  sm: "py-2",
  md: "py-2.5",
  lg: "py-3",
};

const WRAPPER_RADIUS: Record<TextAreaSize, string> = {
  sm: "rounded-lg",
  md: "rounded-xl",
  lg: "rounded-xl",
};

const INPUT_TEXT: Record<TextAreaSize, string> = {
  sm: "text-xs  tracking-normal",
  md: "text-sm  tracking-tight",
  lg: "text-base tracking-tight",
};

const ICON_SIZE: Record<TextAreaSize, string> = {
  sm: "w-3   h-3",
  md: "w-3.5 h-3.5",
  lg: "w-4   h-4",
};

// ─── Corner slot position (aligns with wrapper padding) ───────────────────────

const CORNER_POS: Record<TextAreaSize, string> = {
  sm: "top-2   right-2.5",
  md: "top-2.5 right-3",
  lg: "top-3   right-3.5",
};

// Extra right padding on the <textarea> element to avoid text overlapping corner icon.
// Calculated as: wrapper_px + icon_width + visual_gap
const TEXTAREA_PR_ICON: Record<TextAreaSize, string> = {
  sm: "pr-[1.625rem]",  // 26px = 12px(wrapper) + 12px(icon) + 2px(gap)
  md: "pr-[1.875rem]",  // 30px = 14px(wrapper) + 14px(icon) + 2px(gap)
  lg: "pr-[2.125rem]",  // 34px = 16px(wrapper) + 16px(icon) + 2px(gap)
};

// ─── State → border colour ────────────────────────────────────────────────────

const STATE_BORDER: Record<TextAreaState, string> = {
  default: "border-[var(--color-input-border)]",
  loading: "border-[var(--color-input-border)]",
  error: "border-[var(--color-input-border-error)]",
  warning: "border-[var(--color-input-border-warning)]",
  success: "border-[var(--color-input-border-success)]",
};

// ─── Focus ring — concrete rgba strings so Framer can interpolate ─────────────

const FOCUS_RING: Record<TextAreaState, string> = {
  default: "0 0 0 2px #0A0A0A, 0 0 0 4px rgba(38,  201, 201, 0.50)",
  loading: "0 0 0 2px #0A0A0A, 0 0 0 4px rgba(38,  201, 201, 0.50)",
  error: "0 0 0 2px #0A0A0A, 0 0 0 4px rgba(239,  68,  68, 0.50)",
  warning: "0 0 0 2px #0A0A0A, 0 0 0 4px rgba(245, 158,  11, 0.50)",
  success: "0 0 0 2px #0A0A0A, 0 0 0 4px rgba( 34, 197,  94, 0.50)",
};

const FOCUS_RING_OFF = "0 0 0 0px rgba(0,0,0,0), 0 0 0 0px rgba(0,0,0,0)";

// ─── Below-field message colour ───────────────────────────────────────────────

const MESSAGE_COLOR: Record<TextAreaState, string> = {
  default: "text-[var(--color-text-muted)]",
  loading: "text-[var(--color-text-muted)]",
  error: "text-[var(--color-text-danger)]",
  warning: "text-[var(--color-text-warning)]",
  success: "text-[var(--color-text-success)]",
};

// ─── Label colour on focus ────────────────────────────────────────────────────

const LABEL_FOCUSED_COLOR: Record<TextAreaState, string> = {
  default: "text-[var(--color-label-focused)]",
  loading: "text-[var(--color-text-brand)]",
  error: "text-[var(--color-label-error)]",
  warning: "text-[var(--color-label-warning)]",
  success: "text-[var(--color-label-success)]",
};

// ─── Component ────────────────────────────────────────────────────────────────

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextArea(
    {
      size = "md",
      state = "default",
      label,
      required,
      optional,
      leadingIcon,
      helperText,
      errorMessage,
      warningMessage,
      maxLength,
      fullWidth = true,
      minRows = 3,
      maxRows,
      autoResize = true,
      resize = "vertical",
      clearable = false,
      name,
      autoFocus = false,
      // native attrs we control explicitly
      id: externalId,
      value,
      defaultValue,
      disabled,
      readOnly,
      onChange,
      onFocus,
      onBlur,
      className,
      ...rest
    },
    forwardedRef,
  ) {
    const generatedId = useId();
    const id = externalId ?? generatedId;
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const [focused, setFocused] = useState(false);

    // ── Value tracking (char count + clear) ──────────────────────────────────
    const [internalValue, setInternalValue] = useState(
      typeof defaultValue === "string" ? defaultValue : "",
    );
    const currentValue = typeof value === "string" ? value : internalValue;
    const hasValue = currentValue.length > 0;

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (value === undefined) setInternalValue(e.target.value);
        onChange?.(e);
      },
      [value, onChange],
    );

    // ── Auto-resize ──────────────────────────────────────────────────────────
    const adjustHeight = useCallback(() => {
      const el = textareaRef.current;
      if (!el || !autoResize) return;

      // Shrink to auto first so scrollHeight reflects content, not prior forced height
      el.style.height = "auto";

      const cs = getComputedStyle(el);
      const lineHeight = parseFloat(cs.lineHeight) || 20;
      const padTop = parseFloat(cs.paddingTop) || 0;
      const padBot = parseFloat(cs.paddingBottom) || 0;
      const minH = minRows * lineHeight + padTop + padBot;
      const rawH = Math.max(el.scrollHeight, minH);

      if (maxRows) {
        const maxH = maxRows * lineHeight + padTop + padBot;
        el.style.height = Math.min(rawH, maxH) + "px";
        el.style.overflowY = rawH > maxH ? "auto" : "hidden";
      } else {
        el.style.height = rawH + "px";
        el.style.overflowY = "hidden";
      }
    }, [autoResize, minRows, maxRows]);

    // Run on mount and on every value change
    useEffect(() => { adjustHeight(); }, [currentValue, adjustHeight]);

    // ── Clear ────────────────────────────────────────────────────────────────
    const handleClear = () => {
      setInternalValue("");
      const el = textareaRef.current;
      if (el) {
        const nativeSetter = Object.getOwnPropertyDescriptor(
          HTMLTextAreaElement.prototype, "value",
        )?.set;
        nativeSetter?.call(el, "");
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.focus();
      }
    };

    // ── Derived flags ────────────────────────────────────────────────────────
    const isDisabled = !!disabled;
    const isReadOnly = !!readOnly;
    const effectiveResize = autoResize ? "none" : resize;

    // ── Corner slot — priority: loading > state > clear ───────────────────────
    type CornerKey = "loading" | "error" | "warning" | "success" | "clear" | null;

    const cornerKey: CornerKey =
      state === "loading" ? "loading"
        : state === "error" ? "error"
          : state === "warning" ? "warning"
            : state === "success" ? "success"
              : clearable && hasValue ? "clear"
                : null;

    const iconCls = cn(ICON_SIZE[size], "shrink-0");

    const cornerNode: React.ReactNode =
      state === "loading" ? (
        <Spinner size={({ sm: "xs", md: "sm", lg: "md" } as const)[size]} variant="brand" />
      ) : state === "error" ? (
        <RiErrorWarningLine className={cn(iconCls, "text-[var(--color-icon-danger)]")} />
      ) : state === "warning" ? (
        <RiAlertLine className={cn(iconCls, "text-[var(--color-icon-warning)]")} />
      ) : state === "success" ? (
        <RiCheckLine className={cn(iconCls, "text-[var(--color-icon-success)]")} />
      ) : clearable && hasValue ? (
        <button
          type="button"
          tabIndex={-1}
          onClick={handleClear}
          aria-label="Clear text"
          className="inline-flex text-[var(--color-icon-muted)] hover:text-[var(--color-icon-secondary)] transition-colors duration-150 focus:outline-none"
        >
          <RiCloseCircleLine className={iconCls} />
        </button>
      ) : null;

    // ── Char count colour ────────────────────────────────────────────────────
    const charCountColor = !maxLength ? "" :
      currentValue.length >= maxLength ? "text-[var(--color-text-danger)]"
        : currentValue.length >= maxLength * 0.90 ? "text-[var(--color-text-warning)]"
          : "text-[var(--color-text-disabled)]";

    // ── Message to show below ────────────────────────────────────────────────
    const message =
      state === "error" ? errorMessage
        : state === "warning" ? warningMessage
          : helperText;

    const hasBelow = !!(helperText || errorMessage || warningMessage || maxLength);

    // ── IDs for ARIA linking ─────────────────────────────────────────────────
    const messageId = hasBelow && message ? `${id}-message` : undefined;
    const charCountId = maxLength ? `${id}-char-count` : undefined;
    const describedBy = [messageId, charCountId].filter(Boolean).join(" ") || undefined;

    return (
      <div className={cn("flex flex-col gap-1.5", fullWidth && "w-full", className)}>

        {/* ── Label row ─────────────────────────────────────────────────── */}
        {label && (
          <div className="flex items-baseline justify-between gap-2">
            <Label
              htmlFor={id}
              size={size === "lg" ? "sm" : "xs"}
              weight="medium"
              required={required}
              className={cn(
                "transition-colors duration-150 select-none",
                focused
                  ? LABEL_FOCUSED_COLOR[state]
                  : "text-[var(--color-label-default)]",
                isDisabled && "opacity-40 cursor-not-allowed",
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

        {/* ── Textarea wrapper ──────────────────────────────────────────── */}
        <motion.div
          animate={{
            boxShadow: focused ? FOCUS_RING[state] : FOCUS_RING_OFF,
          }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className={cn(
            "relative border bg-[var(--color-input-bg)] flex items-start gap-2",
            "transition-[border-color,background-color] duration-150 ease-out",
            PADDING_X[size],
            PADDING_Y[size],
            WRAPPER_RADIUS[size],
            // border state
            STATE_BORDER[state],
            // hover — only for default/loading, not disabled, not readonly
            !isDisabled && !isReadOnly && (state === "default" || state === "loading") &&
            "hover:border-[var(--color-input-border-hover)]",
            // focused border upgrade for default/loading
            focused && (state === "default" || state === "loading") &&
            "border-[var(--color-input-border-focus)]",
            // disabled
            isDisabled && "opacity-40 cursor-not-allowed pointer-events-none",
            // readonly
            isReadOnly && "bg-[var(--color-input-bg-readonly)]",
          )}
          onClick={() => !isDisabled && textareaRef.current?.focus()}
        >
          {/* Leading icon */}
          {leadingIcon && (
            <span
              className={cn(
                ICON_SIZE[size],
                "inline-flex items-center justify-center shrink-0 mt-0.5",
                "[&>svg]:w-full [&>svg]:h-full [&>svg]:block",
                "transition-colors duration-150",
                focused
                  ? "text-[var(--color-icon-brand)]"
                  : "text-[var(--color-icon-muted)]",
              )}
            >
              {leadingIcon}
            </span>
          )}

          {/* Native textarea */}
          <textarea
            ref={(node) => {
              textareaRef.current = node;
              if (typeof forwardedRef === "function") forwardedRef(node);
              else if (forwardedRef) forwardedRef.current = node;
            }}
            id={id}
            name={name}
            autoFocus={autoFocus}
            value={value}
            defaultValue={value !== undefined ? undefined : defaultValue}
            disabled={isDisabled}
            readOnly={isReadOnly}
            maxLength={maxLength}
            rows={minRows}
            onChange={handleChange}
            onFocus={(e) => { setFocused(true); onFocus?.(e); }}
            onBlur={(e) => { setFocused(false); onBlur?.(e); }}
            aria-describedby={describedBy}
            aria-invalid={state === "error" ? "true" : undefined}
            aria-required={required ? "true" : undefined}
            className={cn(
              "block w-full bg-transparent border-none outline-none",
              INPUT_TEXT[size],
              "font-normal leading-relaxed",
              "text-[var(--color-text-primary)]",
              "placeholder:text-[var(--color-text-disabled)]",
              "disabled:cursor-not-allowed",
              isReadOnly && "cursor-default select-all",
              // Extra right padding when corner slot is occupied, so text clears the icon
              cornerKey && TEXTAREA_PR_ICON[size],
            )}
            style={{
              resize: effectiveResize,
              ...(autoResize && { overflowY: "hidden" }),
            }}
            {...rest}
          />

          {/* ── Corner slot (top-right) — state icon or clear button ─── */}
          <div className={cn("absolute pointer-events-none", CORNER_POS[size])}>
            <AnimatePresence mode="wait" initial={false}>
              {cornerKey && cornerNode && (
                <motion.span
                  key={cornerKey}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.12, ease: "easeOut" }}
                  className={cn(
                    "inline-flex items-center",
                    cornerKey === "clear" && "pointer-events-auto",
                  )}
                >
                  {cornerNode}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── Below row: message + char count ──────────────────────────── */}
        {hasBelow && (
          <div className="flex items-start justify-between gap-3 min-h-[1rem]">
            {/* Message — animated swap between helper / error / warning */}
            <div className="flex-1">
              <AnimatePresence mode="wait" initial={false}>
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

            {/* Character count */}
            {maxLength && (
              <Mono
                id={charCountId}
                size="xs"
                className={cn("tabular-nums shrink-0 transition-colors duration-200", charCountColor)}
              >
                {currentValue.length}/{maxLength}
              </Mono>
            )}
          </div>
        )}

      </div>
    );
  },
);

TextArea.displayName = "TextArea";