// "use client"
// import AddressList from "./AddressList";
// import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
// import { AddressCardProps } from "./types";
// import FilterDropdown from "@/app/components/filters/FilterDropdown";
// import { CommandIcon, SearchIcon, AddToGroupIcon, SendIcon, CheckBoxFilledIcon } from "@/app/components/icons";
// import { useSearchParams, useRouter } from 'next/navigation';
// import NotificationIsland from "@/app/components/NotificationIsland";
// import PrimaryButton from "@/app/components/buttons/PrimaryButton";
// import TertiaryButton from "@/app/components/buttons/TertiaryButton";
// import IconButton from "@/app/components/buttons/IconButton";

// export default function AddressListClient({ addresses }: { addresses: AddressCardProps[] }) {
//     const searchParams = useSearchParams();
//     const router = useRouter();
//     const initialSearch = searchParams.get('search') || '';
//     const isUngrouped = searchParams.get('ungrouped') === 'true';
//     const [searchTerm, setSearchTerm] = useState(initialSearch);
//     const [selectedGroups, setSelectedGroups] = useState<number[]>([]);
//     const [isCommandPressed, setIsCommandPressed] = useState(false);
//     const [selectedAddressIds, setSelectedAddressIds] = useState<number[]>([]);

//     // Add ref for search input
//     const searchInputRef = useRef<HTMLInputElement>(null);

//     // Prepare filter options from addresses' groups
//     const groupFilterOptions = useMemo(() => {
//         // Get all unique groups from all addresses
//         const allGroups = addresses.flatMap(address =>
//             address.groups.map(group => ({
//                 groupId: group.groupId,
//                 groupName: group.groupName
//             }))
//         );

//         // Remove duplicates and sort by group name
//         const uniqueGroups = Array.from(
//             new Map(allGroups.map(group => [group.groupId, group])).values()
//         ).sort((a, b) => a.groupName.localeCompare(b.groupName));

//         return uniqueGroups.map(group => ({
//             value: group.groupId,
//             display: group.groupName,
//             displayProps: {
//                 fullName: group.groupName,
//             },
//             id: group.groupId.toString(),
//             searchText: group.groupName.toLowerCase(),
//         }));
//     }, [addresses]);

//     // Search function for addresses
//     const searchAddresses = useCallback((address: AddressCardProps, query: string): boolean => {
//         if (!query.trim()) return true;

//         const searchTerm = query.toLowerCase().trim();

//         // Search in name and wallet hash
//         if (address.name.toLowerCase().includes(searchTerm) ||
//             address.walletHash.toLowerCase().includes(searchTerm)) {
//             return true;
//         }

//         // Search in group names
//         if (address.groups.some(group =>
//             group.groupName.toLowerCase().includes(searchTerm)
//         )) {
//             return true;
//         }

//         return false;
//     }, []);

//     // Filter addresses based on search, group selection, and ungrouped filter
//     const filteredAddresses = useMemo(() => {
//         let result = addresses;

//         // Apply ungrouped filter
//         if (isUngrouped) {
//             result = result.filter(address => address.groups.length === 0);
//         }

//         // Apply search filter
//         if (searchTerm.trim()) {
//             result = result.filter(address =>
//                 searchAddresses(address, searchTerm)
//             );
//         }

//         // Apply group selection filter
//         if (selectedGroups.length > 0) {
//             result = result.filter(address =>
//                 address.groups.some(group =>
//                     selectedGroups.includes(group.groupId)
//                 )
//             );
//         }

//         return result;
//     }, [addresses, isUngrouped, searchTerm, selectedGroups, searchAddresses]);

//     const handleGroupSelectionChange = (selectedIds: number[]) => {
//         setSelectedGroups(selectedIds);
//     };

//     const clearSearch = () => {
//         setSearchTerm('');
//     };

//     const clearAllFilters = () => {
//         setSearchTerm('');
//         setSelectedGroups([]);
//         // Clear URL parameters
//         const newSearchParams = new URLSearchParams(searchParams);
//         newSearchParams.delete('ungrouped');
//         newSearchParams.delete('search');
//         router.replace(`/address-book/addresses?${newSearchParams.toString()}`);
//     };

//     const handleUngroupedClear = () => {
//         // Clear ungrouped filter from URL
//         const newSearchParams = new URLSearchParams(searchParams);
//         newSearchParams.delete('ungrouped');
//         router.replace(`/address-book/addresses?${newSearchParams.toString()}`);
//     };

//     useEffect(() => {
//         if (initialSearch) {
//             setSearchTerm(initialSearch);
//         }
//     }, [initialSearch]);

