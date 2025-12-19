import React, { memo, useMemo } from 'react';
import PrimaryButton from "@/app/components/buttons/PrimaryButton";
import { EditIcon } from "@/app/components/icons";
import Tooltip from "../../../components/TooltipComponent";
import { Wallet, MPCVaultWallet, GnosisSafeWallet } from "../../type";
import { Cryptocurrency } from '@/app/assets/types';
import UserAvatar from "../UserAvatar";
import { Member } from '../../type';

// Import the exact same icon components and helper functions
import { BSCIcon, EthereumIcon, GnosisIcon, OPTIMISMIcon, PolygonIcon, SOLIcon } from "@/app/components/icons";

type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

// Copy the exact same helper functions from the original file
const getBlockchainIcon = (blockchainName: string, size: IconSize = 'lg'): React.ReactElement | null => {
    const sizeClasses: Record<IconSize, string> = {
        'xs': 'w-3 h-3',
        'sm': 'w-3.5 h-3.5',
        'md': 'w-[15px] h-[15px]',
        'lg': 'w-4 h-4',
        'xl': 'w-5 h-5',
        '2xl': 'w-6 h-6',
        '3xl': 'w-7 h-7',
        '4xl': 'w-8 h-8',
    };

    const iconSizeClass = sizeClasses[size];

    const iconMap: Record<string, React.ReactElement> = {
        "BSC": <BSCIcon className={`${iconSizeClass} shrink-0 inline-flex items-center`} />,
        "Ethereum": <EthereumIcon className={`${iconSizeClass} shrink-0 inline-flex items-center`} />,
        "Gnosis chain": <GnosisIcon className={`${iconSizeClass} shrink-0 inline-flex items-center`} />,
        "Optimism": <OPTIMISMIcon className={`${iconSizeClass} shrink-0 inline-flex items-center`} />,
        "Polygon": <PolygonIcon className={`${iconSizeClass} shrink-0 inline-flex items-center`} />,
        "Solana": <SOLIcon className={`${iconSizeClass} shrink-0 inline-flex items-center`} />,
    };

    return iconMap[blockchainName] || null;
};

const getBlockchainIcons = (
    blockchainData: string | Array<{ blockchain: string }> | undefined,
    size: IconSize = 'lg'
): React.ReactElement | null => {
    if (!blockchainData) {
        return null;
    }

    if (typeof blockchainData === 'string') {
        const icon = getBlockchainIcon(blockchainData, size);
        return icon ? (
            <Tooltip title={blockchainData} position="top">
                {icon}
            </Tooltip>
        ) : null;
    } else if (Array.isArray(blockchainData)) {
        return (
            <>
                {blockchainData.map((item, index) => {
                    const icon = getBlockchainIcon(item.blockchain, size);
                    return icon ? (
                        <Tooltip key={index} title={item.blockchain} position="top">
                            {icon}
                        </Tooltip>
                    ) : null;
                })}
            </>
        );
    }
    return null;
};

interface PolicyContentProps {
    wallet: Wallet;
    cryptocurrencies?: Cryptocurrency[];
    members?: Member[];
}

