// Lightweight session-backed mock cache for groups ONLY
// - User-created groups stored in sessionStorage
// - Combined with real API data
import { GroupCardProps } from '@/app/address-book/groups/types';

const STORAGE_KEY = 'kushari_groups_cache_v1';
const DEFAULT_TTL_MS = 0;

let TTL_MS = DEFAULT_TTL_MS;
let resetTimer: ReturnType<typeof setTimeout> | null = null;
let persistToSession = true;

// User data is stored in sessionStorage
let userCache: {
    groups: GroupCardProps[];
    nextId: number;
    addressGroups: Record<number, number[]>; // addressId -> groupIds[]
} = {
    groups: [],
    nextId: 10000, // Start user IDs from 10000 to avoid conflicts with API IDs
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
            userCache.nextId = parsed.nextId || 10000;
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
            nextId: userCache.nextId,
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
    userCache.nextId = 10000;
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
    addressIds?: number[]; // NEW: Array of address IDs to add to this group
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

    // NEW: Add address-group relationships
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

    // NEW: Remove group from all address relationships
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

// Debug helpers
export function _getStats() {
    return {
        user: {
            groups: userCache.groups.length,
            addressGroups: Object.keys(userCache.addressGroups).length
        }
    };
}

export function _clearUserDataNow() {
    clearUserData();
    saveUserDataToSession();
}