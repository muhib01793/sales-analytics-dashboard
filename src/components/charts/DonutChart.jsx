import { memo, useMemo } from 'react';
import { formatInteger, formatPercent } from '../../utils/format.js';
import { STATUS_COLORS } from '../../utils/constants.js';

const SIZE = 180;
const RADIUS = 66;
const STROKE = 22;
const CENTER = SIZE / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** Status breakdown donut drawn with SVG stroke-dasharray segments. */
function DonutChart({ data }) {
  const total = useMemo(() => data.reduce((sum, item) => sum + item.count, 0), [data]);

  const segments = useMemo(() => {
    let consumed = 0;
    return data.map((item) => {
      const length = total > 0 ? (item.count / total) * CIRCUMFERENCE : 0;
      const segment = {
        ...item,
        dasharray: `${length} ${CIRCUMFERENCE - length}`,
        dashoffset: -consumed,
        share: total > 0 ? item.count / total : 0,
      };
      consumed += length;
      return segment;
    });
  }, [data, total]);

  return (
    <div className="donut">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="donut__svg" role="img" aria-label="Order status breakdown">
        <circle cx={CENTER} cy={CENTER} r={RADIUS} className="donut__track" strokeWidth={STROKE} />
        {segments.map((segment) => (
          <circle
            key={segment.status}
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="none"
            style={{ stroke: STATUS_COLORS[segment.status] ?? 'var(--chart-2)' }}
            strokeWidth={STROKE}
            strokeDasharray={segment.dasharray}
            strokeDashoffset={segment.dashoffset}
            transform={`rotate(-90 ${CENTER} ${CENTER})`}
          >
            <title>{`${segment.status}: ${formatInteger(segment.count)} (${formatPercent(segment.share)})`}</title>
          </circle>
        ))}
        <text x={CENTER} y={CENTER - 2} textAnchor="middle" className="donut__total">
          {formatInteger(total)}
        </text>
        <text x={CENTER} y={CENTER + 18} textAnchor="middle" className="donut__caption">
          orders
        </text>
      </svg>

      <ul className="donut__legend">
        {segments.map((segment) => (
          <li key={segment.status}>
            <span className="donut__swatch" style={{ background: STATUS_COLORS[segment.status] }} />
            <span className="donut__legend-label">{segment.status}</span>
            <span className="donut__legend-value">
              {formatInteger(segment.count)} · {formatPercent(segment.share)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default memo(DonutChart);
