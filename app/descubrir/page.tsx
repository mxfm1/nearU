'use client'

import { Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { HorizontalSearchBar } from '@/app/search/_components/horizontal-search-bar'
import { ServicesSection } from './_components/services-section'
import { EventsSection } from './_components/events-section'
import { useServices } from '@/hooks/use-service'
import { useEvents } from '@/hooks/use-event'

export default function DescubrirPage() {
  const router = useRouter()
  const serviceData = useServices()
  const eventData = useEvents()

  function handleSearch(query: string) {
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <div className="bg-background min-h-screen">
      <section className="px-4 pb-12 md:pb-16 pt-4 md:pt-10">
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
          <ServicesSection
            query={serviceData}
          />
        </div>
      </section>

      <section className="px-4 pb-20 md:pb-28">
        <div className="max-w-[1200px] mx-auto">
          <EventsSection
            data={eventData.data}
            isPending={eventData.isLoading}
            isError={eventData.isError}
            onRefetch={eventData.refetch}
          />
        </div>
      </section>
    </div>
  )
}
