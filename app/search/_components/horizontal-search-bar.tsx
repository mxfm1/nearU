'use client'

import { useState, useEffect, useCallback, type FormEvent } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search, SlidersHorizontal } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useMediaQuery } from '@/hooks/use-media-query'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { FilterModal } from './filters/filter-modal'

interface HorizontalSearchBarProps {
  onSearch?: (query: string) => void
  onFilterChange?: (updates: Record<string, string>) => void
  initialFilters?: {
    type?: string
    category?: string
    region?: string
    dateFrom?: string
    dateTo?: string
  }
  className?: string
}

const typeOptions = [
  { value: '', label: 'Todos' },
  { value: 'proveedores', label: 'Proveedores' },
  { value: 'eventos', label: 'Eventos' },
]

const serviceCategories = [
  { value: '', label: 'Todas las categorías' },
  { value: 'produccion', label: 'Producción' },
  { value: 'audiovisual', label: 'Audiovisual' },
  { value: 'catering', label: 'Catering' },
  { value: 'seguridad', label: 'Seguridad' },
  { value: 'decoracion', label: 'Decoración' },
  { value: 'tecnologia', label: 'Tecnología' },
  { value: 'espacios', label: 'Espacios' },
]

const eventCategories = [
  { value: '', label: 'Todas las categorías' },
  { value: 'congreso', label: 'Congreso' },
  { value: 'seminario', label: 'Seminario' },
  { value: 'feria', label: 'Feria' },
  { value: 'activacion', label: 'Activación' },
  { value: 'lanzamiento', label: 'Lanzamiento' },
  { value: 'networking', label: 'Networking' },
]

const regions = [
  { value: '', label: 'Todas las regiones' },
  { value: 'Arica y Parinacota', label: 'Arica y Parinacota' },
  { value: 'Tarapacá', label: 'Tarapacá' },
  { value: 'Antofagasta', label: 'Antofagasta' },
  { value: 'Atacama', label: 'Atacama' },
  { value: 'Coquimbo', label: 'Coquimbo' },
  { value: 'Valparaíso', label: 'Valparaíso' },
  { value: 'Metropolitana', label: 'Metropolitana' },
  { value: "O'Higgins", label: "O'Higgins" },
  { value: 'Maule', label: 'Maule' },
  { value: 'Ñuble', label: 'Ñuble' },
  { value: 'Biobío', label: 'Biobío' },
  { value: 'La Araucanía', label: 'La Araucanía' },
  { value: 'Los Ríos', label: 'Los Ríos' },
  { value: 'Los Lagos', label: 'Los Lagos' },
  { value: 'Aysén', label: 'Aysén' },
  { value: 'Magallanes', label: 'Magallanes' },
]

function formatDateRange(dateFrom: string, dateTo: string): string | null {
  if (!dateFrom && !dateTo) return null
  if (dateFrom && dateTo) return `${dateFrom} – ${dateTo}`
  if (dateFrom) return `Desde ${dateFrom}`
  return `Hasta ${dateTo}`
}

