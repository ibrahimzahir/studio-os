import { describe, expect, it, vi } from 'vitest';
import { authorize } from '../src/server/auth/authorization';
const fixture = vi.hoisted(() => ({ user: { id:'developer-id', name:'Developer display name', studioId:'studio-os', role:'developer', status:'active', twoFactorEnabled:true } }));
vi.mock('next/headers', () => ({ headers: async () => new Headers() }));
vi.mock('next/navigation', () => ({ redirect: (path:string) => { throw new Error(`Redirect:${path}`); } }));
vi.mock('../src/server/auth/config', () => ({ getAuth: () => ({ api: { getSession: async () => ({ user:{id:fixture.user.id}, session:{createdAt:new Date()} }) } }) }));
vi.mock('../src/server/database/client', () => ({ getDatabase: () => ({ user:{findUnique:async()=>fixture.user}, studioSettings:{findUnique:async()=>null} }) }));
import { requireUser } from '../src/server/auth/current-user';
describe('page session to DAL principal', () => {
  it('keeps display fields out of the strict authorization principal', async () => {
    vi.stubEnv('DATABASE_URL','postgresql://local/test'); vi.stubEnv('BETTER_AUTH_SECRET','test-only'); vi.stubEnv('BETTER_AUTH_URL','http://127.0.0.1:3000');
    try {
      const principal = await requireUser();
      expect(() => authorize(principal,'opportunities:read')).not.toThrow();
      expect(principal).not.toHaveProperty('name');
      expect(authorize(principal,'users:manage').role).toBe('developer');
    } finally { vi.unstubAllEnvs(); }
  });
});
