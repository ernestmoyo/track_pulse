import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const frequencyData = [
  { freq: 'Daily', pct: 12.3 },
  { freq: 'Weekly', pct: 28.5 },
  { freq: 'Monthly', pct: 22.1 },
  { freq: 'Occasional', pct: 18.5 },
  { freq: 'Never', pct: 18.6 },
];

const productTypeData = [
  { name: 'Hot Cereal', value: 42.3, color: '#00D4FF' },
  { name: 'Cold Cereal', value: 35.8, color: '#F59E0B' },
  { name: 'Muesli/Granola', value: 21.9, color: '#8B5EA6' },
];

const purchasePlaceData = [
  { place: 'Supermarket', pct: 45.2 },
  { place: 'Wholesaler', pct: 22.5 },
  { place: 'Spaza Shop', pct: 18.3 },
  { place: 'Convenience', pct: 10.5 },
  { place: 'Online', pct: 3.5 },
];

const volumeData = [
  { tier: '<250g', pct: 10.2 },
  { tier: '250-500g', pct: 32.5 },
  { tier: '500g-1kg', pct: 35.8 },
  { tier: '1-2kg', pct: 16.3 },
  { tier: '2kg+', pct: 5.2 },
];

export default function ConsumptionTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Frequency Distribution */}
        <motion.div className="glass-card p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h3 className="text-sm uppercase tracking-wider text-pulse-meta font-mono mb-4">Consumption Frequency</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={frequencyData} layout="vertical" barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="freq" tick={{ fill: '#94A3B8', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} width={80} />
                <Tooltip contentStyle={{ background: '#1A2332', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '8px', fontSize: '11px', fontFamily: 'JetBrains Mono' }} formatter={(v: number) => [`${v}%`]} />
                <Bar dataKey="pct" fill="#00D4FF" radius={[0, 4, 4, 0]} animationDuration={1200} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Product Type */}
        <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h3 className="text-sm uppercase tracking-wider text-pulse-meta font-mono mb-4">Product Type Split</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={productTypeData} cx="50%" cy="50%" innerRadius={40} outerRadius={75} dataKey="value" animationDuration={1200} stroke="none">
                  {productTypeData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1A2332', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '8px', fontSize: '11px', fontFamily: 'JetBrains Mono' }} formatter={(v: number) => [`${v}%`]} />
                <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'JetBrains Mono' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Place of Purchase */}
        <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h3 className="text-sm uppercase tracking-wider text-pulse-meta font-mono mb-4">Place of Purchase</h3>
          <div className="space-y-3">
            {purchasePlaceData.map((item, i) => (
              <motion.div key={item.place} className="flex items-center gap-3" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.06 }}>
                <span className="w-24 text-xs text-pulse-body flex-shrink-0">{item.place}</span>
                <div className="flex-1 h-5 bg-[rgba(0,212,255,0.05)] rounded overflow-hidden">
                  <motion.div
                    className="h-full bg-pulse-cyan rounded flex items-center px-2"
                    initial={{ width: 0 }}
                    animate={{ width: `${item.pct}%` }}
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.06 }}
                  >
                    <span className="text-[10px] font-mono text-white">{item.pct}%</span>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Volume Tier */}
        <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h3 className="text-sm uppercase tracking-wider text-pulse-meta font-mono mb-4">Volume Tier Distribution</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                <XAxis dataKey="tier" tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip contentStyle={{ background: '#1A2332', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '8px', fontSize: '11px', fontFamily: 'JetBrains Mono' }} formatter={(v: number) => [`${v}%`]} />
                <Bar dataKey="pct" fill="#57B9A5" radius={[4, 4, 0, 0]} animationDuration={1200} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
