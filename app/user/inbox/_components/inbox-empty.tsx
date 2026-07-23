import { Inbox } from 'lucide-react'

interface InboxEmptyProps {
  searchQuery?: string
}

export function InboxEmpty({ searchQuery }: InboxEmptyProps) {
  return (
    <div className="text-center py-20">
      <Inbox className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
      <p className="text-muted-foreground">
        {searchQuery
          ? 'No se encontraron mensajes con ese criterio.'
          : 'No tienes solicitudes de contacto aún.'}
      </p>
    </div>
  )
}
