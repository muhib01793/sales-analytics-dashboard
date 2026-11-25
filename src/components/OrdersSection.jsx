import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import Panel from './Panel.jsx';
import OrdersTable from './OrdersTable.jsx';
import Pagination from './Pagination.jsx';
import { EmptyState } from './States.jsx';
import { PAGE_SIZE } from '../utils/constants.js';
import { sortOrders } from '../utils/sortOrders.js';

/**
 * Owns table-only state (sorting and paging) so that changing a sort or page
 * does not re-render the charts or stat cards in the parent.
 */
function OrdersSection({ orders }) {
  const [sort, setSort] = useState({ key: 'date', direction: 'desc' });
  const [page, setPage] = useState(1);

  const sortedOrders = useMemo(() => sortOrders(orders, sort), [orders, sort]);

  const pageCount = Math.max(1, Math.ceil(sortedOrders.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);

  const pageRows = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return sortedOrders.slice(startIndex, startIndex + PAGE_SIZE);
  }, [sortedOrders, currentPage]);

  // When the incoming filtered list changes, return to the first page.
  useEffect(() => {
    setPage(1);
  }, [orders]);

  const handleSort = useCallback((key) => {
    setSort((previous) => {
      if (previous.key === key) {
        return { key, direction: previous.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: key === 'date' ? 'desc' : 'asc' };
    });
  }, []);

  const handlePageChange = useCallback(
    (nextPage) => setPage(Math.min(Math.max(nextPage, 1), pageCount)),
    [pageCount]
  );

  return (
    <Panel
      title="Orders"
      subtitle="Click a column header to sort. Results are paginated for performance."
    >
      {orders.length === 0 ? (
        <EmptyState
          title="No orders to show"
          message="Adjust or reset your filters to see matching orders."
        />
      ) : (
        <>
          <OrdersTable rows={pageRows} sort={sort} onSort={handleSort} />
          <Pagination
            page={currentPage}
            pageCount={pageCount}
            totalItems={sortedOrders.length}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </Panel>
  );
}

export default memo(OrdersSection);
