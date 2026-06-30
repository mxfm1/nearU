import { AlertTriangle } from 'lucide-react'

export function SearchErrorState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
      <h2 className="text-2xl font-semibold text-foreground mb-2">
        Algo salió mal
      </h2>
      <p className="text-muted-foreground max-w-md">
        No pudimos cargar los resultados. Por favor, intentá de nuevo más tarde.
      </p>
    </div>
  )
}
