import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface TrendDataPoint {
  wave: string;
  tom: number;
  spontaneous: number;
  aided: number;
}

interface BrandHealthTrendChartProps {
  data: TrendDataPoint[];
}

export default function BrandHealthTrendChart({ data }: BrandHealthTrendChartProps) {
  return (
    <motion.div
      className="glass-card p-6"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <h3 className="text-sm uppercase tracking-wider text-pulse-meta font-mono mb-1">Brand Health Trend</h3>
      <p className="text-xs text-pulse-meta mb-4">Awareness metrics across waves</p>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <defs>
              <linearGradient id="gradTom" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00D4FF" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#00D4FF" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradSpon" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradAided" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#94A3B8" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#94A3B8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
            <XAxis
              dataKey="wave"
              tick={{ fill: '#64748B', fontSize: 11, fontFamily: 'JetBrains Mono' }}
              axisLine={{ stroke: 'rgba(148,163,184,0.15)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#64748B', fontSize: 11, fontFamily: 'JetBrains Mono' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                background: '#1A2332',
                border: '1px solid rgba(0,212,255,0.2)',
                borderRadius: '8px',
                fontSize: '12px',
                fontFamily: 'JetBrains Mono',
              }}
              labelStyle={{ color: '#FFFFFF', marginBottom: '4px' }}
              itemStyle={{ color: '#94A3B8' }}
              formatter={(value: number) => [`${value.toFixed(1)}%`]}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono', paddingTop: '10px' }}
            />
            <Area
              type="monotone"
              dataKey="tom"
              name="TOM Awareness"
              stroke="#00D4FF"
              strokeWidth={2}
              fill="url(#gradTom)"
              animationDuration={1200}
            />
            <Area
              type="monotone"
              dataKey="spontaneous"
              name="Spontaneous"
              stroke="#F59E0B"
              strokeWidth={2}
              fill="url(#gradSpon)"
              animationDuration={1200}
              animationBegin={200}
            />
            <Area
              type="monotone"
              dataKey="aided"
              name="Aided"
              stroke="#94A3B8"
              strokeWidth={2}
              fill="url(#gradAided)"
              animationDuration={1200}
              animationBegin={400}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
