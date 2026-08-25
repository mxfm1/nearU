export type SearchScope = 'all' | 'services' | 'events' | 'organizations';

export type Modality = 'presencial' | 'online' | 'hybrid';

export type Availability = 'available' | 'limited';

export type CommonFilters = {
  categorySlugs?: string[];
  locationSlug?: string;
};

export type EventFilters = {
  eventDateFrom?: string;
  eventDateTo?: string;
  applicationDeadline?: string;
};

export type ServiceFilters = {
  priceMin?: number;
  priceMax?: number;
  modality?: Modality[];
  availability?: boolean;
};

export type OrganizationFilters = {
  verified?: boolean;
  employeesMin?: number;
  employeesMax?: number;
};

type SearchBase = {
  query: string;
  commonFilters: CommonFilters;
};

export type SearchState = SearchBase &
  (
    | { scope: 'all' }
    | { scope: 'services'; filters: ServiceFilters }
    | { scope: 'events'; filters: EventFilters }
    | { scope: 'organizations'; filters: OrganizationFilters }
  );

export type SearchListingState = {
  page: number;
};

export type SearchUrlState = SearchState & SearchListingState;
