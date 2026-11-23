import type { ReactElement } from "react";
import {
  RiArrowLeftDownLongFill,
  RiArrowRightUpLongFill,
  RiExpandDiagonalFill,
} from "@remixicon/react";

/** A transaction's direction, as shown in rows and the Type filter. */
export type TransactionType = "sent" | "received" | "interacted";

const ICONS = {
  sent: RiArrowRightUpLongFill,
  received: RiArrowLeftDownLongFill,
  interacted: RiExpandDiagonalFill,
} as const;

/**
 * The one icon for each transaction type, used everywhere a type is shown:
 * sent ↗, received ↙, interacted (both directions) ⤢.
 */
export function transactionTypeIcon(
  type: TransactionType,
  { size = 16, muted = false }: { size?: number; muted?: boolean } = {},
): ReactElement {
  const Icon = ICONS[type];
  return <Icon size={size} className={muted ? "text-[var(--color-icon-muted)]" : undefined} />;
}
