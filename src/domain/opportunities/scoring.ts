import { z } from 'zod';

export const weights = { searchGrowth: 25, marketplaceDemand: 20, socialVelocity: 20, purchaseIntent: 15, crossPlatformMomentum: 10, competitiveOpportunity: 10 } as const;
const metric = z.enum(Object.keys(weights) as [keyof typeof weights, ...(keyof typeof weights)[]]);
export const evidenceSchema = z.object({
  id: z.string().uuid(), metric, sourceUrl: z.url().refine(url => new URL(url).protocol === 'https:', 'HTTPS required'),
  platform: z.string().trim().min(1), observedAt: z.iso.datetime(),
  value: z.number().min(0).max(100), confidence: z.number().min(0).max(1),
  kind: z.enum(['observed', 'demo']), summary: z.string().trim().min(1).max(2000),
}).strict();
export type Evidence = z.infer<typeof evidenceSchema>;

export function assessOpportunity(input: unknown, now: Date) {
  if (!Number.isFinite(now.getTime())) throw new Error('Invalid assessment time');
  const evidence = z.array(evidenceSchema).parse(input);
  if (new Set(evidence.map(e => e.id)).size !== evidence.length) throw new Error('Duplicate evidence ID');
  const usable = evidence.filter(e => e.kind === 'observed' && Date.parse(e.observedAt) <= now.getTime() && now.getTime() - Date.parse(e.observedAt) <= 30 * 86400000);
  let score = 0, confidence = 0;
  const missing: string[] = [];
  for (const [key, weight] of Object.entries(weights)) {
    const rows = usable.filter(e => e.metric === key);
    if (!rows.length) { missing.push(key); continue; }
    score += weight * rows.reduce((sum, e) => sum + e.value, 0) / rows.length / 100;
    confidence += weight * rows.reduce((sum, e) => sum + e.confidence, 0) / rows.length / 100;
  }
  const platforms = new Set(usable.map(e => e.platform.toLowerCase())).size;
  return { score: Math.round(score), confidence, missing, evidenceIds: usable.map(e => e.id), readyForReview: missing.length === 0 && platforms >= 2 && confidence >= 0.7 && score >= 80 };
}
