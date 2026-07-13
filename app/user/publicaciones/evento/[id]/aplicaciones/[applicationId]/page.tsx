import { Suspense } from 'react'
import { UserApplicationDetailContent } from './_components/user-application-detail-content'
import { UserApplicationDetailSkeleton } from './_components/user-application-detail-skeleton'

interface PageProps {
  params: Promise<{ id: string; applicationId: string }>
}

export default async function UserApplicationDetailPage({ params }: PageProps) {
  const { id: eventId, applicationId } = await params

  return (
    <Suspense fallback={<UserApplicationDetailSkeleton />}>
      <UserApplicationDetailContent eventId={eventId} applicationId={applicationId} />
    </Suspense>
  )
}
