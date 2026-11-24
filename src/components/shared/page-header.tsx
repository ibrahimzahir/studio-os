import type { ReactNode } from 'react';
export function PageHeader({ title, description, actions }: { title: string; description: string; actions?: ReactNode }) {
  return <div className="flex flex-wrap items-start justify-between gap-4"><div><h1 className="font-serif text-4xl tracking-tight md:text-5xl">{title}</h1><p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">{description}</p></div>{actions}</div>;
}
