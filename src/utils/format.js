const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const compactCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
});

const integerFormatter = new Intl.NumberFormat('en-US');

export const formatCurrency = (value) => currencyFormatter.format(value);

export const formatCompactCurrency = (value) => compactCurrencyFormatter.format(value);

export const formatInteger = (value) => integerFormatter.format(value);

export const formatPercent = (value) => `${(value * 100).toFixed(1)}%`;

/** "2025-03" -> "Mar 25" */
export function formatMonth(monthKey) {
  const [year, month] = monthKey.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString('en-US', {
    month: 'short',
    year: '2-digit',
    timeZone: 'UTC',
  });
}

/** "2025-03-14" -> "Mar 14, 2025" */
export function formatDate(isoDate) {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
