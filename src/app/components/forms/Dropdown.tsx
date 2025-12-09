// src/components/forms/Dropdown.tsx
import React, { ComponentProps, forwardRef, useState, useRef, useEffect } from "react";
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
import { InfoIcon, SmallArrowDown, PlusCircleFilled, CheckBoxCircleFilledIcon } from "../icons";
import Tooltip from "../TooltipComponent";

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps extends BaseInputProps, Omit<ComponentProps<"input">, "width" | "onChange"> {
  options: string[] | DropdownOption[];
  value?: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onSearchChange?: (query: string) => void;
  allowCreate?: boolean;
  allowSearch?: boolean;
  searchPlaceholder?: string;
  createText?: string;
  emptyText?: string;
  info?: string | {
    title: string;
    subtitle?: string;
  };
}

const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  function Dropdown(
    {
      label,
      placeholder = "Select an option",
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
      info,
      options,
      value,
      allowCreate = false,
      allowSearch = false,
      searchPlaceholder = "Search...",
      createText = "Create",
      emptyText = "No options available",
      ...inputProps
    },
    ref
  ) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

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
      onFocus: (e) => {
        setIsFocused(true);
        onFocus?.(e);
      },
      onBlur: (e) => {
        setIsFocused(false);
        onBlur?.(e);
      },
      onChange,
      id,
    });

    // Close dropdown when clicking outside
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          setSearchQuery("");
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Focus search input when dropdown opens with search
    useEffect(() => {
      if (isOpen && allowSearch && searchInputRef.current) {
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }
    }, [isOpen, allowSearch]);

    // Handle option selection
    const handleOptionClick = (optionValue: string) => {
      onChange(optionValue);
      setIsOpen(false);
      setSearchQuery("");
    };

    // Handle create new option
    const handleCreateNew = () => {
      if (searchQuery.trim()) {
        onChange(searchQuery.trim());
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    // Parse options to handle both string array and object array
    const parsedOptions = options.map(opt =>
      typeof opt === "string" ? { value: opt, label: opt } : opt
    );

    // Sort options alphabetically
    const sortedOptions = [...parsedOptions].sort((a, b) =>
      a.label.localeCompare(b.label, undefined, { sensitivity: "base" })
    );

    // Filter options based on search query
    const filteredOptions = sortedOptions.filter(option =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      option.value.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Check if search query doesn't match any existing option
    const normalizedExisting = parsedOptions.map(opt => opt.value.toLowerCase());
    const showCreateOption = allowCreate &&
      searchQuery.trim() &&
      !normalizedExisting.includes(searchQuery.trim().toLowerCase());

    // Get display value for selected option
    const displayValue = parsedOptions.find(opt => opt.value === value)?.label || value || "";

    // Determine container styling
    const containerClasses = `flex flex-col items-start gap-1.5 ${className}`;
    const containerStyle = typeof width === "number" ? { width: `${width}px` } : {};
    const widthClass = width === "full" ? "w-full" : "";
    const innerWidthClass = "w-full";

    // Base container styles
    const baseContainerClasses = `flex p-2 items-center gap-2.5 rounded-[10px] border-[0.5px] border-solid relative`;

    // Get styles based on state
    const borderColor = getBorderColor(state);
    const backgroundColor = getBackgroundColor(state);
    const placeholderClass = getPlaceholderClasses(state);
    const helperTextClass = getHelperTextClasses(state);
    const outerBorderStyle = getOuterBorderStyle(state);

    // Parse info prop for Tooltip
    const tooltipTitle = typeof info === "string" ? info : info?.title || "";
    const tooltipSubtitle = typeof info === "object" ? info.subtitle : undefined;

    // Highlight matching text in options
    const highlightMatch = (text: string, query: string) => {
      if (!query.trim()) return text;

      const lowerText = text.toLowerCase();
      const lowerQuery = query.toLowerCase();
      const startIndex = lowerText.indexOf(lowerQuery);

      if (startIndex === -1) return text;

      const endIndex = startIndex + query.length;
      const beforeMatch = text.substring(0, startIndex);
      const match = text.substring(startIndex, endIndex);
      const afterMatch = text.substring(endIndex);

      return (
        <>
          {beforeMatch}
          <span className="font-bold text-[#A6FCFC]">{match}</span>
          {afterMatch}
        </>
      );
    };

    return (
      <div
        className={`${containerClasses} ${widthClass}`}
        style={containerStyle}
        ref={dropdownRef}
      >
        {/* Label */}
        {label && (
          <div className="flex items-center gap-1.5">
            <label
              htmlFor={inputId}
              className={`text-[#F8FCFF] font-[Geist] text-sm not-italic font-normal leading-[normal] tracking-[0.112px] ${state.disabled ? "opacity-50" : ""
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

          {/* Trigger Container */}
          <div
            className={`${baseContainerClasses} ${borderColor} ${backgroundColor} transition-all duration-200 ${state.disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"
              }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            tabIndex={disabled ? -1 : 0}
            role="button"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
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

            {/* Selected Value or Placeholder */}
            <div className={`flex-1 ${placeholderClass} ${state.disabled ? "cursor-not-allowed" : ""} ${displayValue ? "" : "opacity-50"}`}>
              {displayValue || placeholder}
            </div>

            {/* Trailing Icon or Dropdown Arrow */}
            {trailingIcon ? (
              <InputIcon
                icon={trailingIcon}
                position="trailing"
                iconSize={iconSize}
                state={state}
              />
            ) : (
              <SmallArrowDown
                className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                  } ${state.disabled ? "opacity-50" : "opacity-80"}`}
              />
            )}
          </div>

          {/* Dropdown Menu */}
          {isOpen && !disabled && (
            <div
              className="absolute top-full left-0 mt-1 rounded-[14px] bg-[#0E1011] border-[1px] border-solid border-[#F8FCFF]/16 shadow-lg z-50 max-h-80 overflow-y-auto"
              style={{ width: "100%", minWidth: "100%" }}
            >
              {/* Search Input (if enabled) */}
              {allowSearch && (
                <div className="p-2 border-b border-[#F8FCFF]/10">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-[#0E1011] border border-[#F8FCFF]/20 rounded-md text-[#F8FCFF] placeholder-[#F8FCFF]/50 focus:outline-none focus:border-[#26C9C9] focus:ring-1 focus:ring-[#26C9C9] transition-colors"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && showCreateOption) {
                        handleCreateNew();
                      }
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}

              {/* Options List */}
              <div className="flex flex-col m-1 gap-0.5 max-h-64 overflow-y-auto">
                {filteredOptions.length > 0 || showCreateOption ? (
                  <>
                    {filteredOptions.map((option) => (
                      <div
                        key={option.value}
                        className={`group/option flex flex-row justify-between items-center pt-[8px] pr-[12px] pb-[8px] pl-[16px] rounded-[10px] hover:cursor-pointer ${option.value === value
                            ? "bg-[#1C2325]"
                            : "hover:bg-[#F8FCFF]/8"
                          }`}
                        onClick={() => handleOptionClick(option.value)}
                      >
                        <span className={
                          option.value === value
                            ? "text-[#A6FCFC] font-medium"
                            : "text-[#F8FCFF]"
                        }>
                          {highlightMatch(option.label, searchQuery)}
                        </span>
                        {option.value === value && (
                          <CheckBoxCircleFilledIcon className="h-4 w-4 text-[#26C9C9]" />
                        )}
                      </div>
                    ))}
                    {showCreateOption && (
                      <div
                        className="px-4 py-3 text-sm text-[#26C9C9] hover:bg-[#26C9C9]/20 cursor-pointer transition-colors duration-150 border-t border-[#F8FCFF]/10 flex items-center gap-2"
                        onClick={handleCreateNew}
                      >
                        <PlusCircleFilled className="h-4 w-4" />
                        {createText} "{searchQuery.trim()}"
                      </div>
                    )}
                  </>
                ) : (
                  <div className="px-4 py-4 text-sm text-[#F8FCFF]/50 text-center">
                    {searchQuery ? "No matches found" : emptyText}
                  </div>
                )}
              </div>
            </div>
          )}
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

export default Dropdown;