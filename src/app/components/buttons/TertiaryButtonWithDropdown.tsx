// "use client";

// import { ReactNode, useState, useRef, useEffect } from "react";
// import Tooltip from "../TooltipComponent";
// import { SmallArrowDown, CheckBoxCircleFilledIcon } from "@/app/components/icons";

// type TertiaryButtonWithDropdownProps = {
//     label: string;
//     labelOnHover?: string;
//     size?: 'sm' | 'md' | 'lg';
//     status?: "brand" | "neutral" | "danger" | "neutral-brand" | "neutral-danger";
//     leadingIcon?: ReactNode;
//     trailingIcon?: ReactNode;
//     tooltipTitle?: string;
//     tooltipSubtitle?: string;
//     tooltipPosition?: "top" | "bottom" | "left" | "right";
//     disabled?: boolean;
//     className?: string;
    
//     // Dropdown specific props
//     dropdownOptions: any[];
//     dropdownValue?: any;
//     dropdownPlaceholder?: string;
//     onDropdownChange: (val: string) => void;
//     dropdownDisabled?: boolean;
// };

// export default function TertiaryButtonWithDropdown({
//     label,
//     labelOnHover,
//     size = 'md',
//     status = "brand",
//     leadingIcon,
//     trailingIcon,
//     tooltipTitle,
//     tooltipSubtitle,
//     tooltipPosition = "top",
//     disabled = false,
//     className = "",
    
//     // Dropdown props
//     dropdownOptions,
//     dropdownValue,
//     dropdownPlaceholder = "Select",
//     onDropdownChange,
//     dropdownDisabled = false,
// }: TertiaryButtonWithDropdownProps) {
//     const [dropdownOpen, setDropdownOpen] = useState(false);
//     const dropdownRef = useRef<HTMLDivElement>(null);

//     // Close dropdown when clicking outside
//     useEffect(() => {
//         function handleClickOutside(event: MouseEvent) {
//             if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//                 setDropdownOpen(false);
//             }
//         }

//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, [dropdownOpen]);

//     const handleOptionClick = (option: string) => {
//         onDropdownChange(option);
//         setDropdownOpen(false);
//     };

//     // Sort options alphabetically (case-insensitive)
//     const sortedOptions = [...dropdownOptions].sort((a, b) => 
//         a.localeCompare(b, undefined, { sensitivity: 'base' })
//     );

//     // Tertiary Button Styles
//     const containerSizes = {
//         sm: "h-6 py-[3px] px-[4px] gap-1.5",
//         md: "h-8 py-[4px] px-[6px] gap-2",  
//         lg: "h-10 py-[5px] px-[8px] gap-2.5",
//     }[size];

//     const iconSizes = {
//         sm: "h-4 w-4",
//         md: "h-5 w-5",
//         lg: "h-6 w-6",
//     }[size];

//     const textSizes = {
//         sm: "text-[12px] font-medium",
//         md: "text-[14px] font-medium",
//         lg: "text-[18px] font-medium",
//     }[size];
    
//     // Fixed border classes - removed hover border width changes
//     const labelBorder = {
//         sm: "border-b-[1px]",
//         md: "border-b-[1px]", 
//         lg: "border-b-[1px]",
//     }[size];

