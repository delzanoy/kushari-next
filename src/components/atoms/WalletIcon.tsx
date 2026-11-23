import type { ReactElement } from "react";
import { RiSafeLine, RiWalletLine } from "@remixicon/react";
import { GnosisSafeIcon } from "@/media/icons/GnosisSafeIcon";

/** Wallet types as the API sends them: 1 MPC vault, 2 Gnosis Safe, 3 tracked wallet. */
export type WalletType = 1 | 2 | 3;

const MUTED_CLASS = "text-[var(--color-icon-muted)]";
const MUTED_COLOR = "var(--color-icon-muted)";

export interface WalletIconOptions {
  /** Icon size in px. Default 16. */
  size?: number;
  /** Use the muted icon colour (rows and cards) instead of inheriting the text colour. */
  muted?: boolean;
  /** Type to draw when `type` is missing or unknown. Default: draw nothing. */
  fallback?: WalletType | null;
}

/**
 * The icon for a wallet type: vault, Safe or tracked wallet.
 * Returns null when the type is unknown and there's no fallback, so it can
 * be passed straight to `icon` props that check for a value.
 */
export function walletIcon(
  type: number | undefined,
  { size = 16, muted = false, fallback = null }: WalletIconOptions = {},
): ReactElement | null {
  const t = type === 1 || type === 2 || type === 3 ? type : fallback;
  const className = muted ? MUTED_CLASS : undefined;
  switch (t) {
    case 1:
      return <RiSafeLine size={size} className={className} />;
    case 2:
      return <GnosisSafeIcon size={size} color={muted ? MUTED_COLOR : undefined} className={className} />;
    case 3:
      return <RiWalletLine size={size} className={className} />;
    default:
      return null;
  }
}
