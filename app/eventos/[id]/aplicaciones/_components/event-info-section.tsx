'use client'

import Link from 'next/link'
import { ArrowLeft, Calendar, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { EventoDetalle } from '@/lib/eventos-api'

interface EventInfoSectionProps {
  event: EventoDetalle | null
}

export function EventInfoSection({ event }: EventInfoSectionProps) {
  if (!event) return null

  return (
    <section className="bg-card rounded-xl shadow-sm overflow-hidden mb-8 border border-border">
      <div className="flex flex-col md:flex-row items-center p-6 gap-6">
        <div className="w-full md:w-32 h-24 rounded-lg overflow-hidden shrink-0 bg-muted">
          {event.thumbnailUrl ? (
            <img
              src={event.thumbnailUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/10">
              <span className="text-3xl">📅</span>
            </div>
          )}
        </div>
        <div className="flex-grow text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-1">
            <h1 className="text-2xl font-bold text-primary">{event.title}</h1>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Activo
            </span>
          </div>
          <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-4">
            {event.startAt && (
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(event.startAt as string).toLocaleDateString('es-CL', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            )}
            {event.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {event.location?.name || 'Ubicación no disponible'}
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            Editar Evento
          </Button>
        </div>
      </div>
    </section>
  )
}
