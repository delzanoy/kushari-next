// // Lightweight session-backed mock cache for groups AND addresses
// // - User-created groups and addresses stored in sessionStorage
// // - Combined with real API data
// import { GroupCardProps } from '@/app/address-book/groups/types';
// import { AddressCardProps } from '@/app/address-book/addresses/types';

// const STORAGE_KEY = 'kushari_cache_v2'; // Updated version for addresses
// const DEFAULT_TTL_MS = 0;

// let TTL_MS = DEFAULT_TTL_MS;
// let resetTimer: ReturnType<typeof setTimeout> | null = null;
// let persistToSession = true;

// // User data is stored in sessionStorage
// let userCache: {
//     groups: GroupCardProps[];
//     addresses: AddressCardProps[];
//     nextId: number;
//     nextAddressId: number;
//     addressGroups: Record<number, number[]>; // addressId -> groupIds[]
// } = {
//     groups: [],
//     addresses: [],
//     nextId: 10000, // Start group IDs from 10000 to avoid conflicts with API IDs
//     nextAddressId: 20000, // Start address IDs from 20000
//     addressGroups: {} // Track which addresses belong to which groups
// };

// export const delay = (ms = 500) => new Promise(res => setTimeout(res, ms));

// function isSessionStorageAvailable() {
//     try {
//         if (typeof window === 'undefined' || !window.sessionStorage) return false;
//         const key = '__kushari_session_test';
//         window.sessionStorage.setItem(key, '1');
//         window.sessionStorage.removeItem(key);
//         return true;
//     } catch (err) {
//         return false;
//     }
// }

// function loadUserDataFromSession() {
//     if (!persistToSession || typeof window === 'undefined') return false;
//     try {
//         const raw = window.sessionStorage.getItem(STORAGE_KEY);
//         if (!raw) return false;

//         const parsed = JSON.parse(raw);
//         if (parsed && typeof parsed === 'object') {
//             userCache.groups = (parsed.groups || []).map((group: any) => ({
//                 ...group,
//                 lastModified: group.lastModified ? new Date(group.lastModified) : undefined,
//                 source: 'user' as const,
//                 demo: true
//             }));
//             userCache.addresses = (parsed.addresses || []).map((address: any) => ({
//                 ...address,
//                 created: address.created ? new Date(address.created) : new Date(),
//                 lastInteracted: address.lastInteracted ? new Date(address.lastInteracted) : undefined,
//                 source: 'user' as const,
//                 demo: true
//             }));
//             userCache.nextId = parsed.nextId || 10000;
//             userCache.nextAddressId = parsed.nextAddressId || 20000;
//             userCache.addressGroups = parsed.addressGroups || {};

//             // Check TTL if set
//             if (parsed.expiresAt && typeof parsed.expiresAt === 'number') {
//                 if (Date.now() > parsed.expiresAt) {
//                     clearUserData();
//                     return false;
//                 } else if (TTL_MS > 0) {
//                     const remaining = parsed.expiresAt - Date.now();
//                     scheduleReset(remaining);
//                 }
//             }
//             return true;
//         }
//     } catch (err) {
//         console.warn('Failed to load session data:', err);
//     }
//     return false;
// }

// function saveUserDataToSession() {
//     if (!persistToSession || typeof window === 'undefined') return;
//     try {
//         const obj: any = {
//             groups: userCache.groups,
//             addresses: userCache.addresses,
//             nextId: userCache.nextId,
//             nextAddressId: userCache.nextAddressId,
//             addressGroups: userCache.addressGroups
//         };

//         if (TTL_MS && TTL_MS > 0) {
//             obj.expiresAt = Date.now() + TTL_MS;
//         }

//         window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
//     } catch (err) {
//         console.warn('Failed to save session data:', err);
//     }
// }

// function scheduleReset(customMs?: number) {
//     if (resetTimer) {
//         clearTimeout(resetTimer);
//         resetTimer = null;
//     }
//     const ms = typeof customMs === 'number' ? customMs : (TTL_MS || 0);
//     if (ms && ms > 0) {
//         resetTimer = setTimeout(() => {
//             clearUserData();
//         }, ms);
//     }
// }

