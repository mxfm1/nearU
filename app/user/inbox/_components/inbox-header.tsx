'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface InboxHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function InboxHeader({ searchQuery, onSearchChange }: InboxHeaderProps) {
  return (
    <div className="mb-8">
      <p className="text-sm text-muted-foreground mb-1">Panel &gt; Mensajes</p>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inbox</h1>
          <p className="text-muted-foreground mt-1">
            Gestioná las solicitudes de contacto de servicios.
          </p>
        </div>
        <div className="relative w-64 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar mensajes..."
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value);
            }}
            className="pl-9"
          />
        </div>
      </div>
    </div>
  );
}
