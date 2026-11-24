import { Skeleton } from '@/components/ui/skeleton';
export default function Loading() { return <main className="mx-auto flex max-w-5xl flex-col gap-8 p-8" aria-label="Loading studio" aria-busy="true"><Skeleton className="h-12 w-2/3" /><div className="grid gap-5 md:grid-cols-2"><Skeleton className="h-64 w-full" /><Skeleton className="h-64 w-full" /></div></main>; }
