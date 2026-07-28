// "use client";

// import { forwardRef, useRef, useId, useState, useCallback } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { cn } from "@/lib/utils";
// import { Spinner } from "./Spinner";
// import { Label, Text, Mono } from "./Typography";
// import {
//   RiEyeLine,
//   RiEyeOffLine,
//   RiErrorWarningLine,
//   RiAlertLine,
//   RiCheckLine,
//   RiCloseCircleLine,
// } from "@remixicon/react";

// // ─── Types ────────────────────────────────────────────────────────────────────

// export type InputSize  = "sm" | "md" | "lg";
// export type InputState = "default" | "error" | "warning" | "success" | "loading";

// export interface TextInputProps
//   extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> {
//   size?:           InputSize;
//   /** Validation / async state. Controls border colour, focus ring, trailing icon. */
//   state?:          InputState;
//   label?:          string;
//   required?:       boolean;
//   /** Renders "(optional)" label tag — mutually exclusive with required. */
//   optional?:       boolean;
//   /** Icon node rendered in the leading slot (left-hand side). */
//   leadingIcon?:    React.ReactNode;
//   /** Icon node rendered in the trailing slot — overridden by state icons, password toggle, and clear button. */
//   trailingIcon?:   React.ReactNode;
//   /** Inline text prefix rendered inside the field before the value, e.g. "$", "+1". */
//   prefix?:         string;
//   /** Inline text suffix rendered inside the field after the value, e.g. "USD", ".eth". */
//   suffix?:         string;
//   /** Show a × clear button when the field has a value. */
//   clearable?:      boolean;
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
// }

// // ─── Size maps ────────────────────────────────────────────────────────────────

// const WRAPPER_H: Record<InputSize, string> = {
//   sm: "h-8",
//   md: "h-10",
//   lg: "h-12",
// };

// const WRAPPER_PX: Record<InputSize, string> = {
//   sm: "px-3",
//   md: "px-3.5",
//   lg: "px-4",
// };

// const WRAPPER_GAP: Record<InputSize, string> = {
//   sm: "gap-1.5",
//   md: "gap-2",
//   lg: "gap-2.5",
// };

// const WRAPPER_RADIUS: Record<InputSize, string> = {
//   sm: "rounded-lg",
//   md: "rounded-xl",
//   lg: "rounded-xl",
// };

// const INPUT_TEXT: Record<InputSize, string> = {
//   sm: "text-xs  tracking-normal",
//   md: "text-sm  tracking-tight",
//   lg: "text-base tracking-tight",
// };

// const ICON_SIZE: Record<InputSize, string> = {
//   sm: "w-3   h-3",    // 12px in 32px field — 37.5%
//   md: "w-3.5 h-3.5",  // 14px in 40px field — 35%
//   lg: "w-4   h-4",    // 16px in 48px field — 33%
// };

// // ─── State → border colour ────────────────────────────────────────────────────

// const STATE_BORDER: Record<InputState, string> = {
//   default: "border-[var(--color-input-border)]",
//   loading: "border-[var(--color-input-border)]",
//   error:   "border-[var(--color-input-border-error)]",
//   warning: "border-[var(--color-input-border-warning)]",
//   success: "border-[var(--color-input-border-success)]",
// };

// // ─── Focus ring — concrete rgba strings so Framer can interpolate ─────────────

// const FOCUS_RING: Record<InputState, string> = {
//   default: "0 0 0 2px #0A0A0A, 0 0 0 4px rgba(38,  201, 201, 0.50)",
//   loading: "0 0 0 2px #0A0A0A, 0 0 0 4px rgba(38,  201, 201, 0.50)",
//   error:   "0 0 0 2px #0A0A0A, 0 0 0 4px rgba(239,  68,  68, 0.50)",
//   warning: "0 0 0 2px #0A0A0A, 0 0 0 4px rgba(245, 158,  11, 0.50)",
//   success: "0 0 0 2px #0A0A0A, 0 0 0 4px rgba( 34, 197,  94, 0.50)",
// };

