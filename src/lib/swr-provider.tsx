"use client";

import { SWRConfig } from "swr";
import { fetcher } from "./fetcher";

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        // Poll every 5 minutes — keeps balances and transactions reasonably fresh
        refreshInterval: 300_000,
        dedupingInterval: 5_000,
        errorRetryCount: 2,
        errorRetryInterval: 5_000,
      }}
    >
      {children}
    </SWRConfig>
  );
}
