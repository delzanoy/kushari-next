import ExpandableAsset from "./ExpandableAsset";
import NonExpandableAsset from "./NonExpandableAsset";
import { AssetCardProps } from "./types";

export default function AssetCard({ asset }: AssetCardProps) {
  return asset.wallets.length > 1 ? (
    <ExpandableAsset asset={asset} />
  ) : (
    <NonExpandableAsset asset={asset} />
  );
}
