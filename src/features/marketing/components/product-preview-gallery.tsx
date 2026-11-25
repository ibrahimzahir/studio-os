'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X, ZoomIn, ZoomOut } from 'lucide-react';

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

export function ProductPreviewGallery({ sheets }: ProductPreviewGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  const active = sheets[activeIndex];

  useEffect(() => {
    if (!lightboxOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setLightboxOpen(false);
        setZoomed(false);
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

  return (
    <div className="space-y-4">
      {/* Sheet selector tabs */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Document preview pages">
        {sheets.map((sheet, idx) => {
          const isSelected = idx === activeIndex;
          return (
            <button
              key={sheet.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setActiveIndex(idx)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                isSelected
                  ? 'border-primary bg-primary text-primary-foreground shadow-xs'
                  : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground'
              }`}
            >
              {sheet.label}
            </button>
          );
        })}
      </div>

      {/* Main readable sheet viewer */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{active.label}</p>
            <p className="truncate text-xs text-muted-foreground">{active.caption}</p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous sheet"
              className="inline-flex size-8 items-center justify-center rounded-md border border-border bg-background text-foreground hover:bg-muted"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="px-1.5 text-xs tabular-nums text-muted-foreground">
              {activeIndex + 1} / {sheets.length}
            </span>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next sheet"
              className="inline-flex size-8 items-center justify-center rounded-md border border-border bg-background text-foreground hover:bg-muted"
            >
              <ChevronRight className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setZoomed(false);
                setLightboxOpen(true);
              }}
              className="ml-1 inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1.5 text-xs font-medium text-primary hover:bg-primary/15"
            >
              <Maximize2 className="size-3.5" />
              <span>Zoom Full Size</span>
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setZoomed(false);
            setLightboxOpen(true);
          }}
          className="group relative block w-full cursor-zoom-in bg-slate-100 p-4 text-left sm:p-6 dark:bg-slate-900/70"
          aria-label={`Open full-size preview of ${active.label}`}
        >
          <div className="mx-auto max-w-3xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={active.imageUrl}
              alt={`${active.label} — ${active.caption}`}
              width={active.width}
              height={active.height}
              className="h-auto w-full object-contain"
            />
          </div>
          <span className="pointer-events-none absolute right-6 bottom-6 rounded-md bg-slate-900/85 px-3 py-1.5 text-xs font-medium text-white opacity-90 shadow-sm transition-opacity group-hover:opacity-100">
            Click anywhere on sheet to zoom full size
          </span>
        </button>

        {/* Thumbnail strip */}
        <div className="grid grid-cols-5 gap-2.5 border-t border-border bg-muted/30 p-3">
          {sheets.map((sheet, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                key={sheet.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`overflow-hidden rounded-md border bg-white p-1 transition-all ${
                  isSelected
                    ? 'border-primary ring-2 ring-primary/30'
                    : 'border-border/80 opacity-75 hover:opacity-100'
                }`}
                aria-label={`View ${sheet.label}`}
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

      {/* Full-screen click-to-zoom lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-slate-950/92 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label={`Full-size preview: ${active.label}`}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-white sm:px-6">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{active.label}</p>
              <p className="truncate text-xs text-slate-300">{active.caption}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous sheet"
                className="inline-flex size-9 items-center justify-center rounded-md border border-white/15 bg-white/10 text-white hover:bg-white/20"
              >
                <ChevronLeft className="size-4" />
              </button>
              <span className="px-1 text-xs tabular-nums text-slate-300">
                {activeIndex + 1} / {sheets.length}
              </span>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next sheet"
                className="inline-flex size-9 items-center justify-center rounded-md border border-white/15 bg-white/10 text-white hover:bg-white/20"
              >
                <ChevronRight className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setZoomed(z => !z)}
                className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/10 px-3 py-2 text-xs font-medium text-white hover:bg-white/20"
              >
                {zoomed ? <ZoomOut className="size-4" /> : <ZoomIn className="size-4" />}
                <span>{zoomed ? 'Fit to screen' : '100% Zoom'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setLightboxOpen(false);
                  setZoomed(false);
                }}
                aria-label="Close preview"
                className="inline-flex size-9 items-center justify-center rounded-md border border-white/15 bg-white/10 text-white hover:bg-white/20"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          <div
            className="flex-1 overflow-auto p-4 sm:p-8"
            onClick={e => {
              if (e.target === e.currentTarget) {
                setLightboxOpen(false);
                setZoomed(false);
              }
            }}
          >
            <div
              className={`mx-auto rounded-lg bg-white shadow-2xl ${
                zoomed ? 'w-[1275px] max-w-none' : 'max-w-4xl'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={active.imageUrl}
                alt={`${active.label} — full resolution preview`}
                width={active.width}
                height={active.height}
                onClick={() => setZoomed(z => !z)}
                className={`h-auto w-full rounded-lg ${zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
