import React, { ComponentProps, forwardRef, useState } from "react";

interface TextInputProps extends Omit<ComponentProps<"input">, "width"> {
  label?: string;
  placeholder?: string;
  helperText?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  width?: number | "full";
  error?: boolean;
  disabled?: boolean;
  iconSize?: "sm" | "md" | "lg";
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput(
    {
      label,
      placeholder,
      helperText,
      leadingIcon,
      trailingIcon,
      width,
      error = false,
      disabled = false,
      iconSize = "md",
      className = "",
      onFocus,
      onBlur,
      ...inputProps
    },
    ref
  ) {
    const [isFocused, setIsFocused] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    // Determine container styling
    const containerClasses = `flex flex-col items-start gap-1.5 ${className}`;
    const containerStyle = typeof width === "number" ? { width: `${width}px` } : {};
    const widthClass = width === "full" ? "w-full" : "";

    // Icon size mapping
    const iconSizeClass = {
      sm: "w-3 h-3",
      md: "w-4 h-4",
      lg: "w-5 h-5",
    }[iconSize];

    // Get icon color based on state and position
    const getIconColor = (position: "leading" | "trailing") => {
      if (error) return "text-[#EF4444]";
      if (disabled) return "text-[#52525B]";
      
      // For trailing icon: change to #F8FCFF with 50% opacity on hover
      if (position === "trailing" && isHovered && !disabled) {
        return "text-[#F8FCFF]/50";
      }
      
      // Default color for both icons
      return "text-[#52525B]";
    };

    // Base styles
    const baseContainerClasses = `flex pt-[8px] pr-[12px] pb-[8px] pl-[8px] items-center gap-2.5 self-stretch rounded-[10px] border-[0.5px] border-solid bg-[#F8FCFF]/6 relative`;

    // State-dependent border colors
    const getBorderColor = () => {
      if (error) return "border-[#EF4444]";
      if (isFocused) return "border-[#26C9C9]/70";
      if (isHovered && !disabled) return "border-[#F8FCFF]/48";
      return "border-[#F8FCFF]/24";
    };

    const getBackgroundColor = () => {
      if (disabled) return "bg-[#F8FCFF]/3";
      return "bg-[#F8FCFF]/6";
    };

    const getPlaceholderColor = () => {
      if (error) return "placeholder:text-[#EF4444]/70";
      if (disabled) return "placeholder:text-[#A3A7A8]/50";
      return "placeholder:text-[#F8FCFF]/50";
    };

    const getTextColor = () => {
      if (error) return "text-[#EF4444]";
      if (disabled) return "text-[#A3A7A8]";
      return "text-[#F8FCFF]";
    };

    // Get outer border style (the 2px border outside)
    // const getOuterBorderStyle = () => {
    //   if (isFocused && !error && !disabled) {
    //     return {
    //       boxShadow: "0 0 0 2px rgba(38, 201, 201, 0.12)",
    //     };
    //   }
    //   return {};
    // };

    // Simple Icon Container
    const IconContainer = ({
      icon,
      position
    }: {
      icon: React.ReactNode;
      position: "leading" | "trailing"
    }) => {
      const iconColor = getIconColor(position);
      
      return (
        <div className="flex items-center justify-center" aria-hidden="true">
          {/* Apply icon size class to all icons */}
          <div className={`${iconSizeClass} ${iconColor}`}>
            {icon}
          </div>
        </div>
      );
    };

    return (
      <div
        className={`${containerClasses} ${widthClass}`}
        style={containerStyle}
      >
        {/* Label */}
        {label && (
          <label
            className={`text-[#F8FCFF] font-[Geist] text-sm not-italic font-normal leading-[normal] tracking-[0.112px] ${disabled ? "opacity-50" : ""
              }`}
          >
            {label}
          </label>
        )}

        {/* Input Container with outer border effect */}
        <div className="relative">
          {/* Outer border effect - positioned absolutely */}
          {isFocused && !error && !disabled && (
            <div 
              className="absolute -inset-[2px] rounded-[12px] pointer-events-none"
              style={{
                border: "2px solid rgba(38, 201, 201, 0.12)",
              }}
            />
          )}
          
          {/* Input Container */}
          <div
            className={`${baseContainerClasses} ${getBorderColor()} ${getBackgroundColor()} transition-all duration-200 ${disabled ? "cursor-not-allowed opacity-70" : "cursor-text"
              }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Leading Icon */}
            {leadingIcon && <IconContainer icon={leadingIcon} position="leading" />}

            {/* Input Field */}
            <input
              ref={ref}
              type="text"
              placeholder={placeholder}
              disabled={disabled}
              className={`flex-1 bg-transparent outline-none font-[Geist] text-sm not-italic font-normal leading-[normal] tracking-[0.7px] ${getTextColor()} ${getPlaceholderColor()} ${disabled ? "cursor-not-allowed" : ""
                }`}
              onFocus={handleFocus}
              onBlur={handleBlur}
              {...inputProps}
            />

            {/* Trailing Icon */}
            {trailingIcon && <IconContainer icon={trailingIcon} position="trailing" />}
          </div>
        </div>

        {/* Helper Text */}
        {helperText && (
          <span
            className={`font-[Geist] text-[10px] not-italic font-normal leading-[normal] tracking-[0.08px] ${error
                ? "text-[#EF4444]"
                : disabled
                  ? "text-[#A3A7A8]/70"
                  : "text-[#F8FCFF]/70"
              }`}
          >
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

export default TextInput;