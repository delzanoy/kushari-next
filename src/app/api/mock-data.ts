// Static mock API data
export const MOCK_API_WALLETS = [
  {
    id: 1,
    source: 'api' as const,
    type: 1,
    address: "0x742d35Cc6634C0532925a3b844Bc9e99F3eC7a6e",
    chain: "ethereum",
    name: "Team Treasury",
    owners: ["alice@example.com", "ben@example.com"],
    createdAt: "2024-01-15T10:30:00Z",
    demo: false
  },
  {
    id: 2,
    source: 'api' as const,
    type: 2,
    address: "0x8d12A197cB00D4747a1fe03395095ce2A5CC6819",
    chain: "ethereum",
    name: "Marketing Wallet",
    owners: ["carol@example.com", "diego@example.com"],
    createdAt: "2024-02-20T14:45:00Z",
    demo: false
  }
];

export const MOCK_API_VAULTS = [
  {
    id: 101,
    source: 'api' as const,
    name: "DAO Treasury",
    approvers: ["alice@example.com", "ben@example.com", "carol@example.com"],
    threshold: 2,
    createdAt: "2024-01-10T09:00:00Z",
    demo: false
  }
];

export const MOCK_API_TRACKED_WALLETS = [
  {
    id: 201,
    source: 'api' as const,
    type: "ethereum" as const,
    address: "0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe",
    name: "External Partner",
    createdAt: "2024-01-05T11:20:00Z",
    demo: false
  }
];

export const MOCK_API_MEMBERS = [
  { id: 1001, name: "Alice Chen", email: "alice@example.com" },
  { id: 1002, name: "Ben Ortiz", email: "ben@example.com" },
  { id: 1003, name: "Carol Singh", email: "carol@example.com" },
  { id: 1004, name: "Diego Ramos", email: "diego@example.com" }
];