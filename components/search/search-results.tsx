'use client'

import type { MockProvider, MockEvent } from '@/components/cards/mock-data'
import { ProviderCard } from '@/components/cards/provider-card'
import { EventCard } from '@/components/cards/event-card'

interface SearchResultsProps {
  results: Array<
    | { type: 'provider'; data: MockProvider }
    | { type: 'event'; data: MockEvent }
  >
  totalCount: number
  hasFilters: boolean
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
              key={item.data.slug}
              name={item.data.name}
              category={item.data.category}
              verified={item.data.verified}
              location={item.data.location}
              thumbnail={item.data.thumbnail}
              slug={item.data.slug}
            />
          ) : (
            <EventCard
              key={item.data.slug}
              title={item.data.title}
              description={item.data.description}
              date={item.data.date}
              location={item.data.location}
              thumbnail={item.data.thumbnail}
              slug={item.data.slug}
            />
          ),
        )}
      </div>
    </>
  )
}
