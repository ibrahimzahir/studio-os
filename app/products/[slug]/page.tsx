import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowUpRight,
  Calculator,
  Check,
  ChevronRight,
  Download,
  FileSpreadsheet,
  FileText,
  Printer,
  ShieldCheck,
} from 'lucide-react';
import {
  buildProductOgMetadata,
  getPublicProductBySlug,
  getR2PublicBaseUrl,
} from '@/features/marketing/public-products';
import { StudioLogoMark } from '@/components/shared/studio-logo';
import {
  ProductPreviewGallery,
  type ResolvedPreviewSheet,
} from '@/features/marketing/components/product-preview-gallery';
import { LiveBrandCustomizer } from '@/features/marketing/components/live-brand-customizer';

interface PageProps {
  readonly params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getPublicProductBySlug(slug);
  if (!product) {
    return {
      title: 'Product Not Found | Dockly',
      robots: { index: false, follow: false },
    };
  }
  return buildProductOgMetadata(product);
}

export default async function PublicProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getPublicProductBySlug(slug);
  if (!product) notFound();

  const r2Base = getR2PublicBaseUrl();
  const checkoutUrl = product.checkoutUrl || process.env.PRODUCT_CHECKOUT_URL?.trim() || undefined;

  const resolvedSheets: ResolvedPreviewSheet[] = product.previewSheets.map(sheet => ({
    id: sheet.id,
    label: sheet.label,
    caption: sheet.caption,
    imageUrl: `${r2Base}/${sheet.r2Key}`,
    width: sheet.width,
    height: sheet.height,
  }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/80 bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-6">
            <Link href="/products" className="flex items-center gap-2.5 text-sm font-semibold tracking-tight">
              <StudioLogoMark className="size-6 text-primary" />
              <span>Dockly</span>
            </Link>
            <nav className="hidden items-center gap-4 text-xs font-medium text-muted-foreground sm:flex">
              <Link href="/products" className="transition-colors hover:text-foreground">
                All Templates
              </Link>
              <a href="#overview" className="transition-colors hover:text-foreground">
                Overview
              </a>
              <a href="#whats-included" className="transition-colors hover:text-foreground">
                Included Files
              </a>
              <a href="#faq" className="transition-colors hover:text-foreground">
                FAQ
              </a>
            </nav>
          </div>
          {checkoutUrl ? (
            <a
              href={checkoutUrl}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-xs transition-opacity hover:opacity-95"
            >
              <span>Buy — ${product.priceUsd.toFixed(2)}</span>
              <ArrowUpRight className="size-3.5" />
            </a>
          ) : (
            <a
              href="#whats-included"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-xs transition-opacity hover:opacity-95"
            >
              <span>See All Files</span>
            </a>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8 sm:py-10">
        {/* Jotform-inspired Above-the-Fold Split Hero: Left Live Document Preview | Right Title & CTA */}
        <section className="grid gap-8 lg:grid-cols-[1.45fr_0.95fr] lg:items-start">
          <div>
            <ProductPreviewGallery sheets={resolvedSheets} />
          </div>

          <aside className="space-y-6 lg:sticky lg:top-20">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-medium text-primary">
              <Link href="/products" className="hover:underline">
                Templates
              </Link>
              <ChevronRight className="size-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">{product.category}</span>
            </nav>

            {/* Title & Subtitle */}
            <div className="space-y-3">
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {product.title}
              </h1>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {product.subtitle}
              </p>
            </div>

            {/* Price & Primary CTA Box */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
              <div className="flex items-baseline justify-between gap-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold tracking-tight text-foreground">
                    ${product.priceUsd.toFixed(2)}
                  </span>
                  <span className="text-xs text-muted-foreground">USD one-time</span>
                </div>
                <span className="rounded-md border border-primary/20 bg-primary/8 px-2.5 py-1 text-xs font-medium text-primary">
                  No subscription
                </span>
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">{product.fileCountLabel}</p>

              <div className="mt-4">
                {checkoutUrl ? (
                  <a
                    href={checkoutUrl}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-xs transition-opacity hover:opacity-95"
                  >
                    <Download className="size-4" />
                    <span>Buy &amp; Instant Download — ${product.priceUsd.toFixed(2)}</span>
                  </a>
                ) : (
                  <a
                    href="#whats-included"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-xs transition-opacity hover:opacity-95"
                  >
                    <Download className="size-4" />
                    <span>Checkout Opening Soon — Inspect Kit</span>
                  </a>
                )}
              </div>

              <p className="mt-2.5 text-center text-[11px] text-muted-foreground">
                {checkoutUrl
                  ? 'Instant ZIP download after payment · Clean unwatermarked files · No account needed'
                  : 'Purchased ZIP includes clean unwatermarked PDFs (US Letter & A4) + Excel/Sheets workbook'}
              </p>
            </div>

            {/* Key Specs */}
            <ul className="space-y-2.5 border-t border-border pt-5">
              {product.highlights.map(item => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/90">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </aside>
        </section>

        {/* Sub-navigation Tabs Bar (Jotform-style Overview / Customize Live / Included Files / FAQ) */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-3">
          <div className="flex flex-wrap items-center gap-2">
            {product.slug === 'mobile-detailing-planner' && (
              <a
                href="#customize-live"
                className="rounded-full bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary"
              >
                Customize Live
              </a>
            )}
            <a
              href="#overview"
              className="rounded-full px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Overview
            </a>
            <a
              href="#whats-included"
              className="rounded-full px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Included Files (4)
            </a>
            <a
              href="#faq"
              className="rounded-full px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              FAQ
            </a>
          </div>
          <Link
            href="/products"
            className="text-xs font-medium text-primary hover:underline"
          >
            Browse all templates →
          </Link>
        </div>

        {/* Live Brand & Price Customizer */}
        {product.slug === 'mobile-detailing-planner' && (
          <section id="customize-live" className="mt-8 scroll-mt-20">
            <LiveBrandCustomizer />
          </section>
        )}

        {/* Overview + Math Callout */}
        <section id="overview" className="mt-8 grid gap-8 scroll-mt-20 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight">About this toolkit</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
              <div className="flex items-start gap-3">
                <Calculator className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                <div className="space-y-1 text-sm">
                  <p className="font-semibold text-foreground">
                    Why markup math quietly costs detailers $26+ per job
                  </p>
                  <p className="leading-relaxed text-muted-foreground">
                    A $100 job cost marked up 40% quotes at <span className="font-semibold text-foreground">$140.00</span> (only 28.6% margin). At a true 40% target margin, the exact quote is <span className="font-semibold text-primary">$166.67</span>. Our calculator computes this automatically across labor, chemicals, mileage, and overhead.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Template Details
            </h3>
            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between gap-4 border-b border-border/60 pb-2">
                <dt className="text-muted-foreground">Built for</dt>
                <dd className="text-right font-medium text-foreground">Mobile auto detailers</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-border/60 pb-2">
                <dt className="text-muted-foreground">Formats</dt>
                <dd className="text-right font-medium text-foreground">XLSX + US Letter &amp; A4 PDF</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-border/60 pb-2">
                <dt className="text-muted-foreground">Compatibility</dt>
                <dd className="text-right font-medium text-foreground">Excel, Sheets, LibreOffice</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Print mode</dt>
                <dd className="text-right font-medium text-foreground">Color &amp; Grayscale safe</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* Included Files */}
        <section id="whats-included" className="mt-14 scroll-mt-20 space-y-6" aria-labelledby="deliverables-heading">
          <div className="space-y-1">
            <h2 id="deliverables-heading" className="text-2xl font-bold tracking-tight">
              What&apos;s Included in Your Download
            </h2>
            <p className="text-sm text-muted-foreground">
              Four coordinated tools built for desk quoting and clipboard walkarounds — zero macros or recurring software fees.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {product.deliverables.map((item, idx) => {
              const Icon = idx === 0 ? FileSpreadsheet : idx === 2 ? ShieldCheck : idx === 1 ? Printer : FileText;
              return (
                <article
                  key={item.name}
                  className="flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-xs transition-colors hover:border-primary/35"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-md border border-primary/20 bg-primary/8 px-2.5 py-1 text-xs font-medium text-primary">
                        <Icon className="size-3.5 shrink-0" aria-hidden="true" />
                        <span>{item.format}</span>
                      </span>
                      <span className="text-xs font-bold tabular-nums text-muted-foreground/70">
                        {item.number}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold tracking-tight text-foreground">{item.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{item.summary}</p>
                    </div>
                    <ul className="space-y-2 border-t border-border/80 pt-3">
                      {item.bullets.map(bullet => (
                        <li key={bullet} className="flex items-start gap-2 text-sm text-foreground/90">
                          <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mt-14 scroll-mt-20 space-y-5" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-2xl font-bold tracking-tight">
            Common Questions
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {product.faqs.map(faq => (
              <div key={faq.question} className="rounded-xl border border-border bg-card p-5">
                <h3 className="text-sm font-semibold text-foreground">{faq.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="mt-16 border-t border-border/80 bg-muted/20">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>Dockly · Practical digital operating templates</span>
          <span>No tracking pixels · Privacy-first pages</span>
        </div>
      </footer>
    </div>
  );
}
