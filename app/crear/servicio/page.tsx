import { Suspense } from 'react'
import { CrearServicioContent } from '@/components/crear/crear-servicio-content'
import { ServicioSkeleton } from '@/components/crear/servicio-skeleton'

export default function CrearServicioPage() {
  return (
    <Suspense fallback={<ServicioSkeleton />}>
      <CrearServicioContent />
    </Suspense>
  )
}
