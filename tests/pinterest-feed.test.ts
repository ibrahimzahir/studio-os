import { describe, expect, it } from 'vitest';
import {
  pinterestFeedItems,
  renderPinterestRssXml,
  selectDuePins,
  escapeXml,
  type PinterestPin,
} from '../src/features/marketing/pinterest-feed';
import {
  buildProductOgMetadata,
  getPublicProductBySlug,
  publicProducts,
} from '../src/features/marketing/public-products';
import { contentSecurityPolicy } from '../src/server/security/headers';

const SITE = 'https://studio.ibrahimzahir.com';
const R2 = 'https://studio-assets.ibrahimzahir.com';
const FORBIDDEN_HOLIDAYS = /\b(christmas|easter|halloween|valentine|st\.?\s*patrick|thanksgiving|hanukkah)\b/i;

describe('Pinterest feed invariants & gating', () => {
  it('enforces unique ids, unique images, length limits, ascending schedule, and secular content', () => {
    expect(pinterestFeedItems.length).toBeGreaterThanOrEqual(4);

    const ids = new Set<string>();
    const r2Keys = new Set<string>();
    let prevTime = -Infinity;

    for (const pin of pinterestFeedItems) {
      expect(ids.has(pin.id)).toBe(false);
      ids.add(pin.id);

      expect(r2Keys.has(pin.r2Key)).toBe(false);
      r2Keys.add(pin.r2Key);

      expect(getPublicProductBySlug(pin.productSlug)).toBeDefined();
      expect(pin.title.length).toBeGreaterThan(10);
      expect(pin.title.length).toBeLessThanOrEqual(100);
      expect(pin.description.length).toBeGreaterThan(40);
      expect(pin.description.length).toBeLessThanOrEqual(500);
      expect(pin.altText.length).toBeGreaterThan(10);

      const ts = Date.parse(pin.publishAt);
      expect(Number.isNaN(ts)).toBe(false);
      expect(ts).toBeGreaterThan(prevTime);
      prevTime = ts;

      const combined = `${pin.board} ${pin.title} ${pin.description} ${pin.altText}`;
      expect(FORBIDDEN_HOLIDAYS.test(combined)).toBe(false);
    }
  });

  it('keeps initial draft pins gated (approved: false) so /rss.xml emits zero items before owner approval', () => {
    expect(pinterestFeedItems.every(p => p.approved === false)).toBe(true);
    const farFuture = new Date('2030-01-01T00:00:00Z');
    const xml = renderPinterestRssXml(pinterestFeedItems, {
      now: farFuture,
      siteOrigin: SITE,
      r2BaseUrl: R2,
    });
    expect(xml).toContain('<rss version="2.0"');
    expect(xml).not.toContain('<item>');
  });

  it('emits only approved and due pins newest-first, and filters by ?board= case-insensitively', () => {
    const sample: PinterestPin[] = [
      {
        id: 'pin-past-1',
        board: 'Mobile Detailing Business Pricing & Calculators',
        title: 'Pin 1 & Title <Test>',
        description: 'First approved pin description for testing RSS escaping "quotes" & amps.',
        altText: 'Preview 1',
        productSlug: 'mobile-detailing-planner',
        r2Key: 'pins/mobile-detailing/pin-01-job-costing-calculator.png',
        publishAt: '2026-11-25T10:00:00+05:00',
        approved: true,
      },
      {
        id: 'pin-past-2',
        board: 'Short-Term Rental Host Welcome Books',
        title: 'Pin 2 Title',
        description: 'Second approved pin on a different board.',
        altText: 'Preview 2',
        productSlug: 'mobile-detailing-planner',
        r2Key: 'pins/mobile-detailing/pin-02-service-menu-template.png',
        publishAt: '2026-11-26T10:00:00+05:00',
        approved: true,
      },
      {
        id: 'pin-future',
        board: 'Mobile Detailing Business Pricing & Calculators',
        title: 'Future Pin',
        description: 'Should not appear yet because publishAt is in the future.',
        altText: 'Preview 3',
        productSlug: 'mobile-detailing-planner',
        r2Key: 'pins/mobile-detailing/pin-03-vehicle-inspection-form.png',
        publishAt: '2026-12-10T10:00:00+05:00',
        approved: true,
      },
      {
        id: 'pin-unapproved',
        board: 'Mobile Detailing Business Pricing & Calculators',
        title: 'Unapproved Pin',
        description: 'Should never appear while approved is false.',
        altText: 'Preview 4',
        productSlug: 'mobile-detailing-planner',
        r2Key: 'pins/mobile-detailing/pin-04-complete-detailing-toolkit.png',
        publishAt: '2026-11-24T10:00:00+05:00',
        approved: false,
      },
    ];

    const now = new Date('2026-11-27T00:00:00+05:00');
    const allDue = selectDuePins(sample, now);
    expect(allDue.map(p => p.id)).toEqual(['pin-past-2', 'pin-past-1']);

    const detailingOnly = selectDuePins(sample, now, { board: 'detailing' });
    expect(detailingOnly.map(p => p.id)).toEqual(['pin-past-1']);

    const xml = renderPinterestRssXml(sample, {
      now,
      siteOrigin: SITE,
      r2BaseUrl: R2,
      board: 'detailing',
    });
    expect(xml).toContain('<guid isPermaLink="false">pin-past-1</guid>');
    expect(xml).toContain('<title>Pin 1 &amp; Title &lt;Test&gt;</title>');
    expect(xml).toContain(`url="${R2}/pins/mobile-detailing/pin-01-job-costing-calculator.png"`);
    expect(xml).toContain(`<link>${SITE}/products/mobile-detailing-planner</link>`);
    expect(xml).not.toContain('pin-past-2');
    expect(xml).not.toContain('pin-future');
    expect(xml).not.toContain('pin-unapproved');
  });

  it('escapes XML special characters safely', () => {
    expect(escapeXml(`A & B <C> "D" 'E'`)).toBe('A &amp; B &lt;C&gt; &quot;D&quot; &apos;E&apos;');
  });
});

describe('Public Rich Pin landing pages & CSP', () => {
  it('generates indexable Open Graph metadata pointing to R2 image', () => {
    const product = publicProducts[0]!;
    const meta = buildProductOgMetadata(product, SITE, R2);
    expect(meta.robots).toEqual({ index: true, follow: true });
    expect(meta.openGraph?.title).toBe(product.title);
    expect(meta.openGraph?.url).toBe(`${SITE}/products/${product.slug}`);
    expect(meta.openGraph?.images).toEqual([
      {
        url: `${R2}/${product.ogImageR2Key}`,
        width: 1000,
        height: 1500,
        alt: product.ogImageAlt,
      },
    ]);
  });

  it('adds only valid HTTPS R2 origin to production CSP img-src', () => {
    const prod = contentSecurityPolicy('abc', false, ['https://studio-assets.ibrahimzahir.com/pins', 'http://insecure.example', 'not-a-url']);
    expect(prod).toContain("img-src 'self' data: blob: https://studio-assets.ibrahimzahir.com;");
    expect(prod).not.toContain('insecure.example');
  });
});
