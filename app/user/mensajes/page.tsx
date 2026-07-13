import { Suspense } from 'react'
import { MensajesListContent } from './_components/mensajes-list-content'
import { MensajesListSkeleton } from './_components/mensajes-list-skeleton'

export default function MensajesPage() {
  return (
    <div className="h-[calc(100vh-4rem)]">
      <Suspense fallback={<MensajesListSkeleton />}>
        <MensajesListContent />
      </Suspense>
    </div>
  )
}
