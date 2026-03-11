import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { COLORS } from '../../constants/colors.js';
import ChartTooltip from '../ui/Tooltip.jsx';

export default function APRChart({ data, params }) {
  // Sample at regular intervals for bar chart
  const totalDays = data.length - 1;
  const intervals = [7, 14, 30, 60, 90, 180, 365].filter((d) => d <= totalDays);
  if (!intervals.includes(totalDays) && totalDays > 0) {
    intervals.push(totalDays);
  }

  const barData = intervals.map((day) => {
    const point = data[day];
    return {
      label: `Day ${day}`,
      omniAPR: point?.omniAPR || 0,
      raydiumAPR: point?.raydiumAPR || 0,
    };
  });

  return (
    <div className="chart-container">
      <h3 className="chart-title">{params.tokenA}/{params.tokenB} Annualized APR at Intervals (%)</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={barData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
          <XAxis dataKey="label" stroke={COLORS.textDim} tick={{ fontSize: 12 }} />
          <YAxis
            stroke={COLORS.textDim}
            tick={{ fontSize: 12 }}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip content={<ChartTooltip formatter={(v) => `${v}%`} />} />
          <Bar dataKey="omniAPR" name="Omnipair APR (all sources)" fill={COLORS.omnipair} radius={[4, 4, 0, 0]} />
          <Bar dataKey="raydiumAPR" name="Raydium APR (swap only)" fill={COLORS.raydium} radius={[4, 4, 0, 0]} />
          <Legend wrapperStyle={{ color: COLORS.text, fontSize: 12, paddingTop: 8 }} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
