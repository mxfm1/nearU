import { Suspense } from 'react'
import { ServicePageContent } from '@/components/servicios/service-page-content'
import { LoadingSkeleton } from '@/components/servicios/loading-skeleton'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ServicePage({ params }: PageProps) {
  const { id } = await params
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <ServicePageContent id={id} />
    </Suspense>
  )
}
