import type { SimpleIcon } from "simple-icons";
import { cn } from "@/lib/utils";

interface BlockchainIconProps {
  /** A `simple-icons` icon object — provides the SVG path and official brand hex */
  icon: SimpleIcon;
  /** Override the brand background color (hex string, e.g. "#FF6B00") */
  color?: string;
  /** Overall size in px for both width and height. Default 36. */
  size?: number;
  className?: string;
}

/**
 * Renders a blockchain / network logo inside a squircle badge.
 * Background is the network's official brand color; the icon is white.
 *
 * Usage:
 *   import { siEthereum } from "simple-icons";
 *   <BlockchainIcon icon={siEthereum} />
 *   <BlockchainIcon icon={siEthereum} size={24} />
 *   <BlockchainIcon icon={siEthereum} color="#627EEA" />  // color override
 */
export function BlockchainIcon({
  icon,
  color,
  size = 36,
  className,
}: BlockchainIconProps) {
  const bg = color ?? `#${icon.hex}`;
  const iconSize = Math.round(size * 0.55);

  return (
    <div
      className={cn("inline-flex shrink-0 items-center justify-center", className)}
      style={{
        width: size,
        height: size,
        backgroundColor: bg,
        borderRadius: "26%",
      }}
      role="img"
      aria-label={icon.title}
    >
      <svg
        viewBox="0 0 24 24"
        fill="white"
        width={iconSize}
        height={iconSize}
        aria-hidden="true"
      >
        <path d={icon.path} />
      </svg>
    </div>
  );
}
