"use client"
import AddressList from "./AddressList";
import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { AddressCardProps, Group } from "./types";
import { FilterDropdown } from "@/components/molecules/FilterDropdown";
import {
    RiCommandFill,
    RiSearchLine,
    RiUserAddLine,
    RiSendPlaneLine,
    RiCloseCircleFill
} from "@remixicon/react";
import { useSearchParams, useRouter } from 'next/navigation';
import { NotificationIsland } from "@/components/molecules/NotificationIsland";
import { Button } from "@/components/atoms/Button";
import { IconButton } from "@/components/atoms/IconButton";
import { getAllAddressGroups, getUserGroups, getUserAddresses, mergeAllAddressData } from '@/lib/mock-cache';
import { TextInput } from "@/components/atoms/TextInput";
import { useModal, Modal } from '@/components/molecules/modal';
import AddAddressModal from "./AddAddressModal";

export default function AddressListClient({ addresses: initialAddresses, groups }: { addresses: AddressCardProps[], groups: Group[] }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialSearch = searchParams.get('search') || '';
    const isUngrouped = searchParams.get('ungrouped') === 'true';
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [isCommandPressed, setIsCommandPressed] = useState(false);
    const [selectedAddressIds, setSelectedAddressIds] = useState<number[]>([]);

    const { open, closeTop } = useModal();

    // State for user data
    const [addressGroups, setAddressGroups] = useState<Record<number, number[]>>({});
    const [userGroups, setUserGroups] = useState<Group[]>([]);
    const [userAddresses, setUserAddresses] = useState<AddressCardProps[]>([]);
    const [loading, setLoading] = useState(true);

    const searchInputRef = useRef<HTMLInputElement>(null);

    const loadUserData = useCallback(async () => {
        try {
            const [relationships, demoGroups, demoAddresses] = await Promise.all([
                getAllAddressGroups(),
                getUserGroups(),
                getUserAddresses()
            ]);
            setAddressGroups(relationships);
            setUserGroups(demoGroups);
            setUserAddresses(demoAddresses);
        } catch (error) {
            console.error('Failed to load user data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUserData();

        const handleDataChange = () => loadUserData();

        window.addEventListener('storage', handleDataChange);
        window.addEventListener('groupsUpdated', handleDataChange);
        window.addEventListener('addressesUpdated', handleDataChange);

        return () => {
            window.removeEventListener('storage', handleDataChange);
            window.removeEventListener('groupsUpdated', handleDataChange);
            window.removeEventListener('addressesUpdated', handleDataChange);
        };
    }, [loadUserData]);

    const allGroups = useMemo(() => [...groups, ...userGroups], [groups, userGroups]);

    const addresses = useMemo(() => {
        if (loading) return initialAddresses;
        return mergeAllAddressData(initialAddresses, userAddresses, addressGroups, allGroups);
    }, [initialAddresses, userAddresses, addressGroups, allGroups, loading]);

    const searchAddresses = useCallback((address: AddressCardProps, query: string): boolean => {
        if (!query.trim()) return true;

        const searchTerm = query.toLowerCase().trim();

        if (address.name.toLowerCase().includes(searchTerm) ||
            address.walletHash.toLowerCase().includes(searchTerm)) {
            return true;
        }

        if (address.groups.some(group =>
            group.groupName.toLowerCase().includes(searchTerm)
        )) {
            return true;
        }

        return false;
    }, []);

    const filteredAddresses = useMemo(() => {
        let result = addresses;

        if (isUngrouped) {
            result = result.filter(address => address.groups.length === 0);
        }

        if (searchTerm.trim()) {
            result = result.filter(address => searchAddresses(address, searchTerm));
        }

        return result;
    }, [addresses, isUngrouped, searchTerm, searchAddresses]);

    const clearSearch = () => setSearchTerm('');

    const handleUngroupedClear = () => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete('ungrouped');
        router.replace(`/address-book/addresses?${newSearchParams.toString()}`);
    };

    const handleAddressAdded = () => loadUserData();

    useEffect(() => {
        if (initialSearch) setSearchTerm(initialSearch);
    }, [initialSearch]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.metaKey || e.ctrlKey) setIsCommandPressed(true);

            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
            if (e.key === 'Escape' && searchTerm) {
                clearSearch();
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'Meta' || e.key === 'Control') setIsCommandPressed(false);
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, [searchTerm]);

    const hasActiveFilters = searchTerm.trim() !== '' || isUngrouped;
    const showingCount = filteredAddresses.length;
    const totalCount = addresses.length;

    const handleOpenAddModal = () => {
        open(
            <Modal onClose={closeTop}>
                <AddAddressModal onClose={closeTop} groups={allGroups} onAddressAdded={handleAddressAdded} />
            </Modal>
        );
    };

    return (
        <div className="flex flex-col w-full max-w-[1040px] mx-auto items-start gap-12 flex-[1_0_0]">
            {/* Header Section */}
            <div className="flex justify-between items-end self-stretch">
                <div className="flex items-center gap-4 self-stretch">
                    <h1 className="text-[var(--color-text-primary)] text-[26px] font-medium tracking-tight">Addresses</h1>

                    <div className="w-[280px]">
                        <TextInput
                            ref={searchInputRef}
                            placeholder="Name, hash, groups (⌘K)"
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
                    onClick={handleOpenAddModal}
                    leadingIcon={<RiUserAddLine />}
                >
                    Add address
                </Button>
            </div>

            {/* Filter and List Section */}
            <div className="flex flex-col items-end self-stretch w-full">
                <div className="flex items-center gap-4 mb-4 h-7 w-full justify-between">
                    <div className="flex items-center gap-2">
                        {isUngrouped && (
                            <FilterDropdown
                                options={[]}
                                selectedValues={["dummy"]}
                                onSelectionChange={handleUngroupedClear}
                                label="Addresses not in any group"
                            />
                        )}
                    </div>

                    <div className="flex text-[var(--color-text-muted)] text-sm items-center tracking-tight">
                        {hasActiveFilters ? (
                            <span>
                                Showing <span className="font-medium text-[var(--color-text-primary)]">{showingCount}</span> of{' '}
                                <span className="font-medium text-[var(--color-text-primary)]">{totalCount}</span> addresses
                            </span>
                        ) : (
                            <span>
                                Showing all <span className="font-medium text-[var(--color-text-primary)]">{totalCount}</span> addresses
                            </span>
                        )}
                    </div>
                </div>

                {/* List Header */}
                <div className="flex w-full max-w-[1040px] mx-auto items-center gap-4 py-2 px-4 border-b border-[var(--color-border-subtle)] text-xs text-[var(--color-text-muted)]">
                    <div className="flex w-[187px] items-center gap-2 shrink-0">
                        <RiCommandFill size={14} className={`transition-colors duration-150 ${isCommandPressed ? 'text-[var(--color-icon-brand)]' : 'text-[var(--color-icon-muted)]'}`} />
                        {isCommandPressed ? (
                            <span className="text-[var(--color-text-brand)] tracking-tight">
                                + A to select all
                            </span>
                        ) : (
                            <span className="tracking-tight">Name</span>
                        )}
                    </div>
                    <span className="w-[406px] tracking-tight shrink-0">Address</span>
                    <span className="w-[154px] tracking-tight shrink-0">Last interacted</span>
                    <span className="flex-1 tracking-tight shrink-0">Groups</span>
                </div>

                <AddressList
                    addresses={filteredAddresses}
                    selectedIds={selectedAddressIds}
                    onSelectionChange={setSelectedAddressIds}
                />
            </div>

            {selectedAddressIds.length > 0 && (
                <NotificationIsland
                    title={`${selectedAddressIds.length} ${selectedAddressIds.length === 1 ? 'address' : 'addresses'} selected`}
                    titleAction={
                        <Button
                            variant="neutral"
                            appearance="ghost"
                            size="sm"
                            onClick={() => setSelectedAddressIds([])}
                        >
                            Clear
                        </Button>
                    }
                    mainActions={
                        <>
                            <Button
                                variant="neutral"
                                appearance="outline"
                                size="sm"
                                leadingIcon={<RiUserAddLine />}
                            >
                                Make a group
                            </Button>
                            <Button
                                variant="brand"
                                appearance="filled"
                                size="sm"
                                leadingIcon={<RiSendPlaneLine />}
                            >
                                Send tokens
                            </Button>
                        </>
                    }
                />
            )}
        </div>
    );
}
