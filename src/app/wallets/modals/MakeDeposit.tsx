"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import IconButton from "../../components/buttons/IconButton";
import { VaultIcon, GnosisSafeIcon, TrackedWalletIcon, CloseIcon, CloseCircleFilledIcon, EthereumIcon, BSCIcon, PolygonIcon, GnosisIcon, OPTIMISMIcon, SOLIcon } from "../../components/icons";
import { WalletSummary, Wallet } from "../type";
import { useModalContext } from "@/app/components/modal/Modal";
import { QRCodeSVG } from 'qrcode.react';
import Tooltip from "@/app/components/TooltipComponent";
import TertiaryButton from "@/app/components/buttons/TertiaryButton";

interface MakeDepositProps {
    wallet: WalletSummary | Wallet; // Accept both types!
    onClose?: () => void;
}

export default function MakeDeposit({ wallet, onClose }: MakeDepositProps) {
    const [copiedAddress, setCopiedAddress] = useState(false);
    const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [showEscTooltip, setShowEscTooltip] = useState(false);

    const { escStage, isTopModal } = useModalContext();

    // Show/hide ESC tooltip based on ESC stage - matches FeatureUnderDevelopment
    useEffect(() => {
        if (escStage === 1 && isTopModal) {
            setShowEscTooltip(true);
        } else {
            setShowEscTooltip(false);
        }
    }, [escStage, isTopModal]);

    const renderWalletIcon = (walletType: number) => {
        const iconMap: Record<number, React.ReactElement> = {
            1: <VaultIcon className="w-8 h-8 aspect-square" />,
            2: <GnosisSafeIcon className="w-8 h-8 aspect-square" />,
            3: <TrackedWalletIcon className="w-8 h-8 aspect-square" />,
        };
        return iconMap[walletType] || null;
    };

    const renderWalletType = (walletType: number) => {
        const iconMap: Record<number, string> = {
            1: "Vault",
            2: "Gnosis Safe",
            3: "Tracked Wallet",
        };
        return iconMap[walletType] || null;
    };

    type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

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

    const handleCopyAddress = useCallback(async () => {
        if (copyTimeoutRef.current) {
            clearTimeout(copyTimeoutRef.current);
        }

        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(wallet.address);
            } else {
                const textArea = document.createElement('textarea');
                textArea.value = wallet.address;
                textArea.style.position = 'fixed';
                textArea.style.opacity = '0';
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }

            setCopiedAddress(true);
            copyTimeoutRef.current = setTimeout(() => {
                setCopiedAddress(false);
            }, 5000);

        } catch (err) {
            console.error('Failed to copy address:', err);
        }
    }, [wallet.address]);

    // Clean up timeout on unmount
    useEffect(() => {
        return () => {
            if (copyTimeoutRef.current) {
                clearTimeout(copyTimeoutRef.current);
            }
        };
    }, []);

    return (
        <div className="flex w-[568px] p-4 flex-col items-start gap-[30px] rounded-3xl border-[0.5px] border-solid border-[rgba(248,252,255,0.24)] transition-all duration-300 mt-[80px] bg-[#151819]">
            <div className="flex flex-col items-start gap-2.5 self-stretch">
                <div className="flex justify-between items-start self-stretch">
                    <div className="flex p-2.5 items-center gap-2.5 rounded-[10px] bg-[#F8FCFF]/6">
                        {renderWalletIcon(wallet.type)}
                    </div>

                    <IconButton
                                                icon={showEscTooltip ? <CloseCircleFilledIcon /> : <CloseIcon />}
                                                size="sm"
                                                status={showEscTooltip ? "danger" : "neutral"}
                                                onClick={onClose}
                                                tooltipTitle="Esc again to confirm"
                                                showTooltip={showEscTooltip}
                                            />
                </div>
                <div className="flex py-[0] px-[12px] flex-col items-start gap-2.5 self-stretch">
                    <span className="text-[#F8FCFF] font-[Figtree] text-[26px] not-italic font-medium leading-[normal] tracking-[1.04px]">
                        {wallet.name}
                    </span>
                    <span className="text-[#EDEEEE] font-[Geist] text-sm not-italic font-normal leading-[normal] tracking-[0.56px]">
                        Make deposit to {wallet.name} {renderWalletType(wallet.type)}
                    </span>
                </div>
            </div>
            <div className="flex py-[0] px-[12px] flex-col items-center gap-4 self-stretch">
                <svg width={256} height={256}>
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#FFFFFF" />
                            <stop offset="100%" stopColor="#B0B9E8" />
                        </linearGradient>
                    </defs>
                    <QRCodeSVG
                        value={wallet.address}
                        size={256}
                        bgColor="transparent"
                        fgColor="url(#gradient)"
                        level="L"
                    />
                </svg>
            </div>
            <div className="flex self-center gap-[5px]">
                <div className="inline-flex items-center -space-x-1">
                    {getBlockchainIcons(wallet.blockchain)}
                </div>
                <TertiaryButton 
                    size="sm" 
                    label={wallet.address} 
                    status={copiedAddress ? "brand" : "neutral"} 
                    tooltipTitle={copiedAddress ? "Address copied" : "Copy address"}
                    onClick={handleCopyAddress}
                />
            </div>
        </div>
    );
}