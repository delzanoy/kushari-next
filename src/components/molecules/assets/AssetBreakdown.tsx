"use client";

import { motion } from "framer-motion";
import { formatDollars, formatCents, formatPercent } from "@/lib/formatters";
import type { WalletInfo } from "./types";
import { walletIcon } from "@/components/atoms/WalletIcon";

export function AssetBreakdown({ wallets }: { wallets: WalletInfo[] }) {
  const sortedWallets = [...wallets].sort((a, b) => b.balance - a.balance);

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="w-full overflow-hidden"
    >
      <div className="flex flex-col items-end gap-3 w-full pt-4 pb-2">
        {sortedWallets.map((wallet) => (
          <div className="flex items-center gap-4 w-full justify-between" key={wallet.walletId}>
            <div className="w-[242px] shrink-0" />
            <div className="w-[248px] shrink-0" />
            <div className="flex w-[336px] items-baseline gap-4 shrink-0 justify-between">
              <span className="truncate w-[160px] text-right text-sm font-semibold tracking-tight text-[var(--color-text-primary)]">
                {wallet.balance.toLocaleString(undefined, { maximumFractionDigits: 6 })}
              </span>
              <div className="flex items-baseline gap-1 w-[160px]">
                <span className="text-sm font-light tracking-tight text-[var(--color-text-primary)]">
                  ${formatDollars(wallet.balance)}
                </span>
                <span className="text-xs font-thin tracking-tight text-[var(--color-text-muted)]">
                  {formatPercent(wallet.percentageShare)}%
                </span>
              </div>
            </div>
            <div className="flex w-[146px] items-center gap-2 shrink-0">
              {walletIcon(wallet.walletType, { muted: true })}
              <span className="truncate text-sm font-light tracking-tight text-[var(--color-text-secondary)]">
                {wallet.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
