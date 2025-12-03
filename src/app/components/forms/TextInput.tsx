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

interface TextInputProps extends BaseInputProps, Omit<ComponentProps<"input">, "width"> {}

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
    const innerWidthClass = width === "full" ? "self-stretch" : "";

    // Base container styles
    const baseContainerClasses = `flex p-2 items-center gap-2.5 self-stretch rounded-[10px] border-[0.5px] border-solid relative`;

    // Get styles based on state
    const borderColor = getBorderColor(state);
    const backgroundColor = getBackgroundColor(state);
    const inputClass = getInputClasses(state);
    const placeholderClass = getPlaceholderClasses(state);
    const helperTextClass = getHelperTextClasses(state);
    const outerBorderStyle = getOuterBorderStyle(state);

    return (
      <div
        className={`${containerClasses} ${widthClass}`}
        style={containerStyle}
      >
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={`text-[#F8FCFF] font-[Geist] text-sm not-italic font-normal leading-[normal] tracking-[0.112px] ${
              state.disabled ? "opacity-50" : ""
            }`}
          >
            {label}
          </label>
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
          
          {/* Input Container */}
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
              className={`flex-1 bg-transparent outline-none ${inputClass} ${placeholderClass} placeholder:opacity-50 ${
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