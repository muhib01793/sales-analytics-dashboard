import { memo } from 'react';

function StatCard({ label, value, hint, accent = 'blue' }) {
  return (
    <article className={`stat-card stat-card--${accent}`}>
      <p className="stat-card__label">{label}</p>
      <p className="stat-card__value">{value}</p>
      {hint && <p className="stat-card__hint">{hint}</p>}
    </article>
  );
}

// Memoized so unrelated state changes (for example table paging) don't re-render every card.
export default memo(StatCard);
