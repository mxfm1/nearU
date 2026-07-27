import { Suspense } from 'react';
import { EventPageContent } from '../_components/event-page-content';
import { EventLoadingSkeleton } from '../_components/event-loading-skeleton';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EventPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <Suspense fallback={<EventLoadingSkeleton />}>
      <EventPageContent id={id} />
    </Suspense>
  );
}
