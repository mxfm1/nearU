'use client'

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  type FormEvent,
} from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  SearchX,
  Building2,
  Briefcase,
  Calendar,
  Tags,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { serviciosApi } from '@/lib/servicios-api'
import { eventosApi } from '@/lib/eventos-api'

/* -------------------------------------------------------------------------- */
/*  Constants                                                                 */
/* -------------------------------------------------------------------------- */

const SERVICE_CATEGORIES = [
  'Producción',
  'Audiovisual',
  'Catering',
  'Seguridad',
  'Decoración',
  'Tecnología',
  'Espacios',
]

const EVENT_CATEGORIES = [
  'Congreso',
  'Seminario',
  'Feria',
  'Activación',
  'Lanzamiento',
  'Networking',
]

const TYPE_ORDER = ['empresa', 'servicio', 'evento', 'categoria'] as const

const TYPE_LABELS: Record<(typeof TYPE_ORDER)[number], string> = {
  empresa: 'Empresas',
  servicio: 'Servicios',
  evento: 'Eventos',
  categoria: 'Categorías',
}

const TYPE_ICONS = {
  empresa: Building2,
  servicio: Briefcase,
  evento: Calendar,
  categoria: Tags,
} as const

const MAX_RESULTS = 8

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

type ResultType = keyof typeof TYPE_LABELS

interface SearchResult {
  id: string
  label: string
  description: string
  type: ResultType
  href: string
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

interface TypeaheadSearchProps {
  className?: string
  placeholder?: string
}

export function TypeaheadSearch({
  className,
  placeholder = 'Buscar empresas, servicios, eventos...',
}: TypeaheadSearchProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)

  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const normalizedQuery = normalize(query)

  // ── Queries ──
  const { data: serviciosRes, isLoading: serviciosLoading } = useQuery({
    queryKey: ['servicios'],
    queryFn: () => serviciosApi.list(),
  })

  const { data: eventosRes, isLoading: eventosLoading } = useQuery({
    queryKey: ['eventos'],
    queryFn: () => eventosApi.list(),
  })

  const serviciosPublicados = useMemo(
    () => (serviciosRes?.data ?? []).filter((s) => s.status.slug === 'published'),
    [serviciosRes],
  )

  const eventosPublicados = useMemo(
    () => (eventosRes?.data ?? []).filter((e) => e.eventStatus === 'published'),
    [eventosRes],
  )

  const isLoading = serviciosLoading || eventosLoading

  /* ------ Flattened results for keyboard navigation ------ */
  const flatResults = useMemo<SearchResult[]>(() => {
    if (!normalizedQuery) return []

    const results: SearchResult[] = []

    // Empresas (agrupadas por marca única)
    const seenEmpresas = new Set<string>()
    serviciosPublicados.forEach((s) => {
      const name = s.marca || s.title
      if (!normalize(name).includes(normalizedQuery)) return
      if (seenEmpresas.has(name)) return
      seenEmpresas.add(name)
      results.push({
        id: `empresa-${s.slug}`,
        label: name,
        description: s.category?.name ?? 'Proveedor',
        type: 'empresa',
        href: `/servicios/${s.slug}`,
      })
    })

    // Servicios
    serviciosPublicados.forEach((s) => {
      if (!normalize(s.title).includes(normalizedQuery)) return
      results.push({
        id: `servicio-${s.id}`,
        label: s.title,
        description: s.marca || s.category?.name || 'Servicio',
        type: 'servicio',
        href: `/servicios/${s.slug}`,
      })
    })

    // Eventos
    eventosPublicados.forEach((e) => {
      if (!normalize(e.title).includes(normalizedQuery)) return
      const dateStr = e.startAt
        ? new Date(e.startAt).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        : ''
      results.push({
        id: `evento-${e.id}`,
        label: e.title,
        description: dateStr || e.location?.name || 'Evento',
        type: 'evento',
        href: `/search?q=${encodeURIComponent(e.title)}&type=eventos`,
      })
    })

    // Categorías de servicio
    SERVICE_CATEGORIES.forEach((c) => {
      if (normalize(c).includes(normalizedQuery)) {
        results.push({
          id: `cat-servicio-${c}`,
          label: c,
          description: 'Categoría de servicio',
          type: 'categoria',
          href: `/search?type=proveedores&category=${encodeURIComponent(c)}`,
        })
      }
    })

    // Categorías de evento
    EVENT_CATEGORIES.forEach((c) => {
      if (normalize(c).includes(normalizedQuery)) {
        results.push({
          id: `cat-evento-${c}`,
          label: c,
          description: 'Categoría de evento',
          type: 'categoria',
          href: `/search?type=eventos&category=${encodeURIComponent(c)}`,
        })
      }
    })

    // Sort: exact matches first, then alphabetical
    results.sort((a, b) => {
      const aNorm = normalize(a.label)
      const bNorm = normalize(b.label)
      const aExact = aNorm === normalizedQuery ? -1 : 0
      const bExact = bNorm === normalizedQuery ? -1 : 0
      if (aExact !== bExact) return aExact - bExact
      return a.label.localeCompare(b.label)
    })

    return results.slice(0, MAX_RESULTS)
  }, [normalizedQuery, serviciosPublicados, eventosPublicados])

