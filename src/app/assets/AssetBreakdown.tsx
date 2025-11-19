"use client"
import { VaultIcon, GnosisSafeIcon, TrackedWalletIcon } from "@/app/components/icons";
import { formatCurrency, formatSmallNumber } from "./../components/helpers";


export interface WalletAsset {
    assetId: number;
    balance: number;
    name: string;
    walletId: number;
    walletType: number;
    percentageShare: number;
}

export default function AssetBreakdown({ wallets }: { wallets: WalletAsset[] }) {

    const sortedWallets = [...wallets].sort((a, b) => b.balance - a.balance);
    wallets = sortedWallets;

    const renderWalletIcon = (walletType: number) => {
        switch (walletType) {
            case 1:
                return <VaultIcon className="opacity-50 w-4.5 h-4.5"/>;
            case 2:
                return <GnosisSafeIcon className="opacity-50 w-4.5 h-4.5"/>;
            case 3:
                return <TrackedWalletIcon className="opacity-50 w-4.5 h-4.5"/>;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col items-start gap-3">
            {wallets.map((wallet) => (
                <div className="flex items-center gap-4" key={Math.random()}>
                    <div className="flex w-[336px] items-start gap-4 shrink-0">
                        <span className="line-clamp-1 flex-grow shrink-0 basis-0 overflow-hidden text-[#F8FCFF] text-right text-ellipsis font-[Geist] text-sm not-italic font-semibold leading-[normal] tracking-[0.7px]">{wallet.balance}</span>
                        <div className="flex items-baseline gap-2 flex-[1_0_0]">
                            <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-light leading-[normal] tracking-[0.7px]">${formatCurrency(wallet.balance)}</span>
                            <span className="text-[#F8FCFF] font-[Geist] text-xs not-italic font-thin leading-[normal] tracking-[0.96px]">${formatSmallNumber(wallet.percentageShare)}%</span>
                        </div>
                    </div>
                    <div className="flex w-[146px] items-center gap-2">
                        {renderWalletIcon(wallet.walletType)}
                        <span className="overflow-hidden text-[#F8FCFF] text-ellipsis font-[Geist] text-sm not-italic font-light leading-[normal] tracking-[0.7px]">{wallet.name}</span>
                    </div>
                </div>
            ))}
        </div>
    )
}