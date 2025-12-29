// Updated WalletHeader component for WalletDetails.tsx
// This shows the matching view transition names for smooth animation

import { VaultIcon, GnosisSafeIcon, TrackedWalletIcon, QRCodeIcon, SendIcon } from "@/app/components/icons";
import { Wallet } from "../type";
import TertiaryButton from "@/app/components/buttons/TertiaryButton";
import PrimaryButton from "@/app/components/buttons/PrimaryButton";
import { formatCents, formatDollars } from "@/app/components/helpers";
import { getWalletTransitionName } from "../helpers";
import { memo, useMemo, useState, useCallback, useEffect, useRef } from "react";
import TertiaryButtonWithDropdown from "@/app/components/buttons/TertiaryButtonWithDropdown";
import Tooltip from "../../components/TooltipComponent";
import useModal from "@/app/hooks/useModal";
import { Modal } from "@/app/components/modal/Modal";
import MakeDeposit from "../modals/MakeDeposit";
import FeatureUnderDevelopment from "@/app/components/FeatureUnderDevlopment/FeatureUnderDevelopment";

const WALLET_GROUPS = [
    { key: '1', label: 'Vaults' },
    { key: '2', label: 'Gnosis Safes' },
    { key: '3', label: 'Tracked Wallets' }
];

const renderTitleWalletIcon = (walletType: number) => {
    const iconMap: Record<number, React.ReactElement> = {
        1: <VaultIcon className="w-[24px] h-[24px] aspect-square" />,
        2: <GnosisSafeIcon className="w-[24px] h-[24px] aspect-square" />,
        3: <TrackedWalletIcon className="w-[24px] h-[24px] aspect-square" />,
    };
    return iconMap[walletType] || null;
};

const renderWalletIcon = (walletType: number) => {
    const iconMap: Record<number, React.ReactElement> = {
        1: <VaultIcon className="aspect-square" />,
        2: <GnosisSafeIcon className="aspect-square" />,
        3: <TrackedWalletIcon className="aspect-square" />,
    };
    return iconMap[walletType] || null;
};

const capitalizeFirstLetter = (str: string): string => {
    if (!str || str.length === 0) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
};

// Helper to get blockchain icons (simplified version - adjust based on your actual implementation)
const getBlockchainIcons = (blockchainData: any) => {
    // Your existing blockchain icon logic
    return null; // Placeholder
};

const BalanceDisplay = memo(({ label, value }: { label: string; value: number }) => (
    <div className="flex flex-col justify-center items-start gap-[7px]">
        <span className="text-[#F8FCFF] font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px] opacity-80">
            {label}
        </span>
        <div className="flex items-baseline">
            <span className="text-[#F8FCFF] font-[Geist] text-[22px] not-italic font-normal leading-[normal] tracking-[0.88px]">
                $ {formatDollars(value)}
            </span>
            <span className="text-[#F8FCFF] font-[Geist] text-[22px] not-italic font-normal leading-[normal] tracking-[0.88px] opacity-80">
                .{formatCents(value)}
            </span>
        </div>
    </div>
));

BalanceDisplay.displayName = 'BalanceDisplay';

interface WalletHeaderProps {
    wallet: Wallet;
    proposed: number;
    available: number;
    totalBalance: number;
    wallets?: Wallet[];
    onWalletChange?: (walletId: number) => void;
    onBackToWallets?: () => void;
}