// function clearUserData() {
//     userCache.groups = [];
//     userCache.addresses = [];
//     userCache.nextId = 10000;
//     userCache.nextAddressId = 20000;
//     userCache.addressGroups = {};

//     if (resetTimer) {
//         clearTimeout(resetTimer);
//         resetTimer = null;
//     }

//     if (persistToSession && typeof window !== 'undefined') {
//         try {
//             window.sessionStorage.removeItem(STORAGE_KEY);
//         } catch (err) {
//             // ignore
//         }
//     }
// }

// // Initialize - load user data from session if available
// (function init() {
//     if (isSessionStorageAvailable()) {
//         const loaded = loadUserDataFromSession();
//         if (!loaded) {
//             saveUserDataToSession();
//         }
//     }
// })();

// export function configureMockCache({ ttlMs = 0, persist = true }: { ttlMs?: number; persist?: boolean }) {
//     TTL_MS = ttlMs ?? 0;
//     persistToSession = Boolean(persist) && isSessionStorageAvailable();
//     if (persistToSession) saveUserDataToSession();

//     if (resetTimer) {
//         clearTimeout(resetTimer);
//         resetTimer = null;
//     }
//     if (TTL_MS && TTL_MS > 0) {
//         scheduleReset(TTL_MS);
//     }
// }

// // GROUPS API

// /**
//  * Get user-created groups only
//  */
// export async function getUserGroups(): Promise<GroupCardProps[]> {
//     await delay(100);
//     return userCache.groups.slice();
// }

// /**
//  * Create a new demo group (user-created)
//  */
// export async function createGroup(payload: {
//     name: string;
//     count: number;
//     lastModifiedBy?: string;
//     addressIds?: number[]; // Array of address IDs to add to this group
// }): Promise<GroupCardProps> {
//     await delay(600);

//     const id = userCache.nextId++;
//     const newGroup: GroupCardProps = {
//         id,
//         source: 'user',
//         name: payload.name,
//         count: payload.count,
//         lastModified: new Date(),
//         lastModifiedById: 9999, // Demo user ID
//         lastModifiedBy: payload.lastModifiedBy || 'Demo User',
//         demo: true
//     };

//     userCache.groups.push(newGroup);

//     // Add address-group relationships
//     if (payload.addressIds && payload.addressIds.length > 0) {
//         payload.addressIds.forEach(addressId => {
//             if (!userCache.addressGroups[addressId]) {
//                 userCache.addressGroups[addressId] = [];
//             }
//             if (!userCache.addressGroups[addressId].includes(id)) {
//                 userCache.addressGroups[addressId].push(id);
//             }
//         });
//     }

//     saveUserDataToSession();
//     if (TTL_MS && TTL_MS > 0) scheduleReset(TTL_MS);

//     return { ...newGroup };
// }

// /**
//  * Update an existing user-created group
//  */
// export async function updateGroup(
//     groupId: number,
//     updates: Partial<Omit<GroupCardProps, 'id' | 'source'>>
// ): Promise<GroupCardProps | null> {
//     await delay(400);

//     const groupIndex = userCache.groups.findIndex(g => g.id === groupId);

//     if (groupIndex === -1) {
//         return null;
//     }

//     const updatedGroup = {
//         ...userCache.groups[groupIndex],
//         ...updates,
//         lastModified: new Date()
//     };

//     userCache.groups[groupIndex] = updatedGroup;
//     saveUserDataToSession();

//     return { ...updatedGroup };
// }

// /**
//  * Delete a user-created group
//  */
// export async function deleteGroup(groupId: number): Promise<boolean> {
//     await delay(400);

//     const initialLength = userCache.groups.length;
//     userCache.groups = userCache.groups.filter(g => g.id !== groupId);

//     // Remove group from all address relationships
//     Object.keys(userCache.addressGroups).forEach(addressIdStr => {
//         const addressId = parseInt(addressIdStr);
//         userCache.addressGroups[addressId] = userCache.addressGroups[addressId].filter(
//             gId => gId !== groupId
//         );
//         // Clean up empty arrays
//         if (userCache.addressGroups[addressId].length === 0) {
//             delete userCache.addressGroups[addressId];
//         }
//     });

