import { memo } from 'react';
import { formatCompactCurrency, formatCurrency } from '../../utils/format.js';

/** Horizontal bar list built with HTML and CSS, so it scales naturally on small screens. */
function BarList({ data, valueFormatter = formatCurrency, compactFormatter = formatCompactCurrency }) {
  const maxValue = Math.max(...data.map((item) => item.revenue), 1);

  return (
    <ul className="bar-list">
      {data.map((item) => {
        const percent = (item.revenue / maxValue) * 100;
        return (
          <li key={item.label} className="bar-list__item">
            <div className="bar-list__meta">
              <span className="bar-list__label">{item.label}</span>
              <span className="bar-list__value" title={valueFormatter(item.revenue)}>
                {compactFormatter(item.revenue)}
              </span>
            </div>
            <div className="bar-list__track" role="presentation">
              <div className="bar-list__fill" style={{ width: `${percent}%` }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default memo(BarList);
