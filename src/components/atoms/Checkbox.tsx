// "use client";

// import { forwardRef, useId, useRef, useEffect, useState, useCallback } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { cn } from "@/lib/utils";
// import { Label, Text } from "./Typography";

// // ─── Types ────────────────────────────────────────────────────────────────────

// export type CheckboxSize  = "sm" | "md" | "lg";
// export type CheckboxState = "default" | "error" | "warning" | "success";

// export interface CheckboxProps
//   extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
//   size?:          CheckboxSize;
//   state?:         CheckboxState;
//   /** Label text rendered beside the box. */
//   label?:         string;
//   /** Muted secondary line rendered below the label. */
//   description?:   string;
//   /** Renders a dash (–) instead of a checkmark — for partial/mixed selection. */
//   indeterminate?: boolean;
// }

// export interface CheckboxGroupProps {
//   label?:          string;
//   required?:       boolean;
//   optional?:       boolean;
//   helperText?:     string;
//   errorMessage?:   string;
//   warningMessage?: string;
//   state?:          CheckboxState;
//   direction?:      "vertical" | "horizontal";
//   children:        React.ReactNode;
//   className?:      string;
// }

// // ─── Size maps ────────────────────────────────────────────────────────────────

// const BOX_SIZE: Record<CheckboxSize, string> = {
//   sm: "w-4 h-4",
//   md: "w-[18px] h-[18px]",
//   lg: "w-5 h-5",
// };

// const BOX_RADIUS: Record<CheckboxSize, string> = {
//   sm: "rounded",
//   md: "rounded-md",
//   lg: "rounded-md",
// };

// // Top offset of the box when description is present — aligns box center with
// // the cap-height of the first label line instead of the container top.
// const BOX_MT_WITH_DESC: Record<CheckboxSize, string> = {
//   sm: "mt-[3px]",
//   md: "mt-[3px]",
//   lg: "mt-[4px]",
// };

// const LABEL_SIZE: Record<CheckboxSize, string> = {
//   sm: "text-xs  tracking-normal",
//   md: "text-sm  tracking-tight",
//   lg: "text-base tracking-tight",
// };

// const ITEM_GAP: Record<CheckboxSize, string> = {
//   sm: "gap-2",
//   md: "gap-2.5",
//   lg: "gap-3",
// };

// // ─── State colour maps ────────────────────────────────────────────────────────

// const BOX_BORDER_UNCHECKED: Record<CheckboxState, string> = {
//   default: "border-[var(--color-input-border)]",
//   error:   "border-[var(--color-input-border-error)]",
//   warning: "border-[var(--color-input-border-warning)]",
//   success: "border-[var(--color-input-border-success)]",
// };

// const BOX_FILLED: Record<CheckboxState, string> = {
//   default: "bg-[var(--color-control-fill-brand)]   border-[var(--color-control-fill-brand)]",
//   error:   "bg-[var(--color-control-fill-danger)]  border-[var(--color-control-fill-danger)]",
//   warning: "bg-[var(--color-control-fill-warning)] border-[var(--color-control-fill-warning)]",
//   success: "bg-[var(--color-control-fill-success)] border-[var(--color-control-fill-success)]",
// };

// // ─── Hover tint — previews the fill colour at low opacity ────────────────────
// // Applied as an overlay so it doesn't interfere with the CSS border transition.

// const HOVER_TINT: Record<CheckboxState, string> = {
//   default: "var(--color-control-tint-brand)",
//   error:   "var(--color-control-tint-danger)",
//   warning: "var(--color-control-tint-warning)",
//   success: "var(--color-control-tint-success)",
// };

// // ─── Focus rings ──────────────────────────────────────────────────────────────
// // Concrete rgba strings are required — Framer Motion cannot interpolate CSS
// // custom properties inside box-shadow strings. The #0A0A0A offset shadow colour
// // matches --color-surface-page; the glow colours match --color-control-fill-*.