// AssetListDisplay component - exact same as original
const AssetListDisplay = ({ assets }: { assets: (Cryptocurrency & { assetId: number })[] }) => {
    if (assets.length === 0) return null;

    return (
        <div className="flex items-center justify-center gap-12">
            {assets.map((asset) => (
                <div key={asset.assetId} className="flex gap-[8px] items-center justify-center">
                    <i className={`cf cf-${asset.symbol.toLocaleLowerCase()} text-xl`}></i>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-light leading-[normal] tracking-[0.7px]">{asset.name}</span>
                        <span className="text-[#F8FCFF] font-[Geist] text-[10px] not-italic font-extralight leading-[normal] uppercase">{asset.symbol}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

// Main PolicyContent component - exact same styling as original
const PolicyContent = memo(({ wallet, cryptocurrencies = [], members = [] }: PolicyContentProps) => {
    // Type guards for specific wallet types
    const isMPCVault = wallet.type === 1;
    const isGnosisSafe = wallet.type === 2;

    console.log(members);

    // Safe access to wallet-specific properties
    const transactionLimit = (isMPCVault || isGnosisSafe) ? (wallet as MPCVaultWallet | GnosisSafeWallet).transactionLimit : undefined;
    const walletMembers = (isMPCVault || isGnosisSafe) ? (wallet as MPCVaultWallet | GnosisSafeWallet).members : [];
    const threshold = (isMPCVault || isGnosisSafe) ? (wallet as MPCVaultWallet | GnosisSafeWallet).threshold : undefined;
    const blockedNetworks = (isMPCVault || isGnosisSafe) ? (wallet as MPCVaultWallet | GnosisSafeWallet).blockedNetworks : undefined;
    const allowedNetworks = (isMPCVault || isGnosisSafe) ? (wallet as MPCVaultWallet | GnosisSafeWallet).allowedNetworks : undefined;
    const blockedAssets = (isMPCVault || isGnosisSafe) ? (wallet as MPCVaultWallet | GnosisSafeWallet).blockedAssets : undefined;
    const allowedAssets = (isMPCVault || isGnosisSafe) ? (wallet as MPCVaultWallet | GnosisSafeWallet).allowedAssets : undefined;

    const matchingMembers = useMemo(() => {
        return walletMembers
            .map(walletMember => {
                // Find the full member details from the members array
                const fullMember = members.find(m => m.id === walletMember.id);
                return fullMember ? {
                    ...fullMember,
                    roles: Array.isArray(walletMember.role) ? walletMember.role : [walletMember.role]
                } : null;
            })
            .filter((member): member is Member & { roles: string[] } => member !== null);
    }, [walletMembers, members]);

    console.log("Wallet Members:", walletMembers);

    const getAssetDetailsByIds = (assetIds: { assetId: number }[], cryptocurrencies: Cryptocurrency[]): (Cryptocurrency & { assetId: number })[] => {
        if (!assetIds || !cryptocurrencies) return [];

        return assetIds
            .map(item => {
                const asset = cryptocurrencies.find(crypto => crypto.id === item.assetId);
                return asset ? { ...item, ...asset } : null;
            })
            .filter(Boolean) as (Cryptocurrency & { assetId: number })[];
    };

    // Use the reusable function for both blocked and allowed assets
    const blockedAssetDetails = useMemo(() =>
        getAssetDetailsByIds(blockedAssets || [], cryptocurrencies),
        [blockedAssets, cryptocurrencies]
    );

    const allowedAssetDetails = useMemo(() =>
        getAssetDetailsByIds(allowedAssets || [], cryptocurrencies),
        [allowedAssets, cryptocurrencies]
    );

    const getNetworkSubheader = () => {
        if (typeof (blockedNetworks) != "undefined") {
            return "Blocked Networks";
        } else if (typeof (allowedNetworks) != "undefined") {
            return "Allowed Networks";
        } else {
            return "Create a block or allow only list for networks here.";
        }
    };

    const getAssetSubheader = () => {
        if (blockedAssets) {
            return "Blocked Assets";
        } else if (allowedAssets) {
            return "Allowed Assets";
        } else {
            return "Create a block or allow only list for assets here.";
        }
    };

    return (
        <div className="flex flex-col">
            {/* Approval Policy Section - Exact same styling */}
            <div className="group/approver flex flex-col w-full max-w-[1040px] mx-auto pt-[32px] pb-[24px] px-[16px] gap-[24px] justify-center border-[0.5px] border-transparent
        [border-image:linear-gradient(to_bottom,#0E494900_91%,#0E4949_100%)_1]
        hover:[border-image:linear-gradient(to_bottom,#26C9C900_91%,#26C9C9_100%)_1] relative hover:bg-[#232323]">
                <div className="flex gap-[16px] items-baseline">
                    <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-semibold leading-[normal] tracking-[0.7px]">Approval policy</span>
                    <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-light leading-[normal] tracking-[0.7px]">Requires {threshold} of {walletMembers.length} approvers</span>
                </div>
                <div className="flex gap-6 w-full flex-wrap">
                    {matchingMembers.map((member, index) => (
                        <UserAvatar
                            key={member?.id}
                            member={member}
                            index={index}
                        />
                    ))}
                </div>
                <div className="flex gap-[10px] px-[4px] py-[3px] absolute right-[12px] top-[12px] group-hover/approver:opacity-100 opacity-0">
                    <EditIcon className="text-[#EDEEEE] h-[18px] w-[18px] opacity-70" />
                    <span className="text-sm font-medium text-[#EDEEEE] font-[Geist] leading-[normal] tracking-[0.7px]">Edit policy</span>
                </div>
            </div>

            {/* Transaction Limit Section - Exact same styling */}
            <div className="group/approver flex flex-col w-full max-w-[1040px] mx-auto pt-[32px] pb-[24px] px-[16px] gap-[24px] justify-center border-[0.5px] border-transparent
        [border-image:linear-gradient(to_bottom,#0E494900_91%,#0E4949_100%)_1]
        hover:[border-image:linear-gradient(to_bottom,#26C9C900_91%,#26C9C9_100%)_1] relative hover:bg-[#232323]">
                <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-semibold leading-[normal] tracking-[0.7px]">Limit per transaction</span>
                {transactionLimit && (
                    <div className="flex items-baseline">
                        <div>$ {transactionLimit}<span>.00</span></div>
                    </div>
                )}
                {!transactionLimit && (
                    <div>
                        <PrimaryButton variant="inverted" rounded size="md" label="Create transaction limit" />
                    </div>
                )}
                <div className="flex gap-[10px] px-[4px] py-[3px] absolute right-[12px] top-[12px] group-hover/approver:opacity-100 opacity-0">
                    <EditIcon className="text-[#EDEEEE] h-[18px] w-[18px] opacity-70" />
                    <span className="text-sm font-medium text-[#EDEEEE] font-[Geist] leading-[normal] tracking-[0.7px]">Edit policy</span>
                </div>
            </div>

            {/* Network Limits Section - Exact same styling */}
            <div className="group/approver flex flex-col w-full max-w-[1040px] mx-auto pt-[32px] pb-[24px] px-[16px] gap-[24px] justify-center border-[0.5px] border-transparent
        [border-image:linear-gradient(to_bottom,#0E494900_91%,#0E4949_100%)_1]
        hover:[border-image:linear-gradient(to_bottom,#26C9C900_91%,#26C9C9_100%)_1] relative hover:bg-[#232323]">
                <div className="flex flex-col gap-[12px]">
                    <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-semibold leading-[normal] tracking-[0.7px]">Network limits</span>
                    <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-light leading-[normal] tracking-[0.7px]">{getNetworkSubheader()}</span>
                    {!blockedNetworks && !allowedNetworks && (
                        <div>
                            <PrimaryButton variant="inverted" rounded size="md" label="Restrict network(s)" />
                        </div>
                    )}
                </div>

                {(blockedNetworks || allowedNetworks) && (
                    <div className="flex gap-[8px] items-center justify-start w-fit">
                        <div className="flex flex-col gap-3">
                            {blockedNetworks && (
                                <div className="inline-flex gap-[8px] items-center justify-start w-fit">
                                    {getBlockchainIcons(blockedNetworks, "xl")}
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-light leading-[normal] tracking-[0.7px]">Blocked: {blockedNetworks}</span>
                                    </div>
                                </div>
                            )}
                            {allowedNetworks && (
                                <div className="inline-flex gap-[8px] items-center justify-start w-fit">
                                    {getBlockchainIcons(allowedNetworks, "xl")}
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-light leading-[normal] tracking-[0.7px]">Allowed: {allowedNetworks}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex gap-[10px] px-[4px] py-[3px] absolute right-[12px] top-[12px] group-hover/approver:opacity-100 opacity-0">
                    <EditIcon className="text-[#EDEEEE] h-[18px] w-[18px] opacity-70" />
                    <span className="text-sm font-medium text-[#EDEEEE] font-[Geist] leading-[normal] tracking-[0.7px]">Edit policy</span>
                </div>
            </div>

            {/* Asset Limits Section - Exact same styling */}
            <div className="group/approver flex flex-col w-full max-w-[1040px] mx-auto pt-[32px] pb-[24px] px-[16px] gap-[24px] justify-center border-[0.5px] border-transparent
        [border-image:linear-gradient(to_bottom,#0E494900_91%,#0E4949_100%)_1]
        hover:[border-image:linear-gradient(to_bottom,#26C9C900_91%,#26C9C9_100%)_1] relative hover:bg-[#232323]">
                <div className="flex flex-col gap-[12px]">
                    <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-semibold leading-[normal] tracking-[0.7px]">Asset limits</span>
                    <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-light leading-[normal] tracking-[0.7px]">{getAssetSubheader()}</span>
                </div>
                {blockedAssets && (
                    <div className="flex items-baseline" onClick={() => (console.log(blockedAssets))}>
                        <AssetListDisplay assets={blockedAssetDetails} />
                    </div>
                )}
                {allowedAssets && (
                    <div className="flex items-baseline" onClick={() => (console.log(allowedAssets))}>
                        <AssetListDisplay assets={allowedAssetDetails} />
                    </div>
                )}
                {!blockedAssets && !allowedAssets && (
                    <div>
                        <PrimaryButton variant="inverted" rounded size="md" label="Restrict token(s)" />
                    </div>
                )}
                <div className="flex gap-[10px] px-[4px] py-[3px] absolute right-[12px] top-[12px] group-hover/approver:opacity-100 opacity-0">
                    <EditIcon className="text-[#EDEEEE] h-[18px] w-[18px] opacity-70" />
                    <span className="text-sm font-medium text-[#EDEEEE] font-[Geist] leading-[normal] tracking-[0.7px]">Edit policy</span>
                </div>
            </div>
        </div>
    );
});

PolicyContent.displayName = 'PolicyContent';

export default PolicyContent;