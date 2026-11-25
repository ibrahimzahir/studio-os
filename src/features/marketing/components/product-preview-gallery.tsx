'use client';

import { useEffect, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Maximize2,
  Minus,
  Plus,
  X,
} from 'lucide-react';

export interface ResolvedPreviewSheet {
  readonly id: string;
  readonly label: string;
  readonly caption: string;
  readonly imageUrl: string;
  readonly width: number;
  readonly height: number;
}

interface ProductPreviewGalleryProps {
  readonly sheets: readonly ResolvedPreviewSheet[];
}

const ZOOM_LEVELS = [60, 75, 100, 125, 150] as const;

export function ProductPreviewGallery({ sheets }: ProductPreviewGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomIdx, setZoomIdx] = useState(1); // default 75% (fits full sheet width cleanly)
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const active = sheets[activeIndex];
  const zoomPct = ZOOM_LEVELS[zoomIdx] ?? 75;

  useEffect(() => {
    if (!lightboxOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setLightboxOpen(false);
      } else if (e.key === 'ArrowRight') {
        setActiveIndex(prev => (prev + 1) % sheets.length);
      } else if (e.key === 'ArrowLeft') {
        setActiveIndex(prev => (prev - 1 + sheets.length) % sheets.length);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxOpen, sheets.length]);

  if (!active) return null;

  const goPrev = () => setActiveIndex(prev => (prev - 1 + sheets.length) % sheets.length);
  const goNext = () => setActiveIndex(prev => (prev + 1) % sheets.length);
  const zoomIn = () => setZoomIdx(prev => Math.min(prev + 1, ZOOM_LEVELS.length - 1));
  const zoomOut = () => setZoomIdx(prev => Math.max(prev - 1, 0));

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      {/* Interactive Document Canvas (Jotform-inspired) */}
      <div className="relative bg-[#E9EDF7] dark:bg-slate-900/90">
        {/* Top-right fullscreen button */}
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          aria-label="Open full-screen preview"
          className="absolute top-3.5 right-3.5 z-10 inline-flex items-center gap-1.5 rounded-lg border border-slate-200/90 bg-white/95 px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-xs backdrop-blur-xs transition-colors hover:bg-white dark:border-slate-700 dark:bg-slate-800/95 dark:text-slate-100"
        >
          <Maximize2 className="size-3.5" />
          <span className="hidden sm:inline">Full screen</span>
        </button>

        {/* Scrollable Sheet Viewport */}
        <div className="h-[520px] overflow-auto p-5 sm:h-[600px] sm:p-8">
          <div
            className="mx-auto overflow-hidden rounded-md border border-slate-200/90 bg-white shadow-lg transition-[width] duration-150"
            style={{ width: `${zoomPct}%`, minWidth: zoomPct >= 100 ? `${Math.round((zoomPct / 100) * 680)}px` : '280px' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={active.imageUrl}
              alt={`${active.label} — ${active.caption}`}
              width={active.width}
              height={active.height}
              className="block h-auto w-full"
            />
          </div>
        </div>

        {/* Floating + / 75% / - Zoom Pill (Bottom-Left) */}
        <div
          className="absolute bottom-4 left-4 z-10 flex flex-col items-center overflow-hidden rounded-lg border border-slate-200 bg-white shadow-md dark:border-slate-700 dark:bg-slate-800"
          role="group"
          aria-label="Zoom controls"
        >
          <button
            type="button"
            onClick={zoomIn}
            disabled={zoomIdx === ZOOM_LEVELS.length - 1}
            aria-label="Zoom in"
            className="flex size-9 items-center justify-center text-slate-700 transition-colors hover:bg-slate-100 disabled:opacity-35 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            <Plus className="size-4" />
          </button>
          <span className="border-y border-slate-200 px-2 py-1 text-[11px] font-semibold tabular-nums text-slate-600 dark:border-slate-700 dark:text-slate-300">
            {zoomPct}%
          </span>
          <button
            type="button"
            onClick={zoomOut}
            disabled={zoomIdx === 0}
            aria-label="Zoom out"
            className="flex size-9 items-center justify-center text-slate-700 transition-colors hover:bg-slate-100 disabled:opacity-35 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            <Minus className="size-4" />
          </button>
        </div>
      </div>

      {/* Bottom Cobalt Status & Sheet Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-primary px-4 py-2.5 text-primary-foreground">
        <div className="flex min-w-0 items-center gap-2">
          <Eye className="size-4 shrink-0 opacity-90" aria-hidden="true" />
          <label htmlFor="sheet-select" className="text-xs font-medium opacity-90">
            Previewing:
          </label>
          <select
            id="sheet-select"
            value={activeIndex}
            onChange={e => setActiveIndex(Number(e.target.value))}
            className="max-w-[230px] truncate rounded-md border border-white/25 bg-white/15 px-2.5 py-1 text-xs font-semibold text-white outline-none focus:ring-2 focus:ring-white/40 sm:max-w-xs"
          >
            {sheets.map((sheet, idx) => (
              <option key={sheet.id} value={idx} className="bg-slate-900 text-white">
                {sheet.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous sheet"
            className="inline-flex size-7 items-center justify-center rounded-md bg-white/15 text-white transition-colors hover:bg-white/25"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="px-1 text-xs font-medium tabular-nums opacity-95">
            {activeIndex + 1} / {sheets.length}
          </span>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next sheet"
            className="inline-flex size-7 items-center justify-center rounded-md bg-white/15 text-white transition-colors hover:bg-white/25"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {/* Sheet Caption + Compact Thumbnail Strip */}
      <div className="border-t border-border bg-card px-4 py-3">
        <p className="text-xs text-muted-foreground">{active.caption}</p>
        <div className="mt-2.5 grid grid-cols-5 gap-2">
          {sheets.map((sheet, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                key={sheet.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`overflow-hidden rounded-md border bg-white p-0.5 transition-all ${
                  isSelected
                    ? 'border-primary ring-2 ring-primary/30'
                    : 'border-border/80 opacity-70 hover:opacity-100'
                }`}
                aria-label={`Select ${sheet.label}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sheet.imageUrl}
                  alt={sheet.label}
                  width={sheet.width}
                  height={sheet.height}
                  loading="lazy"
                  className="aspect-[8.5/11] w-full object-cover object-top"
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Full-Screen Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-slate-950/92 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label={`Full-screen preview: ${active.label}`}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-white sm:px-6">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{active.label}</p>
              <p className="truncate text-xs text-slate-300">{active.caption}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={zoomOut}
                disabled={zoomIdx === 0}
                aria-label="Zoom out"
                className="inline-flex size-8 items-center justify-center rounded-md border border-white/15 bg-white/10 text-white hover:bg-white/20 disabled:opacity-35"
              >
                <Minus className="size-4" />
              </button>
              <span className="w-11 text-center text-xs font-semibold tabular-nums">{zoomPct}%</span>
              <button
                type="button"
                onClick={zoomIn}
                disabled={zoomIdx === ZOOM_LEVELS.length - 1}
                aria-label="Zoom in"
                className="inline-flex size-8 items-center justify-center rounded-md border border-white/15 bg-white/10 text-white hover:bg-white/20 disabled:opacity-35"
              >
                <Plus className="size-4" />
              </button>
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous sheet"
                className="ml-2 inline-flex size-8 items-center justify-center rounded-md border border-white/15 bg-white/10 text-white hover:bg-white/20"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next sheet"
                className="inline-flex size-8 items-center justify-center rounded-md border border-white/15 bg-white/10 text-white hover:bg-white/20"
              >
                <ChevronRight className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                aria-label="Close full screen"
                className="ml-2 inline-flex size-8 items-center justify-center rounded-md border border-white/15 bg-white/10 text-white hover:bg-white/20"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          <div
            className="flex-1 overflow-auto p-4 sm:p-8"
            onClick={e => {
              if (e.target === e.currentTarget) setLightboxOpen(false);
            }}
          >
            <div
              className="mx-auto rounded-lg bg-white shadow-2xl"
              style={{ width: `${Math.max(zoomPct, 85)}%`, maxWidth: zoomPct >= 125 ? 'none' : '960px' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={active.imageUrl}
                alt={`${active.label} — full resolution preview`}
                width={active.width}
                height={active.height}
                className="block h-auto w-full rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
