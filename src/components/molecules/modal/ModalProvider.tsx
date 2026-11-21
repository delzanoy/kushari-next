"use client";

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";

type ModalNode = {
  id: number;
  element: React.ReactElement;
};

export type ModalContextValue = {
  open: (element: React.ReactElement) => number;
  close: (id: number) => void;
  closeTop: () => void;
  count: number;
};

export const ModalContext = createContext<ModalContextValue | null>(null);

export interface ModalEnhancementProps {
  "data-modal-id": number;
  internalModalId: number;
  internalZIndex: number;
  internalStackIndex: number;
  internalIsTop: boolean;
}

type MergeProps<T, U> = Omit<T, keyof U> & U;

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const idRef = useRef(1);
  const [modals, setModals] = useState<ModalNode[]>([]);

  const open = useCallback((element: React.ReactElement) => {
    const id = idRef.current++;
    setModals((s) => [...s, { id, element }]);
    return id;
  }, []);

  const close = useCallback((id: number) => {
    setModals((s) => s.filter((m) => m.id !== id));
  }, []);

  const closeTop = useCallback(() => {
    setModals((s) => {
      if (s.length === 0) return s;
      return s.slice(0, -1);
    });
  }, []);

  const value = useMemo(
    () => ({ open, close, closeTop, count: modals.length }),
    [open, close, closeTop, modals.length]
  );

  return (
    <ModalContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {modals.map((m, idx) => {
          const zIndex = 1000 + idx * 100;
          const isTop = idx === modals.length - 1;
          
          const enhancementProps: ModalEnhancementProps = {
            "data-modal-id": m.id,
            internalModalId: m.id,
            internalZIndex: zIndex,
            internalStackIndex: idx,
            internalIsTop: isTop,
          };

          return React.cloneElement(m.element, {
            key: m.id,
            ...enhancementProps,
          } as MergeProps<typeof m.element.props, ModalEnhancementProps>);
        })}
      </AnimatePresence>
    </ModalContext.Provider>
  );
};
