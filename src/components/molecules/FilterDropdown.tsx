"use client";

import { useState, useMemo, ReactNode, useRef } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@/components/atoms/Dropdown";
import { RiCloseLine, RiSearchLine } from "@remixicon/react";
import { cn } from "@/lib/utils";

export interface DisplayProps {
  fullName?: string;
  icon?: ReactNode;
  metaData?: string;
  [key: string]: unknown;
}

export interface FilterDropdownOption<T = unknown> {
  value: T;
  display?: ReactNode;
  displayProps: DisplayProps;
  id?: string | number;
  searchText?: string;
  groupKey?: string;
}

export interface FilterDropdownGroup {
  key: string;
  label: string;
}

export interface FilterDropdownProps<T = unknown> {
  options: FilterDropdownOption<T>[];
  selectedValues: T[];
  onSelectionChange: (selected: T[]) => void;
  label: string;
  buttonIcon?: ReactNode;
  showSelected?: boolean;
  compareValues?: (a: T, b: T) => boolean;
  groups?: FilterDropdownGroup[];
}

export function FilterDropdown<T>({
  options,
  selectedValues,
  onSelectionChange,
  label,
  buttonIcon,
  showSelected = true,
  compareValues = (a, b) => a === b,
  groups = [],
}: FilterDropdownProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedCount = selectedValues.length;
  const isActive = selectedCount > 0;

  const toggleFilter = (value: T) => {
    const isSelected = selectedValues.some((selected) => compareValues(selected, value));
    const newSelection = isSelected
      ? selectedValues.filter((selected) => !compareValues(selected, value))
      : [...selectedValues, value];
    onSelectionChange(newSelection);
  };

  const handleClearFilter = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectionChange([]);
  };

  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return options;
    return options.filter((option) => {
      const searchableText = option.searchText || option.displayProps.fullName || "";
      return searchableText.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [options, searchTerm]);

  // Handle selected text display logic
  const selectedDisplayNames = useMemo(() => {
    return selectedValues.map((selectedValue) => {
      const option = options.find((opt) => compareValues(opt.value, selectedValue));
      return option?.displayProps?.fullName || String(selectedValue);
    });
  }, [selectedValues, options, compareValues]);

  return (
    <Dropdown
      size="sm"
      onOpenChange={(open) => {
        if (!open) {
          setSearchTerm("");
        } else {
          // auto focus search when open
          setTimeout(() => inputRef.current?.focus(), 50);
        }
      }}
    >
      <DropdownTrigger>
        <button
          className={cn(
            "flex items-center gap-1 rounded-full h-7 px-2.5 text-xs transition-all border outline-none cursor-pointer font-medium tracking-wide box-border",
            isActive
              ? "bg-[var(--color-interactive-brand-tonal-bg)] border-[var(--color-interactive-brand-tonal-border)] text-[var(--color-text-brand)] hover:bg-[var(--color-interactive-brand-tonal-bg-hover)]"
              : "bg-[var(--color-filter-default-bg)] border-[var(--color-filter-default-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-filter-hover-bg)] hover:border-[var(--color-filter-hover-border)]"
          )}
        >
          {buttonIcon && (
            <span className="flex shrink-0 items-center justify-center">
              {buttonIcon}
            </span>
          )}
          <span className="truncate max-w-[120px]">
            {showSelected && isActive ? (
              <span>
                {label}{" "}
                {selectedCount === 1
                  ? selectedDisplayNames[0]
                  : `${selectedDisplayNames[0]} +${selectedCount - 1}`}
              </span>
            ) : (
              label
            )}
          </span>
          {isActive && (
            <div
              onClick={handleClearFilter}
              className="ml-0.5 -mr-1 p-0.5 flex shrink-0 items-center justify-center rounded-full hover:bg-[var(--color-interactive-brand-default)] hover:text-white text-[var(--color-text-brand)] transition-colors"
            >
              <RiCloseLine className="w-3.5 h-3.5" />
            </div>
          )}
        </button>
      </DropdownTrigger>

      <DropdownMenu align="start" minWidth={240} className="p-0">
        {/* Sticky Search Input */}
        <div className="sticky top-0 z-10 flex items-center gap-2 px-3 py-2 bg-transparent backdrop-blur-md border-b border-[var(--color-border-subtle)]">
          <RiSearchLine className="w-3.5 h-3.5 text-[var(--color-icon-muted)]" />
          <input
            ref={inputRef}
            type="text"
            placeholder={`Search ${label}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]"
          />
        </div>

        {/* Options List */}
        <div className="flex flex-col gap-0.5 py-1">
          {filteredOptions.length === 0 ? (
            <div className="py-4 text-center text-sm text-[var(--color-text-muted)]">
              No {label.toLowerCase()} found
            </div>
          ) : (
            filteredOptions.map((option, index) => {
              const isSelected = selectedValues.some((v) => compareValues(v, option.value));
              
              // Check adjacency for background merging
              const prevOption = filteredOptions[index - 1];
              const nextOption = filteredOptions[index + 1];
              const isPrevSelected = prevOption && selectedValues.some((v) => compareValues(v, prevOption.value));
              const isNextSelected = nextOption && selectedValues.some((v) => compareValues(v, nextOption.value));

              return (
                <DropdownItem
                  key={option.id || String(option.value)}
                  icon={option.displayProps.icon}
                  description={option.displayProps.metaData}
                  selected={isSelected}
                  isPrevSelected={isPrevSelected}
                  isNextSelected={isNextSelected}
                  checkStyle="checkbox"
                  onSelect={() => toggleFilter(option.value)}
                >
                  {option.displayProps.fullName}
                </DropdownItem>
              );
            })
          )}
        </div>
      </DropdownMenu>
    </Dropdown>
  );
}
