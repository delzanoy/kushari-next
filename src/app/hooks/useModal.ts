// hooks/useModal.ts
import { useModalManager } from "../components/modal/ModalProvider";
import React from "react";
import type { ModalOptions } from "../components/modal/types";

export default function useModal() {
  const { open, close } = useModalManager();

  const openModal = React.useCallback((content: React.ReactNode, options?: ModalOptions) => open(content, options), [open]);
  const closeModal = React.useCallback((id?: string) => close(id), [close]);

  return { openModal, closeModal };
}
