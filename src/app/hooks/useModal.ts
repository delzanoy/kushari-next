"use client";
import React from "react";
import { useModalProvider } from "../components/modal/ModalProvider";

type UseModalReturn = {
  open: (element: React.ReactElement) => number;
  close: (id: number) => void;
  closeTop: () => void;
  closeAll: () => void;
  count: number;
  isOpen: boolean;
};

/**
 * useModal gives you imperative helpers to open modal components.
 */
export default function useModal(): UseModalReturn {
  const ctx = useModalProvider();
  
  const closeAll = () => {
    while (ctx.count > 0) {
      ctx.closeTop();
    }
  };
  
  return {
    open: (el: React.ReactElement) => ctx.open(el),
    close: (id: number) => ctx.close(id),
    closeTop: () => ctx.closeTop(),
    closeAll,
    count: ctx.count,
    isOpen: ctx.count > 0,
  };
}