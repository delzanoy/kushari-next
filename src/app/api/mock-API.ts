import { delay } from './mock-cache';
import {
  MOCK_API_WALLETS,
  MOCK_API_VAULTS,
  MOCK_API_TRACKED_WALLETS,
  MOCK_API_MEMBERS
} from './mock-data';

// Simulate API calls with delay
export async function fetchWalletsFromAPI() {
  await delay(300); // Simulate network latency
  return MOCK_API_WALLETS;
}

export async function fetchVaultsFromAPI() {
  await delay(300);
  return MOCK_API_VAULTS;
}

export async function fetchTrackedWalletsFromAPI() {
  await delay(300);
  return MOCK_API_TRACKED_WALLETS;
}

export async function fetchMembersFromAPI() {
  await delay(300);
  return MOCK_API_MEMBERS;
}

// For updating API data (in a real scenario)
export async function updateWalletInAPI(walletId: number, updates: any) {
  await delay(500);
  console.log(`API: Updating wallet ${walletId}`, updates);
  return { success: true };
}

// Simulate API errors (for testing)
export async function simulateAPIError() {
  await delay(200);
  throw new Error("Mock API Error: Service unavailable");
}