// const FOCUS_RING: Record<CheckboxState, string> = {
//   default: "0 0 0 2px #0A0A0A, 0 0 0 4px rgba(38,  201, 201, 0.50)",
//   error:   "0 0 0 2px #0A0A0A, 0 0 0 4px rgba(239,  68,  68, 0.50)",
//   warning: "0 0 0 2px #0A0A0A, 0 0 0 4px rgba(245, 158,  11, 0.50)",
//   success: "0 0 0 2px #0A0A0A, 0 0 0 4px rgba( 34, 197,  94, 0.50)",
// };

// const FOCUS_RING_OFF = "0 0 0 0px rgba(0,0,0,0), 0 0 0 0px rgba(0,0,0,0)";

// // ─── Icon pixel sizes ─────────────────────────────────────────────────────────

// const ICON_PX: Record<CheckboxSize, number> = { sm: 9, md: 10, lg: 11 };

// // ─── Animated checkmark ───────────────────────────────────────────────────────

// function CheckIcon({ size }: { size: CheckboxSize }) {
//   const px = ICON_PX[size];
//   return (
//     <motion.svg
//       width={px} height={px} viewBox="0 0 10 8" fill="none"
//       initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//       className="absolute"
//     >
//       <motion.path
//         d="M1 4L3.5 7L9 1"
//         stroke="var(--color-icon-on-fill)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
//         initial={{ pathLength: 0 }}
//         animate={{ pathLength: 1 }}
//         exit={{ pathLength: 0 }}
//         transition={{ duration: 0.18, ease: [0, 0, 0.2, 1] }}
//       />
//     </motion.svg>
//   );
// }

// // ─── Animated dash (indeterminate) ───────────────────────────────────────────

// function DashIcon({ size }: { size: CheckboxSize }) {
//   const px = ICON_PX[size];
//   return (
//     <motion.svg
//       width={px} height={2} viewBox="0 0 10 2" fill="none"
//       initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//       className="absolute"
//     >
//       <motion.path
//         d="M1 1H9"
//         stroke="var(--color-icon-on-fill)" strokeWidth={2} strokeLinecap="round"
//         initial={{ pathLength: 0 }}
//         animate={{ pathLength: 1 }}
//         exit={{ pathLength: 0 }}
//         transition={{ duration: 0.14, ease: [0, 0, 0.2, 1] }}
//       />
//     </motion.svg>
//   );
// }

// // ─── Ghost icon — hover preview at low opacity ────────────────────────────────
// // Shows the checkmark (or dash for indeterminate) at ~25% opacity on hover,
// // giving a visual hint of what will happen when clicked.

// function GhostCheckIcon({ size }: { size: CheckboxSize }) {
//   const px = ICON_PX[size];
//   return (
//     <motion.svg
//       width={px} height={px} viewBox="0 0 10 8" fill="none"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 0.28 }}
//       exit={{ opacity: 0 }}
//       transition={{ duration: 0.1 }}
//       className="absolute"
//     >
//       {/* Static path — no pathLength animation; ghost just fades in fully drawn */}
//       <path
//         d="M1 4L3.5 7L9 1"
//         stroke="var(--color-icon-on-fill)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
//       />
//     </motion.svg>
//   );
// }

// function GhostDashIcon({ size }: { size: CheckboxSize }) {
//   const px = ICON_PX[size];
//   return (
//     <motion.svg
//       width={px} height={2} viewBox="0 0 10 2" fill="none"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 0.28 }}
//       exit={{ opacity: 0 }}
//       transition={{ duration: 0.1 }}
//       className="absolute"
//     >
//       <path d="M1 1H9" stroke="var(--color-icon-on-fill)" strokeWidth={2} strokeLinecap="round" />
//     </motion.svg>
//   );
// }

// // ─── Checkbox ─────────────────────────────────────────────────────────────────

