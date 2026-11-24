import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { requireUser } from '@/server/auth/current-user';

const PRODUCT_ROOTS: Record<string, string> = {
  'mobile-detailing': path.resolve(process.cwd(), 'antigravity', 'mobile-detailing', 'output', 'v0.1.0-draft'),
  'str-welcome-guide': path.resolve(process.cwd(), 'antigravity', 'str-welcome-guide', 'output', 'v0.1.0-draft'),
};

const ALLOWED_SUBDIRS = new Set(['', 'previews', 'pinterest']);
const SAFE_FILENAME = /^[a-z0-9][a-z0-9.-]*\.(png|pdf|xlsx)$/;

const CONTENT_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.pdf': 'application/pdf',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string[] }> },
) {
  await requireUser();
  const forceDownload = new URL(request.url).searchParams.get('download') === '1';

  const { slug } = await context.params;
  if (!Array.isArray(slug) || slug.length < 1 || slug.length > 3) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  let productKey = 'mobile-detailing';
  let rest = slug;
  if (slug[0] && slug[0] in PRODUCT_ROOTS) {
    productKey = slug[0];
    rest = slug.slice(1);
  }

  if (rest.length < 1 || rest.length > 2) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const root = PRODUCT_ROOTS[productKey]!;
  const subdir = rest.length === 2 ? rest[0]! : '';
  const filename = rest[rest.length - 1]!;

  if (!ALLOWED_SUBDIRS.has(subdir) || !SAFE_FILENAME.test(filename)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const resolved = path.resolve(root, subdir, filename);
  if (!resolved.startsWith(root + path.sep)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const ext = path.extname(filename).toLowerCase();
  const contentType = CONTENT_TYPES[ext];
  if (!contentType) {
    return NextResponse.json({ error: 'Unsupported media type' }, { status: 415 });
  }

  try {
    const bytes = await readFile(resolved);
    return new NextResponse(bytes, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition':
          forceDownload || ext === '.xlsx'
            ? `attachment; filename="${filename}"`
            : `inline; filename="${filename}"`,
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
