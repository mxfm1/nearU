import { Suspense } from 'react'
import { CrearPageContent } from '@/components/crear/crear-page-content'
import { CrearSkeleton } from '@/components/crear/crear-skeleton'

export default function CrearPage() {
  return (
    <Suspense fallback={<CrearSkeleton />}>
      <CrearPageContent />
    </Suspense>
  )
}
