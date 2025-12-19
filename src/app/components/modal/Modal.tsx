"use client";
import React, { useCallback, useEffect, useRef, useState, createContext, useContext } from "react";

type ModalProps = {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  showCloseButton?: boolean;
  width?: number | string;
  onClose?: () => void | Promise<void>;
  onRequestClose?: (force?: boolean) => boolean | Promise<boolean>;
  hasUnsavedChanges?: boolean;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  internalModalId?: number;
  internalZIndex?: number;
  internalStackIndex?: number;
  internalIsTop?: boolean;
};

// Create context for ESC stage
interface ModalContextType {
  escStage: 0 | 1;
  isTopModal: boolean;
}

const ModalContext = createContext<ModalContextType>({
  escStage: 0,
  isTopModal: false,
});

// Hook to use modal context
export const useModalContext = () => useContext(ModalContext);

const focusableSelector =
  'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const Modal: React.FC<ModalProps> = (props) => {
  const {
    // title,
    // subtitle,
    // icon,
    // showCloseButton = true,
    // width = 568,
    onClose,
    onRequestClose,
    hasUnsavedChanges = false,
    // footer,
    children,
    internalZIndex = 1000,
    internalIsTop = true,
    internalStackIndex = 0,
  } = props;

  const [escStage, setEscStage] = useState<0 | 1>(0);
  const escTimerRef = useRef<number | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const isUnderlying = !internalIsTop;

  // const widthStr = typeof width === "number" ? `${width}px` : width;

  const titleId = `modal-title-${internalZIndex}-${internalStackIndex}`;
  const descId = `modal-desc-${internalZIndex}-${internalStackIndex}`;

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

  const wrapperStyle: React.CSSProperties = {
    zIndex: internalZIndex,
  };

  const containerClass = [
    "fixed inset-0 flex items-start justify-center px-4",
    "transition-all duration-200 ease-out",
  ].join(" ");

  const backdropClass = [
    "absolute inset-0 transition-opacity duration-300",
    internalIsTop 
      ? "bg-black/40 backdrop-blur-xs" 
      : "bg-transparent pointer-events-none", // CHANGED: Use transparent for non-top modals
  ].join(" ");

    const modalTransform = isUnderlying 
      ? "scale-95 opacity-100 pointer-events-none"  // Reduced opacity
    : "scale-100 opacity-100";
  const modalBaseClasses = [
    "relative rounded-lg shadow-2xl overflow-visible",
    "transform transition-all duration-180 ease-out",
    modalTransform,
  ].join(" ");

  return (
    <ModalContext.Provider value={{ escStage, isTopModal: internalIsTop }}>
      <div style={wrapperStyle} className={containerClass} role="presentation" onMouseDown={onBackdropClick}>
        <div className={backdropClass} aria-hidden="true" />
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descId}
          ref={containerRef}
          className={modalBaseClasses}
          style={{
            width: "auto",
            maxHeight: "85vh",
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </ModalContext.Provider>
  );
};



// "use client";
// import React, { useCallback, useEffect, useRef, useState, createContext, useContext } from "react";

// type ModalProps = {
//   title?: string;
//   subtitle?: string;
//   icon?: React.ReactNode;
//   showCloseButton?: boolean;
//   width?: number | string;
//   onClose?: () => void | Promise<void>;
//   onRequestClose?: (force?: boolean) => boolean | Promise<boolean>;
//   hasUnsavedChanges?: boolean;
//   footer?: React.ReactNode;
//   children?: React.ReactNode;
//   internalModalId?: number;
//   internalZIndex?: number;
//   internalStackIndex?: number;
//   internalIsTop?: boolean;
// };

// // Create context for ESC stage
// interface ModalContextType {
//   escStage: 0 | 1;
//   isTopModal: boolean;
// }

// const ModalContext = createContext<ModalContextType>({
//   escStage: 0,
//   isTopModal: false,
// });

// // Hook to use modal context
// export const useModalContext = () => useContext(ModalContext);

// const focusableSelector =
//   'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';

// export const Modal: React.FC<ModalProps> = (props) => {
//   const {
//     title,
//     subtitle,
//     icon,
//     showCloseButton = true,
//     width = 568,
//     onClose,
//     onRequestClose,
//     hasUnsavedChanges = false,
//     footer,
//     children,
//     internalZIndex = 1000,
//     internalIsTop = true,
//     internalStackIndex = 0,
//   } = props;

//   const [escStage, setEscStage] = useState<0 | 1>(0);
//   const escTimerRef = useRef<number | null>(null);
//   const [isAnimating, setIsAnimating] = useState(true);

