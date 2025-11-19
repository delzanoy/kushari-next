export function formatDate (timestamp: Date) {
  const date = new Date(timestamp);
  return {
    date: date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    time: date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  };
};

export function formatCurrency(value: number): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatDollars(value: number): string {
  return Math.floor(value).toLocaleString("en-US");
}

export function formatCents(value: number): string {
  const cents = Math.round((value - Math.floor(value)) * 100);
  return cents.toString().padStart(2, '0');
}

export function formatSmallNumber(num: number): string {
  if (num === 0) return '0';

  const absNum = Math.abs(num);

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