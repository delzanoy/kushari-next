import { SentArrowIcon, ReceivedArrowIcon, InteractedArrowIcon, HashIcon, VaultIcon, GnosisSafeIcon, TrackedWalletIcon, GroupIcon, AddressIcon } from "@/app/components/icons";
import InlineDropdown from "@/app/components/InlineDropdown";
import { useState } from "react";
import { Transaction } from "./types";
import { AddressCardProps } from "@/app/address-book/addresses/types";
import { formatDollars, formatCents } from "./../../components/helpers";
import { determineMultirecipients } from "./calculations";
import { format } from "date-fns";
import {
  BSCIcon,
  EthereumIcon,
  GnosisIcon,
  OPTIMISMIcon,
  PolygonIcon,
  SOLIcon
} from "./../../components/icons";

interface TransactionHeaderProps {
  transaction: Transaction & { showDate?: boolean; isFirstOfDate?: boolean };
  uniqueClassifications: string[];
  addresses: AddressCardProps[];
  expanded: boolean;
}

const getBlockchainIcon = (blockchainName: string) => {
  switch (blockchainName) {
    case "BSC":
      return <BSCIcon className="w-3.5 h-3.5 shrink-0 absolute inline-flex items-center -space-x-0.25 bottom-[9px] left-[9px]" />;
    case "Ethereum":
      return <EthereumIcon className="w-3.5 h-3.5 shrink-0 absolute inline-flex items-center -space-x-0.25 bottom-[9px] left-[9px]" />;
    case "Gnosis chain":
      return <GnosisIcon className="w-3.5 h-3.5 shrink-0 absolute inline-flex items-center -space-x-0.25 bottom-[9px] left-[9px]" />;
    case "Optimism":
      return <OPTIMISMIcon className="w-3.5 h-3.5 shrink-0 absolute inline-flex items-center -space-x-0.25 bottom-[9px] left-[9px]" />;
    case "Polygon":
      return <PolygonIcon className="w-3.5 h-3.5 shrink-0 absolute inline-flex items-center -space-x-0.25 bottom-[9px] left-[9px]" />;
    case "Solana":
      return <SOLIcon className="w-3.5 h-3.5 shrink-0 absolute inline-flex items-center -space-x-0.25 bottom-[9px] left-[9px]" />;
    default:
      return null;
  }
};