//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const previouslyFocused = useRef<HTMLElement | null>(null);

//   const isUnderlying = !internalIsTop;
//   const widthStr = typeof width === "number" ? `${width}px` : width;

//   const titleId = `modal-title-${internalZIndex}-${internalStackIndex}`;
//   const descId = `modal-desc-${internalZIndex}-${internalStackIndex}`;

//   useEffect(() => {
//     // Trigger animation on mount
//     const timer = setTimeout(() => {
//       setIsAnimating(false);
//     }, 10);

//     previouslyFocused.current = document.activeElement as HTMLElement | null;
//     setTimeout(() => {
//       if (!containerRef.current) return;
//       const first = containerRef.current.querySelector<HTMLElement>(focusableSelector);
//       if (first) first.focus();
//       else containerRef.current?.focus();
//     }, 0);

//     return () => {
//       clearTimeout(timer);
//       if (previouslyFocused.current && previouslyFocused.current.focus) {
//         previouslyFocused.current.focus();
//       }
//     };
//   }, []);

//   useEffect(() => {
//     if (!internalIsTop) return;
//     const onKey = async (e: KeyboardEvent) => {
//       if (e.key === "Escape") {
//         e.stopPropagation();
//         if (escStage === 0) {
//           setEscStage(1);
//           window.clearTimeout(escTimerRef.current ?? 0);
//           escTimerRef.current = window.setTimeout(() => setEscStage(0), 2500);
//         } else {
//           const ok = (await (onRequestClose ? onRequestClose(true) : Promise.resolve(true))) !== false;
//           if (ok) {
//             onClose?.();
//           } else {
//             setEscStage(0);
//           }
//         }
//       } else if (e.key === "Tab") {
//         if (!containerRef.current) return;
//         const focusables = Array.from(containerRef.current.querySelectorAll<HTMLElement>(focusableSelector));
//         if (focusables.length === 0) {
//           e.preventDefault();
//           return;
//         }
//         const first = focusables[0];
//         const last = focusables[focusables.length - 1];
//         if (!e.shiftKey && document.activeElement === last) {
//           e.preventDefault();
//           first.focus();
//         } else if (e.shiftKey && document.activeElement === first) {
//           e.preventDefault();
//           last.focus();
//         }
//       }
//     };
//     window.addEventListener("keydown", onKey, { capture: true });
//     return () => window.removeEventListener("keydown", onKey, { capture: true });
//   }, [internalIsTop, escStage, onClose, onRequestClose]);

//   const onBackdropClick = useCallback(
//     async (e: React.MouseEvent) => {
//       if (!internalIsTop) return;
//       if (e.target !== e.currentTarget) return;
//       const ok = (await (onRequestClose ? onRequestClose(false) : Promise.resolve(!hasUnsavedChanges))) !== false;
//       if (ok) onClose?.();
//     },
//     [internalIsTop, onClose, onRequestClose, hasUnsavedChanges]
//   );

//   return (
//     <ModalContext.Provider value={{ escStage, isTopModal: internalIsTop }}>
//       <div style={{ zIndex: internalZIndex }} className="fixed inset-0 flex items-start justify-center px-4" role="presentation" onMouseDown={onBackdropClick}>
//         {/* Backdrop with animation */}
//         <div
//           className={`absolute inset-0 transition-opacity duration-300 ${
//             isAnimating ? "opacity-0" : "opacity-100"
//           } ${internalIsTop ? "bg-black/40 backdrop-blur-xs" : "bg-transparent pointer-events-none"}`}
//           aria-hidden="true"
//         />

//         {/* Modal Container with animation */}
//         <div
//           role="dialog"
//           aria-modal="true"
//           aria-labelledby={titleId}
//           aria-describedby={descId}
//           ref={containerRef}
//           style={{
//             width: widthStr,
//             transform: isAnimating 
//               ? (isUnderlying ? "scale(0.95)" : "translateY(40px) scale(0.95)") 
//               : (isUnderlying ? "scale(0.95)" : "translateY(0) scale(1)"),
//             opacity: isAnimating ? 0 : (isUnderlying ? 0.6 : 1),
//             transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
//             pointerEvents: isUnderlying ? "none" : "auto",
//           }}
//           className="relative rounded-lg shadow-2xl overflow-visible"
//           onMouseDown={(e) => e.stopPropagation()}
//         >
//           {children}
//         </div>
//       </div>
//     </ModalContext.Provider>
//   );
// };