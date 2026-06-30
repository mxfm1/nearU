'use client'

import type { ServicioResumen } from '@/lib/servicios-api'
import type { EventoResumen } from '@/lib/eventos-api'
import { ProviderCard } from '@/components/cards/provider-card'
import { EventCard } from '@/components/cards/event-card'

interface SearchResultsProps {
  results: Array<
    | { type: 'provider'; data: ServicioResumen }
    | { type: 'event'; data: EventoResumen }
  >
  totalCount: number
  hasFilters: boolean
}

function formatEventDate(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function SearchResults({
  results,
  totalCount,
  hasFilters,
}: SearchResultsProps) {
  return (
    <>
      <p className="text-sm text-muted-foreground mb-6">
        {totalCount} resultado
        {totalCount !== 1 ? 's' : ''}
        {hasFilters && ' encontrados'}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {results.map((item) =>
          item.type === 'provider' ? (
            <ProviderCard
              key={item.data.id}
              name={item.data.marca}
              category={item.data.category?.name ?? 'Sin categoría'}
              verified={false}
              location={item.data.location?.name ?? 'Ubicación no disponible'}
              thumbnail={item.data.thumbnailUrl ?? 'https://placehold.co/400x300?text=Sin+imagen'}
              slug={item.data.slug}
            />
          ) : (
            <EventCard
              key={item.data.id}
              title={item.data.title}
              description={item.data.description}
              date={formatEventDate(item.data.startAt)}
              location={item.data.location?.name ?? 'Ubicación no disponible'}
              thumbnail={item.data.thumbnailUrl ?? 'https://placehold.co/400x250?text=Sin+imagen'}
              slug={item.data.slug}
            />
          ),
        )}
      </div>
    </>
  )
}
