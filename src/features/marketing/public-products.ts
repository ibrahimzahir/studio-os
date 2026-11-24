import type { Metadata } from 'next';

export interface ProductDeliverable {
  readonly name: string;
  readonly format: string;
  readonly summary: string;
}

export interface PublicProduct {
  readonly slug: string;
  readonly title: string;
  readonly subtitle: string;
  readonly description: string;
  readonly audience: string;
  readonly category: string;
  readonly statusLabel: string;
  readonly ogImageR2Key: string;
  readonly ogImageAlt: string;
  readonly deliverables: readonly ProductDeliverable[];
  readonly highlights: readonly string[];
}

export const DEFAULT_PUBLIC_SITE_ORIGIN = 'https://studio.ibrahimzahir.com';
export const DEFAULT_R2_PUBLIC_BASE_URL = 'https://assets.studio.ibrahimzahir.com';

export function getPublicSiteOrigin(): string {
  return (process.env.PUBLIC_SITE_ORIGIN || process.env.BETTER_AUTH_URL || DEFAULT_PUBLIC_SITE_ORIGIN).replace(/\/+$/, '');
}

export function getR2PublicBaseUrl(): string {
  return (process.env.R2_PUBLIC_BASE_URL || DEFAULT_R2_PUBLIC_BASE_URL).replace(/\/+$/, '');
}

export const publicProducts: readonly PublicProduct[] = [
  {
    slug: 'mobile-detailing-planner',
    title: 'Mobile Detailing Business Planner – Calculator, Menu & Inspection Kit',
    subtitle: 'Quote accurately by target margin and run consistent on-site walkarounds without monthly software subscriptions.',
    description:
      'Deterministic 3-tab Excel and Google Sheets job-costing calculator (no macros), printable tiered service menu, 1-page pre-service vehicle inspection checklist with 5-view outline, and 15-minute quick-start guide in US Letter and A4 formats.',
    audience: 'Solo operators and small-crew mobile auto detailers',
    category: 'Operations & Pricing Toolkit',
    statusLabel: 'Pre-launch preview',
    ogImageR2Key: 'pins/mobile-detailing/pin-04-complete-detailing-toolkit.png',
    ogImageAlt:
      'Collage preview of the 4-file Mobile Detailing Business Planner showing the printable Service Menu, 1-page Vehicle Inspection Form, and Quick-Start Guide.',
    deliverables: [
      {
        name: 'Job Costing & Target-Margin Calculator',
        format: 'Excel (.xlsx) & Google Sheets — 3 tabs, 57 formulas, zero macros',
        summary:
          'Tracks labor hours, diluted chemical cost per ounce, round-trip mileage, and monthly overhead with target-margin pricing formulas to prevent markup underpricing.',
      },
      {
        name: 'Tiered Service Menu Template',
        format: 'Printable PDF — US Letter & A4 (color + grayscale safe)',
        summary:
          'Three structured detailing tiers by vehicle size (sedan, mid-size SUV, large SUV/truck) with optional add-ons, upfront exclusions, and blank rate slots for your own calculator-derived prices.',
      },
      {
        name: 'Pre-Service Vehicle Inspection Form',
        format: '1-Page Clipboard PDF — US Letter & A4',
        summary:
          'Original 5-view exterior vehicle outline (top, sides, front, rear), defect code legend (scratch, dent, chip, curb rash), interior condition checklist, and customer acknowledgment block.',
      },
      {
        name: '15-Minute Quick-Start Guide',
        format: 'Printable PDF — US Letter & A4',
        summary:
          'Step-by-step setup walkthrough covering target margin vs. markup math, chemical dilution inputs, and first-job walkaround workflow.',
      },
    ],
    highlights: [
      'Deterministic spreadsheet formulas — no macros, no external links, works offline',
      'Both US Letter (8.5 × 11 in) and A4 (210 × 297 mm) print-ready PDFs included',
      'Tested for clean black-and-white clipboard printing as well as color',
      'Built for independent mobile detailing businesses — no subscription required',
    ],
  },
];

export function getPublicProductBySlug(slug: string): PublicProduct | undefined {
  return publicProducts.find(product => product.slug === slug);
}

export function buildProductOgMetadata(
  product: PublicProduct,
  siteOrigin: string = getPublicSiteOrigin(),
  r2BaseUrl: string = getR2PublicBaseUrl(),
): Metadata {
  const cleanSite = siteOrigin.replace(/\/+$/, '');
  const cleanR2 = r2BaseUrl.replace(/\/+$/, '');
  const canonicalUrl = `${cleanSite}/products/${product.slug}`;
  const ogImageUrl = `${cleanR2}/${product.ogImageR2Key}`;

  return {
    title: product.title,
    description: product.description,
    robots: { index: true, follow: true },
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: 'website',
      title: product.title,
      description: product.description,
      url: canonicalUrl,
      siteName: 'Studio OS',
      images: [
        {
          url: ogImageUrl,
          width: 1000,
          height: 1500,
          alt: product.ogImageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: product.description,
      images: [ogImageUrl],
    },
  };
}