export function HorizontalSearchBar({
  onSearch,
  onFilterChange,
  initialFilters,
  className,
}: HorizontalSearchBarProps) {
  const isCallbackMode = !!onSearch || !!onFilterChange

  const searchParams = useSearchParams()
  const router = useRouter()
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const [query, setQuery] = useState('')
  const [localType, setLocalType] = useState(initialFilters?.type || '')
  const [localCategory, setLocalCategory] = useState(initialFilters?.category || '')
  const [localRegion, setLocalRegion] = useState(initialFilters?.region || '')
  const [localDateFrom, setLocalDateFrom] = useState(initialFilters?.dateFrom || '')
  const [localDateTo, setLocalDateTo] = useState(initialFilters?.dateTo || '')
  const [modalOpen, setModalOpen] = useState(false)
  const [popoverOpen, setPopoverOpen] = useState(false)

  const categoryType = localType === 'eventos' ? 'event' : 'service'
  const categories = categoryType === 'service' ? serviceCategories : eventCategories
  const showDateFilter = localType === 'eventos'
  const hasActiveFilters = !!(localCategory || localRegion || localDateFrom || localDateTo)
  const dateLabel = formatDateRange(localDateFrom, localDateTo)

  useEffect(() => {
    if (!isCallbackMode) {
      setQuery(searchParams.get('q') || '')
      setLocalType(searchParams.get('type') || '')
      setLocalCategory(searchParams.get('category') || '')
      setLocalRegion(searchParams.get('region') || '')
      setLocalDateFrom(searchParams.get('dateFrom') || '')
      setLocalDateTo(searchParams.get('dateTo') || '')
    }
  }, [isCallbackMode, searchParams])

  useEffect(() => {
    if (!isCallbackMode) {
      const handlePopState = () => {
        const params = new URLSearchParams(window.location.search)
        setQuery(params.get('q') || '')
        setLocalType(params.get('type') || '')
        setLocalCategory(params.get('category') || '')
        setLocalRegion(params.get('region') || '')
        setLocalDateFrom(params.get('dateFrom') || '')
        setLocalDateTo(params.get('dateTo') || '')
      }
      window.addEventListener('popstate', handlePopState)
      return () => window.removeEventListener('popstate', handlePopState)
    }
  }, [isCallbackMode])

  function handleTypeChange(value: string) {
    const updates: Record<string, string> = { type: value, page: '1' }
    const resetCategory = value !== localType
    if (resetCategory) {
      updates.category = ''
      setLocalCategory('')
    }
    if (value !== 'eventos') {
      updates.dateFrom = ''
      updates.dateTo = ''
      setLocalDateFrom('')
      setLocalDateTo('')
    }
    setLocalType(value)

    if (isCallbackMode && onFilterChange) {
      onFilterChange(updates)
    }
  }

  function handleFilterChange(updates: Record<string, string>) {
    if (updates.category !== undefined) setLocalCategory(updates.category)
    if (updates.region !== undefined) setLocalRegion(updates.region)
    if (updates.dateFrom !== undefined) setLocalDateFrom(updates.dateFrom)
    if (updates.dateTo !== undefined) setLocalDateTo(updates.dateTo)

    if (isCallbackMode && onFilterChange) {
      onFilterChange(updates)
    }
  }

  function handleClear() {
    setLocalCategory('')
    setLocalRegion('')
    setLocalDateFrom('')
    setLocalDateTo('')

    if (isCallbackMode && onFilterChange) {
      onFilterChange({ category: '', region: '', dateFrom: '', dateTo: '' })
    }
  }

  function handleTypeClick(value: string) {
    handleTypeChange(value)
  }

  function handleApplyFilters() {
    setModalOpen(false)
  }

  const navigateWithParams = useCallback(
    (extraUpdates?: Record<string, string>) => {
      const params = new URLSearchParams()
      if (query.trim()) params.set('q', query.trim())
      if (localType) params.set('type', localType)
      if (localCategory) params.set('category', localCategory)
      if (localRegion) params.set('region', localRegion)
      if (localDateFrom) params.set('dateFrom', localDateFrom)
      if (localDateTo) params.set('dateTo', localDateTo)
      if (extraUpdates) {
        Object.entries(extraUpdates).forEach(([key, value]) => {
          if (value) params.set(key, value)
          else params.delete(key)
        })
      }
      params.set('page', '1')
      router.push(`/search?${params.toString()}`)
    },
    [query, localType, localCategory, localRegion, localDateFrom, localDateTo, router],
  )

  const navigateDebounced = useCallback(
    (() => {
      let timer: ReturnType<typeof setTimeout> | null = null
      return (extraUpdates?: Record<string, string>) => {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => navigateWithParams(extraUpdates), 150)
      }
    })(),
    [navigateWithParams],
  )



  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (!query.trim() && !localType && !localCategory && !localRegion && !localDateFrom && !localDateTo) {
      router.push('/search')
      return
    }

    if (isCallbackMode) {
      if (onSearch) onSearch(query.trim())
      navigateWithParams()
    } else {
      navigateDebounced()
    }
  }

  function handleQueryKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const desktopForm = (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'flex items-center gap-2 w-full bg-card border border-border rounded-md px-4 py-2 shadow-sm flex-wrap',
        className,
      )}
    >
      <Search className="h-5 w-5 text-muted-foreground shrink-0" />

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleQueryKeyDown}
        placeholder="Busca servicios, eventos o proveedores..."
        className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-base min-w-[120px]"
      />

      <select
        value={localType}
        onChange={(e) => handleTypeChange(e.target.value)}
        className="border-l border-border pl-3 bg-transparent text-sm min-w-[100px] text-foreground outline-none"
      >
        {typeOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <select
        value={localCategory}
        onChange={(e) => handleFilterChange({ category: e.target.value })}
        className="border-l border-border pl-3 bg-transparent text-sm min-w-[120px] text-foreground outline-none"
      >
        {categories.map((cat) => (
          <option key={cat.value} value={cat.value}>
            {cat.label}
          </option>
        ))}
      </select>

      <select
        value={localRegion}
        onChange={(e) => handleFilterChange({ region: e.target.value })}
        className="border-l border-border pl-3 bg-transparent text-sm min-w-[140px] text-foreground outline-none"
      >
        {regions.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </select>

      {showDateFilter && (
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="border-l border-border pl-3 text-sm text-muted-foreground whitespace-nowrap outline-none hover:text-foreground transition-colors"
            >
              {dateLabel || 'Fechas'}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3">
            <div className="flex gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-muted-foreground">Desde</label>
                <input
                  type="date"
                  value={localDateFrom}
                  onChange={(e) => {
                    setLocalDateFrom(e.target.value)
                    if (isCallbackMode && onFilterChange) {
                      onFilterChange({ dateFrom: e.target.value })
                    }
                  }}
                  className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm text-foreground [color-scheme:light] dark:[color-scheme:dark]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-muted-foreground">Hasta</label>
                <input
                  type="date"
                  value={localDateTo}
                  onChange={(e) => {
                    setLocalDateTo(e.target.value)
                    if (isCallbackMode && onFilterChange) {
                      onFilterChange({ dateTo: e.target.value })
                    }
                  }}
                  className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm text-foreground [color-scheme:light] dark:[color-scheme:dark]"
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}

      <button
        type="submit"
        className="bg-primary text-primary-foreground rounded-md px-7 py-2.5 text-sm font-semibold whitespace-nowrap hover:bg-primary/90 transition-colors"
      >
        Buscar
      </button>
    </form>
  )

  const mobileForm = (
    <>
      <form
        onSubmit={handleSubmit}
        className={cn(
          'flex items-center gap-2 w-full bg-card border border-border rounded-md px-4 py-2 shadow-sm',
          className,
        )}
      >
        <Search className="h-5 w-5 text-muted-foreground shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleQueryKeyDown}
          placeholder="Buscar..."
          className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-base"
        />
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap flex items-center gap-1"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filtros{hasActiveFilters && ` (${(localCategory ? 1 : 0) + (localRegion ? 1 : 0) + (localDateFrom || localDateTo ? 1 : 0)})`}
        </button>
        <button
          type="submit"
          className="bg-primary text-primary-foreground rounded-md px-7 py-2.5 text-sm font-semibold whitespace-nowrap hover:bg-primary/90 transition-colors"
        >
          Buscar
        </button>
      </form>

      <FilterModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        type={localType}
        category={localCategory}
        region={localRegion}
        dateFrom={localDateFrom}
        dateTo={localDateTo}
        onTypeChange={handleTypeClick}
        onFilterChange={handleFilterChange}
        onClear={handleClear}
        onApply={handleApplyFilters}
      />
    </>
  )

  return isDesktop ? desktopForm : mobileForm
}
