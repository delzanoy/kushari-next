"use client";
import React from "react";
import { ModalProvider } from "./ModalProvider";

/**
 * ModalHost
 * - Wraps a subtree with ModalProvider so any component can call useModal() to open stacked modals.
 * - Keeps responsibility simple: provide the provider at the app/layout root or wherever you need modals.
 *
 * Replace any previous ModalHost implementation (portal-based) with this if you want the provider-driven stack.
 */
export default function ModalHost({ children }: { children?: React.ReactNode }) {
  return <ModalProvider>{children}</ModalProvider>;
}