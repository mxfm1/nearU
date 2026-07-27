'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[user/perfil] Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Error al cargar</h2>
        <p className="text-muted-foreground mb-6">
          Algo salió mal al cargar el perfil. Podés intentar de nuevo.
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}
