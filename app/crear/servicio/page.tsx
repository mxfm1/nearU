import { Suspense } from 'react';
import { CrearServicioContent } from '../_components/crear-servicio-content';
import { ServicioSkeleton } from '../_components/servicio-skeleton';

export default function CrearServicioPage() {
  return (
    <Suspense fallback={<ServicioSkeleton />}>
      <CrearServicioContent />
    </Suspense>
  );
}