// export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
//   function Checkbox(
//     {
//       size          = "md",
//       state         = "default",
//       label,
//       description,
//       indeterminate = false,
//       checked,
//       defaultChecked,
//       disabled,
//       onChange,
//       id:           externalId,
//       className,
//       ...rest
//     },
//     forwardedRef,
//   ) {
//     const generatedId = useId();
//     const id          = externalId ?? generatedId;
//     const inputRef    = useRef<HTMLInputElement | null>(null);

//     const [focused,  setFocused]  = useState(false);
//     const [hovered,  setHovered]  = useState(false);

//     // ── Controlled / uncontrolled ─────────────────────────────────────────────
//     const isControlled = checked !== undefined;
//     const [internalChecked, setInternalChecked] = useState(defaultChecked ?? false);
//     const isChecked  = isControlled ? !!checked : internalChecked;
//     const isDisabled = !!disabled;
//     const isFilled   = isChecked || indeterminate;

//     // ── Sync indeterminate to native input ────────────────────────────────────
//     useEffect(() => {
//       if (inputRef.current) inputRef.current.indeterminate = indeterminate;
//     }, [indeterminate]);

//     const handleChange = useCallback(
//       (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (!isControlled) setInternalChecked(e.target.checked);
//         onChange?.(e);
//       },
//       [isControlled, onChange],
//     );

//     // When description is present, align box to first-line cap-height (items-start +
//     // small top offset). Without description, center the box with the single text line.
//     const hasDesc      = !!description;
//     const outerAlign   = hasDesc ? "items-start" : "items-center";
//     const boxTopOffset = hasDesc ? BOX_MT_WITH_DESC[size] : "";

//     // Ghost appears when: hovering + unchecked + not disabled
//     const showGhost = hovered && !isFilled && !isDisabled;

//     return (
//       <div
//         className={cn("inline-flex", outerAlign, ITEM_GAP[size], className)}
//         onMouseEnter={() => !isDisabled && setHovered(true)}
//         onMouseLeave={() => setHovered(false)}
//       >
//         {/* ── Box + hidden input ───────────────────────────────────────────── */}
//         <div className={cn("relative shrink-0", boxTopOffset)}>

//           {/* Native input — accessible, visually hidden */}
//           <input
//             ref={(node) => {
//               inputRef.current = node;
//               if (typeof forwardedRef === "function") forwardedRef(node);
//               else if (forwardedRef) forwardedRef.current = node;
//             }}
//             id={id}
//             type="checkbox"
//             checked={isControlled ? isChecked : undefined}
//             defaultChecked={!isControlled ? defaultChecked : undefined}
//             disabled={disabled}
//             onChange={handleChange}
//             onFocus={() => setFocused(true)}
//             onBlur={() => setFocused(false)}
//             aria-checked={indeterminate ? "mixed" : isChecked}
//             className="sr-only"
//             {...rest}
//           />

//           {/* Styled box */}
//           <motion.label
//             htmlFor={id}
//             animate={{
//               boxShadow: focused ? FOCUS_RING[state] : FOCUS_RING_OFF,
//               scale: hovered && !isDisabled ? 1.06 : 1,
//             }}
//             whileTap={!isDisabled ? { scale: 0.82 } : undefined}
//             transition={{
//               boxShadow: { duration: 0.15, ease: "easeOut" },
//               scale:     { type: "spring", stiffness: 500, damping: 28, mass: 0.6 },
//             }}
//             className={cn(
//               "relative flex cursor-pointer select-none items-center justify-center border",
//               "transition-[background-color,border-color] duration-150 ease-out",
//               BOX_SIZE[size],
//               BOX_RADIUS[size],
//               isFilled
//                 ? BOX_FILLED[state]
//                 : cn("bg-[var(--color-input-bg)]", BOX_BORDER_UNCHECKED[state]),
//               isDisabled && "cursor-not-allowed opacity-40",
//             )}
//           >
//             {/* Hover tint — a state-coloured bloom that previews the fill */}
//             <AnimatePresence>
//               {showGhost && (
//                 <motion.span
//                   key="tint"
//                   className={cn("absolute inset-0 pointer-events-none", BOX_RADIUS[size])}
//                   style={{ backgroundColor: HOVER_TINT[state] }}
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                   transition={{ duration: 0.1 }}
//                 />
//               )}
//             </AnimatePresence>

