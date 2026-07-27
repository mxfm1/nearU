'use client';

import { Suspense } from 'react';
import { MensajesListContent } from './_components/mensajes-list-content.presentational';
import { MensajesListSkeleton } from './_components/mensajes-list-skeleton';
import { useMensajesList } from '@/hooks/use-mensajes-list';

export default function MensajesPage() {
  const query = useMensajesList();

  return (
    <div className="h-[calc(100vh-4rem)]">
      <Suspense fallback={<MensajesListSkeleton />}>
        <MensajesListContent result={query} />
      </Suspense>
    </div>
  );
}