// const FOCUS_RING_OFF = "0 0 0 0px rgba(0,0,0,0), 0 0 0 0px rgba(0,0,0,0)";

// // ─── Below-field message colour ───────────────────────────────────────────────

// const MESSAGE_COLOR: Record<InputState, string> = {
//   default: "text-[var(--color-text-muted)]",
//   loading: "text-[var(--color-text-muted)]",
//   error:   "text-[var(--color-text-danger)]",
//   warning: "text-[var(--color-text-warning)]",
//   success: "text-[var(--color-text-success)]",
// };

// // ─── Label colour on focus ────────────────────────────────────────────────────

// const LABEL_FOCUSED_COLOR: Record<InputState, string> = {
//   default: "text-[var(--color-label-focused)]",
//   loading: "text-[var(--color-text-brand)]",
//   error:   "text-[var(--color-label-error)]",
//   warning: "text-[var(--color-label-warning)]",
//   success: "text-[var(--color-label-success)]",
// };

// // ─── Component ────────────────────────────────────────────────────────────────

// export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
//   function TextInput(
//     {
//       size          = "md",
//       state         = "default",
//       label,
//       required,
//       optional,
//       leadingIcon,
//       trailingIcon,
//       prefix,
//       suffix,
//       clearable     = false,
//       helperText,
//       errorMessage,
//       warningMessage,
//       maxLength,
//       fullWidth     = true,
//       // native attrs we control explicitly
//       id:           externalId,
//       type          = "text",
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
//     const generatedId = useId();
//     const id          = externalId ?? generatedId;
//     const inputRef    = useRef<HTMLInputElement>(null);

//     const [focused,       setFocused]       = useState(false);
//     const [showPassword,  setShowPassword]  = useState(false);

//     // ── Value tracking (char count + clear button) ───────────────────────────
//     const [internalValue, setInternalValue] = useState(
//       typeof defaultValue === "string" ? defaultValue : "",
//     );
//     const currentValue = typeof value === "string" ? value : internalValue;
//     const hasValue     = currentValue.length > 0;

//     const handleChange = useCallback(
//       (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (value === undefined) setInternalValue(e.target.value);
//         onChange?.(e);
//       },
//       [value, onChange],
//     );

//     // ── Clear ────────────────────────────────────────────────────────────────
//     const handleClear = () => {
//       setInternalValue("");
//       if (inputRef.current) {
//         // Trigger React's synthetic onChange by using the native value setter
//         const nativeSetter = Object.getOwnPropertyDescriptor(
//           HTMLInputElement.prototype, "value",
//         )?.set;
//         nativeSetter?.call(inputRef.current, "");
//         inputRef.current.dispatchEvent(new Event("input", { bubbles: true }));
//         inputRef.current.focus();
//       }
//     };

//     // ── Derived flags ────────────────────────────────────────────────────────
//     const isDisabled = !!disabled;
//     const isReadOnly = !!readOnly;
//     const isPassword = type === "password";

//     // ── Trailing slot — priority: pw toggle > loading > state > clear > custom
//     type TrailingKey = "pw" | "loading" | "error" | "warning" | "success" | "clear" | "custom" | null;

//     const trailingKey: TrailingKey =
//       isPassword               ? "pw"
//       : state === "loading"    ? "loading"
//       : state === "error"      ? "error"
//       : state === "warning"    ? "warning"
//       : state === "success"    ? "success"
//       : clearable && hasValue  ? "clear"
//       : trailingIcon           ? "custom"
//       : null;

//     const iconCls = cn(ICON_SIZE[size], "shrink-0");

