"use client"
import AddressList from "./AddressList";
import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { AddressCardProps } from "./types";
import FilterDropdown from "@/app/components/filters/FilterDropdown";
import { SearchIcon } from "@/app/components/icons";
import { useSearchParams, useRouter } from 'next/navigation';

export default function AddressListClient({ addresses }: { addresses: AddressCardProps[] }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialSearch = searchParams.get('search') || '';
    const isUngrouped = searchParams.get('ungrouped') === 'true';
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [selectedGroups, setSelectedGroups] = useState<number[]>([]);

    // Add ref for search input
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Prepare filter options from addresses' groups
    const groupFilterOptions = useMemo(() => {
        // Get all unique groups from all addresses
        const allGroups = addresses.flatMap(address =>
            address.groups.map(group => ({
                groupId: group.groupId,
                groupName: group.groupName
            }))
        );

        // Remove duplicates and sort by group name
        const uniqueGroups = Array.from(
            new Map(allGroups.map(group => [group.groupId, group])).values()
        ).sort((a, b) => a.groupName.localeCompare(b.groupName));

        return uniqueGroups.map(group => ({
            value: group.groupId,
            display: group.groupName,
            displayProps: {
                fullName: group.groupName,
            },
            id: group.groupId.toString(),
            searchText: group.groupName.toLowerCase(),
        }));
    }, [addresses]);

    // Search function for addresses
    const searchAddresses = useCallback((address: AddressCardProps, query: string): boolean => {
        if (!query.trim()) return true;

        const searchTerm = query.toLowerCase().trim();

        // Search in name and wallet hash
        if (address.name.toLowerCase().includes(searchTerm) ||
            address.walletHash.toLowerCase().includes(searchTerm)) {
            return true;
        }

        // Search in group names
        if (address.groups.some(group =>
            group.groupName.toLowerCase().includes(searchTerm)
        )) {
            return true;
        }

        return false;
    }, []);

    // Filter addresses based on search, group selection, and ungrouped filter
    const filteredAddresses = useMemo(() => {
        let result = addresses;

        // Apply ungrouped filter
        if (isUngrouped) {
            result = result.filter(address => address.groups.length === 0);
        }

        // Apply search filter
        if (searchTerm.trim()) {
            result = result.filter(address =>
                searchAddresses(address, searchTerm)
            );
        }

        // Apply group selection filter
        if (selectedGroups.length > 0) {
            result = result.filter(address =>
                address.groups.some(group =>
                    selectedGroups.includes(group.groupId)
                )
            );
        }

        return result;
    }, [addresses, isUngrouped, searchTerm, selectedGroups, searchAddresses]);

    const handleGroupSelectionChange = (selectedIds: number[]) => {
        setSelectedGroups(selectedIds);
    };

    const clearSearch = () => {
        setSearchTerm('');
    };

    const clearAllFilters = () => {
        setSearchTerm('');
        setSelectedGroups([]);
        // Clear URL parameters
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete('ungrouped');
        newSearchParams.delete('search');
        router.replace(`/address-book/addresses?${newSearchParams.toString()}`);
    };

    const handleUngroupedClear = () => {
        // Clear ungrouped filter from URL
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete('ungrouped');
        router.replace(`/address-book/addresses?${newSearchParams.toString()}`);
    };

    useEffect(() => {
        if (initialSearch) {
            setSearchTerm(initialSearch);
        }
    }, [initialSearch]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
            if (e.key === 'Escape' && searchTerm) {
                clearSearch();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [searchTerm]);

    const hasActiveFilters = searchTerm.trim() !== '' || selectedGroups.length > 0 || isUngrouped;
    const showingCount = filteredAddresses.length;
    const totalCount = addresses.length;

    return (
        <div className="flex flex-col w-full max-w-[1040px] mx-auto items-start gap-16 flex-[1_0_0]">
            {/* Header Section */}
            <div className="flex items-end gap-2.5 self-stretch pt-[52px]">
                <h1 className="text-[#F8FCFF] font-[Figtree] text-[26px] not-italic font-medium leading-[normal] tracking-[1.04px]">Addresses</h1>

                {/* Search Bar */}
                <div className="relative">
                    <div className="flex w-80 items-center gap-2 rounded-md border-[0.5px] border-solid border-[#F8FCFF]/24 bg-[#F8FCFF]/02 px-3 py-2 transition-all duration-150 ease-in-out hover:border-[#F8FCFF]/48 focus-within:border-[#26C9C9] focus-within:bg-[#F8FCFF]/08">
                        <SearchIcon className="h-4 w-4 text-[#F8FCFF]/60" />
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search name, hash, groups..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 bg-transparent text-[#F8FCFF] placeholder-[#F8FCFF]/40 font-[Geist] text-sm font-light outline-none"
                        />
                        {searchTerm && (
                            <button
                                onClick={clearSearch}
                                className="flex h-4 w-4 items-center justify-center rounded-full bg-[#F8FCFF]/20 text-[#F8FCFF]/60 hover:bg-[#F8FCFF]/30 hover:text-[#F8FCFF]/80 transition-colors"
                            >
                                ×
                            </button>
                        )}
                    </div>

                    {/* Search results count badge */}
                    {searchTerm && (
                        <div className="absolute -top-2 -right-2">
                            <div className="rounded-full bg-[#26C9C9] px-2 py-1">
                                <span className="text-[#0A1A1F] font-[Geist] text-xs font-medium">
                                    {filteredAddresses.length}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Filter and List Section */}
            <div className="flex flex-col items-end self-stretch">
                <div className="flex items-center gap-4 mb-4 h-7 w-full justify-between">
                    {/* Active Filters */}
                    <div className="flex items-center gap-2">
                        {/* Ungrouped Filter Chip using FilterDropdown */}
                        {isUngrouped && (
                            <FilterDropdown
                                options={[]} // Empty options since we don't need dropdown functionality
                                selectedValues={[1]} // Dummy value to make it appear as selected
                                onSelectionChange={handleUngroupedClear} // Clear when clicked
                                label="Addresses not in any group"
                                showSelected={false}
                            />
                        )}

                        {/* Group Filter Dropdown */}
                        {/* {groupFilterOptions.length > 0 && (
                            <FilterDropdown
                                options={groupFilterOptions}
                                selectedValues={selectedGroups}
                                onSelectionChange={handleGroupSelectionChange}
                                label="Groups"
                                showSelected={true}
                            />
                        )} */}

                        {/* Clear All Filters Button */}
                        {/* {hasActiveFilters && (
                            <button
                                onClick={clearAllFilters}
                                className="flex items-center flex-shrink-0 gap-1 pt-[3px] pr-[8px] pb-[3px] pl-[8px] rounded-full bg-[#F8FCFF]/16 hover:bg-[#F8FCFF]/16 border-solid border-[1px] border-[#F8FCFF]/32 hover:border-[#F8FCFF]/64"
                            >
                                <span className="font-[Geist] text-sm">
                                    Clear all
                                </span>
                            </button>
                        )} */}
                    </div>

                    {/* Filter Status Text */}
                    <div className="flex text-[#E7E8E9] font-[Geist] text-sm items-center">
                        {hasActiveFilters ? (
                            <span className='font-medium'>
                                Showing <span className="font-bold">{showingCount}</span> of{' '}
                                <span className="font-medium">{totalCount}</span> addresses
                                {/* {isUngrouped && ' (not in any group)'} */}
                            </span>
                        ) : (
                            <span>
                                Showing all <span className="font-medium">{totalCount}</span> addresses
                            </span>
                        )}
                    </div>
                </div>

                {/* Address List */}
                <AddressList addresses={filteredAddresses} />
            </div>
        </div>
    );
}