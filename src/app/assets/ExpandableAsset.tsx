// "use client";
// import Tooltip from "./../components/TooltipComponent";
// import { useState } from "react";
// import { Asset } from "./types";
// import AssetBreakdown from "./AssetBreakdown";
// import { ArrowUpIcon, ArrowDownIcon, ExpandIcon, BSCIcon, EthereumIcon, GnosisIcon, OPTIMISMIcon, PolygonIcon, SOLIcon, CollapseIcon,GnosisSafeIcon, VaultIcon, TrackedWalletIcon, ExternalLinkIcon } from "@/app/components/icons";
// import { formatDollars, formatCents, formatCurrency, formatSmallNumber } from "./../components/helpers";
// import IconButton from "../components/buttons/IconButton";
// import { Modal } from "@/app/components/modal/Modal";
// import FeatureUnderDevelopment from "@/app/components/FeatureUnderDevlopment/FeatureUnderDevelopment";
// import useModal from "@/app/hooks/useModal";

// interface ExpandableAssetProps {
//     asset: Asset;
// }

// export default function ExpandableAsset({ asset }: ExpandableAssetProps) {
//     const [expanded, setExpanded] = useState(false);
//     const { open, closeTop } = useModal();

//     const renderWalletIcon = (walletType: number) => {
//         switch (walletType) {
//             case 1:
//                 return <VaultIcon className="opacity-80 h-4.5 w-4.5 text-[#F8FCFF]" />;
//             case 2:
//                 return <GnosisSafeIcon className="opacity-80 h-4.5 w-4.5 text-[#F8FCFF]" />;
//             case 3:
//                 return <TrackedWalletIcon className="opacity-80 h-4.5 w-4.5 text-[#F8FCFF]" />;
//             default:
//                 return null;
//         }
//     };


//     const renderWalletTypeCounts = (wallets: any[]) => {
//         const counts: { [key: number]: number } = { 1: 0, 2: 0, 3: 0 };

//         wallets.forEach(wallet => {
//             if (wallet.walletType === 1 || wallet.walletType === 2 || wallet.walletType === 3) {
//                 counts[wallet.walletType]++;
//             }
//         });

//         return (
//             <div className="flex gap-2">
//                 {[1, 2, 3].map(type =>
//                     counts[type] > 0 && (
//                         <div key={type} className="flex items-center gap-1.5">
//                             {renderWalletIcon(type)}
//                             <span className="overflow-hidden text-[#F8FCFF] text-ellipsis font-[Geist] text-sm not-italic font-medium leading-[normal] tracking-[0.7px]">{counts[type]}</span>
//                         </div>
//                     )
//                 )}
//             </div>
//         );
//     };


//     const getBlockchainIcon = (blockchainName: string) => {
//         const icon = (() => {
//             switch (blockchainName) {
//                 case "BSC":
//                     return <BSCIcon className="w-[12px] h-[12px]" />;
//                 case "Ethereum":
//                     return <EthereumIcon className="w-[12px] h-[12px]" />;
//                 case "Gnosis chain":
//                     return <GnosisIcon className="w-[12px] h-[12px]" />;
//                 case "Optimism":
//                     return <OPTIMISMIcon className="w-[12px] h-[12px]" />;
//                 case "Polygon":
//                     return <PolygonIcon className="w-[12px] h-[12px]" />;
//                 case "Solana":
//                     return <SOLIcon className="w-[12px] h-[12px]" />;
//                 default:
//                     return null;
//             }
//         })();

//         if (!icon) return null;

//         return (
//             <Tooltip title={blockchainName} position="top">
//                 {icon}
//             </Tooltip>
//         );
//     };

//     const renderBlockchainIcons = (asset: any) => {
//         // Handle string case
//         if (typeof asset.blockchain === 'string') {
//             return (
//                 <div className="absolute inline-flex items-center -space-x-0.25 bottom-[14px] left-[12px]">
//                     {getBlockchainIcon(asset.blockchain)}
//                 </div>
//             );
//         }

//         // Handle array case
//         if (Array.isArray(asset.blockchain)) {
//             // Take only first 3 blockchains for the overlay
//             const displayBlockchains = asset.blockchain.slice(0, 3);