//     const trailingNode: React.ReactNode =
//       isPassword ? (
//         <button
//           type="button"
//           tabIndex={-1}
//           onClick={() => setShowPassword(v => !v)}
//           className="inline-flex text-[var(--color-icon-muted)] hover:text-[var(--color-icon-secondary)] transition-colors duration-150 focus:outline-none"
//         >
//           {showPassword
//             ? <RiEyeOffLine className={iconCls} />
//             : <RiEyeLine    className={iconCls} />}
//         </button>
//       ) : state === "loading" ? (
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
//       ) : trailingIcon ? (
//         <span
//           className={cn(
//             iconCls,
//             "inline-flex items-center justify-center",
//             "[&>svg]:w-full [&>svg]:h-full [&>svg]:block",
//             "text-[var(--color-icon-muted)]",
//           )}
//         >
//           {trailingIcon}
//         </span>
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

//     // ── Input type ───────────────────────────────────────────────────────────
//     const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

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

//         {/* ── Input wrapper ─────────────────────────────────────────────── */}
//         <motion.div
//           animate={{
//             boxShadow: focused ? FOCUS_RING[state] : FOCUS_RING_OFF,
//           }}
//           transition={{ duration: 0.15, ease: "easeOut" }}
//           className={cn(
//             "relative flex items-center border bg-[var(--color-input-bg)]",
//             "transition-[border-color,background-color] duration-150 ease-out",
//             WRAPPER_H[size],
//             WRAPPER_PX[size],
//             WRAPPER_GAP[size],
//             WRAPPER_RADIUS[size],
//             // border state
//             STATE_BORDER[state],
//             // hover — only for default/loading, not disabled, not readonly
//             !isDisabled && !isReadOnly && (state === "default" || state === "loading") &&
//               "hover:border-[var(--color-input-border-hover)]",
//             // focused border upgrade for default/loading states
//             focused && (state === "default" || state === "loading") &&
//               "border-[var(--color-input-border-focus)]",
//             // disabled
//             isDisabled && "opacity-40 cursor-not-allowed pointer-events-none",
//             // readonly
//             isReadOnly && "bg-[var(--color-input-bg-readonly)]",
//           )}
//           onClick={() => !isDisabled && inputRef.current?.focus()}
//         >
//           {/* Leading icon */}
//           {leadingIcon && (
//             <span
//               className={cn(
//                 ICON_SIZE[size],
//                 "inline-flex items-center justify-center shrink-0",
//                 "[&>svg]:w-full [&>svg]:h-full [&>svg]:block",
//                 "transition-colors duration-150",
//                 focused
//                   ? "text-[var(--color-icon-brand)]"
//                   : "text-[var(--color-icon-muted)]",
//               )}
//             >
//               {leadingIcon}
//             </span>
//           )}

//           {/* Prefix text */}
//           {prefix && (
//             <Text
//               as="span"
//               size={size === "lg" ? "base" : size === "md" ? "sm" : "xs"}
//               color="muted"
//               inline
//               className="shrink-0 select-none"
//             >
//               {prefix}
//             </Text>
//           )}

//           {/* Native input */}
//           <input
//             ref={(node) => {
//               inputRef.current = node;
//               if (typeof forwardedRef === "function") forwardedRef(node);
//               else if (forwardedRef) forwardedRef.current = node;
//             }}
//             id={id}
//             type={resolvedType}
//             value={value}
//             defaultValue={value !== undefined ? undefined : defaultValue}
//             disabled={isDisabled}
//             readOnly={isReadOnly}
//             maxLength={maxLength}
//             onChange={handleChange}
//             onFocus={(e) => { setFocused(true);  onFocus?.(e); }}
//             onBlur={(e)  => { setFocused(false); onBlur?.(e);  }}
//             className={cn(
//               "flex-1 min-w-0 bg-transparent border-none outline-none",
//               INPUT_TEXT[size],
//               "font-normal",
//               "text-[var(--color-text-primary)]",
//               "placeholder:text-[var(--color-text-disabled)]",
//               "disabled:cursor-not-allowed",
//               isReadOnly && "cursor-default select-all",
//             )}
//             {...rest}
//           />

//           {/* Suffix text */}
//           {suffix && (
//             <Text
//               as="span"
//               size={size === "lg" ? "base" : size === "md" ? "sm" : "xs"}
//               color="muted"
//               inline
//               className="shrink-0 select-none"
//             >
//               {suffix}
//             </Text>
//           )}

