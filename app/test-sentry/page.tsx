'use client';

import { Button } from '@/components/ui/button';

export default function TestSentry() {
  const handleThrowError = () => {
    throw new Error('Test Sentry - Error forzado');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Test Sentry</h1>
      <p className="text-muted-foreground">
        Hacé click en el botón de abajo para lanzar un error y verificar que Sentry lo captura.
      </p>
      <Button onClick={handleThrowError} variant="destructive">
        Lanzar error
      </Button>
    </div>
  );
}