//             {/* Real check / dash */}
//             <AnimatePresence mode="wait" initial={false}>
//               {isChecked && !indeterminate && <CheckIcon key="check" size={size} />}
//               {indeterminate                 && <DashIcon  key="dash"  size={size} />}
//             </AnimatePresence>

//             {/* Ghost preview — shown on hover before clicking */}
//             <AnimatePresence>
//               {showGhost && !indeterminate && <GhostCheckIcon key="ghost-check" size={size} />}
//               {showGhost &&  indeterminate && <GhostDashIcon  key="ghost-dash"  size={size} />}
//             </AnimatePresence>
//           </motion.label>
//         </div>

//         {/* ── Label + description ──────────────────────────────────────────── */}
//         {(label || description) && (
//           <label
//             htmlFor={id}
//             className={cn(
//               "flex cursor-pointer select-none flex-col gap-0.5",
//               isDisabled && "cursor-not-allowed opacity-40",
//             )}
//           >
//             {label && (
//               <span className={cn(LABEL_SIZE[size], "font-medium text-[var(--color-text-primary)] leading-none")}>
//                 {label}
//               </span>
//             )}
//             {description && (
//               <span className="text-xs leading-snug tracking-tight text-[var(--color-text-muted)]">
//                 {description}
//               </span>
//             )}
//           </label>
//         )}
//       </div>
//     );
//   },
// );
// Checkbox.displayName = "Checkbox";

// // ─── CheckboxIndicator ────────────────────────────────────────────────────────
// // Pure visual element: styled box + animated check/dash mark. No native input,
// // no label, no click handler. Use this when you need to compose a checkbox's
// // visual state into another component (e.g. DropdownItem multi-select).

// export interface CheckboxIndicatorProps {
//   checked?:       boolean;
//   indeterminate?: boolean;
//   state?:         CheckboxState;
//   size?:          CheckboxSize;
//   className?:     string;
// }

// export function CheckboxIndicator({
//   checked       = false,
//   indeterminate = false,
//   state         = "default",
//   size          = "sm",
//   className,
// }: CheckboxIndicatorProps) {
//   const isFilled = checked || indeterminate;
//   return (
//     <div
//       aria-hidden="true"
//       className={cn(
//         "relative flex shrink-0 items-center justify-center border",
//         "transition-[background-color,border-color] duration-150 ease-out",
//         BOX_SIZE[size],
//         BOX_RADIUS[size],
//         isFilled
//           ? BOX_FILLED[state]
//           : cn("bg-[var(--color-input-bg)]", BOX_BORDER_UNCHECKED[state]),
//         className,
//       )}
//     >
//       <AnimatePresence mode="wait" initial={false}>
//         {checked && !indeterminate && <CheckIcon key="check" size={size} />}
//         {indeterminate                 && <DashIcon  key="dash"  size={size} />}
//       </AnimatePresence>
//     </div>
//   );
// }

// // ─── CheckboxGroup ────────────────────────────────────────────────────────────

// const GROUP_MSG_COLOR: Record<CheckboxState, string> = {
//   default: "text-[var(--color-text-muted)]",
//   error:   "text-[var(--color-label-error)]",
//   warning: "text-[var(--color-label-warning)]",
//   success: "text-[var(--color-label-success)]",
// };

// export function CheckboxGroup({
//   label,
//   required,
//   optional,
//   helperText,
//   errorMessage,
//   warningMessage,
//   state     = "default",
//   direction = "vertical",
//   children,
//   className,
// }: CheckboxGroupProps) {
//   const message =
//     state === "error"   ? errorMessage
//     : state === "warning" ? warningMessage
//     : helperText;

//   return (
//     <div role="group" className={cn("flex flex-col gap-2", className)}>

