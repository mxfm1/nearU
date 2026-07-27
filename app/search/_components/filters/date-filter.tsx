'use client';

import { cn } from '@/lib/utils';

interface DateFilterProps {
  dateFrom: string;
  dateTo: string;
  onChange: (updates: { dateFrom?: string; dateTo?: string }) => void;
}

export function DateFilter({ dateFrom, dateTo, onChange }: DateFilterProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">Fecha del evento</label>
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => onChange({ dateFrom: e.target.value })}
          className={cn(
            'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm',
            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
            'text-foreground [color-scheme:light] dark:[color-scheme:dark]'
          )}
          placeholder="Desde"
        />
        <span className="text-muted-foreground text-sm shrink-0">a</span>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => onChange({ dateTo: e.target.value })}
          className={cn(
            'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm',
            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
            'text-foreground [color-scheme:light] dark:[color-scheme:dark]'
          )}
          placeholder="Hasta"
        />
      </div>
    </div>
  );
}
