import { Suspense } from 'react';
import { ExploreScreen } from '@/components/explore/explore-screen';
import { ExploreScreenSkeleton } from '@/components/explore/explore-screen-skeleton';

export default function DescubrirPage() {
  return (
    <Suspense fallback={<ExploreScreenSkeleton filtersPlacement="top" />}>
      <ExploreScreen filtersPlacement="top" />
    </Suspense>
  );
}