//     if (userCache.groups.length < initialLength) {
//         saveUserDataToSession();
//         return true;
//     }

//     return false;
// }

// // ADDRESSES API

// /**
//  * Get user-created addresses only
//  */
// export async function getUserAddresses(): Promise<AddressCardProps[]> {
//     await delay(100);
//     return userCache.addresses.slice();
// }

// /**
//  * Create a new address (user-created)
//  */
// export async function createAddress(payload: {
//     walletHash: string;
//     name: string;
//     groupIds?: number[]; // Array of group IDs to add this address to (can be API or user groups)
// }): Promise<AddressCardProps> {
//     await delay(600);

//     const id = userCache.nextAddressId++;
//     const now = new Date();

//     const newAddress: AddressCardProps = {
//         id,
//         name: payload.name,
//         walletHash: payload.walletHash,
//         created: now,
//         verified: false,
//         groups: [],
//         selected: false,
//         trustLevel: 'unknown',
//         source: 'user', // Add source
//         demo: true, // Add demo flag
//     };

//     userCache.addresses.push(newAddress);

//     // Add address-group relationships for ALL groups (both API and user)
//     if (payload.groupIds && payload.groupIds.length > 0) {
//         userCache.addressGroups[id] = payload.groupIds;

//         // Update group counts ONLY for user-created groups (IDs >= 10000)
//         // API group counts are managed by the backend, not by us
//         payload.groupIds.forEach(groupId => {
//             // Only update counts for user groups (ID >= 10000)
//             if (groupId >= 10000) {
//                 const group = userCache.groups.find(g => g.id === groupId);
//                 if (group) {
//                     group.count += 1;
//                     group.lastModified = new Date();
//                 }
//             }
//         });
//     }

//     saveUserDataToSession();
//     if (TTL_MS && TTL_MS > 0) scheduleReset(TTL_MS);

//     return { ...newAddress };
// }

// /**
//  * Update an existing user-created address
//  */
// export async function updateAddress(
//     addressId: number,
//     updates: Partial<Omit<AddressCardProps, 'id'>>
// ): Promise<AddressCardProps | null> {
//     await delay(400);

//     const addressIndex = userCache.addresses.findIndex(a => a.id === addressId);

//     if (addressIndex === -1) {
//         return null;
//     }

//     const updatedAddress = {
//         ...userCache.addresses[addressIndex],
//         ...updates,
//     };

//     userCache.addresses[addressIndex] = updatedAddress;
//     saveUserDataToSession();

//     return { ...updatedAddress };
// }

// /**
//  * Delete a user-created address
//  */
// export async function deleteAddress(addressId: number): Promise<boolean> {
//     await delay(400);

//     const initialLength = userCache.addresses.length;
//     userCache.addresses = userCache.addresses.filter(a => a.id !== addressId);

//     // Remove address from all group relationships
//     if (userCache.addressGroups[addressId]) {
//         const groupIds = userCache.addressGroups[addressId];

//         // Update group counts ONLY for user-created groups
//         groupIds.forEach(groupId => {
//             if (groupId >= 10000) {
//                 const group = userCache.groups.find(g => g.id === groupId);
//                 if (group && group.count > 0) {
//                     group.count -= 1;
//                     group.lastModified = new Date();
//                 }
//             }
//         });

//         delete userCache.addressGroups[addressId];
//     }

//     if (userCache.addresses.length < initialLength) {
//         saveUserDataToSession();
//         return true;
//     }

//     return false;
// }

// // ADDRESS-GROUP RELATIONSHIPS API

// /**
//  * Get all group IDs for a specific address
//  */
// export async function getAddressGroups(addressId: number): Promise<number[]> {
//     await delay(50);
//     return userCache.addressGroups[addressId] || [];
// }

// /**
//  * Get all address-group relationships
//  */
// export async function getAllAddressGroups(): Promise<Record<number, number[]>> {
//     await delay(50);
//     return { ...userCache.addressGroups };
// }

// /**
//  * Add an address to a group
//  */
// export async function addAddressToGroup(addressId: number, groupId: number): Promise<boolean> {
//     await delay(200);

//     if (!userCache.addressGroups[addressId]) {
//         userCache.addressGroups[addressId] = [];
//     }

