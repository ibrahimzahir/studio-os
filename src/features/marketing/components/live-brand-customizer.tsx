'use client';

import { useState } from 'react';
import { Calculator, Palette, RotateCcw, Sparkles } from 'lucide-react';
import {
  BRAND_PALETTES,
  calculateMarginLeakage,
  calculateMarkupPrice,
  calculateTargetMarginPrice,
} from '@/features/marketing/customizer-math';

interface CustomizerState {
  businessName: string;
  phone: string;
  website: string;
  serviceArea: string;
  paletteId: string;
  paperSize: 'us-letter' | 'a4';
  jobCost: string;
  targetMargin: string;
  tier1Sedan: string;
  tier2Sedan: string;
  tier3Sedan: string;
}

const DEFAULT_STATE: CustomizerState = {
  businessName: 'Apex Mobile Detailing',
  phone: '(555) 234-5678',
  website: 'apexmobiledetail.com',
  serviceArea: 'Metro Area & 25-Mile Radius',
  paletteId: 'forest',
  paperSize: 'us-letter',
  jobCost: '100',
  targetMargin: '40',
  tier1Sedan: '95',
  tier2Sedan: '165',
  tier3Sedan: '285',
};

function fmtPrice(raw: string, multiplier = 1): string {
  const num = Number.parseFloat(raw);
  if (!Number.isFinite(num) || num <= 0) return '—';
  return `$${Math.round(num * multiplier)}`;
}

