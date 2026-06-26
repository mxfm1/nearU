import { Suspense } from 'react'
import { CrearEventoContent } from '@/components/crear/crear-evento-content'
import { EventoSkeleton } from '@/components/crear/evento-skeleton'

export default function CrearEventoPage() {
  return (
    <Suspense fallback={<EventoSkeleton />}>
      <CrearEventoContent />
    </Suspense>
  )
}