//       {label && (
//         <div className="flex items-baseline justify-between gap-2">
//           <Label
//             size="xs"
//             weight="medium"
//             className="text-[var(--color-label-default)] select-none cursor-default"
//             required={required}
//           >
//             {label}
//           </Label>
//           {optional && !required && (
//             <Text as="span" size="xs" color="disabled" inline className="shrink-0 leading-none">
//               optional
//             </Text>
//           )}
//         </div>
//       )}

//       <div
//         className={cn(
//           direction === "horizontal"
//             ? "flex flex-wrap gap-x-6 gap-y-3"
//             : "flex flex-col gap-3",
//         )}
//       >
//         {children}
//       </div>

//       {message && (
//         <Text as="p" size="xs" className={cn("leading-snug", GROUP_MSG_COLOR[state])}>
//           {message}
//         </Text>
//       )}
//     </div>
//   );
// }


"use client";

import { forwardRef, useId, useRef, useEffect, useState, useCallback, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Label, Text } from "./Typography";

// ─── Types ────────────────────────────────────────────────────────────────────

export type CheckboxSize = "sm" | "md" | "lg";
export type CheckboxState = "default" | "error" | "warning" | "success";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  size?: CheckboxSize;
  state?: CheckboxState;
  /** Label text rendered beside the box. */
  label?: string;
  /** Muted secondary line rendered below the label. */
  description?: string;
  /** Renders a dash (–) instead of a checkmark — for partial/mixed selection. */
  indeterminate?: boolean;
  /** Name attribute for form submission. */
  name?: string;
  /** Whether the checkbox should autofocus when mounted. */
  autoFocus?: boolean;
}

export interface CheckboxGroupProps {
  label?: string;
  required?: boolean;
  optional?: boolean;
  helperText?: string;
  errorMessage?: string;
  warningMessage?: string;
  state?: CheckboxState;
  direction?: "vertical" | "horizontal";
  children: React.ReactNode;
  className?: string;
}

// ─── Context for group message and state ──────────────────────────────────────

interface CheckboxGroupContextValue {
  messageId?: string;
  groupState?: CheckboxState;
  required?: boolean;
}

const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(null);

// ─── Size maps ────────────────────────────────────────────────────────────────

const BOX_SIZE: Record<CheckboxSize, string> = {
  sm: "w-4 h-4",
  md: "w-[18px] h-[18px]",
  lg: "w-5 h-5",
};

const BOX_RADIUS: Record<CheckboxSize, string> = {
  sm: "rounded",
  md: "rounded-md",
  lg: "rounded-md",
};

// Top offset of the box when description is present — aligns box center with
// the cap-height of the first label line instead of the container top.
const BOX_MT_WITH_DESC: Record<CheckboxSize, string> = {
  sm: "mt-[3px]",
  md: "mt-[3px]",
  lg: "mt-[4px]",
};

const LABEL_SIZE: Record<CheckboxSize, string> = {
  sm: "text-xs  tracking-normal",
  md: "text-sm  tracking-tight",
  lg: "text-base tracking-tight",
};

const ITEM_GAP: Record<CheckboxSize, string> = {
  sm: "gap-2",
  md: "gap-2.5",
  lg: "gap-3",
};

// ─── State colour maps ────────────────────────────────────────────────────────

const BOX_BORDER_UNCHECKED: Record<CheckboxState, string> = {
  default: "border-[var(--color-input-border)]",
  error: "border-[var(--color-input-border-error)]",
  warning: "border-[var(--color-input-border-warning)]",
  success: "border-[var(--color-input-border-success)]",
};

const BOX_FILLED: Record<CheckboxState, string> = {
  default: "bg-[var(--color-control-fill-brand)]   border-[var(--color-control-fill-brand)]",
  error: "bg-[var(--color-control-fill-danger)]  border-[var(--color-control-fill-danger)]",
  warning: "bg-[var(--color-control-fill-warning)] border-[var(--color-control-fill-warning)]",
  success: "bg-[var(--color-control-fill-success)] border-[var(--color-control-fill-success)]",
};

