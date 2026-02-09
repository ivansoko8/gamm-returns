import {
  ComposedChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Legend,
} from 'recharts';
import { COLORS } from '../../constants/colors.js';
import ChartTooltip from '../ui/Tooltip.jsx';

export default function ReturnsChart({ data, params }) {
  return (
    <div className="chart-container">
      <h3 className="chart-title">{params.tokenA}/{params.tokenB} Net LP Returns (%)</h3>
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
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip content={<ChartTooltip formatter={(v) => `${v}%`} />} />
          <ReferenceLine y={0} stroke={COLORS.textDim} strokeDasharray="3 3" />
          <Line
            type="monotone"
            dataKey="omniReturn"
            name="OmniPair GAMM Net Return"
            stroke={COLORS.omnipair}
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="raydiumReturn"
            name="Raydium CPMM Net Return"
            stroke={COLORS.raydium}
            strokeWidth={2.5}
            dot={false}
          />
          <Legend
            wrapperStyle={{ color: COLORS.text, fontSize: 12, paddingTop: 8 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
