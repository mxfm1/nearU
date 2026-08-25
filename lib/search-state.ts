import type { ReadonlyURLSearchParams } from 'next/navigation';
import type { EventoListItem } from '@/types/contracts/event';
import type { ServicioListItem } from '@/types/contracts/services';
import type { Modality, SearchScope, SearchState, SearchUrlState } from '@/types/search';
import { normalize } from '@/lib/normalize';

type SearchParams =
  Pick<URLSearchParams, 'get' | 'getAll'> | Pick<ReadonlyURLSearchParams, 'get' | 'getAll'>;

const SEARCH_SCOPES: SearchScope[] = ['all', 'services', 'events', 'organizations'];
const MODALITIES: Modality[] = ['presencial', 'online', 'hybrid'];

function optional(params: SearchParams, key: string): string | undefined {
  return params.get(key)?.trim() || undefined;
}

function optionalAll(params: SearchParams, key: string): string[] {
  return params
    .getAll(key)
    .map((value) => value.trim())
    .filter(Boolean);
}

function optionalNumber(params: SearchParams, key: string): number | undefined {
  const value = optional(params, key);
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

function oneOf<T extends string>(value: string | undefined, values: T[]): T | undefined {
  return value && values.includes(value as T) ? (value as T) : undefined;
}

export function toPublicSlug(value: string): string {
  return normalize(value)
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function parseSearchState(params: SearchParams): SearchUrlState {
  const scope = oneOf(optional(params, 'scope'), SEARCH_SCOPES) ?? 'all';
  const pageValue = Number.parseInt(optional(params, 'page') ?? '1', 10);
  const categorySlugs = optionalAll(params, 'category');
  const base = {
    query: optional(params, 'q') ?? '',
    commonFilters: {
      categorySlugs: categorySlugs.length ? categorySlugs : undefined,
      locationSlug: optional(params, 'location'),
    },
    page: Number.isFinite(pageValue) && pageValue > 0 ? pageValue : 1,
  };

  if (scope === 'services') {
    return {
      ...base,
      scope,
      filters: {
        priceMin: optionalNumber(params, 'priceMin'),
        priceMax: optionalNumber(params, 'priceMax'),
        modality: optionalAll(params, 'modality').filter((value): value is Modality =>
          MODALITIES.includes(value as Modality)
        ),
        availability: params.get('availability') === 'true' ? true : undefined,
      },
    };
  }

  if (scope === 'events') {
    return {
      ...base,
      scope,
      filters: {
        eventDateFrom: optional(params, 'eventDateFrom'),
        eventDateTo: optional(params, 'eventDateTo'),
        applicationDeadline: optional(params, 'applicationDeadline'),
      },
    };
  }

  if (scope === 'organizations') {
    return {
      ...base,
      scope,
      filters: {
        verified: params.get('verified') === 'true' || undefined,
        employeesMin: optionalNumber(params, 'employeesMin'),
        employeesMax: optionalNumber(params, 'employeesMax'),
      },
    };
  }

  return { ...base, scope };
}

export function serializeSearchState(state: SearchState, page = 1): URLSearchParams {
  const params = new URLSearchParams();
  if (state.scope !== 'all') params.set('scope', state.scope);
  if (state.query) params.set('q', state.query);
  state.commonFilters.categorySlugs?.forEach((slug) => params.append('category', slug));
  if (state.commonFilters.locationSlug) params.set('location', state.commonFilters.locationSlug);

  if (state.scope === 'services') {
    if (state.filters.priceMin !== undefined)
      params.set('priceMin', String(state.filters.priceMin));
    if (state.filters.priceMax !== undefined)
      params.set('priceMax', String(state.filters.priceMax));
    state.filters.modality?.forEach((modality) => params.append('modality', modality));
    if (state.filters.availability) params.set('availability', 'true');
  }

  if (state.scope === 'events') {
    if (state.filters.eventDateFrom) params.set('eventDateFrom', state.filters.eventDateFrom);
    if (state.filters.eventDateTo) params.set('eventDateTo', state.filters.eventDateTo);
    if (state.filters.applicationDeadline) {
      params.set('applicationDeadline', state.filters.applicationDeadline);
    }
  }

  if (state.scope === 'organizations' && state.filters.verified) {
    params.set('verified', 'true');
  }

  if (state.scope === 'organizations') {
    if (state.filters.employeesMin !== undefined) {
      params.set('employeesMin', String(state.filters.employeesMin));
    }
    if (state.filters.employeesMax !== undefined) {
      params.set('employeesMax', String(state.filters.employeesMax));
    }
  }

  if (page > 1) params.set('page', String(page));
  return params;
}

export function changeSearchScope(state: SearchState, scope: SearchScope): SearchState {
  const base = { query: state.query, commonFilters: state.commonFilters };
  if (scope === 'services') return { ...base, scope, filters: {} };
  if (scope === 'events') return { ...base, scope, filters: {} };
  if (scope === 'organizations') return { ...base, scope, filters: {} };
  return { ...base, scope };
}

function contains(value: string | null | undefined, query: string): boolean {
  return normalize(value ?? '').includes(normalize(query));
}

function matchesCommon(
  item: { category?: { name?: string | null } | null; location?: { name?: string | null } | null },
  state: SearchState
): boolean {
  const { categorySlugs, locationSlug } = state.commonFilters;
  if (categorySlugs?.length && !categorySlugs.includes(toPublicSlug(item.category?.name ?? ''))) {
    return false;
  }
  if (locationSlug && toPublicSlug(item.location?.name ?? '') !== locationSlug) return false;
  return true;
}

export function filterServices(items: ServicioListItem[], state: SearchState): ServicioListItem[] {
  if (state.scope === 'events' || state.scope === 'organizations') return [];

  return items.filter((item) => {
    if (!matchesCommon(item, state)) return false;
    if (
      state.query &&
      ![item.title, item.marca, item.description, item.category?.name, item.profile?.name].some(
        (value) => contains(value, state.query)
      )
    ) {
      return false;
    }

    if (state.scope !== 'services') return true;
    const { priceMin, priceMax } = state.filters;
    const itemMin = item.priceMin ?? item.priceMax;
    const itemMax = item.priceMax ?? item.priceMin;
    if (
      priceMin !== undefined &&
      (itemMax === null || itemMax === undefined || itemMax < priceMin)
    ) {
      return false;
    }
    if (
      priceMax !== undefined &&
      (itemMin === null || itemMin === undefined || itemMin > priceMax)
    ) {
      return false;
    }
    return true;
  });
}

function dateValue(value: string | null | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? undefined : parsed;
}

export function filterEvents(items: EventoListItem[], state: SearchState): EventoListItem[] {
  if (state.scope === 'services' || state.scope === 'organizations') return [];

  return items.filter((item) => {
    if (!matchesCommon(item, state)) return false;
    if (
      state.query &&
      ![
        item.title,
        item.description,
        item.requirements,
        item.category?.name,
        item.profile?.name,
      ].some((value) => contains(value, state.query))
    ) {
      return false;
    }

    if (state.scope !== 'events') return true;
    const eventDate = dateValue(item.startAt);
    const from = dateValue(state.filters.eventDateFrom);
    const to = dateValue(
      state.filters.eventDateTo ? `${state.filters.eventDateTo}T23:59:59.999` : undefined
    );
    const deadline = dateValue(item.applicationDeadline);
    const deadlineLimit = dateValue(
      state.filters.applicationDeadline
        ? `${state.filters.applicationDeadline}T23:59:59.999`
        : undefined
    );

    if (from !== undefined && (eventDate === undefined || eventDate < from)) return false;
    if (to !== undefined && (eventDate === undefined || eventDate > to)) return false;
    if (deadlineLimit !== undefined && (deadline === undefined || deadline > deadlineLimit))
      return false;
    return true;
  });
}

export function pageItems<T>(items: T[], page: number, pageSize: number): T[] {
  return items.slice((page - 1) * pageSize, page * pageSize);
}