//             return (
//                 <div className="absolute inline-flex items-center -space-x-0.25 bottom-[14px] left-[12px]">
//                     {displayBlockchains.map((blockchainObj: any, index: number) => (
//                         <div key={index}>
//                             {getBlockchainIcon(blockchainObj.blockchain)}
//                         </div>
//                     ))}
//                 </div>
//             );
//         }

//         return null;
//     };

//     return (
//         <div className="group flex flex-col w-full max-w-[1040px] mx-auto py-[24px] px-2 items-center gap-5
//         justify-end items-end
//         bg-[#0E1011]
//         border-[0.8px] border-transparent
//         [border-image:linear-gradient(to_bottom,#0E494900_91%,#0E4949_100%)_1]
//         hover:[border-image:linear-gradient(to_bottom,#26C9C900_91%,#26C9C9_100%)_1]        
//         hover:bg-[#1C2325]
//         hover:shadow-[0_34px_10px_0_rgba(38,201,200,0.00),0_22px_9px_0_rgba(38,201,200,0.01),0_12px_7px_0_rgba(38,201,200,0.05),0_5px_5px_0_rgba(38,201,200,0.09),0_1px_3px_0_rgba(38,201,200,0.10)]
//         group-hover:z-10
//         cursor-pointer
//         "
//             onClick={() => setExpanded(!expanded)}
//         >
//             <div className="flex items-center gap-4">
//                 <div className="flex w-[242px] items-center gap-3 shrink-0">
//                     <div className="w-6 h-6 shrink-0 relative">
//                         <i className={`cf cf-${asset.symbol} text-2xl`}></i>
//                         {renderBlockchainIcons(asset)}
//                     </div>
//                     <div className="flex items-baseline gap-1.5">
//                         <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-light leading-[normal] tracking-[0.7px]">{asset.fullName}</span>
//                         <span className="text-[#F8FCFF] font-[Geist] text-[10px] not-italic font-extralight leading-[normal] uppercase">{asset.symbol}</span>
//                     </div>
//                 </div>
//                 <div className="flex w-[248px] justify-center items-center gap-4 shrink-0">
//                     <span className="line-clamp-1 flex-grow shrink-0 basis-0 overflow-hidden text-[#F8FCFF] text-right text-ellipsis font-[Geist] text-sm not-italic font-light leading-[normal] tracking-[0.7px]">${formatCurrency(asset.price)}</span>
//                     <div className="flex pt-px items-center gap-0.5 flex-[1_0_0]">
//                         {asset.percent_change_24h < 0 ?
//                             <div className="flex pt-px items-center gap-1">
//                                 <ArrowDownIcon className="h-3 w-3 text-[#F37272]" />
//                                 <span className="text-[#F37272] font-[Geist Mono] text-[13px] not-italic font-light leading-[100%] tracking-[1.56px]">{formatSmallNumber(asset.percent_change_24h)}%</span>
//                             </div>
//                             :
//                             <div className="flex pt-px items-center gap-1">
//                                 <ArrowUpIcon className="h-3 w-3 text-[#64DEA7]" />
//                                 <span className="text-[#64DEA7] font-[Geist Mono] text-[13px] not-italic font-light leading-[100%] tracking-[1.56px]">{formatSmallNumber(asset.percent_change_24h)}%</span>
//                             </div>
//                         }
//                         {/* <span className="text-[#E7E8E9] font-[Geist] text-[13px] not-italic font-thin leading-[100%] tracking-[1.56px] line-clamp-1">24 Hrs</span> */}
//                         <IconButton className="hidden opacity-0 group-hover:opacity-100 transition-all duration-200 scale-0 group-hover:scale-100" icon={<ExternalLinkIcon className="text-[#EDEEEE]" />} size="sm" status="neutral" tooltipTitle="Coin Market Cap" onClick={() => open(
//                                                                 <Modal onRequestClose={() => {
//                                                                     closeTop(); // Close the modal when onRequestClose is called
//                                                                     return true; // Allow the modal to close
//                                                                 }}>
//                                                                     <FeatureUnderDevelopment onClose={closeTop}/>
//                                                                 </Modal>
//                                                             )}/>
//                     </div>
//                 </div>
//                 <div className="flex w-[336px] items-start gap-4 shrink-0">
//                     <span className="line-clamp-1 flex-grow shrink-0 basis-0 overflow-hidden text-[#F8FCFF] text-right text-ellipsis font-[Geist] text-sm not-italic font-semibold leading-[normal] tracking-[0.7px]">{asset.totalTokens}</span>
//                     <div className="flex items-baseline gap-2 flex-[1_0_0]">
//                         <div className="flex items-baseline gap-0">
//                             <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-light leading-[normal] tracking-[0.7px]">${formatDollars(asset.USD)}</span>
//                             <span className="text-[#F8FCFF] font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.7px]">.{formatCents(asset.USD)}</span>
//                         </div>
//                         <span className="text-[#F8FCFF] font-[Geist] text-xs not-italic font-thin leading-[normal] tracking-[0.96px]">{formatSmallNumber(asset.percentageShareInUSD)}%</span>
//                     </div>
//                 </div>
//                 <div className="flex w-[146px] items-center gap-3 shrink-0">
//                     {/* <span className="flex items-center gap-2">{asset.countOfWallets}</span> */}
//                     {renderWalletTypeCounts(asset.wallets)}

