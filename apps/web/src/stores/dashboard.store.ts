import { create } from 'zustand';
import type { KpiData, MetricTrend, CompetitorComparison } from '@trackpulse/shared';
import { api } from '@/services/api';

interface DashboardState {
  kpis: KpiData[];
  trends: MetricTrend[];
  competitors: CompetitorComparison[];
  selectedBrandId: string | null;
  selectedWaveId: string | null;
  isLoading: boolean;
  error: string | null;
  fetchDashboard: (brandId: string, waveId: string, compareWaveId?: string) => Promise<void>;
  setSelectedBrand: (brandId: string) => void;
  setSelectedWave: (waveId: string) => void;
}

export const useDashboardStore = create<DashboardState>()((set) => ({
  kpis: [],
  trends: [],
  competitors: [],
  selectedBrandId: null,
  selectedWaveId: null,
  isLoading: false,
  error: null,

  fetchDashboard: async (brandId: string, waveId: string, compareWaveId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const params: Record<string, string> = { brandId, waveId };
      if (compareWaveId) params.compareWaveId = compareWaveId;

      const res = await api.get('/metrics', { params });
      set({
        kpis: transformToKpis(res.data.data),
        isLoading: false,
      });
    } catch {
      set({ error: 'Failed to load dashboard data', isLoading: false });
    }
  },

  setSelectedBrand: (brandId: string) => set({ selectedBrandId: brandId }),
  setSelectedWave: (waveId: string) => set({ selectedWaveId: waveId }),
}));

function transformToKpis(metrics: Record<string, unknown>[]): KpiData[] {
  const kpiMetrics = [
    { metric: 'tom_awareness', label: 'Brand Awareness (TOM)', unit: '%', threshold: 40 },
    { metric: 'consumption_30day', label: 'Brand Consumption', unit: '%', threshold: 40 },
    { metric: 'ad_awareness', label: 'Ad Awareness', unit: '%', threshold: 30 },
    { metric: 'share_of_voice', label: 'Share of Voice', unit: '%', threshold: 30 },
    { metric: 'nps_proxy', label: 'Net Promoter Proxy', unit: '', threshold: 20 },
  ];

  return kpiMetrics.map((kpi) => {
    const found = metrics.find((m: Record<string, unknown>) => m.metric === kpi.metric);
    return {
      label: kpi.label,
      metric: kpi.metric as KpiData['metric'],
      value: (found as Record<string, unknown>)?.value as number ?? 0,
      previousValue: (found as Record<string, unknown>)?.previousValue as number ?? 0,
      unit: kpi.unit,
      threshold: kpi.threshold,
      sparklineData: [],
      significance: (found as Record<string, unknown>)?.significance as KpiData['significance'] ?? {
        significant: false,
        direction: 'neutral' as const,
        zScore: 0,
        pValue: 1,
        delta: 0,
      },
    };
  });
}
