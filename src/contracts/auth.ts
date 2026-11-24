import { z } from 'zod';
export const signInSchema = z.object({ email: z.email().max(254), password: z.string().min(1).max(128) });
export const totpSchema = z.object({ code: z.string().regex(/^\d{6}$/, 'Enter the six-digit authenticator code.') });
export const accountStatusSchema = z.object({ status: z.enum(['active', 'suspended', 'blocked']) }).strict();
export const maintenanceSchema = z.object({ maintenance: z.boolean(), message: z.string().trim().min(1).max(300) }).strict();
