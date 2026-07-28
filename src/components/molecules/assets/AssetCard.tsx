import { AssetCardProps } from "./types";
import { ExpandableAsset } from "./ExpandableAsset";
import { NonExpandableAsset } from "./NonExpandableAsset";

export function AssetCard({ asset }: AssetCardProps) {
  return asset.wallets.length > 1 ? (
    <ExpandableAsset asset={asset} />
  ) : (
    <NonExpandableAsset asset={asset} />
  );
}
