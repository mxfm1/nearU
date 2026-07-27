import { ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { ContactoResumen } from '@/lib/contactos-api';
import { formatDate, getInitials, getAvatarColor, estadoBadge } from './inbox-utils';
import Link from 'next/link';

interface InboxCardProps {
  message: ContactoResumen;
}

export function InboxCard({ message }: InboxCardProps) {
  return (
    <Link
      href={`/user/inbox/${message.id}`}
      className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:shadow-md transition-shadow cursor-pointer group"
    >
      <div
        className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold ${getAvatarColor(message.remitente.nombre)}`}
      >
        {getInitials(message.remitente.nombre)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-foreground truncate">{message.remitente.nombre}</h3>
          {message.estado && (
            <Badge
              variant={estadoBadge[message.estado]?.variant ?? 'outline'}
              className="text-[10px] px-1.5 py-0 shrink-0"
            >
              {estadoBadge[message.estado]?.label ?? message.estado}
            </Badge>
          )}
          {message.estado === 'pendiente' && (
            <Badge className="bg-brand text-white text-[10px] px-1.5 py-0 shrink-0">NUEVO</Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{message.remitente.nombre}</p>
        {message.ultimoMensaje && (
          <p className="text-sm text-muted-foreground truncate mt-0.5">{message.ultimoMensaje}</p>
        )}
      </div>

      <div className="shrink-0 flex flex-col items-end gap-2">
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {formatDate(message.updatedAt)}
        </span>
        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-brand transition-colors" />
      </div>
    </Link>
  );
}
