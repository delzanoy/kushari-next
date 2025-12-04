// components/modal/ModalHost.tsx
"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useModalManager } from "./ModalProvider";
import type { ModalOptions } from "./types";

type Props = {
  id: string;
  level: number; // 0-based
  isTop: boolean;
  content: React.ReactNode;
  options: ModalOptions;
};

const BASE_Z = 1000;
const Z_STEP = 100;

function useFocusTrap(
  isActive: boolean,
  containerRef: React.RefObject<HTMLElement | null>,
  onDeactivate?: () => void
) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;
    const el = containerRef.current;
    const focusables = el.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        if (focusables.length === 0) {
          e.preventDefault();
          return;
        }
        if (e.shiftKey) {
          if (document.activeElement === first) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    };

    el.addEventListener("keydown", handleKey);
    // try to focus first
    setTimeout(() => {
      if (first) first.focus();
    }, 0);

    return () => {
      el.removeEventListener("keydown", handleKey);
      onDeactivate?.();
    };
  }, [isActive, containerRef, onDeactivate]);
}

export default function ModalHost({ id, level, isTop, content, options }: Props) {
  const { close, open } = useModalManager();
  const containerRef = useRef<HTMLDivElement>(null);
  const prevActiveElRef = useRef<Element | null>(null);
  const [closing, setClosing] = useState(false);
  const [escStage, setEscStage] = useState<0 | 1 | 2>(0); // 0 none, 1 pressed once, 2 confirmed
  const escTimerRef = useRef<number | null>(null);

  const zIndex = BASE_Z + level * Z_STEP;

  // Save active element to restore focus later
  useEffect(() => {
    prevActiveElRef.current = document.activeElement;
    return () => {
      const prev = prevActiveElRef.current as HTMLElement | null;
      prev?.focus?.();
    };
  }, []);

  // Focus trap only on top
  useFocusTrap(isTop, containerRef);

  // ESC handling
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isTop) return;
    if (e.key === "Escape") {
      e.preventDefault();
      if (escStage === 0) {
        setEscStage(1);
        // reset stage after 2.5s
        if (escTimerRef.current) window.clearTimeout(escTimerRef.current);
        escTimerRef.current = window.setTimeout(() => setEscStage(0), 2500);
      } else if (escStage === 1) {
        // confirm close
        setEscStage(2);
        // call close
        close(id);
      }
    }
  }, [isTop, escStage, id, close]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // When closing via animations
  const doClose = () => {
    setClosing(true);
    setTimeout(() => {
      close(id);
    }, 180); // align with exit animation
  };

  // Backdrop click behavior
  const onBackdropClick = () => {
    if (!options.closeOnBackdrop && options.closeOnBackdrop !== undefined) return;
    if (options.hasUnsavedChanges) {
      // Open a confirmation modal on top
      open(
        <ConfirmUnsaved
          onConfirm={() => {
            // close the modal that was beneath (the current one)
            close(id);
          }}
          onCancel={() => {
            // nothing
          }}
        />,
        { title: "Discard changes?", showClose: true }
      );
      return;
    }
    doClose();
  };

  // Close button click
  const handleCloseClick = () => {
    if (options.hasUnsavedChanges) {
      // same confirm
      open(
        <ConfirmUnsaved
          onConfirm={() => close(id)}
          onCancel={() => {}}
        />,
        { title: "Discard changes?", showClose: true }
      );
    } else {
      doClose();
    }
  };

  // Determine animation / styles depending on whether this is top or not
  const isDimmed = !isTop; // previous modals are dimmed and scaled down
  const modalScale = isDimmed ? "scale-90" : "scale-100";
  const modalBg = isDimmed ? "bg-[#2A2C2E]" : "bg-[#151819]";
  const contentOpacity = isDimmed ? "opacity-50" : "opacity-100";
  const pointerEvents = isTop ? "pointer-events-auto" : "pointer-events-none";

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`modal-title-${id}`}
      aria-describedby={`modal-desc-${id}`}
      className={`fixed inset-0 flex items-center justify-center z-[${zIndex}]`}
      style={{ zIndex }}
    >
      {/* Backdrop */}
      <div
        onMouseDown={onBackdropClick}
        className={`absolute inset-0 transition-opacity duration-180 ${isTop ? "bg-black/40" : "bg-black/25"}`}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div
        className={`relative rounded-3xl border-[0.5px] border-solid border-[rgba(248,252,255,0.12)] ${modalBg} ${modalScale} ${contentOpacity} ${pointerEvents} transform transition-all duration-180 ease-out p-0 max-h-[85vh] overflow-hidden`}
        style={{
          width: typeof options.width === "number" ? `${options.width}px` : options.width || 568,
          transitionProperty: "transform, opacity, background-color",
        }}
      >
        {/* Title (sticky) */}
        <div className="sticky top-0 z-10 bg-transparent px-4 py-3 border-b border-white/6 backdrop-blur-sm">
          <div className="flex justify-between items-start gap-3">
            <div className="flex items-center gap-3">
              {options.icon && <div className="w-8 h-8">{options.icon}</div>}
              <div>
                <div id={`modal-title-${id}`} className="text-white font-semibold text-lg">
                  {options.title}
                </div>
                {options.subtitle && <div id={`modal-desc-${id}`} className="text-sm text-white/70">{options.subtitle}</div>}
              </div>
            </div>
            {options.showClose !== false && (
              <button
                aria-label="Close modal"
                onClick={handleCloseClick}
                className={`ml-3 px-3 py-1 rounded-md text-sm border ${escStage === 1 ? "bg-red-600 text-white" : "bg-transparent text-white/80"} `}
                title={escStage === 1 ? "Press Esc to confirm" : "Close"}
              >
                {escStage === 1 ? "Confirm (Esc)" : "✕"}
              </button>
            )}
          </div>
        </div>

        {/* Content - scrollable when long; title sticky above it */}
        <div className="p-4 overflow-auto max-h-[calc(85vh-80px)]">
          <div className="text-white">{content}</div>
        </div>
      </div>
    </div>
  );
}

/* ConfirmUnsaved subcomponent inline */
function ConfirmUnsaved({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  const { close } = useModalManager();
  return (
    <div className="p-4 max-w-[480px]">
      <div className="mb-3 text-lg font-semibold text-white">Discard changes?</div>
      <div className="mb-4 text-white/80">You have unsaved changes. Do you want to discard them?</div>
      <div className="flex gap-2 justify-end">
        <button className="px-3 py-2 rounded-md bg-transparent border border-white/12 text-white/80" onClick={() => { close(); onCancel(); }}>
          Cancel
        </button>
        <button className="px-3 py-2 rounded-md bg-red-600 text-white" onClick={() => { close(); onConfirm(); }}>
          Discard
        </button>
      </div>
    </div>
  );
}
