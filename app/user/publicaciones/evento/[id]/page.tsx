import { Suspense } from 'react'
import { EditarEventoContent } from './_components/editar-evento-content'

interface PageProps {
  params: Promise<{ id: string }>
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="h-8 w-8 mx-auto mb-4 animate-spin rounded-full border-4 border-brand/30 border-t-brand" />
        <p className="text-sm text-muted-foreground">Cargando evento...</p>
      </div>
    </div>
  )
}

export default async function EditarEventoPage({ params }: PageProps) {
  const { id } = await params
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <EditarEventoContent id={id} />
    </Suspense>
  )
}
