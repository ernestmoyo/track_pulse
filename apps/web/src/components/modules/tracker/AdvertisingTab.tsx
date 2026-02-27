import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const adRecallData = [
  { medium: 'TV', 'Jungle Oats': 28.5, 'Weet-Bix': 15.2, "Kellogg's": 8.5 },
  { medium: 'Radio', 'Jungle Oats': 18.3, 'Weet-Bix': 12.1, "Kellogg's": 9.8 },
  { medium: 'Billboard', 'Jungle Oats': 12.5, 'Weet-Bix': 8.3, "Kellogg's": 5.2 },
  { medium: 'Digital', 'Jungle Oats': 15.8, 'Weet-Bix': 10.5, "Kellogg's": 7.1 },
  { medium: 'Social', 'Jungle Oats': 22.1, 'Weet-Bix': 14.8, "Kellogg's": 11.5 },
];

const sovData = [
  { brand: 'Jungle Oats', sov: 36.2, color: '#00D4FF' },
  { brand: 'Weet-Bix', sov: 24.5, color: '#F59E0B' },
  { brand: "Kellogg's", sov: 19.1, color: '#8B5EA6' },
  { brand: 'ProNutro', sov: 12.1, color: '#57B9A5' },
  { brand: 'Future Life', sov: 8.1, color: '#EF4444' },
];

const spotInventory = [
  { campaign: 'Start Strong', medium: 'TV', months: 'Apr-May', channel: 'SABC1', recall: 28.5 },
  { campaign: 'Start Strong', medium: 'Radio', months: 'Apr-Jun', channel: 'Metro FM', recall: 18.3 },
  { campaign: 'Morning Energy', medium: 'Digital', months: 'May-Jun', channel: 'Facebook/Instagram', recall: 22.1 },
  { campaign: 'Outdoor Push', medium: 'Billboard', months: 'Apr-Jun', channel: 'Primedia Outdoor', recall: 12.5 },
];

export default function AdvertisingTab() {
  return (
    <div className="space-y-6">
      {/* Ad Recall by Medium */}
      <motion.div className="glass-card p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h3 className="text-sm uppercase tracking-wider text-pulse-meta font-mono mb-1">Ad Recall by Medium</h3>
        <p className="text-xs text-pulse-meta mb-4">Brand vs competitors across channels</p>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={adRecallData} barGap={1}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
              <XAxis dataKey="medium" tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={{ background: '#1A2332', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '8px', fontSize: '11px', fontFamily: 'JetBrains Mono' }} formatter={(v: number) => [`${v}%`]} />
              <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'JetBrains Mono' }} />
              <Bar dataKey="Jungle Oats" fill="#00D4FF" radius={[2, 2, 0, 0]} animationDuration={1200} />
              <Bar dataKey="Weet-Bix" fill="#F59E0B" radius={[2, 2, 0, 0]} animationDuration={1200} />
              <Bar dataKey="Kellogg's" fill="#8B5EA6" radius={[2, 2, 0, 0]} animationDuration={1200} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SOV Bar Chart */}
        <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h3 className="text-sm uppercase tracking-wider text-pulse-meta font-mono mb-4">Share of Voice</h3>
          <div className="space-y-3">
            {sovData.map((item, i) => (
              <motion.div
                key={item.brand}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
              >
                <span className="w-24 text-xs text-pulse-body flex-shrink-0">{item.brand}</span>
                <div className="flex-1 h-6 bg-[rgba(0,212,255,0.05)] rounded overflow-hidden">
                  <motion.div
                    className="h-full rounded flex items-center px-2"
                    style={{ backgroundColor: item.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.sov}%` }}
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.08 }}
                  >
                    <span className="text-[10px] font-mono text-white">{item.sov}%</span>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Spot Inventory Table */}
        <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h3 className="text-sm uppercase tracking-wider text-pulse-meta font-mono mb-4">Spot Inventory</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[rgba(0,212,255,0.1)]">
                  <th className="text-left py-2 text-pulse-meta font-mono font-medium">Campaign</th>
                  <th className="text-left py-2 text-pulse-meta font-mono font-medium">Medium</th>
                  <th className="text-left py-2 text-pulse-meta font-mono font-medium">Months</th>
                  <th className="text-right py-2 text-pulse-meta font-mono font-medium">Recall %</th>
                </tr>
              </thead>
              <tbody>
                {spotInventory.map((spot, i) => (
                  <tr key={i} className="border-b border-[rgba(148,163,184,0.05)]">
                    <td className="py-2 text-pulse-body">{spot.campaign}</td>
                    <td className="py-2 text-pulse-meta">{spot.medium}</td>
                    <td className="py-2 text-pulse-meta">{spot.months}</td>
                    <td className="py-2 text-right font-mono text-pulse-cyan">{spot.recall}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
