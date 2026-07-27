'use client';

import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfileErrorProps {
  error: Error;
  onRetry?: () => void;
}

export function ProfileError({ error, onRetry }: ProfileErrorProps) {
  console.error('[ProfileError]', error);

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="flex items-center gap-2 text-amber-600 mb-4">
        <AlertTriangle className="h-5 w-5" />
        <span className="text-sm font-medium">Error al cargar el perfil</span>
      </div>
      <p className="text-xs text-muted-foreground mb-4">Algo salió mal. Podés intentar de nuevo.</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  );
}
