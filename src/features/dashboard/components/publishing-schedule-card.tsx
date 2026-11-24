"use client";

import { useRef, useState, useSyncExternalStore } from 'react';
import { CalendarDaysIcon, MinusIcon, PlusIcon, RotateCcwIcon } from 'lucide-react';
import { z } from 'zod';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/toast';

const STORAGE_KEY = 'studio-os:daily-pin-schedule-v2';
const STORAGE_EVENT = 'studio-os:daily-pin-schedule-change';
const DEFAULT_SLOTS = 4;
const MIN_SLOTS = 1;
const MAX_SLOTS = 6;
const SNAP_MINUTES = 15;
const MAX_MINUTE = 23 * 60 + 45;

const scheduleStateSchema = z.object({
  slots: z.array(z.number().int().min(0).max(MAX_MINUTE)).min(MIN_SLOTS).max(MAX_SLOTS),
  custom: z.boolean(),
});

type ScheduleState = z.infer<typeof scheduleStateSchema>;

const PRESET_MINUTES: Record<number, readonly number[]> = {
  1: [9 * 60],
  2: [9 * 60, 21 * 60],
  3: [6 * 60, 14 * 60, 22 * 60],
  4: [0, 6 * 60, 12 * 60, 18 * 60],
  5: [60, 6 * 60, 10 * 60 + 45, 15 * 60 + 30, 20 * 60 + 15],
  6: [0, 4 * 60, 8 * 60, 12 * 60, 16 * 60, 20 * 60],
};

const DEFAULT_STATE: ScheduleState = {
  slots: [...PRESET_MINUTES[DEFAULT_SLOTS]!],
  custom: false,
};

function formatTime(minutes: number): string {
  const clamped = Math.max(0, Math.min(MAX_MINUTE, Math.round(minutes)));
  const h = Math.floor(clamped / 60);
  const m = clamped % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function labelForMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  if (h === 0) return 'Midnight';
  if (h < 5) return 'Early';
  if (h < 11) return 'Morning';
  if (h < 14) return 'Midday';
  if (h < 17) return 'Afternoon';
  if (h < 21) return 'Evening';
  return 'Night';
}

function cadenceLabel(slots: readonly number[], custom: boolean): string {
  if (custom) return 'Custom';
  const map: Record<number, string> = {
    1: 'Every 24h',
    2: 'Every 12h',
    3: 'Every 8h',
    4: 'Every 6h',
    5: 'Every ~5h',
    6: 'Every 4h',
  };
  return map[slots.length] ?? `${slots.length}/day`;
}

function snapMinutes(rawMinutes: number): number {
  const snapped = Math.round(rawMinutes / SNAP_MINUTES) * SNAP_MINUTES;
  return Math.max(0, Math.min(MAX_MINUTE, snapped));
}

let cachedRaw: string | null = null;
let cachedParsed: ScheduleState = DEFAULT_STATE;

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener(STORAGE_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(STORAGE_EVENT, callback);
  };
}

function getClientSnapshot(): ScheduleState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) return cachedParsed;
    cachedRaw = raw;
    if (!raw) {
      cachedParsed = DEFAULT_STATE;
      return cachedParsed;
    }
    const parsed = scheduleStateSchema.safeParse(JSON.parse(raw));
    cachedParsed = parsed.success ? parsed.data : DEFAULT_STATE;
    return cachedParsed;
  } catch {
    return DEFAULT_STATE;
  }
}

function getServerSnapshot(): ScheduleState {
  return DEFAULT_STATE;
}

function persistState(next: ScheduleState) {
  try {
    const raw = JSON.stringify(next);
    window.localStorage.setItem(STORAGE_KEY, raw);
    cachedRaw = raw;
    cachedParsed = next;
    window.dispatchEvent(new Event(STORAGE_EVENT));
  } catch {
    // Ignore storage errors in restricted browser contexts.
  }
}

