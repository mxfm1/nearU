'use client';

import { useState, type FormEvent } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  onSearch,
  placeholder = 'Busca servicios de catering, producción, iluminación...',
  className,
}: SearchBarProps) {
  const [query, setQuery] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSearch(query.trim());
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'flex items-center gap-2 w-full max-w-2xl mx-auto bg-card border border-border rounded-md px-4 py-2 shadow-sm',
        className
      )}
    >
      <Search className="h-5 w-5 text-muted-foreground shrink-0" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-base"
      />
      <button
        type="submit"
        className="bg-primary text-primary-foreground rounded-md px-7 py-2.5 text-sm font-semibold tracking-wide hover:bg-primary/90 transition-colors whitespace-nowrap"
      >
        Buscar
      </button>
    </form>
  );
}
