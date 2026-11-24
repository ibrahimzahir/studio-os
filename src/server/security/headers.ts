function safeOrigin(raw: string | undefined, allowHttp: boolean): string | null {
  if (!raw) return null;
  try {
    const parsed = new URL(raw);
    if (parsed.protocol === 'https:' || (allowHttp && parsed.protocol === 'http:')) {
      return parsed.origin;
    }
    return null;
  } catch {
    return null;
  }
}

export function contentSecurityPolicy(nonce: string, development: boolean, extraImgOrigins: readonly (string | undefined)[] = []) {
  const imgSources = ["'self'", 'data:', 'blob:'];
  for (const candidate of extraImgOrigins) {
    const origin = safeOrigin(candidate, development);
    if (origin && !imgSources.includes(origin)) imgSources.push(origin);
  }
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${development ? " 'unsafe-eval'" : ''}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src ${imgSources.join(' ')}`,
    "font-src 'self'",
    `connect-src 'self'${development ? ' ws: wss:' : ''}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(development ? [] : ['upgrade-insecure-requests']),
  ].join('; ');
}
