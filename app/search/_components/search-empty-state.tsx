import { SearchX } from 'lucide-react'

interface SearchEmptyStateProps {
  hasFilters: boolean
}

export function SearchEmptyState({ hasFilters }: SearchEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <SearchX className="h-16 w-16 text-muted-foreground mb-4" />
      <h2 className="text-2xl font-semibold text-foreground mb-2">
        Sin resultados
      </h2>
      <p className="text-muted-foreground max-w-md">
        No encontramos resultados para tu búsqueda.
        {hasFilters
          ? ' Intenta con otros filtros o términos diferentes.'
          : ' Prueba buscando un servicio, evento o proveedor.'}
      </p>
    </div>
  )
}
