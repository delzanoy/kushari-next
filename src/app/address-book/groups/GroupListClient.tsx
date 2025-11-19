"use client";
import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { GroupCardProps } from './types';
import GroupList from "./GroupList";
import FilterDropdown from '../../components/filters/FilterDropdown';
import { SearchIcon } from "@/app/components/icons";

export default function GroupListClient({ groups }: { groups: GroupCardProps[] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGroups, setSelectedGroups] = useState<number[]>([]);

    // Add ref for search input
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Prepare filter options from groups
    const groupFilterOptions = useMemo(() => {
        return groups.filter(group => group.id !== 0)
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(group => ({
                value: group.id,
                display: group.name,
                displayProps: {
                    fullName: group.name,
                },
                id: group.id.toString(),
                searchText: group.name.toLowerCase(),
            }));
    }, [groups]);

    // Search function for groups
    const searchGroups = useCallback((group: GroupCardProps, query: string): boolean => {
        if (!query.trim()) return true;

        const searchTerm = query.toLowerCase().trim();

        // Search in group name
        if (group.name.toLowerCase().includes(searchTerm)) {
            return true;
        }

        return false;
    }, []);

    // Filter groups based on search and selection
    const filteredGroups = useMemo(() => {
        let result = groups;

        // Apply search filter
        if (searchTerm.trim()) {
            result = result.filter(group =>
                searchGroups(group, searchTerm)
            );
        }

        // Apply group selection filter
        if (selectedGroups.length > 0) {
            result = result.filter(group =>
                selectedGroups.includes(group.id)
            );
        }

        return result;
    }, [groups, searchTerm, selectedGroups, searchGroups]);

    const handleGroupSelectionChange = (selectedIds: number[]) => {
        setSelectedGroups(selectedIds);
    };

    const clearSearch = () => {
        setSearchTerm('');
    };

    const clearAllFilters = () => {
        setSearchTerm('');
        setSelectedGroups([]);
    };

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

    const hasActiveFilters = searchTerm.trim() !== '' || selectedGroups.length > 0;
    const showingCount = filteredGroups.filter(group => group.id !== 0).length;
    const totalCount = groups.filter(group => group.id !== 0).length;

    return (
        <div className="flex flex-col w-full max-w-[1040px] mx-auto items-start gap-16 flex-[1_0_0]">
            {/* Header Section */}
            <div className="flex items-end gap-2.5 self-stretch pt-[52px]">
                <h1 className="text-[#F8FCFF] font-[Figtree] text-[26px] not-italic font-medium leading-[normal] tracking-[1.04px]">Groups</h1>

                {/* Search Bar */}
                <div className="relative">
                    <div className="flex w-80 items-center gap-2 rounded-md border-[0.5px] border-solid border-[#F8FCFF]/24 bg-[#F8FCFF]/02 px-3 py-2 transition-all duration-150 ease-in-out hover:border-[#F8FCFF]/48 focus-within:border-[#26C9C9] focus-within:bg-[#F8FCFF]/08">
                        <SearchIcon className="h-4 w-4 text-[#F8FCFF]/60" />
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search group names, descriptions..."
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
                                    {filteredGroups.filter(group => group.id !== 0).length}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Filter and List Section */}
            <div className="flex flex-col items-end self-stretch">
                <div className="flex text-[#E7E8E9] font-[Geist] text-sm items-center mb-4">
                    {hasActiveFilters ? (
                        <span className='font-medium'>
                            Showing <span className="font-bold">{showingCount}</span> of{' '}
                            <span className="font-medium">{totalCount}</span> groups
                        </span>
                    ) : (
                        <span>
                            Showing all <span className="font-medium">{totalCount}</span> groups
                        </span>
                    )}
                </div>

                {/* Group List */}
                <GroupList groups={filteredGroups} />
            </div>
        </div>
    );
}