export const METRIC_LABELS: Record<string, string> = {
  tom_awareness: 'Top of Mind Awareness',
  spontaneous_awareness: 'Spontaneous Awareness',
  aided_awareness: 'Aided Awareness',
  consideration: 'Consideration',
  trial: 'Trial',
  regular_use: 'Regular Use',
  consumption_30day: '30-Day Consumption',
  ad_awareness: 'Advertising Awareness',
  share_of_voice: 'Share of Voice',
  quality_perception: 'Quality Perception',
  value_perception: 'Value Perception',
  nps_proxy: 'Net Promoter Proxy',
};

export const WAVE_STATUS_LABELS: Record<string, string> = {
  PLANNED: 'Planned',
  FIELDWORK: 'Fieldwork',
  PROCESSING: 'Processing',
  PUBLISHED: 'Published',
};

export const REPORT_SECTION_LABELS: Record<string, string> = {
  executive_summary: 'Executive Summary',
  key_learnings: 'Key Learnings',
  sample_profile: 'Sample Profile',
  category_consumption: 'Category Consumption',
  brand_awareness: 'Brand Awareness',
  ad_awareness_sov: 'Advertising Awareness & SOV',
  brand_consumption: 'Brand Consumption',
  place_of_purchase: 'Place of Purchase',
  brand_positioning: 'Brand Positioning',
  pricing_perception: 'Pricing Perception',
  competitive_landscape: 'Competitive Landscape',
  recommendations: 'Recommendations',
};

export const DEMOGRAPHIC_OPTIONS = {
  sex: ['Male', 'Female'],
  ageGroup: ['18-24', '25-34', '35-44', '45-54', '55+'],
  sec: ['A', 'B', 'C1', 'C2', 'D', 'E'],
  district: [
    'Port Louis',
    'Pamplemousses',
    'Riviere du Rempart',
    'Flacq',
    'Grand Port',
    'Savanne',
    'Black River',
    'Plaines Wilhems',
    'Moka',
  ],
};

export const SIGNIFICANCE_ALPHA = 0.05;
