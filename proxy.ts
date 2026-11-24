import { NextResponse, type NextRequest } from 'next/server';
import { contentSecurityPolicy } from './src/server/security/headers';
export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const policy = contentSecurityPolicy(nonce, process.env.NODE_ENV !== 'production');
  const headers = new Headers(request.headers); headers.set('x-nonce', nonce); headers.set('Content-Security-Policy', policy);
  const response = NextResponse.next({ request: { headers } });
  response.headers.set('Content-Security-Policy', policy);
  if (process.env.NODE_ENV === 'production') response.headers.set('Strict-Transport-Security', 'max-age=15552000');
  return response;
}
export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] };
