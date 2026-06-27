'use client'

import { Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { HorizontalScroll } from '@/components/cards/horizontal-scroll'
import { ProviderCard } from '@/components/cards/provider-card'
import { EventCard } from '@/components/cards/event-card'
import { HorizontalSearchBar } from '@/app/search/_components/horizontal-search-bar'
import { mockProviders, mockEvents } from '@/components/cards/mock-data'

export default function DescubrirPage() {
  const router = useRouter()

  function handleSearch(query: string) {
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <div className="bg-background min-h-screen">
      <section className="px-4 pt-28 pb-12 md:pt-36 md:pb-16">
        <div className="max-w-[1200px] mx-auto">
          <h1 className="text-[40px] font-semibold leading-[1.2] text-foreground mb-4">
            Descubre
          </h1>
          <p className="text-[18px] leading-[1.7] text-muted-foreground max-w-xl mb-8">
            Encuentra los mejores servicios y oportunidades para tu próximo
            evento
          </p>
          <Suspense fallback={null}>
            <HorizontalSearchBar onSearch={handleSearch} />
          </Suspense>
        </div>
      </section>

      <section className="px-4 pb-12 md:pb-20">
        <div className="max-w-[1200px] mx-auto">
          <HorizontalScroll
            title="Proveedores Destacados"
            seeAllHref="/search?type=proveedores"
          >
            {mockProviders.map((provider) => (
              <ProviderCard
                key={provider.slug}
                name={provider.name}
                category={provider.category}
                verified={provider.verified}
                location={provider.location}
                thumbnail={provider.thumbnail}
                slug={provider.slug}
              />
            ))}
          </HorizontalScroll>
        </div>
      </section>

      <section className="px-4 pb-20 md:pb-28">
        <div className="max-w-[1200px] mx-auto">
          <HorizontalScroll
            title="Próximos Eventos"
            seeAllHref="/search?type=eventos"
          >
            {mockEvents.map((event) => (
              <EventCard
                key={event.slug}
                title={event.title}
                description={event.description}
                date={event.date}
                location={event.location}
                thumbnail={event.thumbnail}
                slug={event.slug}
              />
            ))}
          </HorizontalScroll>
        </div>
      </section>
    </div>
  )
}
