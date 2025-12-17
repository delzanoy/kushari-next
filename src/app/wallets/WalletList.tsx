// "use client"
// import { WalletSummary } from "./type"
// import MPCVaultCard from "./walletCards/MPCVaultCard";
// import GnosisSafeCard from "./walletCards/GnosisSafeCard";
// import TrackedWalletCard from "./walletCards/TrackedWalletCard";
// import { BSCIcon, EthereumIcon, PolygonIcon } from "../components/icons";
// import TertiaryButton from "../components/buttons/TertiaryButton";
// import Tooltip from "../components/TooltipComponent";
// import { useRouter } from 'next/navigation';
// import useModal from "../hooks/useModal";
// import { Modal } from "../components/modal/Modal";
// import TrackWallet from "./modals/TrackWallet";
// import CreateVault from "./modals/CreateVault";
// import { useMembers } from "../hooks/useData";
// import ConnectSafe from "./modals/ConnectSafe";

// export default function WalletList({ wallets }: { wallets: WalletSummary[] }) {
//     const router = useRouter();
//     const { open, closeTop } = useModal();
//     const { members } = useMembers();

//     const vaultWallets = wallets.filter(wallet => wallet.type === 1);
//     const gnosisSafeWallets = wallets.filter(wallet => wallet.type === 2);
//     const trackedWallets = wallets.filter(wallet => wallet.type === 3);

//     const handleWalletClick = (walletId: number) => {
//         router.push(`/wallets/${walletId}`);
//     };

//     return (
//         <div className="flex flex-col items-start gap-12 max-w-[1040px] mx-auto">
//             <div className="flex w-full max-w-[1040px] flex-col items-start gap-3.5">
//                 <div className="flex justify-between items-baseline self-stretch">
//                     <div className="flex items-center gap-3">
//                         <span className="text-[#A3A7A8] font-[Geist] text-base not-italic font-normal leading-[normal]">Vaults</span>
//                         <div className="inline-flex items-center -space-x-1">
//                             <Tooltip title="Ethereum" position="top">
//                                 <EthereumIcon className="w-4 h-4" />
//                             </Tooltip>
//                             <Tooltip title="Binance Smart Chain" position="top">
//                                 <BSCIcon className="w-4 h-4" />
//                             </Tooltip>
//                             <Tooltip title="Polygon" position="top">
//                                 <PolygonIcon className="w-4 h-4" />
//                             </Tooltip>
//                         </div>
//                     </div>
//                     <TertiaryButton
//                         size="lg"
//                         label="Create Vault"
//                         onClick={() =>
//                             open(
//                                 <Modal onClose={() => closeTop()}>
//                                     <CreateVault 
//                                         onClose={() => closeTop()} 
//                                         members={members || []}
//                                     />
//                                 </Modal>
//                             )
//                         }
//                     />
//                 </div>
//                 <div className="flex items-start content-start gap-4 flex-wrap">
//                     {vaultWallets.map((wallet) => (
//                         <MPCVaultCard
//                             key={wallet.id}
//                             wallet={wallet}
//                             onClick={() => handleWalletClick(wallet.id)}
//                         />
//                     ))}
//                 </div>
//             </div>
//             <div className="flex w-full max-w-[1040px] flex-col items-start gap-3.5">
//                 <div className="flex justify-between items-baseline self-stretch">
//                     <div className="flex items-center gap-3">
//                         <span className="text-[#A3A7A8] font-[Geist] text-base not-italic font-normal leading-[normal]">Gnosis Safe</span>
//                     </div>
//                     <TertiaryButton
//                         size="lg"
//                         label="Connect Safe"
//                         onClick={() =>
//                             open(
//                                 <Modal onClose={() => closeTop()}>
//                                     <ConnectSafe onClose={() => closeTop()}
//                                     members={members || []}
//                                      />
//                                 </Modal>
//                             )
//                         }
//                     />
//                 </div>
//                 <div className="flex items-start w-full max-w-[1040px] content-start gap-4">
//                     {gnosisSafeWallets.map((wallet) => (
//                         <GnosisSafeCard
//                             key={wallet.id}
//                             wallet={wallet}
//                             onClick={() => handleWalletClick(wallet.id)}
//                         />
//                     ))}
//                 </div>
//             </div>
//             <div className="flex w-full max-w-[1040px] flex-col items-start gap-3.5">
//                 <div className="flex justify-between items-baseline self-stretch">
//                     <div className="flex items-center gap-3">
//                         <span className="text-[#A3A7A8] font-[Geist] text-base not-italic font-normal leading-[normal]">Tracked wallets</span>
//                     </div>
//                     <TertiaryButton
//                         size="lg"
//                         label="Track wallet"
//                         onClick={() =>
//                             open(
//                                 <Modal onClose={() => closeTop()}>
//                                     <TrackWallet onClose={() => closeTop()} />
//                                 </Modal>
//                             )
//                         }
//                     />
//                 </div>
//                 <div className="flex flex-col items-start w-full max-w-[1040px] content-start gap-4">
//                     {trackedWallets.map((wallet) => (
//                         <TrackedWalletCard
//                             key={wallet.id}
//                             wallet={wallet}
//                             onClick={() => handleWalletClick(wallet.id)}
//                         />
//                     ))}
//                 </div>
//             </div>
//         </div>
//     )
// }



