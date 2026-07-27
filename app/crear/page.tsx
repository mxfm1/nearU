import { Suspense } from 'react';
import { CrearPageContent } from './_components/crear-page-content';
import { CrearSkeleton } from './_components/crear-skeleton';

export default function CrearPage() {
  return (
    <Suspense fallback={<CrearSkeleton />}>
      <CrearPageContent />
    </Suspense>
  );
}
