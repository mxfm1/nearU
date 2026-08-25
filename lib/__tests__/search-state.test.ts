import type { EventoListItem } from '@/types/contracts/event';
import type { ServicioListItem } from '@/types/contracts/services';
import {
  changeSearchScope,
  filterEvents,
  filterServices,
  pageItems,
  parseSearchState,
  serializeSearchState,
} from '@/lib/search-state';

describe('search state URL contract', () => {
  it('parses only filters compatible with the active scope', () => {
    const state = parseSearchState(
      new URLSearchParams(
        'scope=events&q=catering&category=gastronomia&priceMin=200&eventDateFrom=2026-09-01&page=2'
      )
    );

    expect(state).toEqual({
      scope: 'events',
      query: 'catering',
      commonFilters: { categorySlugs: ['gastronomia'], locationSlug: undefined },
      filters: {
        eventDateFrom: '2026-09-01',
        eventDateTo: undefined,
        applicationDeadline: undefined,
      },
      page: 2,
    });
  });

  it('serializes a canonical URL without empty or incompatible values', () => {
    const params = serializeSearchState({
      scope: 'services',
      query: 'sonido',
      commonFilters: { categorySlugs: ['audio', 'luces'], locationSlug: 'santiago' },
      filters: {
        priceMin: 100,
        priceMax: 500,
        modality: ['presencial', 'online'],
        availability: true,
      },
    });

    expect(params.toString()).toBe(
      'scope=services&q=sonido&category=audio&category=luces&location=santiago&priceMin=100&priceMax=500&modality=presencial&modality=online&availability=true'
    );
  });

  it('preserves query and common filters when changing scope', () => {
    const state = changeSearchScope(
      {
        scope: 'events',
        query: 'festival',
        commonFilters: { categorySlugs: ['musica'] },
        filters: { eventDateFrom: '2026-09-01' },
      },
      'services'
    );

    expect(state).toEqual({
      scope: 'services',
      query: 'festival',
      commonFilters: { categorySlugs: ['musica'] },
      filters: {},
    });
  });
});

describe('temporary local search filtering', () => {
  it('matches event categories using their public slug', () => {
    const events: EventoListItem[] = [
      {
        id: 'event-1',
        title: 'Encuentro anual',
        category: { id: 'cat-1', name: 'Música en vivo' },
      },
      { id: 'event-2', title: 'Cena anual', category: { id: 'cat-2', name: 'Catering' } },
    ];

    expect(
      filterEvents(events, {
        scope: 'all',
        query: '',
        commonFilters: { categorySlugs: ['musica-en-vivo'] },
      })
    ).toEqual([events[0]]);
  });

  it('uses overlapping price ranges for services', () => {
    const services: ServicioListItem[] = [
      { id: 'service-1', title: 'Básico', priceMin: 50, priceMax: 150 },
      { id: 'service-2', title: 'Premium', priceMin: 500, priceMax: 800 },
    ];

    expect(
      filterServices(services, {
        scope: 'services',
        query: '',
        commonFilters: {},
        filters: { priceMin: 100, priceMax: 300 },
      })
    ).toEqual([services[0]]);
  });

  it('interprets application deadline as an inclusive upper bound', () => {
    const events: EventoListItem[] = [
      { id: 'event-1', applicationDeadline: '2026-09-10T10:00:00.000Z' },
      { id: 'event-2', applicationDeadline: '2026-09-12T10:00:00.000Z' },
    ];

    expect(
      filterEvents(events, {
        scope: 'events',
        query: '',
        commonFilters: {},
        filters: { applicationDeadline: '2026-09-10' },
      })
    ).toEqual([events[0]]);
  });

  it('paginates from a one-based page number', () => {
    expect(pageItems(['a', 'b', 'c', 'd'], 2, 2)).toEqual(['c', 'd']);
  });
});
