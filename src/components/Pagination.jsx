import { memo } from 'react';

function Pagination({ page, pageCount, totalItems, pageSize, onPageChange }) {
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <nav className="pagination" aria-label="Table pagination">
      <p className="pagination__info">
        Showing {start}–{end} of {totalItems}
      </p>
      <div className="pagination__controls">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          Previous
        </button>
        <span className="pagination__page">
          Page {page} of {pageCount}
        </span>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pageCount}
        >
          Next
        </button>
      </div>
    </nav>
  );
}

export default memo(Pagination);