//     const statusClasses = {
//         "brand": "bg-transparent text-[#26C9C9] border-[#26C9C9]/60 group-hover/tertiary-button:border-[#26C9C9] focus:bg-[#26C9C9]/8 focus:ring-[1px] focus:ring-[#EDEEEE] focus:ring-offset-[2px] focus:ring-offset-black",
//         "neutral": "bg-transparent text-[#EDEEEE] border-[#EDEEEE]/60 group-hover/tertiary-button:border-[#EDEEEE] focus:bg-[#EDEEEE]/8 focus:ring-[1px] focus:ring-[#EDEEEE] focus:ring-offset-[2px] focus:ring-offset-black",
//         "danger": "bg-transparent text-[#EF4444] border-[#EF4444]/60 group-hover/tertiary-button:border-[#EF4444] focus:bg-[#EF4444]/8 focus:ring-[1px] focus:ring-[#EF4444] focus:ring-offset-[2px] focus:ring-offset-black",
//         "neutral-brand": "bg-transparent text-[#EDEEEE] border-[#EDEEEE]/60 group-hover/tertiary-button:border-[#EDEEEE] hover:text-[#26C9C9] focus:bg-[#26C9C9]/8 focus:ring-[1px] focus:ring-[#EDEEEE] focus:ring-offset-[2px] focus:ring-offset-black",
//         "neutral-danger": "bg-transparent text-[#EDEEEE] border-[#EDEEEE]/60 group-hover/tertiary-button:border-[#EDEEEE] border-[#26C9C9]/60 hover:text-[#EF4444] focus:bg-[#EF4444]/8 focus:ring-[1px] focus:ring-[#EF4444] focus:ring-offset-[2px] focus:ring-offset-black",
//     }[status];

//     const button = (
//         <div className="relative" ref={dropdownRef}>
//             <div 
//                 className={`group/tertiary-button inline-flex rounded-full items-center hover:cursor-pointer ${containerSizes} ${className} ${statusClasses} ${(disabled || dropdownDisabled) ? 'opacity-50 cursor-not-allowed' : ''}`}
//                 onClick={() => !disabled && !dropdownDisabled && setDropdownOpen(!dropdownOpen)}
//             >
//                 {/* Leading Icon */}
//                 {leadingIcon && (
//                     <div className={`opacity-70 group-hover/tertiary-button:opacity-100 ${iconSizes} z-20`}>
//                         {leadingIcon}
//                     </div>
//                 )}

//                 {/* Text with stable border effect */}
//                 <div className={`${labelBorder} flex px-[0] justify-center items-center gap-2.5 transition-colors duration-150 ease-in-out z-20`}>
//                     <span
//                         className={`truncate font-[Geist] not-italic leading-[normal] tracking-[0.48px] transition-all duration-150 ${textSizes} ${labelOnHover ? "group-hover/tertiary-button:opacity-0" : ""
//                             }`}
//                     >
//                         {label}
//                     </span>
//                     {labelOnHover && (
//                         <span
//                             className={`absolute truncate opacity-0 group-hover/tertiary-button:opacity-100 transition-all duration-150 font-[Geist] not-italic leading-[normal] tracking-[0.48px] ${textSizes}`}
//                         >
//                             {labelOnHover}
//                         </span>
//                     )}
//                 </div>

//                 {/* Dropdown Indicator */}
//                 <div className={`opacity-70 group-hover/tertiary-button:opacity-100 ${iconSizes} transition-transform ${dropdownOpen ? 'rotate-180' : ''} z-20`}>
//                     <SmallArrowDown />
//                 </div>

//                 {/* Trailing Icon */}
//                 {trailingIcon && (
//                     <div className={`opacity-70 group-hover/tertiary-button:opacity-100 ${iconSizes} z-20`}>
//                         {trailingIcon}
//                     </div>
//                 )}
//             </div>

//             {/* Dropdown Menu */}
//             {dropdownOpen && (
//                 <div className="absolute top-full left-0 mt-1 rounded-[14px] bg-[#0E1011] border-[1px] border-solid border-[#F8FCFF]/16 max-h-80 overflow-y-auto z-10 shadow-[0_0_100px_64px_#0E1011]"
//                     style={{ width: '228px', minWidth: '228px' }}>
                    
