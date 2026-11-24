"use client";
import { SearchIcon } from 'lucide-react';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
export function SearchBar({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <InputGroup><InputGroupAddon><SearchIcon aria-hidden="true" /></InputGroupAddon><InputGroupInput aria-label="Search opportunities" placeholder="Search by title or audience" value={value} maxLength={100} onChange={event => onChange(event.target.value)} /></InputGroup>;
}
