import { contactosApi } from '@/lib/contactos-api';
import { AlertTriangle } from 'lucide-react';

export default async function InboxDetails({ params }: { params: { slug: string } }) {
  return (
    <div className="h-full flex-1 overflow-auto pt-8 px-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold text-2xl tracking-tight text-neutral-900">
            Buzón de entrada
          </h2>
          <p className="text-muted-foreground mt-1">Gestión de conversaciones</p>
        </div>
      </div>
    </div>
  );
}
