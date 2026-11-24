import { principalSchema, type Principal } from './authorization';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getAuth } from './config';
import { getDatabase } from '../database/client';
export async function requireUser(enforceTwoFactor = true): Promise<Principal> {
  if (!process.env.DATABASE_URL || !process.env.BETTER_AUTH_SECRET || !process.env.BETTER_AUTH_URL) redirect('/sign-in?setup=required');
  const session = await getAuth().api.getSession({ headers: await headers() });
  if (!session) redirect('/sign-in');
  const user = await getDatabase().user.findUnique({ where: { id: session.user.id }, select: { id: true, studioId: true, role: true, status: true, twoFactorEnabled: true } });
  if (!user || user.status !== 'active') redirect('/sign-in?access=unavailable');
  const settings = await getDatabase().studioSettings.findUnique({ where: { studioId: user.studioId }, select: { maintenance: true } });
  if (settings?.maintenance && user.role !== 'developer') redirect('/maintenance');
  if (enforceTwoFactor && !user.twoFactorEnabled) redirect('/settings/security');
  return principalSchema.parse({ id: user.id, studioId: user.studioId, role: user.role, status: user.status, twoFactorEnabled: user.twoFactorEnabled, sessionCreatedAt: new Date(session.session.createdAt) });
}
