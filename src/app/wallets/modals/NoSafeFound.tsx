"use client";
import PrimaryButton from "@/app/components/buttons/PrimaryButton";
import { ArrowLeftIcon, ForbiddenIcon, CloseIcon, CloseCircleFilledIcon } from "@/app/components/icons";
import { useModalContext } from "@/app/components/modal/Modal";
import React, { useEffect, useRef, useState } from "react";
import IconButton from "@/app/components/buttons/IconButton";
import useModal from "@/app/hooks/useModal";

interface NoSafeFoundProps {
  onClose?: () => void;
  onRetry?: () => void;
}

export default function NoSafeFound({ onClose, onRetry }: NoSafeFoundProps) {
  const { escStage, isTopModal } = useModalContext();
  const [showEscTooltip, setShowEscTooltip] = useState(false);
  const { closeTop } = useModal();
  
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (escStage === 1 && isTopModal) {
      setShowEscTooltip(true);
    } else {
      setShowEscTooltip(false);
    }
  }, [escStage, isTopModal]);

  useEffect(() => {
    const el = ref.current;
    if (el) {
      el.focus();
      el.setAttribute('aria-live', 'polite');
    }
  }, []);

  const handleClose = () => {
    closeTop(); // Close NoSafeFound modal
    if (onClose) {
      onClose(); // This will close the ConnectSafe modal as well
    }
  };

  const handleTryAgain = () => {
    closeTop(); // Close NoSafeFound modal
    if (onRetry) {
      onRetry(); // Call the retry callback to reset ConnectSafe to initial state
    }
  };

  return (
    <div
      ref={ref}
      tabIndex={-1}
      className="flex w-[568px] p-4 flex-col items-start gap-[30px] rounded-3xl border-[0.5px] border-solid border-[rgba(248,252,255,0.24)] transition-all duration-300 mt-[80px] bg-[#151819]"
      aria-live="polite"
      role="status"
    >
      <div className="flex flex-col items-start gap-2.5 self-stretch">
        <div className="flex justify-between items-start self-stretch">
          <div className="flex relative p-2.5 items-center gap-2.5 rounded-[10px] bg-[#EFFF16]/12">
            <ForbiddenIcon className="w-8 h-8 aspect-square text-[#EFFF16]" />
          </div>
          
          <IconButton
            icon={showEscTooltip ? <CloseCircleFilledIcon /> : <CloseIcon />}
            size="sm"
            status={showEscTooltip ? "danger" : "neutral"}
            onClick={handleClose}
            tooltipTitle="Esc again to confirm"
            showTooltip={showEscTooltip}
          />
        </div>
        
        <div className="flex py-[0] px-[12px] flex-col items-start gap-2.5 self-stretch">
          <span className="text-[#F8FCFF] font-[Figtree] text-[26px] not-italic font-medium leading-[normal] tracking-[1.04px]">
            No safe found
          </span>
          <span className="text-[#EDEEEE] font-[Geist] text-sm not-italic font-normal leading-[normal] tracking-[0.56px]">
            Connect a wallet assigned as the owner of a Gnosis Safe
          </span>
        </div>
      </div>
      
      <div className="flex py-[0] px-[12px] w-full">
        <PrimaryButton 
          variant="neutral" 
          label="Try again" 
          leadingIcon={<ArrowLeftIcon />} 
          size="md"
          onClick={handleTryAgain}
        />
      </div>
    </div>
  );
}