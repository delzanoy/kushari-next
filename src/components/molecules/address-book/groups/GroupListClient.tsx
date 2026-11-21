"use client";
import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { GroupCardProps } from './types';
import GroupList from "./GroupList";
import {
    RiGroupLine,
    RiCloseCircleFill,
    RiSearchLine,
} from "@remixicon/react";
import CreateGroupModal from './CreateGroupModal';
import { Button } from '@/components/atoms/Button';
import { IconButton } from '@/components/atoms/IconButton';
import { useModal, Modal } from '@/components/molecules/modal';
import { AddressCardProps } from '../addresses/types';
import { TextInput } from '@/components/atoms/TextInput';
import { getUserGroups } from '@/lib/mock-cache';

export default function GroupListClient({ groups, addresses }: { groups: GroupCardProps[], addresses: AddressCardProps[] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const { open, closeTop } = useModal();

    const [demoGroups, setDemoGroups] = useState<GroupCardProps[]>([]);
    const [loading, setLoading] = useState(true);

    const loadDemoGroups = useCallback(async () => {
        try {
            const demoGroupsData = await getUserGroups();
            setDemoGroups(demoGroupsData.map(g => ({ ...g, count: g.count ?? 0 })));
        } catch (error) {
            console.error('Failed to load demo groups:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadDemoGroups();

        const handleDataChange = () => loadDemoGroups();
        window.addEventListener('groupsUpdated', handleDataChange);
        return () => window.removeEventListener('groupsUpdated', handleDataChange);
    }, [loadDemoGroups]);

    const handleGroupCreated = useCallback(() => {
        loadDemoGroups();
        window.dispatchEvent(new CustomEvent('groupsUpdated'));
    }, [loadDemoGroups]);

    const searchInputRef = useRef<HTMLInputElement>(null);

    const allGroups = useMemo(() => {
        if (loading) return groups;

        const apiGroupsWithSource = groups.map(group => ({
            ...group,
            source: 'api' as const,
            demo: false
        }));

        const demoGroupsWithSource = demoGroups.map(group => ({
            ...group,
            source: group.source || 'user',
            demo: true
        }));

        return [...apiGroupsWithSource, ...demoGroupsWithSource];
    }, [groups, demoGroups, loading]);

    const searchGroups = useCallback((group: GroupCardProps, query: string): boolean => {
        if (!query.trim()) return true;
        const term = query.toLowerCase().trim();
        return group.name.toLowerCase().includes(term);
    }, []);

    const filteredGroups = useMemo(() => {
        if (!searchTerm.trim()) return allGroups;
        return allGroups.filter(group => searchGroups(group, searchTerm));
    }, [allGroups, searchTerm, searchGroups]);

    const clearSearch = () => setSearchTerm('');

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
        <div className="flex flex-col w-full max-w-[1040px] mx-auto items-start gap-12 flex-[1_0_0]">
            {/* Header Section */}
            <div className="flex justify-between items-end self-stretch">
                <div className="flex items-center gap-4 self-stretch">
                    <h1 className="text-[var(--color-text-primary)] text-[26px] font-medium tracking-tight">Groups</h1>

                    <div className="w-[280px]">
                        <TextInput
                            ref={searchInputRef}
                            placeholder="Group name (⌘K)"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            leadingIcon={<RiSearchLine size={16} className="text-[var(--color-icon-muted)]" />}
                            trailingIcon={
                                searchTerm ? (
                                    <IconButton
                                        icon={<RiCloseCircleFill size={16} />}
                                        onClick={clearSearch}
                                        size="sm"
                                        variant="neutral"
                                        appearance="ghost"
                                        aria-label="Clear search"
                                    />
                                ) : undefined
                            }
                        />
                    </div>
                </div>

                <Button
                    size="md"
                    variant="brand"
                    appearance="filled"
                    leadingIcon={<RiGroupLine />}
                    onClick={() => open(
                        <Modal onClose={closeTop}>
                            <CreateGroupModal
                                onClose={closeTop}
                                addresses={addresses}
                                onGroupCreated={handleGroupCreated}
                            />
                        </Modal>
                    )}
                >
                    Create group
                </Button>
            </div>

            {/* Filter and List Section */}
            <div className="flex flex-col items-end self-stretch w-full">
                <div className="flex items-center gap-4 mb-4 h-7 w-full justify-end">
                    <div className="flex text-[var(--color-text-muted)] text-sm items-center tracking-tight">
                        {hasActiveFilters ? (
                            <span>
                                Showing <span className="font-medium text-[var(--color-text-primary)]">{showingCount}</span> of{' '}
                                <span className="font-medium text-[var(--color-text-primary)]">{totalCount}</span> groups
                            </span>
                        ) : (
                            <span>
                                Showing all <span className="font-medium text-[var(--color-text-primary)]">{totalCount}</span> groups
                            </span>
                        )}
                    </div>
                </div>

                {/* List Header */}
                <div className="flex w-full max-w-[1040px] mx-auto items-center gap-4 py-2 px-0 border-b border-[var(--color-border-subtle)] text-xs text-[var(--color-text-muted)]">
                    <span className="w-80 tracking-tight shrink-0 pl-4">Name</span>
                    <span className="w-60 tracking-tight shrink-0">Addresses</span>
                    <span className="flex-1 tracking-tight shrink-0">Last modified</span>
                </div>

                <GroupList groups={filteredGroups} />
            </div>
        </div>
    );
}
