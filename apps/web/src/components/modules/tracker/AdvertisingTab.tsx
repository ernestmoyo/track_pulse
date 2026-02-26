import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const adRecallData = [
  { medium: 'TV', Chantecler: 28.5, Avipro: 15.2, Chantefrais: 8.5 },
  { medium: 'Radio', Chantecler: 18.3, Avipro: 12.1, Chantefrais: 9.8 },
  { medium: 'Billboard', Chantecler: 12.5, Avipro: 8.3, Chantefrais: 5.2 },
  { medium: 'Digital', Chantecler: 15.8, Avipro: 10.5, Chantefrais: 7.1 },
  { medium: 'Social', Chantecler: 22.1, Avipro: 14.8, Chantefrais: 11.5 },
];

const sovData = [
  { brand: 'Chantecler', sov: 36.2, color: '#00D4FF' },
  { brand: 'Avipro', sov: 24.5, color: '#F59E0B' },
  { brand: 'Chantefrais', sov: 19.1, color: '#8B5EA6' },
  { brand: 'Label 60', sov: 12.1, color: '#57B9A5' },
  { brand: 'Marilyn', sov: 8.1, color: '#EF4444' },
];

const spotInventory = [
  { campaign: 'Fresh is Best', medium: 'TV', months: 'Apr-May', channel: 'MBC1', recall: 28.5 },
  { campaign: 'Fresh is Best', medium: 'Radio', months: 'Apr-Jun', channel: 'Radio Plus', recall: 18.3 },
  { campaign: 'Family Quality', medium: 'Digital', months: 'May-Jun', channel: 'Facebook/Instagram', recall: 22.1 },
  { campaign: 'Outdoor Push', medium: 'Billboard', months: 'Apr-Jun', channel: 'JCDecaux', recall: 12.5 },
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
              <Bar dataKey="Chantecler" fill="#00D4FF" radius={[2, 2, 0, 0]} animationDuration={1200} />
              <Bar dataKey="Avipro" fill="#F59E0B" radius={[2, 2, 0, 0]} animationDuration={1200} />
              <Bar dataKey="Chantefrais" fill="#8B5EA6" radius={[2, 2, 0, 0]} animationDuration={1200} />
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
