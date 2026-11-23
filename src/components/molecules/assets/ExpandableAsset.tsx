"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiArrowUpLine,
  RiArrowDownLine,
  RiExpandUpDownLine,
  RiExternalLinkLine,
  RiSafeLine,
  RiWalletLine,
} from "@remixicon/react";
import { GnosisSafeIcon } from "@/media/icons/GnosisSafeIcon";
import { Tooltip } from "@/components/atoms/Tooltip";
import { IconButton } from "@/components/atoms/IconButton";
import { BlockchainIconStack } from "@/components/atoms/BlockchainIconStack";
import { formatDollars, formatCents, formatPercent } from "@/lib/formatters";
import { AssetBreakdown } from "./AssetBreakdown";
import { Asset, WalletInfo, getCoinMarketCapUrl } from "./types";
import { cn } from "@/lib/utils";
import { pressable } from "@/lib/pressable";

interface ExpandableAssetProps {
  asset: Asset;
}

export function ExpandableAsset({ asset }: ExpandableAssetProps) {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const symbol = asset.symbol || "";
  const symbolLower = symbol.toLowerCase();
  const fullName = asset.fullName || asset.name || symbol;
  const price = asset.price ?? 0;
  const percentChange = asset.percent_change_24h ?? 0;
  const totalTokens = asset.totalTokens ?? 0;
  const usdValue = asset.USD ?? 0;
  const wallets = asset.wallets || [];

  const renderWalletTypeCounts = (walletsList: WalletInfo[], isHovered: boolean) => {
    const counts = { 1: 0, 2: 0, 3: 0 } as Record<number, number>;
    walletsList.forEach((w) => {
      if (w && [1, 2, 3].includes(w.walletType)) counts[w.walletType]++;
    });

    const iconColor = "text-[var(--color-icon-muted)]";
    const textColor = isHovered ? "text-[var(--color-text-brand)]" : "text-[var(--color-text-secondary)]";
    const gnosisColor = isHovered ? "var(--color-icon-brand)" : "var(--color-icon-muted)";

    return (
      <div className="flex gap-2">
        {[1, 2, 3].map(
          (type) =>
            counts[type] > 0 && (
              <div key={type} className={cn("flex items-center gap-2 transition-colors duration-200")}>
                {type === 1 && <RiSafeLine size={16} className={iconColor} />}
                {type === 2 && <GnosisSafeIcon size={16} color={gnosisColor} />}
                {type === 3 && <RiWalletLine size={16} className={iconColor} />}
                <span className={cn("text-sm font-medium tracking-tight", textColor)}>
                  {counts[type]}
                </span>
              </div>
            )
        )}
      </div>
    );
  };

  return (
    <motion.div {...pressable({ expanded })}
      className={cn(
        "group relative flex w-full flex-col px-4 py-5 cursor-pointer",
        "border-b transition-colors duration-200",
        hovered ? "bg-[rgba(255,255,255,0.06)] border-[var(--color-border-default)]" : "border-[var(--color-border-subtle)]"
      )}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center gap-4 w-full justify-between relative z-10">
        <div className="flex w-[242px] items-center gap-3 shrink-0">
          <div className="w-8 h-8 shrink-0 relative flex items-center justify-center rounded-full bg-[var(--color-surface-surface)] border border-[var(--color-border-default)]">
            <i className={`cf cf-${symbolLower} text-xl text-[var(--color-text-primary)]`} />
            <div className="absolute -bottom-4 left-[22px]">
              <BlockchainIconStack blockchain={asset.blockchain} size={14} max={3} />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-medium tracking-tight text-[var(--color-text-primary)]">
              {fullName}
            </span>
            <span className="text-[10px] font-thin uppercase tracking-widest text-[var(--color-text-muted)]">
              {symbol}
            </span>
          </div>
        </div>

        <div className="flex w-[248px] items-center justify-between shrink-0">
          <span className="text-sm font-light tracking-tight text-[var(--color-text-primary)] w-[116px] text-right truncate">
            ${price.toLocaleString(undefined, { maximumFractionDigits: 6 })}
          </span>
          <div className="flex items-center justify-start gap-2 w-[116px]">
            {percentChange < 0 ? (
              <div className="flex items-center gap-1">
                <RiArrowDownLine size={14} className="text-[var(--color-text-danger)]" />
                <span className="font-mono text-xs tracking-wider text-[var(--color-text-danger)]">
                  {formatPercent(Math.abs(percentChange))}%
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <RiArrowUpLine size={14} className="text-[var(--color-text-success)]" />
                <span className="font-mono text-xs tracking-wider text-[var(--color-text-success)]">
                  {formatPercent(percentChange)}%
                </span>
              </div>
            )}
            <motion.div
              animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.8 }}
              className="w-6 h-6 flex items-center justify-center"
            >
              <Tooltip content="CoinMarketCap" placement="top">
                <IconButton
                  size="sm"
                  variant="neutral"
                  appearance="ghost"
                  flat
                  icon={<RiExternalLinkLine />}
                  aria-label="View on CoinMarketCap"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(getCoinMarketCapUrl(asset), "_blank");
                  }}
                />
              </Tooltip>
            </motion.div>
          </div>
        </div>

        <div className="flex w-[336px] items-baseline gap-4 shrink-0 justify-between">
          <span className="truncate w-[160px] text-right text-sm font-semibold tracking-tight text-[var(--color-text-primary)]">
            {totalTokens.toLocaleString(undefined, { maximumFractionDigits: 6 })}
          </span>
          <div className="flex items-baseline gap-2 w-[160px]">
            <div className="flex items-baseline">
              <span className="text-sm font-light tracking-tight text-[var(--color-text-primary)]">
                ${formatDollars(usdValue)}
              </span>
              <span className="text-xs font-thin tracking-tight text-[var(--color-text-muted)]">
                .{formatCents(usdValue)}
              </span>
            </div>
            {asset.percentageShareInUSD ? (
              <span className="text-xs font-thin tracking-tight text-[var(--color-text-muted)]">
                {formatPercent(asset.percentageShareInUSD)}%
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex w-[146px] items-center gap-4 shrink-0">
          {renderWalletTypeCounts(wallets, hovered)}
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="flex items-center justify-center"
          >
            <RiExpandUpDownLine size={16} className={cn("transition-colors duration-200", hovered ? "text-[var(--color-icon-brand)]" : "text-[var(--color-icon-muted)]")} />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && <AssetBreakdown wallets={wallets} />}
      </AnimatePresence>
    </motion.div>
  );
}