//     if (!userCache.addressGroups[addressId].includes(groupId)) {
//         userCache.addressGroups[addressId].push(groupId);

//         // Update group count
//         const group = userCache.groups.find(g => g.id === groupId);
//         if (group) {
//             group.count += 1;
//             group.lastModified = new Date();
//         }

//         saveUserDataToSession();
//         return true;
//     }

//     return false;
// }

// /**
//  * Remove an address from a group
//  */
// export async function removeAddressFromGroup(addressId: number, groupId: number): Promise<boolean> {
//     await delay(200);

//     if (!userCache.addressGroups[addressId]) {
//         return false;
//     }

//     const initialLength = userCache.addressGroups[addressId].length;
//     userCache.addressGroups[addressId] = userCache.addressGroups[addressId].filter(
//         gId => gId !== groupId
//     );

//     if (userCache.addressGroups[addressId].length < initialLength) {
//         // Update group count
//         const group = userCache.groups.find(g => g.id === groupId);
//         if (group && group.count > 0) {
//             group.count -= 1;
//             group.lastModified = new Date();
//         }

//         // Clean up empty arrays
//         if (userCache.addressGroups[addressId].length === 0) {
//             delete userCache.addressGroups[addressId];
//         }

//         saveUserDataToSession();
//         return true;
//     }

//     return false;
// }

// // Debug helpers
// export function _getStats() {
//     return {
//         user: {
//             groups: userCache.groups.length,
//             addresses: userCache.addresses.length,
//             addressGroups: Object.keys(userCache.addressGroups).length
//         }
//     };
// }

// export function _clearUserDataNow() {
//     clearUserData();
//     saveUserDataToSession();
// }








// Lightweight session-backed mock cache for groups, addresses, AND wallets
// - User-created groups, addresses, and wallets stored in sessionStorage
// - Combined with real API data
import { GroupCardProps } from '@/app/address-book/groups/types';
import { AddressCardProps } from '@/app/address-book/addresses/types';

const STORAGE_KEY = 'kushari_cache_v3'; // Updated version for wallets
const DEFAULT_TTL_MS = 0;

let TTL_MS = DEFAULT_TTL_MS;
let resetTimer: ReturnType<typeof setTimeout> | null = null;
let persistToSession = true;

// Wallet types from the application
export interface UserWallet {
    id: number;
    source: 'user';
    type: 1 | 2 | 3; // 1: Vault, 2: Gnosis Safe, 3: Tracked Wallet
    address: string;
    name: string;
    chain?: string;
    blockchain: string | { blockchain: string }[];
    owners?: string[]; // For Gnosis Safe
    approvers?: string[]; // For Vault
    threshold?: number; // For Vault and Gnosis Safe
    createdAt: string;
    demo: boolean;
    // Required properties from WalletSummary - must NOT be optional
    totalBalance: number;
    balance: any[]; // AssetBalance[] in real app
    percent_change_24h: number; // REQUIRED, not optional
    USDBalance: number;
    memberCount?: number; // This one CAN be optional
}

// User data is stored in sessionStorage
let userCache: {
    groups: GroupCardProps[];
    addresses: AddressCardProps[];
    wallets: UserWallet[]; // Added wallets
    nextId: number;
    nextAddressId: number;
    nextWalletId: number; // Added for wallets
    addressGroups: Record<number, number[]>; // addressId -> groupIds[]
} = {
    groups: [],
    addresses: [],
    wallets: [], // Initialize wallets array
    nextId: 10000, // Start group IDs from 10000 to avoid conflicts with API IDs
    nextAddressId: 20000, // Start address IDs from 20000
    nextWalletId: 30000, // Start wallet IDs from 30000
    addressGroups: {} // Track which addresses belong to which groups
};

export const delay = (ms = 500) => new Promise(res => setTimeout(res, ms));

function isSessionStorageAvailable() {
    try {
        if (typeof window === 'undefined' || !window.sessionStorage) return false;
        const key = '__kushari_session_test';
        window.sessionStorage.setItem(key, '1');
        window.sessionStorage.removeItem(key);
        return true;
    } catch (err) {
        return false;
    }
}

