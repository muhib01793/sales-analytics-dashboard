import { memo } from 'react';
import { formatCurrency, formatDate, formatInteger } from '../utils/format.js';

export const COLUMNS = [
  { key: 'id', label: 'Order', align: 'left' },
  { key: 'date', label: 'Date', align: 'left' },
  { key: 'customer', label: 'Customer', align: 'left' },
  { key: 'region', label: 'Region', align: 'left' },
  { key: 'category', label: 'Category', align: 'left' },
  { key: 'status', label: 'Status', align: 'left' },
  { key: 'quantity', label: 'Qty', align: 'right' },
  { key: 'revenue', label: 'Revenue', align: 'right' },
  { key: 'profit', label: 'Profit', align: 'right' },
];

const statusClass = (status) => `badge badge--${status.toLowerCase()}`;

function OrdersTable({ rows, sort, onSort }) {
  return (
    <div className="table-wrapper">
      <table className="orders-table">
        <thead>
          <tr>
            {COLUMNS.map((column) => {
              const isActive = sort.key === column.key;
              const ariaSort = isActive ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none';
              return (
                <th key={column.key} aria-sort={ariaSort} className={`align-${column.align}`}>
                  <button type="button" className="sort-button" onClick={() => onSort(column.key)}>
                    {column.label}
                    <span aria-hidden="true" className="sort-button__icon">
                      {isActive ? (sort.direction === 'asc' ? '▲' : '▼') : '↕'}
                    </span>
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((order) => (
            <tr key={order.id}>
              <td className="mono">{order.id}</td>
              <td>{formatDate(order.date)}</td>
              <td>{order.customerName}</td>
              <td>{order.region}</td>
              <td>{order.category}</td>
              <td>
                <span className={statusClass(order.status)}>{order.status}</span>
              </td>
              <td className="align-right">{formatInteger(order.quantity)}</td>
              <td className="align-right">{formatCurrency(order.revenue)}</td>
              <td className={`align-right ${order.profit < 0 ? 'negative' : ''}`.trim()}>
                {formatCurrency(order.profit)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default memo(OrdersTable);
