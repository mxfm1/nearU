import { Suspense } from 'react';
import { ServiceDetailContent } from './_components/service-detail-content';
import { ServiceDetailSkeleton } from './_components/service-detail-skeleton';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ServicePage({ params }: PageProps) {
  const { id } = await params;
  return (
    <Suspense fallback={<ServiceDetailSkeleton />}>
      <ServiceDetailContent id={id} />
    </Suspense>
  );
}
