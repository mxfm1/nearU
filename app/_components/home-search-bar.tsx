'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export function HomeSearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/explorar?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="relative">
        <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          <Search className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Busca servicios, categorías o proveedores..."
          className="w-full h-12 sm:h-14 pl-11 sm:pl-14 pr-28 sm:pr-36 bg-card border border-border rounded-full shadow-search text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
        <button
          type="submit"
          className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 h-9 sm:h-10 px-4 sm:px-6 bg-primary text-primary-foreground rounded-full text-sm sm:text-base font-semibold shadow-brand hover:shadow-brand-lg hover:bg-primary/90 transition-all"
        >
          Buscar
        </button>
      </div>
    </form>
  );
}
