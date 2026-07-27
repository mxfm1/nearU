'use client';

import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  value: string;
  onChange: (value: string) => void;
  type: 'service' | 'event';
}

const serviceCategories = [
  { value: '', label: 'Todas las categorías' },
  { value: 'produccion', label: 'Producción' },
  { value: 'audiovisual', label: 'Audiovisual' },
  { value: 'catering', label: 'Catering' },
  { value: 'seguridad', label: 'Seguridad' },
  { value: 'decoracion', label: 'Decoración' },
  { value: 'tecnologia', label: 'Tecnología' },
  { value: 'espacios', label: 'Espacios' },
];

const eventCategories = [
  { value: '', label: 'Todas las categorías' },
  { value: 'congreso', label: 'Congreso' },
  { value: 'seminario', label: 'Seminario' },
  { value: 'feria', label: 'Feria' },
  { value: 'activacion', label: 'Activación' },
  { value: 'lanzamiento', label: 'Lanzamiento' },
  { value: 'networking', label: 'Networking' },
];

export function CategoryFilter({ value, onChange, type }: CategoryFilterProps) {
  const categories = type === 'service' ? serviceCategories : eventCategories;

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">Categoría</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
          'text-foreground'
        )}
      >
        {categories.map((cat) => (
          <option key={cat.value} value={cat.value}>
            {cat.label}
          </option>
        ))}
      </select>
    </div>
  );
}
