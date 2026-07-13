import { Suspense } from 'react'
import { MensajesContent } from './_components/mensajes-content'
import { MensajesSkeleton } from './_components/mensajes-skeleton'

export default function MensajesDetallePage({
  params,
}: {
  params: { threadId: string }
}) {
  return (
    <Suspense fallback={<MensajesSkeleton />}>
      <MensajesContent threadId={params.threadId} />
    </Suspense>
  )
}
