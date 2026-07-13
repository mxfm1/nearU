import { Suspense } from 'react'
import { ApplicationDetailContent } from './_components/application-detail-content'
import { ApplicationDetailSkeleton } from './_components/application-detail-skeleton'

interface PageProps {
  params: Promise<{ id: string; applicationId: string }>
}

export default async function ApplicationDetailPage({ params }: PageProps) {
  const { id: eventId, applicationId } = await params

  return (
    <Suspense fallback={<ApplicationDetailSkeleton />}>
      <ApplicationDetailContent eventId={eventId} applicationId={applicationId} />
    </Suspense>
  )
}
