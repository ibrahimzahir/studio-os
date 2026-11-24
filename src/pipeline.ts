import { z } from 'zod';
import { assessOpportunity } from './intelligence.js';

const id = z.string().uuid();
export const opportunitySchema = z.object({ id, title: z.string().trim().min(1).max(160), audience: z.string().trim().min(1).max(500), targetMarket: z.string().trim().min(1).max(100), testPriceCents: z.number().int().positive(), deliverables: z.array(z.string().regex(/^[a-z0-9][a-z0-9-]*\.(pdf|xlsx|html)$/)).min(1).refine(v => new Set(v).size === v.length) }).strict();
export const approvalSchema = z.object({ opportunityId: id, approvedBy: id, approvedAt: z.iso.datetime(), expiresAt: z.iso.datetime(), revision: z.number().int().positive() }).strict();

export function createProductionPackage(opportunityInput: unknown, evidence: unknown, approvalInput: unknown, now: Date) {
  const opportunity = opportunitySchema.parse(opportunityInput);
  const approval = approvalSchema.parse(approvalInput);
  const assessment = assessOpportunity(evidence, now);
  if (!assessment.readyForReview) throw new Error('Evidence is not ready for production review');
  if (approval.opportunityId !== opportunity.id || Date.parse(approval.approvedAt) > now.getTime() || Date.parse(approval.expiresAt) <= now.getTime()) throw new Error('Approval is invalid or expired');
  const jobId = `${opportunity.id}-r${approval.revision}`;
  return { schemaVersion: 1, jobId, opportunity, assessment, approval, executor: 'antigravity', automaticPublishing: false, state: 'awaiting_antigravity', acceptanceCriteria: ['Original content with source attribution', 'PDF layout inspected at A4 and US Letter', 'Spreadsheet formulas independently tested', 'No secrets, macros, external workbook links or executable content', 'Owner approval required before publishing'] } as const;
}

export type Stage = 'research' | 'review' | 'awaiting_antigravity' | 'qa' | 'release_review' | 'published';
export function transition(stage: Stage, event: 'research_complete' | 'production_approved' | 'artifacts_received' | 'qa_passed' | 'release_approved', actor: 'worker' | 'owner'): Stage {
  const rules = {
    research_complete: ['research', 'review', 'worker'],
    production_approved: ['review', 'awaiting_antigravity', 'owner'],
    artifacts_received: ['awaiting_antigravity', 'qa', 'worker'],
    qa_passed: ['qa', 'release_review', 'worker'],
    release_approved: ['release_review', 'published', 'owner'],
  } as const;
  const rule = rules[event];
  if (!rule || rule[0] !== stage || rule[2] !== actor) throw new Error('Forbidden pipeline transition');
  return rule[1];
}
