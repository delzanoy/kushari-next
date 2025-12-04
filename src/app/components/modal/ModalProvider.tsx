// components/modal/ModalProvider.tsx
"use client";
import React, { createContext, useContext, useRef, useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { v4 as uuidv4 } from "uuid";
import type { ModalOptions } from "./types";
import ModalHost from "./ModalHost";

type ModalStackItem = {
  id: string;
  content: React.ReactNode;
  options: ModalOptions;
};

type ModalContextType = {
  open: (content: React.ReactNode, options?: ModalOptions) => string; // returns id
  close: (id?: string) => void; // default closes top
  closeAll: () => void;
  getStack: () => ModalStackItem[];
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModalManager = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModalManager must be used within ModalProvider");
  return ctx;
};

export default function ModalProvider({ children }: { children: React.ReactNode }) {
  const [stack, setStack] = useState<ModalStackItem[]>([]);
  const stackRef = useRef(stack);
  stackRef.current = stack;

  // Open modal: push onto stack
  const open = useCallback((content: React.ReactNode, options: ModalOptions = {}) => {
    const id = options.id || uuidv4();
    const item: ModalStackItem = { id, content, options };
    setStack((s) => [...s, item]);
    return id;
  }, []);

  // Close a specific modal by id, or top if omitted
  const close = useCallback((id?: string) => {
    setStack((s) => {
      if (s.length === 0) return s;
      if (!id) return s.slice(0, -1);
      const idx = s.findIndex((m) => m.id === id);
      if (idx === -1) return s;
      // remove that modal and any above it
      return s.slice(0, idx).concat(s.slice(idx + 1));
    });
  }, []);

  const closeAll = useCallback(() => setStack([]), []);

  const getStack = useCallback(() => stackRef.current, []);

  // Portal root management: ensure a container exists. If the page includes
  // a `div#modal-root`, use it; otherwise create one and append to body.
  const modalRootRef = React.useRef<HTMLElement | null>(null);
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    let root = document.getElementById("modal-root");
    let created = false;
    if (!root) {
      root = document.createElement("div");
      root.setAttribute("id", "modal-root");
      document.body.appendChild(root);
      created = true;
    }
    modalRootRef.current = root;

    return () => {
      // If we created the root and it's still present, remove it on unmount
      if (created && root && root.parentNode) {
        root.parentNode.removeChild(root);
      }
    };
  }, []);

  const modalRoot = modalRootRef.current;

  return (
    <ModalContext.Provider value={{ open, close, closeAll, getStack }}>
      {children}
      {modalRoot && createPortal(
        <div aria-hidden={stack.length === 0 ? "true" : "false"}>
          {stack.map((item, index) => {
            const level = index; // 0-based
            const isTop = index === stack.length - 1;
            return (
              <ModalHost
                key={item.id}
                id={item.id}
                level={level}
                isTop={isTop}
                content={item.content}
                options={item.options}
              />
            );
          })}
        </div>,
        modalRoot
      )}
    </ModalContext.Provider>
  );
}
