export interface SignificanceResult {
  significant: boolean;
  direction: 'up' | 'down' | 'neutral';
  zScore: number;
  pValue: number;
  delta: number;
}

/**
 * Two-proportion z-test for wave-on-wave significance
 * p1 = current wave proportion, n1 = current wave sample size
 * p2 = previous wave proportion, n2 = previous wave sample size
 */
export function testSignificance(
  p1: number,
  n1: number,
  p2: number,
  n2: number,
  alpha = 0.05,
): SignificanceResult {
  const delta = (p1 - p2) * 100; // delta in percentage points

  // Handle edge cases
  if (n1 <= 0 || n2 <= 0) {
    return { significant: false, direction: 'neutral', zScore: 0, pValue: 1, delta };
  }

  if (p1 === p2) {
    return { significant: false, direction: 'neutral', zScore: 0, pValue: 1, delta: 0 };
  }

  // Pooled proportion
  const pPooled = (p1 * n1 + p2 * n2) / (n1 + n2);

  // Standard error
  const se = Math.sqrt(pPooled * (1 - pPooled) * (1 / n1 + 1 / n2));

  if (se === 0) {
    return { significant: false, direction: 'neutral', zScore: 0, pValue: 1, delta };
  }

  // Z-score
  const zScore = (p1 - p2) / se;

  // Two-tailed p-value (approximation using rational function)
  const pValue = 2 * (1 - normalCDF(Math.abs(zScore)));

  const significant = pValue < alpha;
  const direction: 'up' | 'down' | 'neutral' = p1 > p2 ? 'up' : p1 < p2 ? 'down' : 'neutral';

  return {
    significant,
    direction,
    zScore: Math.round(zScore * 100) / 100,
    pValue: Math.round(pValue * 10000) / 10000,
    delta: Math.round(delta * 10) / 10,
  };
}

/**
 * Standard normal CDF approximation (Abramowitz & Stegun)
 */
function normalCDF(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2);

  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return 0.5 * (1.0 + sign * y);
}
