// src/components/forms/TextArea.tsx
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

interface TextAreaProps extends BaseInputProps, Omit<ComponentProps<"textarea">, "width"> {
    rows?: number;
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
            onChange,
            id,
            ...textareaProps
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
        
        // FIXED: Always make the inner container full width
        const innerWidthClass = "w-full";

        // Base container styles (adjusted for textarea)
        const baseContainerClasses = `flex pt-[8px] pr-[12px] pb-[8px] pl-[8px] items-start gap-2.5 rounded-[10px] border-[0.5px] border-solid min-h-[64px] relative`;

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
                        className={`text-[#F8FCFF] font-[Geist] text-sm not-italic font-normal leading-[normal] tracking-[0.112px] ${disabled ? "opacity-50" : ""
                            }`}
                    >
                        {label}
                    </label>
                )}

                {/* TextArea Container with outer border effect */}
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

                    {/* TextArea Container */}
                    <div
                        className={`${baseContainerClasses} ${borderColor} ${backgroundColor} transition-all duration-200 ${disabled ? "cursor-not-allowed opacity-70" : "cursor-text"
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
                                isTextArea
                            />
                        )}

                        {/* TextArea Field */}
                        <textarea
                            id={inputId}
                            ref={ref}
                            placeholder={placeholder}
                            disabled={disabled}
                            rows={rows}
                            className={`flex-1 bg-transparent outline-none resize-none ${inputClass} ${placeholderClass} py-[6px] ${disabled ? "cursor-not-allowed" : ""
                                }`}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            {...textareaProps}
                        />

                        {/* Trailing Icon */}
                        {trailingIcon && (
                            <InputIcon
                                icon={trailingIcon}
                                position="trailing"
                                iconSize={iconSize}
                                state={state}
                                isTextArea
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

export default TextArea;