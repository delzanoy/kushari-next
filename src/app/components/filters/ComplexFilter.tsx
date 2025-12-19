"use client";
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ArrowDropDownUpIcon, SearchIcon, CheckBoxFilledIcon, CheckBoxOutlineIcon, ArrowDropDownRightIcon } from '../icons';
import PrimaryButton from '../buttons/PrimaryButton';

export interface FilterCriterion {
  id: string;
  field: string;
  operator: string;
  value: string | string[]; // Changed from any to string or string array
}

export interface FilterDropdownOption {
  value: string; // Changed from any to string
  display: React.ReactNode;
  displayProps: {
    fullName: string;
    icon?: React.ReactNode;
  }; // Changed from any to specific type
  id: string; // Changed from any to string
  searchText?: string;
  groupKey?: string;
}

export interface FilterField {
  key: string;
  label: string;
  type: 'select' | 'text' | 'multiselect';
  options?: FilterDropdownOption[];
  icon?: React.ReactNode;
  groups?: Array<{ key: string; label: string }>;
}

interface ComplexFilterProps {
  fields: FilterField[];
  criteria: FilterCriterion[];
  onCriteriaChange: (criteria: FilterCriterion[]) => void;
  label?: string;
  buttonIcon?: React.ReactNode;
  availableValuesByField?: Map<string, Set<string>>; // Changed from any to string
}

// Extract the options panel into a separate component to avoid conditional hooks
interface FilterOptionsPanelProps {
  field: FilterField;
  frozenOptions: FilterDropdownOption[];
  criterion: FilterCriterion | undefined;
  searchTerm: string;
  onOptionSelect: (fieldKey: string, value: string | string[], isMultiSelect: boolean, currentCriterion?: FilterCriterion) => void; // Changed from any to string | string[]
  onMouseLeave: () => void;
  availableValues?: Set<string>; // Changed from any to string
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
  const extractTextFromNode = (node: React.ReactNode): string => {
    if (typeof node === 'string') return node;
    if (typeof node === 'number') return node.toString();
    if (Array.isArray(node)) return node.map(extractTextFromNode).join(' ');

    if (node && typeof node === 'object' && React.isValidElement(node)) {
      const element = node as React.ReactElement;
      // Type-safe way to access props.children
      const props = element.props as { children?: React.ReactNode };
      if (props.children) {
        return extractTextFromNode(props.children);
      }
    }

    return '';
  };

  // Use frozen options instead of field.options
  const filteredOptions = useMemo(() => {
    return frozenOptions;
  }, [frozenOptions]);

  // Group options if groups are configured
  const groupedOptions = useMemo(() => {
    if (!field.groups || field.groups.length === 0) {
      return null;
    }

    const grouped: { [key: string]: FilterDropdownOption[] } = {};

    // Initialize groups in the order they appear in the groups array
    field.groups.forEach(group => {
      grouped[group.key] = [];
    });

    // Add ungrouped items to a default group if they don't match any group
    const defaultGroupKey = 'ungrouped';

    filteredOptions.forEach(option => {
      const groupKey = option.groupKey || defaultGroupKey;
      if (grouped[groupKey]) {
        grouped[groupKey].push(option);
      } else {
        if (!grouped[defaultGroupKey]) {
          grouped[defaultGroupKey] = [];
        }
        grouped[defaultGroupKey].push(option);
      }
    });

    // Convert to array format, preserve group order from groups prop, and filter out empty groups
    return field.groups
      .map(group => ({
        key: group.key,
        label: group.label,
        items: (grouped[group.key] || []).sort((a, b) => {
          const textA = a.displayProps.fullName || '';
          const textB = b.displayProps.fullName || '';
          return textA.localeCompare(textB);
        })
      }))
      .filter(group => group.items.length > 0)
      .concat(
        grouped[defaultGroupKey] && grouped[defaultGroupKey].length > 0
          ? [{
            key: defaultGroupKey,
            label: 'Other',
            items: grouped[defaultGroupKey].sort((a, b) => {
              const textA = a.displayProps.fullName || '';
              const textB = b.displayProps.fullName || '';
              return textA.localeCompare(textB);
            })
          }]
          : []
      );
  }, [filteredOptions, field.groups]);

  const handleOptionClick = (option: FilterDropdownOption, isAvailable: boolean) => {
    // Don't allow clicking on unavailable items when there are active filters
    if (!isAvailable && hasActiveFilters) {
      return;
    }

    const isSelected = field.type === 'multiselect'
      ? Array.isArray(criterion?.value) && criterion.value.includes(option.value)
      : criterion?.value === option.value;

    if (field.type === 'multiselect') {
      const currentValues = Array.isArray(criterion?.value) ? criterion.value : [];
      const newValues = isSelected
        ? currentValues.filter(v => v !== option.value)
        : [...currentValues, option.value];

      onOptionSelect(field.key, newValues, true, criterion);
    } else {
      // For single select, replace the current value
      onOptionSelect(field.key, isSelected ? '' : option.value, false, criterion);
    }
  };

