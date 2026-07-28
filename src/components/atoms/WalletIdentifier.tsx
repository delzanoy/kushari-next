import type { ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WalletIdentifierProps {
  /** Wallet icon — caller controls size (18px) and color */
  icon: ReactNode;
  name: string;
  /** Raw address — truncated internally */
  address?: string;
  /**
   * Optional badge rendered at bottom-[14px] left-[12px] of the icon,
   * matching the chain-icon overlay pattern from the reference implementation.
   */
  badge?: ReactNode;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function truncateAddress(address: string): string {
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function WalletIdentifier({ icon, name, address, badge }: WalletIdentifierProps) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      {/* Icon wrapper — relative so the badge can anchor to it */}
      <span className="shrink-0 relative flex items-center">
        {icon}
        {badge && (
          <div className="absolute bottom-[14px] left-[12px]">
            {badge}
          </div>
        )}
      </span>
      <div className="flex items-baseline gap-1.5 min-w-0">
        <span className="font-display text-base font-semibold tracking-tight text-[var(--color-text-primary)] truncate leading-none">
          {name}
        </span>
        {address && (
          <span className="font-mono text-2xs tracking-widest text-[var(--color-text-disabled)] shrink-0 leading-none">
            {truncateAddress(address)}
          </span>
        )}
      </div>
    </div>
  );
}
