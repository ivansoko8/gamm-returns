import {
  Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, ComposedChart,
} from 'recharts';
import { COLORS } from '../../constants/colors.js';
import ChartTooltip from '../ui/Tooltip.jsx';

export default function BreakdownChart({ data, params }) {
  return (
    <div className="chart-container">
      <h3 className="chart-title">{params.tokenA}/{params.tokenB} OmniPair Revenue Streams (Cumulative $)</h3>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="gradSwap" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS.swap} stopOpacity={0.4} />
              <stop offset="100%" stopColor={COLORS.swap} stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="gradLend" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS.lending} stopOpacity={0.4} />
              <stop offset="100%" stopColor={COLORS.lending} stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="gradLiq" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS.liquidation} stopOpacity={0.4} />
              <stop offset="100%" stopColor={COLORS.liquidation} stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="gradWith" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS.withdrawal} stopOpacity={0.4} />
              <stop offset="100%" stopColor={COLORS.withdrawal} stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="gradRayBreak" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS.raydium} stopOpacity={0.15} />
              <stop offset="100%" stopColor={COLORS.raydium} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
          <XAxis
            dataKey="day"
            stroke={COLORS.textDim}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            stroke={COLORS.textDim}
            tick={{ fontSize: 12 }}
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip content={<ChartTooltip formatter={(v) => `$${v}`} />} />
          <Area
            type="monotone" dataKey="omniSwap" name="Swap Fees"
            stackId="1" stroke={COLORS.swap} fill="url(#gradSwap)" strokeWidth={1.5}
          />
          <Area
            type="monotone" dataKey="omniLending" name="Lending Interest"
            stackId="1" stroke={COLORS.lending} fill="url(#gradLend)" strokeWidth={1.5}
          />
          <Area
            type="monotone" dataKey="omniLiquidation" name="Liquidation"
            stackId="1" stroke={COLORS.liquidation} fill="url(#gradLiq)" strokeWidth={1.5}
          />
          <Area
            type="monotone" dataKey="omniWithdrawal" name="Withdrawal Fees"
            stackId="1" stroke={COLORS.withdrawal} fill="url(#gradWith)" strokeWidth={1.5}
          />
          <Area
            type="monotone" dataKey="raydiumTotalIncome" name="Raydium Total"
            stroke={COLORS.raydium} fill="url(#gradRayBreak)" strokeWidth={3}
            strokeDasharray="6 4"
          />
          <Legend wrapperStyle={{ color: COLORS.text, fontSize: 12, paddingTop: 8 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
