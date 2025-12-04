"use client";
import React from "react";
import { useModalProvider } from "../components/modal/ModalProvider";

/**
 * useModal gives you imperative helpers to open modal components.
 */
export default function useModal() {
  const ctx = useModalProvider();
  return {
    open: (el: React.ReactElement) => ctx.open(el),
    close: (id: number) => ctx.close(id),
    closeTop: () => ctx.closeTop(),
    count: ctx.count,
  };
};