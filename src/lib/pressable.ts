import type { KeyboardEvent } from "react";

/**
 * Makes a clickable non-button element usable from the keyboard (U-22):
 * it joins the Tab order, is announced as a button, and Enter or Space
 * triggers its existing onClick. It changes nothing visually, so it's safe on
 * rows and cards whose layout a real <button> would alter, or which contain
 * other controls (a <button> can't).
 *
 *   <div onClick={open} {...pressable()}>…</div>
 *   <div onClick={pick} {...pressable({ pressed: isSelected })}>…</div>
 *   <div onClick={toggle} {...pressable({ expanded: isOpen })}>…</div>
 *
 * Pass `disabled` when the click currently does nothing, so the element
 * drops out of the Tab order.
 */
export function pressable({
  disabled = false,
  pressed,
  expanded,
  label,
}: { disabled?: boolean; pressed?: boolean; expanded?: boolean; label?: string } = {}) {
  return {
    role: "button" as const,
    tabIndex: disabled ? -1 : 0,
    "aria-disabled": disabled || undefined,
    "aria-pressed": pressed,
    "aria-expanded": expanded,
    "aria-label": label,
    onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
      // Only when the element itself has focus, not a control inside it.
      if (disabled || e.target !== e.currentTarget) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.currentTarget.click();
      }
    },
  };
}