function loadUserDataFromSession() {
    if (!persistToSession || typeof window === 'undefined') return false;
    try {
        const raw = window.sessionStorage.getItem(STORAGE_KEY);
        if (!raw) return false;

        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
            userCache.groups = (parsed.groups || []).map((group: any) => ({
                ...group,
                lastModified: group.lastModified ? new Date(group.lastModified) : undefined,
                source: 'user' as const,
                demo: true
            }));
            userCache.addresses = (parsed.addresses || []).map((address: any) => ({
                ...address,
                created: address.created ? new Date(address.created) : new Date(),
                lastInteracted: address.lastInteracted ? new Date(address.lastInteracted) : undefined,
                source: 'user' as const,
                demo: true
            }));
            userCache.wallets = (parsed.wallets || []).map((wallet: any) => ({
                ...wallet,
                source: 'user' as const,
                demo: true,
                // Ensure required WalletSummary fields always have values
                totalBalance: wallet.totalBalance ?? 0,
                balance: wallet.balance ?? [],
                percent_change_24h: wallet.percent_change_24h ?? 0,
                USDBalance: wallet.USDBalance ?? 0,
                blockchain: wallet.blockchain ?? 'ethereum'
            }));
            userCache.nextId = parsed.nextId || 10000;
            userCache.nextAddressId = parsed.nextAddressId || 20000;
            userCache.nextWalletId = parsed.nextWalletId || 30000;
            userCache.addressGroups = parsed.addressGroups || {};

            // Check TTL if set
            if (parsed.expiresAt && typeof parsed.expiresAt === 'number') {
                if (Date.now() > parsed.expiresAt) {
                    clearUserData();
                    return false;
                } else if (TTL_MS > 0) {
                    const remaining = parsed.expiresAt - Date.now();
                    scheduleReset(remaining);
                }
            }
            return true;
        }
    } catch (err) {
        console.warn('Failed to load session data:', err);
    }
    return false;
}

function saveUserDataToSession() {
    if (!persistToSession || typeof window === 'undefined') return;
    try {
        const obj: any = {
            groups: userCache.groups,
            addresses: userCache.addresses,
            wallets: userCache.wallets,
            nextId: userCache.nextId,
            nextAddressId: userCache.nextAddressId,
            nextWalletId: userCache.nextWalletId,
            addressGroups: userCache.addressGroups
        };

        if (TTL_MS && TTL_MS > 0) {
            obj.expiresAt = Date.now() + TTL_MS;
        }

        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
    } catch (err) {
        console.warn('Failed to save session data:', err);
    }
}

function scheduleReset(customMs?: number) {
    if (resetTimer) {
        clearTimeout(resetTimer);
        resetTimer = null;
    }
    const ms = typeof customMs === 'number' ? customMs : (TTL_MS || 0);
    if (ms && ms > 0) {
        resetTimer = setTimeout(() => {
            clearUserData();
        }, ms);
    }
}

function clearUserData() {
    userCache.groups = [];
    userCache.addresses = [];
    userCache.wallets = [];
    userCache.nextId = 10000;
    userCache.nextAddressId = 20000;
    userCache.nextWalletId = 30000;
    userCache.addressGroups = {};

    if (resetTimer) {
        clearTimeout(resetTimer);
        resetTimer = null;
    }

    if (persistToSession && typeof window !== 'undefined') {
        try {
            window.sessionStorage.removeItem(STORAGE_KEY);
        } catch (err) {
            // ignore
        }
    }
}

// Initialize - load user data from session if available
(function init() {
    if (isSessionStorageAvailable()) {
        const loaded = loadUserDataFromSession();
        if (!loaded) {
            saveUserDataToSession();
        }
    }
})();

export function configureMockCache({ ttlMs = 0, persist = true }: { ttlMs?: number; persist?: boolean }) {
    TTL_MS = ttlMs ?? 0;
    persistToSession = Boolean(persist) && isSessionStorageAvailable();
    if (persistToSession) saveUserDataToSession();

    if (resetTimer) {
        clearTimeout(resetTimer);
        resetTimer = null;
    }
    if (TTL_MS && TTL_MS > 0) {
        scheduleReset(TTL_MS);
    }
}

