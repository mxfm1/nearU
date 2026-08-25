'use client';

import { startTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCategorias } from '@/hooks/catalogo/catalogo-queries';
import { useCategoriasEvento } from '@/hooks/evento/evento-queries';
import { useCategoriasServicio, useUbicaciones } from '@/hooks/services/service-queries';
import {
  useSearchEvents,
  useSearchProfiles,
  useSearchServices,
} from '@/hooks/search/search-queries';
import { parseSearchState, serializeSearchState, toPublicSlug } from '@/lib/search-state';
import type { EventosListParams } from '@/lib/eventos-api';
import type { ProfilesListParams } from '@/lib/profile-api';
import type { ServiciosListParams } from '@/lib/servicios-api';
import type { Modality, SearchState } from '@/types/search';
import { ExploreFilters } from './explore-filters';
import { ExploreResults } from './explore-results';
import { ExploreSearchBar } from './explore-search-bar';

type CategoryOption = { id?: string; name: string; slug: string };
type LocationOption = { id?: string; name: string; slug: string; regionId?: string };

const CATEGORY_ALIASES: Record<string, string[]> = {
  produccion: ['produccion-audiovisual', 'produccion-de-eventos'],
  fotografia: ['produccion-audiovisual'],
  sonido: ['produccion-audiovisual', 'alquiler-de-equipos'],
  iluminacion: ['alquiler-de-equipos', 'produccion-de-eventos'],
  decoracion: ['produccion-de-eventos'],
  animacion: ['produccion-de-eventos'],
};

function uniqueCategoryOptions(
  items: Array<{ id?: string; name?: string; slug?: string } | undefined>
) {
  const options = new Map<string, CategoryOption>();
  items.forEach((item) => {
    if (!item?.name) return;
    const slug = item.slug ?? toPublicSlug(item.name);
    if (slug) options.set(slug, { id: item.id, name: item.name, slug });
  });
  return Array.from(options.values()).sort((a, b) => a.name.localeCompare(b.name, 'es'));
}

function uniqueLocationOptions(
  items: Array<{ id?: string; name?: string; region?: { id?: string } } | undefined>
) {
  const options = new Map<string, LocationOption>();
  items.forEach((item) => {
    if (!item?.name) return;
    const slug = toPublicSlug(item.name);
    if (slug) options.set(slug, { id: item.id, name: item.name, slug, regionId: item.region?.id });
  });
  return Array.from(options.values()).sort((a, b) => a.name.localeCompare(b.name, 'es'));
}

function isoStartOfDay(value?: string): string | undefined {
  return value ? new Date(`${value}T00:00:00.000`).toISOString() : undefined;
}

function isoEndOfDay(value?: string): string | undefined {
  return value ? new Date(`${value}T23:59:59.999`).toISOString() : undefined;
}

function modalityParam(modalities?: Modality[]): ServiciosListParams['modality'] {
  if (!modalities?.length) return undefined;
  const hasPresencial = modalities.includes('presencial');
  const hasOnline = modalities.includes('online');
  if (hasPresencial && hasOnline) return 'hybrid';
  if (hasPresencial) return 'in_person';
  if (hasOnline) return 'online';
  return modalities.includes('hybrid') ? 'hybrid' : undefined;
}

function withCategoryRequests<T extends { categoryId?: string }>(
  baseParams: T,
  categoryIds: string[],
  hasCategoryFilter: boolean
): T[] {
  if (hasCategoryFilter && categoryIds.length === 0) return [];
  return categoryIds.length
    ? categoryIds.map((categoryId) => ({ ...baseParams, categoryId }))
    : [baseParams];
}

