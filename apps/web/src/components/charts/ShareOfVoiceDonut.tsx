import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface SovDataPoint {
  name: string;
  value: number;
}

interface ShareOfVoiceDonutProps {
  data: SovDataPoint[];
}

const COLORS = ['#00D4FF', '#F59E0B', '#8B5EA6', '#57B9A5', '#EF4444', '#94A3B8'];

export default function ShareOfVoiceDonut({ data }: ShareOfVoiceDonutProps) {
  return (
    <motion.div
      className="glass-card p-6"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.7 }}
    >
      <h3 className="text-sm uppercase tracking-wider text-pulse-meta font-mono mb-1">Share of Voice</h3>
      <p className="text-xs text-pulse-meta mb-4">Advertising SOV among competitors</p>

      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              dataKey="value"
              animationDuration={1200}
              stroke="none"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: '#1A2332',
                border: '1px solid rgba(0,212,255,0.2)',
                borderRadius: '8px',
                fontSize: '11px',
                fontFamily: 'JetBrains Mono',
              }}
              formatter={(value: number) => [`${value.toFixed(1)}%`]}
            />
            <Legend
              wrapperStyle={{ fontSize: '10px', fontFamily: 'JetBrains Mono' }}
              formatter={(value) => <span style={{ color: '#94A3B8' }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
