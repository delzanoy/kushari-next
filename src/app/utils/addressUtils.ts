// Utility to merge address data with demo group relationships
import { AddressCardProps, AddressGroup } from '@/app/address-book/addresses/types';
import { GroupCardProps } from '@/app/address-book/groups/types';

/**
 * Merges API address data with user-created group relationships from mock cache
 * @param addresses - Original addresses from API
 * @param addressGroups - Map of addressId -> groupIds from mock cache
 * @param userGroups - User-created groups from mock cache
 * @returns Addresses with updated group information
 */
export function mergeAddressesWithDemoGroups(
    addresses: AddressCardProps[],
    addressGroups: Record<number, number[]>,
    userGroups: GroupCardProps[]
): AddressCardProps[] {
    return addresses.map(address => {
        // Get the group IDs this address belongs to from mock cache
        const groupIds = addressGroups[address.id] || [];
        
        if (groupIds.length === 0) {
            // No demo groups for this address, return as is
            return address;
        }

        // Find the actual group objects from userGroups
        const demoGroupsForAddress: AddressGroup[] = groupIds
            .map(groupId => {
                const group = userGroups.find(g => g.id === groupId);
                if (group) {
                    return {
                        groupId: group.id,
                        groupName: group.name
                    };
                }
                return null;
            })
            .filter((g): g is AddressGroup => g !== null);

        // Merge with existing groups from API
        const existingGroups = address.groups || [];
        const allGroups = [...existingGroups, ...demoGroupsForAddress];

        // Remove duplicates based on groupId
        const uniqueGroups = allGroups.filter((group, index, self) =>
            index === self.findIndex(g => g.groupId === group.groupId)
        );

        return {
            ...address,
            groups: uniqueGroups
        };
    });
}