'use client'

import { Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { HorizontalScroll } from '@/components/cards/horizontal-scroll'
import { ProviderCard } from '@/components/cards/provider-card'
import { EventCard } from '@/components/cards/event-card'
import { HorizontalSearchBar } from '@/app/search/_components/horizontal-search-bar'
import { mockEvents } from '@/components/cards/mock-data'
import { serviciosApi } from '@/lib/servicios-api'
import { Loader2 } from 'lucide-react'

export default function DescubrirPage() {
  const router = useRouter()

  const {
    data: serviciosRes,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['servicios'],
    queryFn: () => serviciosApi.list(),
  })

  function handleSearch(query: string) {
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  console.log("servicios", serviciosRes?.data)

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
            {isLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground py-8">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Cargando proveedores...</span>
              </div>
            ) : isError ? (
              <p className="text-destructive py-8">
                Error al cargar proveedores. Intenta de nuevo más tarde.
              </p>
            ) : (
              serviciosRes?.data?.map((s) => (
                <ProviderCard
                  key={s.id}
                  name={s.marca}
                  category={s.category?.name ?? 'Sin categoría'}
                  verified={false}
                  location={s.location?.name ?? 'Ubicación no disponible'}
                  thumbnail={s.thumbnailUrl ?? 'https://placehold.co/400x300?text=Sin+imagen'}
                  slug={s.slug}
                />
              ))
            )}
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
