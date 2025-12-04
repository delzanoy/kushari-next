import React from "react";

export type ModalVariant = "default" | "danger" | "success" | "wide";

export type ModalOptions = {
  id?: string; // optional override
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  showClose?: boolean; // default true
  closeOnBackdrop?: boolean; // default true if hasUnsavedChanges false
  hasUnsavedChanges?: boolean; // informs confirm-on-close behavior
  variant?: ModalVariant;
  width?: number | string; // e.g. 568 or "90vw"
  onOpen?: () => void;
  onOpened?: () => void;
  onClose?: () => void;
  onClosed?: () => void;
  // optional initial esc state; rarely used
};
