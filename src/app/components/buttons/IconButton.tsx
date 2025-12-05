"use client";

import { ReactNode } from "react";
import Tooltip from "../../components/TooltipComponent";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
  status?: "brand" | "neutral" | "danger" | "neutral-brand" | "neutral-danger" | "success";
  tooltipTitle?: string;
  qrCode?: string;
  tooltipSubtitle?: string;
  tooltipPosition?: "top" | "bottom" | "left" | "right";
  icon: ReactNode;
    showTooltip?: boolean; // Add this
}

export default function IconButton({
  size = "lg",
  status = "brand",
  tooltipTitle,
  qrCode,
  tooltipSubtitle,
  tooltipPosition = "top",
  icon,
  className,
    showTooltip = false, // Default to false
  ...props
}: IconButtonProps) {
  const containerSizes = {
    sm: "h-4 w-4 min-h-4 min-w-4", // 32px container
    md: "h-6 w-6 min-h-6 min-w-6", // 40px container
    lg: "h-8 w-8 min-h-8 min-w-8", // 48px container
  }[size];

  const innerContainerSizes = {
    sm: "h-8 w-8 min-h-8 min-w-8", // 32px container
    md: "h-10 w-10 min-h-10 min-w-10", // 40px container
    lg: "h-12 w-12 min-h-12 min-w-12", // 48px container
  }[size];

  const iconSizes = {
    sm: "h-4 w-4", // 16px icon
    md: "h-6 w-6", // 24px icon
    lg: "h-8 w-8", // 32px icon
  }[size];

  const statusClasses = {
    "brand": "bg-transparent text-[#26C9C9] hover:bg-[#26C9C9]/16 focus:bg-[#26C9C9]/8 focus:ring-[1px] focus:ring-[#EDEEEE] focus:ring-offset-[2px] focus:ring-offset-black",
    "neutral": "bg-transparent text-[#EDEEEE] hover:bg-[#EDEEEE]/16 focus:bg-[#EDEEEE]/8 focus:ring-[1px] focus:ring-[#EDEEEE] focus:ring-offset-[2px] focus:ring-offset-black",
    "danger": "bg-transparent text-[#EF4444] hover:bg-[#EF4444]/16 focus:bg-[#EF4444]/8 focus:ring-[1px] focus:ring-[#EF4444] focus:ring-offset-[2px] focus:ring-offset-black",
    "neutral-brand": "bg-transparent text-[#EDEEEE] hover:bg-[#26C9C9]/16 hover:text-[#26C9C9] focus:bg-[#26C9C9]/8 focus:ring-[1px] focus:ring-[#EDEEEE] focus:ring-offset-[2px] focus:ring-offset-black",
    "neutral-danger": "bg-transparent text-[#EDEEEE] hover:bg-[#EF4444]/16 hover:text-[#EF4444] focus:bg-[#EF4444]/8 focus:ring-[1px] focus:ring-[#EF4444] focus:ring-offset-[2px] focus:ring-offset-black",
    "success": "bg-transparent text-[#22C55E] hover:bg-[#209762]/16 focus:bg-[#209762]/8 focus:ring-[1px] focus:ring-[#22C55E] focus:ring-offset-[2px] focus:ring-offset-black",
  }[status];

  const button = (
    <button
      {...props}
      className={[
        "transition-all duration-150 ease-in-out focus:outline-none inline-flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-150 ease-in-out cursor-pointer",
        containerSizes,
        className
      ].filter(Boolean).join(" ")}
    ><div className={`${innerContainerSizes} ${statusClasses} rounded-full inline-flex items-center justify-center`}>
        <div className={iconSizes}>
          {icon}
        </div>
      </div>
    </button>
  );

  // Wrap with tooltip only if tooltipTitle is passed
  if (tooltipTitle && showTooltip) {
    return (
      <Tooltip
        title={tooltipTitle}
        qrCode={qrCode}
        subtitle={tooltipSubtitle}
        position={tooltipPosition}
        open={showTooltip}
      >
        {button}
      </Tooltip>
    );
  }

  return button;
}

