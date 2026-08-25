'use client';

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  SearchX,
  Building2,
  Briefcase,
  Calendar,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProfilesQueryOptions } from '@/queries/profile.queries';
import { ServicesQueryOptions } from '@/queries/service.queries';
import { EventsQueryOptions } from '@/queries/event.queries';

/* -------------------------------------------------------------------------- */
/*  Constants                                                                 */
/* -------------------------------------------------------------------------- */

const TYPE_ORDER = ['empresa', 'servicio', 'evento'] as const;

const TYPE_LABELS: Record<(typeof TYPE_ORDER)[number], string> = {
  empresa: 'Empresas',
  servicio: 'Servicios',
  evento: 'Eventos',
};

const TYPE_ICONS = {
  empresa: Building2,
  servicio: Briefcase,
  evento: Calendar,
} as const;

const DEBOUNCE_MS = 250;
const MIN_QUERY_LENGTH = 1;
const MAX_RESULTS_PER_GROUP = 4;

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

type ResultType = keyof typeof TYPE_LABELS;

interface SearchResult {
  id: string;
  label: string;
  description: string;
  type: ResultType;
  href: string;
  eyebrow?: string;
  imageUrl?: string | null;
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function useDebouncedValue(value: string, delayMs: number): string {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(timeoutId);
  }, [delayMs, value]);

  return debounced;
}

function includesQuery(value: string | null | undefined, query: string): boolean {
  return normalize(value ?? '').includes(query);
}

