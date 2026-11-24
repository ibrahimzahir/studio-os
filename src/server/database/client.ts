import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
let database: PrismaClient | undefined;
let authenticationDatabase: PrismaClient | undefined;
export function getDatabase() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('Database is not configured');
  return database ??= new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}
export function getAuthDatabase() {
  const connectionString = process.env.AUTH_DATABASE_URL ?? (process.env.NODE_ENV !== 'production' ? process.env.DATABASE_URL : undefined);
  if (!connectionString) throw new Error('Authentication database is not configured');
  return authenticationDatabase ??= new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}
