export function LoadingState() {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <div className="loading-state__grid">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="skeleton skeleton--card" />
        ))}
      </div>
      <div className="skeleton skeleton--chart" />
      <p className="loading-state__text">Loading 5,000 orders…</p>
    </div>
  );
}

export function EmptyState({ title = 'No orders found', message, onAction, actionLabel }) {
  return (
    <div className="empty-state" role="status">
      <div className="empty-state__icon" aria-hidden="true">
        ∅
      </div>
      <h3 className="empty-state__title">{title}</h3>
      <p className="empty-state__message">{message}</p>
      {onAction && (
        <button type="button" className="btn btn--primary" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