function sortResults(a: SearchResult, b: SearchResult, query: string): number {
  const aNorm = normalize(a.label);
  const bNorm = normalize(b.label);
  const aExact = aNorm === query;
  const bExact = bNorm === query;
  if (aExact !== bExact) return aExact ? -1 : 1;
  const aStartsWith = aNorm.startsWith(query);
  const bStartsWith = bNorm.startsWith(query);
  if (aStartsWith !== bStartsWith) return aStartsWith ? -1 : 1;
  return a.label.localeCompare(b.label);
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

interface TypeaheadSearchProps {
  className?: string;
  placeholder?: string;
}

export function TypeaheadSearch({
  className,
  placeholder = 'Buscar empresas, servicios, eventos...',
}: TypeaheadSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const normalizedQuery = normalize(query);
  const debouncedQuery = useDebouncedValue(normalizedQuery, DEBOUNCE_MS);
  const isSearchReady = isFocused && debouncedQuery.length >= MIN_QUERY_LENGTH;

  const searchParams = useMemo(
    () => ({ search: debouncedQuery, sort: 'relevance' as const }),
    [debouncedQuery]
  );

  // ── Queries ──
  const profilesQuery = useQuery({
    ...ProfilesQueryOptions(searchParams),
    queryKey: ['typeahead', 'profiles', searchParams],
    enabled: isSearchReady,
  });

  const servicesQuery = useQuery({
    ...ServicesQueryOptions(searchParams),
    queryKey: ['typeahead', 'services', searchParams],
    enabled: isSearchReady,
  });

  const eventsQuery = useQuery({
    ...EventsQueryOptions(searchParams),
    queryKey: ['typeahead', 'events', searchParams],
    enabled: isSearchReady,
  });

  const isLoading = profilesQuery.isFetching || servicesQuery.isFetching || eventsQuery.isFetching;
  const hasError = profilesQuery.isError || servicesQuery.isError || eventsQuery.isError;

  /* ------ Flattened results for keyboard navigation ------ */
  const flatResults = useMemo<SearchResult[]>(() => {
    if (!isSearchReady) return [];

    const results: SearchResult[] = [];

    profilesQuery.data?.forEach((profile) => {
      const name = profile.name ?? '';
      if (!includesQuery(name, debouncedQuery)) return;
      results.push({
        id: `empresa-${profile.id ?? profile.userId ?? name}`,
        label: name,
        description: profile.industry ?? profile.location ?? 'Empresa',
        type: 'empresa',
        href: `/explorar?scope=organizations&q=${encodeURIComponent(name)}`,
        eyebrow: profile.isVerified ? 'Empresa verificada' : 'Empresa',
        imageUrl: profile.logoUrl ?? profile.bannerUrl,
      });
    });

    servicesQuery.data?.forEach((s) => {
      const title = s.title || '';
      if (!includesQuery(title, debouncedQuery) && !includesQuery(s.marca, debouncedQuery)) return;
      results.push({
        id: `servicio-${s.id ?? ''}`,
        label: title,
        description: s.marca || s.category?.name || 'Servicio',
        type: 'servicio',
        href: `/servicios/${s.slug ?? s.id ?? ''}`,
        eyebrow: s.category?.name ?? 'Servicio',
        imageUrl: s.logoUrl ?? s.thumbnailUrl ?? s.bannerUrl,
      });
    });

    eventsQuery.data?.forEach((e) => {
      const title = e.title || '';
      if (!includesQuery(title, debouncedQuery)) return;
      const dateStr = e.startAt
        ? new Date(e.startAt).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        : '';
      results.push({
        id: `evento-${e.id ?? ''}`,
        label: title,
        description: dateStr || e.location?.name || 'Evento',
        type: 'evento',
        href: `/eventos/${e.slug ?? e.id ?? ''}`,
        eyebrow: e.category?.name ?? 'Evento',
        imageUrl: e.thumbnailUrl ?? e.bannerUrl,
      });
    });

    return TYPE_ORDER.flatMap((type) =>
      results
        .filter((result) => result.type === type)
        .sort((a, b) => sortResults(a, b, debouncedQuery))
        .slice(0, MAX_RESULTS_PER_GROUP)
    );
  }, [debouncedQuery, eventsQuery.data, isSearchReady, profilesQuery.data, servicesQuery.data]);

  /* ------ Grouped results for display ------ */
  const groupedResults = useMemo(() => {
    const groups: {
      type: ResultType;
      label: string;
      results: SearchResult[];
    }[] = [];

    for (const type of TYPE_ORDER) {
      const filtered = flatResults.filter((r) => r.type === type);
      if (filtered.length > 0) {
        groups.push({ type, label: TYPE_LABELS[type], results: filtered });
      }
    }

    return groups;
  }, [flatResults]);

  /* ------ Derived state ------ */
  const showDropdown = isFocused && normalizedQuery.length > 0;
  const hasResults = flatResults.length > 0;

  /* ------ Reset highlight when results change ------ */
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [flatResults.length]);

  /* ------ Close on click outside ------ */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        inputRef.current &&
        !inputRef.current.contains(target)
      ) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* ------ Close on Escape ------ */
  useEffect(() => {
    function handleKeyDown(e: globalThis.KeyboardEvent) {
      if (e.key === 'Escape' && showDropdown) {
        setIsFocused(false);
        inputRef.current?.blur();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showDropdown]);

  /* ------ Scroll highlighted item into view ------ */
  useEffect(() => {
    if (highlightedIndex < 0 || !listRef.current) return;
    const items = listRef.current.querySelectorAll<HTMLElement>('[data-index]');
    const target = items[highlightedIndex];
    target?.scrollIntoView({ block: 'nearest' });
  }, [highlightedIndex]);

  /* ------ Handlers ------ */
  const handleSelect = useCallback(
    (result: SearchResult) => {
      setIsFocused(false);
      setQuery('');
      setHighlightedIndex(-1);
      router.push(result.href);
    },
    [router]
  );

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (highlightedIndex >= 0 && flatResults[highlightedIndex]) {
        handleSelect(flatResults[highlightedIndex]);
        return;
      }
      const trimmed = query.trim();
      if (trimmed) {
        setIsFocused(false);
        setQuery('');
        router.push(`/explorar?q=${encodeURIComponent(trimmed)}`);
      }
    },
    [query, highlightedIndex, flatResults, handleSelect, router]
  );

  const handleKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLInputElement>) => {
      if (!showDropdown) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex((prev) => (prev < flatResults.length - 1 ? prev + 1 : 0));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : flatResults.length - 1));
          break;
        case 'Enter':
          // handled by handleSubmit
          break;
        default:
          break;
      }
    },
    [showDropdown, flatResults.length]
  );

  /* ------ Render ------ */
  return (
    <div className={cn('relative', className)}>
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 w-full bg-card border border-border rounded-md px-3 py-1.5 shadow-sm"
      >
        <Search className="h-4 w-4 text-muted-foreground shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsFocused(true);
          }}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-sm"
          autoComplete="off"
          spellCheck={false}
        />
      </form>

      {/* ---- Dropdown ---- */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: 'easeInOut' }}
            className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-[100]"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 px-4 py-6 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Cargando...</span>
              </div>
            ) : hasResults ? (
              <div ref={listRef} className="max-h-80 overflow-y-auto py-2">
                {groupedResults.map((group) => (
                  <div key={group.type}>
                    {/* Group header */}
                    <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                      {group.label}
                    </div>

                    {/* Group items */}
                    {group.results.map((result) => {
                      const flatIdx = flatResults.indexOf(result);
                      const isHighlighted = flatIdx === highlightedIndex;
                      const Icon = TYPE_ICONS[result.type];

                      return (
                        <button
                          key={result.id}
                          data-index={flatIdx}
                          type="button"
                          onMouseEnter={() => setHighlightedIndex(flatIdx)}
                          onClick={() => handleSelect(result)}
                          className={cn(
                            'w-full flex items-start gap-3 px-3 py-2.5 text-left transition-colors duration-150',
                            isHighlighted ? 'bg-muted' : 'hover:bg-muted/50'
                          )}
                        >
                          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted text-muted-foreground">
                            {result.imageUrl ? (
                              <span
                                aria-hidden="true"
                                className="h-full w-full bg-cover bg-center"
                                style={{ backgroundImage: `url(${result.imageUrl})` }}
                              />
                            ) : (
                              <Icon className="h-4 w-4" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="truncate text-sm font-medium text-foreground">
                                {result.label}
                              </span>
                              {result.eyebrow ? (
                                <span className="hidden shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary sm:inline">
                                  {result.eyebrow}
                                </span>
                              ) : null}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {result.description}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            ) : hasError ? (
              <div className="flex items-center gap-3 px-4 py-6 text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
                <span>No pudimos cargar sugerencias. Probá buscar igual con Enter.</span>
              </div>
            ) : (
              /* ---- Empty state ---- */
              <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
                <SearchX className="h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">No encontramos un resultado</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
