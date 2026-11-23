"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@/components/atoms/Dropdown";
import { Button } from "@/components/atoms/Button";
import { RiSearchLine, RiArrowRightSLine } from "@remixicon/react";
import { cn } from "@/lib/utils";
import { pressable } from "@/lib/pressable";

// --- Types ---

export interface FilterCriterion {
  id: string;
  field: string;
  operator: string;
  value: string | string[];
}

export interface FilterDropdownOption {
  value: string;
  display?: React.ReactNode;
  displayProps: {
    fullName: string;
    icon?: React.ReactNode;
  };
  id: string;
  searchText?: string;
  groupKey?: string;
}

export interface FilterField {
  key: string;
  label: string;
  type: "select" | "text" | "multiselect";
  options?: FilterDropdownOption[];
  icon?: React.ReactNode;
  groups?: Array<{ key: string; label: string }>;
}

export interface ComplexFilterProps {
  fields: FilterField[];
  criteria: FilterCriterion[];
  onCriteriaChange: (criteria: FilterCriterion[]) => void;
  label?: string;
  buttonIcon?: React.ReactNode;
  availableValuesByField?: Map<string, Set<string>>;
}

// --- Helper Components ---

interface FilterOptionsPanelProps {
  field: FilterField;
  frozenOptions: FilterDropdownOption[];
  criterion: FilterCriterion | undefined;
  searchTerm: string;
  onOptionSelect: (
    fieldKey: string,
    value: string | string[],
    isMultiSelect: boolean,
    currentCriterion?: FilterCriterion
  ) => void;
  onMouseLeave: () => void;
  availableValues?: Set<string>;
  hasActiveFilters: boolean;
}

const FilterOptionsPanel: React.FC<FilterOptionsPanelProps> = ({
  field,
  frozenOptions,
  criterion,
  searchTerm,
  onOptionSelect,
  onMouseLeave,
  availableValues,
  hasActiveFilters,
}) => {
  const filteredOptions = useMemo(() => frozenOptions, [frozenOptions]);

  const handleOptionClick = (option: FilterDropdownOption, isAvailable: boolean) => {
    if (!isAvailable && hasActiveFilters) return;

    const isSelected =
      field.type === "multiselect"
        ? Array.isArray(criterion?.value) && criterion.value.includes(option.value)
        : criterion?.value === option.value;

    if (field.type === "multiselect") {
      const currentValues = Array.isArray(criterion?.value) ? criterion.value : [];
      const newValues = isSelected
        ? currentValues.filter((v) => v !== option.value)
        : [...currentValues, option.value];
      onOptionSelect(field.key, newValues, true, criterion);
    } else {
      onOptionSelect(field.key, isSelected ? "" : option.value, false, criterion);
    }
  };

  const optionMatchesSearch = (option: FilterDropdownOption): boolean => {
    if (!searchTerm.trim()) return true;
    const searchableText = option.searchText || option.displayProps.fullName || "";
    return searchableText.toLowerCase().includes(searchTerm.toLowerCase());
  };

  return (
    <div
      className="flex flex-col w-[240px] max-h-[320px] overflow-y-auto bg-[var(--color-surface-sunken)] py-1 gap-0.5"
      onMouseEnter={() => {}}
      onMouseLeave={onMouseLeave}
    >
      {filteredOptions.length === 0 ? (
        <div className="py-2 px-3 text-xs text-[var(--color-text-muted)] tracking-wider uppercase font-mono">
          No options available
        </div>
      ) : (
        filteredOptions.map((option, index) => {
          const checkSelected = (opt: FilterDropdownOption) => {
            return field.type === "multiselect"
              ? Array.isArray(criterion?.value) && criterion.value.includes(opt.value)
              : criterion?.value === opt.value;
          };

          const isSelected = checkSelected(option);
          
          // Check adjacency
          const prevOption = filteredOptions[index - 1];
          const nextOption = filteredOptions[index + 1];
          const isPrevSelected = prevOption && checkSelected(prevOption);
          const isNextSelected = nextOption && checkSelected(nextOption);

          const matchesSearch = optionMatchesSearch(option);
          const isAvailable = !availableValues || availableValues.has(option.value);
          const isClickable = isAvailable || !hasActiveFilters;

          // Note: using custom DropdownItem-like styling to support opacity/availability states
          return (
            <DropdownItem
              key={option.id}
              icon={option.displayProps.icon}
              selected={isSelected}
              isPrevSelected={isPrevSelected}
              isNextSelected={isNextSelected}
              checkStyle="checkbox"
              disabled={!isClickable}
              onSelect={() => handleOptionClick(option, isAvailable)}
              className={cn(!matchesSearch && "opacity-50 hidden", !isAvailable && "opacity-40")}
            >
              {option.displayProps.fullName}
            </DropdownItem>
          );
        })
      )}
    </div>
  );
};

