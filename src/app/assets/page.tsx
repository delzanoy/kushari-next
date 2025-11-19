import AssetListClient from "./AssetListClient";
import { getAssets } from "../api/server-data";

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function AssetsPage({ searchParams }: PageProps) {
  const [assets] = await Promise.all([
    getAssets()
  ])

  const initialWalletFilter = searchParams.wallet as string | undefined;

  return (
    <div className="flex flex-col w-full max-w-[1040px] mx-auto items-start gap-16 flex-[1_0_0]">
      <h1 className="text-[#F8FCFF] font-[Figtree] text-[26px] not-italic font-medium leading-[normal] tracking-[1.04px] pt-[58px]">Assets</h1>
      <AssetListClient assets={assets.reverse()} initialWalletFilter={initialWalletFilter} />
    </div>
  );
}