'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Check, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { Modality, SearchScope, SearchState } from '@/types/search';

type FilterOption = { name: string; slug: string };
type ExploreFiltersPlacement = 'sidebar' | 'top';

type FilterForm = {
  scope: SearchScope;
  locationSlug: string;
  priceMin: string;
  priceMax: string;
  eventDateFrom: string;
  eventDateTo: string;
  applicationDeadline: string;
  verified: boolean;
  employeesMin: string;
  employeesMax: string;
};

const scopeTabs: Array<{ value: SearchScope; label: string }> = [
  { value: 'all', label: 'Todo' },
  { value: 'organizations', label: 'Empresas' },
  { value: 'services', label: 'Servicios' },
  { value: 'events', label: 'Eventos' },
];

const modalityOptions: Array<{ value: Modality; label: string }> = [
  { value: 'presencial', label: 'Presencial' },
  { value: 'online', label: 'Online' },
];

function formValues(state: SearchState): FilterForm {
  return {
    scope: state.scope,
    locationSlug: state.commonFilters.locationSlug ?? '',
    priceMin: state.scope === 'services' ? String(state.filters.priceMin ?? '') : '',
    priceMax: state.scope === 'services' ? String(state.filters.priceMax ?? '') : '',
    eventDateFrom: state.scope === 'events' ? (state.filters.eventDateFrom ?? '') : '',
    eventDateTo: state.scope === 'events' ? (state.filters.eventDateTo ?? '') : '',
    applicationDeadline: state.scope === 'events' ? (state.filters.applicationDeadline ?? '') : '',
    verified: state.scope === 'organizations' ? (state.filters.verified ?? false) : false,
    employeesMin: state.scope === 'organizations' ? String(state.filters.employeesMin ?? '') : '',
    employeesMax: state.scope === 'organizations' ? String(state.filters.employeesMax ?? '') : '',
  };
}

function numberOrUndefined(value: string): number | undefined {
  const parsed = Number(value);
  return value !== '' && Number.isFinite(parsed) ? parsed : undefined;
}

function selectedCategoryLabel(options: FilterOption[], slug: string): string {
  return options.find((option) => option.slug === slug)?.name ?? slug;
}

