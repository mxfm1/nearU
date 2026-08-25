import { Suspense } from 'react';
import { EditarServicioContent } from './_components/editar-servicio-content';
import { EditarServicioSkeleton } from './_components/editar-servicio-skeleton';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarServicioPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<EditarServicioSkeleton />}>
      <EditarServicioContent id={id} />
    </Suspense>
  );
}
