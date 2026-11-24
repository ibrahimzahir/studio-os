import Fastify from 'fastify';
import { trustedOrigins } from '../auth/origins';
import { fromNodeHeaders } from 'better-auth/node';
import { ZodError } from 'zod';
import { getAuth } from '../auth/config';
import { getDatabase } from '../database/client';
import { AccessError, authorize, type Principal } from '../auth/authorization';
import { opportunityDal } from '../dal/opportunities';
import { administrationDal } from '../dal/administration';
export function buildApi() {
  const app = Fastify({ logger: false, bodyLimit: 32768, trustProxy: false });
  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) return reply.code(400).send({ error: 'Invalid request.', code: 'VALIDATION_ERROR' });
    if (error instanceof AccessError) return reply.code(error.statusCode).send({ error: error.message, code: 'ACCESS_DENIED' });
    return reply.code(503).send({ error: 'Service is unavailable. Contact the studio developer.', code: 'SERVICE_UNAVAILABLE' });
  });
  app.addHook('onSend', async (_request, reply) => { reply.header('Cache-Control', 'no-store'); reply.header('X-Content-Type-Options', 'nosniff'); });
  async function principal(headers: Parameters<typeof fromNodeHeaders>[0]): Promise<Principal> {
    const session = await getAuth().api.getSession({ headers: fromNodeHeaders(headers) });
    if (!session) throw new AccessError(401, 'Sign in to continue.');
    const user = await getDatabase().user.findUnique({ where: { id: session.user.id }, select: { id: true, studioId: true, role: true, status: true, twoFactorEnabled: true } });
    if (!user || user.status !== 'active') throw new AccessError(403, 'Access is unavailable for this account.');
    if (!user.twoFactorEnabled) throw new AccessError(403, 'Set up two-factor authentication before accessing studio data.');
    const settings = await getDatabase().studioSettings.findUnique({ where: { studioId: user.studioId }, select: { maintenance: true, maintenanceMessage: true } });
    if (settings?.maintenance && user.role !== 'developer') throw new AccessError(503, settings.maintenanceMessage);
    return { ...user, sessionCreatedAt: new Date(session.session.createdAt) };
  }
  app.addHook('onRequest', async (request) => {
    if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
      const origin = request.headers.origin;
      const baseURL = process.env.BETTER_AUTH_URL;
      if (!origin || !baseURL || !trustedOrigins(baseURL, process.env.NODE_ENV !== 'production').includes(origin)) throw new AccessError(403, 'Request origin is not allowed.');
    }
  });
  app.route({ method: ['GET', 'POST'], url: '/api/auth/*', handler: async (request, reply) => {
    const path = new URL(request.url, 'http://localhost').pathname;
    if (path.startsWith('/api/auth/sign-up')) return reply.code(403).send({ error: 'Public registration is disabled.' });
    const base = process.env.BETTER_AUTH_URL;
    if (!base) throw new Error('Authentication is not configured');
    const response = await getAuth().handler(new Request(new URL(request.url, base), { method: request.method, headers: fromNodeHeaders(request.headers), ...(request.body ? { body: JSON.stringify(request.body) } : {}) }));
    reply.code(response.status);
    response.headers.forEach((value, key) => { if (key !== 'set-cookie') reply.header(key, value); });
    const cookies = response.headers.getSetCookie(); if (cookies.length) reply.header('set-cookie', cookies);
    return reply.send(await response.text());
  } });
  app.get('/api/admin/users', async request => {
    const actor = authorize(await principal(request.headers), 'users:manage');
    const db = getDatabase();
    const [users, settings] = await Promise.all([db.user.findMany({ where: { studioId: actor.studioId }, select: { id:true, name:true, role:true, status:true, twoFactorEnabled:true }, orderBy: { name:'asc' }, take:100 }), db.studioSettings.findUnique({ where: { studioId:actor.studioId }, select: { maintenance:true } })]);
    return { users, maintenance:settings?.maintenance ?? false };
  });
  app.get('/api/me', async request => { const actor = await principal(request.headers); return { id: actor.id, role: actor.role, twoFactorEnabled: actor.twoFactorEnabled }; });
  app.get('/api/opportunities', async request => opportunityDal(getDatabase()).list(await principal(request.headers), request.query));
  app.post('/api/opportunities', async request => opportunityDal(getDatabase()).create(await principal(request.headers), request.body));
  app.patch<{ Params: { id: string } }>('/api/admin/users/:id/status', async request => administrationDal(getDatabase()).setUserStatus(await principal(request.headers), request.params.id, request.body));
  app.put('/api/admin/maintenance', async request => administrationDal(getDatabase()).setMaintenance(await principal(request.headers), request.body));
  app.get('/api/health/live', async () => ({ status: 'ok' }));
  return app;
}
