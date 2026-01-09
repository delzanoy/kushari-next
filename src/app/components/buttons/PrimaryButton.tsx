import { ReactNode, useState, useRef } from "react";
import Tooltip from "../../components/TooltipComponent";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, animate } from "framer-motion";

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
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Metal shader values
  const metalX = useMotionValue(0);
  const metalY = useMotionValue(0);
  const metalRadius = useMotionValue(0);
  const metalOpacity = useSpring(0, {
    stiffness: 500,
    damping: 30,
    mass: 0.7
  });

  // Highlight effect values
  const highlightX = useMotionValue(0);
  const highlightY = useMotionValue(0);
  const highlightSize = useMotionValue(0);
  const highlightOpacity = useSpring(0, { stiffness: 400, damping: 25 });

  // Metal gradient - Apple-like specular highlight
  const metalGradient = useTransform(
    [metalX, metalY, metalRadius],
    ([x, y, r]: number[]) => {
      return `radial-gradient(${r * 2}px at ${x}px ${y}px, 
        rgba(255, 255, 255, 0.4) 0%,
        rgba(255, 255, 255, 0.2) 30%,
        rgba(255, 255, 255, 0.1) 60%,
        transparent 100%)`;
    }
  );

  // Apple-style specular highlight spot
  const highlightGradient = useTransform(
    [highlightX, highlightY, highlightSize],
    ([x, y, s]: number[]) => {
      return `radial-gradient(${s}px at ${x}px ${y}px, 
        rgba(255, 255, 255, 0.8) 0%,
        rgba(255, 255, 255, 0.2) 50%,
        transparent 100%)`;
    }
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const maxDimension = Math.max(rect.width, rect.height);

      metalX.set(x);
      metalY.set(y);
      metalRadius.set(maxDimension);
      metalOpacity.set(1);

      highlightX.set(x);
      highlightY.set(y);
      highlightSize.set(15);
      highlightOpacity.set(0.6);

      animate(highlightSize, maxDimension * 0.4, {
        duration: 0.4,
        ease: "easeOut"
      });
      animate(highlightOpacity, 0, {
        duration: 0.4,
        ease: "easeOut"
      });
    }
  };

  const handlePointerUp = () => {
    animate(metalOpacity, 0, {
      duration: 0.4,
      ease: "easeOut"
    });
  };

  // Size rules
  const sizeClasses = {
    lg: `h-10 px-5 gap-2.5 ${rounded ? "rounded-full" : "rounded-[12px]"}`,
    md: `h-8 px-4 gap-2 ${rounded ? "rounded-full" : "rounded-[10px]"}`,
    sm: `h-7 px-3 gap-1.5 ${rounded ? "rounded-full" : "rounded-[8px]"}`,
  }[size];

  // Border widths by size
  const borderWidths = {
    lg: "border-[0.8px]",
    md: "border-[0.5px]",
    sm: "border-[0.5px]",
  }[size];

  // Typography
  const textClasses = {
    lg: "text-sm font-medium leading-[normal] tracking-[0.4px]",
    md: "text-[13px] font-medium leading-[normal] tracking-[0.3px]",
    sm: "text-[11px] font-medium leading-[normal] tracking-[0.2px]",
  }[size];

  // Icon
  const iconSizes = {
    lg: "w-4 h-4",
    md: "w-[14px] h-[14px]",
    sm: "w-[12px] h-[12px]",
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
    transition-all duration-150 ease-in-out relative overflow-hidden
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
    <motion.button
      ref={buttonRef}
      type={type}
      disabled={disabled}
      className={baseClasses}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      whileTap={{ scale: 0.98 }}
    >
      {/* Click Shader Layer */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0 mix-blend-overlay"
        style={{
          background: metalGradient,
          opacity: metalOpacity
        }}
      />

      {/* Specular Highlight Layer */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0 mix-blend-screen"
        style={{
          background: highlightGradient,
          opacity: highlightOpacity
        }}
      />

      {/* Leading Icon */}
      {leadingIcon && (
        <motion.div
          className={`${iconSizes} ${textColor} flex items-center justify-center relative z-10`}
          animate={{ rotate: isHovered ? 5 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {leadingIcon}
        </motion.div>
      )}

      {/* Text Container with AnimatePresence */}
      <div className="relative flex items-center justify-center h-full z-10">
        <AnimatePresence mode="wait" initial={false}>
          {(isHovered && labelOnHover) ? (
            <motion.span
              key="hover"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`font-[Geist] not-italic ${textClasses} ${textColor} whitespace-nowrap`}
            >
              {labelOnHover}
            </motion.span>
          ) : (
            <motion.span
              key="default"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`font-[Geist] not-italic ${textClasses} ${textColor} whitespace-nowrap`}
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Trailing Icon */}
      {trailingIcon && (
        <motion.div
          className={`${iconSizes} ${textColor} flex items-center justify-center relative z-10`}
          animate={{ x: isHovered ? 2 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {trailingIcon}
        </motion.div>
      )}
    </motion.button>
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