/**
 * Pinterest RSS Auto-Publish Schedule
 *
 * Non-negotiable rules (see pinterest-marketing playbook):
 * 1. NEVER change `id`, `productSlug`, or `publishAt` of a pin after it has been published.
 *    The `id` is the RSS `<guid>`; changing it republishes a duplicate pin.
 * 2. One unique `r2Key` (1000x1500 PNG/JPG under 500 KB) per pin.
 * 3. Pins remain gated (`approved: false`) until owner reviews and flips them live.
 * 4. Secular seasonal and evergreen topics only — no religious-holiday pins.
 */

export interface PinterestPin {
  readonly id: string;
  readonly board: string;
  readonly title: string;
  readonly description: string;
  readonly altText: string;
  readonly productSlug: string;
  readonly r2Key: string;
  readonly publishAt: string;
  readonly approved: boolean;
}

export const pinterestFeedItems: readonly PinterestPin[] = [
  {
    id: 'mdp-pin-01-job-costing',
    board: 'Mobile Detailing Business Pricing & Calculators',
    title: 'Mobile Detailing Job Costing Calculator – Price by Target Margin',
    description:
      'Calculate real mobile car detailing costs across labor hours, diluted chemicals, round-trip miles, and monthly overhead. Built-in target-margin formulas help prevent markup underpricing. Includes 3-tab Excel/Google Sheets workbook (no macros) and a quick-start guide. Built for independent mobile detailers. #mobiledetailing #detailingbusiness #jobcosting',
    altText:
      'Preview of the Mobile Detailing Job Costing Calculator and Margin vs. Markup guide showing a $100 job cost at 40% target margin yielding a $166.67 quoted price.',
    productSlug: 'mobile-detailing-planner',
    r2Key: 'pins/mobile-detailing/pin-01-job-costing-calculator.png',
    publishAt: '2026-11-25T18:00:00+05:00',
    approved: true,
  },
  {
    id: 'mdp-pin-02-service-menu',
    board: 'Mobile Detailing Business Pricing & Calculators',
    title: 'Mobile Car Detailing Service Menu Template – Printable PDF (US & A4)',
    description:
      'Present clear detailing packages by vehicle size (sedan, mid-size SUV, large SUV/truck) plus optional add-ons and upfront exclusions. Clean printable PDF with blank price slots so you enter your own calculator-derived rates. Prints cleanly in color or grayscale on US Letter and A4 paper. #cardetailing #servicemenu #smallbusinesstemplates',
    altText:
      'Preview of the printable Mobile Car Detailing Service Menu PDF showing Tier 1 Maintenance Wash, Tier 2 Interior Deep Clean, and Tier 3 Full Detail with blank vehicle-size price slots.',
    productSlug: 'mobile-detailing-planner',
    r2Key: 'pins/mobile-detailing/pin-02-service-menu-template.png',
    publishAt: '2026-11-26T18:00:00+05:00',
    approved: true,
  },
  {
    id: 'mdp-pin-03-vehicle-inspection',
    board: 'Mobile Detailing Business Pricing & Calculators',
    title: 'Pre-Service Vehicle Inspection Form – 1-Page Detailing Checklist',
    description:
      'Walk around every vehicle with customers before detailing begins. This 1-page clipboard-ready PDF includes an original 5-view exterior diagram, defect code legend (scratch, dent, chip, curb rash), interior condition checklist, and customer pre-service acknowledgment block. Grayscale print safe in US Letter and A4. #mobiledetailing #vehicleinspection #autodetailing',
    altText:
      'Preview of the 1-page Pre-Service Vehicle Inspection Checklist PDF featuring top, side, front, and rear car outlines, defect code legend, interior checklist, and signature lines.',
    productSlug: 'mobile-detailing-planner',
    r2Key: 'pins/mobile-detailing/pin-03-vehicle-inspection-form.png',
    publishAt: '2026-11-27T18:00:00+05:00',
    approved: true,
  },
  {
    id: 'mdp-pin-04-complete-toolkit',
    board: 'Mobile Detailing Business Pricing & Calculators',
    title: 'Mobile Detailing Business Planner – Calculator, Menu & Inspection Kit',
    description:
      'Organize quoting and on-site walkarounds without monthly software subscriptions. Includes a deterministic Excel/Google Sheets job-costing calculator, printable tiered service menu, 1-page vehicle inspection form, and 15-minute quick-start guide in US Letter and A4 formats. Designed for solo and small-crew mobile detailers. #mobiledetailingbusiness #smallbusinessplanner #detailing',
    altText:
      'Collage preview of the 4-file Mobile Detailing Business Planner showing the printable Service Menu, 1-page Vehicle Inspection Form, and Quick-Start Guide.',
    productSlug: 'mobile-detailing-planner',
    r2Key: 'pins/mobile-detailing/pin-04-complete-detailing-toolkit.png',
    publishAt: '2026-11-28T18:00:00+05:00',
    approved: true,
  },
];

