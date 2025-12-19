"use client";

import { ReactNode } from "react";
import Tooltip from "../../components/TooltipComponent";

type TertiaryButtonProps = {
    label: string;
    labelOnHover?: string;
    size?: 'sm' | 'md' | 'lg';
    status?: "brand" | "neutral" | "danger" | "neutral-brand" | "neutral-danger";
    leadingIcon?: ReactNode;
    trailingIcon?: ReactNode;
    tooltipTitle?: string;
    tooltipSubtitle?: string;
    tooltipPosition?: "top" | "bottom" | "left" | "right";
    disabled?: boolean;
    className?: string;
    onClick?: () => void;
};

export default function TertiaryButton({
    label,
    labelOnHover,
    size = 'md',
    status = "brand",
    leadingIcon,
    trailingIcon,
    tooltipTitle,
    tooltipSubtitle,
    tooltipPosition = "top",
    disabled = false,
    className = "",
    onClick,
}: TertiaryButtonProps) {
    const containerSizes = {
        sm: "h-6 py-[3px] px-[4px] gap-1.5", // Small container
        md: "h-8 py-[4px] px-[6px] gap-2",   // Medium container  
        lg: "h-10 py-[5px] px-[8px] gap-2.5", // Large container
    }[size];

    const iconSizes = {
        sm: "h-4 w-4", // 16px icon
        md: "h-5 w-5", // 24px icon
        lg: "h-6 w-6", // 32px icon
    }[size];

    const textSizes = {
        sm: "text-[12px] font-medium", // 12px Medium
        md: "text-[14px] font-medium", // 14px Medium
        lg: "text-[18px] font-medium", // 16px Semibold
    }[size];
    
    const labelBorder = {
        sm: "border-b-[1px] group-hover/tertiary-button:border-b-[1.5px]", // 12px Medium
        md: "border-b-[1px] group-hover/tertiary-button:border-b-[2px]", // 14px Medium
        lg: "border-b-[1px] group-hover/tertiary-button:border-b-[2.5px]", // 16px Semibold
    }[size];

    const statusClasses = {
        "brand": "bg-transparent text-[#26C9C9] border-[#26C9C9]/60 group-hover/tertiary-button:border-[#26C9C9] focus:bg-[#26C9C9]/8 focus:ring-[1px] focus:ring-[#EDEEEE] focus:ring-offset-[2px] focus:ring-offset-black",
        "neutral": "bg-transparent text-[#EDEEEE] border-[#EDEEEE]/60 group-hover/tertiary-button:border-[#EDEEEE] focus:bg-[#EDEEEE]/8 focus:ring-[1px] focus:ring-[#EDEEEE] focus:ring-offset-[2px] focus:ring-offset-black",
        "danger": "bg-transparent text-[#EF4444] border-[#EF4444]/60 group-hover/tertiary-button:border-[#EF4444] focus:bg-[#EF4444]/8 focus:ring-[1px] focus:ring-[#EF4444] focus:ring-offset-[2px] focus:ring-offset-black",
        "neutral-brand": "bg-transparent text-[#EDEEEE] border-[#EDEEEE]/60 group-hover/tertiary-button:border-[#EDEEEE] hover:text-[#26C9C9] focus:bg-[#26C9C9]/8 focus:ring-[1px] focus:ring-[#EDEEEE] focus:ring-offset-[2px] focus:ring-offset-black",
        "neutral-danger": "bg-transparent text-[#EDEEEE] border-[#EDEEEE]/60 group-hover/tertiary-button:border-[#EDEEEE] border-[#26C9C9]/60 hover:text-[#EF4444] focus:bg-[#EF4444]/8 focus:ring-[1px] focus:ring-[#EF4444] focus:ring-offset-[2px] focus:ring-offset-black",
    }[status];

    const disabledClasses = "opacity-40 cursor-not-allowed";

    const handleClick = () => {
        if (!disabled && onClick) {
            onClick();
        }
    };

    const button = (
        <div 
            className={`group/tertiary-button inline-flex rounded-full items-center ${containerSizes} ${className} ${statusClasses} ${disabled ? disabledClasses : 'hover:cursor-pointer'}`}
            onClick={handleClick}
        >
            {/* Leading Icon */}
            {leadingIcon && (
                <div className={`${disabled ? 'opacity-50' : 'opacity-70 group-hover/tertiary-button:opacity-100'} ${iconSizes}`}>
                    {leadingIcon}
                </div>
            )}

            {/* Text with border effect */}
            <div className={`${labelBorder} ${disabled ? 'border-[#EDEEEE]/30' : ''} flex px-[0] justify-center items-center gap-2.5 transition-all duration-50 ease-in-out`}>
                <span
                    className={`truncate font-[Geist] not-italic leading-[normal] tracking-[0.48px] transition-all duration-150 ${textSizes} ${labelOnHover && !disabled ? "group-hover/tertiary-button:opacity-0" : ""
                        } ${disabled ? 'text-[#EDEEEE]/60' : ''}`}
                >
                    {label}
                </span>
                {labelOnHover && !disabled && (
                    <span
                        className={`absolute truncate opacity-0 group-hover/tertiary-button:opacity-100 transition-all duration-150 font-[Geist] not-italic leading-[normal] tracking-[0.48px] ${textSizes} ${disabled ? 'text-[#EDEEEE]/60' : ''}`}
                    >
                        {labelOnHover}
                    </span>
                )}
            </div>

            {/* Trailing Icon */}
            {trailingIcon && (
                <div className={`${disabled ? 'opacity-50' : 'opacity-70 group-hover/tertiary-button:opacity-100'} ${iconSizes}`}>
                    {trailingIcon}
                </div>
            )}
        </div>
    );

    // Wrap with tooltip only if tooltipTitle is passed
    if (tooltipTitle) {
        return (
            <Tooltip
                title={tooltipTitle}
                subtitle={tooltipSubtitle}
                position={tooltipPosition}
            >
                {button}
            </Tooltip>
        );
    }

    return button;
}