//     // Keyboard shortcuts
//     useEffect(() => {
//         const handleKeyDown = (e: KeyboardEvent) => {
//             // Track CMD/Ctrl key press
//             if (e.metaKey || e.ctrlKey) {
//                 setIsCommandPressed(true);
//             }

//             if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
//                 e.preventDefault();
//                 searchInputRef.current?.focus();
//             }
//             if (e.key === 'Escape' && searchTerm) {
//                 clearSearch();
//             }
//         };

//         const handleKeyUp = (e: KeyboardEvent) => {
//             // Track CMD/Ctrl key release
//             if (e.key === 'Meta' || e.key === 'Control') {
//                 setIsCommandPressed(false);
//             }
//         };

//         document.addEventListener('keydown', handleKeyDown);
//         document.addEventListener('keyup', handleKeyUp);
//         return () => {
//             document.removeEventListener('keydown', handleKeyDown);
//             document.removeEventListener('keyup', handleKeyUp);
//         };
//     }, [searchTerm]);

//     const hasActiveFilters = searchTerm.trim() !== '' || selectedGroups.length > 0 || isUngrouped;
//     const showingCount = filteredAddresses.length;
//     const totalCount = addresses.length;

//     return (
//         <div className="flex flex-col w-full max-w-[1040px] mx-auto items-start gap-16 flex-[1_0_0]">
//             {/* Header Section */}
//             <div className="flex items-end gap-2.5 self-stretch pt-[52px]">
//                 <h1 className="text-[#F8FCFF] font-[Figtree] text-[26px] not-italic font-medium leading-[normal] tracking-[1.04px]">Addresses</h1>

//                 {/* Search Bar */}
//                 <div className="relative">
//                     <div className="flex w-80 items-center gap-2 rounded-md border-[0.5px] border-solid border-[#F8FCFF]/24 bg-[#F8FCFF]/02 px-3 py-2 transition-all duration-150 ease-in-out hover:border-[#F8FCFF]/48 focus-within:border-[#26C9C9] focus-within:bg-[#F8FCFF]/08">
//                         <SearchIcon className="h-4 w-4 text-[#F8FCFF]/60" />
//                         <input
//                             ref={searchInputRef}
//                             type="text"
//                             placeholder="Search name, hash, groups..."
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             className="flex-1 bg-transparent text-[#F8FCFF] placeholder-[#F8FCFF]/40 font-[Geist] text-sm font-light outline-none"
//                         />
//                         {searchTerm && (
//                             <button
//                                 onClick={clearSearch}
//                                 className="flex h-4 w-4 items-center justify-center rounded-full bg-[#F8FCFF]/20 text-[#F8FCFF]/60 hover:bg-[#F8FCFF]/30 hover:text-[#F8FCFF]/80 transition-colors"
//                             >
//                                 ×
//                             </button>
//                         )}
//                     </div>

//                     {/* Search results count badge */}
//                     {searchTerm && (
//                         <div className="absolute -top-2 -right-2">
//                             <div className="rounded-full bg-[#26C9C9] px-2 py-1">
//                                 <span className="text-[#0A1A1F] font-[Geist] text-xs font-medium">
//                                     {filteredAddresses.length}
//                                 </span>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* Filter and List Section */}
//             <div className="flex flex-col items-end self-stretch">
//                 <div className="flex items-center gap-4 mb-4 h-7 w-full justify-between">
//                     {/* Active Filters */}
//                     <div className="flex items-center gap-2">
//                         {/* Ungrouped Filter Chip using FilterDropdown */}
//                         {isUngrouped && (
//                             <FilterDropdown
//                                 options={[]} // Empty options since we don't need dropdown functionality
//                                 selectedValues={[1]} // Dummy value to make it appear as selected
//                                 onSelectionChange={handleUngroupedClear} // Clear when clicked
//                                 label="Addresses not in any group"
//                                 showSelected={false}
//                             />
//                         )}
//                     </div>

//                     {/* Filter Status Text */}
//                     <div className="flex text-[#E7E8E9] font-[Geist] text-sm items-center">
//                         {hasActiveFilters ? (
//                             <span className='font-medium'>
//                                 Showing <span className="font-bold">{showingCount}</span> of{' '}
//                                 <span className="font-medium">{totalCount}</span> addresses
//                             </span>
//                         ) : (
//                             <span>
//                                 Showing all <span className="font-medium">{totalCount}</span> addresses
//                             </span>
//                         )}
//                     </div>
//                 </div>

