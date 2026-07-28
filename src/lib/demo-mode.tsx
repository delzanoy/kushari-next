"use client";
// Memory automation verified: 2026-04-14

import { createContext, useContext, useState } from "react";

interface DemoModeContextValue {
  demoMode: boolean;
  setDemoMode: (value: boolean) => void;
}

const DemoModeContext = createContext<DemoModeContextValue>({
  demoMode: true,
  setDemoMode: () => {},
});

export function DemoModeProvider({ children }: { children: React.ReactNode }) {
  const [demoMode, setDemoMode] = useState(true);
  return (
    <DemoModeContext.Provider value={{ demoMode, setDemoMode }}>
      {children}
    </DemoModeContext.Provider>
  );
}

export function useDemoMode() {
  return useContext(DemoModeContext);
}
