import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface InlineAlertProps {
  children:   ReactNode;
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * A form-level error shown inside a modal, above its submit button.
 * Use it for failures that don't belong to one field (e.g. saving failed);
 * use TextInput/Dropdown `state="error"` for field errors.
 * Announced by screen readers when it appears.
 */
export function InlineAlert({ children, className }: InlineAlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        "w-full px-3 py-2 rounded text-sm tracking-tight",
        "text-[var(--color-text-danger)] bg-[rgba(239,68,68,0.1)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
