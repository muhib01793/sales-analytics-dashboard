import { memo, useMemo } from 'react';
import { formatCurrency, formatMonth } from '../../utils/format.js';

const WIDTH = 720;
const HEIGHT = 280;
const PADDING = { top: 20, right: 20, bottom: 40, left: 72 };

/** Monthly revenue line chart drawn with plain SVG. */
function LineChart({ data }) {
  const geometry = useMemo(() => {
    const innerWidth = WIDTH - PADDING.left - PADDING.right;
    const innerHeight = HEIGHT - PADDING.top - PADDING.bottom;
    const maxValue = Math.max(...data.map((point) => point.revenue), 1);
    const baseline = PADDING.top + innerHeight;

    const xFor = (index) =>
      data.length === 1 ? PADDING.left + innerWidth / 2 : PADDING.left + (index / (data.length - 1)) * innerWidth;
    const yFor = (value) => PADDING.top + innerHeight - (value / maxValue) * innerHeight;

    const points = data.map((point, index) => ({
      ...point,
      x: xFor(index),
      y: yFor(point.revenue),
    }));

    const linePath = points
      .map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x.toFixed(1)},${point.y.toFixed(1)}`)
      .join(' ');

    const areaPath =
      points.length > 0
        ? `${linePath} L${points[points.length - 1].x.toFixed(1)},${baseline} L${points[0].x.toFixed(1)},${baseline} Z`
        : '';

    const yTicks = [0, 0.25, 0.5, 0.75, 1].map((fraction) => ({
      value: maxValue * fraction,
      y: yFor(maxValue * fraction),
    }));

    const labelStep = Math.max(1, Math.ceil(points.length / 8));

    return { points, linePath, areaPath, yTicks, baseline, labelStep };
  }, [data]);

  return (
    <svg
      className="line-chart"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label="Monthly completed revenue line chart"
    >
      {geometry.yTicks.map((tick) => (
        <g key={tick.y}>
          <line
            x1={PADDING.left}
            x2={WIDTH - PADDING.right}
            y1={tick.y}
            y2={tick.y}
            className="line-chart__grid"
          />
          <text x={PADDING.left - 10} y={tick.y + 4} textAnchor="end" className="line-chart__axis">
            {formatCurrency(tick.value)}
          </text>
        </g>
      ))}

      <path d={geometry.areaPath} className="line-chart__area" />
      <path d={geometry.linePath} className="line-chart__line" />

      {geometry.points.map((point, index) => (
        <g key={point.month}>
          <circle cx={point.x} cy={point.y} r={4} className="line-chart__dot">
            <title>{`${formatMonth(point.month)}: ${formatCurrency(point.revenue)}`}</title>
          </circle>
          {index % geometry.labelStep === 0 && (
            <text x={point.x} y={geometry.baseline + 24} textAnchor="middle" className="line-chart__axis">
              {formatMonth(point.month)}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

export default memo(LineChart);