// --- Main Component ---

export const ComplexFilter: React.FC<ComplexFilterProps> = ({
  fields,
  criteria,
  onCriteriaChange,
  label = "Filter",
  buttonIcon,
  availableValuesByField,
}) => {
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOverOptions, setIsOverOptions] = useState(false);
  const [frozenFieldOptions, setFrozenFieldOptions] = useState<
    Map<string, FilterDropdownOption[]>
  >(new Map());

  const hasActiveFilters = criteria.length > 0;

  const addCriterion = (fieldKey: string, value?: string | string[]) => {
    const field = fields.find((f) => f.key === fieldKey);
    if (!field) return;

    const newCriterion: FilterCriterion = {
      id: `criterion-${Date.now()}`,
      field: fieldKey,
      operator: "equals",
      value: value || (field.type === "multiselect" ? [] : ""),
    };
    onCriteriaChange([...criteria, newCriterion]);
  };

  const updateCriterion = (id: string, updates: Partial<FilterCriterion>) => {
    const newCriteria = criteria.map((criterion) =>
      criterion.id === id ? { ...criterion, ...updates } : criterion
    );
    onCriteriaChange(newCriteria);
  };

  const handleOptionSelect = (
    fieldKey: string,
    value: string | string[],
    isMultiSelect: boolean,
    currentCriterion?: FilterCriterion
  ) => {
    if (currentCriterion) {
      updateCriterion(currentCriterion.id, { value });
    } else {
      addCriterion(fieldKey, value);
    }
  };

  const hasSelectedValues = (criterion: FilterCriterion): boolean => {
    if (Array.isArray(criterion.value)) {
      return criterion.value.length > 0;
    }
    return criterion.value !== "" && criterion.value != null;
  };

  // Freeze options on first hover
  useEffect(() => {
    if (hoveredField && !frozenFieldOptions.has(hoveredField)) {
      const field = fields.find((f) => f.key === hoveredField);
      if (field && field.options) {
        const optionsCopy = field.options.map((opt) => ({ ...opt }));
        setFrozenFieldOptions((prev) => new Map(prev).set(hoveredField, optionsCopy));
      }
    }
  }, [hoveredField, fields, frozenFieldOptions]);

  const clearAllFilters = () => {
    onCriteriaChange([]);
  };

  return (
    <Dropdown
      size="sm"
      onOpenChange={(open) => {
        if (!open) {
          setSearchTerm("");
          setHoveredField(null);
          setIsOverOptions(false);
          setFrozenFieldOptions(new Map());
        } else {
          setTimeout(() => inputRef.current?.focus(), 50);
        }
      }}
    >
      <DropdownTrigger>
        <button
          className={cn(
            "flex items-center gap-1 rounded-full h-7 px-2.5 text-xs transition-all border cursor-pointer font-medium tracking-wide box-border",
            hasActiveFilters
              ? "bg-[var(--color-interactive-brand-tonal-bg)] border-[var(--color-interactive-brand-tonal-border)] text-[var(--color-text-brand)] hover:bg-[var(--color-interactive-brand-tonal-bg-hover)]"
              : "bg-[var(--color-filter-default-bg)] border-[var(--color-filter-default-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-filter-hover-bg)] hover:border-[var(--color-filter-hover-border)]"
          )}
        >
          {buttonIcon && (
            <span className="flex shrink-0 items-center justify-center">
              {buttonIcon}
            </span>
          )}
          <span>
            {hasActiveFilters ? (
              <span>
                {label} {criteria.length} applied
              </span>
            ) : (
              label
            )}
          </span>
        </button>
      </DropdownTrigger>

      <DropdownMenu align="start" minWidth={240} className="p-0 overflow-hidden flex-col flex">
        {/* Search Input across the top */}
        <div className="flex-none flex items-center gap-2 px-3 py-2 border-b border-[var(--color-border-subtle)] bg-transparent backdrop-blur-md">
          <RiSearchLine className="w-3.5 h-3.5 text-[var(--color-icon-muted)]" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]"
          />
        </div>

        {/* Two Pane Layout */}
        <div
          className="flex flex-1 overflow-hidden"
          onMouseLeave={() => {
            setTimeout(() => {
              if (!isOverOptions) setHoveredField(null);
            }, 100);
          }}
        >
          {/* Left Pane: Fields */}
          <div className="flex flex-col w-[240px] max-h-[320px] overflow-y-auto p-1 gap-0.5">
            {fields.map((field) => {
              const criterion = criteria.find((c) => c.field === field.key);
              const isHovered = hoveredField === field.key;
              const hasValues = criterion && hasSelectedValues(criterion);

              return (
                <div
                  key={field.key}
                  {...pressable({ disabled: !!criterion })}
                  className={cn(
                    "flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer transition-colors text-xs font-medium",
                    hasValues
                      ? "bg-[var(--color-surface-overlay)] text-[var(--color-text-primary)]"
                      : "text-[var(--color-text-primary)] hover:bg-[var(--color-surface-overlay)]/50",
                    isHovered && "bg-[var(--color-surface-overlay)]"
                  )}
                  onMouseEnter={() => setHoveredField(field.key)}
                  onClick={() => {
                    if (!criterion) addCriterion(field.key);
                  }}
                >
                  <div className="flex items-center gap-2">
                    {field.icon && (
                      <span className="w-3.5 h-3.5 flex shrink-0 items-center justify-center text-[var(--color-icon-muted)]">
                        {field.icon}
                      </span>
                    )}
                    <span>{field.label}</span>
                  </div>
                  <RiArrowRightSLine
                    className={cn(
                      "w-3.5 h-3.5 transition-opacity",
                      isHovered ? "opacity-100 text-[var(--color-text-brand)]" : "opacity-30 text-[var(--color-icon-muted)]"
                    )}
                  />
                </div>
              );
            })}

            {hasActiveFilters && (
              <div className="mt-2 pt-2 border-t border-[var(--color-border-subtle)] px-1">
                <Button
                  variant="neutral"
                  appearance="ghost"
                  size="sm"
                  className="w-full justify-center"
                  onClick={clearAllFilters}
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>

          {/* Right Pane: Options */}
          {hoveredField && (() => {
            const field = fields.find((f) => f.key === hoveredField);
            if (!field) return null;

            const criterion = criteria.find((c) => c.field === hoveredField);
            const frozenOptions = frozenFieldOptions.get(hoveredField) || field.options || [];
            const availableValues = availableValuesByField?.get(hoveredField);

            return (
              <div
                className="border-l border-[var(--color-border-subtle)] bg-[var(--color-surface-sunken)]"
                onMouseEnter={() => setIsOverOptions(true)}
                onMouseLeave={() => {
                  setIsOverOptions(false);
                  setHoveredField(null);
                }}
              >
                <FilterOptionsPanel
                  field={field}
                  frozenOptions={frozenOptions}
                  criterion={criterion}
                  searchTerm={searchTerm}
                  onOptionSelect={handleOptionSelect}
                  onMouseLeave={() => {
                    setIsOverOptions(false);
                    setHoveredField(null);
                  }}
                  availableValues={availableValues}
                  hasActiveFilters={hasActiveFilters}
                />
              </div>
            );
          })()}
        </div>
      </DropdownMenu>
    </Dropdown>
  );
};