// ─── Hover tint — previews the fill colour at low opacity ────────────────────
// Applied as an overlay so it doesn't interfere with the CSS border transition.

const HOVER_TINT: Record<CheckboxState, string> = {
  default: "var(--color-control-tint-brand)",
  error: "var(--color-control-tint-danger)",
  warning: "var(--color-control-tint-warning)",
  success: "var(--color-control-tint-success)",
};

// ─── Focus rings ──────────────────────────────────────────────────────────────
// Concrete rgba strings are required — Framer Motion cannot interpolate CSS
// custom properties inside box-shadow strings. The #0A0A0A offset shadow colour
// matches --color-surface-page; the glow colours match --color-control-fill-*.

const FOCUS_RING: Record<CheckboxState, string> = {
  default: "0 0 0 2px #0A0A0A, 0 0 0 4px rgba(38,  201, 201, 0.50)",
  error: "0 0 0 2px #0A0A0A, 0 0 0 4px rgba(239,  68,  68, 0.50)",
  warning: "0 0 0 2px #0A0A0A, 0 0 0 4px rgba(245, 158,  11, 0.50)",
  success: "0 0 0 2px #0A0A0A, 0 0 0 4px rgba( 34, 197,  94, 0.50)",
};

const FOCUS_RING_OFF = "0 0 0 0px rgba(0,0,0,0), 0 0 0 0px rgba(0,0,0,0)";

// ─── Icon pixel sizes ─────────────────────────────────────────────────────────

const ICON_PX: Record<CheckboxSize, number> = { sm: 9, md: 10, lg: 11 };

// ─── Animated checkmark ───────────────────────────────────────────────────────

function CheckIcon({ size }: { size: CheckboxSize }) {
  const px = ICON_PX[size];
  return (
    <motion.svg
      width={px} height={px} viewBox="0 0 10 8" fill="none"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="absolute"
    >
      <motion.path
        d="M1 4.5L3.5 7.2L9 1.5"
        stroke="var(--color-icon-on-fill)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        exit={{ pathLength: 0 }}
        transition={{ duration: 0.18, ease: [0, 0, 0.2, 1] }}
      />
    </motion.svg>
  );
}

// ─── Animated dash (indeterminate) ───────────────────────────────────────────

function DashIcon({ size }: { size: CheckboxSize }) {
  const px = ICON_PX[size];
  return (
    <motion.svg
      width={px} height={2} viewBox="0 0 10 2" fill="none"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="absolute"
    >
      <motion.path
        d="M1 1H9"
        stroke="var(--color-icon-on-fill)" strokeWidth={2} strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        exit={{ pathLength: 0 }}
        transition={{ duration: 0.14, ease: [0, 0, 0.2, 1] }}
      />
    </motion.svg>
  );
}

// ─── Ghost icon — hover preview at low opacity ────────────────────────────────
// Shows the checkmark (or dash for indeterminate) at ~25% opacity on hover,
// giving a visual hint of what will happen when clicked.

function GhostCheckIcon({ size }: { size: CheckboxSize }) {
  const px = ICON_PX[size];
  return (
    <motion.svg
      width={px} height={px} viewBox="0 0 10 8" fill="none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.28 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.1 }}
      className="absolute"
    >
      {/* Static path — no pathLength animation; ghost just fades in fully drawn */}
      <path
        d="M1 4.5L3.5 7.2L9 1.5"
        stroke="var(--color-icon-on-fill)" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
      />
    </motion.svg>
  );
}

function GhostDashIcon({ size }: { size: CheckboxSize }) {
  const px = ICON_PX[size];
  return (
    <motion.svg
      width={px} height={2} viewBox="0 0 10 2" fill="none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.28 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.1 }}
      className="absolute"
    >
      <path d="M1 1H9" stroke="var(--color-icon-on-fill)" strokeWidth={2} strokeLinecap="round" />
    </motion.svg>
  );
}

