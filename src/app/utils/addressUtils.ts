// src/app/utils/addressUtils.ts
import { AddressCardProps, AddressGroup } from '@/app/address-book/addresses/types';
import { GroupCardProps } from '@/app/address-book/groups/types';

/**
 * Merges API addresses with user-created addresses and applies group relationships
 * 
 * @param apiAddresses - Addresses from the API
 * @param userAddresses - User-created addresses from mock cache
 * @param addressGroups - Mapping of address IDs to group IDs
 * @param allGroups - All groups (both API and user-created)
 * @returns Combined array of addresses with proper group assignments
 */
export function mergeAllAddressData(
    apiAddresses: AddressCardProps[],
    userAddresses: AddressCardProps[],
    addressGroups: Record<number, number[]>,
    allGroups: GroupCardProps[]
): AddressCardProps[] {
    // Mark API addresses as such if they don't have a source set
    // This ensures we preserve their existing groups
    const markedApiAddresses = apiAddresses.map(addr => ({
        ...addr,
                source: (addr.source || 'api') as 'api' | 'user', // Removed "as const"

        demo: addr.demo ?? false
    }));
    
    // Combine marked API addresses with user addresses
    const allAddresses = [...markedApiAddresses, ...userAddresses];
    
    // Create a map of all groups (API + user) for quick lookup
    const groupsMap = new Map<number, GroupCardProps>();
    
    // Add all groups to the map
    allGroups.forEach(group => {
        groupsMap.set(group.id, group);
    });
    
    // Now process each address and apply group relationships
    return allAddresses.map(address => {
        // Get the group IDs for this address from the relationships mapping
        const relationshipGroupIds = addressGroups[address.id] || [];
        
        // Convert group IDs to AddressGroup objects
        const relationshipGroups: AddressGroup[] = relationshipGroupIds
            .map(groupId => {
                const group = groupsMap.get(groupId);
                if (group) {
                    return {
                        groupId: group.id,
                        groupName: group.name
                    };
                }
                return null;
            })
            .filter((group): group is AddressGroup => group !== null);
        
        // For API addresses, preserve their existing groups and add any additional user-assigned groups
        if (address.source === 'api') {
            // Get existing API group IDs
            const existingGroupIds = new Set(address.groups.map(g => g.groupId));
            
            // Add any additional groups from relationships that aren't already there
            const additionalGroups = relationshipGroups.filter(
                g => !existingGroupIds.has(g.groupId)
            );
            
            // Return address with original groups + additional groups
            return {
                ...address,
                groups: [...address.groups, ...additionalGroups]
            };
        }
        
        // For user addresses, use the groups from the relationships
        return {
            ...address,
            groups: relationshipGroups
        };
    });
}

/**
 * Gets all unique groups from a list of addresses
 */
export function extractGroupsFromAddresses(addresses: AddressCardProps[]): Array<{ groupId: number; groupName: string }> {
    const groupsMap = new Map<number, string>();
    
    addresses.forEach(address => {
        address.groups.forEach(group => {
            groupsMap.set(group.groupId, group.groupName);
        });
    });
    
    return Array.from(groupsMap.entries()).map(([groupId, groupName]) => ({
        groupId,
        groupName
    }));
}

/**
 * Filters addresses by group IDs
 */
export function filterAddressesByGroups(
    addresses: AddressCardProps[],
    groupIds: number[]
): AddressCardProps[] {
    if (groupIds.length === 0) return addresses;
    
    return addresses.filter(address =>
        address.groups.some(group => groupIds.includes(group.groupId))
    );
}

/**
 * Gets addresses that don't belong to any group
 */
export function getUngroupedAddresses(addresses: AddressCardProps[]): AddressCardProps[] {
    return addresses.filter(address => address.groups.length === 0);
}