//                 {/* Address List */}
//                 <div className="group/group flex w-full max-w-[1040px] mx-auto flex pt-[10px] pr-[16px] pb-[10px] pl-[8px] items-center gap-4 self-stretch bg-[#18191B]">
//                     <div className="flex w-[187px] items-center gap-2">
//                         <CommandIcon className={`h-4 w-4 transition-colors duration-150 ${isCommandPressed ? 'text-[#26C9C9]' : 'text-[#515355]'}`} />
//                         {isCommandPressed ? (
//                             <span className="text-[#26C9C9] font-[Geist] text-xs not-italic font-medium leading-[normal] tracking-[0.96px]">
//                                 + A to select all
//                             </span>
//                         ) : (
//                             <span className="text-[#F8FCFF] opacity-82 font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px]">Name</span>
//                         )}
//                     </div>
//                     <span className="w-[406px] text-[#F8FCFF] opacity-82 font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px]">Address</span>
//                     <span className="w-[154px] text-[#F8FCFF] opacity-82 font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px]">Last interacted</span>
//                     <span className="w-[160px] text-[#F8FCFF] opacity-82 font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px]">Groups</span>
//                 </div>
//                 <AddressList addresses={filteredAddresses}
//                     selectedIds={selectedAddressIds}
//                     onSelectionChange={setSelectedAddressIds} />
//             </div>
//             {selectedAddressIds.length > 0 && (
//                 <NotificationIsland
//                     title={`${selectedAddressIds.length} ${selectedAddressIds.length === 1 ? 'address' : 'addresses'} selected`}
//                     titleAction={
//                         <TertiaryButton
//                             label="Clear"
//                             size="sm"
//                             status="neutral"
//                             onClick={() => setSelectedAddressIds([])}
//                         />
//                     }
//                     mainActions={
//                         <>
//                             <PrimaryButton
//                                 label="Make a group"
//                                 size="md"
//                                 variant="neutral"
//                                 leadingIcon={<AddToGroupIcon />}

//                             />
//                             <PrimaryButton
//                                 label="Send tokens"
//                                 size="md"
//                                 variant="neutral"
//                                 leadingIcon={<SendIcon />}

//                             />
//                         </>
//                     }
//                 />
//             )}
//         </div>
//     );
// }




"use client"
import AddressList from "./AddressList";
import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { AddressCardProps } from "./types";
import FilterDropdown from "@/app/components/filters/FilterDropdown";
import { CommandIcon, SearchIcon, AddToGroupIcon, SendIcon, CloseCircleFilledIcon } from "@/app/components/icons";
import { useSearchParams, useRouter } from 'next/navigation';
import NotificationIsland from "@/app/components/NotificationIsland";
import PrimaryButton from "@/app/components/buttons/PrimaryButton";
import TertiaryButton from "@/app/components/buttons/TertiaryButton";
import IconButton from "@/app/components/buttons/IconButton";
import { getAllAddressGroups, getUserGroups } from '@/app/api/mock-cache';
import { mergeAddressesWithDemoGroups } from '@/app/utils/addressUtils';
import { GroupCardProps } from '@/app/address-book/groups/types';
import { TextInput } from "@/app/components/forms";
import { Modal } from '@/app/components/modal/Modal';
import useModal from '@/app/hooks/useModal';
import AddAddressModal from "./AddAddressModal";

