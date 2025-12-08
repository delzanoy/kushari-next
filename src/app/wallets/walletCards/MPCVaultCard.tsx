import { ArrowDownIcon, ArrowUpIcon, ZeroIcon, VaultIcon, QRCodeIcon, SendIcon } from "@/app/components/icons";
import { WalletSummary } from "../type";
import { formatCents, formatDollars, formatSmallNumber } from "@/app/components/helpers";
import IconButton from "@/app/components/buttons/IconButton";
import useModal from "@/app/hooks/useModal";
import { Modal } from "@/app/components/modal/Modal";
import MakeDeposit from "../modals/MakeDeposit";

interface Wallet {
    wallet: WalletSummary;
    onClick?: () => void;
}

export default function MPCVaultCard({ wallet, onClick }: Wallet) {
    const { open, closeTop } = useModal(); // Get closeTop from useModal

    const handleQRCodeClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        openMakeDepositModal();
    };

    const handleSendClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        console.log("Send clicked for wallet:", wallet.name);
    };

    // Function to open the MakeDeposit modal
    const openMakeDepositModal = () => {
        open(
            <Modal onRequestClose={() => {
                closeTop(); // Close the modal when onRequestClose is called
                return true; // Allow the modal to close
            }}>
                <MakeDeposit 
                    wallet={wallet}
                    onClose={closeTop} // Pass closeTop to MakeDeposit
                />
            </Modal>
        );
    };

    const render24hPercentage = (percentage: number) => {
        if (percentage < 0) {
            return <div className="flex pt-px items-center gap-1">
                <ArrowDownIcon className="h-4 w-4 text-[#F37272]" />
                <span className="text-[#F37272] font-[Geist Mono] text-[13px] not-italic font-light leading-[100%] tracking-[1.56px]">{formatSmallNumber(wallet.percent_change_24h)}%</span>
            </div>
        } else if (percentage > 0) {
            return <div className="flex pt-px items-center gap-1">
                <ArrowUpIcon className="h-4 w-4 text-[#64DEA7]" />
                <span className="text-[#64DEA7] font-[Geist Mono] text-[13px] not-italic font-light leading-[100%] tracking-[1.56px]">{formatSmallNumber(wallet.percent_change_24h)}%</span>
            </div>
        } else {
            return <div className="flex pt-px items-center gap-1">
                <ZeroIcon className="h-4 w-4 text-[#F8FCFF] opacity-50" />
                <span className="text-[#F8FCFF] opacity-50 font-[Geist Mono] text-[13px] not-italic font-light leading-[100%] tracking-[1.56px]">{formatSmallNumber(wallet.percent_change_24h)}%</span>
            </div>
        }
    };

    wallet.name = wallet.name.charAt(0).toUpperCase() + wallet.name.slice(1);

    return (
        <div className="group flex w-[336px] pt-[16px] pr-[16px] pb-[16px] pl-[24px] items-end gap-2.5 shrink-0 rounded-3xl border-[0.8px] border-solid border-[#2E3435] bg-[#121315]
        hover:border-[0.5px] 
        hover:border-solid 
        hover:border-[rgba(38,201,201,0.7)] 
        hover:bg-[#1C2325] 
        hover:shadow-[0_34px_10px_0_rgba(38,201,200,0.00),0_22px_9px_0_rgba(38,201,200,0.01),0_12px_7px_0_rgba(38,201,200,0.05),0_5px_5px_0_rgba(38,201,200,0.09),0_1px_3px_0_rgba(38,201,200,0.10)]
        transition-all duration-150 ease-in-out hover:scale-101 cursor-pointer active:scale-98"
            onClick={onClick}
        >
            <div className="flex w-[165px] flex-col items-start gap-6 shrink-0">
                <div className="flex items-center gap-1.5 self-stretch">
                    <div className="w-[18px] h-[18px] shrink-0 relative  flex items-center justify-center">
                        <VaultIcon className="w-[18px] h-[18px] text-[#D5D7D7]" />
                    </div>
                    <span className="text-[#F8FCFF] text-center font-[Geist] text-sm not-italic font-medium leading-[150%] tracking-[0.96px]">{wallet.name}</span>
                </div>
                <div className="flex flex-col items-start gap-1.5 self-stretch">
                    <div className="flex items-baseline gap-1.5">
                        <div className="gap-0">
                            <span className="text-[#E7E8E9] font-[Geist] text-base not-italic font-medium leading-[100%] tracking-[0.96px]">{formatDollars(wallet.USDBalance)}</span>
                            <span className="text-[#C8CACB] font-[Geist] text-base not-italic font-thin text-sm leading-[100%] tracking-[0.96px]">.{formatCents(wallet.USDBalance)}</span>
                        </div>
                        <span className="text-[#F8FCFF] font-[Geist] text-base not-italic font-medium leading-[100%] opacity-40">USD</span>
                    </div>

                    {render24hPercentage(wallet.percent_change_24h)}
                </div>
            </div>
            <div className="h-6 flex justify-end items-center gap-6 flex-[1_0_0] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                <IconButton icon={<QRCodeIcon />} size="md" status="brand" className="transition-all duration-200 scale-0 group-hover:scale-100" onClick={handleQRCodeClick} />
                <IconButton icon={<SendIcon />} size="md" status="brand" className="transition-all duration-200 scale-0 group-hover:scale-100" onClick={handleSendClick} />
            </div>
        </div>
    );
}