// GROUPS API

/**
 * Get user-created groups only
 */
export async function getUserGroups(): Promise<GroupCardProps[]> {
    await delay(100);
    return userCache.groups.slice();
}

/**
 * Create a new demo group (user-created)
 */
export async function createGroup(payload: {
    name: string;
    count: number;
    lastModifiedBy?: string;
    addressIds?: number[]; // Array of address IDs to add to this group
}): Promise<GroupCardProps> {
    await delay(600);

    const id = userCache.nextId++;
    const newGroup: GroupCardProps = {
        id,
        source: 'user',
        name: payload.name,
        count: payload.count,
        lastModified: new Date(),
        lastModifiedById: 9999, // Demo user ID
        lastModifiedBy: payload.lastModifiedBy || 'Demo User',
        demo: true
    };

    userCache.groups.push(newGroup);

    // Add address-group relationships
    if (payload.addressIds && payload.addressIds.length > 0) {
        payload.addressIds.forEach(addressId => {
            if (!userCache.addressGroups[addressId]) {
                userCache.addressGroups[addressId] = [];
            }
            if (!userCache.addressGroups[addressId].includes(id)) {
                userCache.addressGroups[addressId].push(id);
            }
        });
    }

    saveUserDataToSession();
    if (TTL_MS && TTL_MS > 0) scheduleReset(TTL_MS);

    return { ...newGroup };
}

/**
 * Update an existing user-created group
 */
export async function updateGroup(
    groupId: number,
    updates: Partial<Omit<GroupCardProps, 'id' | 'source'>>
): Promise<GroupCardProps | null> {
    await delay(400);

    const groupIndex = userCache.groups.findIndex(g => g.id === groupId);

    if (groupIndex === -1) {
        return null;
    }

    const updatedGroup = {
        ...userCache.groups[groupIndex],
        ...updates,
        lastModified: new Date()
    };

    userCache.groups[groupIndex] = updatedGroup;
    saveUserDataToSession();

    return { ...updatedGroup };
}

/**
 * Delete a user-created group
 */
export async function deleteGroup(groupId: number): Promise<boolean> {
    await delay(400);

    const initialLength = userCache.groups.length;
    userCache.groups = userCache.groups.filter(g => g.id !== groupId);

    // Remove group from all address relationships
    Object.keys(userCache.addressGroups).forEach(addressIdStr => {
        const addressId = parseInt(addressIdStr);
        userCache.addressGroups[addressId] = userCache.addressGroups[addressId].filter(
            gId => gId !== groupId
        );
        // Clean up empty arrays
        if (userCache.addressGroups[addressId].length === 0) {
            delete userCache.addressGroups[addressId];
        }
    });

    if (userCache.groups.length < initialLength) {
        saveUserDataToSession();
        return true;
    }

    return false;
}

// ADDRESSES API

/**
 * Get user-created addresses only
 */
export async function getUserAddresses(): Promise<AddressCardProps[]> {
    await delay(100);
    return userCache.addresses.slice();
}

/**
 * Create a new address (user-created)
 */
export async function createAddress(payload: {
    walletHash: string;
    name: string;
    groupIds?: number[]; // Array of group IDs to add this address to (can be API or user groups)
}): Promise<AddressCardProps> {
    await delay(600);

    const id = userCache.nextAddressId++;
    const now = new Date();

    const newAddress: AddressCardProps = {
        id,
        name: payload.name,
        walletHash: payload.walletHash,
        created: now,
        verified: false,
        groups: [],
        selected: false,
        trustLevel: 'unknown',
        source: 'user', // Add source
        demo: true, // Add demo flag
    };

    userCache.addresses.push(newAddress);

    // Add address-group relationships for ALL groups (both API and user)
    if (payload.groupIds && payload.groupIds.length > 0) {
        userCache.addressGroups[id] = payload.groupIds;

        // Update group counts ONLY for user-created groups (IDs >= 10000)
        // API group counts are managed by the backend, not by us
        payload.groupIds.forEach(groupId => {
            // Only update counts for user groups (ID >= 10000)
            if (groupId >= 10000) {
                const group = userCache.groups.find(g => g.id === groupId);
                if (group) {
                    group.count += 1;
                    group.lastModified = new Date();
                }
            }
        });
    }

    saveUserDataToSession();
    if (TTL_MS && TTL_MS > 0) scheduleReset(TTL_MS);

    return { ...newAddress };
}

