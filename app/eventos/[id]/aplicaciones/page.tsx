import { Suspense } from 'react'
import { EventApplicationsContent } from './_components/event-applications-content'
import { EventApplicationsSkeleton } from './_components/event-applications-skeleton'

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ status?: string; page?: string }>
}

export default async function EventApplicationsPage({ params, searchParams }: PageProps) {
  const { id } = await params
  const { status, page } = await searchParams

  return (
    <Suspense fallback={<EventApplicationsSkeleton />}>
      <EventApplicationsContent 
        eventId={id} 
        statusFilter={status || 'all'}
        currentPage={page ? parseInt(page) : 1}
      />
    </Suspense>
  )
}