export function ExploreScreen({
  filtersPlacement = 'sidebar',
}: {
  filtersPlacement?: 'sidebar' | 'top';
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const state = parseSearchState(searchParams);
  const allCategories = useCategorias();
  const serviceCategories = useCategoriasServicio();
  const eventCategories = useCategoriasEvento();
  const locationsQuery = useUbicaciones();

  const categories = uniqueCategoryOptions([
    ...(allCategories.data ?? []),
    ...(serviceCategories.data ?? []),
    ...(eventCategories.data ?? []),
  ]);
  const locations = uniqueLocationOptions(locationsQuery.data ?? []);
  const selectedCategoryIds = (state.commonFilters.categorySlugs ?? [])
    .flatMap((slug) => CATEGORY_ALIASES[slug] ?? [slug])
    .map((slug) => categories.find((category) => category.slug === slug)?.id)
    .filter((id): id is string => !!id);
  const hasCategoryFilter = Boolean(state.commonFilters.categorySlugs?.length);
  const selectedLocation = locations.find(
    (location) => location.slug === state.commonFilters.locationSlug
  );

  const profileParams: ProfilesListParams = {
    search: state.query || undefined,
    regionId: selectedLocation?.regionId,
    verified: state.scope === 'organizations' ? state.filters.verified : undefined,
    employeesMin: state.scope === 'organizations' ? state.filters.employeesMin : undefined,
    employeesMax: state.scope === 'organizations' ? state.filters.employeesMax : undefined,
    sort: 'relevance',
  };

  const serviceParams: ServiciosListParams = {
    search: state.query || undefined,
    locationId: selectedLocation?.id,
    priceMin: state.scope === 'services' ? state.filters.priceMin : undefined,
    priceMax: state.scope === 'services' ? state.filters.priceMax : undefined,
    modality: state.scope === 'services' ? modalityParam(state.filters.modality) : undefined,
    availability:
      state.scope === 'services' && state.filters.availability ? 'immediate' : undefined,
    sort: 'relevance',
  };

  const eventParams: EventosListParams = {
    search: state.query || undefined,
    locationId: selectedLocation?.id,
    from: state.scope === 'events' ? isoStartOfDay(state.filters.eventDateFrom) : undefined,
    to: state.scope === 'events' ? isoEndOfDay(state.filters.eventDateTo) : undefined,
    sort: state.scope === 'events' ? 'start_date' : 'relevance',
  };

  const profilesQuery = useSearchProfiles(
    state.scope,
    withCategoryRequests(profileParams, selectedCategoryIds, hasCategoryFilter)
  );
  const servicesQuery = useSearchServices(
    state.scope,
    withCategoryRequests(serviceParams, selectedCategoryIds, hasCategoryFilter)
  );
  const eventsQuery = useSearchEvents(
    state.scope,
    withCategoryRequests(eventParams, selectedCategoryIds, hasCategoryFilter)
  );

  const profiles = profilesQuery.data ?? [];
  const services = servicesQuery.data ?? [];
  const events = eventsQuery.data ?? [];

  function navigate(nextState: SearchState, page = 1) {
    const params = serializeSearchState(nextState, page);
    const query = params.toString();
    startTransition(() => router.push(query ? `${pathname}?${query}` : pathname));
  }

  function updateQuery(query: string) {
    navigate({ ...state, query } as SearchState);
  }

  function clearFilters() {
    navigate({ scope: 'all', query: state.query, commonFilters: {} });
  }

  function goToPage(page: number) {
    navigate(state, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const knownTotal = profiles.length + services.length + events.length;
  const filters = (
    <ExploreFilters
      key={searchParams.toString()}
      state={state}
      categories={categories}
      locations={locations}
      onApply={navigate}
      onClear={clearFilters}
      placement={filtersPlacement}
    />
  );

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div
          className={
            filtersPlacement === 'top' ? 'space-y-8' : 'grid grid-cols-1 gap-6 lg:grid-cols-5'
          }
        >
          {filtersPlacement === 'sidebar' && <div className="lg:col-span-1">{filters}</div>}

          <div
            className={
              filtersPlacement === 'top' ? 'min-w-0 space-y-8' : 'min-w-0 space-y-8 lg:col-span-4'
            }
          >
            <motion.header
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="space-y-4"
            >
              <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                <ExploreSearchBar state={state} onSubmit={updateQuery} className="mx-auto" />
                <p className="text-right text-sm text-muted-foreground">
                  {state.scope === 'organizations'
                    ? 'Explorá empresas y perfiles relacionados.'
                    : `${knownTotal} resultados disponibles`}
                </p>
              </div>
              {filtersPlacement === 'top' && filters}
            </motion.header>

            <ExploreResults
              basePath={pathname}
              state={state}
              services={services}
              events={events}
              profiles={profiles}
              profilesPending={profilesQuery.isPending}
              servicesPending={servicesQuery.isPending}
              eventsPending={eventsQuery.isPending}
              profilesError={profilesQuery.isError}
              servicesError={servicesQuery.isError}
              eventsError={eventsQuery.isError}
              onRetryProfiles={() => void profilesQuery.refetch()}
              onRetryServices={() => void servicesQuery.refetch()}
              onRetryEvents={() => void eventsQuery.refetch()}
              onPageChange={goToPage}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