export default function AddressListClient({ addresses: initialAddresses, groups }: { addresses: AddressCardProps[], groups: GroupCardProps[] }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialSearch = searchParams.get('search') || '';
    const isUngrouped = searchParams.get('ungrouped') === 'true';
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [selectedGroups, setSelectedGroups] = useState<number[]>([]);
    const [isCommandPressed, setIsCommandPressed] = useState(false);
    const [selectedAddressIds, setSelectedAddressIds] = useState<number[]>([]);
    const { open, closeTop } = useModal();

    // State for demo groups data
    const [addressGroups, setAddressGroups] = useState<Record<number, number[]>>({});
    const [userGroups, setUserGroups] = useState<GroupCardProps[]>([]);
    const [loading, setLoading] = useState(true);

    // Add ref for search input
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Load demo group relationships
    useEffect(() => {
        const loadDemoGroupData = async () => {
            try {
                const [relationships, groups] = await Promise.all([
                    getAllAddressGroups(),
                    getUserGroups()
                ]);
                setAddressGroups(relationships);
                setUserGroups(groups);
            } catch (error) {
                console.error('Failed to load demo group data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadDemoGroupData();

        // Listen for storage changes to refresh when groups are created/updated
        const handleStorageChange = () => {
            loadDemoGroupData();
        };

        window.addEventListener('storage', handleStorageChange);

        // Also listen for a custom event we can dispatch when groups change
        window.addEventListener('groupsUpdated', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('groupsUpdated', handleStorageChange);
        };
    }, []);

    // Merge addresses with demo group relationships
    const addresses = useMemo(() => {
        if (loading) return initialAddresses;
        return mergeAddressesWithDemoGroups(initialAddresses, addressGroups, userGroups);
    }, [initialAddresses, addressGroups, userGroups, loading]);

    // Prepare filter options from addresses' groups (including demo groups)
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
            // Track CMD/Ctrl key press
            if (e.metaKey || e.ctrlKey) {
                setIsCommandPressed(true);
            }

            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
            if (e.key === 'Escape' && searchTerm) {
                clearSearch();
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            // Track CMD/Ctrl key release
            if (e.key === 'Meta' || e.key === 'Control') {
                setIsCommandPressed(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, [searchTerm]);

    const hasActiveFilters = searchTerm.trim() !== '' || selectedGroups.length > 0 || isUngrouped;
    const showingCount = filteredAddresses.length;
    const totalCount = addresses.length;

    return (
        <div className="flex flex-col w-full max-w-[1040px] mx-auto items-start gap-16 flex-[1_0_0]">
            {/* Header Section */}
            <div className="flex justify-between items-end self-stretch mt-[52px]">
                <div className="flex items-end gap-2.5 self-stretch">
                    <h1 className="text-[#F8FCFF] font-[Figtree] text-[26px] not-italic font-medium leading-[normal] tracking-[1.04px]">Addresses</h1>

                    {/* Search Bar */}
                    <TextInput
                        ref={searchInputRef}
                        placeholder="Name, hash, groups"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        width={256}
                        leadingIcon={<SearchIcon className="h-4 w-4 text-[#F8FCFF]/60" />}
                        trailingIcon={
                            searchTerm ? (
                                <IconButton icon={<CloseCircleFilledIcon />} onClick={clearSearch} size='sm' status='neutral' className='opacity-50 hover:opacity-100' />
                            ) : null
                        }
                    />
                </div>

                <PrimaryButton
                    size='md'
                    variant='inverted'
                    label='Add address'
                    leadingIcon={<AddToGroupIcon />}
                    onClick={() => open(
                        <Modal onClose={() => closeTop()}>
                            <AddAddressModal
                                isOpen={true}
                                onClose={() => closeTop()}
                                groups={groups}
                            />
                        </Modal>
                    )}
                />
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
                    </div>

                    {/* Filter Status Text */}
                    <div className="flex text-[#E7E8E9] font-[Geist] text-sm items-center">
                        {hasActiveFilters ? (
                            <span className='font-medium'>
                                Showing <span className="font-bold">{showingCount}</span> of{' '}
                                <span className="font-medium">{totalCount}</span> addresses
                            </span>
                        ) : (
                            <span>
                                Showing all <span className="font-medium">{totalCount}</span> addresses
                            </span>
                        )}
                    </div>
                </div>

                {/* Address List */}
                <div className="group/group flex w-full max-w-[1040px] mx-auto flex pt-[10px] pr-[16px] pb-[10px] pl-[8px] items-center gap-4 self-stretch bg-[#18191B]">
                    <div className="flex w-[187px] items-center gap-2">
                        <CommandIcon className={`h-4 w-4 transition-colors duration-150 ${isCommandPressed ? 'text-[#26C9C9]' : 'text-[#515355]'}`} />
                        {isCommandPressed ? (
                            <span className="text-[#26C9C9] font-[Geist] text-xs not-italic font-medium leading-[normal] tracking-[0.96px]">
                                + A to select all
                            </span>
                        ) : (
                            <span className="text-[#F8FCFF] opacity-82 font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px]">Name</span>
                        )}
                    </div>
                    <span className="w-[406px] text-[#F8FCFF] opacity-82 font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px]">Address</span>
                    <span className="w-[154px] text-[#F8FCFF] opacity-82 font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px]">Last interacted</span>
                    <span className="w-[160px] text-[#F8FCFF] opacity-82 font-[Geist] text-xs not-italic font-light leading-[normal] tracking-[0.96px]">Groups</span>
                </div>
                <AddressList addresses={filteredAddresses}
                    selectedIds={selectedAddressIds}
                    onSelectionChange={setSelectedAddressIds} />
            </div>
            {selectedAddressIds.length > 0 && (
                <NotificationIsland
                    title={`${selectedAddressIds.length} ${selectedAddressIds.length === 1 ? 'address' : 'addresses'} selected`}
                    titleAction={
                        <TertiaryButton
                            label="Clear"
                            size="sm"
                            status="neutral"
                            onClick={() => setSelectedAddressIds([])}
                        />
                    }
                    mainActions={
                        <>
                            <PrimaryButton
                                label="Make a group"
                                size="md"
                                variant="neutral"
                                leadingIcon={<AddToGroupIcon />}

                            />
                            <PrimaryButton
                                label="Send tokens"
                                size="md"
                                variant="neutral"
                                leadingIcon={<SendIcon />}

                            />
                        </>
                    }
                />
            )}
        </div>
    );
}