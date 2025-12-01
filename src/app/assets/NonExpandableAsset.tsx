"use client";
import Tooltip from "./../components/TooltipComponent";
import { Asset } from "./types";

import { ArrowUpIcon, ArrowDownIcon, BSCIcon, EthereumIcon, GnosisIcon, OPTIMISMIcon, PolygonIcon, SOLIcon, VaultIcon, GnosisSafeIcon, TrackedWalletIcon, ExternalLinkIcon } from "@/app/components/icons";
import { formatCurrency, formatSmallNumber, formatDollars, formatCents } from "./../components/helpers"
import IconButton from "../components/buttons/IconButton";

interface NonExpandableAssetProps {
    asset: Asset;
}

export default function NonExpandableAsset({ asset }: NonExpandableAssetProps) {
    const renderWalletIcon = (walletType: number) => {
        switch (walletType) {
            case 1:
                return <VaultIcon className="opacity-50 w-4.5 h-4.5" />;
            case 2:
                return <GnosisSafeIcon className="opacity-50 w-4.5 h-4.5" />;
            case 3:
                return <TrackedWalletIcon className="opacity-50 w-4.5 h-4.5" />;
            default:
                return null;
        }
    };

    const getBlockchainIcon = (blockchainName: string) => {
        const icon = (() => {
            switch (blockchainName) {
                case "BSC":
                    return <BSCIcon className="w-[12px] h-[12px]" />;
                case "Ethereum":
                    return <EthereumIcon className="w-[12px] h-[12px]" />;
                case "Gnosis chain":
                    return <GnosisIcon className="w-[12px] h-[12px]" />;
                case "Optimism":
                    return <OPTIMISMIcon className="w-[12px] h-[12px]" />;
                case "Polygon":
                    return <PolygonIcon className="w-[12px] h-[12px]" />;
                case "Solana":
                    return <SOLIcon className="w-[12px] h-[12px]" />;
                default:
                    return null;
            }
        })();

        if (!icon) return null;

        return (
            <Tooltip title={blockchainName} position="top">
                {icon}
            </Tooltip>
        );
    };

    const renderBlockchainIcons = (asset: any) => {
        // Handle string case
        if (typeof asset.blockchain === 'string') {
            return (
                <div className="absolute inline-flex items-center -space-x-0.25 bottom-[14px] left-[12px]">
                    {getBlockchainIcon(asset.blockchain)}
                </div>
            );
        }

        // Handle array case
        if (Array.isArray(asset.blockchain)) {
            // Take only first 3 blockchains for the overlay
            const displayBlockchains = asset.blockchain.slice(0, 3);

            return (
                <div className="absolute inline-flex items-center -space-x-0.25 bottom-[14px] left-[12px]">
                    {displayBlockchains.map((blockchainObj: any, index: number) => (
                        <div key={index}>
                            {getBlockchainIcon(blockchainObj.blockchain)}
                        </div>
                    ))}
                </div>
            );
        }

        return null;
    };


    return (

        <div className="group flex flex-col w-full max-w-[1040px] mx-auto py-[24px] px-2 items-center gap-5
        justify-end items-end
        bg-[#0E1011]
        border-[0.8px] border-transparent
        [border-image:linear-gradient(to_bottom,#0E494900_91%,#0E4949_100%)_1]
        hover:[border-image:linear-gradient(to_bottom,#26C9C91A_91%,#26C9C91A_100%)_1]
        hover:bg-[#232323]
        hover:shadow-[0_17px_20px_0_rgba(38,201,200,0.00),0_11px_18px_0_rgba(38,201,200,0.01),0_6px_14px_0_rgba(38,201,200,0.05)]
        group-hover:z-10
        "
        >
            <div className="flex items-center gap-4">
                <div className="flex w-[242px] items-center gap-3 ">
                    <div className="w-[24px] h-[24px] relative">
                        <i className={`cf cf-${asset.symbol} text-2xl`}></i>
                        {renderBlockchainIcons(asset)}
                    </div>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-light leading-[normal] tracking-[0.7px]">{asset.fullName}</span>
                        <span className="text-[#F8FCFF] font-[Geist] text-[10px] not-italic font-extralight leading-[normal] uppercase">{asset.symbol}</span>
                    </div>
                </div>
                <div className="flex w-[248px] justify-center items-center gap-4 shrink-0">
                    <span className="line-clamp-1 flex-grow shrink-0 basis-0 overflow-hidden text-[#F8FCFF] text-right text-ellipsis font-[Geist] text-sm not-italic font-light leading-[normal] tracking-[0.7px] ">${formatCurrency(asset.price)}</span>
                    <div className="flex pt-px items-center gap-1 flex-[1_0_0] ">
                        {asset.percent_change_24h < 0 ?
                            <div className="flex pt-px items-center gap-1">
                                <ArrowDownIcon className="h-3 w-3 text-[#F37272]" />
                                <span className="text-[#F37272] font-[Geist Mono] text-[13px] not-italic font-light leading-[100%] tracking-[1.56px]">{formatSmallNumber(asset.percent_change_24h)}%</span>
                            </div>
                            :
                            <div className="flex pt-px items-center gap-1">
                                <ArrowUpIcon className="h-3 w-3 text-[#64DEA7]" />
                                <span className="text-[#64DEA7] font-[Geist Mono] text-[13px] not-italic font-light leading-[100%] tracking-[1.56px]">{formatSmallNumber(asset.percent_change_24h)}%</span>
                            </div>
                        }
                        {/* <span className="text-[#E7E8E9] font-[Geist] text-[13px] not-italic font-thin leading-[100%] tracking-[1.56px] line-clamp-1">24 Hrs</span> */}
                        <IconButton className="hidden opacity-0 group-hover:opacity-100 transition-all duration-200 scale-0 group-hover:scale-100" icon={<ExternalLinkIcon className="text-[#EDEEEE]" />} size="sm" status="neutral" tooltipTitle="Coin Market Cap" />
                    </div>
                </div>
                <div className="flex w-[336px] items-start gap-4 shrink-0">
                    <span className=" flex-grow shrink-0 basis-0 overflow-hidden text-[#F8FCFF] text-right text-ellipsis font-[Geist] text-sm not-italic font-semibold leading-[normal] tracking-[0.7px] ">{asset.totalTokens}</span>
                    <div className="flex items-baseline gap-2 flex-[1_0_0] ">
                        <div className="flex items-baseline gap-0">
                            <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-light leading-[normal] tracking-[0.7px]">${formatDollars(asset.USD)}</span>
                            <span className="text-[#F8FCFF] font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.7px]">.{formatCents(asset.USD)}</span>
                        </div>
                        <span className="text-[#F8FCFF] font-[Geist] text-xs not-italic font-thin leading-[normal] tracking-[0.96px]">{formatSmallNumber(asset.percentageShareInUSD)}%</span>
                    </div>
                </div>
                <div className="flex w-[146px] items-center gap-1.5 shrink-0">
                    {renderWalletIcon(asset.wallets[0].walletType)}
                    <span className="opacity-50 overflow-hidden text-[#F8FCFF] text-ellipsis font-[Geist] text-sm not-italic font-light leading-[normal] tracking-[0.7px]">{asset.wallets[0].name}</span>
                </div>
            </div>

        </div>
    );
}


