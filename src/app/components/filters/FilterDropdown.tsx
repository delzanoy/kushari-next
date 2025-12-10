"use client";
import { useState, useRef, useEffect, useMemo } from 'react';
import { ArrowDropDownUpIcon, CheckBoxFilledIcon, CheckBoxOutlineIcon, SearchIcon, CloseIcon } from '../icons';

interface FilterDropdownOption<T = any> {
  value: T;
  display: React.ReactNode;
  displayProps: any;
  id: any;
  searchText?: string;
  groupKey?: string;
}

interface FilterDropdownGroup {
  key: string;
  label: string;
}

interface FilterDropdownProps<T = any> {
  options: FilterDropdownOption<T>[];
  selectedValues: T[];
  onSelectionChange: (selected: T[]) => void;
  label: string;
  buttonIcon?: React.ReactNode;
  dropdownIcon?: React.ReactNode;
  minWidth?: string;
  maxWidth?: string;
  showSelected?: boolean;
  compareValues?: (a: T, b: T) => boolean;
  groups?: FilterDropdownGroup[];
  groupBy?: string;
}

const extractTextFromNode = (node: React.ReactNode): string => {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return node.toString();
  if (Array.isArray(node)) return node.map(extractTextFromNode).join(' ');

  if (node && typeof node === 'object' && 'props' in node) {
    return extractTextFromNode((node as any).props?.children);
  }

  return '';
};

