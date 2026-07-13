'use client'

import { Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { HorizontalScroll } from '@/components/cards/horizontal-scroll'
import { ProviderCard } from '@/components/cards/provider-card'
import { EventCard } from '@/components/cards/event-card'
import { HorizontalSearchBar } from '@/app/search/_components/horizontal-search-bar'
import { serviciosApi } from '@/lib/servicios-api'
import { eventosApi } from '@/lib/eventos-api'
import { AlertTriangle, Loader2 } from 'lucide-react'

export default function DescubrirPage() {
  const router = useRouter()

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

  console.log("eventos publicados", eventosRes)

  function handleSearch(query: string) {
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  const serviciosPublicados = (serviciosRes?.data ?? []).filter(
    (s) => s.status.slug === 'published'
  )

  const eventosPublicados = (eventosRes?.data ?? []).filter(
    (e) => e.status.slug === 'published'
  )

  console.log("eventos publicaos", eventosPublicados)

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
            {serviciosLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground py-8">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Cargando proveedores...</span>
              </div>
            ) : serviciosError ? (
              <p className="text-destructive py-8">
                Error al cargar proveedores. Intenta de nuevo más tarde.
              </p>
            ) : serviciosPublicados.length === 0 ? (
              <p className="text-muted-foreground py-8">
                No hay proveedores disponibles por el momento.
              </p>
            ) : (
              serviciosPublicados.map((s) => (
                <ProviderCard
                  key={s.id}
                  name={s.marca || s.title}
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
            {eventosLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground py-8">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Cargando eventos...</span>
              </div>
            ) : eventosError ? (
              <p className="text-destructive py-8">
                Error al cargar eventos. Intenta de nuevo más tarde.
              </p>
            ) : eventosPublicados.length === 0 ? (
              <p className="text-muted-foreground py-8">
                No hay eventos disponibles por el momento.
              </p>
            ) : (
              eventosPublicados.map((e) => (
                <EventCard
                  key={e.id}
                  title={e.title}
                  description={e.description}
                  date={new Date(e.startAt).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                  location={e.location?.name ?? 'Ubicación no disponible'}
                  thumbnail={e.thumbnailUrl ?? 'https://placehold.co/400x250?text=Sin+imagen'}
                  slug={e.slug}
                />
              ))
            )}
          </HorizontalScroll>
        </div>
      </section>
    </div>
  )
}
