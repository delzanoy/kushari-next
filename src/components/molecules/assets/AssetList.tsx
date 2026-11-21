import { Asset } from "./types";
import { AssetCard } from "./AssetCard";

export function AssetList({ assets }: { assets: Asset[] }) {
  return (
    <div className="flex flex-col w-full">
      {assets.map((asset) => (
        <AssetCard key={asset.uniqueId} asset={asset} />
      ))}
    </div>
  );
}