export function ExploreFilters({
  state,
  categories,
  locations,
  onApply,
  onClear,
  placement = 'sidebar',
}: {
  state: SearchState;
  categories: FilterOption[];
  locations: FilterOption[];
  onApply: (state: SearchState) => void;
  onClear: () => void;
  placement?: ExploreFiltersPlacement;
}) {
  const { register, handleSubmit, watch, setValue } = useForm<FilterForm>({
    defaultValues: formValues(state),
  });
  const scope = watch('scope');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    state.commonFilters.categorySlugs ?? []
  );
  const [selectedModalities, setSelectedModalities] = useState<Modality[]>(
    state.scope === 'services' ? (state.filters.modality ?? []) : []
  );
  const [serviceAvailability, setServiceAvailability] = useState(
    state.scope === 'services' ? (state.filters.availability ?? false) : false
  );

  const selectedCategorySet = useMemo(() => new Set(selectedCategories), [selectedCategories]);
  const isTopPlacement = placement === 'top';

  function toggleCategory(slug: string) {
    setSelectedCategories((current) =>
      current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug]
    );
  }

  function toggleModality(modality: Modality) {
    setSelectedModalities((current) =>
      current.includes(modality)
        ? current.filter((item) => item !== modality)
        : [...current, modality]
    );
  }

  function clearAll() {
    setSelectedCategories([]);
    setSelectedModalities([]);
    setServiceAvailability(false);
    onClear();
  }

  function apply(values: FilterForm) {
    const base = {
      query: state.query,
      commonFilters: {
        categorySlugs: selectedCategories.length ? selectedCategories : undefined,
        locationSlug: values.locationSlug || undefined,
      },
    };

    if (values.scope === 'services') {
      onApply({
        ...base,
        scope: values.scope,
        filters: {
          priceMin: numberOrUndefined(values.priceMin),
          priceMax: numberOrUndefined(values.priceMax),
          modality: selectedModalities.length ? selectedModalities : undefined,
          availability: serviceAvailability || undefined,
        },
      });
      return;
    }

    if (values.scope === 'events') {
      onApply({
        ...base,
        scope: values.scope,
        filters: {
          eventDateFrom: values.eventDateFrom || undefined,
          eventDateTo: values.eventDateTo || undefined,
          applicationDeadline: values.applicationDeadline || undefined,
        },
      });
      return;
    }

    if (values.scope === 'organizations') {
      onApply({
        ...base,
        scope: values.scope,
        filters: {
          verified: values.verified || undefined,
          employeesMin: numberOrUndefined(values.employeesMin),
          employeesMax: numberOrUndefined(values.employeesMax),
        },
      });
      return;
    }

    onApply({ ...base, scope: 'all' });
  }

  return (
    <motion.aside
      initial={{ opacity: 0, x: isTopPlacement ? 0 : -16, y: isTopPlacement ? 12 : 0 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={cn(
        'h-fit rounded-xl border border-border bg-card p-4 shadow-sm',
        isTopPlacement
          ? 'w-full'
          : 'lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto'
      )}
    >
      <form onSubmit={handleSubmit(apply)} className="space-y-6">
        <input type="hidden" {...register('scope')} />
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3 border-b border-border pb-2">
            <h2 className="text-base font-bold">Filtros generales</h2>
            <button
              type="button"
              onClick={clearAll}
              className="text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Limpiar
            </button>
          </div>

          <div
            className={cn(
              'space-y-4',
              isTopPlacement && 'lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0'
            )}
          >
            <div className="space-y-2 text-sm font-semibold">
              <div className="flex items-center justify-between gap-3">
                <span>Categorías</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button type="button" variant="outline" size="sm" className="gap-2">
                      Agregar
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-80">
                    <div className="space-y-3">
                      <p className="text-sm font-semibold">Selecciona categorías</p>
                      <div className="max-h-72 space-y-1 overflow-auto pr-1">
                        {categories.map((category) => {
                          const selected = selectedCategorySet.has(category.slug);
                          return (
                            <button
                              key={category.slug}
                              type="button"
                              onClick={() => toggleCategory(category.slug)}
                              className={cn(
                                'flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm transition-colors',
                                selected
                                  ? 'border-primary bg-primary/10 text-primary'
                                  : 'border-border hover:border-primary/40 hover:bg-muted/50'
                              )}
                            >
                              <span>{category.name}</span>
                              {selected && <Check className="h-4 w-4" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedCategories.length === 0 ? (
                  <span className="text-xs font-normal text-muted-foreground">
                    Sin categorías seleccionadas
                  </span>
                ) : (
                  selectedCategories.map((slug) => (
                    <button
                      key={slug}
                      type="button"
                      onClick={() => toggleCategory(slug)}
                      className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-foreground"
                    >
                      <span>{selectedCategoryLabel(categories, slug)}</span>
                      <X className="h-3 w-3" />
                    </button>
                  ))
                )}
              </div>
            </div>

            <label className="block space-y-2 text-sm font-semibold">
              Ubicación
              <select
                {...register('locationSlug')}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm font-normal"
              >
                <option value="">Cualquier ubicación</option>
                {locations.map((location) => (
                  <option key={location.slug} value={location.slug}>
                    {location.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="border-b border-border pb-2 text-base font-bold">Filtros avanzados</h2>
          <div
            className={cn(
              'grid grid-cols-2 gap-2 sm:grid-cols-4',
              !isTopPlacement && 'lg:grid-cols-2'
            )}
          >
            {scopeTabs.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setValue('scope', item.value, { shouldDirty: true })}
                className={cn(
                  'rounded-lg border px-3 py-2 text-sm font-semibold transition-colors',
                  scope === item.value
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border text-muted-foreground hover:border-primary/40'
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="space-y-4 rounded-xl border border-border bg-muted/20 p-4">
            {scope === 'services' && (
              <>
                <div className="space-y-3">
                  <h3 className="text-sm font-bold">Precio</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Input type="number" min="0" placeholder="Mínimo" {...register('priceMin')} />
                    <Input type="number" min="0" placeholder="Máximo" {...register('priceMax')} />
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-bold">Modalidad</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {modalityOptions.map((option) => {
                      const checked = selectedModalities.includes(option.value);
                      return (
                        <label
                          key={option.value}
                          className={cn(
                            'flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors',
                            checked
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border hover:border-primary/40'
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleModality(option.value)}
                            className="h-4 w-4 rounded border-border text-primary"
                          />
                          <span>{option.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={serviceAvailability}
                    onChange={(event) => setServiceAvailability(event.target.checked)}
                    className="h-4 w-4 rounded border-border text-primary"
                  />
                  Disponibilidad
                </label>
              </>
            )}

            {scope === 'events' && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold">Fechas del evento</h3>
                <label className="block space-y-1 text-xs text-muted-foreground">
                  Desde
                  <Input type="date" {...register('eventDateFrom')} />
                </label>
                <label className="block space-y-1 text-xs text-muted-foreground">
                  Hasta
                  <Input type="date" {...register('eventDateTo')} />
                </label>
                <label className="block space-y-1 text-xs text-muted-foreground">
                  Postulación cierra hasta
                  <Input type="date" {...register('applicationDeadline')} />
                </label>
              </div>
            )}

            {scope === 'organizations' && (
              <>
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    {...register('verified')}
                    className="h-4 w-4 rounded border-border text-primary"
                  />
                  Sólo empresas verificadas
                </label>

                <div className="space-y-3">
                  <h3 className="text-sm font-bold">Rango de empleados</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      min="0"
                      placeholder="Mínimo"
                      {...register('employeesMin')}
                    />
                    <Input
                      type="number"
                      min="0"
                      placeholder="Máximo"
                      {...register('employeesMax')}
                    />
                  </div>
                </div>
              </>
            )}

            {scope === 'all' && (
              <p className="text-sm text-muted-foreground">
                Elegí una pestaña para ver filtros avanzados de empresas, servicios o eventos.
              </p>
            )}
          </div>
        </div>

        <div className={cn('grid grid-cols-2 gap-2', isTopPlacement && 'sm:flex sm:justify-end')}>
          <Button type="button" variant="outline" onClick={clearAll}>
            Limpiar
          </Button>
          <Button type="submit">Aplicar</Button>
        </div>
      </form>
    </motion.aside>
  );
}
