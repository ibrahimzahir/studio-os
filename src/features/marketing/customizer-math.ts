export interface BrandPalette {
  readonly id: string;
  readonly name: string;
  readonly headerBg: string;
  readonly accentText: string;
  readonly softTint: string;
  readonly borderTint: string;
}

export const BRAND_PALETTES: readonly BrandPalette[] = [
  {
    id: 'forest',
    name: 'Forest Green',
    headerBg: '#14532D',
    accentText: '#166534',
    softTint: '#F0FDF4',
    borderTint: '#BBF7D0',
  },
  {
    id: 'cobalt',
    name: 'Cobalt Blue',
    headerBg: '#1E3A8A',
    accentText: '#1D4ED8',
    softTint: '#EFF6FF',
    borderTint: '#BFDBFE',
  },
  {
    id: 'slate',
    name: 'Executive Slate',
    headerBg: '#0F172A',
    accentText: '#334155',
    softTint: '#F8FAFC',
    borderTint: '#CBD5E1',
  },
  {
    id: 'crimson',
    name: 'Deep Crimson',
    headerBg: '#881337',
    accentText: '#9F1239',
    softTint: '#FFF1F2',
    borderTint: '#FECDD3',
  },
  {
    id: 'amber',
    name: 'Warm Bronze',
    headerBg: '#78350F',
    accentText: '#92400E',
    softTint: '#FFFBEB',
    borderTint: '#FDE68A',
  },
];

function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Deterministic target-margin quote: price = cost / (1 - marginPct / 100)
 * Clamps marginPct to [0, 90] to prevent division-by-zero or unrealistic quotes.
 */
export function calculateTargetMarginPrice(jobCostUsd: number, targetMarginPct: number): number {
  if (!Number.isFinite(jobCostUsd) || jobCostUsd <= 0) return 0;
  const clampedMargin = Math.min(Math.max(Number.isFinite(targetMarginPct) ? targetMarginPct : 0, 0), 90);
  return roundCurrency(jobCostUsd / (1 - clampedMargin / 100));
}

/**
 * Naive markup quote: price = cost * (1 + markupPct / 100)
 */
export function calculateMarkupPrice(jobCostUsd: number, markupPct: number): number {
  if (!Number.isFinite(jobCostUsd) || jobCostUsd <= 0) return 0;
  const clampedMarkup = Math.min(Math.max(Number.isFinite(markupPct) ? markupPct : 0, 0), 300);
  return roundCurrency(jobCostUsd * (1 + clampedMarkup / 100));
}

/**
 * Dollar difference per job between true target-margin quoting and naive markup quoting.
 */
export function calculateMarginLeakage(jobCostUsd: number, pct: number): number {
  const marginQuote = calculateTargetMarginPrice(jobCostUsd, pct);
  const markupQuote = calculateMarkupPrice(jobCostUsd, pct);
  return roundCurrency(Math.max(0, marginQuote - markupQuote));
}