  // Check if option matches search term for highlighting
  const optionMatchesSearch = (option: FilterDropdownOption): boolean => {
    if (!searchTerm.trim()) return true;

    const searchableText = option.searchText || extractTextFromNode(option.display);
    return searchableText.toLowerCase().includes(searchTerm.toLowerCase());
  };

  return (
    <div
      className="bg-[#0E1011] overflow-y-auto"
      style={{ width: '228px', minWidth: '228px', maxHeight: '320px' }}
      onMouseEnter={() => { }} // Keep panel open when mouse enters options
      onMouseLeave={onMouseLeave}
    >
      <div className="p-1">
        {/* Options List - Always show ALL options */}
        {filteredOptions.length === 0 ? (
          <div className="pt-2 pb-2 ml-2 text-[#C9C9C9] font-[Geist Mono] text-[10px] not-italic font-light leading-[normal] tracking-[1.4px] uppercase">
            No options available
          </div>
        ) : groupedOptions ? (
          // Render grouped options
          groupedOptions.map((group) => (
            <div key={group.key} className="group">
              {/* Group Header */}
              <div className="sticky top-0 pt-2 pb-2 ml-2 text-[#C9C9C9] font-[Geist Mono] text-[10px] not-italic font-light leading-[normal] tracking-[1.4px] uppercase">
                {group.label}
              </div>
              {/* Group Items - Show ALL items */}
              {group.items.map((option) => {
                const isSelected = field.type === 'multiselect'
                  ? Array.isArray(criterion?.value) && criterion.value.includes(option.value)
                  : criterion?.value === option.value;
                const matchesSearch = optionMatchesSearch(option);
                const isAvailable = !availableValues || availableValues.has(option.value);
                const isClickable = isAvailable || !hasActiveFilters;

                return (
                  <div
                    key={option.id}
                    className={`group/option flex pt-[8px] pr-[4px] pb-[8px] pl-[8px] flex-col items-start gap-2.5 rounded-[10px] ${isClickable ? 'hover:bg-[#F8FCFF]/8 cursor-pointer' : 'cursor-not-allowed'} ${!matchesSearch ? 'opacity-50' : ''} ${!isAvailable ? 'opacity-70' : ''}`}
                    onClick={() => handleOptionClick(option, isAvailable)}
                  >
                    <div className="flex h-[22px] py-[2px] px-[4px] items-center gap-2 w-full">
                      {option.displayProps.icon && (
                        <div className="flex w-4 h-4 justify-center">{option.displayProps.icon}</div>
                      )}
                      <div className="flex items-baseline gap-1.5 flex-[1_0_0] w-full">
                        <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-light leading-[normal] tracking-[0.7px]">{option.displayProps.fullName}</span>
                      </div>
                      <div className="w-4 h-4 shrink-0">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => { }} // Handled by parent div click
                          className="sr-only"
                          aria-label={`Select ${option.displayProps.fullName}`}
                        />
                        <div className="h-4 w-4 flex items-center justify-center">
                          <div className={`h-8 w-8 min-h-8 min-w-8 bg-transparent text-[#EDEEEE] rounded-full inline-flex items-center justify-center ${isClickable ? 'cursor-pointer transition-all duration-150 ease-in-out group-hover/option:bg-[#EDEEEE]/16' : ''}`} aria-hidden="true">
                            {isSelected ? (
                              <CheckBoxFilledIcon className="h-4 w-4" />
                            ) : (
                              <CheckBoxOutlineIcon className={`h-4 w-4 ${!isAvailable ? 'opacity-70' : ''}`} />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        ) : (
          // Render flat list - Show ALL items
          filteredOptions.map((option) => {
            const isSelected = field.type === 'multiselect'
              ? Array.isArray(criterion?.value) && criterion.value.includes(option.value)
              : criterion?.value === option.value;
            const matchesSearch = optionMatchesSearch(option);
            const isAvailable = !availableValues || availableValues.has(option.value);
            const isClickable = isAvailable || !hasActiveFilters;

            return (
              <div
                key={option.id}
                className={`group/option flex pt-[8px] pr-[4px] pb-[8px] pl-[8px] flex-col items-start gap-2.5 rounded-[10px] ${isClickable ? 'hover:bg-[#F8FCFF]/8 cursor-pointer' : 'cursor-not-allowed'} ${!matchesSearch ? 'opacity-50' : ''} ${!isAvailable ? 'opacity-70' : ''}`}
                onClick={() => handleOptionClick(option, isAvailable)}
              >
                <div className="flex h-[22px] py-[2px] px-[4px] items-center gap-2 w-full">
                  {option.displayProps.icon && (
                    <div className="flex w-4 h-4 justify-center">{option.displayProps.icon}</div>
                  )}
                  <div className="flex items-baseline gap-1.5 flex-[1_0_0] w-full">
                    <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-light leading-[normal] tracking-[0.7px]">{option.displayProps.fullName}</span>
                  </div>
                  <div className="w-4 h-4 shrink-0">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => { }} // Handled by parent div click
                      className="sr-only"
                      aria-label={`Select ${option.displayProps.fullName}`}
                    />
                    <div className="h-4 w-4 flex items-center justify-center">
                      <div className={`h-8 w-8 min-h-8 min-w-8 bg-transparent text-[#EDEEEE] rounded-full inline-flex items-center justify-center ${isClickable ? 'cursor-pointer transition-all duration-150 ease-in-out group-hover/option:bg-[#EDEEEE]/16' : ''}`} aria-hidden="true">
                        {isSelected ? (
                          <CheckBoxFilledIcon className="h-4 w-4" />
                        ) : (
                          <CheckBoxOutlineIcon className={`h-4 w-4 ${!isAvailable ? 'opacity-70' : ''}`} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const ComplexFilter: React.FC<ComplexFilterProps> = ({
  fields,
  criteria,
  onCriteriaChange,
  label = "Filter",
  buttonIcon,
  availableValuesByField,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isOverOptions, setIsOverOptions] = useState(false);
  const [frozenFieldOptions, setFrozenFieldOptions] = useState<Map<string, FilterDropdownOption[]>>(new Map());

  const hasActiveFilters = criteria.length > 0;

  const toggleDropdown = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    if (newIsOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchTerm('');
      setHoveredField(null);
      setIsOverOptions(false);
      setFrozenFieldOptions(new Map());
    }
  };

  const closeDropdown = () => {
    setIsOpen(false);
    setSearchTerm('');
    setHoveredField(null);
    setIsOverOptions(false);
    setFrozenFieldOptions(new Map());
  };

  const addCriterion = (fieldKey: string, value?: string | string[]) => { // Changed from any to string | string[]
    const field = fields.find(f => f.key === fieldKey);
    if (!field) return;

    const newCriterion: FilterCriterion = {
      id: `criterion-${Date.now()}`,
      field: fieldKey,
      operator: 'equals',
      value: value || (field.type === 'multiselect' ? [] : ''),
    };

    onCriteriaChange([...criteria, newCriterion]);
  };

  const updateCriterion = (id: string, updates: Partial<FilterCriterion>) => {
    const newCriteria = criteria.map(criterion =>
      criterion.id === id ? { ...criterion, ...updates } : criterion
    );
    onCriteriaChange(newCriteria);
  };

  const handleOptionSelect = (fieldKey: string, value: string | string[], isMultiSelect: boolean, currentCriterion?: FilterCriterion) => { // Changed from any to string | string[]
    if (currentCriterion) {
      updateCriterion(currentCriterion.id, { value });
    } else {
      addCriterion(fieldKey, value);
    }
  };

  // Helper function to check if a criterion has selected values
  const hasSelectedValues = (criterion: FilterCriterion): boolean => {
    if (Array.isArray(criterion.value)) {
      return criterion.value.length > 0;
    }
    return criterion.value !== '' && criterion.value != null;
  };

  // Freeze options when field is first hovered
  useEffect(() => {
    if (hoveredField && !frozenFieldOptions.has(hoveredField)) {
      const field = fields.find(f => f.key === hoveredField);
      if (field && field.options) {
        // Create a deep copy of options to freeze them
        const optionsCopy = field.options.map(opt => ({ ...opt }));
        setFrozenFieldOptions(prev => new Map(prev.set(hoveredField, optionsCopy))); // Fixed useEffect dependency
      }
    }
  }, [hoveredField, fields]); // Removed frozenFieldOptions from dependencies

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);

  const getButtonPadding = () => {
    if (buttonIcon) {
      return "pt-[3px] pr-[8px] pb-[3px] pl-[4px]";
    } else {
      return "pt-[3px] pr-[8px] pb-[3px] pl-[8px]";
    }
  };

  const clearAllFilters = () => {
    onCriteriaChange([]);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Always visible chip button */}
      <button
        onClick={toggleDropdown}
        className={`flex items-center flex-shrink-0 gap-1 rounded-full hover:bg-[#F8FCFF]/16 border-dashed border-[1px] hover:border-[#F8FCFF]/64 cursor-pointer ${criteria.length > 0
          ? "bg-[#26C9C9]/10"
          : "bg-[#F8FCFF]/2"
          } ${getButtonPadding()}`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {buttonIcon && (
          <span className="w-4 h-4 text-[#F8FCFF]">
            {buttonIcon}
          </span>
        )}
        <span className="font-[Geist] text-sm">
          {criteria.length > 0 ? (
            <>
              {label} {''}
              <span className="font-medium text-[#26C9C9]">
                {criteria.length} applied
              </span>
            </>
          ) : (
            label
          )}
        </span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-0 left-0 z-50">
          <div className="flex flex-col gap-1">
            {/* Search Input */}
            <div className="z-50 flex items-center gap-1 pt-[3px] pr-[8px] pb-[3px] pl-[4px] rounded-full border-[1px] border-solid border-[#26C9C9] bg-[#0F1516] caret-[#26C9C9] w-[228px]">
              <SearchIcon className="w-4 h-4 flex-shrink-0 text-[#26C9C9]" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-[#F8FCFF] font-[Geist] text-sm placeholder-[#6B7280] w-full"
                style={{ width: '140px' }}
              />
              <div
                onClick={closeDropdown}
                className="h-4 w-4 min-h-4 min-w-4 inline-flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-all duration-150 ease-in-out"
              >
                <div className="h-8 w-8 min-h-8 min-w-8 bg-transparent text-[#EDEEEE] hover:bg-[#EDEEEE]/16 focus:bg-[#EDEEEE]/8 rounded-full inline-flex items-center justify-center">
                  <div className="h-4 w-4">
                    <ArrowDropDownUpIcon />
                  </div>
                </div>
              </div>
            </div>

            {/* Main Container with Single Shadow */}
            <div
              className="rounded-[14px] shadow-[0_0_100px_64px_#0E1011] bg-[#0E1011] border-[1px] border-solid border-[#F8FCFF]/16 overflow-hidden z-10 flex"
              onMouseLeave={() => {
                // Only hide options if not over options panel and after a small delay
                setTimeout(() => {
                  if (!isOverOptions) {
                    setHoveredField(null);
                  }
                }, 100);
              }}
            >
              {/* Left Panel - Complete List of All Filter Fields */}
              <div
                className="overflow-y-auto"
                style={{ width: '228px', minWidth: '228px', maxHeight: '320px' }}
              >
                <div className="flex flex-col gap-0.5 p-1">
                  {/* Complete list of all filter fields */}
                  {fields.map((field) => {
                    const criterion = criteria.find(c => c.field === field.key);
                    const isHovered = hoveredField === field.key;
                    const hasValues = criterion && hasSelectedValues(criterion);

                    return (
                      <div
                        key={field.key}
                        className={`flex pt-[8px] pr-[4px] pb-[8px] pl-[8px] flex-col items-start gap-2.5 hover:bg-[#F8FCFF]/8 rounded-[10px] cursor-pointer ${hasValues ? 'bg-[#1C2325]' : ''
                          }`}
                        onMouseEnter={() => setHoveredField(field.key)}
                        onClick={() => {
                          if (!criterion) {
                            addCriterion(field.key);
                          }
                        }}
                      >
                        <div className="flex h-[22px] py-[2px] px-[4px] items-center gap-2 w-full">
                          {/* Field Icon */}
                          {field.icon && (
                            <div className="flex w-4 h-4 justify-center text-[#F8FCFF] opacity-80">
                              {field.icon}
                            </div>
                          )}
                          <div className="flex items-baseline gap-1.5 flex-[1_0_0] w-full">
                            <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-light leading-[normal] tracking-[0.7px]">
                              {field.label}
                            </span>
                          </div>
                          <ArrowDropDownRightIcon
                            className={`h-4.5 w-4.5 ${isHovered
                              ? 'text-[#26C9C9] opacity-100'
                              : 'text-[#F8FCFF] opacity-20'
                              }`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Clear All */}
                {criteria.length > 0 && (
                  <div className="p-1 border-t border-[#2D373B]">
                    {/* <button
                      onClick={clearAllFilters}
                      className="w-full text-center text-[#F37272] font-[Geist] text-xs hover:text-[#ff8a8a] py-2 rounded hover:bg-[#2D373B] transition-colors"
                    >
                      Clear All Filters
                    </button> */}
                    <PrimaryButton label='Clear all' variant='neutral' size='md' className="w-full mt-2" onClick={clearAllFilters}/>
                  </div>
                )}
              </div>

              {/* Right Panel - Options (appears on hover) */}
              {hoveredField && (() => {
                const field = fields.find(f => f.key === hoveredField);
                if (!field) return null;

                const criterion = criteria.find(c => c.field === hoveredField);
                const frozenOptions = frozenFieldOptions.get(hoveredField) || field.options || [];
                const availableValues = availableValuesByField?.get(hoveredField);

                return (
                  <div
                    className="border-l border-[#2D373B]"
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
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplexFilter;