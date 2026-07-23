'use client'

import { useRouter } from 'next/navigation'
import { useCategoriasServicio, useUbicaciones } from '@/hooks/services/service-queries'
import { useCreateService } from '@/hooks/services/service-mutations'
import { CrearServicioForm } from './crear-servicio-form'
import { CrearServicioSkeleton } from './crear-servicio-skeleton'
import { ErrorDisplay } from './display-states'

export function CrearServicioContent() {
  const router = useRouter()

  const categoriasQuery = useCategoriasServicio()
  const ubicacionesQuery = useUbicaciones()

  const createMutation = useCreateService()

  const isLoading = categoriasQuery.isLoading || ubicacionesQuery.isLoading
  const hasError = categoriasQuery.isError || ubicacionesQuery.isError

  if (isLoading) {
    return <CrearServicioSkeleton />
  }

  if (hasError) {
    return (
      <div className="section-container pt-20 pb-12 md:pt-28 md:pb-16">
        <div className="card-base rounded-xl p-6">
          {categoriasQuery.isError && (
            <ErrorDisplay
              message={`Error al cargar categorías: ${categoriasQuery.error}`}
              onRetry={() => categoriasQuery.refetch()}
              retryLabel="Reintentar categorías"
              className="mb-4"
            />
          )}
          {ubicacionesQuery.isError && (
            <ErrorDisplay
              message={`Error al cargar ubicaciones: ${ubicacionesQuery.error}`}
              onRetry={() => ubicacionesQuery.refetch()}
              retryLabel="Reintentar ubicaciones"
            />
          )}
        </div>
      </div>
    )
  }

  const categorias = categoriasQuery.data ?? []
  const ubicaciones = ubicacionesQuery.data ?? []

  return (
    <section className="px-4 pt-24 pb-20 md:pt-32 md:pb-28">
      <CrearServicioForm
        categorias={categorias}
        categoriasLoading={categoriasQuery.isLoading}
        ubicaciones={ubicaciones}
        ubicacionesLoading={ubicacionesQuery.isLoading}
        mutation={createMutation}
      />
    </section>
  )
}
