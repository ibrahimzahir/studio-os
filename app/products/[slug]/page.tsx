import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowDown,
  ArrowUpRight,
  Calculator,
  Check,
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
      <header className="sticky top-0 z-30 border-b border-border/80 bg-card/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3.5">
          <Link href="/" className="flex items-center gap-2.5 text-sm font-semibold tracking-tight">
            <StudioLogoMark className="size-6 text-primary" />
            <span>Dockly</span>
          </Link>
          <div className="flex items-center gap-3">
            <a
              href="#preview-gallery"
              className="hidden text-xs font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline"
            >
              Preview sheets
            </a>
            <a
              href="#whats-included"
              className="hidden text-xs font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline"
            >
              What&apos;s included
            </a>
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
                href="#buy-card"
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-xs transition-opacity hover:opacity-95"
              >
                <span>Get Toolkit — ${product.priceUsd.toFixed(2)}</span>
              </a>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10 sm:py-14">
        {/* Hero + Purchase Card */}
        <section className="grid gap-8 lg:grid-cols-[1.35fr_0.85fr] lg:items-start">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-3 py-1 text-xs font-medium text-primary">
              <span>{product.category}</span>
              <span aria-hidden="true">·</span>
              <span>US Letter &amp; A4</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {product.title}
              </h1>
              <p className="text-base leading-relaxed text-muted-foreground">
                {product.subtitle}
              </p>
            </div>

            {/* Concrete math callout */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 sm:p-5">
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

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href="#preview-gallery"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-xs transition-colors hover:bg-muted"
              >
                <span>Inspect all 5 full-size sheets</span>
                <ArrowDown className="size-4 text-primary" />
              </a>
              <span className="text-xs text-muted-foreground">
                No account required · Clean unwatermarked files on purchase
              </span>
            </div>
          </div>

          {/* Purchase Card */}
          <aside
            id="buy-card"
            className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:sticky lg:top-20"
          >
            <div className="flex items-baseline justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  {product.statusLabel}
                </p>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold tracking-tight text-foreground">
                    ${product.priceUsd.toFixed(2)}
                  </span>
                  <span className="text-xs text-muted-foreground">USD one-time</span>
                </div>
              </div>
              <span className="rounded-md border border-border bg-muted/60 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                Instant ZIP
              </span>
            </div>

            <p className="mt-2 text-xs text-muted-foreground">{product.fileCountLabel}</p>

            <ul className="mt-5 space-y-2.5 border-y border-border py-5">
              {product.highlights.map(item => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/90">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 space-y-2.5">
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
                  href="#preview-gallery"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-xs transition-opacity hover:opacity-95"
                >
                  <Download className="size-4" />
                  <span>Checkout Opening Soon — Preview Full Kit</span>
                </a>
              )}
              <p className="text-center text-xs text-muted-foreground">
                {checkoutUrl
                  ? 'Secure checkout · Instant download link after payment · No login required'
                  : 'Payment gateway is being finalized — browse every full-resolution sheet below'}
              </p>
            </div>
          </aside>
        </section>

        {/* Full-resolution interactive preview gallery */}
        <section id="preview-gallery" className="mt-14 scroll-mt-20 space-y-4" aria-labelledby="preview-gallery-heading">
          <div className="space-y-1">
            <h2 id="preview-gallery-heading" className="text-2xl font-bold tracking-tight">
              Look Inside Every Sheet
            </h2>
            <p className="text-sm text-muted-foreground">
              Switch pages below or click any sheet to zoom to 100% readable size. Purchased downloads come clean with no preview watermark.
            </p>
          </div>
          <ProductPreviewGallery sheets={resolvedSheets} />
        </section>

        {/* Upgraded scannable deliverables */}
        <section id="whats-included" className="mt-16 scroll-mt-20 space-y-6" aria-labelledby="deliverables-heading">
          <div className="space-y-1">
            <h2 id="deliverables-heading" className="text-2xl font-bold tracking-tight">
              What&apos;s Included in Your Download
            </h2>
            <p className="text-sm text-muted-foreground">
              Four tightly coordinated tools designed for real desk quoting and clipboard walkarounds — zero subscriptions or macros.
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

        {/* 3-Step Workflow */}
        <section className="mt-16 rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h2 className="text-xl font-bold tracking-tight">From Download to Your Next Quote in 15 Minutes</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {[
              {
                step: 'Step 1',
                title: 'Enter Your Real Costs',
                body: 'Plug your hourly rate, diluted chemicals, mileage, and monthly overhead into the 3-tab Excel/Sheets calculator.',
              },
              {
                step: 'Step 2',
                title: 'Lock Your Service Menu',
                body: 'Drop your target-margin prices into the clean 2-page Service Menu (US Letter or A4) by vehicle size.',
              },
              {
                step: 'Step 3',
                title: 'Walk Around & Quote',
                body: 'Clip the 1-page Vehicle Inspection Form to your board, mark pre-existing defects together, and get sign-off.',
              },
            ].map(s => (
              <div key={s.step} className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">{s.step}</span>
                <h3 className="text-base font-semibold text-foreground">{s.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Buyer FAQ */}
        <section className="mt-16 space-y-5" aria-labelledby="faq-heading">
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
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>Dockly · Practical digital operating templates</span>
          <span>No tracking pixels · Privacy-first pages</span>
        </div>
      </footer>
    </div>
  );
}
