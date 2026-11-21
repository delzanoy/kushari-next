/**
 * Formats a number as USD dollars (integer part).
 * Example: 1234.56 -> "1,234"
 */
export function formatDollars(value: number): string {
  return Math.floor(Math.abs(value)).toLocaleString("en-US");
}

/**
 * Returns the cents part of a number as a 2-digit string.
 * Example: 1234.56 -> "56"
 */
export function formatCents(value: number): string {
  const parts = Math.abs(value).toFixed(2).split(".");
  return parts.length > 1 ? parts[1] : "00";
}

/**
 * Formats a number as a percentage string with 2 decimal places.
 * Example: 1.234 -> "1.23"
 */
export function formatPercent(value: number): string {
  return Math.abs(value).toFixed(2);
}
