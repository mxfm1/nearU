import { Suspense } from 'react';
import { UserEventApplicationsContent } from './_components/user-event-applications-content';
import { UserEventApplicationsSkeleton } from './_components/user-event-applications-skeleton';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string; page?: string }>;
}

export default async function UserEventAplicacionesPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { status, page } = await searchParams;

  return (
    <Suspense fallback={<UserEventApplicationsSkeleton />}>
      <UserEventApplicationsContent
        eventId={id}
        statusFilter={status || 'all'}
        currentPage={page ? parseInt(page) : 1}
      />
    </Suspense>
  );
}
