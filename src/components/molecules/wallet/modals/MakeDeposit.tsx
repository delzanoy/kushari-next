"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { QRCodeSVG } from 'qrcode.react';
import {
  RiCloseLine,
  RiCloseCircleFill,
  RiFileCopyLine,
  RiCheckLine,
} from "@remixicon/react";

import { useModalContext } from "@/components/molecules/modal/Modal";
import { IconButton } from "@/components/atoms/IconButton";
import { Tooltip } from "@/components/atoms/Tooltip";
import { BlockchainIconStack } from "@/components/atoms/BlockchainIconStack";
import { TertiaryButton } from "@/components/atoms/TertiaryButton";

import { Wallet, WalletSummary } from "../types";
import { MODAL_WIDTH } from "@/components/molecules/modal/Modal";
import { walletIcon } from "@/components/atoms/WalletIcon";

interface MakeDepositProps {
    wallet: Wallet | WalletSummary;
    onClose?: () => void;
}

export default function MakeDeposit({ wallet, onClose }: MakeDepositProps) {
    const [copiedAddress, setCopiedAddress] = useState(false);
    const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [showEscTooltip, setShowEscTooltip] = useState(false);

    const { escStage, isTopModal } = useModalContext();

    useEffect(() => {
        if (escStage === 1 && isTopModal) {
            setShowEscTooltip(true);
        } else {
            setShowEscTooltip(false);
        }
    }, [escStage, isTopModal]);

    const renderWalletType = (walletType: number) => {
        const typeMap: Record<number, string> = {
            1: "Vault",
            2: "Gnosis Safe",
            3: "Tracked Wallet",
        };
        return typeMap[walletType] || "";
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

    useEffect(() => {
        return () => {
            if (copyTimeoutRef.current) {
                clearTimeout(copyTimeoutRef.current);
            }
        };
    }, []);

    const formatBlockchainProp = () => {
        if (!wallet.blockchain) return [];
        if (typeof wallet.blockchain === "string") return [wallet.blockchain];
        return wallet.blockchain.map(b => (typeof b === "string" ? b : b.blockchain));
    };

    return (
        <div className={`flex ${MODAL_WIDTH.standard} p-4 flex-col items-start gap-[30px] rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-sunken)] transition-all duration-300 shadow-2xl`}>
            {/* Header Section */}
            <div className="flex flex-col items-start gap-2.5 self-stretch">
                <div className="flex justify-between items-start self-stretch">
                    <div className="flex p-2.5 items-center justify-center rounded-xl bg-[var(--color-text-brand)]/[0.08] border border-[var(--color-text-brand)]/[0.12] text-[var(--color-text-brand)]">
                        {walletIcon(wallet.type, { size: 24, fallback: 1 })}
                    </div>

                    <Tooltip content="Esc again to confirm" open={showEscTooltip} placement="bottom">
                        <div>
                            <IconButton
                                icon={showEscTooltip ? <RiCloseCircleFill size={20} /> : <RiCloseLine size={20} />}
                                size="sm"
                                flat
                                variant={showEscTooltip ? "danger" : "neutral"}
                                appearance="ghost"
                                onClick={onClose}
                                aria-label="Close modal"
                            />
                        </div>
                    </Tooltip>
                </div>
                <div className="flex py-0 px-[12px] flex-col items-start gap-2.5 self-stretch mt-1">
                    <span className="text-[var(--color-text-primary)] text-[26px] font-medium tracking-tight leading-normal">
                        {wallet.name}
                    </span>
                    <span className="text-[var(--color-text-muted)] text-sm tracking-tight leading-normal">
                        Make deposit to {wallet.name} {renderWalletType(wallet.type)}
                    </span>
                </div>
            </div>

            {/* QR Code Section */}
            <div className="flex py-0 px-[12px] flex-col items-center gap-4 self-stretch">
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

            {/* Address Copy Section */}
            <div className="flex self-center items-center gap-[5px]">
                <div className="inline-flex items-center -space-x-1">
                    <BlockchainIconStack blockchain={formatBlockchainProp()} size={24} max={4} />
                </div>

                <Tooltip content={copiedAddress ? "Address copied" : "Copy address"} placement="top">
                    <div>
                        <TertiaryButton
                            size="sm"
                            variant={copiedAddress ? "brand" : "neutral"}
                            onClick={handleCopyAddress}
                            trailingIcon={copiedAddress ? <RiCheckLine size={16} /> : <RiFileCopyLine size={16} />}
                        >
                            <span className="font-mono">{wallet.address}</span>
                        </TertiaryButton>
                    </div>
                </Tooltip>
            </div>
        </div>
    );
}
