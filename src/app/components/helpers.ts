// export function formatDate (timestamp: Date) {
//   const date = new Date(timestamp);
//   return {
//     date: date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
//     time: date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
//   };
// };

// export function formatCurrency(value: number): string {
//   return value.toLocaleString("en-US", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   });
// }

// export function formatDollars(value: number): string {
//   return Math.floor(value).toLocaleString("en-US");
// }

// export function formatCents(value: number): string {
//   const cents = Math.round((value - Math.floor(value)) * 100);
//   return cents.toString().padStart(2, '0');
// }

// export function formatSmallNumber(num: number): string {
//   if (num === 0) return '0';

//   // Find the first non-zero digit after decimal
//   const str = num.toString();
//   const decimalPart = str.split('.')[1] || '';

//   let firstNonZeroIndex = -1;
//   for (let i = 0; i < decimalPart.length; i++) {
//     if (decimalPart[i] !== '0') {
//       firstNonZeroIndex = i;
//       break;
//     }
//   }

//   if (firstNonZeroIndex === -1) return '0'; // All zeros

//   // Round to the position of the first non-zero +1 for rounding
//   const precision = firstNonZeroIndex + 1;
//   const formatted = num.toFixed(precision);

//   // Remove trailing zeros if any after rounding
//   return formatted.replace(/\.?0+$/, '');
// }

/**
 * Date and time formatting utilities
 */
export function formatDate(timestamp: Date | string | number | undefined | null) {
  if (timestamp == null) {
    return {
      date: 'Invalid Date',
      time: '--:--'
    };
  }
  
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return {
        date: 'Invalid Date',
        time: '--:--'
      };
    }
    
    return {
      date: date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      time: date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    };
  } catch (error) {
    return {
      date: 'Invalid Date',
      time: '--:--'
    };
  }
}

/**
 * Currency formatting utilities
 */
export function formatCurrency(value: number | undefined | null): string {
  if (value == null || isNaN(value)) return '0.00';
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatDollars(value: number | undefined | null): string {
  if (value == null || isNaN(value)) return '0';
  return Math.floor(value).toLocaleString("en-US");
}

export function formatCents(value: number | undefined | null): string {
  if (value == null || isNaN(value)) return '00';
  const cents = Math.round((value - Math.floor(value)) * 100);
  return cents.toString().padStart(2, '0');
}

/**
 * Format very small numbers intelligently
 * Shows meaningful precision for numbers like 0.000123
 */
export function formatSmallNumber(num: number | undefined | null): string {
  if (num == null || isNaN(num) || num === 0) return '0';
  
  // Find the first non-zero digit after decimal
  const str = num.toString();
  const decimalPart = str.split('.')[1] || '';
  
  let firstNonZeroIndex = -1;
  for (let i = 0; i < decimalPart.length; i++) {
    if (decimalPart[i] !== '0') {
      firstNonZeroIndex = i;
      break;
    }
  }
  
  if (firstNonZeroIndex === -1) return '0'; // All zeros
  
  // Round to the position of the first non-zero +1 for rounding
  const precision = firstNonZeroIndex + 1;
  const formatted = num.toFixed(precision);
  
  // Remove trailing zeros if any after rounding
  return formatted.replace(/\.?0+$/, '');
}

/**
 * Format a full currency amount with dollars and cents split
 * Returns an object with separate dollar and cent strings
 */
export function formatCurrencySplit(value: number | undefined | null): { dollars: string; cents: string } {
  return {
    dollars: formatDollars(value),
    cents: formatCents(value)
  };
}

/**
 * Format percentage with specified decimal places
 */
export function formatPercentage(value: number | undefined | null, decimals: number = 2): string {
  if (value == null || isNaN(value)) return '0%';
  return value.toFixed(decimals) + '%';
}

/**
 * Format large numbers with K, M, B abbreviations
 * Example: 1,234,567 -> "1.23M"
 */
export function formatCompactNumber(num: number | undefined | null, decimals: number = 2): string {
  if (num == null || isNaN(num) || num === 0) return '0';
  
  const abs = Math.abs(num);
  const sign = num < 0 ? '-' : '';
  
  if (abs >= 1e9) {
    return sign + (abs / 1e9).toFixed(decimals) + 'B';
  } else if (abs >= 1e6) {
    return sign + (abs / 1e6).toFixed(decimals) + 'M';
  } else if (abs >= 1e3) {
    return sign + (abs / 1e3).toFixed(decimals) + 'K';
  }
  
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals
  });
}

/**
 * Truncate wallet/address hash for display
 * Example: "0x1234567890abcdef..." -> "0x1234...cdef"
 */
export function truncateHash(hash: string, startChars: number = 6, endChars: number = 4): string {
  if (hash.length <= startChars + endChars) {
    return hash;
  }
  return `${hash.slice(0, startChars)}...${hash.slice(-endChars)}`;
}

/**
 * Format a timestamp as "X time ago"
 */
export function formatTimeAgo(timestamp: Date | string | number | undefined | null): string {
  if (timestamp == null) return 'unknown';
  
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return 'unknown';
    
    const now = new Date();
    const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (secondsAgo < 60) return 'just now';
    if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)}m ago`;
    if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)}h ago`;
    if (secondsAgo < 604800) return `${Math.floor(secondsAgo / 86400)}d ago`;
    if (secondsAgo < 2592000) return `${Math.floor(secondsAgo / 604800)}w ago`;
    if (secondsAgo < 31536000) return `${Math.floor(secondsAgo / 2592000)}mo ago`;
    return `${Math.floor(secondsAgo / 31536000)}y ago`;
  } catch (error) {
    return 'unknown';
  }
}

/**
 * Type guard to check if a value is a valid number
 */
export function isValidNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

/**
 * Safely format a number, returning fallback if invalid
 */
export function safeFormatNumber(
  value: unknown, 
  formatter: (num: number) => string,
  fallback: string = '0'
): string {
  return isValidNumber(value) ? formatter(value) : fallback;
}