'use client'

import { Loader2, AlertTriangle, CalendarDays } from 'lucide-react'
import { HorizontalScroll } from '@/components/cards/horizontal-scroll'
import { EventCard } from '@/components/cards/event-card'
import { Button } from '@/components/ui/button'
import type { EventoListItem } from '@/types/contracts/event'

interface EventsSectionProps {
  data: EventoListItem[] | undefined
  isPending: boolean
  isError: boolean
  onRefetch: () => void
}

export function EventsSection({
  data,
  isPending,
  isError,
  onRefetch,
}: EventsSectionProps) {
  if (isPending) {
    return (
      <HorizontalScroll
        title="Próximos Eventos"
        seeAllHref="/search?type=eventos"
      >
        <div className="flex items-center gap-2 text-muted-foreground py-8">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Cargando eventos...</span>
        </div>
      </HorizontalScroll>
    )
  }

  if (isError) {
    return (
      <HorizontalScroll
        title="Próximos Eventos"
        seeAllHref="/search?type=eventos"
      >
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <AlertTriangle className="h-8 w-8 text-destructive" />
          <p className="text-destructive text-sm">
            Error al cargar eventos.
          </p>
          <Button variant="outline" size="sm" onClick={onRefetch}>
            Reintentar
          </Button>
        </div>
      </HorizontalScroll>
    )
  }

  if (!data || data.length === 0) {
    return (
      <HorizontalScroll
        title="Próximos Eventos"
        seeAllHref="/search?type=eventos"
      >
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <CalendarDays className="h-8 w-8 text-muted-foreground" />
          <p className="text-muted-foreground text-sm">
            No hay eventos disponibles por el momento.
          </p>
        </div>
      </HorizontalScroll>
    )
  }

  return (
    <HorizontalScroll
      title="Próximos Eventos"
      seeAllHref="/search?type=eventos"
    >
      {data.map((e) => (
        <EventCard
          key={e.id}
          title={e.title || ''}
          description={e.description || ''}
          date={e.startAt
            ? new Date(e.startAt).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })
            : 'Fecha por confirmar'}
          location={e.location?.name || 'Ubicación no disponible'}
          thumbnail={e.thumbnailUrl || 'https://placehold.co/400x250?text=Sin+imagen'}
          slug={e.slug || ''}
        />
      ))}
    </HorizontalScroll>
  )
}
