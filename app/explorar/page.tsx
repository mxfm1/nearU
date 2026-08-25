import { Suspense } from 'react';
import { ExploreScreen } from '@/components/explore/explore-screen';
import { ExploreScreenSkeleton } from '@/components/explore/explore-screen-skeleton';

export default function ExplorarPage() {
  return (
    <Suspense fallback={<ExploreScreenSkeleton />}>
      <ExploreScreen />
    </Suspense>
  );
}
