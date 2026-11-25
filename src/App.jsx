import { useCallback, useMemo, useState } from 'react';
import useOrders from './hooks/useOrders.js';
import useDebouncedValue from './hooks/useDebouncedValue.js';
import FiltersBar from './components/FiltersBar.jsx';
import StatCard from './components/StatCard.jsx';
import Panel from './components/Panel.jsx';
import OrdersSection from './components/OrdersSection.jsx';
import LineChart from './components/charts/LineChart.jsx';
import BarList from './components/charts/BarList.jsx';
import DonutChart from './components/charts/DonutChart.jsx';
import { EmptyState, LoadingState } from './components/States.jsx';
import { DEFAULT_FILTERS } from './utils/constants.js';
import { filterOrders } from './utils/filterOrders.js';
import {
  distinctValues,
  revenueByField,
  revenueByMonth,
  statusBreakdown,
  summarizeOrders,
} from './utils/analytics.js';
import { formatCurrency, formatDate, formatInteger, formatPercent } from './utils/format.js';

export default function App() {
  const { status, orders, error } = useOrders({ count: 5000 });
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  // Search is debounced so filtering runs after typing pauses, not on every keystroke.
  const debouncedSearch = useDebouncedValue(filters.search, 250);

  const activeFilters = useMemo(
    () => ({ ...filters, search: debouncedSearch }),
    [filters, debouncedSearch]
  );

  const handleFilterChange = useCallback((key, value) => {
    setFilters((previous) => ({ ...previous, [key]: value }));
  }, []);

  const handleReset = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  // Orders are generated in date order, so the first and last entries bound the date pickers.
  const bounds = useMemo(
    () => ({
      min: orders[0]?.date ?? '',
      max: orders[orders.length - 1]?.date ?? '',
    }),
    [orders]
  );

  const options = useMemo(
    () => ({
      regions: distinctValues(orders, 'region'),
      categories: distinctValues(orders, 'category'),
      statuses: distinctValues(orders, 'status'),
    }),
    [orders]
  );

  const filteredOrders = useMemo(
    () => filterOrders(orders, activeFilters),
    [orders, activeFilters]
  );

  const summary = useMemo(() => summarizeOrders(filteredOrders), [filteredOrders]);
  const monthlyRevenue = useMemo(() => revenueByMonth(filteredOrders), [filteredOrders]);
  const revenueByCategory = useMemo(() => revenueByField(filteredOrders, 'category'), [filteredOrders]);
  const revenueByRegion = useMemo(() => revenueByField(filteredOrders, 'region'), [filteredOrders]);
  const statusCounts = useMemo(() => statusBreakdown(filteredOrders), [filteredOrders]);

  if (status === 'loading') {
    return (
      <div className="app">
        <Header subtitle="Preparing sales data…" />
        <LoadingState />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="app">
        <Header subtitle="Something went wrong" />
        <EmptyState
          title="Could not load orders"
          message={error?.message ?? 'An unexpected error occurred while generating the dataset.'}
        />
      </div>
    );
  }

  const hasMatches = filteredOrders.length > 0;

  return (
    <div className="app">
      <Header
        subtitle={`${formatInteger(orders.length)} orders · ${formatDate(bounds.min)} – ${formatDate(bounds.max)}`}
      />

      <FiltersBar
        filters={filters}
        options={options}
        bounds={bounds}
        matchCount={filteredOrders.length}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />

      <section className="stat-grid" aria-label="Key metrics">
        <StatCard
          label="Total revenue"
          value={formatCurrency(summary.revenue)}
          hint={`${formatInteger(summary.completedOrders)} completed orders`}
          accent="blue"
        />
        <StatCard
          label="Total profit"
          value={formatCurrency(summary.profit)}
          hint={`${formatPercent(summary.margin)} margin`}
          accent="green"
        />
        <StatCard
          label="Orders"
          value={formatInteger(summary.orders)}
          hint="All statuses in current view"
          accent="violet"
        />
        <StatCard
          label="Customers"
          value={formatInteger(summary.customers)}
          hint={`${formatCurrency(summary.averageOrderValue)} avg. order value`}
          accent="amber"
        />
      </section>

      {hasMatches ? (
        <section className="chart-grid" aria-label="Charts">
          <Panel
            title="Monthly revenue"
            subtitle="Completed orders only"
            className="panel--wide"
          >
            <LineChart data={monthlyRevenue} />
          </Panel>

          <Panel title="Revenue by category" subtitle="Completed orders only">
            <BarList data={revenueByCategory} />
          </Panel>

          <Panel title="Revenue by region" subtitle="Completed orders only">
            <BarList data={revenueByRegion} />
          </Panel>

          <Panel title="Order status" subtitle="Share of matching orders">
            <DonutChart data={statusCounts} />
          </Panel>
        </section>
      ) : (
        <EmptyState
          title="No orders match these filters"
          message="Try a wider date range or clear the search text."
          actionLabel="Reset filters"
          onAction={handleReset}
        />
      )}

      <OrdersSection orders={filteredOrders} />
    </div>
  );
}

function Header({ subtitle }) {
  return (
    <header className="app-header">
      <div>
        <p className="app-header__eyebrow">Sales Analytics</p>
        <h1 className="app-header__title">Dashboard overview</h1>
        <p className="app-header__subtitle">{subtitle}</p>
      </div>
    </header>
  );
}
