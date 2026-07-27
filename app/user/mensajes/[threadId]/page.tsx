import { Suspense } from 'react';
import { MensajesContent } from './_components/mensajes-content';
import { MensajesSkeleton } from './_components/mensajes-skeleton';

export default async function MensajesDetallePage({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = await params;

  return (
    <Suspense fallback={<MensajesSkeleton />}>
      <MensajesContent threadId={threadId} />
    </Suspense>
  );
}
