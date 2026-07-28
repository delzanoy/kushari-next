"use client";

import { use, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useWallets, useCryptocurrencies, useMembers, useAddresses } from "@/hooks/useData";
import { enrichWalletsWithPrices } from "@/lib/wallet-enrichment";
import WalletDetails from "@/components/molecules/wallet/WalletDetails";
import { ProposalCategory } from "@/components/molecules/transactions/proposals/types";

export default function WalletDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const walletId = parseInt(id, 10);
    const router = useRouter();

    const { wallets: rawWallets, isLoading: walletsLoading } = useWallets();
    const { cryptocurrencies, isLoading: cryptoLoading } = useCryptocurrencies();
    const { members, isLoading: membersLoading } = useMembers();
    const { addresses, isLoading: addressesLoading } = useAddresses();

    const wallets = useMemo(() => {
        if (!rawWallets || !cryptocurrencies) return [];
        return enrichWalletsWithPrices(rawWallets as any[], cryptocurrencies) as unknown as import("@/components/molecules/wallet/types").Wallet[];
    }, [rawWallets, cryptocurrencies]);

    const wallet = useMemo(() => {
        return wallets.find(w => w.id === walletId) as import("@/components/molecules/wallet/types").Wallet | undefined;
    }, [wallets, walletId]);

    const handleWalletChange = (newId: number, activeTab?: string, activeProposalFilter?: ProposalCategory | null) => {
        let url = `/wallets/${newId}`;
        const params = new URLSearchParams();
        if (activeTab) {
            params.set('tab', activeTab);
        }
        if (activeProposalFilter) {
            params.set('subtab', activeProposalFilter);
        }
        if (params.toString()) {
            url += `?${params.toString()}`;
        }
        router.push(url);
    };

    if (walletsLoading || cryptoLoading || membersLoading || addressesLoading) {
        return (
            <div className="flex h-[calc(100vh-100px)] w-full items-center justify-center text-[var(--color-text-muted)]">
                Loading wallet...
            </div>
        );
    }

    if (!wallet) {
        return (
            <div className="flex h-[calc(100vh-100px)] w-full items-center justify-center text-[var(--color-text-muted)]">
                Wallet not found
            </div>
        );
    }

    return (
        <div className="min-h-full bg-black flex flex-col pt-6 pb-24 px-8 overflow-x-hidden selection:bg-cyan-500/30">
            <div className="w-full max-w-[1040px] mx-auto">
                <WalletDetails 
                    wallet={wallet} 
                    wallets={wallets}
                    cryptocurrencies={cryptocurrencies || []}
                    members={members || []}
                    addresses={addresses || []}
                    onWalletChange={handleWalletChange}
                />
            </div>
        </div>
    );
}