//           {/* Trailing slot — animated swap */}
//           <AnimatePresence mode="wait" initial={false}>
//             {trailingKey && trailingNode && (
//               <motion.span
//                 key={trailingKey}
//                 initial={{ opacity: 0, scale: 0.6 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.6 }}
//                 transition={{ duration: 0.12, ease: "easeOut" }}
//                 className="inline-flex items-center shrink-0"
//               >
//                 {trailingNode}
//               </motion.span>
//             )}
//           </AnimatePresence>
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

// TextInput.displayName = "TextInput";



"use client";

import { forwardRef, useRef, useId, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Spinner } from "./Spinner";
import { Label, Text, Mono } from "./Typography";
import {
  RiEyeLine,
  RiEyeOffLine,
  RiErrorWarningLine,
  RiAlertLine,
  RiCheckLine,
  RiCloseCircleLine,
} from "@remixicon/react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type InputSize = "sm" | "md" | "lg";
export type InputState = "default" | "error" | "warning" | "success" | "loading";

export interface TextInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> {
  size?: InputSize;
  /** Validation / async state. Controls border colour, focus ring, trailing icon. */
  state?: InputState;
  label?: string;
  required?: boolean;
  /** Renders "(optional)" label tag — mutually exclusive with required. */
  optional?: boolean;
  /** Icon node rendered in the leading slot (left-hand side). */
  leadingIcon?: React.ReactNode;
  /** Icon node rendered in the trailing slot — overridden by state icons, password toggle, and clear button. */
  trailingIcon?: React.ReactNode;
  /** Inline text prefix rendered inside the field before the value, e.g. "$", "+1". */
  prefix?: string;
  /** Inline text suffix rendered inside the field after the value, e.g. "USD", ".eth". */
  suffix?: string;
  /** Show a × clear button when the field has a value. */
  clearable?: boolean;
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
  /** Name attribute for form submission. */
  name?: string;
  /** Whether the input should autofocus when mounted. */
  autoFocus?: boolean;
}

// ─── Size maps ────────────────────────────────────────────────────────────────

const WRAPPER_H: Record<InputSize, string> = {
  sm: "h-8",
  md: "h-10",
  lg: "h-12",
};

const WRAPPER_PX: Record<InputSize, string> = {
  sm: "px-3",
  md: "px-3.5",
  lg: "px-4",
};

const WRAPPER_GAP: Record<InputSize, string> = {
  sm: "gap-1.5",
  md: "gap-2",
  lg: "gap-2.5",
};

const WRAPPER_RADIUS: Record<InputSize, string> = {
  sm: "rounded-lg",
  md: "rounded-xl",
  lg: "rounded-xl",
};

const INPUT_TEXT: Record<InputSize, string> = {
  sm: "text-xs  tracking-normal",
  md: "text-sm  tracking-tight",
  lg: "text-base tracking-tight",
};

const ICON_SIZE: Record<InputSize, string> = {
  sm: "w-3   h-3",    // 12px in 32px field — 37.5%
  md: "w-3.5 h-3.5",  // 14px in 40px field — 35%
  lg: "w-4   h-4",    // 16px in 48px field — 33%
};

// ─── State → border colour ────────────────────────────────────────────────────

const STATE_BORDER: Record<InputState, string> = {
  default: "border-[var(--color-input-border)]",
  loading: "border-[var(--color-input-border)]",
  error: "border-[var(--color-input-border-error)]",
  warning: "border-[var(--color-input-border-warning)]",
  success: "border-[var(--color-input-border-success)]",
};

// ─── Focus ring — concrete rgba strings so Framer can interpolate ─────────────

const FOCUS_RING: Record<InputState, string> = {
  default: "0 0 0 2px #0A0A0A, 0 0 0 4px rgba(38,  201, 201, 0.50)",
  loading: "0 0 0 2px #0A0A0A, 0 0 0 4px rgba(38,  201, 201, 0.50)",
  error: "0 0 0 2px #0A0A0A, 0 0 0 4px rgba(239,  68,  68, 0.50)",
  warning: "0 0 0 2px #0A0A0A, 0 0 0 4px rgba(245, 158,  11, 0.50)",
  success: "0 0 0 2px #0A0A0A, 0 0 0 4px rgba( 34, 197,  94, 0.50)",
};

