import { useState } from "react";
import { Proposal } from "./types";
import InlineDropdown from "@/app/components/InlineDropdown";
import { StatusDotIcon, ReadyDotIcon, StatusSquarecle, ExecutingIcon, VaultIcon, GroupIcon, HashIcon, AddressIcon, GnosisSafeIcon, TrackedWalletIcon, UserAvatarIcon } from "@/app/components/icons";
import { ArrowHeadRight } from "@/app/components/icons";
import TertiaryButton from "@/app/components/buttons/TertiaryButton";
import { AddressCardProps } from "@/app/address-book/addresses/types";
import { format } from "date-fns";
import { determineMultirecipients } from "../view-all/calculations";
import { formatDollars, formatCents } from "./../../components/helpers";
import {
    BSCIcon,
    EthereumIcon,
    GnosisIcon,
    OPTIMISMIcon,
    PolygonIcon,
    SOLIcon
} from "./../../components/icons";
import FeatureUnderDevelopment from "@/app/components/FeatureUnderDevlopment/FeatureUnderDevelopment";
import { Modal } from "@/app/components/modal/Modal";
import useModal from "@/app/hooks/useModal";

interface ProposalListProps {
    proposal: Proposal;
    addresses: AddressCardProps[];
    uniqueClassifications: string[];
    onSearchChange?: (query: string) => void;
}

