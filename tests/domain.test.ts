import { describe, it, expect } from 'vitest';
import { assessOpportunity, weights } from '../src/intelligence.js';
import { createProductionPackage, transition } from '../src/pipeline.js';
const now = new Date('2026-11-24T12:00:00Z');
const evidence = Object.keys(weights).map((metric, i) => ({ id: `00000000-0000-4000-8000-00000000000${i}`, metric, sourceUrl: 'https://example.com/research', platform: i % 2 ? 'marketplace' : 'search', observedAt: now.toISOString(), value: 90, confidence: 0.9, kind: 'observed', summary: 'Synthetic test fixture only' }));
const opportunity = { id: '00000000-0000-4000-8000-000000000099', title: 'Mobile detailing planner', audience: 'Independent detailers', targetMarket: 'US', testPriceCents: 2499, deliverables: ['job-costing.xlsx', 'service-menu.pdf'] };
const approval = { opportunityId: opportunity.id, approvedBy: '00000000-0000-4000-8000-000000000088', approvedAt: now.toISOString(), expiresAt: '2026-11-25T12:00:00Z', revision: 1 };
describe('evidence assessment', () => {
  it('calculates transparent weighted score and confidence', () => { const r = assessOpportunity(evidence, now); expect(r.score).toBe(90); expect(r.confidence).toBeCloseTo(0.9); expect(r.readyForReview).toBe(true); });
  it.each(['demo', 'stale', 'future', 'single platform', 'missing', 'low confidence'])('blocks %s evidence', kind => {
    let rows = evidence.map(e => ({ ...e }));
    if (kind === 'demo') rows = rows.map(e => ({ ...e, kind: 'demo' }));
    if (kind === 'stale') rows = rows.map(e => ({ ...e, observedAt: '2026-01-01T00:00:00Z' }));
    if (kind === 'future') rows = rows.map(e => ({ ...e, observedAt: '2027-01-01T00:00:00Z' }));
    if (kind === 'single platform') rows = rows.map(e => ({ ...e, platform: 'search' }));
    if (kind === 'missing') rows = rows.slice(1);
    if (kind === 'low confidence') rows = rows.map(e => ({ ...e, confidence: 0.2 }));
    expect(assessOpportunity(rows, now).readyForReview).toBe(false);
  });
  it('rejects duplicates, malformed URLs and nonfinite metrics', () => {
    expect(() => assessOpportunity([...evidence, evidence[0]], now)).toThrow();
    expect(() => assessOpportunity([{ ...evidence[0], sourceUrl: 'file:///etc/passwd' }], now)).toThrow();
    expect(() => assessOpportunity([{ ...evidence[0], value: NaN }], now)).toThrow();
  });
});
describe('production contract', () => {
  it('creates deterministic revision-scoped handoffs without publishing', () => { const result = createProductionPackage(opportunity, evidence, approval, now); expect(result.jobId).toBe(`${opportunity.id}-r1`); expect(result.automaticPublishing).toBe(false); });
  it('rejects expired and mismatched approvals', () => {
    expect(() => createProductionPackage(opportunity, evidence, { ...approval, expiresAt: now.toISOString() }, now)).toThrow();
    expect(() => createProductionPackage(opportunity, evidence, { ...approval, opportunityId: approval.approvedBy }, now)).toThrow();
  });
  it('rejects unsafe deliverable paths', () => expect(() => createProductionPackage({ ...opportunity, deliverables: ['../secrets.pdf'] }, evidence, approval, now)).toThrow());
  it('requires owner approval and prevents stage skipping', () => {
    expect(transition('research', 'research_complete', 'worker')).toBe('review');
    expect(() => transition('review', 'production_approved', 'worker')).toThrow();
    expect(() => transition('research', 'release_approved', 'owner')).toThrow();
    expect(transition('release_review', 'release_approved', 'owner')).toBe('published');
  });
});
