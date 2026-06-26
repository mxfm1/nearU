'use client'

import { CategoryFilter } from './category-filter'
import { RegionFilter } from './region-filter'
import { DateFilter } from './date-filter'
import { cn } from '@/lib/utils'

interface SearchFiltersProps {
  type: string
  category: string
  region: string
  dateFrom: string
  dateTo: string
  onFilterChange: (updates: Record<string, string>) => void
}

const typeOptions = [
  { value: '', label: 'Todos' },
  { value: 'proveedores', label: 'Proveedores' },
  { value: 'eventos', label: 'Eventos' },
]

export function SearchFilters({
  type,
  category,
  region,
  dateFrom,
  dateTo,
  onFilterChange,
}: SearchFiltersProps) {
  const categoryType = type === 'eventos' ? 'event' : 'service'
  const showDateFilter = type === 'eventos'
  const hasActiveFilters = category || region || dateFrom || dateTo

  return (
    <div className="mt-8 space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-foreground mr-1">
          Tipo:
        </span>
        {typeOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => {
              const updates: Record<string, string> = {
                type: opt.value,
                page: '1',
              }
              if (opt.value !== type) {
                updates.category = ''
              }
              if (opt.value !== 'eventos') {
                updates.dateFrom = ''
                updates.dateTo = ''
              }
              onFilterChange(updates)
            }}
            className={cn(
              'px-3 py-1.5 text-sm rounded-full border transition-colors',
              type === opt.value
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border bg-card text-foreground hover:bg-muted',
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <CategoryFilter
          value={category}
          onChange={(value) => onFilterChange({ category: value, page: '1' })}
          type={categoryType}
        />
        <RegionFilter
          value={region}
          onChange={(value) => onFilterChange({ region: value, page: '1' })}
        />
        {showDateFilter && (
          <DateFilter
            dateFrom={dateFrom}
            dateTo={dateTo}
            onChange={(updates) =>
              onFilterChange({ ...updates, page: '1' })
            }
          />
        )}
      </div>

      {hasActiveFilters && (
        <button
          onClick={() =>
            onFilterChange({
              category: '',
              region: '',
              dateFrom: '',
              dateTo: '',
              page: '1',
            })
          }
          className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  )
}