export function PublishingScheduleCard({
  canConfigure = false,
  preview = false,
}: {
  canConfigure?: boolean;
  preview?: boolean;
}) {
  const state = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const trackRef = useRef<HTMLDivElement>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [draftSlots, setDraftSlots] = useState<number[] | null>(null);

  const activeSlots = draftSlots ?? state.slots;
  const slotCount = activeSlots.length;
  const cadence = cadenceLabel(activeSlots, state.custom || draftSlots !== null);

  function setPresetCount(nextCount: number) {
    const preset = PRESET_MINUTES[nextCount];
    if (!preset) return;
    const next: ScheduleState = { slots: [...preset], custom: false };
    persistState(next);
    toast.add({
      title: `Daily target set to ${nextCount} ${nextCount === 1 ? 'post' : 'posts'}/day (${cadenceLabel(next.slots, false)})`,
      description: preview
        ? 'Updated for this preview session. Server persistence connects with RSS scheduling.'
        : 'Saved locally until backend scheduling settings are connected.',
      type: 'success',
    });
  }

  function resetEvenSpacing() {
    const preset = PRESET_MINUTES[slotCount] ?? PRESET_MINUTES[DEFAULT_SLOTS]!;
    persistState({ slots: [...preset], custom: false });
    toast.add({
      title: `Reset to even ${cadenceLabel(preset, false).toLowerCase()} spacing`,
      type: 'success',
    });
  }

  function minutesFromPointer(clientX: number): number {
    const el = trackRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return snapMinutes(ratio * 1440);
  }

  function handlePointerDown(index: number, e: React.PointerEvent<HTMLButtonElement>) {
    if (!canConfigure) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDraggingIndex(index);
    setDraftSlots([...state.slots]);
  }

  function handlePointerMove(index: number, e: React.PointerEvent<HTMLButtonElement>) {
    if (draggingIndex !== index || !draftSlots) return;
    const nextMin = minutesFromPointer(e.clientX);
    if (draftSlots[index] === nextMin) return;
    const next = [...draftSlots];
    next[index] = nextMin;
    setDraftSlots(next);
  }

  function commitDrag(index: number) {
    if (draggingIndex !== index || !draftSlots) return;
    const sorted = [...draftSlots].sort((a, b) => a - b);
    setDraggingIndex(null);
    setDraftSlots(null);
    persistState({ slots: sorted, custom: true });
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLButtonElement>) {
    if (!canConfigure) return;
    const step = e.shiftKey ? 60 : SNAP_MINUTES;
    let delta = 0;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') delta = step;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') delta = -step;
    else return;
    e.preventDefault();
    const next = [...state.slots];
    next[index] = snapMinutes((next[index] ?? 0) + delta);
    next.sort((a, b) => a - b);
    persistState({ slots: next, custom: true });
  }

  const displayRows = activeSlots
    .map((minutes, idx) => ({ minutes, idx, time: formatTime(minutes), label: labelForMinutes(minutes) }))
    .sort((a, b) => a.minutes - b.minutes);

  return (
    <Card id="marketing" className="border-border/90 shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between gap-3 px-6 pt-6 pb-2">
        <div className="flex items-center gap-2.5">
          <CalendarDaysIcon className="size-4 text-primary" aria-hidden="true" />
          <CardTitle className="text-base font-semibold tracking-tight">Publishing</CardTitle>
        </div>
        <Badge variant="outline" className="font-normal text-muted-foreground">
          Not connected
        </Badge>
      </CardHeader>

      <CardContent className="space-y-6 px-6 pt-3 pb-6">
        {/* Clean Count + Cadence + Stepper */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold tabular-nums text-foreground">0 / {slotCount}</span>
            <span className="text-xs text-muted-foreground">scheduled · {cadence}</span>
          </div>

          {canConfigure && (
            <div className="flex items-center gap-1.5" role="group" aria-label="Daily scheduled posts limit">
              {state.custom && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={resetEvenSpacing}
                  aria-label="Reset even spacing"
                  title="Reset even spacing"
                >
                  <RotateCcwIcon />
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                size="icon-xs"
                disabled={slotCount <= MIN_SLOTS}
                onClick={() => setPresetCount(slotCount - 1)}
                aria-label="Decrease daily scheduled posts"
              >
                <MinusIcon />
              </Button>
              <span className="min-w-6 text-center text-sm font-semibold tabular-nums text-foreground">
                {slotCount}
              </span>
              <Button
                type="button"
                variant="outline"
                size="icon-xs"
                disabled={slotCount >= MAX_SLOTS}
                onClick={() => setPresetCount(slotCount + 1)}
                aria-label="Increase daily scheduled posts"
              >
                <PlusIcon />
              </Button>
            </div>
          )}
        </div>

        {/* Clean Frameless Draggable 24h Horizontal Timeline */}
        <div className="space-y-2" aria-label={`Interactive 24-hour time slots bar: ${cadence}`}>
          <div className="px-2">
            <div ref={trackRef} className="relative flex h-6 touch-none items-center select-none">
              <div className="h-1 w-full rounded-full bg-muted" />
              {[0, 25, 50, 75, 100].map((pct) => (
                <span
                  key={pct}
                  className="pointer-events-none absolute top-1/2 h-2.5 w-px -translate-y-1/2 bg-border"
                  style={{ left: `${pct}%` }}
                  aria-hidden="true"
                />
              ))}
              {activeSlots.map((minutes, idx) => {
                const pct = (minutes / 1440) * 100;
                const isDragging = draggingIndex === idx;
                const timeStr = formatTime(minutes);
                return (
                  <button
                    key={idx}
                    type="button"
                    role="slider"
                    aria-label={`Time slot ${idx + 1} (${labelForMinutes(minutes)})`}
                    aria-valuemin={0}
                    aria-valuemax={MAX_MINUTE}
                    aria-valuenow={minutes}
                    aria-valuetext={timeStr}
                    disabled={!canConfigure}
                    onPointerDown={(e) => handlePointerDown(idx, e)}
                    onPointerMove={(e) => handlePointerMove(idx, e)}
                    onPointerUp={() => commitDrag(idx)}
                    onPointerCancel={() => commitDrag(idx)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    style={{ left: `${pct}%` }}
                    title={canConfigure ? `${timeStr} — drag to adjust` : timeStr}
                    className={`group absolute top-1/2 flex size-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-primary bg-card shadow-xs transition-transform focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none ${
                      canConfigure ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
                    } ${isDragging ? 'z-20 scale-125 ring-4 ring-primary/20' : 'z-10 hover:scale-115'}`}
                  >
                    <span className="size-1 rounded-full bg-primary" aria-hidden="true" />
                    <span
                      className={`pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 rounded-md bg-foreground px-1.5 py-0.5 text-[11px] font-medium tabular-nums text-background shadow-sm transition-opacity ${
                        isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'
                      }`}
                    >
                      {timeStr}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] tabular-nums text-muted-foreground">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>24:00</span>
          </div>
        </div>

        {/* Hairline-Divided Time Slots List (Zero Nested Boxes) */}
        <ul className="divide-y divide-border/60 border-t border-border/60" aria-label={`${slotCount} daily publishing time slots`}>
          {displayRows.map((slot) => (
            <li
              key={`${slot.idx}-${slot.time}`}
              className={`flex items-center justify-between py-3 text-sm transition-colors ${
                draggingIndex === slot.idx ? 'text-primary' : 'text-foreground'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-11 font-medium tabular-nums">{slot.time}</span>
                <span className="text-muted-foreground">{slot.label}</span>
              </div>
              <span className="text-xs text-muted-foreground">Unscheduled</span>
            </li>
          ))}
        </ul>

        {/* Quiet Hairline Footer Note */}
        <p className="border-t border-border/60 pt-4 text-xs leading-relaxed text-muted-foreground">
          Only human-approved assets with a live landing URL enter the RSS feed. Pinterest ingests RSS feeds on its own
          schedule (up to 24 hours).
        </p>
      </CardContent>
    </Card>
  );
}