//                     {expanded ? (
//                         <CollapseIcon className="opacity-0 h-4.5 w-4.5 group-hover:opacity-100 text-[#F8FCFF] transition-all duration-200 scale-0 group-hover:scale-100" />
//                     ) : (
//                         <ExpandIcon className="opacity-0 h-4.5 w-4.5 group-hover:opacity-100 text-[#F8FCFF] transition-all duration-200 scale-0 group-hover:scale-100" />
//                     )}
//                 </div>
//             </div>
//             {expanded ? <AssetBreakdown wallets={asset.wallets} /> : null}
//         </div>
//     );
// }



"use client";
import Tooltip from "./../components/TooltipComponent";
import { useState } from "react";
import { Asset, WalletInfo, BlockchainInfo } from "./types";
import AssetBreakdown from "./AssetBreakdown";
import { ArrowUpIcon, ArrowDownIcon, ExpandIcon, BSCIcon, EthereumIcon, GnosisIcon, OPTIMISMIcon, PolygonIcon, SOLIcon, CollapseIcon, GnosisSafeIcon, VaultIcon, TrackedWalletIcon, ExternalLinkIcon, WalletIcon } from "@/app/components/icons";
import { formatDollars, formatCents, formatCurrency, formatSmallNumber } from "./../components/helpers";
import IconButton from "../components/buttons/IconButton";
import { Modal } from "@/app/components/modal/Modal";
import FeatureUnderDevelopment from "@/app/components/FeatureUnderDevlopment/FeatureUnderDevelopment";
import useModal from "@/app/hooks/useModal";

interface ExpandableAssetProps {
    asset: Asset;
}

// Define type for wallet counts
interface WalletCounts {
    [key: number]: number;
}

