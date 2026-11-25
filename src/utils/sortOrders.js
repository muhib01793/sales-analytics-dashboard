const accessors = {
  id: (order) => order.id,
  date: (order) => order.date,
  customer: (order) => order.customerName,
  region: (order) => order.region,
  category: (order) => order.category,
  status: (order) => order.status,
  quantity: (order) => order.quantity,
  revenue: (order) => order.revenue,
  profit: (order) => order.profit,
};

/** Returns a sorted copy; the source array is never mutated. */
export function sortOrders(orders, { key, direction }) {
  const getValue = accessors[key] ?? accessors.date;
  const factor = direction === 'asc' ? 1 : -1;

  return [...orders].sort((a, b) => {
    const valueA = getValue(a);
    const valueB = getValue(b);
    if (valueA < valueB) return -1 * factor;
    if (valueA > valueB) return 1 * factor;
    return 0;
  });
}
