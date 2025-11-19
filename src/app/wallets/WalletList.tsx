"use client"
import { WalletSummary } from "./type"
import MPCVaultCard from "./walletCards/MPCVaultCard";
import GnosisSafeCard from "./walletCards/GnosisSafeCard";
import TrackedWalletCard from "./walletCards/TrackedWalletCard";
import { BSCIcon, EthereumIcon, PolygonIcon } from "../components/icons";
import TertiaryButton from "../components/buttons/TertiaryButton";
import Tooltip from "../components/TooltipComponent";
import { useRouter } from 'next/navigation';

export default function WalletList({ wallets }: { wallets: WalletSummary[] }) {
    const router = useRouter();

    const vaultWallets = wallets.filter(wallet => wallet.type === 1);
    const gnosisSafeWallets = wallets.filter(wallet => wallet.type === 2);
    const trackedWallets = wallets.filter(wallet => wallet.type === 3);

    const handleWalletClick = (walletId: number) => {
        router.push(`/wallets/${walletId}`);
    };

    return (
        <div className="flex flex-col items-start gap-12 max-w-[1040px] mx-auto">
            <div className="flex w-full max-w-[1040px] flex-col items-start gap-3.5">
                <div className="flex justify-between items-baseline self-stretch">
                    <div className="flex items-center gap-3">
                        <span className="text-[#A3A7A8] font-[Geist] text-base not-italic font-normal leading-[normal]">Vaults</span>
                        <div className="inline-flex items-center -space-x-1">
                            <Tooltip title="Ethereum" position="top">
                                <EthereumIcon className="w-4 h-4" />
                            </Tooltip>
                            <Tooltip title="Binance Smart Chain" position="top">
                                <BSCIcon className="w-4 h-4" />
                            </Tooltip>
                            <Tooltip title="Polygon" position="top">
                                <PolygonIcon className="w-4 h-4" />
                            </Tooltip>
                        </div>
                    </div>
                    <TertiaryButton size="lg" label="Create Vault" />
                </div>
                <div className="flex items-start content-start gap-4 flex-wrap">
                    {vaultWallets.map((wallet) => (
                        <MPCVaultCard
                            key={wallet.id}
                            wallet={wallet}
                            onClick={() => handleWalletClick(wallet.id)}
                        />
                    ))}
                </div>
            </div>
            <div className="flex w-full max-w-[1040px] flex-col items-start gap-3.5">
                <div className="flex justify-between items-baseline self-stretch">
                    <div className="flex items-center gap-3">
                        <span className="text-[#A3A7A8] font-[Geist] text-base not-italic font-normal leading-[normal]">Gnosis Safe</span>
                    </div>
                    <TertiaryButton size="lg" label="Connect safe" />
                </div>
                <div className="flex items-start w-full max-w-[1040px] content-start gap-4">
                    {gnosisSafeWallets.map((wallet) => (
                        <GnosisSafeCard
                            key={wallet.id}
                            wallet={wallet}
                            onClick={() => handleWalletClick(wallet.id)}
                        />
                    ))}
                </div>
            </div>
            <div className="flex w-full max-w-[1040px] flex-col items-start gap-3.5">
                <div className="flex justify-between items-baseline self-stretch">
                    <div className="flex items-center gap-3">
                        <span className="text-[#A3A7A8] font-[Geist] text-base not-italic font-normal leading-[normal]">Tracked wallets</span>
                    </div>
                    <TertiaryButton size="lg" label="Track wallet" />
                </div>
                <div className="flex flex-col items-start w-full max-w-[1040px] content-start gap-4">
                    {trackedWallets.map((wallet) => (
                        <TrackedWalletCard
                            key={wallet.id}
                            wallet={wallet}
                            onClick={() => handleWalletClick(wallet.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}