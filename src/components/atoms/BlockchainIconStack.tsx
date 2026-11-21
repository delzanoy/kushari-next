"use client";

import {
  siEthereum, siBinance, siSolana, siPolygon,
  siOptimism, siCoinbase, siCardano, siPolkadot,
  siFantom, siLitecoin, siRipple, siBitcoin, siDogecoin
} from "simple-icons";
import type { SimpleIcon } from "simple-icons";
import { BlockchainIcon } from "@/components/ui/BlockchainIcon";
import { Tooltip } from "@/components/atoms/Tooltip";
import type { BlockchainInfo } from "@/components/molecules/wallet/types";

// ─── Custom Chain Icon Definitions ──────────────────────────────────────────

const siGnosis: SimpleIcon = {
  title: "Gnosis Chain",
  slug: "gnosis",
  hex: "00B4AD",
  source: "https://gnosis.io",
  svg: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Gnosis Chain</title><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z"/></svg>',
  path: "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z",
};

const siArbitrum: SimpleIcon = {
  title: "Arbitrum",
  slug: "arbitrum",
  hex: "28A0F0",
  source: "https://arbitrum.io",
  svg: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Arbitrum</title><path d="M12 2L2 7.5v9L12 22l10-5.5v-9L12 2zm0 2.3l7.8 4.3v7.8L12 20.7l-7.8-4.3V8.6L12 4.3z"/></svg>',
  path: "M12 2L2 7.5v9L12 22l10-5.5v-9L12 2zm0 2.3l7.8 4.3v7.8L12 20.7l-7.8-4.3V8.6L12 4.3z",
};

const siAvalanche: SimpleIcon = {
  title: "Avalanche",
  slug: "avalanche",
  hex: "E84142",
  source: "https://avax.network",
  svg: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Avalanche</title><path d="M12 2L2 20h20L12 2zm0 4.5l6.5 11.5h-13L12 6.5z"/></svg>',
  path: "M12 2L2 20h20L12 2zm0 4.5l6.5 11.5h-13L12 6.5z",
};

// ─── Chain → icon map ─────────────────────────────────────────────────────────

const CHAIN_ICON_MAP: Record<string, SimpleIcon> = {
  ethereum:       siEthereum,
  eth:            siEthereum,
  gnosis:         siGnosis,
  "gnosis chain": siGnosis,
  "gnosis-chain": siGnosis,
  xdai:           siGnosis,
  gno:            siGnosis,
  arbitrum:       siArbitrum,
  arb:            siArbitrum,
  avalanche:      siAvalanche,
  avax:           siAvalanche,
  bsc:            siBinance,
  bnb:            siBinance,
  binance:        siBinance,
  polygon:        siPolygon,
  matic:          siPolygon,
  solana:         siSolana,
  sol:            siSolana,
  optimism:       siOptimism,
  op:             siOptimism,
  base:           siCoinbase,
  bitcoin:        siBitcoin,
  btc:            siBitcoin,
  dogecoin:       siDogecoin,
  doge:           siDogecoin,
  cardano:        siCardano,
  ada:            siCardano,
  polkadot:       siPolkadot,
  dot:            siPolkadot,
  fantom:         siFantom,
  ftm:            siFantom,
  litecoin:       siLitecoin,
  ltc:            siLitecoin,
  xrp:            siRipple,
  ripple:         siRipple,
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
  if (!blockchain) return [];
  if (typeof blockchain === "string") {
    if (blockchain.includes(",")) {
      return blockchain.split(",").map((s) => s.trim()).filter(Boolean);
    }
    return [blockchain.trim()];
  }
  if (!Array.isArray(blockchain) || blockchain.length === 0) return [];
  if (typeof blockchain[0] === "string") return (blockchain as string[]).map((s) => s.trim()).filter(Boolean);
  return (blockchain as BlockchainInfo[])
    .map((b) => (typeof b === "string" ? b : b?.blockchain))
    .filter(Boolean)
    .map((s) => s.trim());
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
        const cleanKey = chain.toLowerCase().trim();
        const strippedKey = cleanKey.replace(/[\s_-]+/g, "");
        const icon = CHAIN_ICON_MAP[cleanKey] || CHAIN_ICON_MAP[strippedKey];
        if (!icon) return null;

        return (
          <div key={i} style={{ marginLeft: i === 0 ? 0 : overlap }}>
            <Tooltip content={chain || icon.title} placement="top" delay={200}>
              <BlockchainIcon icon={icon} size={size} />
            </Tooltip>
          </div>
        );
      })}
    </div>
  );
}

