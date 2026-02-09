import { COLORS } from '../../constants/colors.js';

export default function ChartTooltip({ active, payload, label, formatter }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="chart-tooltip">
      <div className="tooltip-label">Day {label}</div>
      {payload.map((entry, i) => (
        <div key={i} className="tooltip-row">
          <span
            className="tooltip-dot"
            style={{ backgroundColor: entry.color || entry.stroke }}
          />
          <span className="tooltip-name">{entry.name}</span>
          <span className="tooltip-value">
            {formatter ? formatter(entry.value, entry.name) : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}
