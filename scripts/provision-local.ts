import 'dotenv/config';
import { randomBytes, randomUUID } from 'node:crypto';
import { writeFile, mkdir } from 'node:fs/promises';
import { hash } from '@node-rs/argon2';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
const url = process.env.PROVISION_DATABASE_URL;
if (!url || !['localhost', '127.0.0.1'].includes(new URL(url).hostname) || process.env.NODE_ENV === 'production') throw new Error('This provisioning script is local-only.');
const email = process.argv[2];
if (!email || !email.includes('@')) throw new Error('Pass the developer email address.');
const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });
try {
  if (await db.user.findUnique({ where: { email } })) throw new Error('Account already exists; it was not changed.');
  const password = randomBytes(24).toString('base64url');
  const userId = randomUUID();
  await db.user.create({ data: { id: userId, email, name: 'Studio developer', role: 'developer', status: 'active', studioId: 'studio-os', accounts: { create: { id: randomUUID(), providerId: 'credential', accountId: userId, password: await hash(password, { memoryCost: 19456, timeCost: 2, parallelism: 1 }) } } } });
  await mkdir('.local', { recursive: true, mode: 0o700 });
  await writeFile('.local/DEVELOPER-ACCESS.txt', `LOCAL DEVELOPMENT ACCESS ONLY\nURL: http://127.0.0.1:3000/sign-in\nEmail: ${email}\nPassword: ${password}\n\nSet up an authenticator on first access. Store your recovery codes securely. Do not reuse this password in production.\n`, { mode: 0o600, flag: 'wx' });
  console.log('Local developer account provisioned. Credentials saved in .local/DEVELOPER-ACCESS.txt (mode 600).');
} finally { await db.$disconnect(); }
