"use client";
import { useState, useRef, useEffect } from "react";
import TextInput from "@/app/components/forms/TextInput";
import { SmallArrowDown, PlusCircleFilled, CheckBoxCircleFilledIcon } from "@/app/components/icons";

type InlineDropdownProps = {
    options: string[];
    value?: string;
    placeholder?: string;
    onChange: (val: string) => void;
    disabled?: boolean;
};

export default function InlineDropdown({
    options,
    value,
    placeholder = "Select",
    onChange,
    disabled = false,
}: InlineDropdownProps) {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
                setSearchQuery("");
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    // Focus input when dropdown opens
    useEffect(() => {
        if (open && inputRef.current) {
            // Small timeout to ensure dropdown is rendered
            setTimeout(() => {
                inputRef.current?.focus();
            }, 10);
        }
    }, [open]);

    const handleOptionClick = (option: string) => {
        onChange(option);
        setOpen(false);
        setSearchQuery("");
    };

    const handleAddNewCategory = () => {
        if (searchQuery.trim()) {
            onChange(searchQuery.trim());
            setOpen(false);
            setSearchQuery("");
        }
    };

    // Sort options alphabetically (case-insensitive)
    const sortedOptions = [...options].sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: 'base' })
    );

    // Case-insensitive filtering on sorted options
    const filteredOptions = sortedOptions.filter(option =>
        option.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Case-insensitive check for existing option
    const normalizedOptions = options.map(opt => opt.toLowerCase());
    const showAddNewOption = searchQuery.trim() &&
        !normalizedOptions.includes(searchQuery.trim().toLowerCase());

    // Function to highlight matching text in options
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
                <span className="font-bold">{match}</span>
                {afterMatch}
            </>
        );
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <div className="flex w-40 h-[18px] items-center">
                {value ? (
                    <div
                        className={`group/dropdown flex py-[2px] pl-[8px] pr-[8px] group-hover:pr-[6px] items-center rounded-md border-[0.5px] border-solid border-[#F8FCFF]/24 bg-[#F8FCFF]/02 hover:border-[#F8FCFF] hover:bg-[#F8FCFF]/16 hover:cursor-pointer gap-[2px] hover:gap-[6px] transition-all duration-150 ease-in-out ${open ? "bg-[#F8FCFF]/16" : ""} ${disabled ? "opacity-50 cursor-not-allowed hover:border-[#F8FCFF]/24 hover:bg-[#F8FCFF]/02" : ""}`}
                        onClick={() => !disabled && setOpen(!open)}
                    >
                        <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-light leading-[normal] tracking-[0.7px] group-hover/dropdown:text-[#FFFFFF] truncate max-w-[120px]">
                            {value}
                        </span>
                        {!disabled && (
                            <>
                                <SmallArrowDown className="h-[16px] w-[16px] opacity-80 hidden group-hover:block group-hover/dropdown:text-[#FFFFFF]" />
                                {open && <SmallArrowDown className="h-[16px] w-[16px] opacity-80 block group-hover:hidden group-hover/dropdown:text-[#FFFFFF] rotate-180" />}
                            </>
                        )}
                    </div>
                ) : (
                    <div
                        className={`group/dropdown flex py-[2px] px-[8px] items-center rounded-md border-[0.5px] gap-[4px] border-dashed hover:border-solid border-[#F8FCFF]/24 bg-[#F8FCFF]/02 group-hover:border-[#F8FCFF] group-hover:bg-[#F8FCFF]/16 transition-all duration-150 ease-in-out hover:border-[#26C9C9]/64 hover:bg-[#26C9C9]/12 ${disabled ? "opacity-50 cursor-not-allowed hover:border-[#F8FCFF]/24 hover:bg-[#F8FCFF]/02" : "hover:cursor-pointer"}`}
                        onClick={() => !disabled && setOpen(!open)}
                    >
                        <PlusCircleFilled className={`h-[16px] w-[16px] opacity-50 ${disabled ? "" : "group-hover/dropdown:opacity-80 group-hover/dropdown:text-[#26C9C9]"}`} />
                        <span className={`text-[#F8FCFF] font-[Geist] text-sm not-italic font-light leading-[normal] tracking-[0.7px] transition-all duration-150 ease-in-out ${disabled ? "" : "group-hover/dropdown:font-medium group-hover/dropdown:text-[#26C9C9]"}`}>
                            {placeholder}
                        </span>
                    </div>
                )}
            </div>

            {/* Dropdown Menu with TextInput Search */}
            {open && (
                <div
                    className="absolute top-full left-0 mt-1 rounded-[14px] bg-[#0E1011] border-[1px] border-solid border-[#F8FCFF]/16 max-h-80 overflow-y-auto z-10"
                    style={{ width: '228px', minWidth: '228px' }}
                >
                    {/* Search Input using TextInput component */}
                    <div className="p-2 border-b border-[#F8FCFF]/10">
                        <TextInput
                            ref={inputRef}
                            placeholder="Search or add category"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            width="full"
                            // Custom styling to match dropdown design
                            className="[&>div]:!p-0 [&>div>div]:!border-0 [&>div>div]:!bg-transparent [&>div>div]:!shadow-none [&_input]:!text-sm [&_input]:!text-[#F8FCFF] [&_input]:!placeholder-[#F8FCFF]/50 [&_input]:focus:!ring-0 [&_input]:!px-2 [&_input]:!py-1"
                            // Remove helper text container
                            helperText={undefined}
                            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                if (e.key === 'Enter' && showAddNewOption) {
                                    handleAddNewCategory();
                                }
                            }}
                        />
                    </div>

                    {/* Options List */}
                    <div className="flex flex-col m-1 gap-0.5">
                        {filteredOptions.length > 0 || showAddNewOption ? (
                            <>
                                {filteredOptions.map((option) => (
                                    <div
                                        key={option}
                                        className={`group/option flex flex-row justify-between items-center pt-[8px] pr-[12px] pb-[8px] pl-[16px] flex-col gap-2.5 rounded-[10px] hover:cursor-pointer ${option === value
                                                ? 'bg-[#1C2325]'
                                                : 'hover:bg-[#F8FCFF]/8'
                                            }`}
                                        onClick={() => handleOptionClick(option)}
                                    >
                                        <span className={
                                            option === value
                                                ? 'text-[#A6FCFC] font-medium'
                                                : 'text-[#F8FCFF]'
                                        }>
                                            {highlightMatch(option, searchQuery)}
                                        </span>
                                        {option === value && (
                                            <CheckBoxCircleFilledIcon className="h-4 w-4 text-[#26C9C9]" />
                                        )}
                                    </div>
                                ))}
                                {showAddNewOption && (
                                    <div
                                        className="flex items-center px-3 py-2 text-sm text-[#26C9C9] hover:bg-[#26C9C9]/20 cursor-pointer transition-colors duration-150 border-t border-[#F8FCFF]/10 gap-2"
                                        onClick={handleAddNewCategory}
                                    >
                                        <PlusCircleFilled className="h-4 w-4" />
                                        {`Create classification "${searchQuery.trim()}"`}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="px-3 py-4 text-sm text-[#F8FCFF]/50 text-center">
                                {searchQuery ? "No categories found" : "No categories available"}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}