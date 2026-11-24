import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { randomUUID, randomBytes, createHmac } from 'node:crypto';
import { hash } from '@node-rs/argon2';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { authorize, requireSensitiveAccess, type Principal } from '../src/server/auth/authorization';
import { opportunityDal } from '../src/server/dal/opportunities';
import { administrationDal } from '../src/server/dal/administration';
import { buildApi } from '../src/server/api/app';
const integration = process.env.TEST_DATABASE_URL ? describe : describe.skip;
const principal: Principal = { id: 'dev', studioId: 'a', role: 'developer', status: 'active', twoFactorEnabled: true, sessionCreatedAt: new Date() };
describe('default-deny authorization', () => {
  it('denies anonymous, blocked and suspended users', () => {
    expect(() => authorize(null, 'opportunities:read')).toThrow();
    for (const status of ['blocked','suspended'] as const) expect(() => authorize({ ...principal, status }, 'opportunities:read')).toThrow();
  });
  it('permits developers and restricts staff/viewers', () => {
    expect(authorize(principal, 'users:manage').role).toBe('developer');
    expect(() => authorize({ ...principal, role: 'staff' }, 'users:manage')).toThrow();
    expect(() => authorize({ ...principal, role: 'viewer' }, 'opportunities:write')).toThrow();
    expect(authorize({ ...principal, role: 'staff' }, 'opportunities:write').role).toBe('staff');
  });
  it('requires 2FA and a recent session for sensitive operations', () => {
    expect(() => requireSensitiveAccess({ ...principal, twoFactorEnabled: false })).toThrow();
    expect(() => requireSensitiveAccess({ ...principal, sessionCreatedAt: new Date(0) })).toThrow();
  });
});
function totp(secret: string) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'; let bits = '';
  for (const char of secret.replace(/=+$/, '').toUpperCase()) bits += alphabet.indexOf(char).toString(2).padStart(5,'0');
  const key = Buffer.from((bits.match(/.{8}/g) ?? []).map(byte => parseInt(byte,2)));
  const counter = Buffer.alloc(8); counter.writeBigUInt64BE(BigInt(Math.floor(Date.now()/30000)));
  const digest = createHmac('sha1', key).update(counter).digest(); const offset = digest[19]! & 15;
  return String((digest.readUInt32BE(offset) & 0x7fffffff) % 1000000).padStart(6,'0');
}
integration('real PostgreSQL security boundaries', () => {
  const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.TEST_DATABASE_URL! }) });
  const app = buildApi(); const studioId = randomUUID(); const userId = randomUUID(); const email = `${userId}@example.com`; const password = randomBytes(24).toString('base64url');
  const actor = { ...principal, id: userId, studioId }; const origin = 'http://127.0.0.1:3000';
  let cookie = ''; let recovery = '';
  function cookies(headers: Record<string, unknown>) { const rows = headers['set-cookie']; return (Array.isArray(rows) ? rows : rows ? [rows] : []).map(v => String(v).split(';')[0]).join('; '); }
  async function request(path: string, body: unknown, sessionCookie = cookie) { return app.inject({ method: 'POST', url: `/api/auth/${path}`, headers: { origin, cookie: sessionCookie }, payload: body }); }
  beforeAll(async () => {
    if (!new URL(process.env.TEST_DATABASE_URL!).pathname.endsWith('_test')) throw new Error('Security integration tests require an isolated *_test database');
    await db.rateLimit.deleteMany();
    await db.user.create({ data: { id: userId, name: 'Security fixture', email, studioId, role: 'developer', accounts: { create: { id: randomUUID(), accountId: userId, providerId: 'credential', password: await hash(password, { memoryCost:19456, timeCost:2, parallelism:1 }) } } } });
  });
  afterAll(async () => { await app.close(); await db.opportunity.deleteMany({ where: { studioId } }); await db.studioSettings.deleteMany({ where: { studioId } }); await db.auditEvent.deleteMany({ where: { studioId } }); await db.user.delete({ where: { id: userId } }); await db.$disconnect(); });
  it('rejects public registration and untrusted origins', async () => {
    expect((await request('sign-up/email', { email, password, name:'No signup' })).statusCode).toBe(403);
    expect((await app.inject({ method:'POST', url:'/api/opportunities', headers:{ origin:'https://evil.example' }, payload:{} })).statusCode).toBe(403);
  });
  it('rejects unauthenticated access and invalid credentials', async () => {
    expect((await app.inject({ method:'GET', url:'/api/opportunities' })).statusCode).toBe(401);
    expect((await request('sign-in/email', { email, password:'invalid-password' })).statusCode).toBe(401);
  });
  it('enrolls TOTP, blocks unenrolled data access and enforces the sign-in challenge', async () => {
    const login = await request('sign-in/email', { email, password }); expect(login.statusCode).toBe(200); cookie = cookies(login.headers);
    expect((await app.inject({ method:'GET', url:'/api/opportunities', headers:{ cookie } })).statusCode).toBe(403);
    const enable = await request('two-factor/enable', { password }); expect(enable.statusCode).toBe(200);
    const setup = enable.json(); const secret = new URL(setup.totpURI).searchParams.get('secret')!; recovery = setup.backupCodes[0];
    cookie = cookies(enable.headers) || cookie;
    const verify = await request('two-factor/verify-totp', { code:totp(secret), trustDevice:false }); expect(verify.statusCode).toBe(200); cookie = cookies(verify.headers) || cookie;
    expect((await db.user.findUniqueOrThrow({ where:{ id:userId } })).twoFactorEnabled).toBe(true);
    expect((await app.inject({ method:'GET', url:'/api/opportunities', headers:{ cookie } })).statusCode).toBe(200);
    await request('sign-out', {});
    const challenge = await request('sign-in/email', { email, password }, ''); expect(challenge.statusCode).toBe(200); expect(challenge.json().twoFactorRedirect).toBe(true); cookie = cookies(challenge.headers);
    expect((await app.inject({ method:'GET', url:'/api/opportunities', headers:{ cookie } })).statusCode).toBe(401);
    const recover = await request('two-factor/verify-backup-code', { code:recovery, trustDevice:false }); expect(recover.statusCode).toBe(200); cookie = cookies(recover.headers);
  });
  it('scopes reads and strips private fields, rejects mass assignment', async () => {
    const dal = opportunityDal(db);
    await db.opportunity.create({ data:{ studioId, title:'Private fixture', audience:'Test audience', category:'operations', internalNotes:'never expose this' } });
    const result = await dal.list(actor, {}); expect(result.total).toBe(1); expect(result.items[0]).not.toHaveProperty('internalNotes'); expect(result.items[0]).not.toHaveProperty('studioId');
    expect((await dal.list({ ...actor, studioId:randomUUID() }, {})).total).toBe(0);
    await expect(dal.create(actor, { title:'New product', audience:'Test audience', category:'operations', studioId:'injected' })).rejects.toThrow();
  });
  it('audits maintenance, prevents staff administration and revokes suspended sessions', async () => {
    const admin = administrationDal(db); const staffId = randomUUID();
    await db.user.create({ data: { id:staffId, name:'Staff fixture', email:`${staffId}@example.com`, studioId, role:'staff' } });
    await db.session.create({ data:{ id:randomUUID(), userId:staffId, token:randomUUID(), expiresAt:new Date(Date.now()+60000) } });
    await expect(admin.setMaintenance({ ...actor, role:'staff' }, { maintenance:true, message:'Testing' })).rejects.toThrow();
    await admin.setMaintenance(actor, { maintenance:true, message:'Testing' });
    expect(await db.auditEvent.count({ where:{ studioId, action:'maintenance.enabled' } })).toBe(1);
    await admin.setUserStatus(actor, staffId, { status:'suspended' });
    expect(await db.session.count({ where:{ userId:staffId } })).toBe(0);
    expect((await db.user.findUniqueOrThrow({ where:{ id:staffId } })).status).toBe('suspended');
    await expect(admin.setUserStatus(actor, userId, { status:'blocked' })).rejects.toThrow();
    await db.user.delete({ where:{ id:staffId } });
  });
  it('database roles cannot read credential or TOTP secrets through the application connection', async () => {
    const restricted = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
    try {
      await expect(restricted.account.findMany()).rejects.toThrow(/permission denied/i);
      await expect(restricted.twoFactor.findMany()).rejects.toThrow(/permission denied/i);
      await expect(restricted.user.findMany({ select:{ email:true } })).rejects.toThrow(/permission denied/i);
      const rows = await db.$queryRaw<Array<{ rolname:string; rolsuper:boolean; rolbypassrls:boolean }>>`SELECT rolname, rolsuper, rolbypassrls FROM pg_roles WHERE rolname IN ('studio_app', 'studio_auth')`;
      expect(rows).toHaveLength(2); expect(rows.every(r=>!r.rolsuper&&!r.rolbypassrls)).toBe(true);
    } finally { await restricted.$disconnect(); }
  });
});
