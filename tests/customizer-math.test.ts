import { describe, expect, it } from 'vitest';
import {
  BRAND_PALETTES,
  calculateMarginLeakage,
  calculateMarkupPrice,
  calculateTargetMarginPrice,
} from '../src/features/marketing/customizer-math';

describe('Live Brand Customizer margin math', () => {
  it('matches canonical $100 job cost at 40% target margin = $166.67 vs $140.00 markup', () => {
    expect(calculateTargetMarginPrice(100, 40)).toBe(166.67);
    expect(calculateMarkupPrice(100, 40)).toBe(140);
    expect(calculateMarginLeakage(100, 40)).toBe(26.67);
  });

  it('handles zero, negative, NaN, and extreme margins safely without NaN/Infinity', () => {
    expect(calculateTargetMarginPrice(0, 40)).toBe(0);
    expect(calculateTargetMarginPrice(-50, 40)).toBe(0);
    expect(calculateTargetMarginPrice(Number.NaN, 40)).toBe(0);
    expect(calculateTargetMarginPrice(100, 99)).toBe(1000); // clamped to 90%
    expect(calculateTargetMarginPrice(100, -10)).toBe(100); // clamped to 0%
    expect(calculateMarginLeakage(0, 40)).toBe(0);
  });

  it('provides at least 5 distinct brand palettes', () => {
    expect(BRAND_PALETTES.length).toBeGreaterThanOrEqual(5);
    const ids = new Set(BRAND_PALETTES.map(p => p.id));
    expect(ids.size).toBe(BRAND_PALETTES.length);
  });
});
