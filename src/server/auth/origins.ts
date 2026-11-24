export function trustedOrigins(baseURL: string, development: boolean): string[] {
  const base = new URL(baseURL);
  const origins = [base.origin];
  if (development && base.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(base.hostname)) {
    const alias = new URL(base.origin);
    alias.hostname = base.hostname === 'localhost' ? '127.0.0.1' : 'localhost';
    origins.push(alias.origin);
  }
  return origins;
}