/**
 * Update an existing user-created address
 */
export async function updateAddress(
    addressId: number,
    updates: Partial<Omit<AddressCardProps, 'id'>>
): Promise<AddressCardProps | null> {
    await delay(400);

    const addressIndex = userCache.addresses.findIndex(a => a.id === addressId);

    if (addressIndex === -1) {
        return null;
    }

    const updatedAddress = {
        ...userCache.addresses[addressIndex],
        ...updates,
    };

    userCache.addresses[addressIndex] = updatedAddress;
    saveUserDataToSession();

    return { ...updatedAddress };
}

/**
 * Delete a user-created address
 */
export async function deleteAddress(addressId: number): Promise<boolean> {
    await delay(400);

    const initialLength = userCache.addresses.length;
    userCache.addresses = userCache.addresses.filter(a => a.id !== addressId);

    // Remove address from all group relationships
    if (userCache.addressGroups[addressId]) {
        const groupIds = userCache.addressGroups[addressId];

        // Update group counts ONLY for user-created groups
        groupIds.forEach(groupId => {
            if (groupId >= 10000) {
                const group = userCache.groups.find(g => g.id === groupId);
                if (group && group.count > 0) {
                    group.count -= 1;
                    group.lastModified = new Date();
                }
            }
        });

        delete userCache.addressGroups[addressId];
    }

    if (userCache.addresses.length < initialLength) {
        saveUserDataToSession();
        return true;
    }

    return false;
}

// ADDRESS-GROUP RELATIONSHIPS API

/**
 * Get all group IDs for a specific address
 */
export async function getAddressGroups(addressId: number): Promise<number[]> {
    await delay(50);
    return userCache.addressGroups[addressId] || [];
}

/**
 * Get all address-group relationships
 */
export async function getAllAddressGroups(): Promise<Record<number, number[]>> {
    await delay(50);
    return { ...userCache.addressGroups };
}

/**
 * Add an address to a group
 */
export async function addAddressToGroup(addressId: number, groupId: number): Promise<boolean> {
    await delay(200);

    if (!userCache.addressGroups[addressId]) {
        userCache.addressGroups[addressId] = [];
    }

    if (!userCache.addressGroups[addressId].includes(groupId)) {
        userCache.addressGroups[addressId].push(groupId);

        // Update group count
        const group = userCache.groups.find(g => g.id === groupId);
        if (group) {
            group.count += 1;
            group.lastModified = new Date();
        }

        saveUserDataToSession();
        return true;
    }

    return false;
}

/**
 * Remove an address from a group
 */
export async function removeAddressFromGroup(addressId: number, groupId: number): Promise<boolean> {
    await delay(200);

    if (!userCache.addressGroups[addressId]) {
        return false;
    }

    const initialLength = userCache.addressGroups[addressId].length;
    userCache.addressGroups[addressId] = userCache.addressGroups[addressId].filter(
        gId => gId !== groupId
    );

    if (userCache.addressGroups[addressId].length < initialLength) {
        // Update group count
        const group = userCache.groups.find(g => g.id === groupId);
        if (group && group.count > 0) {
            group.count -= 1;
            group.lastModified = new Date();
        }

        // Clean up empty arrays
        if (userCache.addressGroups[addressId].length === 0) {
            delete userCache.addressGroups[addressId];
        }

        saveUserDataToSession();
        return true;
    }

    return false;
}

// WALLETS API

/**
 * Get user-created wallets only
 */
export async function getUserWallets(): Promise<UserWallet[]> {
    await delay(100);
    return userCache.wallets.slice();
}

/**
 * Create a new vault (type 1)
 */
