import { Suspense } from 'react'
import { MensajesListContent } from './_components/mensajes-list-content.presentational'
import { MensajesListSkeleton } from './_components/mensajes-list-skeleton'
import { useMensajesList } from '@/hooks/use-mensajes-list'

export default function MensajesPage() {
  const { conversations, isLoading, isError, error, refetch } = useMensajesList()

  return (
    <div className="h-[calc(100vh-4rem)]">
      <Suspense fallback={<MensajesListSkeleton />}>
        <MensajesListContent
          conversations={conversations}
          isLoading={isLoading}
          isError={isError}
          error={error instanceof Error ? error : null}
          onRetry={refetch}
        />
      </Suspense>
    </div>
  )
}
