import { motion } from 'framer-motion';
import PulseKpiCard from '@/components/ui/PulseKpiCard';
import BrandHealthTrendChart from '@/components/charts/BrandHealthTrendChart';

const kpiData = [
  { label: 'Brand Awareness (TOM)', value: 46.5, previousValue: 44.8, unit: '%', threshold: 40, sparklineData: [42.3, 43.8, 44.1, 45.2, 44.8, 46.5] },
  { label: '30-Day Consumption', value: 49.3, previousValue: 47.5, unit: '%', threshold: 40, sparklineData: [45.8, 46.5, 47.2, 48.1, 47.5, 49.3] },
  { label: 'Ad Awareness', value: 43.5, previousValue: 41.2, unit: '%', threshold: 30, sparklineData: [38.2, 39.5, 41.3, 42.8, 41.2, 43.5] },
  { label: 'Share of Voice', value: 36.2, previousValue: 34.5, unit: '%', threshold: 30, sparklineData: [32.5, 33.1, 34.2, 35.8, 34.5, 36.2] },
];

const trendData = [
  { wave: 'Q1-23', tom: 42.3, spontaneous: 68.5, aided: 92.1 },
  { wave: 'Q2-23', tom: 43.8, spontaneous: 69.2, aided: 92.8 },
  { wave: 'Q3-23', tom: 44.1, spontaneous: 70.1, aided: 93.2 },
  { wave: 'Q4-23', tom: 45.2, spontaneous: 71.3, aided: 93.5 },
  { wave: 'Q1-24', tom: 44.8, spontaneous: 70.8, aided: 93.1 },
  { wave: 'Q2-24', tom: 46.5, spontaneous: 72.4, aided: 94.2 },
];

const reports = [
  { id: '1', title: 'Q2-2024 Brand Health Report', date: '2024-07-15', format: 'PPTX' },
  { id: '2', title: 'Q1-2024 Brand Health Report', date: '2024-04-12', format: 'PPTX' },
  { id: '3', title: 'Q4-2023 Annual Review', date: '2024-01-20', format: 'PDF' },
];

export default function ClientPortalPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-[rgba(225,29,72,0.2)] flex items-center justify-center text-xs font-bold text-[#E11D48]">T</div>
          <h1 className="text-2xl font-display text-white">Tiger Brands Portal</h1>
        </div>
        <p className="text-sm text-pulse-meta">Jungle Oats Brand Health Overview — Published waves only</p>
      </motion.div>

      <div className="cyan-line" />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpiData.map((kpi, i) => (
          <PulseKpiCard key={kpi.label} {...kpi} delay={i * 0.08} />
        ))}
      </div>

      {/* Trend Chart */}
      <BrandHealthTrendChart data={trendData} />

      {/* Reports for Download */}
      <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h3 className="text-sm uppercase tracking-wider text-pulse-meta font-mono mb-4">Available Reports</h3>
        <div className="space-y-3">
          {reports.map((report, i) => (
            <motion.div
              key={report.id}
              className="flex items-center justify-between p-4 glass-card-hover"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.08 }}
            >
              <div className="flex items-center gap-3">
                <svg className="w-8 h-8 text-pulse-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                  <p className="text-sm text-white">{report.title}</p>
                  <p className="text-xs text-pulse-meta font-mono">{report.date} · {report.format}</p>
                </div>
              </div>
              <button className="btn-secondary text-xs py-1.5">Download</button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
