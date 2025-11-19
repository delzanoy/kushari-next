import { ExternalLinkIcon, StatusDotIcon } from "@/app/components/icons";
import TertiaryButton from "@/app/components/buttons/TertiaryButton";
import { TransactionDetailsProps } from "./types";

export default function TransactionDetails({ transaction, addresses }: TransactionDetailsProps) {

    const showApprovalSteps = (transaction.walletType === 1 || transaction.walletType === 2) &&
        transaction.outgoing && !transaction.incoming;

    // Format timestamp to readable date
    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return {
            date: date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            time: date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
        };
    };

    const formattedDate = formatDate(transaction.timestamp);

    // Get initiator and executer names from transaction
    const initiator = transaction.initiator || 'Unknown';
    const executer = transaction.executer || 'Unknown';

    return (
        <div className="flex flex-col items-start w-full max-w-[1040px]">
            {showApprovalSteps && (
                <div className="flex py-[12px] px-[8px] items-start gap-4 self-stretch">
                    {/* Initiated Step */}
                    <div className="flex w-[152px] flex-col items-start gap-2">
                        <div className="flex w-full items-center gap-2">
                            <StatusDotIcon className="h-[18px] w-[18px] text-[#26C9C9]" />
                            <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-light leading-[normal] tracking-[0.7px]">Initiated</span>
                        </div>
                        <div className="flex pl-[26px] flex-col items-start gap-1">
                            <span className="text-[#EDEEEE] font-[Geist] text-xs not-italic font-medium leading-[normal] tracking-[0.48px]">{initiator}</span>
                            <span className="text-[#F8FCFF] font-[Geist] text-[10px] not-italic font-normal leading-[normal] opacity-50">
                                {formattedDate.date} <span className="font-light">{formattedDate.time}</span>
                            </span>
                        </div>
                    </div>

                    {/* Approved Step */}
                    <div className="flex w-40 flex-col items-start gap-2">
                        <div className="flex w-full items-center gap-2">
                            <StatusDotIcon className="h-[18px] w-[18px] text-[#26C9C9]" />
                            <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-light leading-[normal] tracking-[0.7px]">Approved</span>
                        </div>
                        <div className="flex pl-[26px] flex-col items-start gap-1">
                            <div className="flex h-4 pr-11 relative">
                                <TertiaryButton status="neutral" label="Details" className="absolute -left-1.5 -top-2" />
                            </div>
                            <span className="text-[#F8FCFF] font-[Geist] text-[10px] not-italic font-normal leading-[normal] opacity-50">
                                {formattedDate.date} <span className="font-light">{formattedDate.time}</span>
                            </span>
                        </div>
                    </div>

                    {/* Executed Step */}
                    <div className="flex w-[152px] flex-col items-start gap-2">
                        <div className="flex w-full items-center gap-2">
                            <StatusDotIcon className="h-[18px] w-[18px] text-[#26C9C9]" />
                            <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-light leading-[normal] tracking-[0.7px]">Executed</span>
                        </div>
                        <div className="flex pl-[26px] flex-col items-start gap-1">
                            <span className="text-[#EDEEEE] font-[Geist] text-xs not-italic font-medium leading-[normal] tracking-[0.48px]">{executer}</span>
                            <span className="text-[#F8FCFF] font-[Geist] text-[10px] not-italic font-normal leading-[normal] opacity-50">
                                {formattedDate.date} <span className="font-light">{formattedDate.time}</span>
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Transaction Hash and Gas Fees */}
            <div className="flex pt-[12px] pr-[8px] pb-[20px] pl-[8px] justify-between items-baseline self-stretch">
                {/* Gas Fees - You might want to add this data to your transaction type */}
                <div className="flex pl-[26px] items-baseline gap-1">
                    <span className="text-[#F8FCFF] font-[Geist] text-[10px] not-italic font-normal leading-none opacity-50">
                        Gas fees
                    </span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-[#EDEEEE] font-[Geist] text-xs not-italic font-normal leading-none tracking-[0.48px]">
                            ETH 0.00000002
                        </span>
                        <span className="text-[#EDEEEE] font-[Geist] text-xs not-italic font-extralight leading-none tracking-[0.48px]">
                            $0.000037
                        </span>
                    </div>
                </div>

                {/* Transaction Hash */}
                <div className="flex pt-px items-center">
                    <div className="flex pt-0.5 justify-center items-center gap-2.5">
                        <span className="text-[#F8FCFF] font-[Geist] text-[10px] not-italic font-normal leading-[normal] opacity-50">Transaction hash</span>
                    </div>
                    <TertiaryButton
                        label={transaction.id}
                        // labelOnHover="Copy hash" 
                        tooltipTitle="Copy hash"
                    />
                    <div className="flex h-[24.5px] items-center gap-2.5">
                        <ExternalLinkIcon className="h-4 text-[#FFFFFF]" />
                    </div>
                </div>
            </div>
        </div>
    );
}