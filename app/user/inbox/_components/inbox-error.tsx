import { AlertTriangle } from 'lucide-react';

interface InboxErrorProps {
  error: Error | null;
}

export function InboxError({ error }: InboxErrorProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="mb-4 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-7 w-7 text-destructive" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Error al cargar mensajes</h2>
        <p className="text-sm text-muted-foreground">
          {error instanceof Error ? error.message : 'No se pudieron cargar los mensajes.'}
        </p>
      </div>
    </div>
  );
}
