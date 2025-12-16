export type AddressTrustLevel =
  | "trusted"           // Previously interacted
  | "unknown"           // No explorer history
  | "unfamiliar";       // Active wallet but no interaction

export interface Group {
  id: number;
  name: string;
}

export interface AddressGroup {
  groupId: number;
  groupName: string;
}

export interface AddressCardProps {
  id: number;
  name: string;
  walletHash: string;
  created: Date; // timestamp
  lastInteracted?: Date; // timestamp (optional)
  verified: boolean;
  groups: AddressGroup[];
  selected: boolean;
  trustLevel: AddressTrustLevel;
  source?: 'api' | 'user'; // ADD THIS
  demo?: boolean; // ADD THIS
}