//                     {/* Options List */}
//                     <div className="flex flex-col m-1 gap-0.5">
//                         {sortedOptions.length > 0 ? (
//                             sortedOptions.map((option) => (
//                                 <div
//                                     key={option}
//                                     className={`group/option flex flex-row justify-between items-center pt-[8px] pr-[12px] pb-[8px] pl-[16px] flex-col gap-2.5 rounded-[10px] hover:cursor-pointer ${
//                                         option === dropdownValue 
//                                             ? 'bg-[#1C2325]' 
//                                             : 'hover:bg-[#F8FCFF]/8'
//                                     }`}
//                                     onClick={() => handleOptionClick(option)}
//                                 >
//                                     <span className={
//                                         option === dropdownValue 
//                                             ? 'text-[#A6FCFC] font-medium' 
//                                             : 'text-[#F8FCFF]'
//                                     }>
//                                         {option}
//                                     </span>
//                                     {option === dropdownValue && (
//                                         <CheckBoxCircleFilledIcon className="h-4 w-4 text-[#26C9C9]" />
//                                     )}
//                                 </div>
//                             ))
//                         ) : (
//                             <div className="px-3 py-4 text-sm text-[#F8FCFF]/50 text-center">
//                                 No categories available
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );

//     // Wrap with tooltip only if tooltipTitle is passed
//     if (tooltipTitle) {
//         return (
//             <Tooltip
//                 title={tooltipTitle}
//                 subtitle={tooltipSubtitle}
//                 position={tooltipPosition}
//             >
//                 {button}
//             </Tooltip>
//         );
//     }

//     return button;
// }

"use client";

import { ReactNode, useState, useRef, useEffect, useMemo } from "react";
import Tooltip from "../TooltipComponent";
import { SmallArrowDown, CheckBoxCircleFilledIcon } from "@/app/components/icons";

