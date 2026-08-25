import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ExploreSectionError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex min-h-44 flex-col items-center justify-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center">
      <AlertTriangle className="h-6 w-6 text-destructive" />
      <p className="text-sm text-muted-foreground">No pudimos cargar esta sección.</p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Reintentar
      </Button>
    </div>
  );
}
