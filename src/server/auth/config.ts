import { trustedOrigins } from './origins';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { twoFactor } from 'better-auth/plugins/two-factor';
import { hash, verify } from '@node-rs/argon2';
import { getAuthDatabase } from '../database/client';
export function createAuth() {
  const secret = process.env.BETTER_AUTH_SECRET;
  const baseURL = process.env.BETTER_AUTH_URL;
  if (!secret || secret.length < 32 || !baseURL) throw new Error('Authentication configuration is incomplete');
  const origin = new URL(baseURL);
  if (baseURL !== origin.origin) throw new Error('Authentication URL must be an origin without a path');
  if (process.env.NODE_ENV === 'production' && origin.protocol !== 'https:') throw new Error('Production authentication requires HTTPS');
  if (origin.protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(origin.hostname)) throw new Error('Authentication requires HTTPS');
  return betterAuth({
    appName: 'Studio OS', secret, baseURL, trustedOrigins: trustedOrigins(baseURL, process.env.NODE_ENV !== 'production'),
    database: prismaAdapter(getAuthDatabase(), { provider: 'postgresql' }),
    emailAndPassword: { enabled: true, disableSignUp: true, minPasswordLength: 12, maxPasswordLength: 128,
      password: { hash: password => hash(password, { memoryCost: 19456, timeCost: 2, parallelism: 1 }), verify: ({ hash: encoded, password }) => verify(encoded, password) } },
    user: { additionalFields: { role: { type: ['developer', 'staff', 'viewer'], defaultValue: 'viewer', input: false }, status: { type: ['active', 'suspended', 'blocked'], defaultValue: 'active', input: false }, studioId: { type: 'string', input: false } } },
    session: { expiresIn: 43200, updateAge: 3600, freshAge: 600, cookieCache: { enabled: false } },
    rateLimit: { enabled: true, storage: 'database', window: 60, max: 60, customRules: { '/sign-in/email': { window: 60, max: 5 }, '/two-factor/*': { window: 60, max: 5 } } },
    plugins: [twoFactor({ issuer: 'Studio OS' })],
    databaseHooks: { session: { create: { before: async session => {
      const user = await getAuthDatabase().user.findUnique({ where: { id: session.userId }, select: { status: true } });
      return user?.status === 'active' ? { data: session } : false;
    } } } },
  });
}
export type Auth = ReturnType<typeof createAuth>;
let auth: Auth | undefined;
export function getAuth() { return auth ??= createAuth(); }
