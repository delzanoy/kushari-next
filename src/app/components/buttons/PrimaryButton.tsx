"use client";

import { ReactNode, useState } from "react";
import Tooltip from "../../components/TooltipComponent";

type ButtonVariant =
  | "brand"
  | "brand-tonal"
  | "neutral"
  | "danger"
  | "neutral-brand"
  | "neutral-danger"
  | "danger-prominent"
  | "inverted";

type ButtonSize = "sm" | "md" | "lg";

type PrimaryButtonProps = {
  label: string;
  labelOnHover?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  tooltipTitle?: string;
  tooltipSubtitle?: string;
  tooltipPosition?: "top" | "bottom" | "left" | "right";
  disabled?: boolean;
  className?: string;
  rounded?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

export default function PrimaryButton({
  label,
  labelOnHover,
  variant = "brand",
  size = "md",
  leadingIcon,
  trailingIcon,
  tooltipTitle,
  tooltipSubtitle,
  tooltipPosition = "top",
  disabled = false,
  className = "",
  rounded = false,
  type = "button",
  onClick,
  onMouseEnter,
  onMouseLeave,
}: PrimaryButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Size rules
  const sizeClasses = {
    lg: `h-10 pt-[8px] pr-[16px] pb-[8px] pl-[14px] gap-2.5 ${rounded ? "rounded-full" : "rounded-[14px]"}`,
    md: `pt-[4px] pr-[12px] pb-[4px] pl-[10px] gap-2 ${rounded ? "rounded-full" : "rounded-[10px]"}`,
    sm: `pt-[4px] pr-[10px] pb-[4px] pl-[8px] gap-1.5 ${rounded ? "rounded-full" : "rounded-[8px]"}`,
  }[size];

  // Border widths by size
  const borderWidths = {
    lg: "border-[0.8px]",
    md: "border-[0.5px]",
    sm: "border-[0.5px]",
  }[size];

  // Typography
  const textClasses = {
    lg: "text-base font-semibold leading-[22px] tracking-[0.64px]",
    md: "text-sm font-medium leading-[22px] tracking-[0.56px]",
    sm: "text-xs font-medium leading-[normal] tracking-[0.48px]",
  }[size];

  // Icon
  const iconSizes = {
    lg: "w-[18px] h-[18px]",
    md: "w-[16px] h-[16px]",
    sm: "w-[14px] h-[14px]",
  }[size];

  // Variants with proper hover states
  const getVariantClasses = (variant: ButtonVariant, isHovered: boolean) => {
    const baseClasses = {
      brand: {
        default: `${borderWidths} border-solid border-[rgba(156,236,236,0.4)] shadow-[0_34px_20px_0_rgba(38,201,200,0.00),0_22px_14px_0_rgba(38,201,200,0.01),0_12px_11px_0_rgba(38,201,200,0.05)] bg-gradient-to-b from-[#1E8889] to-[#155455]`,
        hover: `${borderWidths} border-solid border-[#9CECEC] shadow-[0_34px_20px_0_rgba(38,201,200,0.00),0_22px_14px_0_rgba(38,201,200,0.01),0_12px_11px_0_rgba(38,201,200,0.05)] bg-gradient-to-b from-[#2D898B] to-[#145D5D]`
      },
      "brand-tonal": {
        default: `${borderWidths} border-solid border-transparent bg-[#0C2627]`,
        hover: `${borderWidths} border-solid border-[#9CECEC] shadow-[0_34px_20px_0_rgba(38,201,200,0.00),0_22px_14px_0_rgba(38,201,200,0.01),0_12px_11px_0_rgba(38,201,200,0.05)] bg-gradient-to-b from-[#0C2627] to-[#071C1D]`
      },
      neutral: {
        default: `${borderWidths} border-solid border-transparent bg-[rgba(248,252,255,0.10)]`,
        hover: `${borderWidths} border-solid border-[#F8FCFF] bg-[rgba(248,252,255,0.16)]`
      },
      "neutral-brand": {
        default: `${borderWidths} border-solid border-transparent bg-[#F8FCFF]/10`,
        hover: `${borderWidths} border-solid border-[#9CECEC] shadow-[0_34px_20px_0_rgba(38,201,200,0.00),0_22px_14px_0_rgba(38,201,200,0.01),0_12px_11px_0_rgba(38,201,200,0.05)] bg-gradient-to-b from-[#0C2627] to-[#071C1D]`
      },
      "neutral-danger": {
        default: `${borderWidths} border-solid border-transparent bg-[rgba(248,252,255,0.10)]`,
        hover: `${borderWidths} border-solid border-[#EF4444] bg-[#2E1C1C]`
      },
      danger: {
        default: `${borderWidths} border-solid border-transparent bg-[#201313]`,
        hover: `${borderWidths} border-solid border-[#EF4444] bg-[#2E1C1C]`
      },
      "danger-prominent": {
        default: `${borderWidths} border-solid border-transparent bg-[#A2473D]`,
        hover: `${borderWidths} border-solid border-[#FDB5B5] bg-[#D54130]`
      },
      inverted: {
        default: `${borderWidths} border-solid border-[#DDDFDF] bg-gradient-to-b from-[#D7DCF4] to-[#C8CEEF]`,
        hover: `${borderWidths} border-solid border-[#F7F8F8] bg-gradient-to-b from-white to-[#EFF1FA]`
      }
    }[variant];

    return isHovered ? baseClasses.hover : baseClasses.default;
  };

  // Text colors with hover transitions
  const getTextColor = (variant: ButtonVariant, isHovered: boolean) => {
    const colors = {
      brand: "text-[#FBFEFE]",
      "brand-tonal": "text-[#6CDFE0]",
      neutral: "text-[#FBFEFE]",
      "neutral-brand": isHovered ? "text-[#FBFEFE]" : "text-[#FBFEFE]",
      "neutral-danger": isHovered ? "text-[#EF4444]" : "text-[#FBFEFE]",
      danger: "text-[#EF4444]",
      "danger-prominent": "text-[#FBFEFE]",
      inverted: "text-[#010404]"
    }[variant];

    return colors;
  };

  // Special shadow for inverted variant on hover
  const getShadow = (variant: ButtonVariant, isHovered: boolean) => {
    if (variant === "inverted" && isHovered) {
      return "shadow-[0_51px_14px_0_rgba(242,244,251,0.00),0_33px_13px_0_rgba(242,244,251,0.01),0_19px_11px_0_rgba(242,244,251,0.05),0_8px_8px_0_rgba(242,244,251,0.09),0_2px_5px_0_rgba(242,244,251,0.10)]";
    }
    return "";
  };

  const variantClasses = getVariantClasses(variant, isHovered);
  const textColor = getTextColor(variant, isHovered);
  const shadow = getShadow(variant, isHovered);

  const baseClasses = `
    inline-flex items-center shrink-0 justify-center
    transition-all duration-150 ease-in-out
    ${sizeClasses} ${variantClasses} ${shadow}
    ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
    ${className}
  `;

  const handleMouseEnter = () => {
    setIsHovered(true);
    onMouseEnter?.();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onMouseLeave?.();
  };

  const button = (
    <button
      type={type}
      disabled={disabled}
      className={baseClasses}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Leading Icon */}
      {leadingIcon && (
        <div className={`${iconSizes} ${textColor}`}>
          {leadingIcon}
        </div>
      )}
      {/* Text */}
      <span
        className={`font-[Geist] not-italic ${textClasses} ${textColor} ${labelOnHover ? "group-hover:opacity-0" : ""
          } transition-all duration-150`}
      >
        {label}
      </span>
      {/* Hover Label */}
      {labelOnHover && (
        <span
          className={`absolute opacity-0 group-hover:opacity-100 transition-all duration-150 font-[Geist] not-italic ${textClasses} ${textColor}`}
        >
          {labelOnHover}
        </span>
      )}
      {/* Trailing Icon */}
      {trailingIcon && (
        <div className={`${iconSizes} ${textColor}`}>
          {trailingIcon}
        </div>
      )}
    </button>
  );

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