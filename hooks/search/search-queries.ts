'use client';

import { useQuery } from '@tanstack/react-query';
import { eventosApi, type EventosListParams } from '@/lib/eventos-api';
import { profileApi, type ProfilesListParams } from '@/lib/profile-api';
import { serviciosApi, type ServiciosListParams } from '@/lib/servicios-api';
import type { SearchScope } from '@/types/search';

type Identifiable = { id?: string };

function uniqueById<T extends Identifiable>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (!item.id) return true;
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

async function fetchProfiles(params: ProfilesListParams[]) {
  const responses = await Promise.all(params.map((query) => profileApi.list(query)));
  return { success: true, data: uniqueById(responses.flatMap((response) => response.data ?? [])) };
}

async function fetchServices(params: ServiciosListParams[]) {
  const responses = await Promise.all(params.map((query) => serviciosApi.list(query)));
  return { success: true, data: uniqueById(responses.flatMap((response) => response.data ?? [])) };
}

async function fetchEvents(params: EventosListParams[]) {
  const responses = await Promise.all(params.map((query) => eventosApi.list(query)));
  return { success: true, data: uniqueById(responses.flatMap((response) => response.data ?? [])) };
}

export function useSearchProfiles(scope: SearchScope, params: ProfilesListParams[]) {
  return useQuery({
    queryKey: ['profiles-search', params],
    queryFn: () => fetchProfiles(params),
    select: (res) => res?.data,
    enabled: scope === 'all' || scope === 'organizations',
  });
}

export function useSearchServices(scope: SearchScope, params: ServiciosListParams[]) {
  return useQuery({
    queryKey: ['services-search', params],
    queryFn: () => fetchServices(params),
    select: (res) => res?.data,
    enabled: scope === 'all' || scope === 'services',
  });
}

export function useSearchEvents(scope: SearchScope, params: EventosListParams[]) {
  return useQuery({
    queryKey: ['events-search', params],
    queryFn: () => fetchEvents(params),
    select: (res) => res?.data,
    enabled: scope === 'all' || scope === 'events',
  });
}