const FOCUS_RING_OFF = "0 0 0 0px rgba(0,0,0,0), 0 0 0 0px rgba(0,0,0,0)";

// ─── Below-field message colour ───────────────────────────────────────────────

const MESSAGE_COLOR: Record<InputState, string> = {
  default: "text-[var(--color-text-muted)]",
  loading: "text-[var(--color-text-muted)]",
  error: "text-[var(--color-text-danger)]",
  warning: "text-[var(--color-text-warning)]",
  success: "text-[var(--color-text-success)]",
};

// ─── Label colour on focus ────────────────────────────────────────────────────

const LABEL_FOCUSED_COLOR: Record<InputState, string> = {
  default: "text-[var(--color-label-focused)]",
  loading: "text-[var(--color-text-brand)]",
  error: "text-[var(--color-label-error)]",
  warning: "text-[var(--color-label-warning)]",
  success: "text-[var(--color-label-success)]",
};

// ─── Component ────────────────────────────────────────────────────────────────

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput(
    {
      size = "md",
      state = "default",
      label,
      required,
      optional,
      leadingIcon,
      trailingIcon,
      prefix,
      suffix,
      clearable = false,
      helperText,
      errorMessage,
      warningMessage,
      maxLength,
      fullWidth = true,
      name,
      autoFocus = false,
      // native attrs we control explicitly
      id: externalId,
      type = "text",
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
    const inputRef = useRef<HTMLInputElement>(null);

    const [focused, setFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // ── Value tracking (char count + clear button) ───────────────────────────
    const [internalValue, setInternalValue] = useState(
      typeof defaultValue === "string" ? defaultValue : "",
    );
    const currentValue = typeof value === "string" ? value : internalValue;
    const hasValue = currentValue.length > 0;

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (value === undefined) setInternalValue(e.target.value);
        onChange?.(e);
      },
      [value, onChange],
    );

    // ── Clear ────────────────────────────────────────────────────────────────
    const handleClear = () => {
      setInternalValue("");
      if (inputRef.current) {
        // Trigger React's synthetic onChange by using the native value setter
        const nativeSetter = Object.getOwnPropertyDescriptor(
          HTMLInputElement.prototype, "value",
        )?.set;
        nativeSetter?.call(inputRef.current, "");
        inputRef.current.dispatchEvent(new Event("input", { bubbles: true }));
        inputRef.current.focus();
      }
    };

    // ── Derived flags ────────────────────────────────────────────────────────
    const isDisabled = !!disabled;
    const isReadOnly = !!readOnly;
    const isPassword = type === "password";

    // ── Trailing slot — priority: pw toggle > loading > state > clear > custom
    type TrailingKey = "pw" | "loading" | "error" | "warning" | "success" | "clear" | "custom" | null;

    const trailingKey: TrailingKey =
      isPassword ? "pw"
        : state === "loading" ? "loading"
          : state === "error" ? "error"
            : state === "warning" ? "warning"
              : state === "success" ? "success"
                : clearable && hasValue ? "clear"
                  : trailingIcon ? "custom"
                    : null;

    const iconCls = cn(ICON_SIZE[size], "shrink-0");

    const trailingNode: React.ReactNode =
      isPassword ? (
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShowPassword(v => !v)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          aria-pressed={showPassword}
          className="inline-flex text-[var(--color-icon-muted)] hover:text-[var(--color-icon-secondary)] transition-colors duration-150 focus:outline-none"
        >
          {showPassword
            ? <RiEyeOffLine className={iconCls} />
            : <RiEyeLine className={iconCls} />}
        </button>
      ) : state === "loading" ? (
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
          aria-label="Clear input"
          className="inline-flex text-[var(--color-icon-muted)] hover:text-[var(--color-icon-secondary)] transition-colors duration-150 focus:outline-none"
        >
          <RiCloseCircleLine className={iconCls} />
        </button>
      ) : trailingIcon ? (
        <span
          className={cn(
            iconCls,
            "inline-flex items-center justify-center",
            "[&>svg]:w-full [&>svg]:h-full [&>svg]:block",
            "text-[var(--color-icon-muted)]",
          )}
        >
          {trailingIcon}
        </span>
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

    // ── Input type ───────────────────────────────────────────────────────────
    const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

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

        {/* ── Input wrapper ─────────────────────────────────────────────── */}
        <motion.div
          animate={{
            boxShadow: focused ? FOCUS_RING[state] : FOCUS_RING_OFF,
          }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className={cn(
            "relative flex items-center border bg-[var(--color-input-bg)]",
            "transition-[border-color,background-color] duration-150 ease-out",
            WRAPPER_H[size],
            WRAPPER_PX[size],
            WRAPPER_GAP[size],
            WRAPPER_RADIUS[size],
            // border state
            STATE_BORDER[state],
            // hover — only for default/loading, not disabled, not readonly
            !isDisabled && !isReadOnly && (state === "default" || state === "loading") &&
            "hover:border-[var(--color-input-border-hover)]",
            // focused border upgrade for default/loading states
            focused && (state === "default" || state === "loading") &&
            "border-[var(--color-input-border-focus)]",
            // disabled
            isDisabled && "opacity-40 cursor-not-allowed pointer-events-none",
            // readonly
            isReadOnly && "bg-[var(--color-input-bg-readonly)]",
          )}
          onClick={() => !isDisabled && inputRef.current?.focus()}
        >
          {/* Leading icon */}
          {leadingIcon && (
            <span
              className={cn(
                ICON_SIZE[size],
                "inline-flex items-center justify-center shrink-0",
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

          {/* Prefix text */}
          {prefix && (
            <Text
              as="span"
              size={size === "lg" ? "base" : size === "md" ? "sm" : "xs"}
              color="muted"
              inline
              className="shrink-0 select-none"
            >
              {prefix}
            </Text>
          )}

          {/* Native input */}
          <input
            ref={(node) => {
              inputRef.current = node;
              if (typeof forwardedRef === "function") forwardedRef(node);
              else if (forwardedRef) forwardedRef.current = node;
            }}
            id={id}
            type={resolvedType}
            name={name}
            autoFocus={autoFocus}
            value={value}
            defaultValue={value !== undefined ? undefined : defaultValue}
            disabled={isDisabled}
            readOnly={isReadOnly}
            maxLength={maxLength}
            onChange={handleChange}
            onFocus={(e) => { setFocused(true); onFocus?.(e); }}
            onBlur={(e) => { setFocused(false); onBlur?.(e); }}
            aria-describedby={describedBy}
            aria-invalid={state === "error" ? "true" : undefined}
            aria-required={required ? "true" : undefined}
            className={cn(
              "flex-1 min-w-0 bg-transparent border-none outline-none",
              INPUT_TEXT[size],
              "font-normal",
              "text-[var(--color-text-primary)]",
              "placeholder:text-[var(--color-text-disabled)]",
              "disabled:cursor-not-allowed",
              isReadOnly && "cursor-default select-all",
            )}
            {...rest}
          />

          {/* Suffix text */}
          {suffix && (
            <Text
              as="span"
              size={size === "lg" ? "base" : size === "md" ? "sm" : "xs"}
              color="muted"
              inline
              className="shrink-0 select-none"
            >
              {suffix}
            </Text>
          )}

          {/* Trailing slot — animated swap */}
          <AnimatePresence mode="wait" initial={false}>
            {trailingKey && trailingNode && (
              <motion.span
                key={trailingKey}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.12, ease: "easeOut" }}
                className="inline-flex items-center shrink-0"
              >
                {trailingNode}
              </motion.span>
            )}
          </AnimatePresence>
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

TextInput.displayName = "TextInput";