# Project Documentation: Sales Analytics Dashboard

## 1. Purpose and Scope

This is a frontend-only analytics dashboard. It demonstrates how to structure a data-heavy React screen (5,000 records) so that it stays responsive. The project covers filtering, aggregation, charting, sorting, and pagination without a backend. The data is generated locally, which keeps the focus on React architecture.

## 2. Architecture Overview

The app follows a unidirectional data flow with three layers:

| Layer | Location | Responsibility |
| --- | --- | --- |
| Data | `src/data`, `src/hooks/useOrders.js` | Produce and load the raw order list |
| Logic | `src/utils` | Pure functions: filter, sort, aggregate, format |
| Presentation | `src/components`, `src/App.jsx` | Render UI and forward user events |

Pure functions in `src/utils` have no React dependencies. They can be tested in Node, and components stay small.

## 3. State Ownership

State is kept at the lowest level that needs it:

- **`App`** owns `filters`, which are shared by the filter bar, stats, charts, and table.
- **`OrdersSection`** owns `sort` and `page`. Changing these does not re-render the charts or stat cards.
- **`useOrders`** owns the load lifecycle (`loading`, `success`, `error`).
- **`useDebouncedValue`** holds the delayed copy of the search string.

## 4. Data Pipeline

```
generateOrders(5000)            (once, on mount)
   │
   ▼
orders  ──► filterOrders(activeFilters)  ──► filteredOrders
                                              │
             ┌────────────────────────────────┼──────────────────────────┐
             ▼                                ▼                          ▼
   summarizeOrders          revenueByMonth / revenueByField /      OrdersSection
   (stat cards)             statusBreakdown (charts)               sortOrders → slice → table
```

Dates are stored as `YYYY-MM-DD` strings. Because this format sorts lexically in chronological order, date range checks use plain string comparison. This avoids timezone problems that `Date` objects can cause.

## 5. Performance Decisions

1. **Memoized derived data.** `filteredOrders`, the summary, each chart dataset, and the sorted list are each wrapped in `useMemo`. Their dependencies are the minimum set needed.
2. **`React.memo` on presentational components.** `StatCard`, `FiltersBar`, `OrdersTable`, `Pagination`, `OrdersSection`, `LineChart`, `BarList`, and `DonutChart` skip re-renders when their props are shallowly equal. `Panel` and `States` are plain components because they are cheap and receive children.
3. **Stable callbacks.** `handleFilterChange`, `handleReset`, `handleSort`, and `handlePageChange` use `useCallback`, so memoized children receive the same function references.
4. **Pagination instead of rendering 5,000 rows.** The table renders 15 rows at a time. The sort runs on the filtered array, which is cheap at this size.
5. **Debounced search.** Typing triggers filtering only after 250 ms of inactivity.
6. **Single-pass aggregation.** `summarizeOrders` loops once and uses a `Set` for unique customers.

Per-category and per-region charts are built with HTML and CSS bars rather than SVG. This keeps the DOM small and avoids a chart dependency.

## 6. Key Code Decisions

- **Revenue counts completed orders only.** Pending, cancelled, and returned orders would inflate revenue, so they are excluded from revenue, profit, and charts. Order and customer counts include all statuses. The UI labels this explicitly.
- **Reset returns the page to 1.** `OrdersSection` resets the page whenever its incoming list changes, so the user never lands on an empty page after filtering.
- **Page clamping.** The current page is `Math.min(page, pageCount)`, which guards against stale page numbers.
- **Accessible sorting.** Sort headers are real `<button>` elements inside `<th>` cells, with `aria-sort` set on the active column.
- **SVG charts have accessible labels.** Each `role="img"` SVG has an `aria-label`, and data points include `<title>` tooltips.
- **Reduced-motion support.** Transitions and animations are shortened when the user prefers reduced motion.

## 7. Styling

All colors, radii, and shadows are CSS custom properties in `src/styles/global.css`. Layout uses CSS Grid. Breakpoints are at 1100 px, 800 px, and 560 px:

- At 1100 px, stat cards move to two columns.
- At 800 px, charts stack to one column.
- At 560 px, filters become two columns and stat cards become one column.

The table has a minimum width and scrolls horizontally inside its wrapper on small screens.

## 8. Testing Notes

Checks performed during development:

- **Logic checks (Node):** deterministic generation, date-ordering, unique IDs, profit = revenue − cost, date range and search filters, combined filters, summary totals against a manual sum, monthly and category totals, status totals, sort direction, and non-mutating sort.
- **Syntax and import checks:** all source files were parsed with the TypeScript transpiler in JSX mode, and every relative import was confirmed to resolve.

Not yet performed in this environment:

- `npm install` and `npm run build`, because package installation is blocked in this session.
- Browser testing of rendering, responsive layout, and interactions.

Run `npm install && npm run build` locally to complete verification.

## 9. Known Limitations

- The data is randomly generated, so the figures are illustrative and do not reflect a real business.
- There is no persistence. Filters reset on page reload.
- Charts show monthly data for up to 24 months. Very long ranges would need downsampling.
- The loading delay (600 ms) is simulated.

## 10. Possible Extensions

- Add a server-backed data source behind the `useOrders` hook without changing the components.
- Add URL query parameters for filters so views can be shared.
- Add virtualization if the row count grows beyond a few thousand per page.
