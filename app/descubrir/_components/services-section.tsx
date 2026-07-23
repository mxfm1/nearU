'use client'

import { Loader2, AlertTriangle, Search } from 'lucide-react'
import { HorizontalScroll } from '@/components/cards/horizontal-scroll'
import { ProviderCard } from '@/components/cards/provider-card'
import { Button } from '@/components/ui/button'
import type { ServicioListItem } from '@/types/contracts/services'
import { UseQueryResult } from '@tanstack/react-query'

interface ServiceSectionProps {
  query: UseQueryResult<ServicioListItem[], Error>
}

export function ServicesSection({
  query,
}: ServiceSectionProps) {
  const { data, isPending, isError, refetch } = query

  if (isPending) {
    return (
      <HorizontalScroll
        title="Proveedores Destacados"
        seeAllHref="/search?type=proveedores"
      >
        <div className="flex items-center gap-2 text-muted-foreground py-8">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Cargando proveedores...</span>
        </div>
      </HorizontalScroll>
    )
  }

  if (isError) {
    return (
      <HorizontalScroll
        title="Proveedores Destacados"
        seeAllHref="/search?type=proveedores"
      >
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <AlertTriangle className="h-8 w-8 text-destructive" />
          <p className="text-destructive text-sm">
            Error al cargar proveedores.
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Reintentar
          </Button>
        </div>
      </HorizontalScroll>
    )
  }

  if (!data || data.length === 0) {
    return (
      <HorizontalScroll
        title="Proveedores Destacados"
        seeAllHref="/search?type=proveedores"
      >
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <Search className="h-8 w-8 text-muted-foreground" />
          <p className="text-muted-foreground text-sm">
            No hay proveedores disponibles por el momento.
          </p>
        </div>
      </HorizontalScroll>
    )
  }

  return (
    <HorizontalScroll
      title="Proveedores Destacados"
      seeAllHref="/search?type=proveedores"
    >
      {data.map((s) => (
        <ProviderCard
          key={s.id}
          name={s.marca || s.title || ''}
          category={s.category?.name || 'Sin categoría'}
          verified={false}
          location={s.location?.name || 'Ubicación no disponible'}
          thumbnail={s.thumbnailUrl || 'https://placehold.co/400x300?text=Sin+imagen'}
          slug={s.slug || ''}
        />
      ))}
    </HorizontalScroll>
  )
}
