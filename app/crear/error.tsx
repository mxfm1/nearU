'use client';

import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CrearErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function CrearError({ reset }: CrearErrorProps) {
  return (
    <section className="px-4 pt-24 pb-20 md:pt-32 md:pb-28">
      <div className="max-w-xl mx-auto text-center">
        <AlertTriangle className="h-16 w-16 text-muted-foreground/40 mx-auto mb-6" />
        <h1 className="text-[32px] font-semibold text-foreground mb-3">Algo salió mal</h1>
        <p className="text-[18px] text-muted-foreground max-w-md mx-auto mb-8">
          Ocurrió un error inesperado al cargar esta página. Por favor, intenta de nuevo.
        </p>
        <Button variant="default" size="lg" onClick={reset}>
          Intentar de nuevo
        </Button>
      </div>
    </section>
  );
}
