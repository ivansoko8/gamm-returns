import {
  ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, ReferenceLine,
} from 'recharts';
import { COLORS } from '../../constants/colors.js';
import ChartTooltip from '../ui/Tooltip.jsx';

export default function ILChart({ data, params }) {
  return (
    <div className="chart-container">
      <h3 className="chart-title">{params.tokenA}/{params.tokenB} IL Impact vs Fee Income (%)</h3>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="gradIL" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS.il} stopOpacity={0.3} />
              <stop offset="100%" stopColor={COLORS.il} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
          <XAxis dataKey="day" stroke={COLORS.textDim} tick={{ fontSize: 12 }} />
          <YAxis
            stroke={COLORS.textDim}
            tick={{ fontSize: 12 }}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip content={<ChartTooltip formatter={(v) => `${v}%`} />} />
          <ReferenceLine y={0} stroke={COLORS.textMuted} strokeDasharray="4 4" label={{ value: 'Break-even', fill: COLORS.textDim, fontSize: 11 }} />
          <Area
            type="monotone" dataKey="ilImpact" name="IL Impact"
            stroke={COLORS.il} fill="url(#gradIL)" strokeWidth={2}
          />
          <Line
            type="monotone" dataKey="omniFeeReturn" name="OmniPair Fee Income"
            stroke={COLORS.omnipair} strokeWidth={2} dot={false}
          />
          <Line
            type="monotone" dataKey="raydiumFeeReturn" name="Raydium Fee Income"
            stroke={COLORS.raydium} strokeWidth={2} dot={false}
          />
          <Legend wrapperStyle={{ color: COLORS.text, fontSize: 12, paddingTop: 8 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
