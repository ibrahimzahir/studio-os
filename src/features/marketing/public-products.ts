import type { Metadata } from 'next';

export interface ProductDeliverable {
  readonly number: string;
  readonly name: string;
  readonly format: string;
  readonly summary: string;
  readonly bullets: readonly string[];
}

export interface ProductFaq {
  readonly question: string;
  readonly answer: string;
}

export interface ProductPreviewSheet {
  readonly id: string;
  readonly label: string;
  readonly caption: string;
  readonly r2Key: string;
  readonly width: number;
  readonly height: number;
}

export interface PublicProduct {
  readonly slug: string;
  readonly title: string;
  readonly subtitle: string;
  readonly description: string;
  readonly priceUsd: number;
  readonly fileCountLabel: string;
  readonly checkoutUrl?: string;
  readonly audience: string;
  readonly category: string;
  readonly statusLabel: string;
  readonly ogImageR2Key: string;
  readonly ogImageAlt: string;
  readonly previewSheets: readonly ProductPreviewSheet[];
  readonly deliverables: readonly ProductDeliverable[];
  readonly highlights: readonly string[];
  readonly faqs: readonly ProductFaq[];
}

export const DEFAULT_PUBLIC_SITE_ORIGIN = 'https://studio.ibrahimzahir.com';
export const DEFAULT_R2_PUBLIC_BASE_URL = 'https://studio-assets.ibrahimzahir.com';

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
    subtitle: 'Stop guessing prices or losing profit to markup math. Quote every vehicle by target margin and run professional clipboard walkarounds — zero monthly software fees.',
    description:
      'Deterministic 3-tab Excel and Google Sheets job-costing calculator (no macros), printable tiered service menu, 1-page pre-service vehicle inspection checklist with 5-view outline, and 15-minute quick-start guide in US Letter and A4 formats.',
    priceUsd: 24.99,
    fileCountLabel: '7 files · Excel/Sheets + US Letter & A4 PDFs',
    audience: 'Solo operators and small-crew mobile auto detailers',
    category: 'Operations & Pricing Toolkit',
    statusLabel: 'One-Time Purchase · No Subscription',
    ogImageR2Key: 'pins/mobile-detailing/pin-04-complete-detailing-toolkit.png',
    ogImageAlt:
      'Collage preview of the 4-file Mobile Detailing Business Planner showing the printable Service Menu, 1-page Vehicle Inspection Form, and Quick-Start Guide.',
    previewSheets: [
      {
        id: 'service-menu-1',
        label: '1. Service Menu (Packages)',
        caption: 'Tiered detailing packages by vehicle size (sedan, mid-size SUV, large SUV/truck) with blank price slots.',
        r2Key: 'previews/mobile-detailing/01-service-menu-packages.png',
        width: 1275,
        height: 1650,
      },
      {
        id: 'service-menu-2',
        label: '2. Add-Ons & Exclusions',
        caption: 'Optional add-on services, upfront scope exclusions, and customer booking policies (Page 2 of Service Menu).',
        r2Key: 'previews/mobile-detailing/02-service-menu-addons.png',
        width: 1275,
        height: 1650,
      },
      {
        id: 'vehicle-inspection',
        label: '3. Vehicle Inspection Form',
        caption: '1-page clipboard walkaround sheet with 5-view exterior diagram, defect legend, interior checklist & sign-off.',
        r2Key: 'previews/mobile-detailing/03-vehicle-inspection-form.png',
        width: 1700,
        height: 2200,
      },
      {
        id: 'quick-start-1',
        label: '4. Quick-Start Setup',
        caption: '15-minute setup guide covering all 4 deliverables, spreadsheet inputs, and first-job walkaround steps.',
        r2Key: 'previews/mobile-detailing/04-quick-start-setup.png',
        width: 1275,
        height: 1650,
      },
      {
        id: 'margin-math',
        label: '5. Margin vs. Markup Math',
        caption: 'Exact target-margin pricing breakdown showing why a $100 job at 40% margin quotes at $166.67 (not $140).',
        r2Key: 'previews/mobile-detailing/05-margin-vs-markup-math.png',
        width: 1275,
        height: 1650,
      },
    ],
    deliverables: [
      {
        number: '01',
        name: 'Job Costing & Target-Margin Calculator',
        format: 'Excel (.xlsx) & Google Sheets · 3 tabs · 57 formulas',
        summary: 'Know your exact break-even cost and target-margin quote before you load the van.',
        bullets: [
          'Tracks labor hours, diluted chemical cost per ounce, mileage & monthly overhead',
          'Uses true target-margin formulas ($100 cost at 40% margin = $166.67, not $140)',
          'Zero macros or external links — works 100% offline in Excel, LibreOffice & Sheets',
        ],
      },
      {
        number: '02',
        name: 'Tiered Service Menu Template',
        format: 'Printable PDF · US Letter & A4 · 2 pages',
        summary: 'Present clean, confidence-building packages instead of texting messy price lists.',
        bullets: [
          '3 clear tiers by vehicle size: Sedan, Mid-Size SUV, and Large SUV / Truck',
          'Dedicated Page 2 for optional add-ons, upfront exclusions & booking policies',
          'Blank rate slots so you drop in your own calculator-derived prices',
        ],
      },
      {
        number: '03',
        name: 'Pre-Service Vehicle Inspection Form',
        format: '1-Page Clipboard PDF · US Letter & A4',
        summary: 'Protect your business and document pre-existing damage in 3 minutes on-site.',
        bullets: [
          'Original 5-view exterior diagram (top, left, right, front & rear) + defect legend',
          'Interior condition check, valuables check & agreed package summary',
          'Customer pre-service sign-off block with clipboard-safe 0.78 in top margin',
        ],
      },
      {
        number: '04',
        name: '15-Minute Quick-Start Guide',
        format: 'Printable PDF · US Letter & A4 · 3 pages',
        summary: 'Go from download to your first accurately priced detailing quote in 15 minutes.',
        bullets: [
          '3-step setup walkthrough for baseline costs, service menu & clipboard sheets',
          'Plain-English Margin vs. Markup reference table with worked examples',
          'Grayscale & color print settings for crisp office or home printing',
        ],
      },
    ],
    highlights: [
      'Deterministic spreadsheet formulas — no macros, no external links, works offline',
      'Both US Letter (8.5 × 11 in) and A4 (210 × 297 mm) print-ready PDFs included',
      'Tested for clean black-and-white clipboard printing as well as color',
      'One-time download — zero recurring SaaS subscriptions',
    ],
    faqs: [
      {
        question: 'Does the calculator work in both Microsoft Excel and Google Sheets?',
        answer: 'Yes. The workbook uses standard deterministic spreadsheet formulas with zero macros and zero external links, so it opens cleanly in Excel, Google Sheets, and LibreOffice Calc.',
      },
      {
        question: 'Are both US Letter and A4 paper sizes included?',
        answer: 'Yes. Every PDF (Service Menu, 1-Page Vehicle Inspection Form, and Quick-Start Guide) is included in both US Letter (8.5 × 11 in) and international A4 (210 × 297 mm) formats.',
      },
      {
        question: 'Will the forms print clearly on a black-and-white printer?',
        answer: 'Yes. Every sheet was designed and verified in grayscale with high-contrast lines and a generous top clipboard margin so you can print stacks cheaply for daily jobs.',
      },
      {
        question: 'Is this a monthly subscription?',
        answer: 'No. It is a single one-time purchase with instant digital file download and no recurring fees.',
      },
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
