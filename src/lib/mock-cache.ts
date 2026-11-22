import { AddressCardProps, Group } from '@/components/molecules/address-book/addresses/types';

export interface GroupCardProps extends Group {
  count?: number;
  lastModified?: Date;
  lastModifiedBy?: string;
  lastModifiedById?: number;
  demo?: boolean;
  source?: 'api' | 'user';
}

// Dummy interfaces to satisfy the imported code structure
export interface AssetBalance { asset: string; amount: number; valueUSD: number; }
export interface Member { id: number; name: string; email: string; role?: string; colour?: string; }
export interface Transaction { id: string; hash: string; status: string; }
export interface Proposal { id: string; title: string; status: string; }

const STORAGE_KEY = 'kushari_cache_v3';
const DEFAULT_TTL_MS = 0;

let TTL_MS = DEFAULT_TTL_MS;
let resetTimer: ReturnType<typeof setTimeout> | null = null;
let persistToSession = true;

export interface UserWallet {
    id: number;
    source: 'user';
    type: 1 | 2 | 3; // 1: Vault, 2: Gnosis Safe, 3: Tracked Wallet
    address: string;
    name: string;
    chain?: string;
    blockchain: string | { blockchain: string }[];
    owners?: string[];
    approvers?: string[];
    threshold?: number;
    createdAt: string;
    demo: boolean;
    totalBalance: number;
    balance: AssetBalance[];
    percent_change_24h: number;
    USDBalance: number;
    memberCount?: number;
    transactions: Transaction[];
    proposals: Proposal[];
    members?: Member[];
}

const userCache: {
    groups: GroupCardProps[];
    addresses: AddressCardProps[];
    wallets: UserWallet[];
    nextId: number;
    nextAddressId: number;
    nextWalletId: number;
    addressGroups: Record<number, number[]>;
} = {
    groups: [],
    addresses: [],
    wallets: [],
    nextId: 10000,
    nextAddressId: 20000,
    nextWalletId: 30000,
    addressGroups: {}
};

export const delay = (ms = 500) => new Promise(res => setTimeout(res, ms));

function isSessionStorageAvailable() {
    try {
        if (typeof window === 'undefined' || !window.sessionStorage) return false;
        const key = '__kushari_session_test';
        window.sessionStorage.setItem(key, '1');
        window.sessionStorage.removeItem(key);
        return true;
    } catch {
        return false;
    }
}

function saveUserDataToSession() {
    if (!persistToSession || typeof window === 'undefined') return;
    try {
        const obj = {
            groups: userCache.groups,
            addresses: userCache.addresses,
            wallets: userCache.wallets,
            nextId: userCache.nextId,
            nextAddressId: userCache.nextAddressId,
            nextWalletId: userCache.nextWalletId,
            addressGroups: userCache.addressGroups
        };

        if (TTL_MS && TTL_MS > 0) {
            (obj as Record<string, unknown>).expiresAt = Date.now() + TTL_MS;
        }

        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
    } catch {
        // Session storage not available
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
        } catch {
            // ignore
        }
    }
}

function loadUserDataFromSession() {
    if (!persistToSession || typeof window === 'undefined') return false;
    try {
        const raw = window.sessionStorage.getItem(STORAGE_KEY);
        if (!raw) return false;

        const parsed = JSON.parse(raw) as Record<string, unknown>;
        if (parsed && typeof parsed === 'object') {
            userCache.groups = ((parsed.groups as GroupCardProps[]) || []).map((group: any) => ({
                ...group,
                lastModified: group.lastModified ? new Date(group.lastModified) : undefined,
                source: 'user' as const,
                demo: true
            }));
            userCache.addresses = ((parsed.addresses as AddressCardProps[]) || []).map((address: any) => ({
                ...address,
                created: address.created ? new Date(address.created) : new Date(),
                lastInteracted: address.lastInteracted ? new Date(address.lastInteracted) : undefined,
                source: 'user' as const,
                demo: true
            }));
            userCache.wallets = ((parsed.wallets as UserWallet[]) || []).map((wallet: any) => ({
                ...wallet,
                source: 'user' as const,
                demo: true,
                totalBalance: wallet.totalBalance ?? 0,
                balance: wallet.balance ?? [],
                percent_change_24h: wallet.percent_change_24h ?? 0,
                USDBalance: wallet.USDBalance ?? 0,
                blockchain: wallet.blockchain ?? 'ethereum',
                transactions: wallet.transactions ?? [],
                proposals: wallet.proposals ?? [],
                members: wallet.members ?? (wallet.type === 3 ? undefined : [])
            }));
            userCache.nextId = (parsed.nextId as number) || 10000;
            userCache.nextAddressId = (parsed.nextAddressId as number) || 20000;
            userCache.nextWalletId = (parsed.nextWalletId as number) || 30000;
            userCache.addressGroups = (parsed.addressGroups as Record<number, number[]>) || {};

            if ((parsed.expiresAt as number) && typeof parsed.expiresAt === 'number') {
                if (Date.now() > (parsed.expiresAt as number)) {
                    clearUserData();
                    return false;
                } else if (TTL_MS > 0) {
                    const remaining = (parsed.expiresAt as number) - Date.now();
                    scheduleReset(remaining);
                }
            }
            return true;
        }
    } catch {
        // Failed to load session data
    }
    return false;
}

// Initialize
if (typeof window !== 'undefined') {
    if (isSessionStorageAvailable()) {
        const loaded = loadUserDataFromSession();
        if (!loaded) {
            saveUserDataToSession();
        }
    }
}

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
export async function getUserGroups(): Promise<GroupCardProps[]> {
    await delay(100);
    return userCache.groups.slice();
}

