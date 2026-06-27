import { Suspense } from 'react'
import { CrearEventoContent } from '../_components/crear-evento-content'
import { EventoSkeleton } from '../_components/evento-skeleton'

export default function CrearEventoPage() {
  return (
    <Suspense fallback={<EventoSkeleton />}>
      <CrearEventoContent />
    </Suspense>
  )
}
