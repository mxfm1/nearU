'use client';

import { type FormEvent } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { SearchState } from '@/types/search';

export function ExploreSearchBar({
  state,
  onSubmit,
  className,
}: {
  state: SearchState;
  onSubmit: (query: string) => void;
  className?: string;
}) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onSubmit(String(form.get('query') ?? '').trim());
  }

  return (
    <form key={state.query} onSubmit={submit} className={cn('w-full max-w-4xl', className)}>
      <div className="relative flex h-14 items-center rounded-full border border-border bg-card p-1.5 shadow-search focus-within:ring-2 focus-within:ring-primary/20">
        <Search className="ml-3 h-5 w-5 shrink-0 text-muted-foreground" />
        <input
          name="query"
          defaultValue={state.query}
          placeholder="¿Qué estás buscando?"
          className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground sm:text-base"
        />
        <Button type="submit" className="h-full rounded-full px-5 sm:px-7">
          Buscar
        </Button>
      </div>
    </form>
  );
}
