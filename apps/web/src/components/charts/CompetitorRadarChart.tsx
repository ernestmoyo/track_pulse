import { motion } from 'framer-motion';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

interface CompetitorDataPoint {
  metric: string;
  [brandName: string]: string | number;
}

interface CompetitorRadarChartProps {
  data: CompetitorDataPoint[];
  brands: { name: string; color: string; isMain: boolean }[];
}

export default function CompetitorRadarChart({ data, brands }: CompetitorRadarChartProps) {
  return (
    <motion.div
      className="glass-card p-6"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <h3 className="text-sm uppercase tracking-wider text-pulse-meta font-mono mb-1">Competitive Landscape</h3>
      <p className="text-xs text-pulse-meta mb-4">Brand vs. top competitors</p>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="rgba(148,163,184,0.15)" />
            <PolarAngleAxis
              dataKey="metric"
              tick={{ fill: '#94A3B8', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            />
            <PolarRadiusAxis
              tick={{ fill: '#64748B', fontSize: 9 }}
              axisLine={false}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                background: '#1A2332',
                border: '1px solid rgba(0,212,255,0.2)',
                borderRadius: '8px',
                fontSize: '11px',
                fontFamily: 'JetBrains Mono',
              }}
            />
            {brands.map((brand) => (
              <Radar
                key={brand.name}
                name={brand.name}
                dataKey={brand.name}
                stroke={brand.color}
                fill={brand.color}
                fillOpacity={brand.isMain ? 0.2 : 0.05}
                strokeWidth={brand.isMain ? 2 : 1}
                animationDuration={1500}
              />
            ))}
            <Legend
              wrapperStyle={{ fontSize: '10px', fontFamily: 'JetBrains Mono', paddingTop: '8px' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
