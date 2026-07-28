"use client";

import {
  siEthereum, siBinance, siSolana, siPolygon,
  siOptimism, siCoinbase, siCardano, siPolkadot,
  siFantom, siLitecoin, siRipple,
} from "simple-icons";
import type { SimpleIcon } from "simple-icons";
import { BlockchainIcon } from "@/components/ui/BlockchainIcon";
import { Tooltip } from "@/components/atoms/Tooltip";
import type { BlockchainInfo } from "@/components/molecules/wallet/types";

// ─── Chain → icon map ─────────────────────────────────────────────────────────

const CHAIN_ICON_MAP: Record<string, SimpleIcon> = {
  ethereum:  siEthereum,
  eth:       siEthereum,
  bsc:       siBinance,
  bnb:       siBinance,
  polygon:   siPolygon,
  matic:     siPolygon,
  solana:    siSolana,
  sol:       siSolana,
  optimism:  siOptimism,
  op:        siOptimism,
  base:      siCoinbase,
  cardano:   siCardano,
  ada:       siCardano,
  polkadot:  siPolkadot,
  dot:       siPolkadot,
  fantom:    siFantom,
  ftm:       siFantom,
  litecoin:  siLitecoin,
  ltc:       siLitecoin,
  xrp:       siRipple,
  ripple:    siRipple,
};

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BlockchainIconStackProps {
  /** Accepts the raw `WalletSummary.blockchain` shape, or a plain string array */
  blockchain: string | string[] | BlockchainInfo[];
  /**
   * Icon size in px. Drives the BlockchainIcon size and the overlap amount.
   * 16 for section headers, 12 for wallet-icon badges. Default 16.
   */
  size?: number;
  /** Maximum icons shown before truncation. Default 4. */
  max?: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normalizeChains(blockchain: string | string[] | BlockchainInfo[]): string[] {
  if (typeof blockchain === "string") return [blockchain];
  if (blockchain.length === 0) return [];
  if (typeof blockchain[0] === "string") return blockchain as string[];
  return (blockchain as BlockchainInfo[]).map((b) => b.blockchain);
}

// ─── Component ────────────────────────────────────────────────────────────────

export function BlockchainIconStack({
  blockchain,
  size = 16,
  max = 4,
}: BlockchainIconStackProps) {
  const chains = normalizeChains(blockchain).slice(0, max);
  if (chains.length === 0) return null;

  // Overlap: -4px for 16px icons (matching -space-x-1), proportional for smaller
  const overlap = size >= 16 ? -4 : -1;

  return (
    <div className="inline-flex items-center">
      {chains.map((chain, i) => {
        const icon = CHAIN_ICON_MAP[chain.toLowerCase()];
        if (!icon) return null;

        return (
          <div key={i} style={{ marginLeft: i === 0 ? 0 : overlap }}>
            <Tooltip content={icon.title} placement="top" delay={200}>
              <BlockchainIcon icon={icon} size={size} />
            </Tooltip>
          </div>
        );
      })}
    </div>
  );
}
