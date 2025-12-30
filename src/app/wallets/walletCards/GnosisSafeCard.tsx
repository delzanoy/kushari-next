import { GnosisSafeIcon, BSCIcon, EthereumIcon, GnosisIcon, OPTIMISMIcon, PolygonIcon, QRCodeIcon, SendIcon, SOLIcon, ArrowDownIcon, ArrowUpIcon, ZeroIcon } from "@/app/components/icons";
import { WalletSummary } from "../type";
import { formatDollars, formatSmallNumber, formatCents } from "@/app/components/helpers";
import Tooltip from "@/app/components/TooltipComponent";
import IconButton from "@/app/components/buttons/IconButton";
import useModal from "@/app/hooks/useModal";
import { Modal } from "@/app/components/modal/Modal";
import MakeDeposit from "../modals/MakeDeposit";
import FeatureUnderDevelopment from "@/app/components/FeatureUnderDevlopment/FeatureUnderDevelopment";

interface Wallet {
    wallet: WalletSummary;
    onClick?: () => void;
}

export default function GnosisSafeCard({ wallet, onClick }: Wallet) {
    const { open, closeTop } = useModal();

    const handleQRCodeClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        openMakeDepositModal();
    };

    const handleSendClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        openSendTokensModal();
    };


    const openSendTokensModal = () => {
        open(
            <Modal onRequestClose={() => {
                closeTop(); // Close the modal when onRequestClose is called
                return true; // Allow the modal to close
            }}>
                <FeatureUnderDevelopment onClose={closeTop} />
            </Modal>
        );
    };

    // Function to open the MakeDeposit modal
    const openMakeDepositModal = () => {
        open(
            <Modal onRequestClose={() => {
                closeTop();
                return true;
            }}>
                <MakeDeposit
                    wallet={wallet}
                    onClose={closeTop}
                />
            </Modal>
        );
    };

    const render24hPercentage = (percentage: number) => {
        if (percentage < 0) {
            return <div className="flex pt-px items-center gap-1 w-40">
                <ArrowDownIcon className="h-4 w-4 text-[#F37272]" />
                <span className="text-[#F37272] font-[Geist Mono] text-[13px] not-italic font-light leading-[100%] tracking-[1.56px]">{formatSmallNumber(wallet.percent_change_24h)}%</span>
            </div>
        } else if (percentage > 0) {
            return <div className="flex pt-px items-center gap-1 w-40">
                <ArrowUpIcon className="h-4 w-4 text-[#64DEA7]" />
                <span className="text-[#64DEA7] font-[Geist Mono] text-[13px] not-italic font-light leading-[100%] tracking-[1.56px]">{formatSmallNumber(wallet.percent_change_24h)}%</span>
            </div>
        } else {
            return <div className="flex pt-px items-center gap-1 w-40">
                <ZeroIcon className="h-4 w-4 text-[#F8FCFF] opacity-50" />
                <span className="text-[#F8FCFF] opacity-50 font-[Geist Mono] text-[13px] not-italic font-light leading-[100%] tracking-[1.56px]">{formatSmallNumber(wallet.percent_change_24h)}%</span>
            </div>
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

    const renderBlockchainIcons = () => {
        // Handle string case
        if (typeof wallet.blockchain === 'string') {
            return (
                <div className="absolute inline-flex items-center -space-x-0.25 bottom-[14px] left-[12px]">
                    {getBlockchainIcon(wallet.blockchain)}
                </div>
            );
        }

        // Handle array case
        if (Array.isArray(wallet.blockchain)) {
            // Take only first 3 blockchains for the overlay
            const displayBlockchains = wallet.blockchain.slice(0, 3);

            return (
                <div className="absolute inline-flex items-center -space-x-0.25 bottom-[14px] left-[12px]">
                    {displayBlockchains.map((blockchainObj, index) => (
                        <div key={index}>
                            {getBlockchainIcon(blockchainObj.blockchain)}
                        </div>
                    ))}
                    {/* Show +count if there are more than 3 blockchains */}
                    {wallet.blockchain.length > 3 && (
                        <div className="w-[12px] h-[12px] bg-gray-600 rounded-full flex items-center justify-center text-[8px] text-white">
                            +{wallet.blockchain.length - 3}
                        </div>
                    )}
                </div>
            );
        }

        return null;
    };

    wallet.name = wallet.name.charAt(0).toUpperCase() + wallet.name.slice(1);

    return (
        <div className="group flex w-full max-w-[1040px] mx-auto pt-[16px] pr-[16px] pb-[16px] pl-[24px] items-end gap-2.5 shrink-0 rounded-3xl border-[0.8px] border-solid border-[#2E3435] bg-[#121315]
        hover:border-[0.5px] 
        hover:border-solid 
        hover:border-[rgba(38,201,201,0.7)] 
        hover:bg-[#1C2325] 
        hover:shadow-[0_34px_10px_0_rgba(38,201,200,0.00),0_22px_9px_0_rgba(38,201,200,0.01),0_12px_7px_0_rgba(38,201,200,0.05),0_5px_5px_0_rgba(38,201,200,0.09),0_1px_3px_0_rgba(38,201,200,0.10)]
        transition-all duration-150 ease-in-out hover:scale-101 cursor-pointer active:scale-98"
            onClick={onClick}>
            <div className="flex w-[676px] items-center gap-7 shrink-0">
                <div className="flex w-[312px] items-center gap-1.5 shrink-0">
                    <div className="w-[18px] h-[18px] shrink-0 relative  flex items-center justify-center">
                        <GnosisSafeIcon className="w-[18px] h-[18px] text-[#D5D7D7]" />
                        {renderBlockchainIcons()}
                    </div>
                    <span className="text-[#F8FCFF] text-center font-[Geist] text-sm not-italic font-medium leading-[150%] tracking-[0.96px]">{wallet.name}</span>
                </div>
                <div className="flex w-[336px] justify-end items-center gap-3 shink-0">
                    <div className="flex items-center gap-1.5">
                        <div className="gap-0">
                            <span className="text-[#E7E8E9] text-left font-[Geist] text-base not-italic font-medium leading-[100%] tracking-[0.96px]">{formatDollars(wallet.USDBalance)}</span>
                            <span className="text-[#C8CACB] font-[Geist] text-base not-italic font-thin text-sm leading-[100%] tracking-[0.96px]">.{formatCents(wallet.USDBalance)}</span>
                        </div>
                        <span className="text-[#F8FCFF] font-[Geist] text-base not-italic font-medium leading-[100%] opacity-40">USD</span>
                    </div>
                    {render24hPercentage(wallet.percent_change_24h)}
                </div>
            </div>
            <div className="h-6 flex justify-end items-center gap-6 flex-[1_0_0] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                <IconButton
                    icon={<QRCodeIcon />}
                    size="md"
                    status="brand"
                    className="transition-all duration-200 scale-0 group-hover:scale-100"
                    onClick={handleQRCodeClick}
                />
                <IconButton
                    icon={<SendIcon />}
                    size="md"
                    status="brand"
                    className="transition-all duration-200 scale-0 group-hover:scale-100"
                    onClick={handleSendClick}
                />
            </div>
        </div>
    );
}

// import { GnosisSafeIcon, BSCIcon, EthereumIcon, GnosisIcon, OPTIMISMIcon, PolygonIcon, SOLIcon, QRCodeIcon, SendIcon, ArrowDownIcon, ArrowUpIcon, ZeroIcon } from "@/app/components/icons";
// import { WalletSummary } from "../type";
// import { formatDollars, formatSmallNumber, formatCents } from "@/app/components/helpers";
// import Tooltip from "@/app/components/TooltipComponent";
// import IconButton from "@/app/components/buttons/IconButton";
// import useModal from "@/app/hooks/useModal";
// import { Modal } from "@/app/components/modal/Modal";
// import MakeDeposit from "../modals/MakeDeposit";
// import FeatureUnderDevelopment from "@/app/components/FeatureUnderDevlopment/FeatureUnderDevelopment";
// import { useRouter } from 'next/navigation';
// import { navigateWithTransition, getWalletTransitionName } from "../helpers";

// interface Wallet {
//     wallet: WalletSummary;
//     onClick?: () => void;
// }

// export default function GnosisSafeCard({ wallet, onClick }: Wallet) {
//     const router = useRouter();
//     const { open, closeTop } = useModal();

//     const handleQRCodeClick = (e: React.MouseEvent) => {
//         e.stopPropagation();
//         openMakeDepositModal();
//     };

//     const handleSendClick = (e: React.MouseEvent) => {
//         e.stopPropagation();
//         openSendTokensModal();
//     };


//     const openSendTokensModal = () => {
//         open(
//             <Modal onRequestClose={() => {
//                 closeTop(); // Close the modal when onRequestClose is called
//                 return true; // Allow the modal to close
//             }}>
//                 <FeatureUnderDevelopment onClose={closeTop} />
//             </Modal>
//         );
//     };

//     // Function to open the MakeDeposit modal
//     const openMakeDepositModal = () => {
//         open(
//             <Modal onRequestClose={() => {
//                 closeTop();
//                 return true;
//             }}>
//                 <MakeDeposit
//                     wallet={wallet}
//                     onClose={closeTop}
//                 />
//             </Modal>
//         );
//     };

//     const render24hPercentage = (percentage: number) => {
//         if (percentage < 0) {
//             return <div className="flex pt-px items-center gap-1 w-40">
//                 <ArrowDownIcon className="h-4 w-4 text-[#F37272]" />
//                 <span className="text-[#F37272] font-[Geist Mono] text-[13px] not-italic font-light leading-[100%] tracking-[1.56px]">{formatSmallNumber(wallet.percent_change_24h)}%</span>
//             </div>
//         } else if (percentage > 0) {
//             return <div className="flex pt-px items-center gap-1 w-40">
//                 <ArrowUpIcon className="h-4 w-4 text-[#64DEA7]" />
//                 <span className="text-[#64DEA7] font-[Geist Mono] text-[13px] not-italic font-light leading-[100%] tracking-[1.56px]">{formatSmallNumber(wallet.percent_change_24h)}%</span>
//             </div>
//         } else {
//             return <div className="flex pt-px items-center gap-1 w-40">
//                 <ZeroIcon className="h-4 w-4 text-[#F8FCFF] opacity-50" />
//                 <span className="text-[#F8FCFF] opacity-50 font-[Geist Mono] text-[13px] not-italic font-light leading-[100%] tracking-[1.56px]">{formatSmallNumber(wallet.percent_change_24h)}%</span>
//             </div>
//         }
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

//     const renderBlockchainIcons = () => {
//         // Handle string case
//         if (typeof wallet.blockchain === 'string') {
//             return (
//                 <div className="absolute inline-flex items-center -space-x-0.25 bottom-[14px] left-[12px]">
//                     {getBlockchainIcon(wallet.blockchain)}
//                 </div>
//             );
//         }

//         // Handle array case
//         if (Array.isArray(wallet.blockchain)) {
//             // Take only first 3 blockchains for the overlay
//             const displayBlockchains = wallet.blockchain.slice(0, 3);

//             return (
//                 <div className="absolute inline-flex items-center -space-x-0.25 bottom-[14px] left-[12px]">
//                     {displayBlockchains.map((blockchainObj, index) => (
//                         <div key={index}>
//                             {getBlockchainIcon(blockchainObj.blockchain)}
//                         </div>
//                     ))}
//                     {/* Show +count if there are more than 3 blockchains */}
//                     {wallet.blockchain.length > 3 && (
//                         <div className="w-[12px] h-[12px] bg-gray-600 rounded-full flex items-center justify-center text-[8px] text-white">
//                             +{wallet.blockchain.length - 3}
//                         </div>
//                     )}
//                 </div>
//             );
//         }

//         return null;
//     };

//     wallet.name = wallet.name.charAt(0).toUpperCase() + wallet.name.slice(1);

//     // Handle card click with view transition
//     const handleCardClick = () => {
//         navigateWithTransition(router, `/wallets/${wallet.id}`);
//     };

//     return (
//         <div className="group flex w-full max-w-[1040px] mx-auto pt-[16px] pr-[16px] pb-[16px] pl-[24px] items-end gap-2.5 shrink-0 rounded-3xl border-[0.8px] border-solid border-[#2E3435] bg-[#121315]
//         hover:border-[0.5px] 
//         hover:border-solid 
//         hover:border-[rgba(38,201,201,0.7)] 
//         hover:bg-[#1C2325] 
//         hover:shadow-[0_34px_10px_0_rgba(38,201,200,0.00),0_22px_9px_0_rgba(38,201,200,0.01),0_12px_7px_0_rgba(38,201,200,0.05),0_5px_5px_0_rgba(38,201,200,0.09),0_1px_3px_0_rgba(38,201,200,0.10)]
//         transition-all duration-150 ease-in-out hover:scale-101 cursor-pointer active:scale-98"
//             onClick={handleCardClick}
//             data-wallet-type="safe"
//         >
//             <div className="flex w-[676px] items-center gap-7 shrink-0">
//                 <div className="flex w-[312px] items-center gap-1.5 shrink-0">
//                     <div 
//                         className="w-[18px] h-[18px] shrink-0 relative flex items-center justify-center"
//                         style={{ viewTransitionName: getWalletTransitionName(wallet.id, 'icon') }}
//                     >
//                         <GnosisSafeIcon className="w-[18px] h-[18px] text-[#D5D7D7]" />
//                         {renderBlockchainIcons()}
//                     </div>
//                     <span 
//                         className="text-[#F8FCFF] text-center font-[Geist] text-sm not-italic font-medium leading-[150%] tracking-[0.96px]"
//                         style={{ viewTransitionName: getWalletTransitionName(wallet.id, 'name') }}
//                     >
//                         {wallet.name}
//                     </span>
//                 </div>
//                 <div className="flex w-[336px] justify-end items-center gap-3 shink-0">
//                     <div 
//                         className="flex items-center gap-1.5"
//                         style={{ viewTransitionName: getWalletTransitionName(wallet.id, 'balance') }}
//                     >
//                         <div className="gap-0">
//                             <span className="text-[#E7E8E9] text-left font-[Geist] text-base not-italic font-medium leading-[100%] tracking-[0.96px]">{formatDollars(wallet.USDBalance)}</span>
//                             <span className="text-[#C8CACB] font-[Geist] text-base not-italic font-thin text-sm leading-[100%] tracking-[0.96px]">.{formatCents(wallet.USDBalance)}</span>
//                         </div>
//                         <span className="text-[#F8FCFF] font-[Geist] text-base not-italic font-medium leading-[100%] opacity-40">USD</span>
//                     </div>
//                     <div style={{ viewTransitionName: getWalletTransitionName(wallet.id, 'percentage') }}>
//                         {render24hPercentage(wallet.percent_change_24h)}
//                     </div>
//                 </div>
//             </div>
//             <div className="h-6 flex justify-end items-center gap-6 flex-[1_0_0] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
//                 <IconButton
//                     icon={<QRCodeIcon />}
//                     size="md"
//                     status="brand"
//                     className="transition-all duration-200 scale-0 group-hover:scale-100"
//                     onClick={handleQRCodeClick}
//                 />
//                 <IconButton
//                     icon={<SendIcon />}
//                     size="md"
//                     status="brand"
//                     className="transition-all duration-200 scale-0 group-hover:scale-100"
//                     onClick={handleSendClick}
//                 />
//             </div>
//         </div>
//     );
// }