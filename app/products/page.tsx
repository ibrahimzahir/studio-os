import type { Metadata } from 'next';
import Link from 'next/link';
import { Eye } from 'lucide-react';
import {
  getPublicSiteOrigin,
  getR2PublicBaseUrl,
  publicProducts,
} from '@/features/marketing/public-products';
import { StudioLogoMark } from '@/components/shared/studio-logo';

export const metadata: Metadata = {
  title: 'Dockly Templates — Business Calculators, Menus & Printable Operating Kits',
  description:
    'Browse print-ready US Letter & A4 PDF templates and macro-free Excel/Google Sheets calculators built for independent service businesses.',
  robots: { index: true, follow: true },
  alternates: { canonical: `${getPublicSiteOrigin()}/products` },
};

export default function ProductsCatalogPage() {
  const r2Base = getR2PublicBaseUrl();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/80 bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/products" className="flex items-center gap-2.5 text-sm font-semibold tracking-tight">
            <StudioLogoMark className="size-6 text-primary" />
            <span>Dockly</span>
          </Link>
          <span className="text-xs font-medium text-muted-foreground">
            US Letter &amp; A4 · Zero Subscriptions
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Dockly Business Templates &amp; Calculators
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            Preview every sheet before you buy. Deterministic Excel/Sheets calculators and print-safe US Letter &amp; A4 PDFs built for solo pros and small teams.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {publicProducts.map(product => {
            const coverSheet = product.previewSheets[0];
            const thumbUrl = coverSheet
              ? `${r2Base}/${coverSheet.r2Key}`
              : `${r2Base}/${product.ogImageR2Key}`;

            return (
              <article
                key={product.slug}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xs transition-all hover:border-primary/40 hover:shadow-md"
              >
                <Link
                  href={`/products/${product.slug}`}
                  className="relative block aspect-[4/3] overflow-hidden border-b border-border bg-[#E9EDF7] p-4 dark:bg-slate-900"
                >
                  <div className="mx-auto h-full w-4/5 overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition-transform duration-200 group-hover:scale-[1.02]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={thumbUrl}
                      alt={product.title}
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                  <span className="absolute top-1/2 left-1/2 inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full bg-slate-900/85 px-3.5 py-1.5 text-xs font-semibold text-white opacity-0 shadow-md backdrop-blur-xs transition-opacity group-hover:opacity-100">
                    <Eye className="size-3.5" />
                    <span>Preview</span>
                  </span>
                </Link>

                <div className="flex flex-1 flex-col justify-between p-5">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                        {product.category}
                      </span>
                      <span className="text-sm font-bold text-foreground">
                        ${product.priceUsd.toFixed(2)}
                      </span>
                    </div>
                    <h2 className="text-base font-semibold tracking-tight text-foreground">
                      <Link href={`/products/${product.slug}`} className="hover:text-primary">
                        {product.title}
                      </Link>
                    </h2>
                    <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {product.subtitle}
                    </p>
                  </div>

                  <Link
                    href={`/products/${product.slug}`}
                    className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-primary/35 bg-primary/5 px-3.5 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    Preview &amp; Details
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </main>
    </div>
  );
}