type DropdownOption = string | {
  value: string;
  label?: ReactNode;
  groupKey?: string;
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
                    groupKey: 'ungrouped'
                };
            }
            return {
                value: option.value,
                label: option.label || option.value,
                groupKey: option.groupKey || 'ungrouped'
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

    // Tertiary Button Styles
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
    
    // Fixed border classes
    const labelBorder = {
        sm: "border-b-[1px]",
        md: "border-b-[1px]", 
        lg: "border-b-[1px]",
    }[size];

    const statusClasses = {
        "brand": "bg-transparent text-[#26C9C9] border-[#26C9C9]/60 group-hover/tertiary-button:border-[#26C9C9] focus:bg-[#26C9C9]/8 focus:ring-[1px] focus:ring-[#EDEEEE] focus:ring-offset-[2px] focus:ring-offset-black",
        "neutral": "bg-transparent text-[#EDEEEE] border-[#EDEEEE]/60 group-hover/tertiary-button:border-[#EDEEEE] focus:bg-[#EDEEEE]/8 focus:ring-[1px] focus:ring-[#EDEEEE] focus:ring-offset-[2px] focus:ring-offset-black",
        "danger": "bg-transparent text-[#EF4444] border-[#EF4444]/60 group-hover/tertiary-button:border-[#EF4444] focus:bg-[#EF4444]/8 focus:ring-[1px] focus:ring-[#EF4444] focus:ring-offset-[2px] focus:ring-offset-black",
        "neutral-brand": "bg-transparent text-[#EDEEEE] border-[#EDEEEE]/60 group-hover/tertiary-button:border-[#EDEEEE] hover:text-[#26C9C9] focus:bg-[#26C9C9]/8 focus:ring-[1px] focus:ring-[#EDEEEE] focus:ring-offset-[2px] focus:ring-offset-black",
        "neutral-danger": "bg-transparent text-[#EDEEEE] border-[#EDEEEE]/60 group-hover/tertiary-button:border-[#EDEEEE] border-[#26C9C9]/60 hover:text-[#EF4444] focus:bg-[#EF4444]/8 focus:ring-[1px] focus:ring-[#EF4444] focus:ring-offset-[2px] focus:ring-offset-black",
    }[status];

    const button = (
        <div className="relative" ref={dropdownRef}>
            <div 
                className={`group/tertiary-button inline-flex rounded-full items-center hover:cursor-pointer ${containerSizes} ${className} ${statusClasses} ${(disabled || dropdownDisabled) ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => !disabled && !dropdownDisabled && setDropdownOpen(!dropdownOpen)}
            >
                {/* Leading Icon */}
                {leadingIcon && (
                    <div className={`opacity-70 group-hover/tertiary-button:opacity-100 ${iconSizes} z-20`}>
                        {leadingIcon}
                    </div>
                )}

                {/* Text with stable border effect */}
                <div className={`${labelBorder} flex px-[0] justify-center items-center gap-2.5 transition-colors duration-150 ease-in-out z-20`}>
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

                {/* Dropdown Indicator */}
                <div className={`opacity-70 group-hover/tertiary-button:opacity-100 ${iconSizes} transition-transform ${dropdownOpen ? 'rotate-180' : ''} z-20`}>
                    <SmallArrowDown />
                </div>

                {/* Trailing Icon */}
                {trailingIcon && (
                    <div className={`opacity-70 group-hover/tertiary-button:opacity-100 ${iconSizes} z-20`}>
                        {trailingIcon}
                    </div>
                )}
            </div>

            {/* Dropdown Menu */}
            {dropdownOpen && (
                <div className="absolute top-full left-0 mt-1 rounded-[14px] bg-[#0E1011] border-[1px] border-solid border-[#F8FCFF]/16 max-h-80 overflow-y-auto z-10 shadow-[0_0_100px_64px_#0E1011] min-w-[228px]">
                    
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
                                    {/* Group Header */}
                                    <div className="sticky top-0 pt-2 pb-2 ml-2 text-[#C9C9C9] font-[Geist Mono] text-[10px] not-italic font-light leading-[normal] tracking-[1.4px] uppercase bg-[#0E1011]">
                                        {group.label}
                                    </div>
                                    
                                    {/* Group Items */}
                                    {group.items.map((option) => (
                                        <div
                                            key={option.value}
                                            className={`group/option flex flex-row justify-between items-center pt-[8px] pr-[12px] pb-[8px] pl-[16px] rounded-[10px] hover:cursor-pointer ${
                                                option.value === dropdownValue 
                                                    ? 'bg-[#1C2325]' 
                                                    : 'hover:bg-[#F8FCFF]/8'
                                            }`}
                                            onClick={() => handleOptionClick(option.value)}
                                        >
                                            <div className="flex justify-between items-center w-full">
                                                <span className={
                                                    option.value === dropdownValue 
                                                        ? 'text-[#A6FCFC] font-medium' 
                                                        : 'text-[#F8FCFF]'
                                                }>
                                                    {option.label}
                                                </span>
                                                {option.value === dropdownValue && (
                                                    <CheckBoxCircleFilledIcon className="h-4 w-4 text-[#26C9C9]" />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))
                        ) : (
                            // Render flat list (original behavior when no groups)
                            normalizedOptions.sort((a, b) => 
                                String(a.label).localeCompare(String(b.label), undefined, { sensitivity: 'base' })
                            ).map((option) => (
                                <div
                                    key={option.value}
                                    className={`group/option flex flex-row justify-between items-center pt-[8px] pr-[12px] pb-[8px] pl-[16px] rounded-[10px] hover:cursor-pointer ${
                                        option.value === dropdownValue 
                                            ? 'bg-[#1C2325]' 
                                            : 'hover:bg-[#F8FCFF]/8'
                                    }`}
                                    onClick={() => handleOptionClick(option.value)}
                                >
                                    <div className="flex justify-between items-center w-full">
                                        <span className={
                                            option.value === dropdownValue 
                                                ? 'text-[#A6FCFC] font-medium' 
                                                : 'text-[#F8FCFF]'
                                        }>
                                            {option.label}
                                        </span>
                                        {option.value === dropdownValue && (
                                            <CheckBoxCircleFilledIcon className="h-4 w-4 text-[#26C9C9]" />
                                        )}
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