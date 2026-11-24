import {
  AlertTriangleIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  ChartNoAxesCombinedIcon,
  CheckCheckIcon,
  CheckCircle2Icon,
  DatabaseIcon,
  DownloadIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  HardDriveDownloadIcon,
  ImageIcon,
  LockKeyholeIcon,
  ScanSearchIcon,
  SearchIcon,
  SendIcon,
  ServerIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { OpportunityPage } from '@/contracts/opportunities';
import { DeveloperControls } from '@/features/administration/components/developer-controls';
import { PublishingScheduleCard } from '@/features/dashboard/components/publishing-schedule-card';
import { CreateOpportunity } from '@/features/opportunities/components/create-opportunity';
import { OpportunityRadar } from '@/features/opportunities/components/opportunity-radar';
import type { DraftManifest, DraftManifestWithKey } from '@/server/drafts/load-draft-manifest';

const PRODUCT_SIGNALS: Record<
  string,
  {
    displayName: string;
    seasonality: { kind: 'evergreen' | 'seasonal'; badge: string; peak: string };
    keywords: readonly string[];
  }
> = {
  'str-welcome-guide': {
    displayName: 'Short-Term Rental Guest Welcome Book',
    seasonality: {
      kind: 'evergreen',
      badge: 'Evergreen',
      peak: 'Spring / Summer travel',
    },
    keywords: [
      'airbnb welcome book template',
      'short term rental guest guide',
      'vacation rental checkout',
    ],
  },
  'mobile-detailing-planner': {
    displayName: 'Mobile Detailing Planner',
    seasonality: {
      kind: 'evergreen',
      badge: 'Evergreen',
      peak: 'Spring / Summer',
    },
    keywords: [
      'mobile detailing calculator',
      'detailing service menu',
      'vehicle inspection form',
    ],
  },
};

function formatKb(bytes: number) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

const VISUAL_PREVIEWS = [
  {
    title: 'STR Guest Welcome Book (New)',
    subtitle: '4-page US Letter & A4 · Researched #1',
    img: '/studio/draft-assets/str-welcome-guide/previews/guest-welcome-book-us-letter-1.png',
    pdf: '/studio/draft-assets/str-welcome-guide/guest-welcome-book-us-letter.pdf',
  },
  {
    title: 'STR Checkout & Turnover',
    subtitle: 'Guest checklist + host restock',
    img: '/studio/draft-assets/str-welcome-guide/previews/guest-welcome-book-us-letter-4.png',
    pdf: '/studio/draft-assets/str-welcome-guide/guest-welcome-book-us-letter.pdf',
  },
  {
    title: 'Detailing Inspection (1 Page)',
    subtitle: 'Original 5-view vector diagram',
    img: '/studio/draft-assets/previews/vehicle-inspection-us-letter-1.png',
    pdf: '/studio/draft-assets/vehicle-inspection-us-letter.pdf',
  },
  {
    title: 'Detailing Margin vs Markup',
    subtitle: 'Canonical $100 @ 40% worked math',
    img: '/studio/draft-assets/previews/quick-start-guide-us-letter-2.png',
    pdf: '/studio/draft-assets/quick-start-guide-us-letter.pdf',
  },
] as const;

const stages = [
  { step: '01', title: 'Research', detail: 'Verify buyer pain and multi-source demand', icon: SearchIcon },
  { step: '02', title: 'Review', detail: 'Approve scope, price, and budget', icon: CheckCheckIcon },
  { step: '03', title: 'Create', detail: 'Produce files and pins with Antigravity', icon: SparklesIcon },
  { step: '04', title: 'Quality', detail: 'Recalculate formulas and inspect pages', icon: ShieldCheckIcon },
  { step: '05', title: 'Release', detail: 'Approve public promotion and schedule', icon: SendIcon },
];

const sectionCopy = {
  overview: {
    title: 'Studio overview',
    subtitle: 'Track product hypotheses, evidence gates, and publishing readiness in one place.',
  },
  opportunities: {
    title: 'Opportunity radar',
    subtitle: 'Capture buyer problems and compare verified evidence before starting production.',
  },
  pipeline: {
    title: 'Production pipeline',
    subtitle: 'Every product moves through gated review steps with explicit owner approval.',
  },
  marketing: {
    title: 'Marketing schedule',
    subtitle: 'Four daily Pinterest RSS windows. Only approved assets with live landing pages qualify.',
  },
  analytics: {
    title: 'Analytics',
    subtitle: 'Measured revenue, operating costs, and outbound clicks — never fabricated estimates.',
  },
  operations: {
    title: 'Health & backups',
    subtitle: 'Infrastructure status, storage boundaries, and verified backup recovery state.',
  },
} as const;

export function Dashboard({
  initial,
  preview = false,
  developer = false,
  canCreate = false,
  section = 'overview',
  draftPackage = null,
  draftPackages,
}: {
  initial: OpportunityPage;
  preview?: boolean;
  developer?: boolean;
  canCreate?: boolean;
  section?: 'overview' | 'opportunities' | 'pipeline' | 'marketing' | 'analytics' | 'operations';
  draftPackage?: DraftManifest | null;
  draftPackages?: DraftManifestWithKey[];
}) {
  const allPackages: DraftManifestWithKey[] =
    draftPackages && draftPackages.length > 0
      ? draftPackages
      : draftPackage
        ? [{ ...draftPackage, assetRootKey: 'mobile-detailing' }]
        : [];
  const empty = initial.total === 0;
  const heading = sectionCopy[section];
  const showWorkbench = ['overview', 'opportunities', 'marketing', 'analytics'].includes(section);
  const showPrimary = ['overview', 'opportunities'].includes(section);
  const showRail = ['overview', 'marketing', 'analytics'].includes(section);

  return (
    <div className="flex flex-col gap-7">
      {/* Workspace Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border/70 pb-5">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-[26px]">
              {heading.title}
            </h1>
            <Badge variant="outline" className="gap-1.5 font-normal text-muted-foreground">
              {preview ? (
                'Sample workspace'
              ) : (
                <>
                  <LockKeyholeIcon className="size-3" aria-hidden="true" />
                  Private workspace
                </>
              )}
            </Badge>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{heading.subtitle}</p>
        </div>

        {(canCreate || preview) && ['overview', 'opportunities'].includes(section) && (
          <CreateOpportunity preview={preview} />
        )}
      </div>

      {/* Main Workbench Grid */}
      {showWorkbench && (
        <div
          className={
            section === 'overview'
              ? 'grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_400px]'
              : 'flex flex-col gap-7'
          }
        >
          {showPrimary && (
            <div className="flex min-w-0 flex-col gap-7">
              {/* Calm, Elevated Next-Action Focal Surface */}
              <Card className="overflow-hidden border-border/90 border-t-2 border-t-primary shadow-xs">
                <CardContent className="grid gap-6 p-6 md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] md:items-center md:p-7">
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                      <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
                      Next step
                    </div>
                    <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                      {empty
                        ? 'Start with one concrete buyer problem.'
                        : 'Validate demand before starting production.'}
                    </h2>
                    <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
                      {empty
                        ? 'Capture a product hypothesis to begin gathering fresh multi-platform evidence and pricing research.'
                        : `${initial.total} ${initial.total === 1 ? 'opportunity is' : 'opportunities are'} tracked in your radar. Gather fresh evidence and owner approval before building commercial assets.`}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      {empty && (canCreate || preview) ? (
                        <CreateOpportunity preview={preview} />
                      ) : (
                        <Button nativeButton={false} render={<a href="/studio/opportunities" />}>
                          Review opportunities
                          <ArrowRightIcon data-icon="inline-end" />
                        </Button>
                      )}
                      <Button variant="outline" nativeButton={false} render={<a href="/studio/pipeline" />}>
                        View pipeline stages
                      </Button>
                    </div>
                  </div>

                  {/* Honest, Compact Studio Snapshot (replaces decorative cartoon) */}
                  <div className="grid min-w-0 grid-cols-1 gap-2 rounded-xl border border-border/80 bg-muted/45 p-3.5 sm:grid-cols-3 md:grid-cols-1">
                    <div className="flex items-center justify-between gap-2 rounded-lg bg-card px-3.5 py-2.5 shadow-2xs sm:flex-col sm:items-start md:flex-row md:items-center">
                      <span className="text-xs font-medium text-muted-foreground">Opportunities</span>
                      <span className="text-lg font-semibold tabular-nums text-foreground">
                        {initial.total}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 rounded-lg bg-card px-3.5 py-2.5 shadow-2xs sm:flex-col sm:items-start md:flex-row md:items-center">
                      <span className="text-xs font-medium text-muted-foreground">Draft packages</span>
                      <span className="text-lg font-semibold tabular-nums text-foreground">
                        {draftPackage ? '2 (9 files)' : '0'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 rounded-lg bg-card px-3.5 py-2.5 shadow-2xs sm:flex-col sm:items-start md:flex-row md:items-center">
                      <span className="text-xs font-medium text-muted-foreground">Daily Pin slots</span>
                      <span className="text-lg font-semibold tabular-nums text-foreground">0 / 4</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Opportunity Radar Section */}
              <Card id="radar" className="border-border/90 shadow-xs">
                <CardHeader className="flex flex-row items-start justify-between gap-4 border-b border-border/70 pb-4">
                  <div className="flex items-start gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                      <ScanSearchIcon className="size-4" aria-hidden="true" />
                    </span>
                    <div>
                      <CardTitle className="text-base font-semibold tracking-tight">Opportunity radar</CardTitle>
                      <CardDescription className="mt-0.5 text-sm">
                        {empty
                          ? 'Your research shortlist starts here.'
                          : 'Unvalidated hypotheses awaiting fresh demand evidence and review.'}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="tabular-nums">
                    {initial.total} {initial.total === 1 ? 'item' : 'items'}
                  </Badge>
                </CardHeader>
                <CardContent className="p-5 md:p-6">
                  <OpportunityRadar key={initial.total} initial={initial} preview={preview} />
                </CardContent>
              </Card>

              {/* Visual Gallery of Generated Experimental Drafts (Overview, Authenticated Only) */}
              {section === 'overview' && !preview && draftPackage && (
                <Card className="border-border/90 shadow-xs">
                  <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 border-b border-border/70 pb-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <CardTitle className="text-base font-semibold tracking-tight">
                          Generated draft previews ({draftPackage.revision})
                        </CardTitle>
                        <Badge variant="secondary">{draftPackage.status}</Badge>
                      </div>
                      <CardDescription className="mt-0.5 text-sm">
                        Visual preview of Mobile Detailing Planner PDFs and 4 Pinterest drafts. Click any sheet to open
                        the full PDF.
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" nativeButton={false} render={<a href="/studio/pipeline" />}>
                      All 7 files &amp; QA
                      <ArrowRightIcon data-icon="inline-end" />
                    </Button>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4 p-5 sm:grid-cols-4">
                    {VISUAL_PREVIEWS.map((item) => (
                      <a
                        key={item.title}
                        href={item.pdf}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex flex-col overflow-hidden rounded-lg border border-border/80 bg-card transition-colors duration-150 hover:border-primary/40"
                      >
                        <div className="aspect-[8.5/11] w-full overflow-hidden border-b border-border/70 bg-muted/30">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.img}
                            alt={item.title}
                            loading="lazy"
                            className="size-full object-cover object-top transition-transform duration-200 group-hover:scale-[1.02]"
                          />
                        </div>
                        <div className="p-2.5">
                          <div className="truncate text-xs font-semibold text-foreground">{item.title}</div>
                          <div className="mt-0.5 truncate text-[11px] text-muted-foreground">{item.subtitle}</div>
                        </div>
                      </a>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Right Rail: Publishing + Performance */}
          {showRail && (
            <aside className="flex flex-col gap-6" aria-label="Studio priorities">
              {['overview', 'marketing'].includes(section) && (
                <PublishingScheduleCard canConfigure={developer || preview} preview={preview} />
              )}

              {section === 'marketing' && draftPackage && (
                <Card className="border-border/90 shadow-xs">
                  <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 border-b border-border/70 pb-4">
                    <div className="flex items-start gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                        <ImageIcon className="size-4" aria-hidden="true" />
                      </span>
                      <div>
                        <CardTitle className="text-base font-semibold tracking-tight">
                          Pinterest draft batch ({draftPackage.revision})
                        </CardTitle>
                        <CardDescription className="mt-0.5 text-sm">
                          Four unique 1000×1500 PNG drafts generated for {draftPackage.productSlug}. Private drafts — not
                          uploaded or published.
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary">{draftPackage.status}</Badge>
                  </CardHeader>
                  <CardContent className="grid gap-5 p-6 sm:grid-cols-2 lg:grid-cols-4">
                    {draftPackage.pinterestDrafts.map((pin) => (
                      <div
                        key={pin.id}
                        className="flex flex-col justify-between overflow-hidden rounded-xl border border-border/80 bg-card"
                      >
                        {!preview && (
                          <a
                            href={`/studio/draft-assets/${pin.filename}`}
                            target="_blank"
                            rel="noreferrer"
                            className="block aspect-[2/3] w-full overflow-hidden border-b border-border/70 bg-muted/30"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={`/studio/draft-assets/${pin.filename}`}
                              alt={pin.altText}
                              loading="lazy"
                              className="size-full object-cover transition-transform duration-200 hover:scale-[1.02]"
                            />
                          </a>
                        )}
                        <div className="flex flex-1 flex-col justify-between gap-3 p-4">
                          <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <Badge variant="outline" className="text-[11px] font-normal text-muted-foreground">
                                {pin.proposedBoard}
                              </Badge>
                              <span className="text-[11px] tabular-nums text-muted-foreground">
                                {pin.width}×{pin.height} · {formatKb(pin.byteSize)}
                              </span>
                            </div>
                            <h3 className="text-sm font-semibold text-foreground">{pin.title}</h3>
                            <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                              {pin.description}
                            </p>
                          </div>
                          <div className="space-y-2 border-t border-border/60 pt-2.5 text-[11px] text-muted-foreground">
                            <div className="flex items-center justify-between gap-2">
                              <span>Potential virality</span>
                              <span className="font-medium text-foreground">Unclassified</span>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-mono">{pin.sha256.slice(0, 10)}</span>
                              <Badge variant="secondary" className="text-[10px]">
                                Draft review
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {['overview', 'analytics'].includes(section) && (
                <Card id="analytics" className="border-border/90 shadow-xs">
                  <CardHeader className="flex flex-row items-center justify-between gap-3 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex size-8 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                        <ChartNoAxesCombinedIcon className="size-4" aria-hidden="true" />
                      </span>
                      <CardTitle className="text-base font-semibold tracking-tight">Performance</CardTitle>
                    </div>
                    <Badge variant="outline" className="font-normal text-muted-foreground">
                      No data
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Connect storefront orders and cookie-free analytics to measure real revenue, margin, and outbound
                      Pinterest clicks.
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {['Revenue', 'Profit', 'Clicks'].map((label) => (
                        <div
                          key={label}
                          className="rounded-lg border border-dashed border-border bg-muted/30 px-2.5 py-2.5 text-center"
                        >
                          <div className="text-xs text-muted-foreground">{label}</div>
                          <div className="mt-1 text-sm font-medium tabular-nums text-muted-foreground">—</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </aside>
          )}
        </div>
      )}

      {/* Production Pipeline Route (/studio/pipeline) */}
      {section === 'pipeline' && (
        <div className="flex flex-col gap-7">
          {/* Compact, Crisp 5-Stage Process Strip */}
          <Card id="pipeline" className="border-border/90 shadow-xs">
            <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 border-b border-border/70 px-6 py-4">
              <CardTitle className="text-base font-semibold tracking-tight">Production stages</CardTitle>
              <Badge variant="secondary" className="font-medium">
                {allPackages.length} {allPackages.length === 1 ? 'draft package' : 'draft packages'}
              </Badge>
            </CardHeader>
            <CardContent className="p-5">
              <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {stages.map((stage) => (
                  <li
                    key={stage.title}
                    className="flex items-start gap-3 rounded-lg border border-border/70 bg-muted/25 px-3.5 py-3"
                  >
                    <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                      <stage.icon className="size-3.5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-medium tabular-nums text-muted-foreground">{stage.step}</span>
                        <h3 className="text-sm font-semibold text-foreground">{stage.title}</h3>
                      </div>
                      <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{stage.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Clean, Executive-Grade Draft Package Cards */}
          {allPackages.map((pkg) => {
            const signal = PRODUCT_SIGNALS[pkg.productSlug];
            const displayName = signal?.displayName ?? pkg.productSlug;
            const keywords = signal?.keywords ?? [];
            const seasonality = signal?.seasonality ?? {
              kind: 'evergreen' as const,
              badge: 'Evergreen',
              peak: 'Year-round',
            };
            const assetBase = `/studio/draft-assets/${pkg.assetRootKey}`;
            const hasSpreadsheet = pkg.artifacts.some((a) => a.filename.endsWith('.xlsx'));

            return (
              <Card key={`${pkg.productSlug}-${pkg.revision}`} className="border-border/90 shadow-xs">
                <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4 border-b border-border/70 px-6 py-5">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <CardTitle className="text-lg font-semibold tracking-tight text-foreground">
                        {displayName}
                      </CardTitle>
                      <Badge variant="secondary" className="font-medium">
                        Draft review
                      </Badge>
                      <Badge variant={seasonality.kind === 'seasonal' ? 'default' : 'outline'} className="font-normal">
                        {seasonality.badge}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {pkg.revision} · Experimental bundle · Auto-publish off
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-lg font-semibold tabular-nums text-foreground">
                        ${pkg.testPriceHypothesisUsd.toFixed(2)}
                      </div>
                      <div className="text-[11px] text-muted-foreground">Test bundle price</div>
                    </div>
                    {pkg.pinterestDrafts.length > 0 && (
                      <Button variant="outline" size="sm" nativeButton={false} render={<a href="/studio/marketing" />}>
                        {pkg.pinterestDrafts.length} Pin drafts
                        <ArrowRightIcon data-icon="inline-end" />
                      </Button>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6 p-6">
                  {/* Compact 3-Metric Status Row + Clean Keyword Line */}
                  <div className="space-y-3 rounded-xl border border-border/70 bg-muted/25 p-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div>
                        <span className="block text-xs text-muted-foreground">Demand status</span>
                        <span className="mt-0.5 block text-sm font-medium text-foreground">
                          {pkg.demandValidated ? 'Validated' : 'Unvalidated'}
                        </span>
                      </div>
                      <div>
                        <span className="block text-xs text-muted-foreground">Downloads &amp; trend</span>
                        <span className="mt-0.5 block text-sm font-medium text-foreground">
                          Not measured · Unclassified
                        </span>
                      </div>
                      <div>
                        <span className="block text-xs text-muted-foreground">Seasonal peak</span>
                        <span className="mt-0.5 block text-sm font-medium text-foreground">{seasonality.peak}</span>
                      </div>
                    </div>

                    {keywords.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 border-t border-border/60 pt-3">
                        <span className="mr-1 text-xs text-muted-foreground">Keywords:</span>
                        {keywords.map((kw) => (
                          <Badge key={kw} variant="outline" className="bg-card text-xs font-normal text-muted-foreground">
                            {kw}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Deliverables + QA Side-by-Side */}
                  <div className="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-foreground">
                          Deliverables ({pkg.artifacts.length})
                        </h3>
                        <span className="text-xs text-muted-foreground">All included in bundle</span>
                      </div>
                      <div className="divide-y divide-border/70 rounded-xl border border-border/80 bg-card">
                        {pkg.artifacts.map((file) => {
                          const isSheet = file.filename.endsWith('.xlsx');
                          const fileUrl = `${assetBase}/${file.filename}`;
                          return (
                            <div
                              key={file.filename}
                              className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm"
                            >
                              <div className="flex min-w-0 items-center gap-2.5">
                                {isSheet ? (
                                  <FileSpreadsheetIcon className="size-4 shrink-0 text-primary" aria-hidden="true" />
                                ) : (
                                  <FileTextIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                                )}
                                <span className="truncate font-medium text-foreground">{file.filename}</span>
                                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                                  {formatKb(file.byteSize)}
                                </span>
                              </div>

                              {!preview && (
                                <div className="flex shrink-0 items-center gap-2">
                                  {!isSheet && (
                                    <Button
                                      variant="outline"
                                      size="xs"
                                      nativeButton={false}
                                      render={<a href={fileUrl} target="_blank" rel="noreferrer" />}
                                    >
                                      View
                                      <ArrowUpRightIcon data-icon="inline-end" />
                                    </Button>
                                  )}
                                  <Button
                                    variant="secondary"
                                    size="xs"
                                    nativeButton={false}
                                    render={<a href={`${fileUrl}?download=1`} download={file.filename} />}
                                  >
                                    <DownloadIcon data-icon="inline-start" />
                                    Download
                                  </Button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-3 rounded-xl border border-border/80 bg-card p-4">
                        <h3 className="text-sm font-semibold text-foreground">Quality checks</h3>
                        <ul className="space-y-2.5 text-xs">
                          <li className="flex items-center justify-between gap-2">
                            <span className="text-muted-foreground">PDF layout &amp; print sizes</span>
                            <span className="inline-flex items-center gap-1 font-medium text-primary">
                              <CheckCircle2Icon className="size-3.5" aria-hidden="true" />
                              {pkg.qaSummary.pdfRenderingPassed ? 'Passed' : 'Failed'}
                            </span>
                          </li>
                          <li className="flex items-center justify-between gap-2">
                            <span className="text-muted-foreground">Security &amp; macro scan</span>
                            <span className="inline-flex items-center gap-1 font-medium text-primary">
                              <CheckCircle2Icon className="size-3.5" aria-hidden="true" />
                              {pkg.qaSummary.xlsxSecurityScanPassed ? 'Passed' : 'Failed'}
                            </span>
                          </li>
                          {hasSpreadsheet && (
                            <>
                              <li className="flex items-center justify-between gap-2">
                                <span className="text-muted-foreground">Formula fixtures</span>
                                <span className="inline-flex items-center gap-1 font-medium text-primary">
                                  <CheckCircle2Icon className="size-3.5" aria-hidden="true" />
                                  {pkg.qaSummary.formulaFixturePythonDecimalPassed ? 'Passed' : 'Failed'}
                                </span>
                              </li>
                              <li className="flex items-center justify-between gap-2">
                                <span className="text-muted-foreground">Spreadsheet recalculation</span>
                                <span className="inline-flex items-center gap-1 font-medium text-muted-foreground">
                                  <AlertTriangleIcon className="size-3.5" aria-hidden="true" />
                                  Unavailable
                                </span>
                              </li>
                            </>
                          )}
                        </ul>
                      </div>

                      <div className="space-y-2 rounded-xl border border-border/80 bg-muted/25 p-4">
                        <h3 className="text-xs font-semibold text-foreground">
                          Before release ({pkg.unresolvedBlockers.length})
                        </h3>
                        <ul className="space-y-1.5 text-xs leading-relaxed text-muted-foreground">
                          {pkg.unresolvedBlockers.map((blocker) => (
                            <li key={blocker}>• {blocker}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* System Connections Strip (Overview & Operations) */}
      {['overview', 'operations'].includes(section) && (
        <Card id="operations" className="border-border/80 bg-card/80 shadow-none">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 px-5 py-3.5 text-sm">
            <span className="font-medium text-foreground">System connections</span>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {[
                { label: 'Database', icon: DatabaseIcon },
                { label: 'Infrastructure', icon: ServerIcon },
                { label: 'R2 backups', icon: HardDriveDownloadIcon },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <item.icon className="size-3.5 text-muted-foreground" aria-hidden="true" />
                  <span className="font-medium text-foreground/85">{item.label}</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                    <span className="size-1.5 rounded-full bg-muted-foreground/60" aria-hidden="true" />
                    Not monitored
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {developer && section === 'operations' && <DeveloperControls />}
    </div>
  );
}
