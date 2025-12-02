"use client";

import { ReactNode, useState, useRef, useEffect, useMemo } from "react";
import Tooltip from "../TooltipComponent";
import { SmallArrowDown, CheckBoxFilledIcon, CheckBoxOutlineIcon } from "@/app/components/icons";

type DropdownOption = string | {
  value: string;
  label?: ReactNode;
  groupKey?: string;
  leadingIcon?: ReactNode;
  metaData?: string; // Added to match FilterDropdown
};

type DropdownGroup = {
  key: string;
  label: string;
};

type TertiaryButtonWithDropdownProps = {
    label: string;
    labelOnHover?: string;
    size?: 'sm' | 'md' | 'lg';
    status?: "brand" | "neutral" | "danger" | "neutral-brand" | "neutral-danger";
    leadingIcon?: ReactNode;
    trailingIcon?: ReactNode;
    tooltipTitle?: string;
    tooltipSubtitle?: string;
    tooltipPosition?: "top" | "bottom" | "left" | "right";
    disabled?: boolean;
    className?: string;
    onClick?: () => void;
    
    // Dropdown specific props
    dropdownOptions: DropdownOption[];
    dropdownValue?: any;
    dropdownPlaceholder?: string;
    onDropdownChange: (val: string) => void;
    dropdownDisabled?: boolean;
    
    // Grouping props (same as FilterDropdown)
    groups?: DropdownGroup[];
    groupBy?: string;
};

