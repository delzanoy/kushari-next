"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  RiArrowUpLine,
  RiArrowDownLine,
  RiQrCodeLine,
  RiSendPlaneLine,
  RiNumber0,
} from "@remixicon/react";
import { GnosisSafeIcon } from "@/media/icons/GnosisSafeIcon";
import { IconButton } from "@/components/atoms/IconButton";
import { Tooltip } from "@/components/atoms/Tooltip";
import { WalletIdentifier } from "@/components/atoms/WalletIdentifier";
import { BlockchainIconStack } from "@/components/atoms/BlockchainIconStack";
import type { WalletSummary } from "../types";
import { formatDollars, formatCents, formatPercent } from "@/lib/formatters";
import { pressable } from "@/lib/pressable";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GnosisSafeCardProps {
  wallet: WalletSummary;
  onClick?: () => void;
  onDeposit?: (rect: DOMRect) => void;
  onSend?: (rect?: DOMRect) => void;
  onViewSafe?: () => void;
}


// ─── Motion ───────────────────────────────────────────────────────────────────

const SPRING_BUTTON = { type: "spring", stiffness: 420, damping: 30, mass: 0.6 } as const;

// ─── Component ────────────────────────────────────────────────────────────────

export function GnosisSafeCard({ wallet, onClick, onDeposit, onSend, onViewSafe }: GnosisSafeCardProps) {
  const [hovered, setHovered] = useState(false);

  const walletName = wallet.name.charAt(0).toUpperCase() + wallet.name.slice(1);
  const isPositive = wallet.percent_change_24h > 0;
  const isNegative = wallet.percent_change_24h < 0;

  return (
    <motion.div {...pressable({ disabled: !onClick })}
      className="group relative w-full cursor-pointer select-none overflow-hidden rounded-[32px] border transition-all duration-500 backdrop-blur-xl"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      // Keyboard focus inside the card reveals its buttons, as hover does (U-22).
      onFocus={() => setHovered(true)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setHovered(false); }}
      onClick={onClick}
      initial={false}
      style={{
        background: "rgba(10, 10, 10, 0.8)",
        borderColor: hovered ? "rgba(255, 255, 255, 0.18)" : "rgba(255, 255, 255, 0.08)",
        boxShadow: hovered
          ? "inset 0 0.5px 0 0 rgba(255, 255, 255, 0.06), 0 16px 32px -8px rgba(0, 0, 0, 0.45)"
          : "inset 0 0.5px 0 0 rgba(255, 255, 255, 0.06), 0 4px 12px -4px rgba(0, 0, 0, 0.3)",
      }}
    >
      {/* Noise texture (Premium mix-blend version) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Top Highlight (Signature mature touch) */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent pointer-events-none" />

      {/* Row content */}
      <div className="relative z-10 grid grid-cols-12 items-center gap-4 pl-6 pr-4 py-4">
        {/* Cols 1-4: Identifier */}
        <div className="col-span-4 min-w-0">
          <WalletIdentifier
            icon={<GnosisSafeIcon size={18} color="var(--color-icon-secondary)" />}
            name={walletName}
            badge={<BlockchainIconStack blockchain={wallet.blockchain} />}
          />
        </div>

        {/* Cols 5-6: Balance (Anchored right) */}
        <div className="col-span-2 flex justify-end">
          <div className="flex items-baseline">
            {wallet.USDBalance > 0 ? (
              <>
                <span className="font-mono text-xs text-[var(--color-text-disabled)] mr-1 translate-y-[-1px] tracking-tight">$</span>
                <span className="font-mono text-2xl font-semibold text-[var(--color-text-primary)] tracking-tightest leading-none">
                  {formatDollars(wallet.USDBalance)}
                </span>
                <span className="font-mono text-sm text-[var(--color-text-secondary)] tracking-tightest leading-none ml-0.5">
                  .{formatCents(wallet.USDBalance)}
                </span>
              </>
            ) : (
              <div className="flex items-baseline">
                <span className="font-mono text-xs text-[var(--color-text-disabled)] mr-1 translate-y-[-1px] tracking-tight">$</span>
                <span className="font-mono text-2xl font-semibold text-[var(--color-text-disabled)] tracking-tightest leading-none">0</span>
                <span className="font-mono text-sm text-[var(--color-text-disabled)] tracking-tightest leading-none ml-0.5 opacity-60">.00</span>
              </div>
            )}
          </div>
        </div>

        {/* Cols 7-8: 24h Change (Anchored left) */}
        <div className="col-span-2 flex items-center justify-start gap-2">
          {wallet.percent_change_24h !== 0 ? (
            <div
              className="flex items-center gap-1 font-mono text-xs font-semibold tracking-tight"
              style={{ color: isPositive ? "var(--color-text-success)" : "var(--color-text-danger)" }}
            >
              {isPositive ? <RiArrowUpLine size={12} /> : <RiArrowDownLine size={12} />}
              <span>{formatPercent(wallet.percent_change_24h)}%</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 font-mono text-xs font-semibold tracking-tight text-[var(--color-text-disabled)]">
              <RiNumber0 size={12} />
              <span>0.00%</span>
            </div>
          )}

        </div>

        {/* Cols 9-12: Actions (Align right) */}
        <div className="col-span-4 flex items-center justify-end gap-1.5">
          <motion.div
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 6 }}
            transition={{ ...SPRING_BUTTON, delay: hovered ? 0 : 0 }}
          >
            <Tooltip content="Deposit" placement="top" delay={300}>
              <IconButton
                size="sm"
                variant="neutral"
                appearance="filled"
                shape="rounded"
                flat
                icon={<RiQrCodeLine />}
                aria-label="Deposit"
                onClick={(e) => { e.stopPropagation(); onDeposit?.(e.currentTarget.getBoundingClientRect()); }}
              />
            </Tooltip>
          </motion.div>
          <motion.div
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 6 }}
            transition={{ ...SPRING_BUTTON, delay: hovered ? 0.05 : 0 }}
          >
            <Tooltip content="Send" placement="top" delay={300}>
              <IconButton
                size="sm"
                variant="neutral"
                appearance="filled"
                shape="rounded"
                flat
                icon={<RiSendPlaneLine />}
                aria-label="Send"
                onClick={(e) => { e.stopPropagation(); onSend?.(e.currentTarget.getBoundingClientRect()); }}
              />
            </Tooltip>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
