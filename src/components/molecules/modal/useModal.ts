"use client";

import { useContext } from "react";
import { ModalContext, ModalContextValue } from "./ModalProvider";

const fallbackCtx: ModalContextValue = {
  open: () => 0,
  close: () => {},
  closeTop: () => {},
  count: 0,
};

export const useModal = (): ModalContextValue => {
  const ctx = useContext(ModalContext);
  return ctx || fallbackCtx;
};
