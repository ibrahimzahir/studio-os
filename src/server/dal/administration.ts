import type { PrismaClient } from '../../generated/prisma/client';
import { z } from 'zod';
import { accountStatusSchema, maintenanceSchema } from '../../contracts/auth';
import { authorize, requireSensitiveAccess, AccessError, type Principal } from '../auth/authorization';
export function administrationDal(db: PrismaClient) {
  return {
    async setUserStatus(actor: Principal | null, userId: string, raw: unknown) {
      const principal = authorize(actor, 'users:manage'); requireSensitiveAccess(principal);
      z.string().min(1).max(128).parse(userId);
      const input = accountStatusSchema.parse(raw);
      if (userId === principal.id) throw new AccessError(409, 'You cannot disable your own developer account.');
      return db.$transaction(async tx => {
        const target = await tx.user.findFirst({ where: { id: userId, studioId: principal.studioId }, select: { id: true, role: true } });
        if (!target) throw new AccessError(404, 'Account not found.');
        if (target.role === 'developer') throw new AccessError(409, 'Developer account changes require the recovery procedure.');
        const updated = await tx.user.update({ where: { id: target.id }, data: input, select: { id: true, name: true, status: true } });
        await tx.session.deleteMany({ where: { userId: target.id } });
        await tx.auditEvent.create({ data: { studioId: principal.studioId, actorId: principal.id, action: `user.${input.status}`, subjectId: target.id } });
        return updated;
      });
    },
    async setMaintenance(actor: Principal | null, raw: unknown) {
      const principal = authorize(actor, 'maintenance:manage'); requireSensitiveAccess(principal);
      const input = maintenanceSchema.parse(raw);
      return db.$transaction(async tx => {
        const updated = await tx.studioSettings.upsert({ where: { studioId: principal.studioId }, create: { studioId: principal.studioId, maintenance: input.maintenance, maintenanceMessage: input.message }, update: { maintenance: input.maintenance, maintenanceMessage: input.message }, select: { maintenance: true, maintenanceMessage: true } });
        await tx.auditEvent.create({ data: { studioId: principal.studioId, actorId: principal.id, action: `maintenance.${input.maintenance ? 'enabled' : 'disabled'}`, subjectId: principal.studioId } });
        return updated;
      });
    },
  };
}