export default function TransactionHeader({ transaction, uniqueClassifications, addresses, expanded }: TransactionHeaderProps) {
  const [selectedClassification, setSelectedClassification] = useState<string | undefined>(transaction.classification);

  const handleClassificationChange = (newClassification: string) => {
    setSelectedClassification(newClassification);
  };

  const handleClassificationClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const determineRecipientIcon = (): React.ReactNode => {
    if (transaction.multiRecipient && Array.isArray(transaction.recipients)) {
      return <GroupIcon className="w-3.5 h-3.5 shrink-0 aspect-square opacity-80" />;
    }
    if (transaction.recipients && typeof transaction.recipients === "object") {
      return <AddressIcon className="w-3.5 h-3.5 shrink-0 aspect-square opacity-80" />;
    }
    if (typeof transaction.recipients === "string") {
      return <HashIcon className="w-3.5 h-3.5 shrink-0 aspect-square opacity-80" />;
    }
    return <HashIcon className="w-3.5 h-3.5 shrink-0 aspect-square opacity-80" />;
  };

  const determineTransactionType = (incoming: boolean, outgoing: boolean) => {
    if (incoming && outgoing) {
      return {
        type: 'Interacted',
        icon: <InteractedArrowIcon className="shrink-0 aspect-square h-4.5 w-4.5 opacity-80" />
      }
    } else if (incoming) {
      return {
        type: 'Received',
        icon: <ReceivedArrowIcon className="shrink-0 aspect-square h-4.5 w-4.5 opacity-80" />
      }
    } else {
      return {
        type: 'Sent',
        icon: <SentArrowIcon className="shrink-0 aspect-square h-4.5 w-4.5 opacity-80" />
      }
    }
  }

  const renderWalletIcon = (walletType: number) => {
    switch (walletType) {
      case 1:
        return <VaultIcon className="w-3.5 h-3.5 shrink-0 aspect-square opacity-80" />;
      case 2:
        return <GnosisSafeIcon className="w-3.5 h-3.5 shrink-0 aspect-square opacity-80" />;
      case 3:
        return <TrackedWalletIcon className="w-3.5 h-3.5 shrink-0 aspect-square opacity-80" />;
      default:
        return null;
    }
  };

  const recipeints = determineMultirecipients(transaction.multiRecipient, transaction.recipients, addresses);
  const txType = determineTransactionType(transaction.incoming, transaction.outgoing);

  const inTokenSymbol = transaction.inTokenSymbol || '';
  const outTokenSymbol = transaction.outTokenSymbol || '';
  const inTokens = transaction.inTokens?.toLocaleString() || '0';
  const outTokens = transaction.outTokens?.toLocaleString() || '0';

  // Date formatting functions - ensure they're consistent
  const formatDisplayDate = (timestamp: string | number | Date) => {
    try {
      const date = new Date(timestamp);
      return format(date, 'MMM do yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  const formatHoverDate = (timestamp: string | number | Date) => {
    try {
      const date = new Date(timestamp);
      return format(date, 'MMM do yyyy, h:mm a');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  // Determine what to display
  const displayDate = transaction.showDate ? formatDisplayDate(transaction.timestamp) : '';
  const hoverDate = formatHoverDate(transaction.timestamp);

  return (
    <div className="flex pt-[10px] pr-[8px] pb-[20px] pl-[8px] items-end gap-4 self-stretch group/transaction">

      <div className="flex w-[152px] flex-col justify-end items-start gap-[1px]">
        <div className="flex w-[152px] h-[13px] items-center gap-2.5">
          <span className={`text-[#F8FCFF] font-[Geist] text-[10px] not-italic font-normal leading-[normal] transition-opacity duration-200 ${expanded ? 'hidden' : 'group-hover/card:hidden'
            }`}>
            {displayDate}
          </span>
          {/* Hover date (shown on hover for all transactions AND when expanded) */}
          <span className={`text-[#F8FCFF] font-[Geist] text-[10px] not-italic font-normal leading-[normal] ${expanded ? 'block' : 'hidden group-hover/card:block'
            }`}>
            {hoverDate}
          </span>
        </div>
        <div className="flex w-40 items-center gap-2">
          {txType.icon}
          <span className="line-clamp-1 flex-[1_0_0] overflow-hidden text-[#F8FCFF] text-ellipsis font-[Geist] text-sm not-italic font-light leading-[normal] tracking-[0.7px]">{txType.type}</span>
        </div>
      </div>

      <div className="flex w-40 items-center gap-2">
        <div className="flex relative">
          {renderWalletIcon(transaction.walletType)}
          {getBlockchainIcon(transaction.blockchain)}
        </div>
        <span className="line-clamp-1 flex-[1_0_0] overflow-hidden text-[#F8FCFF] text-ellipsis font-[Geist] text-sm not-italic font-light leading-[normal] tracking-[0.7px]">{transaction.wallet}</span>
      </div>

      <div className="flex w-40 items-center gap-2">
        {determineRecipientIcon()}
        <span className="line-clamp-1 flex-[1_0_0] overflow-hidden text-[#F8FCFF] text-ellipsis font-[Geist] text-sm not-italic font-light leading-[normal] tracking-[0.7px]">{recipeints}</span>
      </div>

      <div className={`flex w-40 flex-col items-start ${transaction.incoming ? "opacity-100" : "opacity-0"}`}>
        <div className={`flex items-baseline self-stretch gap-1`}>
          <span className="text-[#F8FCFF] text-ellipsis font-[Geist] text-xs not-italic font-extralight leading-[normal] tracking-[0.96px]">{inTokenSymbol}</span>
          <span className="line-clamp-1 self-stretch text-[#F8FCFF] text-ellipsis font-[Geist] text-xs not-italic font-extralight leading-[normal] tracking-[0.96px]">{inTokens}</span>
        </div>
        <div className="flex items-baseline self-stretch">
          <span className="text-[#64DEA7] font-[Geist] text-sm not-italic font-semibold leading-[normal] tracking-[0.7px]">${formatDollars(transaction.incomingUSD)}</span>
          <span className="text-[#64DEA7] font-[Geist] text-sm not-italic font-thin leading-[normal] tracking-[0.7px]">.{formatCents(transaction.incomingUSD)}</span>
        </div>
      </div>

      <div className={`flex w-40 flex-col items-start ${transaction.outgoing ? "opacity-100" : "opacity-0"}`}>
        <div className="flex items-baseline self-stretch gap-1">
          <span className="text-[#F8FCFF] text-ellipsis font-[Geist] text-xs not-italic font-extralight leading-[normal] tracking-[0.96px]">{outTokenSymbol}</span>
          <span className="line-clamp-1 self-stretch text-[#F8FCFF] text-ellipsis font-[Geist] text-xs not-italic font-extralight leading-[normal] tracking-[0.96px]">{outTokens}</span>
        </div>
        <div className="flex items-baseline self-stretch">
          <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-semibold leading-[normal] tracking-[0.7px]">${formatDollars(transaction.outgoingUSD)}</span>
          <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-thin leading-[normal] tracking-[0.7px]">.{formatCents(transaction.outgoingUSD)}</span>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-[1_0_0]" onClick={handleClassificationClick} data-classification>
        <InlineDropdown
          options={uniqueClassifications}
          value={selectedClassification}
          placeholder="Classify"
          onChange={handleClassificationChange}
        />

        {/* <InlineDropdown options={uniqueClassifications} value={selected} onChange={setSelected} /> */}
      </div>
    </div>
  );
}