export async function createGroup(payload: {
    name: string;
    count: number;
    lastModifiedBy?: string;
    addressIds?: number[];
}): Promise<GroupCardProps> {
    await delay(600);

    const id = userCache.nextId++;
    const newGroup: GroupCardProps = {
        id,
        name: payload.name,
        count: payload.count,
    };

    userCache.groups.push(newGroup);

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

// ... other group API functions ...
// I will keep it brief and support the ones used by addresses

// ADDRESSES API
export async function getUserAddresses(): Promise<AddressCardProps[]> {
    await delay(100);
    return userCache.addresses.slice();
}

export async function createAddress(payload: {
    walletHash: string;
    name: string;
    groupIds?: number[];
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
        source: 'user',
    };

    userCache.addresses.push(newAddress);

    if (payload.groupIds && payload.groupIds.length > 0) {
        userCache.addressGroups[id] = payload.groupIds;
        payload.groupIds.forEach(groupId => {
            if (groupId >= 10000) {
                const group = userCache.groups.find(g => g.id === groupId);
                if (group) {
                    group.count = (group.count || 0) + 1;
                }
            }
        });
    }

    saveUserDataToSession();
    if (TTL_MS && TTL_MS > 0) scheduleReset(TTL_MS);

    return { ...newAddress };
}

export async function getAllAddressGroups(): Promise<Record<number, number[]>> {
    await delay(50);
    return { ...userCache.addressGroups };
}

export function mergeAllAddressData(
  apiAddresses: AddressCardProps[],
  userAddresses: AddressCardProps[],
  addressGroupRelationships: Record<number, number[]>,
  allGroups: GroupCardProps[]
): AddressCardProps[] {
  const combined = [...apiAddresses, ...userAddresses];
  
  return combined.map(addr => {
    const groupIds = addressGroupRelationships[addr.id] || [];
    if (groupIds.length > 0) {
      const matchedGroups = groupIds
        .map(id => allGroups.find(g => g.id === id))
        .filter(Boolean) as GroupCardProps[];
      return {
        ...addr,
        groups: [...addr.groups, ...matchedGroups.map(g => ({ groupId: g.id, groupName: g.name }))]
      };
    }
    return addr;
  });
}

// WALLETS API
export async function getUserWallets(): Promise<UserWallet[]> {
    await delay(100);
    return userCache.wallets.slice();
}

export async function createVault(payload: {
    name: string;
    approvers: string[];
    threshold: number;
    blockchain: string;
}): Promise<UserWallet> {
    await delay(600);

    const id = userCache.nextWalletId++;
    const now = new Date().toISOString();
    
    // Generate a mock wallet address
    const hex = id.toString(16).padStart(4, '0');
    const address = `0x234567890123456789012345678901234567${hex}`;

    const newVault: UserWallet = {
        id,
        source: 'user',
        type: 1, // 1 for Vault
        address,
        name: payload.name,
        blockchain: payload.blockchain,
        approvers: payload.approvers,
        threshold: payload.threshold,
        createdAt: now,
        demo: true,
        totalBalance: 0,
        balance: [],
        percent_change_24h: 0,
        USDBalance: 0,
        memberCount: payload.approvers.length,
        transactions: [],
        proposals: [],
        members: payload.approvers.map((email, idx) => ({
            id: -idx - 1,
            name: email.split('@')[0],
            email
        }))
    };

    userCache.wallets.push(newVault);

    saveUserDataToSession();
    if (TTL_MS && TTL_MS > 0) scheduleReset(TTL_MS);

    return { ...newVault };
}

export async function createGnosisSafe(payload: {
    name: string;
    address: string;
    chain: string;
    owners: string[];
    threshold: number;
}): Promise<UserWallet> {
    await delay(600);

    const id = userCache.nextWalletId++;
    const now = new Date().toISOString();

    const newSafe: UserWallet = {
        id,
        source: 'user',
        type: 2, // 2 for Gnosis Safe
        address: payload.address,
        name: payload.name,
        chain: payload.chain,
        blockchain: payload.chain,
        owners: payload.owners,
        threshold: payload.threshold,
        createdAt: now,
        demo: true,
        totalBalance: 0,
        balance: [],
        percent_change_24h: 0,
        USDBalance: 0,
        memberCount: payload.owners.length,
        transactions: [],
        proposals: [],
        members: payload.owners.map((email, idx) => ({
            id: -idx - 1,
            name: email.split('@')[0],
            email
        }))
    };

    userCache.wallets.push(newSafe);

    saveUserDataToSession();
    if (TTL_MS && TTL_MS > 0) scheduleReset(TTL_MS);

    return { ...newSafe };
}

export async function createTrackedWallet(payload: {
    name: string;
    address: string;
    type: "ethereum" | "binance";
    publicKey?: string;
    secretKey?: string;
}): Promise<UserWallet> {
    await delay(600);

    const id = userCache.nextWalletId++;
    const now = new Date().toISOString();

    const newTracked: UserWallet = {
        id,
        source: 'user',
        type: 3, // 3 for Tracked Wallet
        address: payload.address,
        name: payload.name,
        blockchain: payload.type,
        createdAt: now,
        demo: true,
        totalBalance: 0,
        balance: [],
        percent_change_24h: 0,
        USDBalance: 0,
        transactions: [],
        proposals: [],
    };

    userCache.wallets.push(newTracked);

    saveUserDataToSession();
    if (TTL_MS && TTL_MS > 0) scheduleReset(TTL_MS);

    return { ...newTracked };
}