export function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export function resolvePinUrls(pin: PinterestPin, siteOrigin: string, r2BaseUrl: string) {
  const cleanSite = siteOrigin.replace(/\/+$/, '');
  const cleanR2 = r2BaseUrl.replace(/\/+$/, '');
  const cleanKey = pin.r2Key.replace(/^\/+/, '');
  return {
    link: `${cleanSite}/products/${pin.productSlug}`,
    imageUrl: `${cleanR2}/${cleanKey}`,
    mediaType: cleanKey.toLowerCase().endsWith('.jpg') || cleanKey.toLowerCase().endsWith('.jpeg')
      ? 'image/jpeg'
      : 'image/png',
  };
}

export function selectDuePins(
  items: readonly PinterestPin[],
  now: Date,
  options: { readonly board?: string | undefined } = {},
): PinterestPin[] {
  const nowMs = now.getTime();
  const boardFilter = options.board?.trim().toLowerCase();

  return items
    .filter(pin => {
      if (!pin.approved) return false;
      const publishMs = Date.parse(pin.publishAt);
      if (Number.isNaN(publishMs) || publishMs > nowMs) return false;
      if (boardFilter && !pin.board.toLowerCase().includes(boardFilter)) return false;
      return true;
    })
    .sort((a, b) => Date.parse(b.publishAt) - Date.parse(a.publishAt));
}

export function renderPinterestRssXml(
  items: readonly PinterestPin[],
  options: {
    readonly now: Date;
    readonly siteOrigin: string;
    readonly r2BaseUrl: string;
    readonly board?: string | undefined;
  },
): string {
  const cleanSite = options.siteOrigin.replace(/\/+$/, '');
  const due = selectDuePins(items, options.now, { board: options.board });
  const channelTitle = options.board?.trim()
    ? `Studio OS Pinterest Feed – ${options.board.trim()}`
    : 'Studio OS Pinterest Feed';
  const selfLink = options.board?.trim()
    ? `${cleanSite}/rss.xml?board=${encodeURIComponent(options.board.trim())}`
    : `${cleanSite}/rss.xml`;

  const itemsXml = due
    .map(pin => {
      const { link, imageUrl, mediaType } = resolvePinUrls(pin, cleanSite, options.r2BaseUrl);
      const pubDate = new Date(pin.publishAt).toUTCString();
      return [
        '    <item>',
        `      <guid isPermaLink="false">${escapeXml(pin.id)}</guid>`,
        `      <title>${escapeXml(pin.title)}</title>`,
        `      <link>${escapeXml(link)}</link>`,
        `      <description>${escapeXml(pin.description)}</description>`,
        `      <category>${escapeXml(pin.board)}</category>`,
        `      <pubDate>${escapeXml(pubDate)}</pubDate>`,
        `      <enclosure url="${escapeXml(imageUrl)}" type="${mediaType}" length="0" />`,
        `      <media:content url="${escapeXml(imageUrl)}" medium="image" type="${mediaType}" width="1000" height="1500" />`,
        '    </item>',
      ].join('\n');
    })
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escapeXml(channelTitle)}</title>`,
    `    <link>${escapeXml(cleanSite)}</link>`,
    '    <description>Approved digital product templates, calculators, and printable operating toolkits from Studio OS.</description>',
    '    <language>en-us</language>',
    `    <atom:link href="${escapeXml(selfLink)}" rel="self" type="application/rss+xml" />`,
    `    <lastBuildDate>${escapeXml(options.now.toUTCString())}</lastBuildDate>`,
    ...(itemsXml ? [itemsXml] : []),
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
}
