import { WalletSummary } from "../type";

interface Wallet {
    wallet: WalletSummary;
    onClose?: () => void;
}

export default function MakeDeposit({  }: Wallet) {}