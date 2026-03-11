import {
  ComposedChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Legend,
} from 'recharts';
import { COLORS } from '../../constants/colors.js';

function PositionTooltip({ active, payload, label }) {
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
          <span className="tooltip-value">${Number(entry.value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      ))}
    </div>
  );
}

export default function PositionValueChart({ data, params }) {
  const initial = params.initialInvestment;

  return (
    <div className="chart-container">
      <h3 className="chart-title">{params.tokenA}/{params.tokenB} Portfolio Value Over Time ($)</h3>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
          <XAxis
            dataKey="day"
            stroke={COLORS.textDim}
            tick={{ fontSize: 12 }}
            label={{ value: 'Day', position: 'insideBottomRight', offset: -5, fill: COLORS.textDim }}
          />
          <YAxis
            stroke={COLORS.textDim}
            tick={{ fontSize: 12 }}
            tickFormatter={(v) => `$${v.toLocaleString()}`}
          />
          <Tooltip content={<PositionTooltip />} />
          <ReferenceLine
            y={initial}
            stroke={COLORS.textDim}
            strokeDasharray="3 3"
            label={{ value: 'Entry', position: 'insideTopRight', fill: COLORS.textDim, fontSize: 11 }}
          />
          <Line
            type="monotone"
            dataKey="omniNetValue"
            name="Omnipair GAMM"
            stroke={COLORS.omnipair}
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="raydiumNetValue"
            name="Raydium CPMM"
            stroke={COLORS.raydium}
            strokeWidth={2}
            dot={false}
            strokeDasharray="6 4"
          />
          <Line
            type="monotone"
            dataKey="holdValue"
            name="50/50 Hold"
            stroke={COLORS.advantage}
            strokeWidth={2}
            dot={false}
            strokeDasharray="3 3"
          />
          <Legend wrapperStyle={{ color: COLORS.text, fontSize: 12, paddingTop: 8 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