export async function createVault(payload: {
    name: string;
    approvers: string[];
    threshold: number;
    blockchain?: string | { blockchain: string }[];
}): Promise<UserWallet> {
    await delay(800);

    const id = userCache.nextWalletId++;
    
    // Generate a mock Ethereum address
    const address = '0x' + Array.from({ length: 40 }, () => 
        Math.floor(Math.random() * 16).toString(16)
    ).join('');

    const newVault: UserWallet = {
        id,
        source: 'user',
        type: 1, // Vault
        address,
        name: payload.name,
        approvers: payload.approvers,
        threshold: payload.threshold,
        blockchain: payload.blockchain || 'ethereum',
        createdAt: new Date().toISOString(),
        demo: true,
        // Required WalletSummary properties
        totalBalance: 0,
        balance: [],
        memberCount: payload.approvers.length,
        percent_change_24h: 0,
        USDBalance: 0
    };

    userCache.wallets.push(newVault);
    saveUserDataToSession();
    if (TTL_MS && TTL_MS > 0) scheduleReset(TTL_MS);

    return { ...newVault };
}

/**
 * Create a new Gnosis Safe (type 2)
 */
export async function createGnosisSafe(payload: {
    name: string;
    address: string;
    chain: string;
    owners: string[];
    threshold: number;
}): Promise<UserWallet> {
    await delay(800);

    const id = userCache.nextWalletId++;

    const newSafe: UserWallet = {
        id,
        source: 'user',
        type: 2, // Gnosis Safe
        address: payload.address,
        name: payload.name,
        chain: payload.chain,
        blockchain: [{ blockchain: payload.chain }],
        owners: payload.owners,
        threshold: payload.threshold,
        createdAt: new Date().toISOString(),
        demo: true,
        // Required WalletSummary properties
        totalBalance: 0,
        balance: [],
        memberCount: payload.owners.length,
        percent_change_24h: 0,
        USDBalance: 0
    };

    userCache.wallets.push(newSafe);
    saveUserDataToSession();
    if (TTL_MS && TTL_MS > 0) scheduleReset(TTL_MS);

    return { ...newSafe };
}

/**
 * Create a new tracked wallet (type 3)
 */
export async function createTrackedWallet(payload: {
    name: string;
    address: string;
    type: 'ethereum' | 'binance';
    publicKey?: string;
    secretKey?: string;
}): Promise<UserWallet> {
    await delay(800);

    const id = userCache.nextWalletId++;

    const newTrackedWallet: UserWallet = {
        id,
        source: 'user',
        type: 3, // Tracked Wallet
        address: payload.address,
        name: payload.name,
        blockchain: payload.type === 'ethereum' ? 'ethereum' : 'binance',
        createdAt: new Date().toISOString(),
        demo: true,
        // Required WalletSummary properties
        totalBalance: 0,
        balance: [],
        memberCount: undefined, // Tracked wallets don't have members
        percent_change_24h: 0,
        USDBalance: 0
    };

    userCache.wallets.push(newTrackedWallet);
    saveUserDataToSession();
    if (TTL_MS && TTL_MS > 0) scheduleReset(TTL_MS);

    return { ...newTrackedWallet };
}

/**
 * Update an existing user-created wallet
 */
export async function updateWallet(
    walletId: number,
    updates: Partial<Omit<UserWallet, 'id' | 'source' | 'type'>>
): Promise<UserWallet | null> {
    await delay(400);

    const walletIndex = userCache.wallets.findIndex(w => w.id === walletId);

    if (walletIndex === -1) {
        return null;
    }

    const updatedWallet = {
        ...userCache.wallets[walletIndex],
        ...updates,
    };

    userCache.wallets[walletIndex] = updatedWallet;
    saveUserDataToSession();

    return { ...updatedWallet };
}

/**
 * Delete a user-created wallet
 */
export async function deleteWallet(walletId: number): Promise<boolean> {
    await delay(400);

    const initialLength = userCache.wallets.length;
    userCache.wallets = userCache.wallets.filter(w => w.id !== walletId);

    if (userCache.wallets.length < initialLength) {
        saveUserDataToSession();
        return true;
    }

    return false;
}

// Debug helpers
export function _getStats() {
    return {
        user: {
            groups: userCache.groups.length,
            addresses: userCache.addresses.length,
            wallets: userCache.wallets.length,
            addressGroups: Object.keys(userCache.addressGroups).length
        }
    };
}

export function _clearUserDataNow() {
    clearUserData();
    saveUserDataToSession();
}