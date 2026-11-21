"use client";

import { useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Heading } from "@/components/atoms/Typography";
import { useAssets } from "@/hooks/useData";
import { useDemoMode } from "@/lib/demo-mode";
import { AssetListClient } from "@/components/molecules/assets/AssetListClient";

const SPRING_CARD = { type: "spring", stiffness: 180, damping: 24, mass: 1.1 } as const;

function AssetsPageContent() {
  const { demoMode } = useDemoMode();
  const { assets: apiAssets, isLoading } = useAssets();
  const searchParams = useSearchParams();
  const initialWalletFilter = searchParams.get("wallet") || undefined;

  const assets = useMemo(() => {
    if (!demoMode) return [];
    return (apiAssets || []);
  }, [apiAssets, demoMode]);

  const showLoading = demoMode && isLoading && assets.length === 0;
  const showList = assets.length > 0;
  const showEmpty = (!demoMode) || (demoMode && !isLoading && assets.length === 0);

  return (
    <>
      <div className="mb-8 flex items-center self-stretch h-8">
        <h1 className="text-[var(--color-text-primary)] text-[26px] font-medium tracking-tight">
          Assets
        </h1>
      </div>

      {showLoading && <LoadingRows />}

      {showList && (
        <AssetListClient assets={assets} initialWalletFilter={initialWalletFilter} />
      )}

      {showEmpty && (
        <div className="flex flex-col items-center justify-center py-24 text-neutral-500">
          No assets found.
        </div>
      )}
    </>
  );
}

export default function AssetsPage() {
  return (
    <div className="min-h-full bg-black flex flex-col pt-[52px] pb-24 px-8 overflow-x-hidden selection:bg-cyan-500/30">
      <div className="w-full max-w-[1040px] mx-auto">
        <Suspense fallback={<LoadingRows />}>
          <AssetsPageContent />
        </Suspense>
      </div>
    </div>
  );
}

function LoadingRows() {
  return (
    <motion.div
      key="loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.1 } }}
      className="flex flex-col gap-3 mt-8"
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="w-full h-[72px] rounded-[16px] animate-pulse"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "0.5px solid rgba(255,255,255,0.05)",
          }}
        />
      ))}
    </motion.div>
  );
}
