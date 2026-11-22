"use client";

import { RiForbidFill, RiArrowLeftLongLine, RiCloseLine, RiCloseCircleFill } from "@remixicon/react";
import { Button } from "@/components/atoms/Button";
import { IconButton } from "@/components/atoms/IconButton";
import { Tooltip } from "@/components/atoms/Tooltip";
import { useModalContext } from "@/components/molecules/modal/Modal";
import { useEffect, useState } from "react";
import { MODAL_WIDTH } from "@/components/molecules/modal/Modal";

interface NoSafeFoundProps {
    onClose: () => void;
    onRetry: () => void;
}

export default function NoSafeFound({ onClose, onRetry }: NoSafeFoundProps) {
    const { escStage, isTopModal } = useModalContext();
    const [showEscTooltip, setShowEscTooltip] = useState(false);

    useEffect(() => {
        if (escStage === 1 && isTopModal) {
            setShowEscTooltip(true);
        } else {
            setShowEscTooltip(false);
        }
    }, [escStage, isTopModal]);

    return (
        <div className={`flex flex-col items-start p-4 bg-[rgba(10,10,10,0.95)] border border-[var(--color-border-subtle)] rounded-3xl ${MODAL_WIDTH.small} gap-6 text-left relative backdrop-blur-xl`}>
            {/* Header Section */}
            <div className="flex flex-col items-start gap-3 self-stretch">
                <div className="flex justify-between items-center self-stretch">
                    <div className="flex p-2.5 items-center justify-center rounded-xl bg-[var(--color-text-warning)]/[0.08] border border-[var(--color-text-warning)]/[0.12]">
                        <RiForbidFill size={24} className="text-[var(--color-text-warning)]" />
                    </div>

                    <Tooltip content="Esc again to confirm" open={showEscTooltip} placement="bottom">
                        <div>
                            <IconButton
                                icon={showEscTooltip ? <RiCloseCircleFill size={20} /> : <RiCloseLine size={20} />}
                                size="sm"
                                flat
                                variant={showEscTooltip ? "danger" : "neutral"}
                                appearance="ghost"
                                onClick={onClose}
                                aria-label="Close modal"
                            />
                        </div>
                    </Tooltip>
                </div>
                
                <div className="flex flex-col items-start gap-1.5 self-stretch mt-1 px-2">
                    <span className="text-[var(--color-text-primary)] text-xl font-medium tracking-tight">
                        No safe found
                    </span>
                    <span className="text-[var(--color-text-muted)] text-sm tracking-tight leading-relaxed">
                        Connect a wallet assigned as the owner of a Gnosis Safe
                    </span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 w-full items-start px-2">
                <Button
                    variant="neutral"
                    appearance="filled"
                    flat
                    size="sm"
                    onClick={onRetry}
                    leadingIcon={<RiArrowLeftLongLine size={16} />}
                >
                    Try again
                </Button>
            </div>
        </div>
    );
}
