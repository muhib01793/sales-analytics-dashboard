import { ALL } from './constants.js';

/**
 * Applies date range, dropdown, and text filters to the order list.
 * Dates are ISO strings (YYYY-MM-DD), so plain string comparison is correct.
 */
export function filterOrders(orders, { search, dateFrom, dateTo, region, category, status }) {
  const query = search.trim().toLowerCase();

  return orders.filter((order) => {
    if (dateFrom && order.date < dateFrom) return false;
    if (dateTo && order.date > dateTo) return false;
    if (region !== ALL && order.region !== region) return false;
    if (category !== ALL && order.category !== category) return false;
    if (status !== ALL && order.status !== status) return false;

    if (query) {
      const haystack = `${order.id} ${order.customerName} ${order.category} ${order.region}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }

    return true;
  });
}