"use client"
import { WalletSummary } from "./type"
import MPCVaultCard from "./walletCards/MPCVaultCard";
import GnosisSafeCard from "./walletCards/GnosisSafeCard";
import TrackedWalletCard from "./walletCards/TrackedWalletCard";
import { BSCIcon, EthereumIcon, PolygonIcon } from "../components/icons";
import TertiaryButton from "../components/buttons/TertiaryButton";
import Tooltip from "../components/TooltipComponent";
import { useRouter } from 'next/navigation';
import useModal from "../hooks/useModal";
import { Modal } from "../components/modal/Modal";
import TrackWallet from "./modals/TrackWallet";
import CreateVault from "./modals/CreateVault";
import { useMembers } from "../hooks/useData";
import ConnectSafe from "./modals/ConnectSafe";
import { useEffect, useState } from 'react';
import { getUserWallets } from '../api/mock-cache';

export default function WalletList({ wallets }: { wallets: WalletSummary[] }) {
    const router = useRouter();
    const { open, closeTop } = useModal();
    const { members } = useMembers();
    const [demoWallets, setDemoWallets] = useState<WalletSummary[]>([]);

    // Load demo wallets on mount
    useEffect(() => {
        loadDemoWallets();
    }, []);

    // Listen for wallet updates
    useEffect(() => {
        const handleWalletsUpdated = () => {
            loadDemoWallets();
        };

        window.addEventListener('walletsUpdated', handleWalletsUpdated);
        return () => window.removeEventListener('walletsUpdated', handleWalletsUpdated);
    }, []);

    const loadDemoWallets = async () => {
        try {
            const userWallets = await getUserWallets();
            // Cast to WalletSummary to ensure type safety
            setDemoWallets(userWallets as WalletSummary[]);
        } catch (error) {
            console.error('Failed to load demo wallets:', error);
        }
    };

    const handleWalletCreated = async () => {
        await loadDemoWallets();
        window.dispatchEvent(new CustomEvent('walletsUpdated'));
    };

    // Combine API wallets with demo wallets
    const allWallets = [...wallets, ...demoWallets];

    const vaultWallets = allWallets.filter(wallet => wallet.type === 1);
    const gnosisSafeWallets = allWallets.filter(wallet => wallet.type === 2);
    const trackedWallets = allWallets.filter(wallet => wallet.type === 3);

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
                    <TertiaryButton
                        size="lg"
                        label="Create Vault"
                        onClick={() =>
                            open(
                                <Modal onClose={() => closeTop()}>
                                    <CreateVault 
                                        onClose={() => closeTop()} 
                                        members={members || []}
                                        onVaultCreated={handleWalletCreated}
                                    />
                                </Modal>
                            )
                        }
                    />
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
                    <TertiaryButton
                        size="lg"
                        label="Connect Safe"
                        onClick={() =>
                            open(
                                <Modal onClose={() => closeTop()}>
                                    <ConnectSafe 
                                        onClose={() => closeTop()}
                                        members={members || []}
                                        onSafeConnected={handleWalletCreated}
                                    />
                                </Modal>
                            )
                        }
                    />
                </div>
                <div className="flex flex-col items-start w-full max-w-[1040px] content-start gap-4">
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
                    <TertiaryButton
                        size="lg"
                        label="Track wallet"
                        onClick={() =>
                            open(
                                <Modal onClose={() => closeTop()}>
                                    <TrackWallet 
                                        onClose={() => closeTop()}
                                        onWalletTracked={handleWalletCreated}
                                    />
                                </Modal>
                            )
                        }
                    />
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