import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import SignificanceBadge from '@/components/ui/SignificanceBadge';

const funnelData = [
  { stage: 'TOM Awareness', value: 46.5, prev: 44.8, color: '#00D4FF' },
  { stage: 'Spontaneous', value: 72.4, prev: 70.8, color: '#00BCD4' },
  { stage: 'Aided', value: 94.2, prev: 93.1, color: '#0097A7' },
  { stage: 'Consideration', value: 58.4, prev: 56.9, color: '#00838F' },
  { stage: 'Trial', value: 51.3, prev: 49.8, color: '#006064' },
  { stage: 'Regular Use', value: 34.1, prev: 32.9, color: '#004D40' },
];

const demographicBreakdown = [
  { group: 'Male', tom: 44.2, spon: 70.5, aided: 93.8 },
  { group: 'Female', tom: 48.8, spon: 74.3, aided: 94.6 },
  { group: '18-24', tom: 38.5, spon: 65.2, aided: 91.5 },
  { group: '25-34', tom: 52.1, spon: 76.8, aided: 95.2 },
  { group: '35-44', tom: 49.3, spon: 74.1, aided: 94.8 },
  { group: '45-54', tom: 43.8, spon: 71.2, aided: 93.5 },
  { group: '55+', tom: 41.2, spon: 68.5, aided: 92.1 },
];

export default function AwarenessTab() {
  return (
    <div className="space-y-6">
      {/* Funnel Visualization */}
      <motion.div className="glass-card p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h3 className="text-sm uppercase tracking-wider text-pulse-meta font-mono mb-1">Awareness Funnel</h3>
        <p className="text-xs text-pulse-meta mb-6">TOM → Spontaneous → Aided → Consideration → Trial → Regular Use</p>

        <div className="space-y-3">
          {funnelData.map((item, i) => {
            const delta = item.value - item.prev;
            return (
              <motion.div
                key={item.stage}
                className="flex items-center gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <span className="w-32 text-xs text-pulse-body text-right flex-shrink-0">{item.stage}</span>
                <div className="flex-1 h-8 bg-[rgba(0,212,255,0.05)] rounded overflow-hidden relative">
                  <motion.div
                    className="h-full rounded flex items-center px-3"
                    style={{ backgroundColor: item.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                  >
                    <span className="text-xs font-mono text-white font-medium">{item.value}%</span>
                  </motion.div>
                </div>
                <div className="w-24 flex-shrink-0">
                  <SignificanceBadge
                    direction={delta > 0 ? 'up' : delta < 0 ? 'down' : 'neutral'}
                    value={delta}
                    significant={Math.abs(delta) > 1}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Demographic Breakdown */}
      <motion.div
        className="glass-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-sm uppercase tracking-wider text-pulse-meta font-mono mb-1">Demographic Breakdown</h3>
        <p className="text-xs text-pulse-meta mb-4">Awareness metrics by segment — Q2-2024</p>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={demographicBreakdown} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
              <XAxis dataKey="group" tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ background: '#1A2332', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '8px', fontSize: '11px', fontFamily: 'JetBrains Mono' }}
                formatter={(v: number) => [`${v}%`]}
              />
              <Bar dataKey="tom" name="TOM" fill="#00D4FF" radius={[2, 2, 0, 0]} animationDuration={1200}>
                {demographicBreakdown.map((_, i) => <Cell key={i} fill="#00D4FF" />)}
              </Bar>
              <Bar dataKey="spon" name="Spontaneous" fill="#F59E0B" radius={[2, 2, 0, 0]} animationDuration={1200} />
              <Bar dataKey="aided" name="Aided" fill="#94A3B8" radius={[2, 2, 0, 0]} animationDuration={1200} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
