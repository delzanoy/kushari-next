// Utility functions for working with addresses and groups
import { AddressCardProps, AddressGroup } from '@/app/address-book/addresses/types';
import { GroupCardProps } from '@/app/address-book/groups/types';

/**
 * Merge API addresses with demo group relationships
 * This adds demo groups to addresses based on the addressGroups mapping
 */
export function mergeAddressesWithDemoGroups(
    apiAddresses: AddressCardProps[],
    addressGroups: Record<number, number[]>,
    demoGroups: GroupCardProps[]
): AddressCardProps[] {
    return apiAddresses.map(address => {
        // Get the group IDs for this address
        const groupIds = addressGroups[address.id] || [];
        
        if (groupIds.length === 0) {
            return address;
        }

        // Find the demo groups that match these IDs
        const demoAddressGroups: AddressGroup[] = groupIds
            .map(groupId => {
                const group = demoGroups.find(g => g.id === groupId);
                if (group) {
                    return {
                        groupId: group.id,
                        groupName: group.name
                    };
                }
                return null;
            })
            .filter((g): g is AddressGroup => g !== null);

        // Combine original groups with demo groups
        const allGroups = [...address.groups, ...demoAddressGroups];

        return {
            ...address,
            groups: allGroups
        };
    });
}

/**
 * Merge API addresses with user-created addresses
 */
export function mergeUserAddresses(
    apiAddresses: AddressCardProps[],
    userAddresses: AddressCardProps[]
): AddressCardProps[] {
    // Mark API addresses with source
    const apiAddressesWithSource = apiAddresses.map(addr => ({
        ...addr,
        source: 'api' as const,
        demo: false
    }));

    // Mark user addresses with source
    const userAddressesWithSource = userAddresses.map(addr => ({
        ...addr,
        source: 'user' as const,
        demo: true
    }));

    return [...apiAddressesWithSource, ...userAddressesWithSource];
}

export function mergeAddressesWithAllGroups(
    addresses: AddressCardProps[],
    addressGroups: Record<number, number[]>,
    allGroups: GroupCardProps[] // Both API and user groups
): AddressCardProps[] {
    return addresses.map(address => {
        // Get the group IDs for this address
        const groupIds = addressGroups[address.id] || [];
        
        if (groupIds.length === 0) {
            return address;
        }

        // Find the groups that match these IDs
        const matchedGroups: AddressGroup[] = groupIds
            .map(groupId => {
                const group = allGroups.find(g => g.id === groupId);
                if (group) {
                    return {
                        groupId: group.id,
                        groupName: group.name
                    };
                }
                return null;
            })
            .filter((g): g is AddressGroup => g !== null);

        // Combine original groups with matched groups
        const allGroupsForAddress = [...address.groups, ...matchedGroups];
        
        // Remove duplicates based on groupId
        const uniqueGroups = allGroupsForAddress.filter((group, index, self) =>
            index === self.findIndex(g => g.groupId === group.groupId)
        );

        return {
            ...address,
            groups: uniqueGroups
        };
    });
}

// Update mergeAllAddressData to use the new function
export function mergeAllAddressData(
    apiAddresses: AddressCardProps[],
    userAddresses: AddressCardProps[],
    addressGroups: Record<number, number[]>,
    allGroups: GroupCardProps[] // Pass all groups here
): AddressCardProps[] {
    // First merge user addresses with API addresses
    const allAddresses = mergeUserAddresses(apiAddresses, userAddresses);
    
    // Then add group relationships to all addresses
    return mergeAddressesWithAllGroups(allAddresses, addressGroups, allGroups);
}