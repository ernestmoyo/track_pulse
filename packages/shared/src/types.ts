// ============================================================
// TrackPulse Shared Types
// ============================================================

// Auth
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  success: true;
  data: {
    user: UserProfile;
    accessToken: string;
    refreshToken: string;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: Role;
  organizationId: string;
  organizationName: string;
  avatarUrl?: string;
}

export type Role = 'ADMIN' | 'ANALYST' | 'CLIENT_VIEWER';

// API Response Envelope
export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// Core Entities
export interface Client {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  primaryColor?: string;
  isActive: boolean;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  clientId: string;
  clientName?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Study {
  id: string;
  name: string;
  description?: string;
  brandId: string;
  brandName?: string;
  country: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  createdAt: string;
}

export type WaveStatus = 'PLANNED' | 'FIELDWORK' | 'PROCESSING' | 'PUBLISHED';

export interface Wave {
  id: string;
  label: string;
  studyId: string;
  studyName?: string;
  period: string;
  status: WaveStatus;
  fieldworkStart: string;
  fieldworkEnd: string;
  targetN: number;
  actualN: number;
  createdAt: string;
}

// Metrics
export interface BrandMetric {
  id: string;
  brandId: string;
  brandName: string;
  waveId: string;
  waveLabel: string;
  metric: MetricType;
  value: number;
  baseSize: number;
  segment?: string;
  significance?: SignificanceResult;
}

export type MetricType =
  | 'tom_awareness'
  | 'spontaneous_awareness'
  | 'aided_awareness'
  | 'consideration'
  | 'trial'
  | 'regular_use'
  | 'consumption_30day'
  | 'ad_awareness'
  | 'share_of_voice'
  | 'quality_perception'
  | 'value_perception'
  | 'nps_proxy';

export interface SignificanceResult {
  significant: boolean;
  direction: 'up' | 'down' | 'neutral';
  zScore: number;
  pValue: number;
  delta: number;
}

export interface MetricTrend {
  metric: MetricType;
  brandId: string;
  brandName: string;
  dataPoints: TrendDataPoint[];
}

export interface TrendDataPoint {
  waveId: string;
  waveLabel: string;
  value: number;
  baseSize: number;
  significance?: SignificanceResult;
}

export interface CompetitorComparison {
  metric: MetricType;
  waveId: string;
  brands: {
    brandId: string;
    brandName: string;
    value: number;
    isMainBrand: boolean;
  }[];
}

// Segments & Filters
export interface SegmentFilter {
  sex?: 'Male' | 'Female';
  ageGroup?: string;
  sec?: string;
  district?: string;
}

export interface SegmentBreakdown {
  segment: string;
  segmentValue: string;
  value: number;
  baseSize: number;
  significance?: SignificanceResult;
}

// Reports
export type ReportStatus = 'PENDING' | 'GENERATING' | 'COMPLETED' | 'FAILED';
export type ReportFormat = 'pptx' | 'pdf' | 'both';

export interface ReportConfig {
  brandId: string;
  waveIds: string[];
  compareWaveId?: string;
  sections: ReportSection[];
  clientLogo?: string;
  clientPrimaryColor?: string;
  format: ReportFormat;
}

export type ReportSection =
  | 'executive_summary'
  | 'key_learnings'
  | 'sample_profile'
  | 'category_consumption'
  | 'brand_awareness'
  | 'ad_awareness_sov'
  | 'brand_consumption'
  | 'place_of_purchase'
  | 'brand_positioning'
  | 'pricing_perception'
  | 'competitive_landscape'
  | 'recommendations';

export interface Report {
  id: string;
  brandId: string;
  brandName: string;
  waveIds: string[];
  status: ReportStatus;
  format: ReportFormat;
  sections: ReportSection[];
  filePath?: string;
  createdAt: string;
  completedAt?: string;
}

// Survey
export type QuestionType = 'single_choice' | 'multi_choice' | 'scale' | 'open_text' | 'ranking';

export interface Question {
  id: string;
  surveyId: string;
  text: string;
  type: QuestionType;
  order: number;
  isRequired: boolean;
  options: QuestionOption[];
}

export interface QuestionOption {
  id: string;
  questionId: string;
  text: string;
  value: string;
  order: number;
}

// Dashboard KPI
export interface KpiData {
  label: string;
  metric: MetricType;
  value: number;
  previousValue: number;
  unit: string;
  threshold: number;
  sparklineData: number[];
  significance: SignificanceResult;
}

// Consumption Patterns
export interface ConsumptionFrequency {
  frequency: string;
  percentage: number;
  baseSize: number;
}

export interface PlaceOfPurchase {
  place: string;
  percentage: number;
  baseSize: number;
}

// Audit
export interface AuditEntry {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId: string;
  details?: string;
  createdAt: string;
}