export const WalletHeaderWithTransitions = memo(({
    wallet,
    proposed,
    available,
    totalBalance,
    wallets = [],
    onWalletChange,
    onBackToWallets
}: WalletHeaderProps) => {
    const [copiedAddress, setCopiedAddress] = useState(false);
    const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const displayName = useMemo(() => capitalizeFirstLetter(wallet.name), [wallet.name]);
    const { open, closeTop } = useModal();

    const dropdownOptions = useMemo(() =>
        wallets
            .filter(w => w.id !== wallet.id)
            .map(w => ({
                value: w.id.toString(),
                label: capitalizeFirstLetter(w.name),
                groupKey: w.type.toString(),
                leadingIcon: renderWalletIcon(w.type)
            })),
        [wallets, wallet.id]
    );

    const handleWalletChange = useCallback((walletId: string) => {
        onWalletChange?.(parseInt(walletId));
    }, [onWalletChange]);

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

    const handleMakeDepositClick = useCallback(() => {
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
    }, [wallet, open, closeTop]);

    return (
        <div className="flex flex-col items-start gap-16 self-stretch">
            <div className="flex flex-col items-start gap-3 self-stretch">
                <div className="flex items-center gap-2.5 self-stretch">
                    <TertiaryButton label="Wallets" size="sm" status="neutral" onClick={onBackToWallets} />
                    <span className="text-[12px] font-medium truncate font-[Geist] not-italic leading-[normal] tracking-[0.48px]">/</span>

                    <TertiaryButtonWithDropdown
                        label={displayName}
                        dropdownOptions={dropdownOptions}
                        dropdownValue={wallet.id.toString()}
                        onDropdownChange={handleWalletChange}
                        groups={WALLET_GROUPS}
                        status="neutral"
                        size="sm"
                        dropdownPlaceholder={displayName}
                        leadingIcon={renderWalletIcon(wallet.type)}
                    />
                </div>
                <div className="flex justify-between items-start self-stretch">
                    <div className="flex flex-col items-start gap-[5px]">
                        <div className="flex items-center gap-3">
                            {/* Wallet icon with transition */}
                            <div style={{ viewTransitionName: getWalletTransitionName(wallet.id, 'icon') }}>
                                {renderTitleWalletIcon(wallet.type)}
                            </div>
                            
                            {/* Wallet name with transition */}
                            <h1 
                                className="text-[#F8FCFF] font-[Figtree] text-[26px] not-italic font-medium leading-[normal] tracking-[1.04px]"
                                style={{ viewTransitionName: getWalletTransitionName(wallet.id, 'name') }}
                            >
                                {displayName}
                            </h1>
                        </div>
                        <div className="flex items-center gap-[5px]">
                            <div 
                                className="inline-flex items-center -space-x-[4px]"
                                style={{ viewTransitionName: getWalletTransitionName(wallet.id, 'blockchain') }}
                            >
                                {getBlockchainIcons(wallet.blockchain)}
                            </div>
                            <TertiaryButton 
                                label={wallet.address} 
                                status={copiedAddress ? "brand" : "neutral"} 
                                tooltipTitle={copiedAddress ? "Address copied" : "Copy address"}
                                onClick={handleCopyAddress}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3.5">
                        <PrimaryButton
                            label="Make deposit"
                            variant={totalBalance === 0 ? "brand" : "neutral"}
                            size="md"
                            leadingIcon={<QRCodeIcon />}
                            onClick={handleMakeDepositClick}
                        />
                        {totalBalance > 0 && (
                            <PrimaryButton 
                                label="Send tokens" 
                                variant="neutral" 
                                size="md" 
                                leadingIcon={<SendIcon />} 
                                onClick={() => open(
                                    <Modal onRequestClose={() => {
                                        closeTop();
                                        return true;
                                    }}>
                                        <FeatureUnderDevelopment onClose={closeTop} />
                                    </Modal>
                                )} 
                            />
                        )}
                    </div>
                </div>
            </div>
            
            {/* Balance section with transition */}
            <div 
                className="flex w-full items-center gap-9"
                style={{ viewTransitionName: getWalletTransitionName(wallet.id, 'balance') }}
            >
                <BalanceDisplay label="Proposed" value={proposed} />
                <BalanceDisplay label="Available" value={available} />
                <BalanceDisplay label="Total" value={totalBalance} />
            </div>
        </div>
    );
});

WalletHeaderWithTransitions.displayName = 'WalletHeaderWithTransitions';