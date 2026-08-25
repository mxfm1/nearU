import { Suspense } from 'react';
import { SolicitudesContent } from './_components/solicitudes-content';

export default function SolicitudesPage() {
  return (
    <Suspense fallback={null}>
      <SolicitudesContent />
    </Suspense>
  );
}
