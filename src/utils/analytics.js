/**
 * Pure aggregation helpers. Revenue and profit count completed orders only;
 * order and customer counts include every matching order.
 */

const COMPLETED = 'Completed';

const round2 = (value) => Math.round(value * 100) / 100;

export function summarizeOrders(orders) {
  let revenue = 0;
  let profit = 0;
  let completedOrders = 0;
  const customers = new Set();

  for (const order of orders) {
    customers.add(order.customerId);
    if (order.status === COMPLETED) {
      revenue += order.revenue;
      profit += order.profit;
      completedOrders += 1;
    }
  }

  return {
    revenue: round2(revenue),
    profit: round2(profit),
    orders: orders.length,
    completedOrders,
    customers: customers.size,
    margin: revenue > 0 ? profit / revenue : 0,
    averageOrderValue: completedOrders > 0 ? revenue / completedOrders : 0,
  };
}

/** Completed revenue per calendar month, ascending by month. */
export function revenueByMonth(orders) {
  const totals = new Map();

  for (const order of orders) {
    if (order.status !== COMPLETED) continue;
    const key = order.date.slice(0, 7);
    totals.set(key, (totals.get(key) ?? 0) + order.revenue);
  }

  return [...totals.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, revenue]) => ({ month, revenue: round2(revenue) }));
}

/** Completed revenue grouped by a field, sorted highest first. */
export function revenueByField(orders, field) {
  const totals = new Map();

  for (const order of orders) {
    if (order.status !== COMPLETED) continue;
    const label = order[field];
    totals.set(label, (totals.get(label) ?? 0) + order.revenue);
  }

  return [...totals.entries()]
    .map(([label, revenue]) => ({ label, revenue: round2(revenue) }))
    .sort((a, b) => b.revenue - a.revenue);
}

/** Order count per status, for the status donut. */
export function statusBreakdown(orders) {
  const counts = new Map();

  for (const order of orders) {
    counts.set(order.status, (counts.get(order.status) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([status, count]) => ({ status, count }))
    .sort((a, b) => b.count - a.count);
}

/** Distinct values for filter dropdowns, sorted alphabetically. */
export function distinctValues(orders, field) {
  return [...new Set(orders.map((order) => order[field]))].sort((a, b) => a.localeCompare(b));
}
