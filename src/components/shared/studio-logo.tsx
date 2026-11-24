import { cn } from '@/lib/utils';

export function StudioLogoMark({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={cn('size-8 shrink-0', className)}
    >
      <defs>
        <linearGradient id="studio-os-mark-bg" x1="8" y1="4" x2="56" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx="15" fill="url(#studio-os-mark-bg)" />
      <rect x="2.75" y="2.75" width="58.5" height="58.5" rx="14.25" stroke="#FFFFFF" strokeOpacity="0.16" strokeWidth="1.5" />
      <path
        d="M21 19.5C21 17.567 22.567 16 24.5 16H43.5C45.433 16 47 17.567 47 19.5V23.5C47 25.433 45.433 27 43.5 27H28.5C26.567 27 25 28.567 25 30.5V31.5H21V19.5Z"
        fill="#FFFFFF"
      />
      <path
        d="M43 44.5C43 46.433 41.433 48 39.5 48H20.5C18.567 48 17 46.433 17 44.5V40.5C17 38.567 18.567 37 20.5 37H35.5C37.433 37 39 35.433 39 33.5V32.5H43V44.5Z"
        fill="#DBEAFE"
      />
      <rect x="21" y="28.5" width="22" height="7" rx="3.5" fill="#FFFFFF" />
      <circle cx="44.5" cy="21.5" r="2.2" fill="#1D4ED8" />
    </svg>
  );
}
