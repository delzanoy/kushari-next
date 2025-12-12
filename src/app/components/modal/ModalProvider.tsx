"use client";
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

type ModalNode = {
  id: number;
  element: React.ReactElement;
};

type ModalContextValue = {
  open: (element: React.ReactElement) => number;
  close: (id: number) => void;
  closeTop: () => void;
  count: number;
};

const ModalContext = createContext<ModalContextValue | null>(null);

interface ModalProviderProps {
  children: React.ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
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
      {modals.map((m, idx) => {
        const zIndex = 1000 + idx * 100;
        const isTop = idx === modals.length - 1;
        return React.cloneElement(m.element, {
          key: m.id,
          "data-modal-id": m.id,
          internalModalId: m.id,
          internalZIndex: zIndex,
          internalStackIndex: idx,
          internalIsTop: isTop,
        } as any);
      })}
    </ModalContext.Provider>
  );
};

export const useModalProvider = (): ModalContextValue => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModalProvider must be used within ModalProvider");
  return ctx;
};