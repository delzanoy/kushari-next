"use client";
import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { GroupCardProps } from './types';
import GroupList from "./GroupList";
import { CreateGroupIcon, CloseCircleFilledIcon, SearchIcon } from "@/app/components/icons";
import CreateGroupModal from './CreateGroupModal';
import PrimaryButton from '@/app/components/buttons/PrimaryButton';
import { Modal } from '@/app/components/modal/Modal';
import useModal from '@/app/hooks/useModal';
import { AddressCardProps } from '../addresses/types';
import { TextInput } from '@/app/components/forms';
import { getUserGroups } from '@/app/api/mock-cache';
import IconButton from '@/app/components/buttons/IconButton';

export default function GroupListClient({ groups, addresses }: { groups: GroupCardProps[], addresses: AddressCardProps[] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const { open, closeTop } = useModal();

    const [demoGroups, setDemoGroups] = useState<GroupCardProps[]>([]);

    useEffect(() => {
        loadDemoGroups();
    }, []);

    const loadDemoGroups = async () => {
        try {
            const demoGroupsData = await getUserGroups();
            setDemoGroups(demoGroupsData);
        } catch (error) {
            console.error('Failed to load demo groups:', error);
        }
    };
    
    const handleGroupCreated = async () => {
        // Reload demo groups after creation
        await loadDemoGroups();
        
        // Dispatch custom event to notify other components (like AddressListClient)
        window.dispatchEvent(new CustomEvent('groupsUpdated'));
    };

    // Add ref for search input
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Combine API groups with demo groups
    const allGroups = useMemo(() => {
        // Mark API groups with source
        const apiGroupsWithSource = groups.map(group => ({
            ...group,
            source: 'api' as const,
            demo: false
        }));

        // Mark demo groups with source (already should have it from mock cache)
        const demoGroupsWithSource = demoGroups.map(group => ({
            ...group,
            source: group.source || 'user',
            demo: true
        }));

        return [...apiGroupsWithSource, ...demoGroupsWithSource];
    }, [groups, demoGroups]);

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

    // Filter groups based on search
    const filteredGroups = useMemo(() => {
        let result = allGroups;

        // Apply search filter
        if (searchTerm.trim()) {
            result = result.filter(group =>
                searchGroups(group, searchTerm)
            );
        }

        return result;
    }, [allGroups, searchTerm, searchGroups]);

    const clearSearch = () => {
        setSearchTerm('');
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

    const hasActiveFilters = searchTerm.trim() !== '';
    const showingCount = filteredGroups.filter(group => group.id !== 0).length;
    const totalCount = allGroups.filter(group => group.id !== 0).length;

    return (
        <div className="flex flex-col w-full max-w-[1040px] mx-auto items-start gap-16 flex-[1_0_0]">
            {/* Header Section */}
            <div className="flex justify-between items-end self-stretch mt-[52px]">
                <div className="flex items-end gap-2.5 self-stretch">
                    <h1 className="text-[#F8FCFF] font-[Figtree] text-[26px] not-italic font-medium leading-[normal] tracking-[1.04px]">Groups</h1>

                    {/* Search Bar */}
                    <TextInput
                        ref={searchInputRef}
                        placeholder="Group name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        width={256}
                        leadingIcon={<SearchIcon className="h-4 w-4 text-[#F8FCFF]/60" />}
                        trailingIcon={
                            searchTerm ? (
                                <IconButton icon={<CloseCircleFilledIcon />} onClick={clearSearch} size='sm' status='neutral' className='opacity-50 hover:opacity-100'/>
                            ) : null
                        }
                    />
                </div>

                <PrimaryButton
                    size='md'
                    variant='inverted'
                    label='Create group'
                    leadingIcon={<CreateGroupIcon />}
                    onClick={() => open(
                        <Modal onClose={() => closeTop()}>
                            <CreateGroupModal
                                isOpen={true}
                                onClose={() => closeTop()}
                                addresses={addresses}
                                onGroupCreated={handleGroupCreated}
                            />
                        </Modal>
                    )}
                />
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