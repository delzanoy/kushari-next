import IconButton from "@/app/components/buttons/IconButton";
import { useState, useEffect, useRef } from "react";
import { TrackWalletIcon, CloseIcon } from "@/app/components/icons";
import { Modal, useModalContext } from "../../components/modal/Modal";

interface TrackWalletProps {
    onClose?: () => void;
}

export default function TrackWallet({ onClose }: TrackWalletProps) {
    const [showEscTooltip, setShowEscTooltip] = useState(false);

    // Get ESC stage from modal context
        const { escStage, isTopModal } = useModalContext();

    // Show/hide ESC tooltip based on ESC stage
        useEffect(() => {
            if (escStage === 1 && isTopModal) {
                setShowEscTooltip(true);
            } else {
                setShowEscTooltip(false);
            }
        }, [escStage, isTopModal]);

    return (
        <div className="flex w-[568px] p-4 flex-col items-start gap-[30px] rounded-3xl border-[0.5px] border-solid border-[rgba(248,252,255,0.24)] transition-all duration-300 mt-[80px] bg-[#151819]">
            <div className="flex flex-col items-start gap-2.5 self-stretch">
                <div className="flex justify-between items-start self-stretch">
                    <div className="flex p-2.5 items-center gap-2.5 rounded-[10px] bg-[#F8FCFF]/6">
                        <TrackWalletIcon className="w-8 h-8 aspect-square" />
                    </div>

                    <IconButton
                        icon={<CloseIcon />}
                        size="sm"
                        status={showEscTooltip ? "danger" : "neutral"}
                        onClick={onClose}
                        tooltipTitle="Esc again to confirm"
                        showTooltip={showEscTooltip}
                    />
                </div>
                <div className="flex py-[0] px-[12px] flex-col items-start gap-2.5 self-stretch">
                    <span className="text-[#F8FCFF] font-[Figtree] text-[26px] not-italic font-medium leading-[normal] tracking-[1.04px]">
                        Track wallet
                    </span>
                    <span className="text-[#EDEEEE] font-[Geist] text-sm not-italic font-normal leading-[normal] tracking-[0.56px]">
                        Build visibility by tracking your wallets.
                    </span>
                </div>
            </div>


        </div>
    );
}