export default function FilterDropdown<T>({
  options,
  selectedValues,
  onSelectionChange,
  label,
  buttonIcon,
  dropdownIcon,
  minWidth = "280px",
  maxWidth = "320px",
  showSelected = true,
  compareValues = (a, b) => a === b,
  groups = [],
  groupBy,
}: FilterDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const toggleDropdown = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    if (newIsOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchTerm('');
    }
  };

  const closeDropdown = () => {
    setIsOpen(false);
    setSearchTerm('');
  };

  const toggleFilter = (value: T) => {
    const isSelected = selectedValues.some(selected => compareValues(selected, value));
    const newSelection = isSelected
      ? selectedValues.filter(selected => !compareValues(selected, value))
      : [...selectedValues, value];
    onSelectionChange(newSelection);
  };

  const selectAll = () => {
    onSelectionChange(options.map(option => option.value));
  };

  const clearFilters = () => {
    onSelectionChange([]);
  };

  const handleClearFilter = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearFilters();
  };

  const filteredOptions = searchTerm.trim()
    ? options.filter(option => {
      const searchableText = option.searchText || extractTextFromNode(option.display);
      return searchableText.toLowerCase().includes(searchTerm.toLowerCase());
    })
    : options;

  const groupedOptions = useMemo(() => {
    if (!groupBy && groups.length === 0) {
      return null;
    }

    const grouped: { [key: string]: FilterDropdownOption<T>[] } = {};

    groups.forEach(group => {
      grouped[group.key] = [];
    });

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

    return groups
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
  }, [filteredOptions, groups, groupBy]);

  const getSelectedDisplayNames = () => {
    return selectedValues.map(selectedValue => {
      const option = options.find(opt => compareValues(opt.value, selectedValue));
      return option?.displayProps?.fullName || String(selectedValue);
    });
  };

  const selectedDisplayNames = getSelectedDisplayNames();
  const selectedCount = selectedValues.length;
  const totalCount = options.length;

  const isOptionSelected = (value: T) => {
    return selectedValues.some(selected => compareValues(selected, value));
  };

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
      return "pt-[3px] pr-[6px] pb-[3px] pl-[6px]";
    } else {
      return "pt-[3px] pr-[6px] pb-[3px] pl-[6px]";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Always visible chip button */}
      <button
        onClick={toggleDropdown}
        className={`flex items-center flex-shrink-0 gap-1 rounded-full hover:bg-[#F8FCFF]/16 border-solid border-[1px] hover:border-[#F8FCFF]/64 ${selectedCount > 0 ? "border-[#F8FCFF]/32 bg-[#26C9C9]/10" : "border-[#F8FCFF]/32 bg-[#F8FCFF]/2"} ${getButtonPadding()}`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {buttonIcon && (
          <span className="w-4 h-4 text-[#F8FCFF]">
            {buttonIcon}
          </span>
        )}
        <span className="font-[Geist] text-sm">
          {showSelected && selectedCount > 0 ? (
            <>
              {label} {''}
              <span className="font-medium text-[#26C9C9]">
                {selectedCount === 1
                  ? selectedDisplayNames[0]
                  : `${selectedDisplayNames[0]} +${selectedCount - 1} more`
                }
              </span>
            </>
          ) : (
            label
          )}
        </span>

        {/* Close button - only show when filters are active */}
        {selectedCount > 0 && (
          <div
            onClick={handleClearFilter}
            className="w-4 h-4 flex items-center justify-center cursor-pointer flex-shrink-0"
          >
            <div className="h-8 w-8 min-h-8 min-w-8 bg-transparent text-[#EDEEEE] hover:bg-[#EDEEEE]/16 focus:bg-[#EDEEEE]/8 rounded-full inline-flex items-center justify-center">
              <div className="h-4 w-4">
                <CloseIcon />
              </div>
            </div>
          </div>
        )}
      </button>

      {/* Search Input - Absolutely positioned and wider */}
      {isOpen && (
        <div className="absolute top-0 left-0 z-5">
          <div className="flex flex-col gap-1">
            <div
              className="z-50 flex items-center gap-1 pt-[3px] pr-[8px] pb-[3px] pl-[4px] rounded-full border-[1px] border-solid border-[#26C9C9] bg-[#0F1516] caret-[#26C9C9]"
            >
              <SearchIcon className="w-4 h-4 flex-shrink-0 text-[#26C9C9]" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder={`${label}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-[#F8FCFF] font-[Geist] text-sm placeholder-[#6B7280] w-full"
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

            {/* Dropdown Menu */}
            <div
              className="rounded-[14px] shadow-[0_0_100px_64px_#0E1011] bg-[#0E1011] border-[1px] border-solid border-[#F8FCFF]/16 max-h-80 overflow-y-auto z-10"
              style={{ width: '228px', minWidth: '228px' }}
              role="listbox"
              aria-multiselectable="true"
            >
              {/* Options List */}
              <div className="flex flex-col m-1 gap-0.5" role="group">
                {filteredOptions.length === 0 ? (
                  <div className="pt-2 pb-2 ml-2 text-[#C9C9C9] font-[Geist Mono] text-[10px] not-italic font-light leading-[normal] tracking-[1.4px] uppercase">
                    No {label.toLowerCase()} found
                  </div>
                ) : groupedOptions ? (
                  // Render grouped options
                  groupedOptions.map((group) => (
                    <div key={group.key} className="group">
                      {/* Group Header */}
                      <div className="sticky top-0 pt-2 pb-2 ml-2 text-[#C9C9C9] font-[Geist Mono] text-[10px] not-italic font-light leading-[normal] tracking-[1.4px] uppercase">
                        {group.label}
                      </div>
                      {/* Group Items */}
                      {group.items.map((option) => (
                        <div
                          key={option.id}
                          className="group/option flex pt-[8px] pr-[8px] pb-[8px] pl-[8px] flex-col items-start gap-2.5 hover:bg-[#F8FCFF]/8 rounded-[10px] hover:cursor-pointer"
                          role="option"
                          aria-selected={isOptionSelected(option.value)}
                          onClick={() => toggleFilter(option.value)}
                        >
                          <div className="flex h-[22px] py-[2px] items-center gap-2 w-full">
                            {option.displayProps.icon && (
                              <div className="flex w-4 h-4 justify-center">{option.displayProps.icon}</div>
                            )}
                            <div className="flex items-baseline gap-1.5 flex-[1_0_0] w-full">
                              <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-light leading-[normal] tracking-[0.7px]">{option.displayProps.fullName}</span>
                              {option.displayProps.metaData && (
                                <span className="text-[#F8FCFF] font-[Geist] text-[10px] not-italic font-thin leading-[normal] uppercase tracking-[1.2px]">{option.displayProps.metaData}</span>
                              )}
                            </div>
                            <div className="h-4 w-4 min-h-4 min-w-4 inline-flex items-center justify-center">
                              <input
                                type="checkbox"
                                checked={isOptionSelected(option.value)}
                                onChange={() => toggleFilter(option.value)}
                                className="sr-only"
                                aria-label={`Select ${option.displayProps.fullName || option.value}`}
                              />
                              <div
                                className="h-8 w-8 min-h-8 min-w-8 bg-transparent text-[#EDEEEE] rounded-full inline-flex items-center justify-center cursor-pointer transition-all duration-150 ease-in-out group-hover/option:bg-[#EDEEEE]/16"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFilter(option.value);
                                }}
                              >
                                <div className="h-4 w-4">
                                  {isOptionSelected(option.value) ? <CheckBoxFilledIcon /> : <CheckBoxOutlineIcon />}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))
                ) : (
                  // Render flat list (original behavior)
                  filteredOptions.map((option) => (
                    <div
                      key={option.id}
                      className="group/option flex pt-[8px] pr-[8px] pb-[8px] pl-[8px] flex-col items-start gap-2.5 hover:bg-[#F8FCFF]/8 rounded-[10px] hover:cursor-pointer"
                      role="option"
                      aria-selected={isOptionSelected(option.value)}
                      onClick={() => toggleFilter(option.value)}
                    >
                      <div className="flex h-[22px] py-[2px] items-center gap-2 w-full">
                        {option.displayProps.icon && (
                          <div className="flex w-4 h-4 justify-center">{option.displayProps.icon}</div>
                        )}
                        <div className="flex items-baseline gap-1.5 flex-[1_0_0] w-full">
                          <span className="text-[#F8FCFF] font-[Geist] text-sm not-italic font-light leading-[normal] tracking-[0.7px]">{option.displayProps.fullName}</span>
                          {option.displayProps.metaData && (
                            <span className="text-[#F8FCFF] font-[Geist] text-[10px] not-italic font-thin leading-[normal] uppercase">{option.displayProps.metaData}</span>
                          )}
                        </div>
                        <div className="h-4 w-4 min-h-4 min-w-4 inline-flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={isOptionSelected(option.value)}
                            onChange={() => toggleFilter(option.value)}
                            className="sr-only"
                            aria-label={`Select ${option.displayProps.fullName || option.value}`}
                          />
                          <div
                            className="h-8 w-8 min-h-8 min-w-8 bg-transparent text-[#EDEEEE] rounded-full inline-flex items-center justify-center cursor-pointer transition-all duration-150 ease-in-out group-hover/option:bg-[#EDEEEE]/16"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFilter(option.value);
                            }}
                          >
                            <div className="h-4 w-4">
                              {isOptionSelected(option.value) ? <CheckBoxFilledIcon /> : <CheckBoxOutlineIcon />}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}