export default function TertiaryButtonWithDropdown({
    label,
    labelOnHover,
    size = 'md',
    status = "brand",
    leadingIcon,
    trailingIcon,
    tooltipTitle,
    tooltipSubtitle,
    tooltipPosition = "top",
    disabled = false,
    className = "",
    onClick,
    
    // Dropdown props
    dropdownOptions,
    dropdownValue,
    dropdownPlaceholder = "Select",
    onDropdownChange,
    dropdownDisabled = false,
    
    // Grouping props
    groups = [],
    groupBy,
}: TertiaryButtonWithDropdownProps) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownOpen]);

    const handleOptionClick = (optionValue: string) => {
        onDropdownChange(optionValue);
        setDropdownOpen(false);
    };

    // Normalize options to ensure consistent structure
    const normalizedOptions = useMemo(() => {
        return dropdownOptions.map(option => {
            if (typeof option === 'string') {
                return {
                    value: option,
                    label: option,
                    groupKey: 'ungrouped',
                    leadingIcon: null,
                    metaData: undefined
                };
            }
            return {
                value: option.value,
                label: option.label || option.value,
                groupKey: option.groupKey || 'ungrouped',
                leadingIcon: option.leadingIcon || null,
                metaData: option.metaData || undefined
            };
        });
    }, [dropdownOptions]);

    // Group options using the same logic as FilterDropdown
    const groupedOptions = useMemo(() => {
        // If no groups defined, return as flat list
        if (!groupBy && groups.length === 0) {
            return null;
        }

        const grouped: { [key: string]: typeof normalizedOptions } = {};

        // Initialize groups from props
        groups.forEach(group => {
            grouped[group.key] = [];
        });

        const defaultGroupKey = 'ungrouped';

        // Group the options
        normalizedOptions.forEach(option => {
            const groupKey = option.groupKey || defaultGroupKey;
            if (grouped[groupKey]) {
                grouped[groupKey].push(option);
            } else {
                // If group doesn't exist, add to ungrouped
                if (!grouped[defaultGroupKey]) {
                    grouped[defaultGroupKey] = [];
                }
                grouped[defaultGroupKey].push(option);
            }
        });

        // Return groups in the specified order, filtered to only include non-empty groups
        return groups
            .map(group => ({
                key: group.key,
                label: group.label,
                items: (grouped[group.key] || []).sort((a, b) => 
                    String(a.label).localeCompare(String(b.label), undefined, { sensitivity: 'base' })
                )
            }))
            .filter(group => group.items.length > 0)
            .concat(
                // Add ungrouped items at the end if any exist
                grouped[defaultGroupKey] && grouped[defaultGroupKey].length > 0
                    ? [{
                        key: defaultGroupKey,
                        label: 'Other',
                        items: grouped[defaultGroupKey].sort((a, b) => 
                            String(a.label).localeCompare(String(b.label), undefined, { sensitivity: 'base' })
                        )
                    }]
                    : []
            );
    }, [normalizedOptions, groups, groupBy]);

    // Find current selected option display value
    const selectedOption = normalizedOptions.find(opt => opt.value === dropdownValue);
    const displayValue = selectedOption ? selectedOption.label : dropdownPlaceholder;

    // EXACTLY MATCHING TERTIARYBUTTON STYLING
    const containerSizes = {
        sm: "h-6 py-[3px] px-[4px] gap-1.5",
        md: "h-8 py-[4px] px-[6px] gap-2",  
        lg: "h-10 py-[5px] px-[8px] gap-2.5",
    }[size];

    const iconSizes = {
        sm: "h-4 w-4",
        md: "h-5 w-5",
        lg: "h-6 w-6",
    }[size];

    const textSizes = {
        sm: "text-[12px] font-medium",
        md: "text-[14px] font-medium",
        lg: "text-[18px] font-medium",
    }[size];
    
    const labelBorder = {
        sm: "border-b-[1px] group-hover/tertiary-button:border-b-[1.5px]",
        md: "border-b-[1px] group-hover/tertiary-button:border-b-[2px]",
        lg: "border-b-[1px] group-hover/tertiary-button:border-b-[2.5px]",
    }[size];

    const statusClasses = {
        "brand": "bg-transparent text-[#26C9C9] border-[#26C9C9]/60 group-hover/tertiary-button:border-[#26C9C9] focus:bg-[#26C9C9]/8 focus:ring-[1px] focus:ring-[#EDEEEE] focus:ring-offset-[2px] focus:ring-offset-black",
        "neutral": "bg-transparent text-[#EDEEEE] border-[#EDEEEE]/60 group-hover/tertiary-button:border-[#EDEEEE] focus:bg-[#EDEEEE]/8 focus:ring-[1px] focus:ring-[#EDEEEE] focus:ring-offset-[2px] focus:ring-offset-black",
        "danger": "bg-transparent text-[#EF4444] border-[#EF4444]/60 group-hover/tertiary-button:border-[#EF4444] focus:bg-[#EF4444]/8 focus:ring-[1px] focus:ring-[#EF4444] focus:ring-offset-[2px] focus:ring-offset-black",
        "neutral-brand": "bg-transparent text-[#EDEEEE] border-[#EDEEEE]/60 group-hover/tertiary-button:border-[#EDEEEE] hover:text-[#26C9C9] focus:bg-[#26C9C9]/8 focus:ring-[1px] focus:ring-[#EDEEEE] focus:ring-offset-[2px] focus:ring-offset-black",
        "neutral-danger": "bg-transparent text-[#EDEEEE] border-[#EDEEEE]/60 group-hover/tertiary-button:border-[#EDEEEE] hover:text-[#EF4444] focus:bg-[#EF4444]/8 focus:ring-[1px] focus:ring-[#EF4444] focus:ring-offset-[2px] focus:ring-offset-black",
    }[status];

    const handleButtonClick = () => {
        if (!disabled && !dropdownDisabled) {
            setDropdownOpen(!dropdownOpen);
            onClick?.();
        }
    };

    const button = (
        <div className="relative" ref={dropdownRef}>
            <div 
                className={`group/tertiary-button inline-flex rounded-full items-center hover:cursor-pointer ${containerSizes} ${className} ${statusClasses} ${(disabled || dropdownDisabled) ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleButtonClick}
            >
                {/* Leading Icon - EXACTLY matches TertiaryButton */}
                {leadingIcon && (
                    <div className={`opacity-70 group-hover/tertiary-button:opacity-100 ${iconSizes}`}>
                        {leadingIcon}
                    </div>
                )}

                {/* Text with border effect - EXACTLY matches TertiaryButton */}
                <div className={`${labelBorder} flex px-[0] justify-center items-center gap-2.5 transition-all duration-50 ease-in-out`}>
                    <span
                        className={`truncate font-[Geist] not-italic leading-[normal] tracking-[0.48px] transition-all duration-150 ${textSizes} ${labelOnHover ? "group-hover/tertiary-button:opacity-0" : ""
                            }`}
                    >
                        {displayValue}
                    </span>
                    {labelOnHover && (
                        <span
                            className={`absolute truncate opacity-0 group-hover/tertiary-button:opacity-100 transition-all duration-150 font-[Geist] not-italic leading-[normal] tracking-[0.48px] ${textSizes}`}
                        >
                            {labelOnHover}
                        </span>
                    )}
                </div>

                {/* Dropdown Indicator - Uses same styling as trailingIcon */}
                <div className={`opacity-70 group-hover/tertiary-button:opacity-100 ${iconSizes} transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}>
                    <SmallArrowDown />
                </div>

                {/* Trailing Icon - EXACTLY matches TertiaryButton */}
                {trailingIcon && (
                    <div className={`opacity-70 group-hover/tertiary-button:opacity-100 ${iconSizes}`}>
                        {trailingIcon}
                    </div>
                )}
            </div>

            {/* Dropdown Menu - Updated to match FilterDropdown styling */}
            {dropdownOpen && (
                <div 
                    className="absolute top-full left-0 mt-1 rounded-[14px] bg-[#0E1011] border-[1px] border-solid border-[#F8FCFF]/16 max-h-80 overflow-y-auto z-10 shadow-[0_0_100px_64px_#0E1011]"
                    style={{ width: '228px', minWidth: '228px' }}
                >
                    
                    {/* Options List */}
                    <div className="flex flex-col m-1 gap-0.5">
                        {normalizedOptions.length === 0 ? (
                            <div className="pt-2 pb-2 ml-2 text-[#C9C9C9] font-[Geist Mono] text-[10px] not-italic font-light leading-[normal] tracking-[1.4px] uppercase">
                                No options found
                            </div>
                        ) : groupedOptions ? (
                            // Render grouped options (same pattern as FilterDropdown)
                            groupedOptions.map((group) => (
                                <div key={group.key} className="group">
                                    {/* Group Header - EXACTLY matching FilterDropdown style */}
                                    <div className="sticky top-0 pt-2 pb-2 ml-2 text-[#C9C9C9] font-[Geist Mono] text-[10px] not-italic font-light leading-[normal] tracking-[1.4px] uppercase">
                                        {group.label}
                                    </div>
                                    
                                    {/* Group Items - EXACTLY matching FilterDropdown style */}
                                    {group.items.map((option) => (
                                        <div
                                            key={option.value}
                                            className="group/option flex pt-[8px] pr-[8px] pb-[8px] pl-[8px] flex-col items-start gap-2.5 hover:bg-[#F8FCFF]/8 rounded-[10px] hover:cursor-pointer"
                                            onClick={() => handleOptionClick(option.value)}
                                        >
                                            <div className="flex h-[22px] py-[2px] items-center gap-2 w-full">
                                                {/* Leading Icon */}
                                                {option.leadingIcon && (
                                                    <div className="flex w-4 h-4 justify-center">
                                                        {option.leadingIcon}
                                                    </div>
                                                )}
                                                
                                                {/* Text container - Matching FilterDropdown structure */}
                                                <div className="flex items-baseline gap-1.5 flex-[1_0_0] w-full">
                                                    {/* Main label - EXACT FilterDropdown typography */}
                                                    <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-light leading-[normal] tracking-[0.7px]">
                                                        {option.label}
                                                    </span>
                                                    
                                                    {/* Meta data - EXACT FilterDropdown typography */}
                                                    {option.metaData && (
                                                        <span className="text-[#F8FCFF] font-[Geist] text-[10px] not-italic font-thin leading-[normal] uppercase">
                                                            {option.metaData}
                                                        </span>
                                                    )}
                                                </div>
                                                
                                                {/* Checkbox - EXACT FilterDropdown styling */}
                                                {/* <div className="h-4 w-4 min-h-4 min-w-4 inline-flex items-center justify-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={option.value === dropdownValue}
                                                        onChange={() => handleOptionClick(option.value)}
                                                        className="sr-only"
                                                        aria-label={`Select ${option.label}`}
                                                    />
                                                    <div
                                                        className="h-8 w-8 min-h-8 min-w-8 bg-transparent text-[#EDEEEE] rounded-full inline-flex items-center justify-center cursor-pointer transition-all duration-150 ease-in-out group-hover/option:bg-[#EDEEEE]/16"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleOptionClick(option.value);
                                                        }}
                                                    >
                                                        <div className="h-4 w-4">
                                                            {option.value === dropdownValue ? (
                                                                <CheckBoxFilledIcon />
                                                            ) : (
                                                                <CheckBoxOutlineIcon />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div> */}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))
                        ) : (
                            // Render flat list with EXACT FilterDropdown styling
                            normalizedOptions.sort((a, b) => 
                                String(a.label).localeCompare(String(b.label), undefined, { sensitivity: 'base' })
                            ).map((option) => (
                                <div
                                    key={option.value}
                                    className="group/option flex pt-[8px] pr-[8px] pb-[8px] pl-[8px] flex-col items-start gap-2.5 hover:bg-[#F8FCFF]/8 rounded-[10px] hover:cursor-pointer"
                                    onClick={() => handleOptionClick(option.value)}
                                >
                                    <div className="flex h-[22px] py-[2px] items-center gap-2 w-full">
                                        {/* Leading Icon */}
                                        {option.leadingIcon && (
                                            <div className="flex w-4 h-4 justify-center">
                                                {option.leadingIcon}
                                            </div>
                                        )}
                                        
                                        {/* Text container - Matching FilterDropdown structure */}
                                        <div className="flex items-baseline gap-1.5 flex-[1_0_0] w-full">
                                            {/* Main label - EXACT FilterDropdown typography */}
                                            <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-light leading-[normal] tracking-[0.7px]">
                                                {option.label}
                                            </span>
                                            
                                            {/* Meta data - EXACT FilterDropdown typography */}
                                            {option.metaData && (
                                                <span className="text-[#F8FCFF] font-[Geist] text-[10px] not-italic font-thin leading-[normal] uppercase">
                                                    {option.metaData}
                                                </span>
                                            )}
                                        </div>
                                        
                                        {/* Checkbox - EXACT FilterDropdown styling */}
                                        <div className="h-4 w-4 min-h-4 min-w-4 inline-flex items-center justify-center">
                                            <input
                                                type="checkbox"
                                                checked={option.value === dropdownValue}
                                                onChange={() => handleOptionClick(option.value)}
                                                className="sr-only"
                                                aria-label={`Select ${option.label}`}
                                            />
                                            <div
                                                className="h-8 w-8 min-h-8 min-w-8 bg-transparent text-[#EDEEEE] rounded-full inline-flex items-center justify-center cursor-pointer transition-all duration-150 ease-in-out group-hover/option:bg-[#EDEEEE]/16"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleOptionClick(option.value);
                                                }}
                                            >
                                                <div className="h-4 w-4">
                                                    {option.value === dropdownValue ? (
                                                        <CheckBoxFilledIcon />
                                                    ) : (
                                                        <CheckBoxOutlineIcon />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );

    // Wrap with tooltip only if tooltipTitle is passed
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