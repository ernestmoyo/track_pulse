import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SEGMENT_OPTIONS = {
  sex: ['All', 'Male', 'Female'],
  ageGroup: ['All', '18-24', '25-34', '35-44', '45-54', '55+'],
  lsm: ['All', 'LSM 8-10', 'LSM 7', 'LSM 5-6', 'LSM 4', 'LSM 1-3'],
  province: ['All', 'Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape', 'Free State', 'Limpopo'],
};

const generateSegmentData = (filters: Record<string, string>) => {
  // Simulated segment-specific data
  const base = {
    tom: 46.5,
    consumption: 49.3,
    adAwareness: 43.5,
    quality: 82,
    value: 76,
  };

  // Adjust based on selected filters
  const multiplier = Object.values(filters).filter((v) => v !== 'All').length;
  const jitter = (multiplier * 3.2) % 8 - 4;

  return [
    { metric: 'TOM Awareness', value: Math.max(0, Math.min(100, base.tom + jitter)) },
    { metric: 'Consumption', value: Math.max(0, Math.min(100, base.consumption + jitter * 0.8)) },
    { metric: 'Ad Awareness', value: Math.max(0, Math.min(100, base.adAwareness + jitter * 1.2)) },
    { metric: 'Quality', value: Math.max(0, Math.min(100, base.quality - jitter * 0.5)) },
    { metric: 'Value', value: Math.max(0, Math.min(100, base.value + jitter * 0.3)) },
  ];
};

export default function SegmentTab() {
  const [filters, setFilters] = useState<Record<string, string>>({
    sex: 'All',
    ageGroup: 'All',
    lsm: 'All',
    province: 'All',
  });

  const data = generateSegmentData(filters);
  const activeFilters = Object.entries(filters).filter(([, v]) => v !== 'All');
  const sampleSize = Math.max(50, 508 - activeFilters.length * 85);

  return (
    <div className="space-y-6">
      {/* Filter Panel */}
      <motion.div className="glass-card p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm uppercase tracking-wider text-pulse-meta font-mono">Segment Filters</h3>
            <p className="text-xs text-pulse-meta mt-1">Select demographic filters to drill into micro-segments</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-pulse-meta font-mono">Sample:</span>
            <span className={`text-sm font-mono font-bold ${sampleSize < 100 ? 'text-pulse-amber' : 'text-pulse-cyan'}`}>
              n={sampleSize}
            </span>
            {sampleSize < 100 && (
              <span className="text-[10px] text-pulse-amber">* Low base</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(SEGMENT_OPTIONS).map(([key, options]) => (
            <div key={key}>
              <label className="block text-xs text-pulse-meta mb-1.5 capitalize font-mono">
                {key === 'ageGroup' ? 'Age Group' : key === 'lsm' ? 'LSM' : key}
              </label>
              <select
                value={filters[key]}
                onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
                className="input-dark text-xs py-2"
              >
                {options.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* Active filter chips */}
        {activeFilters.length > 0 && (
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <span className="text-xs text-pulse-meta">Active:</span>
            {activeFilters.map(([key, value]) => (
              <span key={key} className="text-xs px-2 py-1 rounded-full bg-[rgba(0,212,255,0.1)] text-pulse-cyan border border-[rgba(0,212,255,0.2)] font-mono">
                {value}
                <button
                  onClick={() => setFilters({ ...filters, [key]: 'All' })}
                  className="ml-1.5 text-pulse-meta hover:text-white"
                >
                  x
                </button>
              </span>
            ))}
            <button
              onClick={() => setFilters({ sex: 'All', ageGroup: 'All', lsm: 'All', province: 'All' })}
              className="text-xs text-pulse-meta hover:text-pulse-cyan transition-colors"
            >
              Clear all
            </button>
          </div>
        )}
      </motion.div>

      {/* Segment Results Chart */}
      <motion.div
        className="glass-card p-6"
        key={JSON.stringify(filters)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-sm uppercase tracking-wider text-pulse-meta font-mono mb-4">
          Segment Metrics
          {activeFilters.length > 0 && (
            <span className="text-pulse-cyan ml-2">
              — {activeFilters.map(([, v]) => v).join(' + ')}
            </span>
          )}
        </h3>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="metric" tick={{ fill: '#94A3B8', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} width={100} />
              <Tooltip contentStyle={{ background: '#1A2332', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '8px', fontSize: '11px', fontFamily: 'JetBrains Mono' }} formatter={(v: number) => [`${v.toFixed(1)}%`]} />
              <Bar dataKey="value" fill="#00D4FF" radius={[0, 4, 4, 0]} animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
