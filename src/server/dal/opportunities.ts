import type { PrismaClient, Prisma } from '../../generated/prisma/client';
import { opportunityQuerySchema, createOpportunitySchema, opportunityPageSchema, opportunityDtoSchema } from '../../contracts/opportunities';
import { authorize, type Principal } from '../auth/authorization';
const publicFields = { id: true, title: true, audience: true, category: true, status: true, createdAt: true } satisfies Prisma.OpportunitySelect;
export function opportunityDal(db: PrismaClient) {
  return {
    async list(actor: Principal | null, raw: unknown) {
      const principal = authorize(actor, 'opportunities:read');
      const query = opportunityQuerySchema.parse(raw);
      const where: Prisma.OpportunityWhereInput = { studioId: principal.studioId, ...(query.category !== 'all' ? { category: query.category } : {}), ...(query.search ? { OR: [{ title: { contains: query.search, mode: 'insensitive' } }, { audience: { contains: query.search, mode: 'insensitive' } }] } : {}) };
      const [rows, total] = await db.$transaction([db.opportunity.findMany({ where, select: publicFields, orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], skip: (query.page - 1) * query.pageSize, take: query.pageSize }), db.opportunity.count({ where })]);
      return opportunityPageSchema.parse({ items: rows.map(row => ({ ...row, createdAt: row.createdAt.toISOString() })), total, page: query.page, pageSize: query.pageSize });
    },
    async create(actor: Principal | null, raw: unknown) {
      const principal = authorize(actor, 'opportunities:write');
      const input = createOpportunitySchema.parse(raw);
      const row = await db.opportunity.create({ data: { ...input, studioId: principal.studioId }, select: publicFields });
      return opportunityDtoSchema.parse({ ...row, createdAt: row.createdAt.toISOString() });
    },
  };
}
