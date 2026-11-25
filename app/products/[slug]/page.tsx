import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Check, FileSpreadsheet, FileText, Printer, ShieldCheck } from 'lucide-react';
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
      title: 'Product Not Found | Studio OS',
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
      <header className="border-b border-border/80 bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5 text-sm font-semibold tracking-tight">
            <StudioLogoMark className="size-6 text-primary" />
            <span>Dockly</span>
          </Link>
          <span className="rounded-md border border-border bg-muted/60 px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {product.category}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10 sm:py-12">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-md border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            <span>{product.statusLabel}</span>
            <span aria-hidden="true">·</span>
            <span>US Letter &amp; A4</span>
          </div>

          <div className="max-w-3xl space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {product.title}
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground">
              {product.subtitle}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-xs">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Built for
            </h2>
            <p className="mt-1.5 text-sm font-medium text-foreground">{product.audience}</p>
            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {product.highlights.map(item => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/90">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <section className="mt-12 space-y-4" aria-labelledby="preview-gallery-heading">
          <div className="space-y-1">
            <h2 id="preview-gallery-heading" className="text-xl font-semibold tracking-tight">
              Look Inside Every Sheet
            </h2>
            <p className="text-sm text-muted-foreground">
              Switch pages below or click any sheet to zoom to full readable size. Purchased files come clean with no preview watermark.
            </p>
          </div>
          <ProductPreviewGallery sheets={resolvedSheets} />
        </section>

        <section className="mt-14 space-y-6" aria-labelledby="deliverables-heading">
          <div className="space-y-1">
            <h2 id="deliverables-heading" className="text-xl font-semibold tracking-tight">
              What&apos;s Included in the Toolkit
            </h2>
            <p className="text-sm text-muted-foreground">
              Every file is designed for clear desk and clipboard use — no subscriptions or macros required.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {product.deliverables.map((item, idx) => {
              const Icon = idx === 0 ? FileSpreadsheet : idx === 2 ? ShieldCheck : idx === 1 ? Printer : FileText;
              return (
                <article
                  key={item.name}
                  className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary">
                      <Icon className="size-4 shrink-0" aria-hidden="true" />
                      <span className="text-xs font-medium">{item.format}</span>
                    </div>
                    <h3 className="text-base font-semibold text-foreground">{item.name}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{item.summary}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="mt-16 border-t border-border/80 bg-muted/20">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>Studio OS · Practical digital operating templates</span>
          <span>No tracking pixels · Privacy-first pages</span>
        </div>
      </footer>
    </div>
  );
}
