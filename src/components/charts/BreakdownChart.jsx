import {
  Line, LineChart, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { COLORS } from '../../constants/colors.js';

function BreakdownTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;

  const breakdown = [
    ['Swap Fees',    d.omniSwap,        COLORS.swap],
    ['Lending',      d.omniLending,     COLORS.lending],
    ['Liquidation',  d.omniLiquidation, COLORS.liquidation],
    ['Withdrawal',   d.omniWithdrawal,  COLORS.withdrawal],
  ];

  return (
    <div className="chart-tooltip">
      <div className="tooltip-label">Day {label}</div>

      <div className="tooltip-row">
        <span className="tooltip-dot" style={{ backgroundColor: COLORS.omnipair }} />
        <span className="tooltip-name">Omnipair Total</span>
        <span className="tooltip-value">${d.omniTotalIncome?.toFixed(2)}</span>
      </div>

      {breakdown.map(([name, val, color]) => (
        <div key={name} className="tooltip-row" style={{ paddingLeft: 16 }}>
          <span className="tooltip-dot" style={{ backgroundColor: color, width: 6, height: 6 }} />
          <span className="tooltip-name" style={{ fontSize: '0.68rem', color: COLORS.textDim }}>{name}</span>
          <span className="tooltip-value" style={{ fontSize: '0.68rem' }}>${val?.toFixed(2)}</span>
        </div>
      ))}

      <div className="tooltip-row" style={{ marginTop: 6 }}>
        <span className="tooltip-dot" style={{ backgroundColor: COLORS.raydium }} />
        <span className="tooltip-name">Raydium Total</span>
        <span className="tooltip-value">${d.raydiumTotalIncome?.toFixed(2)}</span>
      </div>

      <div className="tooltip-row" style={{ paddingLeft: 16 }}>
        <span className="tooltip-dot" style={{ backgroundColor: COLORS.raydium, width: 6, height: 6 }} />
        <span className="tooltip-name" style={{ fontSize: '0.68rem', color: COLORS.textDim }}>Swap Fees</span>
        <span className="tooltip-value" style={{ fontSize: '0.68rem' }}>${d.raydiumTotalIncome?.toFixed(2)}</span>
      </div>
    </div>
  );
}

export default function BreakdownChart({ data, params }) {
  return (
    <div className="chart-container">
      <h3 className="chart-title">{params.tokenA}/{params.tokenB} Revenue Breakdown (Cumulative $)</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
          <XAxis dataKey="day" stroke={COLORS.textDim} tick={{ fontSize: 12 }} />
          <YAxis stroke={COLORS.textDim} tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
          <Tooltip content={<BreakdownTooltip />} />
          <Legend wrapperStyle={{ color: COLORS.text, fontSize: 12, paddingTop: 8 }} />
          <Line
            type="monotone" dataKey="omniTotalIncome" name="Omnipair Total"
            stroke={COLORS.omnipair} strokeWidth={2} dot={false}
          />
          <Line
            type="monotone" dataKey="raydiumTotalIncome" name="Raydium Total"
            stroke={COLORS.raydium} strokeWidth={2} dot={false}
            strokeDasharray="6 4"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
