// src/app/components/forms/RadioButton.tsx
"use client";
import React, { useState } from "react";
import { RadioButtonProps, InputSize } from "./types";
import { RadioButtonIcon } from "../icons"; // Import the smart icon component

const getRadioSizeClasses = (size: InputSize) => {
  const sizeMap = {
    sm: {
      container: "w-4 h-4",
      label: "text-xs",
      description: "text-[10px]",
    },
    md: {
      container: "w-5 h-5",
      label: "text-sm",
      description: "text-xs",
    },
    lg: {
      container: "w-6 h-6",
      label: "text-base",
      description: "text-sm",
    },
  };
  return sizeMap[size];
};

export const RadioButton: React.FC<RadioButtonProps> = ({
  value,
  label,
  description,
  name,
  checked,
  disabled = false,
  error = false,
  onChange,
  icon,
  size = "md",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const sizeClasses = getRadioSizeClasses(size);

  const handleChange = () => {
    if (!disabled) {
      onChange(value);
    }
  };

  return (
    <label
      className={`
        cursor-pointer group flex justify-end items-center gap-2
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"}
        transition-opacity duration-200
      `}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hidden native radio for accessibility */}
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className="sr-only"
      />

      {/* Custom Radio Icon */}
      <div className="relative flex items-center justify-center pt-[2px]">
        <RadioButtonIcon
          checked={checked}
          hover={isHovered && !disabled && !checked}
          disabled={disabled}
          className={sizeClasses.container}
        />
      </div>

      {/* Label and Description */}
      <div className="flex flex-col gap-1 flex-1">
        <div className="flex items-center gap-2">
          {icon && (
            <div className="w-4 h-4 flex items-center justify-center">
              {icon}
            </div>
          )}
          <span
            className={`
              text-[#F8FCFF] font-[Geist] text-sm not-italic font-normal leading-[normal] tracking-[0.112px]
              ${sizeClasses.label}
              ${disabled ? "opacity-50" : ""}
            `}
          >
            {label}
          </span>
        </div>
        {description && (
          <span
            className={`
              text-[#F8FCFF]/60 font-[Geist] not-italic font-light leading-[normal] tracking-[0.112px]
              ${sizeClasses.description}
              ${disabled ? "opacity-50" : ""}
            `}
          >
            {description}
          </span>
        )}
      </div>
    </label>
  );
};