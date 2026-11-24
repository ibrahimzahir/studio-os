import { NextRequest, NextResponse } from 'next/server';
import {
  pinterestFeedItems,
  renderPinterestRssXml,
} from '@/features/marketing/pinterest-feed';
import {
  getPublicSiteOrigin,
  getR2PublicBaseUrl,
} from '@/features/marketing/public-products';

export const dynamic = 'force-dynamic';

export function GET(request: NextRequest) {
  const board = request.nextUrl.searchParams.get('board') ?? undefined;
  const xml = renderPinterestRssXml(pinterestFeedItems, {
    now: new Date(),
    siteOrigin: getPublicSiteOrigin(),
    r2BaseUrl: getR2PublicBaseUrl(),
    board,
  });

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
      'X-Robots-Tag': 'noindex',
    },
  });
}
