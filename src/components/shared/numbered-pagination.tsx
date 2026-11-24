import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationEllipsis } from '@/components/ui/pagination';
export function NumberedPagination({ page, pages, onChange }: { page: number; pages: number; onChange: (page: number) => void }) {
  if (pages <= 1) return null;
  const visible = Array.from({ length: Math.min(pages, 10000) }, (_, i) => i + 1).filter(n => n === 1 || n === pages || Math.abs(n - page) <= 1);
  return <Pagination aria-label="Opportunity pages"><PaginationContent>{page > 1 && <PaginationItem><PaginationLink href={`?page=${page-1}`} size="default" onClick={e => { e.preventDefault(); onChange(page-1); }}>Previous</PaginationLink></PaginationItem>}{visible.map((n,i) => <PaginationItem key={n}>{i > 0 && n - visible[i-1]! > 1 && <PaginationEllipsis />}<PaginationLink href={`?page=${n}`} aria-label={`Page ${n}`} isActive={n === page} onClick={e => { e.preventDefault(); onChange(n); }}>{n}</PaginationLink></PaginationItem>)}{page < pages && <PaginationItem><PaginationLink href={`?page=${page+1}`} size="default" onClick={e => { e.preventDefault(); onChange(page+1); }}>Next</PaginationLink></PaginationItem>}</PaginationContent></Pagination>;
}
