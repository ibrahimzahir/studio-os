import { z } from 'zod';
export class AccessError extends Error {
  constructor(public readonly statusCode: 401 | 403 | 404 | 409 | 503, message: string) { super(message); }
}
export const principalSchema = z.object({ id: z.string().min(1), studioId: z.string().min(1), role: z.enum(['developer', 'staff', 'viewer']), status: z.enum(['active', 'suspended', 'blocked']), twoFactorEnabled: z.boolean(), sessionCreatedAt: z.date() }).strict();
export type Principal = z.infer<typeof principalSchema>;
export type Permission = 'opportunities:read' | 'opportunities:write' | 'users:manage' | 'maintenance:manage';
export function authorize(input: Principal | null, permission: Permission): Principal {
  if (!input) throw new AccessError(401, 'Sign in to continue.');
  const result = principalSchema.safeParse(input);
  if (!result.success || result.data.status !== 'active') throw new AccessError(403, 'Access is unavailable for this account.');
  const principal = result.data;
  const allowed = principal.role === 'developer' || permission === 'opportunities:read' || (principal.role === 'staff' && permission === 'opportunities:write');
  if (!allowed) throw new AccessError(403, 'You do not have permission for this action.');
  return principal;
}
export function requireSensitiveAccess(principal: Principal, now = new Date()) {
  if (!principal.twoFactorEnabled || principal.sessionCreatedAt > now || now.getTime() - principal.sessionCreatedAt.getTime() > 600000) throw new AccessError(403, 'Sign in again with two-factor authentication to continue.');
}
