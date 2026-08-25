'use client';

import { queryOptions, useQuery } from '@tanstack/react-query';
import { catalogoApi } from '@/lib/catalogo-api';
import { serviciosApi } from '@/lib/servicios-api';

export const ServiceDetailQueryOptions = (slugOrId: string) =>
  queryOptions({
    queryKey: ['services', 'detail', slugOrId],
    queryFn: () => serviciosApi.getById(slugOrId),
    enabled: !!slugOrId,
    select: (res) => res?.data,
  });

export function useServiceDetail(slugOrId: string) {
  return useQuery(ServiceDetailQueryOptions(slugOrId));
}

export function useCategoriasServicio() {
  return useQuery({
    queryKey: ['categorias', 'service'],
    queryFn: () => catalogoApi.categorias('service'),
    select: (res) => res?.data,
  });
}

export function useUbicaciones() {
  return useQuery({
    queryKey: ['ubicaciones'],
    queryFn: () => catalogoApi.ubicaciones(),
    select: (res) =>
      res?.data
        ?.filter((location) => location.id && location.name && location.region?.id)
        .map((location) => ({
          id: location.id!,
          name: location.name!,
          region: {
            id: location.region!.id!,
            name: location.region?.name ?? '',
            slug: location.region?.slug ?? '',
          },
        })),
  });
}