// ─── Checkbox ─────────────────────────────────────────────────────────────────

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    {
      size = "md",
      state: stateProp,
      label,
      description,
      indeterminate = false,
      checked,
      defaultChecked,
      disabled,
      onChange,
      id: externalId,
      name,
      autoFocus,
      className,
      ...rest
    },
    forwardedRef,
  ) {
    const groupCtx = useContext(CheckboxGroupContext);

    // Use group state if provided, otherwise use prop
    const effectiveState = stateProp ?? groupCtx?.groupState ?? "default";
    const required = groupCtx?.required ?? false;
    const messageId = groupCtx?.messageId;

    const generatedId = useId();
    const id = externalId ?? generatedId;
    const inputRef = useRef<HTMLInputElement | null>(null);

    const [focused, setFocused] = useState(false);
    const [hovered, setHovered] = useState(false);

    // ── Controlled / uncontrolled ─────────────────────────────────────────────
    const isControlled = checked !== undefined;
    const [internalChecked, setInternalChecked] = useState(defaultChecked ?? false);
    const isChecked = isControlled ? !!checked : internalChecked;
    const isDisabled = !!disabled;
    const isFilled = isChecked || indeterminate;

    // ── Sync indeterminate to native input ────────────────────────────────────
    useEffect(() => {
      if (inputRef.current) inputRef.current.indeterminate = indeterminate;
    }, [indeterminate]);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isControlled) setInternalChecked(e.target.checked);
        onChange?.(e);
      },
      [isControlled, onChange],
    );

    // When description is present, align box to first-line cap-height (items-start +
    // small top offset). Without description, center the box with the single text line.
    const hasDesc = !!description;
    const outerAlign = hasDesc ? "items-start" : "items-center";
    const boxTopOffset = hasDesc ? BOX_MT_WITH_DESC[size] : "";

    // Ghost appears when: hovering + unchecked + not disabled
    const showGhost = hovered && !isFilled && !isDisabled;

    return (
      <div
        className={cn("inline-flex", outerAlign, ITEM_GAP[size], className)}
        onMouseEnter={() => !isDisabled && setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* ── Box + hidden input ───────────────────────────────────────────── */}
        <div className={cn("relative shrink-0", boxTopOffset)}>

          {/* Native input — accessible, visually hidden */}
          <input
            ref={(node) => {
              inputRef.current = node;
              if (typeof forwardedRef === "function") forwardedRef(node);
              else if (forwardedRef) forwardedRef.current = node;
            }}
            id={id}
            type="checkbox"
            name={name}
            autoFocus={autoFocus}
            checked={isControlled ? isChecked : undefined}
            defaultChecked={!isControlled ? defaultChecked : undefined}
            disabled={disabled}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            aria-checked={indeterminate ? "mixed" : isChecked}
            aria-describedby={messageId}
            aria-invalid={effectiveState === "error" ? "true" : undefined}
            aria-required={required ? "true" : undefined}
            className="sr-only"
            {...rest}
          />

          {/* Styled box */}
          <motion.label
            htmlFor={id}
            animate={{
              boxShadow: focused ? FOCUS_RING[effectiveState] : FOCUS_RING_OFF,
              scale: hovered && !isDisabled ? 1.06 : 1,
            }}
            whileTap={!isDisabled ? { scale: 0.82 } : undefined}
            transition={{
              boxShadow: { duration: 0.15, ease: "easeOut" },
              scale: { type: "spring", stiffness: 500, damping: 28, mass: 0.6 },
            }}
            className={cn(
              "relative flex cursor-pointer select-none items-center justify-center border",
              "transition-[background-color,border-color] duration-150 ease-out",
              BOX_SIZE[size],
              BOX_RADIUS[size],
              isFilled
                ? BOX_FILLED[effectiveState]
                : cn("bg-[var(--color-input-bg)]", BOX_BORDER_UNCHECKED[effectiveState]),
              isDisabled && "cursor-not-allowed opacity-40",
            )}
          >
            {/* Hover tint — a state-coloured bloom that previews the fill */}
            <AnimatePresence>
              {showGhost && (
                <motion.span
                  key="tint"
                  className={cn("absolute inset-0 pointer-events-none", BOX_RADIUS[size])}
                  style={{ backgroundColor: HOVER_TINT[effectiveState] }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                />
              )}
            </AnimatePresence>

            {/* Real check / dash */}
            <AnimatePresence mode="wait" initial={false}>
              {isChecked && !indeterminate && <CheckIcon key="check" size={size} />}
              {indeterminate && <DashIcon key="dash" size={size} />}
            </AnimatePresence>

            {/* Ghost preview — shown on hover before clicking */}
            <AnimatePresence>
              {showGhost && !indeterminate && <GhostCheckIcon key="ghost-check" size={size} />}
              {showGhost && indeterminate && <GhostDashIcon key="ghost-dash" size={size} />}
            </AnimatePresence>
          </motion.label>
        </div>

        {/* ── Label + description ──────────────────────────────────────────── */}
        {(label || description) && (
          <label
            htmlFor={id}
            className={cn(
              "flex cursor-pointer select-none flex-col gap-0.5",
              isDisabled && "cursor-not-allowed opacity-40",
            )}
          >
            {label && (
              <span className={cn(LABEL_SIZE[size], "font-medium text-[var(--color-text-primary)] leading-none")}>
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
Checkbox.displayName = "Checkbox";

// ─── CheckboxIndicator ────────────────────────────────────────────────────────
// Pure visual element: styled box + animated check/dash mark. No native input,
// no label, no click handler. Use this when you need to compose a checkbox's
// visual state into another component (e.g. DropdownItem multi-select).

export interface CheckboxIndicatorProps {
  checked?: boolean;
  indeterminate?: boolean;
  state?: CheckboxState;
  size?: CheckboxSize;
  className?: string;
}

export function CheckboxIndicator({
  checked = false,
  indeterminate = false,
  state = "default",
  size = "sm",
  className,
}: CheckboxIndicatorProps) {
  const isFilled = checked || indeterminate;
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative flex shrink-0 items-center justify-center border",
        "transition-[background-color,border-color] duration-150 ease-out",
        BOX_SIZE[size],
        BOX_RADIUS[size],
        isFilled
          ? BOX_FILLED[state]
          : cn("bg-[var(--color-input-bg)]", BOX_BORDER_UNCHECKED[state]),
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {checked && !indeterminate && <CheckIcon key="check" size={size} />}
        {indeterminate && <DashIcon key="dash" size={size} />}
      </AnimatePresence>
    </div>
  );
}

// ─── CheckboxGroup ────────────────────────────────────────────────────────────

const GROUP_MSG_COLOR: Record<CheckboxState, string> = {
  default: "text-[var(--color-text-muted)]",
  error: "text-[var(--color-label-error)]",
  warning: "text-[var(--color-label-warning)]",
  success: "text-[var(--color-label-success)]",
};

export function CheckboxGroup({
  label,
  required,
  optional,
  helperText,
  errorMessage,
  warningMessage,
  state = "default",
  direction = "vertical",
  children,
  className,
}: CheckboxGroupProps) {
  const groupId = useId();
  const messageId = `${groupId}-message`;

  const message =
    state === "error" ? errorMessage
      : state === "warning" ? warningMessage
        : helperText;

  const contextValue = {
    messageId: message ? messageId : undefined,
    groupState: state,
    required,
  };

  return (
    <CheckboxGroupContext.Provider value={contextValue}>
      <div role="group" className={cn("flex flex-col gap-2", className)}>

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

        <div
          className={cn(
            direction === "horizontal"
              ? "flex flex-wrap gap-x-6 gap-y-3"
              : "flex flex-col gap-3",
          )}
        >
          {children}
        </div>

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
    </CheckboxGroupContext.Provider>
  );
}