export default function ProposalCard({
    proposal,
    addresses,
    uniqueClassifications
}: ProposalListProps) {
    const { open, closeTop } = useModal();
    const [selected, setSelected] = useState<string | undefined>(proposal.classification);

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

    const renderStyle = (status: string) => {
        switch (status) {
            case "ACTION_REQUIRED":
                return "bg-[#121819]";
            case "FAILED":
                return "bg-[#191415]";
            case "FAILED_REJECTED":
                return "bg-[#191415]";
            default:
                return "bg-[#0E1011]";
        }
    }

    const renderStatus = (status: string) => {
        switch (status) {
            case "ACTION_REQUIRED":
                return <div className="flex w-[152px] h-[18px] pr-[7px] justify-end items-center gap-1">
                    <div className="flex w-[147px] pt-[3px] pr-[10px] pb-[3px] pl-[4px] justify-between items-center shrink-0 rounded-[60px] border-[0.5px] border-solid border-[#26C9C9] bg-[#flex w-[147px] pt-[3px] pr-[10px] pb-[3px] pl-[4px] justify-between items-center shrink-0 rounded-[60px] border-[0.5px] border-solid border-[#26C9C9]/08">
                        <div className="relative h-[18px] w-[18px]">
                            <StatusDotIcon className="absolute left-0 top-0 h-[18px] w-[18px] text-[#26C9C9]" />
                            <StatusDotIcon className="absolute left-0 top-0 h-[18px] w-[18px] text-[#26C9C9] animate-ping" />
                        </div>
                        <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-semibold leading-[normal] tracking-[0.7px]">Action required</span>
                    </div>
                </div>;
            case "NO_ACTION":
                return <div className="flex w-[152px] h-[18px] pr-[7px] justify-end items-center gap-1">
                    <div className="flex w-[147px] pt-[3px] pr-[10px] pb-[3px] pl-[4px] items-center gap-0.5 shrink-0">
                        <StatusDotIcon className="h-[18px] w-[18px] text-[#969696]" />
                        <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-light leading-[normal] tracking-[0.7px]">No action</span>
                    </div>
                </div>;
            case "ACTIONED":
                return <div className="flex w-[152px] h-[18px] pr-[7px] justify-end items-center gap-1">
                    <div className="flex w-[147px] pt-[3px] pr-[10px] pb-[3px] pl-[4px] items-center gap-0.5 shrink-0">
                        <StatusDotIcon className="h-[18px] w-[18px] text-[#26C9C9]" />
                        <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-light leading-[normal] tracking-[0.7px]">Actioned</span>
                    </div>
                </div>;

            case "READY":
                return <div className="flex w-[152px] h-6 pt-[3px] flex-col items-start gap-2.5">
                    <div className="flex pr-1 justify-between items-center self-stretch">
                        <div className="flex items-center gap-1 flex-[1_0_0]">
                            <ReadyDotIcon className="w-4.5 h-4.5" />
                            <span className="flex-[1_0_0] text-[#F8FCFF] font-[Geist] text-sm not-italic font-light leading-[normal] tracking-[0.7px]">Ready</span>
                            <TertiaryButton label="Execute" className="group-hover:opacity-100 opacity-0" />
                        </div>
                    </div>
                </div>;
            case "FAILED":
                return <div className="flex w-[152px] h-[18px] pr-[7px] justify-end items-center gap-1">
                    <div className="flex w-[152px] pl-[3px] justify-start items-center gap-[30px] shrink-0 self-stretch">
                        <div className="flex pt-[3px] pr-[10px] pb-[3px] pl-[4px] justify-end items-center gap-1 rounded-[10px] border-[0.5px] border-solid border-[#ED090D] bg-[#3A2526]">
                            <div className="relative h-[18px] w-[18px]">
                                <StatusDotIcon className="absolute left-0 top-0 h-[18px] w-[18px] text-[#ED090D]" />
                                <StatusDotIcon className="absolute left-0 top-0 h-[18px] w-[18px] text-[#ED090D] animate-ping" />
                            </div>
                            <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-semibold leading-[normal] tracking-[0.7px]">Failed</span>
                        </div>
                        <TertiaryButton label="Retry" className="group-hover:opacity-100 opacity-0" />
                    </div>
                </div>;
            case "EXECUTING":
                return <div className="flex w-[152px] h-6 items-center gap-1">
                    <ExecutingIcon className="w-4.5 h-4.5" />
                    <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-light leading-[normal] tracking-[0.7px]">Executing</span>
                </div>;
            case "AWAITING_NONCE":
                return <div className="flex w-[152px] h-6 items-center gap-1">
                    <StatusSquarecle className="text-[#787878] w-4.5 h-4.5" />
                    <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-light leading-[normal] tracking-[0.7px]">Awaiting nonce</span>
                </div>;

            case "DECLINED":
                return <div className="flex w-[152px] h-6 pt-[3px] flex-col items-start gap-2.5">
                    <div className="flex pr-1 justify-between items-center self-stretch">
                        <div className="flex items-center gap-1 flex-[1_0_0]">
                            <StatusSquarecle className="text-[#FD7217] w-4.5 h-4.5" />
                            <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-light leading-[normal] tracking-[0.7px]">Declined</span>
                        </div>
                        <TertiaryButton label="Edit" className="group-hover:opacity-100 opacity-0" />
                    </div>
                </div>;
            case "FAILED_REJECTED":
                return <div className="flex w-[152px] h-[18px] pr-[7px] justify-end items-center gap-1">
                    <div className="flex w-[152px] pl-[3px] justify-start items-center gap-[30px] shrink-0 self-stretch">
                        <div className="flex pt-[3px] pr-[10px] pb-[3px] pl-[4px] justify-end items-center gap-1 rounded-[10px] border-[0.5px] border-solid border-[#ED090D] bg-[#3A2526]">
                            <div className="relative h-[18px] w-[18px]">
                                <StatusDotIcon className="absolute left-0 top-0 h-[18px] w-[18px] text-[#ED090D]" />
                                <StatusDotIcon className="absolute left-0 top-0 h-[18px] w-[18px] text-[#ED090D] animate-ping" />
                            </div>
                            <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-semibold leading-[normal] tracking-[0.7px]">Failed</span>
                        </div>
                        <TertiaryButton label="Retry" className="group-hover:opacity-100 opacity-0" />
                    </div>
                </div>;
            default:
                return <div className="flex w-[152px] h-6 pt-[3px] flex-col items-start gap-2.5"></div>;
        }
    };

    const determineRecipientIcon = (): React.ReactNode => {
        if (proposal.multiRecipient && Array.isArray(proposal.recipients)) {
            return <GroupIcon className="w-3.5 h-3.5 shrink-0 aspect-square opacity-80" />;
        }
        if (proposal.recipients && typeof proposal.recipients === "object") {
            return <AddressIcon className="w-3.5 h-3.5 shrink-0 aspect-square opacity-80" />;
        }
        if (typeof proposal.recipients === "string") {
            return <HashIcon className="w-3.5 h-3.5 shrink-0 aspect-square opacity-80" />;
        }
        return <HashIcon className="w-3.5 h-3.5 shrink-0 aspect-square opacity-80" />;
    };

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

    const outTokenSymbol = proposal.outTokenSymbol || '';
    const outTokens = proposal.outTokens?.toLocaleString() || '0';

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

    const recipeints = determineMultirecipients(proposal.multiRecipient, proposal.recipients, addresses);

    const displayDate = proposal.showDate ? formatDisplayDate(proposal.timestamp) : '';
    const hoverDate = formatHoverDate(proposal.timestamp);

    const handleCardClick = () => {
        open(
            <Modal onRequestClose={() => {
                closeTop();
                return true;
            }}>
                <FeatureUnderDevelopment onClose={closeTop} />
            </Modal>
        );
    };

    const handleInlineDropdownClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent click from bubbling to parent
    };

    return (
        <div className={`group flex flex-col w-full max-w-[1040px] mx-auto py-[8px] px-[0] items-center gap-5
        justify-end items-end
        ${renderStyle(proposal.status)}
        hover:bg-[#1C2325]
        border-[0.8px] border-transparent
        [border-image:linear-gradient(to_bottom,#0E494900_91%,#0E4949_100%)_1]
        hover:[border-image:linear-gradient(to_bottom,#26C9C900_91%,#26C9C9_100%)_1]
        hover:shadow-[0_34px_10px_0_rgba(38,201,200,0.00),0_22px_9px_0_rgba(38,201,200,0.01),0_12px_7px_0_rgba(38,201,200,0.05),0_5px_5px_0_rgba(38,201,200,0.09),0_1px_3px_0_rgba(38,201,200,0.10)]
        group-hover:z-10
        cursor-pointer
        `}
            onClick={handleCardClick}>
            <div className="flex pt-[4px] pr-[8px] pb-[16px] pl-[8px] justify-end items-end gap-4 self-stretch">
                <div className="flex w-[152px] flex-col justify-end items-start gap-2">
                    <div className="flex w-[152px] h-[13px] items-center">
                        <span className={`text-[#F8FCFF] font-[Geist] text-[10px] not-italic font-normal leading-[normal] transition-opacity duration-200 ${proposal.showDate ? 'block' : 'hidden'} group-hover:hidden`}>
                            {displayDate}
                        </span>
                        <span className={`text-[#F8FCFF] font-[Geist] text-[10px] not-italic font-normal leading-[normal] hidden group-hover:block`}>
                            {hoverDate}
                        </span>
                    </div>
                    <div className="flex h-[18px] items-start gap-2 self-stretch">
                        <div className="flex w-6 h-[18px] justify-center items-center">
                            <UserAvatarIcon member={proposal.initiator} size={32} />
                        </div>
                        <span className="line-clamp-1 overflow-hidden text-[#F8FCFF] text-ellipsis font-[Geist] text-sm not-italic font-light leading-[normal] tracking-[0.7px]">{proposal.initiator}</span>
                    </div>
                </div>
                <div className="flex w-40 items-center gap-2">
                    <div className="flex relative">
                        {renderWalletIcon(proposal.walletType)}
                        {getBlockchainIcon(proposal.blockchain)}
                    </div>
                    <span className="line-clamp-1 overflow-hidden text-[#F8FCFF] text-ellipsis font-[Geist] text-sm not-italic font-light leading-[normal] tracking-[0.7px] flex-[1_0_0]">{proposal.wallet}</span>
                    <ArrowHeadRight className="fill-[#C9C9C9] h-4 w-4 opacity-30" />
                </div>

                <div className="flex w-40 items-center gap-2">
                    <div className="w-4 h-4 shrink-0 items-center justify-center flex aboslute">
                        {determineRecipientIcon()}
                    </div>
                    <span className="line-clamp-1 overflow-hidden text-[#F8FCFF] text-ellipsis font-[Geist] text-sm not-italic font-light leading-[normal] tracking-[0.7px]">{recipeints}</span>
                </div>

                <div className="flex w-40 flex-col items-start">
                    <div className="flex items-baseline self-stretch gap-1">
                        <span className="text-[#F8FCFF] text-ellipsis font-[Geist] text-xs not-italic font-extralight leading-[normal] tracking-[0.96px]">{outTokenSymbol}</span>
                        <span className="line-clamp-1 self-stretch text-[#F8FCFF] text-ellipsis font-[Geist] text-xs not-italic font-extralight leading-[normal] tracking-[0.96px]">{outTokens}</span>
                    </div>
                    <div className="flex items-baseline self-stretch">
                        <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-semibold leading-[normal] tracking-[0.7px]">${formatDollars(proposal.outgoingUSD)}</span>
                        <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-thin leading-[normal] tracking-[0.7px]">.{formatCents(proposal.outgoingUSD)}</span>
                    </div>
                </div>

                {/* Add onClick handler to stop propagation */}
                <div className="flex w-40 items-center gap-4" onClick={handleInlineDropdownClick}>
                    <InlineDropdown 
                        options={uniqueClassifications} 
                        placeholder="Classify" 
                        value={selected} 
                        onChange={setSelected} 
                    />
                </div>

                {renderStatus(proposal.status)}

            </div>
        </div>
    );
}