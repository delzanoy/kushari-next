import React, { ComponentProps, forwardRef, useState, useRef, useEffect, useMemo } from "react";
import { useInput } from "../../hooks/useInput";
import { InputIcon } from "./InputIcon";
import { BaseInputProps } from "./types";
import {
  getHelperTextClasses,
  getBorderColor,
  getBackgroundColor,
  getOuterBorderStyle,
} from "../../utils/input-utils";
import { InfoIcon, SmallArrowDown, PlusCircleFilled, CheckBoxCircleFilledIcon, CheckBoxOutlineIcon, CheckBoxFilledIcon } from "../icons";
import Tooltip from "../TooltipComponent";

interface DropdownOption {
  value: string;
  label: string;
  metadata?: string;
  icon?: React.ReactNode;
}

interface DropdownProps extends BaseInputProps, Omit<ComponentProps<"input">, "width" | "onChange"> {
  options: string[] | DropdownOption[];
  value?: string | string[];
  placeholder?: string;
  onChange: (value: string | string[]) => void;
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
  multiple?: boolean;
  maxHeight?: string;
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
      onSearchChange,
      id,
      info,
      options,
      value,
      allowCreate = false,
      allowSearch = false,
      searchPlaceholder = "Search...",
      createText = "Create",
      emptyText = "No options available",
      multiple = false,
      maxHeight = "320px",
      // ...inputProps
    },
    forwardedRef
  ) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const triggerInputRef = useRef<HTMLInputElement>(null);
    const triggerContainerRef = useRef<HTMLDivElement>(null);

    // Merge forwarded ref with dropdownRef
    useEffect(() => {
      if (forwardedRef) {
        if (typeof forwardedRef === 'function') {
          forwardedRef(dropdownRef.current);
        } else {
          forwardedRef.current = dropdownRef.current;
        }
      }
    }, [forwardedRef]);

    // Helper function to normalize value to array for internal use
    const normalizeValueToArray = (val: string | string[] | undefined): string[] => {
      if (!val) return [];
      if (Array.isArray(val)) return val;
      return [val];
    };

    // Get current selected values as array
    const selectedValues = useMemo(() => normalizeValueToArray(value), [value]);

    // For useInput hook, we need to handle single select case
    const handleSingleChange = (val: string) => {
      if (!multiple) {
        onChange(val);
      }
    };

    const {
      state,
      inputId,
      handleFocus,
      handleBlur,
      handleMouseEnter,
      handleMouseLeave,
    } = useInput({
      error,
      disabled,
      onFocus: (e) => {
        onFocus?.(e);
      },
      onBlur: (e) => {
        onBlur?.(e);
      },
      onChange: handleSingleChange,
      id,
    });

    // Close dropdown when clicking outside
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          setSearchQuery("");

          // Clear focus properly when clicking outside
          setTimeout(() => {
            if (document.activeElement === triggerContainerRef.current) {
              triggerContainerRef.current?.blur();
            }
          }, 0);
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Focus search input when dropdown opens with search
    useEffect(() => {
      if (isOpen && allowSearch && triggerInputRef.current) {
        setTimeout(() => triggerInputRef.current?.focus(), 100);
      }
    }, [isOpen, allowSearch]);

    // Parse options to handle both string array and object array
    const parsedOptions = useMemo(() =>
      options.map(opt =>
        typeof opt === "string" ? { value: opt, label: opt } : opt
      ),
      [options]
    );

    // Sort options alphabetically
    const sortedOptions = useMemo(() =>
      [...parsedOptions].sort((a, b) =>
        a.label.localeCompare(b.label, undefined, { sensitivity: "base" })
      ),
      [parsedOptions]
    );

    // Filter options based on search query
    const filteredOptions = useMemo(() =>
      sortedOptions.filter(option =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        option.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (option.metadata && option.metadata.toLowerCase().includes(searchQuery.toLowerCase()))
      ),
      [sortedOptions, searchQuery]
    );

    // Check if search query doesn't match any existing option
    const normalizedExisting = useMemo(() =>
      parsedOptions.map(opt => opt.value.toLowerCase()),
      [parsedOptions]
    );

    const showCreateOption = allowCreate &&
      searchQuery.trim() &&
      !normalizedExisting.includes(searchQuery.trim().toLowerCase());

    // Get display text for selected values
    const getDisplayText = (): string => {
      if (!multiple) {
        // For single select, value could be string or array
        const selectedValue = Array.isArray(value) ? value[0] : value;
        if (selectedValue) {
          const option = parsedOptions.find(opt => opt.value === selectedValue);
          return option?.label || selectedValue;
        }
        return "";
      }

      // For multi-select, handle differently
      if (selectedValues.length > 0) {
        // Return count of selected items or first item
        if (selectedValues.length === 1) {
          const option = parsedOptions.find(opt => opt.value === selectedValues[0]);
          return option?.label || selectedValues[0];
        }
        return `${selectedValues.length} selected`;
      }

      return "";
    };

    // Handle option selection
    const handleOptionClick = (optionValue: string) => {
      if (multiple) {
        const newSelectedValues = selectedValues.includes(optionValue)
          ? selectedValues.filter(v => v !== optionValue)
          : [...selectedValues, optionValue];

        onChange(newSelectedValues);

        // Don't close dropdown for multi-select unless it's a create operation
        if (!allowCreate || !showCreateOption) {
          setSearchQuery("");
          if (triggerInputRef.current) {
            triggerInputRef.current.focus();
          }
        }
      } else {
        // Single select - just set the value
        onChange(optionValue);
        setIsOpen(false);
        setSearchQuery("");
        setTimeout(() => {
          triggerContainerRef.current?.blur();
        }, 0);
      }
    };

    // Handle create new option
    const handleCreateNew = () => {
      if (searchQuery.trim()) {
        if (multiple) {
          const newSelectedValues = [...selectedValues, searchQuery.trim()];
          onChange(newSelectedValues);
          setSearchQuery("");
          if (triggerInputRef.current) {
            triggerInputRef.current.focus();
          }
        } else {
          // Single select - just set the value
          onChange(searchQuery.trim());
          setIsOpen(false);
          setSearchQuery("");
          setTimeout(() => {
            triggerContainerRef.current?.blur();
          }, 0);
        }
      }
    };

    // Determine container styling
    const containerClasses = `flex flex-col items-start gap-1.5 ${className}`;
    const containerStyle = typeof width === "number" ? { width: `${width}px` } : {};
    const widthClass = width === "full" ? "w-full" : "";
    const innerWidthClass = "w-full";

    const baseContainerClasses = `flex p-2 items-center gap-2.5 rounded-[10px] border-[0.5px] border-solid relative h-[36px]`;

    // Get styles based on state
    const borderColor = getBorderColor(state);
    const backgroundColor = getBackgroundColor(state);
    const helperTextClass = getHelperTextClasses(state);
    const outerBorderStyle = getOuterBorderStyle(state);

    // Parse info prop for Tooltip
    const tooltipTitle = typeof info === "string" ? info : info?.title || "";
    const tooltipSubtitle = typeof info === "object" ? info.subtitle : undefined;

    const displayText = getDisplayText();

    // Handle trigger click - toggle dropdown
    const handleTriggerClick = () => {
      if (disabled) return;

      if (isOpen) {
        setIsOpen(false);
        setSearchQuery("");
        setTimeout(() => {
          triggerContainerRef.current?.blur();
        }, 0);
      } else {
        setIsOpen(true);
        // Clear search query when opening
        setSearchQuery("");
      }
    };

    // Handle arrow icon click separately to prevent trigger click conflict
    const handleArrowClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (disabled) return;

      if (isOpen) {
        setIsOpen(false);
        setSearchQuery("");
        setTimeout(() => {
          triggerContainerRef.current?.blur();
        }, 0);
      } else {
        setIsOpen(true);
        setSearchQuery("");
      }
    };

    // Handle input change in trigger (when allowSearch is true and dropdown is open)
    const handleTriggerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setSearchQuery(newValue);
      onSearchChange?.(newValue);
    };

    // Get the actual placeholder text for the input
    const getInputPlaceholder = (): string => {
      if (isOpen && allowSearch) {
        return searchPlaceholder;
      }
      return placeholder;
    };

    const inputPlaceholder = getInputPlaceholder();

    // Get the trigger display value
    const getTriggerDisplayValue = (): string => {
      if (isOpen && allowSearch) {
        return searchQuery;
      }

      // For single select, show the selected label when closed
      if (!isOpen && !multiple) {
        return displayText || placeholder;
      }

      // For multi-select, when closed, show the selected options' labels
      if (!isOpen && multiple && selectedValues.length > 0) {
        // Get the labels for the selected values
        const selectedLabels = selectedValues.map(val => {
          const option = parsedOptions.find(opt => opt.value === val);
          return option ? option.label : val;
        });
        return selectedLabels.join(', ');
      }

      return placeholder;
    };

    const triggerDisplayValue = getTriggerDisplayValue();

    return (
      <div
        className={`${containerClasses} ${widthClass} ${state.disabled ? "opacity-50" : ""}`}
        style={containerStyle}
        ref={dropdownRef}
      >
        {/* Label */}
        {label && (
          <div className="flex items-center gap-1.5">
            <label
              htmlFor={inputId}
              className={`text-[#F8FCFF] font-[Geist] text-sm not-italic font-normal leading-[normal] tracking-[0.112px]
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

          {/* Trigger Container - EXACT 36px height to match TextInput */}
          <div
            ref={triggerContainerRef}
            className={`${baseContainerClasses} ${borderColor} ${backgroundColor} transition-all duration-200 ${state.disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"
              }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleTriggerClick}
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

            {/* Trigger Content - input or static display, height matches TextInput */}
            <div className="flex-1 h-full overflow-hidden flex items-center">
              {isOpen && allowSearch ? (
                <input
                  ref={triggerInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={handleTriggerInputChange}
                  placeholder={inputPlaceholder}
                  className="w-full bg-transparent border-none outline-none text-[#F8FCFF] font-[Geist] text-sm not-italic font-normal leading-[normal] placeholder-[#F8FCFF]/50 truncate"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && showCreateOption) {
                      handleCreateNew();
                    } else if (e.key === "Escape") {
                      setIsOpen(false);
                      setTimeout(() => {
                        triggerContainerRef.current?.blur();
                      }, 0);
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span 
                  className={`truncate text-sm font-normal ${displayText && !multiple ? "text-[#F8FCFF]" : "text-[#F8FCFF]/50"}`}
                  style={{ 
                    display: '-webkit-box',
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {triggerDisplayValue}
                </span>
              )}
            </div>

            {/* Trailing Icon or Dropdown Arrow */}
            {trailingIcon ? (
              <div onClick={handleArrowClick}>
                <InputIcon
                  icon={trailingIcon}
                  position="trailing"
                  iconSize={iconSize}
                  state={state}
                />
              </div>
            ) : (
              <div
                onClick={handleArrowClick}
                className="flex items-center justify-center"
              >
                <SmallArrowDown
                  className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                    } ${state.disabled ? "opacity-50" : "opacity-80"}`}
                />
              </div>
            )}
          </div>

          {/* Dropdown Menu */}
          {isOpen && !disabled && (
            <div
              className="absolute top-full left-0 mt-1 rounded-[14px] bg-[#0E1011] border-[1px] border-solid border-[#F8FCFF]/16 shadow-lg z-50 overflow-y-auto"
              style={{
                width: "100%",
                minWidth: "100%",
                maxHeight: maxHeight
              }}
            >
              {/* Options List */}
              <div className="flex flex-col m-1 gap-0.5 overflow-y-auto" style={{ maxHeight: `calc(${maxHeight} - 16px)` }}>
                {filteredOptions.length > 0 || showCreateOption ? (
                  <>
                    {filteredOptions.map((option) => {
                      const isSelected = selectedValues.includes(option.value);
                      return (
                        <div
                          key={option.value}
                          className={`group/option flex flex-row justify-between items-center pt-[8px] pr-[12px] pb-[8px] pl-[16px] rounded-[10px] hover:cursor-pointer min-h-[36px] ${isSelected
                            ? "bg-[#1C2325]"
                            : "hover:bg-[#F8FCFF]/8"
                            }`}
                          onClick={() => handleOptionClick(option.value)}
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {/* Icon */}
                            {option.icon && (
                              <div className="flex w-4 h-4 justify-center items-center flex-shrink-0">
                                {option.icon}
                              </div>
                            )}

                            {/* Content */}
                            <div className="flex items-baseline gap-1.5 flex-[1_0_0] w-full">
                              {/* Title/Name */}
                              <span className={`text-[#F8FCFF] font-[Geist] text-sm not-italic font-light leading-[normal] tracking-[0.7px] truncate ${isSelected ? "text-[#A6FCFC] font-medium" : ""}`}>
                                {option.label}
                              </span>

                              {/* Metadata/Email */}
                              {option.metadata && (
                                <span className="text-[#F8FCFF] font-[Geist] text-[10px] not-italic font-thin leading-[normal] uppercase tracking-[1.2px] truncate">
                                  {option.metadata}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Selection indicator */}
                          {multiple ? (
                            <div className="h-4 w-4 min-h-4 min-w-4 inline-flex items-center justify-center ml-2">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleOptionClick(option.value)}
                                className="sr-only"
                              />
                              <div
                                className="h-8 w-8 min-h-8 min-w-8 bg-transparent text-[#EDEEEE] rounded-full inline-flex items-center justify-center cursor-pointer transition-all duration-150 ease-in-out group-hover/option:bg-[#EDEEEE]/16"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOptionClick(option.value);
                                }}
                              >
                                <div className="h-4 w-4">
                                  {isSelected ? <CheckBoxFilledIcon /> : <CheckBoxOutlineIcon />}
                                </div>
                              </div>
                            </div>
                          ) : (
                            isSelected && (
                              <CheckBoxCircleFilledIcon className="h-4 w-4 text-[#26C9C9] flex-shrink-0" />
                            )
                          )}
                        </div>
                      );
                    })}

                    {showCreateOption && (
                      <div
                        className="px-4 py-3 text-sm text-[#26C9C9] hover:bg-[#26C9C9]/20 cursor-pointer transition-colors duration-150 border-t border-[#F8FCFF]/10 flex items-center gap-2 min-h-[36px]"
                        onClick={handleCreateNew}
                      >
                        <PlusCircleFilled className="h-4 w-4" />
                        {createText} &quot;{searchQuery.trim()}&quot;
                      </div>
                    )}
                  </>
                ) : (
                  <div className="px-4 py-4 text-sm text-[#F8FCFF]/50 text-center min-h-[36px] flex items-center justify-center">
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