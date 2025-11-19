import AssetCard from "./AssetCard";
import { Asset } from "./types";

export default function AssetList({ assets }: { assets: Asset[] }) {
    return (
        <div className="flex flex-col-reverse">
            {assets.map((asset) => (
                <AssetCard key={asset.uniqueId} asset={asset} />
            ))}
        </div>
    );
}