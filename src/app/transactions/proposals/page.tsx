import { Proposal, ProposalWithCalculations, ProposalCategory } from "./types";
import ProposalListClient from "./ProposalListClient";
import { getProposals, getAddresses } from "../../api/server-data";
import { transformApiDataToProposals } from "./transformProposals";

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}


export default async function TransactionsProposalsPage({ searchParams }: PageProps) {
  const addresses = await getAddresses();
  const proposals = await getProposals();

  const typedProposals = proposals as Proposal[];

  // Calculate USD values and extend transactions
  const proposalsWithCalculations: ProposalWithCalculations[] =
    typedProposals.map(proposal => {
      const outgoingUSD = proposal.outTokens && proposal.outUSDPrice
        ? proposal.outTokens * proposal.outUSDPrice
        : 0;

      return {
        ...proposal,
        outgoingUSD
      };
    });

  // Extract the active tab from URL if present
  const tabParam = searchParams.tab as string | undefined;

  const getInitialTab = (): ProposalCategory | undefined => {
    if (!tabParam) return undefined;

    const tabMapping: { [key: string]: ProposalCategory } = {
      'needs-approval': ProposalCategory.NEEDS_APPROVAL,
      'ready-to-execute': ProposalCategory.READY_TO_EXECUTE,
      'discarded': ProposalCategory.DISCARDED
    };

    return tabMapping[tabParam];
  };

  // Get unique classifications for filtering
  const uniqueClassifications = Array.from(
    new Set(typedProposals.map((tx: Proposal) => tx.classification))
  );

  const walletFilter = searchParams.wallet as string | undefined;
  console.log("Filter : " + walletFilter);

  return (
    <ProposalListClient
      proposals={transformApiDataToProposals(proposalsWithCalculations)}
      addresses={addresses}
      uniqueClassifications={uniqueClassifications}
      initialWalletFilter={walletFilter}
      initialTab={getInitialTab()}
    />
  );
}
