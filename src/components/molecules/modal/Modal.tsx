"use client";

import React, { useCallback, useEffect, useRef, useState, createContext, useContext } from "react";
import { motion } from "framer-motion";

export type ModalVariant = "default" | "danger" | "success" | "wide";

/**
 * The three modal widths. Every modal panel takes its width from here.
 * - wide:     multi-step flows, proposal review, settings
 * - standard: forms (create, track, add, deposit)
 * - small:    confirmations and short messages
 */
export const MODAL_WIDTH = {
  wide: "w-[1372px] max-w-full",
  standard: "w-[568px] max-w-full",
  small: "w-[420px] max-w-full",
} as const;

export type ModalSize = keyof typeof MODAL_WIDTH;

export type ModalProps = {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  showCloseButton?: boolean;
  width?: number | string;
  onClose?: () => void | Promise<void>;
  onRequestClose?: (force?: boolean) => boolean | Promise<boolean>;
  hasUnsavedChanges?: boolean;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  animation?: "default" | "slide-up" | "expand";
  originRect?: DOMRect;
  
  // Injected by ModalProvider
  internalModalId?: number;
  internalZIndex?: number;
  internalStackIndex?: number;
  internalIsTop?: boolean;
};

interface ModalContextType {
  escStage: 0 | 1;
  isTopModal: boolean;
}

const ModalContext = createContext<ModalContextType>({
  escStage: 0,
  isTopModal: false,
});

export const useModalContext = () => useContext(ModalContext);

const focusableSelector =
  'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const Modal: React.FC<ModalProps> = (props) => {
  const {
    onClose,
    onRequestClose,
    hasUnsavedChanges = false,
    children,
    animation = "default",
    originRect,
    internalZIndex = 1000,
    internalIsTop = true,
    internalStackIndex = 0,
  } = props;

  const [escStage, setEscStage] = useState<0 | 1>(0);
  const escTimerRef = useRef<number | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const isUnderlying = !internalIsTop;

  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    setTimeout(() => {
      if (!containerRef.current) return;
      const first = containerRef.current.querySelector<HTMLElement>(focusableSelector);
      if (first) first.focus();
      else containerRef.current?.focus();
    }, 0);

    return () => {
      if (previouslyFocused.current && previouslyFocused.current.focus) {
        previouslyFocused.current.focus();
      }
    };
  }, []);

  useEffect(() => {
    if (!internalIsTop) return;
    const onKey = async (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        if (escStage === 0) {
          setEscStage(1);
          window.clearTimeout(escTimerRef.current ?? 0);
          escTimerRef.current = window.setTimeout(() => setEscStage(0), 2500);
        } else {
          const ok = (await (onRequestClose ? onRequestClose(true) : Promise.resolve(true))) !== false;
          if (ok) {
            onClose?.();
          } else {
            setEscStage(0);
          }
        }
      } else if (e.key === "Tab") {
        if (!containerRef.current) return;
        const focusables = Array.from(containerRef.current.querySelectorAll<HTMLElement>(focusableSelector));
        if (focusables.length === 0) {
          e.preventDefault();
          return;
        }
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey, { capture: true });
    return () => window.removeEventListener("keydown", onKey, { capture: true });
  }, [internalIsTop, escStage, onClose, onRequestClose]);

  const onBackdropClick = useCallback(
    async (e: React.MouseEvent) => {
      if (!internalIsTop) return;
      if (e.target !== e.currentTarget) return;
      const ok = (await (onRequestClose ? onRequestClose(false) : Promise.resolve(!hasUnsavedChanges))) !== false;
      if (ok) onClose?.();
    },
    [internalIsTop, onClose, onRequestClose, hasUnsavedChanges]
  );

  const expandInitial = React.useMemo(() => {
    if (animation !== "expand" || !originRect) return null;
    const vw = typeof window !== "undefined" ? window.innerWidth : 1000;
    const buttonCenterX = originRect.left + originRect.width / 2;
    const offsetX = buttonCenterX - vw / 2;
    const offsetY = originRect.top - 100;
    const targetWidth = props.width ? (typeof props.width === "number" ? props.width : parseInt(String(props.width)) || 1372) : 1372;
    const scale = Math.min(1, originRect.width / targetWidth);
    return { 
      x: offsetX, 
      y: offsetY, 
      scale, 
      opacity: 0,
      transformOrigin: "top center" 
    };
  }, [animation, originRect, props.width]);

  return (
    <ModalContext.Provider value={{ escStage, isTopModal: internalIsTop }}>
      <div 
        style={{ zIndex: internalZIndex }} 
        className="fixed inset-0 flex items-start justify-center px-4 pt-[100px] pb-10 overflow-y-auto" 
        role="presentation" 
        onMouseDown={onBackdropClick}
      >
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${internalStackIndex === 0 ? "bg-black/40 backdrop-blur-md" : "bg-transparent"}`} 
          aria-hidden="true" 
        />
        <motion.div
          role="dialog"
          aria-modal="true"
          ref={containerRef}
          initial={
            animation === "expand" && expandInitial
              ? { opacity: 0, scale: expandInitial.scale, x: expandInitial.x, y: expandInitial.y }
              : animation === "slide-up"
              ? { opacity: 0, scale: 0.95, y: 300, x: 0 }
              : { opacity: 0, scale: 0.95, y: 10, x: 0 }
          }
          animate={{ 
            opacity: 1, 
            scale: isUnderlying ? 0.95 : 1, 
            y: isUnderlying ? -10 : 0,
            x: 0,
            filter: isUnderlying ? "blur(4px) brightness(0.6)" : "blur(0px) brightness(1)"
          }}
          exit={
            animation === "expand" && expandInitial
              ? { opacity: 0, scale: expandInitial.scale, x: expandInitial.x, y: expandInitial.y }
              : animation === "slide-up"
              ? { opacity: 0, scale: 0.95, y: 300, x: 0 }
              : { opacity: 0, scale: 0.95, y: 10, x: 0 }
          }
          transition={
            animation === "expand"
              ? { type: "spring", stiffness: 350, damping: 32, mass: 0.8 }
              : animation === "slide-up"
              ? { type: "spring", stiffness: 350, damping: 30, mass: 1 }
              : { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
          }
          className="relative rounded-3xl shadow-2xl overflow-visible pointer-events-auto origin-top"
          style={{ width: "auto", maxHeight: "85vh", transformOrigin: "top center" }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {children}
        </motion.div>
      </div>
    </ModalContext.Provider>
  );
};
