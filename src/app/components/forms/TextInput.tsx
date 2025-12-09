// src/components/forms/TextInput.tsx
import React, { ComponentProps, forwardRef } from "react";
import { useInput } from "../../hooks/useInput";
import { InputIcon } from "./InputIcon";
import { BaseInputProps } from "./types";
import {
  getInputClasses,
  getPlaceholderClasses,
  getHelperTextClasses,
  getBorderColor,
  getBackgroundColor,
  getOuterBorderStyle,
} from "../../utils/input-utils";
import { InfoIcon } from "../icons";
import Tooltip from "../TooltipComponent";

interface TextInputProps extends BaseInputProps, Omit<ComponentProps<"input">, "width"> {
  // Update info prop to support both string and object with title/subtitle
  info?: string | {
    title: string;
    subtitle?: string;
  };
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
      onChange,
      id,
      info, // Can be string or object with title/subtitle
      ...inputProps
    },
    ref
  ) {
    const {
      state,
      inputId,
      handleFocus,
      handleBlur,
      handleMouseEnter,
      handleMouseLeave,
      handleChange,
    } = useInput({
      error,
      disabled,
      onFocus,
      onBlur,
      onChange,
      id,
    });

    // Determine container styling
    const containerClasses = `flex flex-col items-start gap-1.5 ${className}`;
    const containerStyle = typeof width === "number" ? { width: `${width}px` } : {};
    const widthClass = width === "full" ? "w-full" : "";

    // FIXED: Always make the inner container stretch or inherit width
    const innerWidthClass = "w-full"; // Always take full width of parent

    // Base container styles
    const baseContainerClasses = `flex p-2 items-center gap-2.5 rounded-[10px] border-[0.5px] border-solid relative`;

    // Get styles based on state
    const borderColor = getBorderColor(state);
    const backgroundColor = getBackgroundColor(state);
    const inputClass = getInputClasses(state);
    const placeholderClass = getPlaceholderClasses(state);
    const helperTextClass = getHelperTextClasses(state);
    const outerBorderStyle = getOuterBorderStyle(state);

    // Parse info prop for Tooltip
    const tooltipTitle = typeof info === 'string' ? info : info?.title || "";
    const tooltipSubtitle = typeof info === 'object' ? info.subtitle : undefined;

    return (
      <div
        className={`${containerClasses} ${widthClass}`}
        style={containerStyle}
      >
        {/* Label */}
        {label && (
          <div className="flex items-center gap-1.5">
            <label
              htmlFor={inputId}
              className={`text-[#F8FCFF] font-[Geist] text-sm not-italic font-normal leading-[normal] tracking-[0.112px] ${
                state.disabled ? "opacity-50" : ""
              }`}
            >
              {label}
            </label>
            {/* Conditionally render InfoIcon with Tooltip */}
            {info && (
              <Tooltip 
                title={tooltipTitle} 
                subtitle={tooltipSubtitle}
                position="top"
              >
                <InfoIcon className="flex w-4 h-4 justify-center items-center aspect-square opacity-60 text-[#EDEEEE]/60" />
              </Tooltip>
            )}
          </div>
        )}

        {/* Input Container with outer border effect */}
        <div className={`relative ${innerWidthClass}`}>
          {/* Outer border effect */}
          {outerBorderStyle && (
            <div
              className="absolute pointer-events-none"
              style={{
                top: "-2px",
                left: "-2px",
                right: "-2px",
                bottom: "-2px",
                borderRadius: "12px",
                ...outerBorderStyle,
              }}
            />
          )}

          {/* Input Container - Now this will take the full width of its parent */}
          <div
            className={`${baseContainerClasses} ${borderColor} ${backgroundColor} transition-all duration-200 ${
              state.disabled ? "cursor-not-allowed opacity-70" : "cursor-text"
            }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Leading Icon */}
            {leadingIcon && (
              <InputIcon
                icon={leadingIcon}
                position="leading"
                iconSize={iconSize}
                state={state}
              />
            )}

            {/* Input Field */}
            <input
              id={inputId}
              ref={ref}
              type="text"
              placeholder={placeholder}
              disabled={state.disabled}
              className={`flex-1 bg-transparent outline-none ${inputClass} ${placeholderClass} ${
                state.disabled ? "cursor-not-allowed" : ""
              }`}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
              {...inputProps}
            />

            {/* Trailing Icon */}
            {trailingIcon && (
              <InputIcon
                icon={trailingIcon}
                position="trailing"
                iconSize={iconSize}
                state={state}
              />
            )}
          </div>
        </div>

        {/* Helper Text */}
        {helperText && (
          <span className={helperTextClass}>
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

export default TextInput;