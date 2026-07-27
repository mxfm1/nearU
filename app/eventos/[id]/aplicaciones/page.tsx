'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, use } from 'react';
import { EventApplicationsContent } from './_components/event-applications-content';
import { EventApplicationsSkeleton } from './_components/event-applications-skeleton';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EventApplicationsPage({ params }: PageProps) {
  return (
    <Suspense fallback={<EventApplicationsSkeleton />}>
      <EventApplicationsPageClient params={params} />
    </Suspense>
  );
}

function EventApplicationsPageClient({ params }: PageProps) {
  const { id: eventId } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();

  const statusFilter = searchParams.get('status') || 'all';
  const currentPage = parseInt(searchParams.get('page') || '1') || 1;

  function handleStatusChange(newStatus: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (newStatus === 'all') {
      params.delete('status');
    } else {
      params.set('status', newStatus);
    }
    params.delete('page');
    router.push(`?${params.toString()}`);
  }

  function handlePageChange(newPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    router.push(`?${params.toString()}`);
  }

  return (
    <EventApplicationsContent
      eventId={eventId}
      statusFilter={statusFilter}
      currentPage={currentPage}
      onStatusChange={handleStatusChange}
      onPageChange={handlePageChange}
    />
  );
}
