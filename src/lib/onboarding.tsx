"use client";

import { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import type { Pin } from "@/components/atoms/MeshGradientCard";

// ─── Step definitions ─────────────────────────────────────────────────────────

export interface OnboardingStepDef {
  id: string;
  title: string;
  description: string;
}

export type OnboardingPhase = "idle" | "welcome" | "workspace" | "tour";

// ─── Context ──────────────────────────────────────────────────────────────────

interface OnboardingContextValue {
  active: boolean;
  phase: OnboardingPhase;
  userName: string;
  userPreset: string;
  userPins: Pin[] | null;
  workspaceName: string;
  isWorkspaceSkipped: boolean;
  setIdentity: (name: string, preset: string, pins?: Pin[]) => void;
  setWorkspaceName: (name: string) => void;
  setIsWorkspaceSkipped: (skipped: boolean) => void;
  start: () => void;
  advancePhase: () => void;
  completeWorkspace: (skipped: boolean) => void;
  startTour: () => void;
  close: () => void;
  currentStep: number;
  steps: OnboardingStepDef[];
  next: () => void;
  prev: () => void;
}

export const OnboardingContext = createContext<OnboardingContextValue>({
  active: false,
  phase: "idle",
  userName: "Delanoy Kunil",
  userPreset: "Cyan Dusk",
  userPins: null,
  workspaceName: "",
  isWorkspaceSkipped: false,
  setIdentity: () => {},
  setWorkspaceName: () => {},
  setIsWorkspaceSkipped: () => {},
  start: () => {},
  advancePhase: () => {},
  completeWorkspace: () => {},
  startTour: () => {},
  close: () => {},
  currentStep: 0,
  steps: [],
  next: () => {},
  prev: () => {},
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<OnboardingPhase>("idle");
  const active = phase !== "idle";

  const [userName, _setUserName] = useState("Delanoy Kunil");
  const [userPreset, _setUserPreset] = useState("Cyan Dusk");
  const [userPins, _setUserPins] = useState<Pin[] | null>(null);
  const [workspaceName, _setWorkspaceName] = useState("");
  const [isWorkspaceSkipped, _setIsWorkspaceSkipped] = useState(false);

  useEffect(() => {
    const memName = sessionStorage.getItem("kb_userName");
    const memPreset = sessionStorage.getItem("kb_userPreset");
    const memPins = sessionStorage.getItem("kb_userPins");
    const memWs = sessionStorage.getItem("kb_workspaceName");
    const memSkipped = sessionStorage.getItem("kb_isWorkspaceSkipped");
    if (memName) _setUserName(memName);
    if (memPreset) _setUserPreset(memPreset);
    if (memPins) {
      try {
        _setUserPins(JSON.parse(memPins));
      } catch (e) {
        console.error("Failed to parse userPins", e);
      }
    }
    if (memWs) _setWorkspaceName(memWs);
    if (memSkipped) _setIsWorkspaceSkipped(memSkipped === "true");
  }, []);

  const setIdentity = useCallback((name: string, preset: string, pins?: Pin[]) => {
    _setUserName(name);
    _setUserPreset(preset);
    sessionStorage.setItem("kb_userName", name);
    sessionStorage.setItem("kb_userPreset", preset);
    if (pins) {
      _setUserPins(pins);
      sessionStorage.setItem("kb_userPins", JSON.stringify(pins));
    } else {
      _setUserPins(null);
      sessionStorage.removeItem("kb_userPins");
    }
  }, []);

  const setWorkspaceName = useCallback((name: string) => {
    _setWorkspaceName(name);
    sessionStorage.setItem("kb_workspaceName", name);
  }, []);

  const setIsWorkspaceSkipped = useCallback((skipped: boolean) => {
    _setIsWorkspaceSkipped(skipped);
    if (skipped) {
      sessionStorage.setItem("kb_isWorkspaceSkipped", "true");
    } else {
      sessionStorage.removeItem("kb_isWorkspaceSkipped");
    }
  }, []);

  const start = useCallback(() => {
    setPhase("welcome");
  }, []);

  const advancePhase = useCallback(() => {
    setPhase((p) => {
      if (p === "welcome") return "workspace";
      if (p === "workspace") return "idle";
      return "idle";
    });
  }, []);

  const completeWorkspace = useCallback((skipped: boolean) => {
    if (skipped) {
      _setWorkspaceName("");
      sessionStorage.removeItem("kb_workspaceName");
      _setIsWorkspaceSkipped(true);
      sessionStorage.setItem("kb_isWorkspaceSkipped", "true");
    } else {
      _setIsWorkspaceSkipped(false);
      sessionStorage.removeItem("kb_isWorkspaceSkipped");
    }
    setPhase("tour");
  }, []);

  const [currentStep, setCurrentStep] = useState(0);
  const steps = useMemo(() => [
    { id: "tour-workspace", title: "Workspace Selector", description: "Switch between your personal and shared spaces here." },
    { id: "tour-assets", title: "Asset Breakdown", description: "View your token and wallet allocations at a glance." },
    { id: "tour-tx", title: "Transaction History", description: "Track on-chain actions, executions, and classification tags." }
  ], []);

  const next = useCallback(() => {
    setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  }, [steps.length]);

  const prev = useCallback(() => {
    setCurrentStep((s) => Math.max(s - 1, 0));
  }, []);

  const startTour = useCallback(() => {
    setPhase("tour");
    setCurrentStep(0);
  }, []);

  const close = useCallback(() => {
    setPhase("idle");
  }, []);

  const value = useMemo(
    () => ({ active, phase, userName, userPreset, userPins, workspaceName, isWorkspaceSkipped, setIdentity, setWorkspaceName, setIsWorkspaceSkipped, start, advancePhase, completeWorkspace, startTour, close, currentStep, steps, next, prev }),
    [active, phase, userName, userPreset, userPins, workspaceName, isWorkspaceSkipped, setIdentity, setWorkspaceName, setIsWorkspaceSkipped, start, advancePhase, completeWorkspace, startTour, close, currentStep, steps, next, prev],
  );

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useOnboarding() {
  return useContext(OnboardingContext);
}