export default function ExpandableAsset({ asset }: ExpandableAssetProps) {
    const [expanded, setExpanded] = useState(false);
    const { open, closeTop } = useModal();

    const renderWalletIcon = (walletType: number) => {
        switch (walletType) {
            case 1:
                return <VaultIcon className="opacity-80 h-4.5 w-4.5 text-[#F8FCFF]" />;
            case 2:
                return <GnosisSafeIcon className="opacity-80 h-4.5 w-4.5 text-[#F8FCFF]" />;
            case 3:
                return <TrackedWalletIcon className="opacity-80 h-4.5 w-4.5 text-[#F8FCFF]" />;
            default:
                return null;
        }
    };

    const renderWalletTypeCounts = (wallets: WalletInfo[]) => { // Changed from any[] to WalletInfo[]
        const counts: WalletCounts = { 1: 0, 2: 0, 3: 0 };

        wallets.forEach(wallet => {
            if (wallet.walletType === 1 || wallet.walletType === 2 || wallet.walletType === 3) {
                counts[wallet.walletType]++;
            }
        });

        return (
            <div className="flex gap-2">
                {[1, 2, 3].map(type =>
                    counts[type] > 0 && (
                        <div key={type} className="flex items-center gap-1.5">
                            <WalletIcon className="opacity-80 h-4.5 w-4.5 text-[#F8FCFF]"/>
                            <span className="overflow-hidden text-[#F8FCFF] text-ellipsis font-[Geist] text-sm not-italic font-medium leading-[normal] tracking-[0.7px]">{counts[type]}</span>
                        </div>
                    )
                )}
            </div>
        );
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

    const renderBlockchainIcons = (asset: Asset) => { // Changed from any to Asset
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
                    {displayBlockchains.map((blockchainObj: BlockchainInfo, index: number) => ( // Changed from any to BlockchainInfo
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
        hover:[border-image:linear-gradient(to_bottom,#26C9C900_91%,#26C9C9_100%)_1]        
        hover:bg-[#1C2325]
        hover:shadow-[0_34px_10px_0_rgba(38,201,200,0.00),0_22px_9px_0_rgba(38,201,200,0.01),0_12px_7px_0_rgba(38,201,200,0.05),0_5px_5px_0_rgba(38,201,200,0.09),0_1px_3px_0_rgba(38,201,200,0.10)]
        group-hover:z-10
        cursor-pointer
        "
            onClick={() => setExpanded(!expanded)}
        >
            <div className="flex items-center gap-4">
                <div className="flex w-[242px] items-center gap-3 shrink-0">
                    <div className="w-6 h-6 shrink-0 relative">
                        <i className={`cf cf-${asset.symbol} text-2xl`}></i>
                        {renderBlockchainIcons(asset)}
                    </div>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-light leading-[normal] tracking-[0.7px]">{asset.fullName}</span>
                        <span className="text-[#F8FCFF] font-[Geist] text-[10px] not-italic font-extralight leading-[normal] uppercase">{asset.symbol}</span>
                    </div>
                </div>
                <div className="flex w-[248px] justify-center items-center gap-4 shrink-0">
                    <span className="line-clamp-1 flex-grow shrink-0 basis-0 overflow-hidden text-[#F8FCFF] text-right text-ellipsis font-[Geist] text-sm not-italic font-light leading-[normal] tracking-[0.7px]">${formatCurrency(asset.price)}</span>
                    <div className="flex pt-px items-center gap-0.5 flex-[1_0_0]">
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
                        <IconButton 
                            className="hidden opacity-0 group-hover:opacity-100 transition-all duration-200 scale-0 group-hover:scale-100" 
                            icon={<ExternalLinkIcon className="text-[#EDEEEE]" />} 
                            size="sm" 
                            status="neutral" 
                            tooltipTitle="Coin Market Cap" 
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent event from bubbling up to parent
                                open(
                                    <Modal onRequestClose={() => {
                                        closeTop();
                                        return true;
                                    }}>
                                        <FeatureUnderDevelopment onClose={closeTop} />
                                    </Modal>
                                );
                            }}
                        />
                    </div>
                </div>
                <div className="flex w-[336px] items-start gap-4 shrink-0">
                    <span className="line-clamp-1 flex-grow shrink-0 basis-0 overflow-hidden text-[#F8FCFF] text-right text-ellipsis font-[Geist] text-sm not-italic font-semibold leading-[normal] tracking-[0.7px]">{asset.totalTokens}</span>
                    <div className="flex items-baseline gap-2 flex-[1_0_0]">
                        <div className="flex items-baseline gap-0">
                            <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-light leading-[normal] tracking-[0.7px]">${formatDollars(asset.USD)}</span>
                            <span className="text-[#F8FCFF] font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.7px]">.{formatCents(asset.USD)}</span>
                        </div>
                        <span className="text-[#F8FCFF] font-[Geist] text-xs not-italic font-thin leading-[normal] tracking-[0.96px]">{formatSmallNumber(asset.percentageShareInUSD)}%</span>
                    </div>
                </div>
                <div className="flex w-[146px] items-center gap-3 shrink-0">
                    {renderWalletTypeCounts(asset.wallets)}

                    {expanded ? (
                        <CollapseIcon className="opacity-0 h-4.5 w-4.5 group-hover:opacity-100 text-[#F8FCFF] transition-all duration-200 scale-0 group-hover:scale-100" />
                    ) : (
                        <ExpandIcon className="opacity-0 h-4.5 w-4.5 group-hover:opacity-100 text-[#F8FCFF] transition-all duration-200 scale-0 group-hover:scale-100" />
                    )}
                </div>
            </div>
            {expanded ? <AssetBreakdown wallets={asset.wallets} /> : null}
        </div>
    );
}