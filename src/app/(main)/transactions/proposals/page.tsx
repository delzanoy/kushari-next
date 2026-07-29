import { getProposals, getAddresses, getWallets } from "@/lib/server-data";
import { transformApiDataToProposals } from "@/components/molecules/transactions/proposals/utils/transformProposals";
import ProposalListClient from "@/components/molecules/transactions/proposals/ProposalListClient";
import { Suspense } from "react";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProposalsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const rawProposals = await getProposals();
  const addresses = await getAddresses();
  const wallets = await getWallets().catch(() => []);

  const proposals = transformApiDataToProposals(rawProposals);

  // Get unique classifications for filtering
  const uniqueClassifications: string[] = Array.from(
    new Set(proposals.map((p) => p.classification))
  ).filter(Boolean) as string[];

  // Extract query filters if present
  const walletFilter = params.wallet as string | undefined;

  return (
    <div className="min-h-full bg-black flex flex-col pt-[52px] pb-24 px-8 overflow-x-hidden selection:bg-cyan-500/30">
      <div className="w-full max-w-[1040px] mx-auto">
        <Suspense fallback={<div className="animate-pulse w-full h-[400px] bg-[rgba(255,255,255,0.03)] rounded-[16px]" />}>
          <ProposalListClient
            proposals={proposals}
            addresses={addresses}
            wallets={wallets}
            uniqueClassifications={uniqueClassifications}
            initialWalletFilter={walletFilter}
          />
        </Suspense>
      </div>
    </div>
  );
}
