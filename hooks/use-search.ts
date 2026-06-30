'use client'

import { useCallback, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { serviciosApi, type ServicioResumen } from '@/lib/servicios-api'
import { eventosApi, type EventoResumen } from '@/lib/eventos-api'
import { normalize } from '@/lib/normalize'
import { REGION_ALIASES } from '@/lib/region-aliases'

const PAGINATION_SIZE = 6

function filterProviders(
  providers: ServicioResumen[],
  q: string,
  category: string,
  region: string,
): ServicioResumen[] {
  return providers.filter((p) => {
    const name = normalize(p.marca)
    const catName = normalize(p.category?.name ?? '')
    const locName = normalize(p.location?.name ?? '')
    const query = normalize(q)

    if (q && !name.includes(query) && !catName.includes(query)) {
      return false
    }
    if (category && !catName.includes(normalize(category))) {
      return false
    }
    if (region) {
      const regionNorm = normalize(region)
      if (!locName.includes(regionNorm)) {
        const aliases = REGION_ALIASES[regionNorm]
        if (!aliases || !aliases.some((a) => locName.includes(a))) {
          return false
        }
      }
    }
    return true
  })
}

function parseISO(dateStr: string): Date | null {
  const d = new Date(dateStr)
  return isNaN(d.getTime()) ? null : d
}

function filterEvents(
  events: EventoResumen[],
  q: string,
  category: string,
  region: string,
  dateFrom: string,
  dateTo: string,
): EventoResumen[] {
  return events.filter((e) => {
    const title = normalize(e.title)
    const description = normalize(e.description ?? '')
    const query = normalize(q)
    const catNorm = normalize(category)

    if (q && !title.includes(query) && !description.includes(query)) {
      return false
    }
    if (category && !title.includes(catNorm) && !description.includes(catNorm)) {
      return false
    }
    if (region) {
      const location = normalize(e.location?.name ?? '')
      const regionNorm = normalize(region)
      if (!location.includes(regionNorm)) {
        const regionAliases = REGION_ALIASES[regionNorm]
        if (!regionAliases || !regionAliases.some((a) => location.includes(a))) {
          return false
        }
      }
    }
    if (dateFrom || dateTo) {
      const eventDate = parseISO(e.startAt)
      if (eventDate) {
        if (dateFrom) {
          const fromDate = new Date(dateFrom)
          if (eventDate < fromDate) return false
        }
        if (dateTo) {
          const toDate = new Date(dateTo)
          toDate.setHours(23, 59, 59, 999)
          if (eventDate > toDate) return false
        }
      }
    }
    return true
  })
}

export function useSearch() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const q = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const region = searchParams.get('region') || ''
  const type = searchParams.get('type') || ''
  const dateFrom = searchParams.get('dateFrom') || ''
  const dateTo = searchParams.get('dateTo') || ''
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))

  // ── Queries ──

  const {
    data: serviciosRes,
    isLoading: serviciosLoading,
    isError: serviciosError,
  } = useQuery({
    queryKey: ['servicios'],
    queryFn: () => serviciosApi.list(),
  })

  const {
    data: eventosRes,
    isLoading: eventosLoading,
    isError: eventosError,
  } = useQuery({
    queryKey: ['eventos'],
    queryFn: () => eventosApi.list(),
  })

  const servicios = serviciosRes?.data ?? []
  const eventos = eventosRes?.data ?? []
  const isLoading = serviciosLoading || eventosLoading
  const isError = serviciosError || eventosError

  // ── URL helpers ──

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([key, value]) => {
        if (value) params.set(key, value)
        else params.delete(key)
      })
      router.push(`/search?${params.toString()}`)
    },
    [searchParams, router],
  )

  const handleSearch = useCallback(
    (query: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (query) params.set('q', query)
      else params.delete('q')
      params.set('page', '1')
      router.push(`/search?${params.toString()}`)
    },
    [searchParams, router],
  )

  const goToPage = useCallback(
    (p: number) => {
      updateParams({ page: String(p) })
    },
    [updateParams],
  )

  // ── Filtering ──

  const showProviders = !type || type === 'proveedores'
  const showEvents = !type || type === 'eventos'

  const filteredProviders = useMemo(
    () => (showProviders ? filterProviders(servicios, q, category, region) : []),
    [servicios, q, category, region, showProviders],
  )

  const filteredEvents = useMemo(
    () => (showEvents ? filterEvents(eventos, q, category, region, dateFrom, dateTo) : []),
    [eventos, q, category, region, dateFrom, dateTo, showEvents],
  )

  const results = useMemo(() => {
    const combined: Array<
      | { type: 'provider'; data: ServicioResumen }
      | { type: 'event'; data: EventoResumen }
    > = []
    if (showProviders) {
      filteredProviders.forEach((p) => combined.push({ type: 'provider', data: p }))
    }
    if (showEvents) {
      filteredEvents.forEach((e) => combined.push({ type: 'event', data: e }))
    }
    return combined
  }, [filteredProviders, filteredEvents, showProviders, showEvents])

  const totalPages = Math.max(1, Math.ceil(results.length / PAGINATION_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginatedResults = results.slice(
    (currentPage - 1) * PAGINATION_SIZE,
    currentPage * PAGINATION_SIZE,
  )

  const hasFilters = !!(q || category || region || dateFrom || dateTo)

  return {
    q,
    category,
    region,
    type,
    dateFrom,
    dateTo,
    isLoading,
    isError,
    results,
    totalPages,
    currentPage,
    paginatedResults,
    hasFilters,
    updateParams,
    handleSearch,
    goToPage,
  }
}
