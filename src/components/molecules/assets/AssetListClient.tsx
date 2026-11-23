"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import {
  RiTokenSwapLine,
  RiWalletLine,
  RiNetworkLine,
} from "@remixicon/react";
import { Asset } from "./types";
import { AssetList } from "./AssetList";
import { FilterDropdown } from "@/components/molecules/FilterDropdown";
import { Button } from "@/components/atoms/Button";
import { BlockchainIconStack } from "@/components/atoms/BlockchainIconStack";
import { walletIcon } from "@/components/atoms/WalletIcon";

interface AssetListClientProps {
  assets: Asset[];
  initialWalletFilter?: string;
}

export function AssetListClient({
  assets,
  initialWalletFilter,
}: AssetListClientProps) {
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [selectedWallets, setSelectedWallets] = useState<string[]>([]);
  const [selectedBlockchains, setSelectedBlockchains] = useState<string[]>([]);
  const hasAppliedInitialFilter = useRef(false);

  const toggleSelection = (
    value: string,
    state: string[],
    setState: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setState((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  const assetsForTokenOptions = useMemo(() => {
    return assets.filter((asset) => {
      const walletMatch =
        selectedWallets.length === 0 ||
        asset.wallets.some((wallet) =>
          selectedWallets.includes(wallet.walletId.toString())
        );

      const blockchainMatch =
        selectedBlockchains.length === 0 ||
        (typeof asset.blockchain === "string"
          ? selectedBlockchains.includes(asset.blockchain)
          : asset.blockchain.some((bc) =>
            selectedBlockchains.includes(bc.blockchain)
          ));

      return walletMatch && blockchainMatch;
    });
  }, [assets, selectedWallets, selectedBlockchains]);

  const assetsForWalletOptions = useMemo(() => {
    return assets.filter((asset) => {
      const tokenMatch =
        selectedTokens.length === 0 || selectedTokens.includes(asset.symbol);

      const blockchainMatch =
        selectedBlockchains.length === 0 ||
        (typeof asset.blockchain === "string"
          ? selectedBlockchains.includes(asset.blockchain)
          : asset.blockchain.some((bc) =>
            selectedBlockchains.includes(bc.blockchain)
          ));

      return tokenMatch && blockchainMatch;
    });
  }, [assets, selectedTokens, selectedBlockchains]);

  const assetsForBlockchainOptions = useMemo(() => {
    return assets.filter((asset) => {
      const tokenMatch =
        selectedTokens.length === 0 || selectedTokens.includes(asset.symbol);

      const walletMatch =
        selectedWallets.length === 0 ||
        asset.wallets.some((wallet) =>
          selectedWallets.includes(wallet.walletId.toString())
        );

      return tokenMatch && walletMatch;
    });
  }, [assets, selectedTokens, selectedWallets]);

  const tokenOptions = useMemo(() => {
    let uniqueAssets = Array.from(
      new Map(
        assetsForTokenOptions.map((asset) => [
          asset.assetId || asset.symbol,
          asset,
        ])
      ).values()
    );

    uniqueAssets = uniqueAssets.sort((a, b) => {
      const nameA = a.name || a.fullName || a.symbol || "";
      const nameB = b.name || b.fullName || b.symbol || "";
      return nameA.localeCompare(nameB);
    });

    return uniqueAssets.map((asset) => ({
      value: asset.symbol || String(asset.assetId || ""),
      label: asset.fullName || asset.name || asset.symbol || "",
      description: asset.symbol || "",
      icon: <i className={`cf cf-${(asset.symbol || "").toLowerCase()} text-lg`} />,
    }));
  }, [assetsForTokenOptions]);

  const walletOptions = useMemo(() => {
    const allWallets = assetsForWalletOptions.flatMap((asset) => asset.wallets || []);
    let uniqueWallets = Array.from(
      new Map(allWallets.map((wallet) => [wallet.walletId, wallet])).values()
    );

    uniqueWallets = uniqueWallets.sort((a, b) => {
      const nameA = a.name || `Wallet ${a.walletId}`;
      const nameB = b.name || `Wallet ${b.walletId}`;
      return nameA.localeCompare(nameB);
    });

    return uniqueWallets.map((wallet) => ({
      value: wallet.walletId.toString(),
      label: wallet.name || `Wallet ${wallet.walletId}`,
      icon: walletIcon(wallet.walletType),
    }));
  }, [assetsForWalletOptions]);

  useEffect(() => {
    if (
      initialWalletFilter &&
      walletOptions.length > 0 &&
      !hasAppliedInitialFilter.current
    ) {
      const matchingWallet = walletOptions.find(
        (option) =>
          option.label.toLowerCase() === initialWalletFilter.toLowerCase()
      );

      if (matchingWallet) {
        setSelectedWallets((prev) => {
          if (!prev.includes(matchingWallet.value)) {
            hasAppliedInitialFilter.current = true;
            return [matchingWallet.value];
          }
          return prev;
        });
      }
    }
  }, [initialWalletFilter, walletOptions]);

  const blockchainOptions = useMemo(() => {
    const allBlockchains = assetsForBlockchainOptions.flatMap((asset) => {
      if (typeof asset.blockchain === "string") {
        return [asset.blockchain];
      } else if (Array.isArray(asset.blockchain)) {
        return asset.blockchain.map((bc) => bc.blockchain);
      }
      return [];
    });

    let uniqueBlockchains = Array.from(
      new Set(allBlockchains.filter((bc) => bc))
    );

    uniqueBlockchains = uniqueBlockchains.sort((a, b) =>
      (a || "").toLowerCase().localeCompare((b || "").toLowerCase())
    );

    return uniqueBlockchains.map((blockchain) => ({
      value: blockchain,
      label: blockchain,
      icon: <BlockchainIconStack blockchain={blockchain} size={16} max={1} />,
    }));
  }, [assetsForBlockchainOptions]);

  const filteredAssets = useMemo(() => {
    if (
      selectedTokens.length === 0 &&
      selectedWallets.length === 0 &&
      selectedBlockchains.length === 0
    ) {
      return assets;
    }

    return assets.filter((asset) => {
      const tokenMatch =
        selectedTokens.length === 0 || selectedTokens.includes(asset.symbol);

      const walletMatch =
        selectedWallets.length === 0 ||
        asset.wallets.some((wallet) =>
          selectedWallets.includes(wallet.walletId.toString())
        );

      const blockchainMatch =
        selectedBlockchains.length === 0 ||
        (typeof asset.blockchain === "string"
          ? selectedBlockchains.includes(asset.blockchain)
          : asset.blockchain.some((bc) =>
            selectedBlockchains.includes(bc.blockchain)
          ));

      return tokenMatch && walletMatch && blockchainMatch;
    });
  }, [assets, selectedTokens, selectedWallets, selectedBlockchains]);

  const totalCount = assets.length;
  const showingCount = filteredAssets.length;
  const hasActiveFilters =
    selectedTokens.length > 0 ||
    selectedWallets.length > 0 ||
    selectedBlockchains.length > 0;

  return (
    <div className="flex flex-col items-start gap-4 self-stretch">
      <div className="flex items-center justify-between self-stretch">
        <div className="flex items-start gap-4">
          <FilterDropdown
            label="Token"
            buttonIcon={<RiTokenSwapLine size={16} />}
            options={tokenOptions.map((opt) => ({
              value: opt.value,
              displayProps: { fullName: opt.label, icon: opt.icon, metaData: opt.description },
            }))}
            selectedValues={selectedTokens}
            onSelectionChange={setSelectedTokens}
          />

          <FilterDropdown
            label="Wallet"
            buttonIcon={<RiWalletLine size={16} />}
            options={walletOptions.map((opt) => ({
              value: opt.value,
              displayProps: { fullName: opt.label, icon: opt.icon },
            }))}
            selectedValues={selectedWallets}
            onSelectionChange={setSelectedWallets}
          />

          <FilterDropdown
            label="Network"
            buttonIcon={<RiNetworkLine size={16} />}
            options={blockchainOptions.map((opt) => ({
              value: opt.value,
              displayProps: { fullName: opt.label, icon: opt.icon },
            }))}
            selectedValues={selectedBlockchains}
            onSelectionChange={setSelectedBlockchains}
          />
        </div>

        <div className="flex items-center gap-4">
          {hasActiveFilters && (
            <Button
              variant="neutral"
              appearance="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => {
                setSelectedTokens([]);
                setSelectedWallets([]);
                setSelectedBlockchains([]);
              }}
            >
              Clear all
            </Button>
          )}
          <span className="text-sm text-[var(--color-text-muted)] tracking-tight">
            {hasActiveFilters ? (
              <>
                Showing <span className="font-medium text-[var(--color-text-primary)]">{showingCount}</span> of{" "}
                <span className="font-medium text-[var(--color-text-primary)]">{totalCount}</span> assets
              </>
            ) : (
              <>
                Showing all <span className="font-medium text-[var(--color-text-primary)]">{totalCount}</span> assets
              </>
            )}
          </span>
        </div>
      </div>

      <div className="flex flex-col w-full mt-4">
        <div className="flex w-full items-center gap-4 py-2 px-4 border-b border-[var(--color-border-subtle)] text-xs text-[var(--color-text-muted)]">
          <span className="w-[242px] tracking-tight shrink-0">Token & Network</span>
          <div className="flex w-[248px] items-center justify-between shrink-0">
            <span className="w-[116px] text-right tracking-tight">Price</span>
            <span className="w-[116px] tracking-tight text-left">Last 24 Hrs</span>
          </div>
          <div className="flex w-[336px] items-center justify-between shrink-0">
            <span className="w-[160px] text-right tracking-tight">Token value</span>
            <span className="w-[160px] text-left">USD</span>
          </div>
          <span className="w-[146px] tracking-tight shrink-0">Wallets</span>
        </div>
        <AssetList assets={filteredAssets} />
      </div>

      <div className="flex items-start justify-end text-sm text-[var(--color-text-muted)] self-stretch pt-4">
        {hasActiveFilters ? (
          <span className="tracking-tight">
            Showing <span className="font-medium text-[var(--color-text-primary)]">{showingCount}</span> of{" "}
            <span className="font-medium text-[var(--color-text-primary)]">{totalCount}</span> assets
          </span>
        ) : (
          <span className="tracking-tight">
            Showing all <span className="font-medium text-[var(--color-text-primary)]">{totalCount}</span> assets
          </span>
        )}
      </div>
    </div>
  );
}
