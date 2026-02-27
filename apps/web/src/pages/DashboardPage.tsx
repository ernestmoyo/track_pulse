import { motion } from 'framer-motion';
import PulseKpiCard from '@/components/ui/PulseKpiCard';
import BrandHealthTrendChart from '@/components/charts/BrandHealthTrendChart';
import CompetitorRadarChart from '@/components/charts/CompetitorRadarChart';
import ShareOfVoiceDonut from '@/components/charts/ShareOfVoiceDonut';
import AlertsFeed from '@/components/modules/AlertsFeed';

// Demo data (wired to API in production)
const kpiData = [
  { label: 'Brand Awareness (TOM)', value: 46.5, previousValue: 44.8, unit: '%', threshold: 40, sparklineData: [42.3, 43.8, 44.1, 45.2, 44.8, 46.5] },
  { label: '30-Day Consumption', value: 49.3, previousValue: 47.5, unit: '%', threshold: 40, sparklineData: [45.8, 46.5, 47.2, 48.1, 47.5, 49.3] },
  { label: 'Ad Awareness', value: 43.5, previousValue: 41.2, unit: '%', threshold: 30, sparklineData: [38.2, 39.5, 41.3, 42.8, 41.2, 43.5] },
  { label: 'Share of Voice', value: 36.2, previousValue: 34.5, unit: '%', threshold: 30, sparklineData: [32.5, 33.1, 34.2, 35.8, 34.5, 36.2] },
  { label: 'Net Promoter Proxy', value: 28, previousValue: 25, unit: '', threshold: 20, sparklineData: [22, 24, 23, 26, 25, 28] },
  { label: 'Wave Response (n=)', value: 508, previousValue: 510, unit: '', threshold: 500, sparklineData: [502, 515, 498, 521, 510, 508] },
];

const trendData = [
  { wave: 'Q1-23', tom: 42.3, spontaneous: 68.5, aided: 92.1 },
  { wave: 'Q2-23', tom: 43.8, spontaneous: 69.2, aided: 92.8 },
  { wave: 'Q3-23', tom: 44.1, spontaneous: 70.1, aided: 93.2 },
  { wave: 'Q4-23', tom: 45.2, spontaneous: 71.3, aided: 93.5 },
  { wave: 'Q1-24', tom: 44.8, spontaneous: 70.8, aided: 93.1 },
  { wave: 'Q2-24', tom: 46.5, spontaneous: 72.4, aided: 94.2 },
];

const radarData = [
  { metric: 'Awareness', 'Jungle Oats': 46.5, 'Weet-Bix': 18.3, "Kellogg's": 11.2, 'Future Life': 5.9 },
  { metric: 'Consumption', 'Jungle Oats': 49.3, 'Weet-Bix': 28.3, "Kellogg's": 17.2, 'Future Life': 10.2 },
  { metric: 'Ad Recall', 'Jungle Oats': 43.5, 'Weet-Bix': 22.5, "Kellogg's": 14.2, 'Future Life': 10.5 },
  { metric: 'Quality', 'Jungle Oats': 82, 'Weet-Bix': 70, "Kellogg's": 62, 'Future Life': 66 },
  { metric: 'Value', 'Jungle Oats': 76, 'Weet-Bix': 66, "Kellogg's": 69, 'Future Life': 72 },
];

const radarBrands = [
  { name: 'Jungle Oats', color: '#00D4FF', isMain: true },
  { name: 'Weet-Bix', color: '#F59E0B', isMain: false },
  { name: "Kellogg's", color: '#8B5EA6', isMain: false },
  { name: 'Future Life', color: '#57B9A5', isMain: false },
];

const sovData = [
  { name: 'Jungle Oats', value: 36.2 },
  { name: 'Weet-Bix', value: 24.5 },
  { name: "Kellogg's", value: 19.1 },
  { name: 'ProNutro', value: 12.1 },
  { name: 'Future Life', value: 8.1 },
];

const alertsData = [
  { id: '1', type: 'positive' as const, message: 'Jungle Oats TOM awareness reached highest ever at 46.5%, up +1.7pp from Q1-2024', timestamp: 'Q2-2024' },
  { id: '2', type: 'positive' as const, message: '30-day consumption broke 49% for the first time, driven by 25-34 age segment', timestamp: 'Q2-2024' },
  { id: '3', type: 'warning' as const, message: 'Future Life ad awareness surged +1.3pp — monitor competitive threat in digital channel', timestamp: 'Q2-2024' },
  { id: '4', type: 'warning' as const, message: 'LSM 4-6 segment consumption dropped 4.2pp for hot cereal category', timestamp: 'Q2-2024' },
  { id: '5', type: 'neutral' as const, message: 'Wave response rate met target: n=508 against n=500 quota', timestamp: 'Q2-2024' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-2xl font-display text-white">Command Center</h1>
          <p className="text-sm text-pulse-meta mt-1">Jungle Oats Brand Health — Q2 2024</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-pulse-meta font-mono px-3 py-1.5 glass-card">
            Wave: Q2-2024
          </span>
          <span className="text-xs text-pulse-meta font-mono px-3 py-1.5 glass-card">
            n = 508
          </span>
        </div>
      </motion.div>

      {/* Cyan line separator */}
      <div className="cyan-line" />

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpiData.map((kpi, i) => (
          <PulseKpiCard
            key={kpi.label}
            {...kpi}
            delay={i * 0.08}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BrandHealthTrendChart data={trendData} />
        </div>
        <div>
          <CompetitorRadarChart data={radarData} brands={radarBrands} />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ShareOfVoiceDonut data={sovData} />
        <AlertsFeed alerts={alertsData} />

        {/* Consumption Heatmap placeholder */}
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <h3 className="text-sm uppercase tracking-wider text-pulse-meta font-mono mb-1">Consumption Heatmap</h3>
          <p className="text-xs text-pulse-meta mb-4">Segments x Frequency</p>
          <div className="grid grid-cols-5 gap-1">
            {['18-24', '25-34', '35-44', '45-54', '55+'].map((age) =>
              ['M', 'F'].map((sex) => {
                const intensity = 0.2 + Math.random() * 0.8;
                return (
                  <div
                    key={`${age}-${sex}`}
                    className="aspect-square rounded-sm flex items-center justify-center text-[8px] font-mono text-white"
                    style={{ backgroundColor: `rgba(0, 212, 255, ${intensity})` }}
                    title={`${age} ${sex}: ${(intensity * 100).toFixed(0)}%`}
                  >
                    {(intensity * 100).toFixed(0)}
                  </div>
                );
              }),
            )}
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-[10px] text-pulse-meta">Low</span>
            <div className="flex-1 mx-2 h-1.5 rounded-full" style={{ background: 'linear-gradient(90deg, rgba(0,212,255,0.1), rgba(0,212,255,1))' }} />
            <span className="text-[10px] text-pulse-meta">High</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