  /* ------ Grouped results for display ------ */
  const groupedResults = useMemo(() => {
    const groups: {
      type: ResultType
      label: string
      results: SearchResult[]
    }[] = []

    for (const type of TYPE_ORDER) {
      const filtered = flatResults.filter((r) => r.type === type)
      if (filtered.length > 0) {
        groups.push({ type, label: TYPE_LABELS[type], results: filtered })
      }
    }

    return groups
  }, [flatResults])

  /* ------ Derived state ------ */
  const showDropdown = isFocused && normalizedQuery.length > 0
  const hasResults = flatResults.length > 0

  /* ------ Reset highlight when results change ------ */
  useEffect(() => {
    setHighlightedIndex(-1)
  }, [flatResults.length])

  /* ------ Close on click outside ------ */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        inputRef.current &&
        !inputRef.current.contains(target)
      ) {
        setIsFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  /* ------ Close on Escape ------ */
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && showDropdown) {
        setIsFocused(false)
        inputRef.current?.blur()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showDropdown])

  /* ------ Scroll highlighted item into view ------ */
  useEffect(() => {
    if (highlightedIndex < 0 || !listRef.current) return
    const items = listRef.current.querySelectorAll<HTMLElement>('[data-index]')
    const target = items[highlightedIndex]
    target?.scrollIntoView({ block: 'nearest' })
  }, [highlightedIndex])

  /* ------ Handlers ------ */
  const handleSelect = useCallback(
    (result: SearchResult) => {
      setIsFocused(false)
      setQuery('')
      setHighlightedIndex(-1)
      router.push(result.href)
    },
    [router],
  )

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      if (highlightedIndex >= 0 && flatResults[highlightedIndex]) {
        handleSelect(flatResults[highlightedIndex])
        return
      }
      const trimmed = query.trim()
      if (trimmed) {
        setIsFocused(false)
        setQuery('')
        router.push(`/search?q=${encodeURIComponent(trimmed)}`)
      }
    },
    [query, highlightedIndex, flatResults, handleSelect, router],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showDropdown) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setHighlightedIndex((prev) =>
            prev < flatResults.length - 1 ? prev + 1 : 0,
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : flatResults.length - 1,
          )
          break
        case 'Enter':
          // handled by handleSubmit
          break
        default:
          break
      }
    },
    [showDropdown, flatResults.length],
  )

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
            setQuery(e.target.value)
            setIsFocused(true)
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
                      const flatIdx = flatResults.indexOf(result)
                      const isHighlighted = flatIdx === highlightedIndex
                      const Icon = TYPE_ICONS[result.type]

                      return (
                        <button
                          key={result.id}
                          data-index={flatIdx}
                          type="button"
                          onMouseEnter={() => setHighlightedIndex(flatIdx)}
                          onClick={() => handleSelect(result)}
                          className={cn(
                            'w-full flex items-start gap-3 px-3 py-2 text-left transition-colors duration-150',
                            isHighlighted
                              ? 'bg-muted'
                              : 'hover:bg-muted/50',
                          )}
                        >
                          <Icon
                            className={cn(
                              'h-4 w-4 mt-0.5 shrink-0',
                              result.type === 'categoria'
                                ? 'text-primary'
                                : 'text-muted-foreground',
                            )}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-foreground truncate">
                              {result.label}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {result.description}
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                ))}
              </div>
            ) : (
              /* ---- Empty state ---- */
              <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
                <SearchX className="h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">
                  No encontramos un resultado
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
