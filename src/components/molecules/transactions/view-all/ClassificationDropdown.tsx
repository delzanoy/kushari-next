"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { TextInput } from "@/components/atoms/TextInput";
import { Button } from "@/components/atoms/Button";
import {
    RiArrowDownSLine,
    RiAddCircleFill,
    RiCheckboxCircleFill,
} from "@remixicon/react";

type ClassificationDropdownProps = {
    options: string[];
    value?: string;
    onChange: (val: string) => void;
    disabled?: boolean;
};

export function ClassificationDropdown({
    options,
    value,
    onChange,
    disabled = false,
}: ClassificationDropdownProps) {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const primaryButtonRef = useRef<HTMLButtonElement>(null);

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
            const timer = setTimeout(() => {
                inputRef.current?.focus();
            }, 10);
            return () => clearTimeout(timer);
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
        a.localeCompare(b, undefined, { sensitivity: "base" })
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
                <span className="font-bold text-[var(--color-text-primary)]">{match}</span>
                {afterMatch}
            </>
        );
    };

    // Handle keyboard navigation and submission
    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && showAddNewOption) {
            handleAddNewCategory();
            e.preventDefault();
        } else if (e.key === "ArrowDown" && showAddNewOption && primaryButtonRef.current) {
            e.preventDefault();
            primaryButtonRef.current.focus();
        } else if (e.key === "Escape") {
            setOpen(false);
            setSearchQuery("");
        }
    };

    // Handle keyboard navigation on the button
    const handleButtonKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (e.key === "ArrowUp") {
            e.preventDefault();
            inputRef.current?.focus();
        } else if (e.key === "Escape") {
            setOpen(false);
            setSearchQuery("");
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <div className="flex w-40 h-[18px] items-center">
                {value ? (
                    <div
                        className={cn(
                            "group/dropdown flex py-[2px] pl-[8px] pr-[8px] items-center rounded-md border-[0.5px] border-solid border-[var(--color-border-subtle)] bg-[color-mix(in_srgb,var(--color-neutral-50)_2%,transparent)] transition-all duration-150 ease-in-out gap-[2px] select-none",
                            "group-hover/tx:pr-[6px] hover:border-[var(--color-neutral-50)] hover:bg-[color-mix(in_srgb,var(--color-neutral-50)_16%,transparent)] hover:cursor-pointer hover:gap-[6px]",
                            open && "bg-[color-mix(in_srgb,var(--color-neutral-50)_16%,transparent)]",
                            disabled && "opacity-50 cursor-not-allowed pointer-events-none hover:border-[var(--color-border-subtle)] hover:bg-[color-mix(in_srgb,var(--color-neutral-50)_2%,transparent)]"
                        )}
                        onClick={() => !disabled && setOpen(!open)}
                    >
                        <span className="text-[var(--color-text-secondary)] font-light text-sm tracking-[0.7px] group-hover/dropdown:text-[var(--color-text-primary)] truncate max-w-[120px]">
                            {value}
                        </span>
                        {!disabled && (
                            <>
                                <RiArrowDownSLine className={cn("h-[16px] w-[16px] opacity-80 hidden group-hover/tx:block group-hover/dropdown:text-[var(--color-text-primary)] shrink-0 transition-transform duration-150", open && "rotate-180")} />
                                {open && <RiArrowDownSLine className="h-[16px] w-[16px] opacity-80 block group-hover/tx:hidden group-hover/dropdown:text-[var(--color-text-primary)] shrink-0 rotate-180" />}
                            </>
                        )}
                    </div>
                ) : (
                    <div
                        className={cn(
                            "group/dropdown flex py-[2px] px-[8px] items-center rounded-md border-[0.5px] gap-[4px] border-dashed transition-all duration-150 ease-in-out select-none",
                            "border-[var(--color-border-subtle)] bg-[color-mix(in_srgb,var(--color-neutral-50)_2%,transparent)]",
                            "group-hover/tx:border-[var(--color-neutral-50)] group-hover/tx:bg-[color-mix(in_srgb,var(--color-neutral-50)_16%,transparent)]",
                            "hover:border-[var(--color-border-brand)]/64 hover:bg-[color-mix(in_srgb,var(--color-border-brand)_12%,transparent)] hover:cursor-pointer",
                            disabled && "opacity-50 cursor-not-allowed hover:border-[var(--color-border-subtle)] hover:bg-[color-mix(in_srgb,var(--color-neutral-50)_2%,transparent)]"
                        )}
                        onClick={() => !disabled && setOpen(!open)}
                    >
                        <RiAddCircleFill className="h-[16px] w-[16px] opacity-50 group-hover/dropdown:opacity-80 group-hover/dropdown:text-[var(--color-text-brand)] transition-colors duration-150 shrink-0" />
                        <span className="text-[var(--color-text-secondary)] font-light text-sm tracking-[0.7px] transition-all duration-150 ease-in-out group-hover/dropdown:font-medium group-hover/dropdown:text-[var(--color-text-brand)]">
                            Select
                        </span>
                    </div>
                )}
            </div>

            {/* Dropdown Menu with TextInput Search */}
            {open && (
                <div
                    className="absolute top-full left-0 mt-1 rounded-xl bg-[var(--color-surface-sunken)] border border-[var(--color-border-subtle)] max-h-80 overflow-y-auto z-50 flex flex-col shadow-[var(--shadow-lg)]"
                    style={{ width: "228px", minWidth: "228px" }}
                >
                    {/* Search Input using TextInput component */}
                    <div className="p-2 border-b border-[var(--color-border-subtle)]">
                        <TextInput
                            ref={inputRef}
                            placeholder="Search or add classification"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            fullWidth
                            size="sm"
                            className="[&_input]:!text-xs"
                            onKeyDown={handleInputKeyDown}
                        />
                    </div>

                    {/* Options List */}
                    <div className="flex flex-col p-1 gap-0.5">
                        {filteredOptions.length > 0 || showAddNewOption ? (
                            <>
                                {filteredOptions.map((option) => (
                                    <div
                                        key={option}
                                        className={cn(
                                            "group/option flex flex-row justify-between items-center px-3 py-1.5 rounded-lg hover:cursor-pointer transition-colors duration-150",
                                            option === value
                                                ? "bg-[var(--color-surface-elevated)] text-[var(--color-text-brand)]"
                                                : "hover:bg-[color-mix(in_srgb,var(--color-neutral-50)_8%,transparent)] text-[var(--color-text-primary)]"
                                        )}
                                        onClick={() => handleOptionClick(option)}
                                    >
                                        <span className="text-sm truncate select-none">
                                            {highlightMatch(option, searchQuery)}
                                        </span>
                                        {option === value && (
                                            <RiCheckboxCircleFill className="h-4 w-4 text-[var(--color-border-brand)] shrink-0" />
                                        )}
                                    </div>
                                ))}
                                {showAddNewOption && (
                                    <div className="p-1 border-t border-[var(--color-border-subtle)] mt-1">
                                        <Button
                                            ref={primaryButtonRef}
                                            variant="brand"
                                            appearance="tonal"
                                            size="sm"
                                            onClick={handleAddNewCategory}
                                            className="w-full"
                                            leadingIcon={<RiAddCircleFill className="h-4 w-4" />}
                                            onKeyDown={handleButtonKeyDown}
                                        >
                                            Create "{searchQuery.trim()}"
                                        </Button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="px-3 py-4 text-xs text-[var(--color-text-muted)] text-center">
                                {searchQuery ? "No categories found" : "No categories available"}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