export function LiveBrandCustomizer() {
  const [state, setState] = useState<CustomizerState>(DEFAULT_STATE);

  const palette = BRAND_PALETTES.find(p => p.id === state.paletteId) ?? BRAND_PALETTES[0]!;
  const costNum = Number.parseFloat(state.jobCost) || 0;
  const marginNum = Number.parseFloat(state.targetMargin) || 0;
  const targetQuote = calculateTargetMarginPrice(costNum, marginNum);
  const naiveQuote = calculateMarkupPrice(costNum, marginNum);
  const leakage = calculateMarginLeakage(costNum, marginNum);

  const update = <K extends keyof CustomizerState>(key: K, value: CustomizerState[K]) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/35 px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-foreground">
            Try It Live — Customize Your Branded Service Menu
          </h3>
        </div>
        <button
          type="button"
          onClick={() => setState(DEFAULT_STATE)}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <RotateCcw className="size-3.5" />
          <span>Reset sample</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-[0.95fr_1.35fr]">
        {/* Left Controls */}
        <div className="space-y-5 border-b border-border p-5 lg:border-r lg:border-b-0">
          {/* Business Identity */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              1. Your Business Header
            </p>
            <div>
              <label htmlFor="biz-name" className="block text-xs font-medium text-foreground">
                Business Name
              </label>
              <input
                id="biz-name"
                type="text"
                maxLength={48}
                value={state.businessName}
                onChange={e => update('businessName', e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="biz-phone" className="block text-xs font-medium text-foreground">
                  Phone
                </label>
                <input
                  id="biz-phone"
                  type="text"
                  maxLength={28}
                  value={state.phone}
                  onChange={e => update('phone', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label htmlFor="biz-web" className="block text-xs font-medium text-foreground">
                  Website / Email
                </label>
                <input
                  id="biz-web"
                  type="text"
                  maxLength={40}
                  value={state.website}
                  onChange={e => update('website', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <label htmlFor="biz-area" className="block text-xs font-medium text-foreground">
                Service Area
              </label>
              <input
                id="biz-area"
                type="text"
                maxLength={52}
                value={state.serviceArea}
                onChange={e => update('serviceArea', e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Brand Color & Paper Size */}
          <div className="space-y-3 border-t border-border pt-4">
            <div className="flex items-center justify-between gap-2">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Palette className="size-3.5" aria-hidden="true" />
                <span>2. Brand Accent &amp; Paper</span>
              </p>
              <div className="inline-flex rounded-md border border-border bg-muted/50 p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => update('paperSize', 'us-letter')}
                  className={`rounded px-2 py-0.5 font-medium ${
                    state.paperSize === 'us-letter'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground'
                  }`}
                >
                  US Letter
                </button>
                <button
                  type="button"
                  onClick={() => update('paperSize', 'a4')}
                  className={`rounded px-2 py-0.5 font-medium ${
                    state.paperSize === 'a4'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground'
                  }`}
                >
                  A4
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {BRAND_PALETTES.map(p => {
                const selected = p.id === palette.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => update('paletteId', p.id)}
                    className={`inline-flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                      selected
                        ? 'border-primary bg-primary/10 text-foreground'
                        : 'border-border bg-background text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span
                      className="size-3.5 rounded-full border border-black/15"
                      style={{ backgroundColor: p.headerBg }}
                      aria-hidden="true"
                    />
                    <span>{p.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Target-Margin Mini Calculator */}
          <div className="space-y-3 border-t border-border pt-4">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Calculator className="size-3.5" aria-hidden="true" />
              <span>3. Live Target-Margin Calculator</span>
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="calc-cost" className="block text-xs font-medium text-foreground">
                  Job Cost (USD)
                </label>
                <input
                  id="calc-cost"
                  type="number"
                  min={1}
                  max={5000}
                  value={state.jobCost}
                  onChange={e => update('jobCost', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm tabular-nums text-foreground outline-none focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="calc-margin" className="block text-xs font-medium text-foreground">
                  Target Margin (%)
                </label>
                <input
                  id="calc-margin"
                  type="number"
                  min={5}
                  max={85}
                  value={state.targetMargin}
                  onChange={e => update('targetMargin', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm tabular-nums text-foreground outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs">
              <div className="flex items-baseline justify-between">
                <span className="text-muted-foreground">Target-Margin Quote:</span>
                <span className="text-base font-bold tabular-nums text-primary">
                  ${targetQuote.toFixed(2)}
                </span>
              </div>
              <div className="mt-1 flex items-baseline justify-between text-muted-foreground">
                <span>Naive Markup Quote ({marginNum}%):</span>
                <span className="tabular-nums line-through">${naiveQuote.toFixed(2)}</span>
              </div>
              {leakage > 0 && (
                <p className="mt-1.5 font-medium text-foreground">
                  Protects <span className="text-primary">${leakage.toFixed(2)}</span> profit per job.
                </p>
              )}
              <button
                type="button"
                onClick={() => update('tier2Sedan', String(Math.round(targetQuote)))}
                className="mt-2.5 w-full rounded-md border border-primary/30 bg-background px-2.5 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                Apply ${Math.round(targetQuote)} to Tier 2 (Sedan) →
              </button>
            </div>

            {/* Quick Sedan Base Rates */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'tier1Sedan' as const, label: 'Tier 1 ($)' },
                { key: 'tier2Sedan' as const, label: 'Tier 2 ($)' },
                { key: 'tier3Sedan' as const, label: 'Tier 3 ($)' },
              ].map(t => (
                <div key={t.key}>
                  <label htmlFor={t.key} className="block text-[11px] font-medium text-muted-foreground">
                    {t.label}
                  </label>
                  <input
                    id={t.key}
                    type="number"
                    min={10}
                    max={5000}
                    value={state[t.key]}
                    onChange={e => update(t.key, e.target.value)}
                    className="mt-1 w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs tabular-nums text-foreground outline-none focus:border-primary"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Live Branded Paper Sheet Preview */}
        <div className="flex flex-col justify-between bg-[#E9EDF7] p-5 sm:p-8 dark:bg-slate-900/90">
          <div
            className={`relative mx-auto w-full overflow-hidden rounded-md border border-slate-200 bg-white text-slate-900 shadow-lg ${
              state.paperSize === 'a4' ? 'max-w-[540px]' : 'max-w-[560px]'
            }`}
          >
            {/* Subtle diagonal sample preview watermark */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center overflow-hidden select-none"
            >
              <span className="-rotate-24 text-2xl font-bold tracking-[0.22em] text-slate-900/8 sm:text-3xl">
                LIVE PREVIEW · DOCKLY
              </span>
            </div>

            {/* Header Banner */}
            <div className="px-6 py-4 text-white" style={{ backgroundColor: palette.headerBg }}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-white/75">
                    Mobile Detailing Service Menu
                  </p>
                  <h4 className="mt-0.5 text-lg font-bold tracking-tight">
                    {state.businessName.trim() || 'Your Business Name'}
                  </h4>
                </div>
                <span className="shrink-0 rounded border border-white/25 bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
                  {state.paperSize === 'a4' ? 'A4 · 210×297mm' : 'US Letter · 8.5×11"'}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-white/85">
                <span>{state.phone.trim() || '(555) 000-0000'}</span>
                <span>{state.website.trim() || 'yourwebsite.com'}</span>
                <span>{state.serviceArea.trim() || 'Your Service Area'}</span>
              </div>
            </div>

            {/* Package Tiers */}
            <div className="space-y-3 p-5">
              {[
                {
                  tier: 'Tier 1 — Maintenance Wash & Refresh',
                  desc: 'Two-bucket hand wash, wheel & tire dressing, exterior glass, vacuum & interior wipe-down.',
                  base: state.tier1Sedan,
                },
                {
                  tier: 'Tier 2 — Interior Deep Clean',
                  desc: 'Full steam & upholstery extraction, leather conditioning, plastics UV protectant & odor neutralizer.',
                  base: state.tier2Sedan,
                },
                {
                  tier: 'Tier 3 — Full Interior + Exterior Detail',
                  desc: 'Everything in Tier 1 & 2 plus iron decon, clay bar treatment, and 3–6 month ceramic sealant.',
                  base: state.tier3Sedan,
                },
              ].map(pkg => (
                <div
                  key={pkg.tier}
                  className="rounded-lg border p-3.5"
                  style={{ borderColor: palette.borderTint, backgroundColor: palette.softTint }}
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="max-w-xs space-y-0.5">
                      <p className="text-xs font-bold" style={{ color: palette.accentText }}>
                        {pkg.tier}
                      </p>
                      <p className="text-[11px] leading-snug text-slate-600">{pkg.desc}</p>
                    </div>
                    <div className="grid shrink-0 grid-cols-3 gap-1.5 text-center">
                      {[
                        { label: 'Sedan', mult: 1 },
                        { label: 'Mid SUV', mult: 1.2 },
                        { label: 'Lg SUV', mult: 1.4 },
                      ].map(sz => (
                        <div
                          key={sz.label}
                          className="rounded border border-slate-200 bg-white px-2 py-1"
                        >
                          <p className="text-[9px] font-medium uppercase text-slate-500">{sz.label}</p>
                          <p className="text-xs font-bold tabular-nums text-slate-900">
                            {fmtPrice(pkg.base, sz.mult)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between border-t border-slate-200 pt-2.5 text-[10px] text-slate-500">
                <span>All rates calculated by target margin · Excess pet hair/biohazard quoted on-site</span>
                <span>Page 1 of 2</span>
              </div>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-slate-600 dark:text-slate-400">
            Live interactive preview — purchased kit includes the full 3-tab Excel/Sheets calculator + clean unwatermarked US Letter &amp; A4 PDFs.
          </p>
        </div>
      </div>
    </div>
  );
}
