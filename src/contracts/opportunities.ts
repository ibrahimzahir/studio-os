import { z } from 'zod';
export const categorySchema = z.enum(['operations', 'hospitality', 'events']);
export const opportunityQuerySchema = z.object({
  search: z.string().trim().max(100).default(''),
  category: z.union([categorySchema, z.literal('all')]).default('all'),
  page: z.coerce.number().int().min(1).max(10000).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(12),
}).strict();
export const createOpportunitySchema = z.object({ title: z.string().trim().min(3).max(160), audience: z.string().trim().min(3).max(500), category: categorySchema }).strict();
export const opportunityDtoSchema = createOpportunitySchema.extend({ id: z.string().uuid(), status: z.enum(['needs_research', 'in_review', 'approved']), createdAt: z.iso.datetime() }).strict();
export const opportunityPageSchema = z.object({ items: z.array(opportunityDtoSchema), total: z.number().int().nonnegative(), page: z.number().int().positive(), pageSize: z.number().int().positive() }).strict();
export type OpportunityQuery = z.infer<typeof opportunityQuerySchema>;
export type CreateOpportunity = z.infer<typeof createOpportunitySchema>;
export type OpportunityDto = z.infer<typeof opportunityDtoSchema>;
export type OpportunityPage = z.infer<typeof opportunityPageSchema>;
