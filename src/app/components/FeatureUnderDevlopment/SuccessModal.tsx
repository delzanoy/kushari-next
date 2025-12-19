"use client";
import React, { useEffect, useRef, useCallback } from "react";
import { CheckBoxCircleFilledIcon, MailFilledIcon, CloseIcon } from "../icons/";
import IconButton from "../buttons/IconButton";
import { useState } from "react";
import { useModalContext } from "../modal/Modal";

interface SuccessModalProps {
  message?: string;
  onClose?: () => void;
  autoCloseDelay?: number;
}

export default function SuccessModal({
  message = "Message sent",
  onClose,
  autoCloseDelay = 3000
}: SuccessModalProps) {
  const [showEscTooltip, setShowEscTooltip] = useState(false);
  const [escPressCount, setEscPressCount] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { escStage, isTopModal } = useModalContext();

  // Clear any existing timer
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleClose = useCallback(() => {
    clearTimer();
    onClose?.();
  }, [onClose, clearTimer]);

  // Handle ESC stage changes - more robust version
  useEffect(() => {
    if (!isTopModal) {
      setShowEscTooltip(false);
      setEscPressCount(0);
      return;
    }

    // When escStage changes from 0 to 1, show tooltip
    if (escStage === 1) {
      setShowEscTooltip(true);
      setEscPressCount(1);
    } 
    // When escStage is 0 (no ESC press or reset)
    else if (escStage === 0) {
      // If we were showing tooltip and now escStage is 0, it means second ESC was pressed
      if (showEscTooltip && escPressCount === 1) {
        handleClose();
      }
      setShowEscTooltip(false);
      setEscPressCount(0);
    }
  }, [escStage, isTopModal, handleClose, showEscTooltip, escPressCount]); // Added missing dependencies

  // Handle ESC key directly as fallback
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isTopModal) {
        if (!showEscTooltip) {
          // First ESC - show tooltip
          setShowEscTooltip(true);
        } else {
          // Second ESC - close
          handleClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showEscTooltip, handleClose, isTopModal]);

  useEffect(() => {
    const el = ref.current;
    if (el) {
      el.focus();
      el.setAttribute('aria-live', 'assertive');
    }

    // Auto close after delay
    timerRef.current = setTimeout(() => {
      handleClose();
    }, autoCloseDelay);

    return () => {
      clearTimer();
    };
  }, [handleClose, autoCloseDelay, clearTimer]);

  return (
    <div
      ref={ref}
      tabIndex={-2}
      className="flex w-[568px] p-4 flex-col items-start gap-[30px] rounded-3xl border-[0.5px] border-solid border-[rgba(248,252,255,0.24)] transition-all duration-300 mt-[80px] bg-[#151819]"
      aria-live="assertive"
      role="alert"
    >
      <span className="sr-only">Message sent successfully</span>

      <div className="flex flex-col items-start gap-2.5 self-stretch">
        <div className="flex justify-between items-start self-stretch">
          <div className="flex relative p-2.5 items-center gap-2.5 rounded-[10px] bg-[#26C9C9]/20">
            <MailFilledIcon className="w-8 h-8 aspect-square opacity-70" />
            <CheckBoxCircleFilledIcon className="absolute inline-flex w-5 h-5 aspect-square bottom-[4px] right-[4px] text-green-500" />
          </div>

          <IconButton
            icon={<CloseIcon />}
            size="sm"
            status={showEscTooltip ? "danger" : "neutral"}
            onClick={handleClose}
            tooltipTitle="Esc again to confirm"
            showTooltip={showEscTooltip}
          />
        </div>
        <div className="flex py-[0] px-[12px] flex-col items-start gap-2.5 self-stretch">
          <span className="text-[#F8FCFF] font-[Figtree] text-[26px] not-italic font-medium leading-[normal] tracking-[1.04px]">
            {message}
          </span>
          <span className="text-[#EDEEEE] font-[Geist] text-sm not-italic font-normal leading-[normal] tracking-[0.56px]">
            Thank you for your time!
          </span>
          <span className="text-[#EDEEEE] font-[Geist] text-sm not-italic font-normal leading-[normal] tracking-[0.56px]">
            This will close in a moment...
          </span>
        </div>
      </div>
    </div>
  );
}