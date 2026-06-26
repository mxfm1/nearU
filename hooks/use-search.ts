'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  mockProviders,
  mockEvents,
  type MockProvider,
  type MockEvent,
} from '@/components/cards/mock-data'
import { normalize, parseEventDate } from '@/lib/normalize'
import { REGION_ALIASES } from '@/lib/region-aliases'

const PAGINATION_SIZE = 6

function filterProviders(
  providers: MockProvider[],
  q: string,
  category: string,
  region: string,
): MockProvider[] {
  return providers.filter((p) => {
    if (q && !normalize(p.name).includes(normalize(q)) && !normalize(p.category).includes(normalize(q))) {
      return false
    }
    if (category && !normalize(p.category).includes(normalize(category))) {
      return false
    }
    if (region) {
      const location = normalize(p.location)
      const regionNorm = normalize(region)
      if (!location.includes(regionNorm)) {
        const regionAliases = REGION_ALIASES[regionNorm]
        if (!regionAliases || !regionAliases.some((a) => location.includes(a))) {
          return false
        }
      }
    }
    return true
  })
}

function filterEvents(
  events: MockEvent[],
  q: string,
  category: string,
  region: string,
  dateFrom: string,
  dateTo: string,
): MockEvent[] {
  return events.filter((e) => {
    if (q && !normalize(e.title).includes(normalize(q)) && !normalize(e.description).includes(normalize(q))) {
      return false
    }
    if (category && !normalize(e.title).includes(normalize(category)) && !normalize(e.description).includes(normalize(category))) {
      return false
    }
    if (region) {
      const location = normalize(e.location)
      const regionNorm = normalize(region)
      if (!location.includes(regionNorm)) {
        const regionAliases = REGION_ALIASES[regionNorm]
        if (!regionAliases || !regionAliases.some((a) => location.includes(a))) {
          return false
        }
      }
    }
    if (dateFrom || dateTo) {
      const eventDate = parseEventDate(e.date)
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

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 200)
    return () => clearTimeout(timer)
  }, [q, category, region, type, dateFrom, dateTo, page])

  useEffect(() => {
    setIsLoading(false)
  }, [])

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

  const showProviders = !type || type === 'proveedores'
  const showEvents = !type || type === 'eventos'

  const filteredProviders = useMemo(
    () => (showProviders ? filterProviders(mockProviders, q, category, region) : []),
    [q, category, region, showProviders],
  )

  const filteredEvents = useMemo(
    () => (showEvents ? filterEvents(mockEvents, q, category, region, dateFrom, dateTo) : []),
    [q, category, region, dateFrom, dateTo, showEvents],
  )

  const results = useMemo(() => {
    const combined: Array<
      | { type: 'provider'; data: MockProvider }
      | { type: 'event'; data: MockEvent }
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
