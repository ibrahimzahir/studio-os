import { describe, expect, it } from 'vitest';
import { trustedOrigins } from '../src/server/auth/origins';
describe('local authentication origins', () => {
  it('allows only the equivalent development loopback address on the configured port', () => {
    const allowed = trustedOrigins('http://127.0.0.1:3000', true);
    expect(allowed).toContain('http://localhost:3000');
    expect(allowed).not.toContain('http://localhost:3001');
    expect(allowed).not.toContain('https://evil.example');
    expect(trustedOrigins('http://localhost:3000', true)).toContain('http://127.0.0.1:3000');
  });
  it('never adds development aliases in production or to public origins', () => {
    expect(trustedOrigins('http://127.0.0.1:3000', false)).toEqual(['http://127.0.0.1:3000']);
    expect(trustedOrigins('https://studio.example.com', true)).toEqual(['https://studio.example.com']);
  });
});
