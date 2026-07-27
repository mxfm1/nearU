'use client';

import { X } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { CategoryFilter } from './category-filter';
import { RegionFilter } from './region-filter';
import { DateFilter } from './date-filter';

interface FilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: string;
  category: string;
  region: string;
  dateFrom: string;
  dateTo: string;
  onTypeChange: (type: string) => void;
  onFilterChange: (updates: Record<string, string>) => void;
  onClear: () => void;
  onApply: () => void;
}

const typeOptions = [
  { value: '', label: 'Todos' },
  { value: 'proveedores', label: 'Proveedores' },
  { value: 'eventos', label: 'Eventos' },
];

export function FilterModal({
  open,
  onOpenChange,
  type,
  category,
  region,
  dateFrom,
  dateTo,
  onTypeChange,
  onFilterChange,
  onClear,
  onApply,
}: FilterModalProps) {
  const categoryType = type === 'eventos' ? 'event' : 'service';
  const showDateFilter = type === 'eventos';

  function handleTypeClick(value: string) {
    onTypeChange(value);
  }

  function handleApply() {
    onApply();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-[90vw] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Filtros</DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <X className="h-4 w-4" />
            <span className="sr-only">Cerrar</span>
          </DialogClose>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-foreground mr-1">Tipo:</span>
            {typeOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleTypeClick(opt.value)}
                className={cn(
                  'px-3 py-1.5 text-sm rounded-full border transition-colors',
                  type === opt.value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border bg-card text-foreground hover:bg-muted'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <CategoryFilter
            value={category}
            onChange={(value) => onFilterChange({ category: value })}
            type={categoryType}
          />

          <RegionFilter value={region} onChange={(value) => onFilterChange({ region: value })} />

          {showDateFilter && (
            <DateFilter
              dateFrom={dateFrom}
              dateTo={dateTo}
              onChange={(updates) => onFilterChange(updates)}
            />
          )}

          {(category || region || dateFrom || dateTo) && (
            <button
              onClick={onClear}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        <div className="mt-6">
          <button
            onClick={handleApply}
            className="w-full bg-primary text-primary-foreground rounded-md px-4 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
