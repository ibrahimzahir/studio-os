"use client";

import { useRef, useState } from 'react';
import { ArrowRightIcon, MoreHorizontalIcon, ScanSearchIcon } from 'lucide-react';
import { NumberedPagination } from '@/components/shared/numbered-pagination';
import { SearchBar } from '@/components/shared/search-bar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/toast';
import {
  type OpportunityDto,
  type OpportunityPage,
  opportunityPageSchema,
  opportunityQuerySchema,
} from '@/contracts/opportunities';

export function OpportunityRadar({ initial, preview = false }: { initial: OpportunityPage; preview?: boolean }) {
  const latestRequest = useRef(0);
  const [result, setResult] = useState(initial);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [pending, setPending] = useState(false);

  async function change(nextSearch: string, nextCategory: string, nextPage: number) {
    const parsed = opportunityQuerySchema.safeParse({
      search: nextSearch,
      category: nextCategory,
      page: nextPage,
      pageSize: 2,
    });
    if (!parsed.success) {
      toast.add({ title: 'Check your filters', description: parsed.error.issues[0]?.message, type: 'error' });
      return;
    }
    setSearch(nextSearch);
    setCategory(nextCategory);
    setPage(nextPage);
    if (preview) return;
    const requestId = ++latestRequest.current;
    setPending(true);
    try {
      const query = new URLSearchParams({
        search: parsed.data.search,
        category: parsed.data.category,
        page: String(nextPage),
        pageSize: '2',
      });
      const response = await fetch(`/api/opportunities?${query}`);
      if (!response.ok) throw new Error('Unable to load opportunities. Try again or sign in again.');
      const data = opportunityPageSchema.parse(await response.json());
      if (requestId === latestRequest.current) setResult(data);
    } catch (error) {
      if (requestId === latestRequest.current) {
        toast.add({
          title: 'Opportunities did not load',
          description: error instanceof Error ? error.message : 'Try again.',
          type: 'error',
        });
      }
    } finally {
      if (requestId === latestRequest.current) setPending(false);
    }
  }

  const filtered = preview
    ? initial.items.filter(
        (n) =>
          (category === 'all' || n.category === category) &&
          `${n.title} ${n.audience}`.toLowerCase().includes(search.toLowerCase().trim()),
      )
    : result.items;
  const total = preview ? filtered.length : result.total;
  const items: OpportunityDto[] = preview ? filtered.slice((page - 1) * 2, page * 2) : filtered;

  if (initial.total === 0) {
    return (
      <div className="flex flex-col items-start gap-5 rounded-xl border border-dashed border-border bg-muted/25 p-6 sm:flex-row sm:items-center">
        <div
          className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-primary shadow-2xs"
          aria-hidden="true"
        >
          <ScanSearchIcon className="size-5" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-base font-semibold tracking-tight text-foreground">Make room for your next idea</h3>
          <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
            Add a product opportunity above. This is where you will compare fresh demand evidence and decide what is
            worth building.
          </p>
          <div className="inline-flex items-center gap-2 pt-1 text-xs font-medium text-primary">
            <span>Capture an idea</span>
            <ArrowRightIcon className="size-3" aria-hidden="true" />
            <span>Research</span>
            <ArrowRightIcon className="size-3" aria-hidden="true" />
            <span>Review</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <FieldGroup className="flex-row flex-wrap items-end gap-4">
        <Field className="min-w-48 flex-1">
          <FieldLabel>Search opportunities</FieldLabel>
          <SearchBar value={search} onChange={(v) => void change(v, category, 1)} />
        </Field>
        <Field className="w-auto min-w-44">
          <FieldLabel htmlFor="category">Category</FieldLabel>
          <NativeSelect id="category" value={category} onChange={(e) => void change(search, e.target.value, 1)}>
            <NativeSelectOption value="all">All categories</NativeSelectOption>
            <NativeSelectOption value="operations">Operations</NativeSelectOption>
            <NativeSelectOption value="hospitality">Hospitality</NativeSelectOption>
            <NativeSelectOption value="events">Events</NativeSelectOption>
          </NativeSelect>
        </Field>
      </FieldGroup>

      <p className="text-xs font-medium text-muted-foreground" role="status">
        Showing {total}{' '}
        {preview
          ? total === 1
            ? 'product hypothesis'
            : 'product hypotheses'
          : total === 1
            ? 'opportunity'
            : 'opportunities'}
      </p>

      <div aria-busy={pending} className="grid gap-4 md:grid-cols-2">
        {pending
          ? [0, 1].map((i) => (
              <Card key={i} className="border-border/80">
                <CardHeader>
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="mt-2 h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))
          : items.map((n) => (
              <Card
                key={n.id}
                className="flex flex-col justify-between border-border/90 transition-colors duration-150 hover:border-primary/35"
              >
                <CardHeader className="pb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="gap-1.5 font-medium">
                      <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
                      Needs research
                    </Badge>
                    {/seasonal/i.test(`${n.title} ${n.audience}`) && (
                      <Badge variant="default" className="font-medium">
                        Seasonal
                      </Badge>
                    )}
                    <Badge variant="outline" className="font-normal capitalize text-muted-foreground">
                      {n.category}
                    </Badge>
                  </div>
                  <CardTitle className="mt-2.5 text-base font-semibold tracking-tight text-foreground">
                    {n.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">{n.audience}</CardDescription>
                  <CardAction>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={<Button variant="ghost" size="icon" aria-label={`Actions for ${n.title}`} />}
                      >
                        <MoreHorizontalIcon className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            onClick={() => {
                              void navigator.clipboard
                                .writeText(n.title)
                                .then(() => toast.add({ title: 'Product title copied', type: 'success' }))
                                .catch(() => toast.add({ title: 'Could not copy title', type: 'error' }));
                            }}
                          >
                            Copy product title
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardAction>
                </CardHeader>

                <CardContent className="pb-4">
                  <dl className="grid grid-cols-2 gap-3 rounded-lg border border-border/70 bg-muted/35 p-3 text-xs">
                    <div>
                      <dt className="text-muted-foreground">Evidence confidence</dt>
                      <dd className="mt-1 font-medium text-foreground">Not assessed</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Next gate</dt>
                      <dd className="mt-1 font-medium text-foreground">Demand research</dd>
                    </div>
                  </dl>
                </CardContent>

                <CardFooter className="border-t border-border/60 pt-3">
                  <details className="w-full text-xs text-muted-foreground">
                    <summary className="font-medium text-foreground/85">Validation checklist</summary>
                    <p className="mt-2 leading-relaxed">
                      Fresh demand evidence, purchase intent, competitor gaps, and owner review are required before
                      production.
                    </p>
                  </details>
                </CardFooter>
              </Card>
            ))}
      </div>

      {!pending && items.length === 0 && (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No matching opportunities</EmptyTitle>
            <EmptyDescription>Try another search or clear your category filter.</EmptyDescription>
          </EmptyHeader>
          <Button variant="outline" onClick={() => void change('', 'all', 1)}>
            Clear filters
          </Button>
        </Empty>
      )}

      <NumberedPagination page={page} pages={Math.ceil(total / 2)} onChange={(p) => void change(search, category, p)} />
    </div>
  );
}
