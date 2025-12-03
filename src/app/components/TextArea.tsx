import React, { ComponentProps, forwardRef, useState } from "react";

interface TextAreaProps extends Omit<ComponentProps<"textarea">, "width"> {
  label?: string;
  placeholder?: string;
  helperText?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  width?: number | "full";
  error?: boolean;
  disabled?: boolean;
  rows?: number;
  iconSize?: "sm" | "md" | "lg";
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextArea(
    {
      label,
      placeholder,
      helperText,
      leadingIcon,
      trailingIcon,
      width,
      error = false,
      disabled = false,
      rows = 4,
      iconSize = "md",
      className = "",
      onFocus,
      onBlur,
      ...textareaProps
    },
    ref
  ) {
    const [isFocused, setIsFocused] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
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

    // Get icon color based on state
    const getIconColor = () => {
      if (error) return "text-[#EF4444]";
      if (disabled) return "text-[#A3A7A8]";
      return "text-[#F8FCFF]/70";
    };

    // Base styles
    const baseContainerClasses = `flex pt-[8px] pr-[12px] pb-[8px] pl-[8px] items-start gap-2.5 self-stretch rounded-[10px] border-[0.5px] border-solid bg-[#F8FCFF]/6 min-h-[64px]`;

    // State-dependent border colors
    const getBorderColor = () => {
      if (error) return "border-[#EF4444]";
      if (isFocused) return "border-[#3B82F6]";
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

    // Simple Icon Container for TextArea
    const IconContainer = ({ 
      icon, 
      position 
    }: { 
      icon: React.ReactNode; 
      position: "leading" | "trailing" 
    }) => {
      const iconColor = getIconColor();
      
      return (
        <div className="flex items-start justify-center pt-[10px]" aria-hidden="true">
          {/* We'll apply styles directly to the icon if it's an SVG */}
          {React.isValidElement(icon) && icon.type === 'svg' ? (
            <div className={`${iconSizeClass} ${iconColor}`}>
              {icon}
            </div>
          ) : (
            // For other icon types, let them handle their own styling
            <div className={iconColor}>
              {icon}
            </div>
          )}
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
            className={`text-[#F8FCFF] font-[Geist] text-sm not-italic font-normal leading-[normal] tracking-[0.112px] ${
              disabled ? "opacity-50" : ""
            }`}
          >
            {label}
          </label>
        )}

        {/* TextArea Container */}
        <div
          className={`${baseContainerClasses} ${getBorderColor()} ${getBackgroundColor()} transition-all duration-200 ${
            disabled ? "cursor-not-allowed opacity-70" : "cursor-text"
          }`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Leading Icon */}
          {leadingIcon && <IconContainer icon={leadingIcon} position="leading" />}

          {/* TextArea Field */}
          <textarea
            ref={ref}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            className={`flex-1 bg-transparent outline-none font-[Geist] text-sm not-italic font-normal leading-[normal] tracking-[0.7px] resize-none ${getTextColor()} ${getPlaceholderColor()} py-[6px] ${
              disabled ? "cursor-not-allowed" : ""
            }`}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...textareaProps}
          />

          {/* Trailing Icon */}
          {trailingIcon && <IconContainer icon={trailingIcon} position="trailing" />}
        </div>

        {/* Helper Text */}
        {helperText && (
          <span
            className={`font-[Geist] text-[10px] not-italic font-normal leading-[normal] tracking-[0.08px] ${
              error
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

export default TextArea;