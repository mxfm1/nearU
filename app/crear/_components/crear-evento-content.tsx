'use client'

import { useRouter } from 'next/navigation'
import { useCategoriasEvento, useRegiones } from '@/hooks/evento/evento-queries'
import { useCreateEvento } from '@/hooks/evento/evento-mutations'
import { CrearEventoForm } from './crear-evento-form'
import { CrearEventoSkeleton } from './crear-evento-skeleton'
import { ErrorDisplay, LoadingDisplay } from './display-states'

export function CrearEventoContent() {
  const router = useRouter()

  const categoriasQuery = useCategoriasEvento()
  const regionesQuery = useRegiones()

  const createMutation = useCreateEvento({
    onSuccess: (evento) => {
      router.push(`/crear/evento/${evento.id}`)
    },
  })

  const isLoading = categoriasQuery.isLoading || regionesQuery.isLoading
  const hasError = categoriasQuery.isError || regionesQuery.isError

  if (isLoading) {
    return <CrearEventoSkeleton />
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
          {regionesQuery.isError && (
            <ErrorDisplay
              message={`Error al cargar regiones: ${regionesQuery.error}`}
              onRetry={() => regionesQuery.refetch()}
              retryLabel="Reintentar regiones"
            />
          )}
        </div>
      </div>
    )
  }

  const categorias = categoriasQuery.data ?? []
  const regiones = regionesQuery.data ?? []

  return (
    <div className="section-container pt-20 pb-12 md:pt-28 md:pb-16">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Crear evento
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Completa los datos de tu evento para publicarlo en la plataforma.
        </p>
      </div>

      <CrearEventoForm
        categorias={categorias}
        categoriasLoading={categoriasQuery.isLoading}
        regiones={regiones}
        regionesLoading={regionesQuery.isLoading}
        mutation={createMutation}
        onSuccess={(evento) => router.push(`/crear/evento/${evento.id}`)}
      />

      <p className="text-sm text-zinc-400 mt-4">
        **Si guardas como borrador, el evento estará guardado pero no se mostrará en la app. Lo puedes editar en tus publicaciones
      </p>
    </div>
  )
}
