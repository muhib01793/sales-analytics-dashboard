export const ALL = 'all';

export const DEFAULT_FILTERS = Object.freeze({
  search: '',
  dateFrom: '',
  dateTo: '',
  region: ALL,
  category: ALL,
  status: ALL,
});

export const STATUS_COLORS = Object.freeze({
  Completed: 'var(--chart-1)',
  Pending: 'var(--chart-3)',
  Cancelled: 'var(--chart-4)',
  Returned: 'var(--chart-5)',
});

export const PAGE_SIZE = 15;
