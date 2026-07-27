'use client';
import { useQuery } from '@tanstack/react-query';
import { serviciosApi, type ServicioDetalle } from '@/lib/servicios-api';
import { ServicesQueryOptions } from '@/queries/service.queries';

export interface UseServiceResult {
  service: ServicioDetalle | null;
  isLoading: boolean;
  error: string | null;
}

function mapHttpError(err: Error): string {
  const msg = err.message;
  if (msg.includes('404')) return 'NOT_FOUND';
  if (msg.includes('401')) return 'UNAUTHORIZED';
  if (msg.includes('403')) return 'FORBIDDEN';
  if (msg.includes('503')) return 'SERVICE_UNAVAILABLE';
  if (msg.includes('429')) return 'RATE_LIMITED';
  if (msg.includes('Failed to fetch')) return 'NETWORK_ERROR';
  return 'UNKNOWN';
}

export function useService(id: string): UseServiceResult {
  const { data, isLoading, error } = useQuery({
    queryKey: ['servicio', id],
    queryFn: () => serviciosApi.getById(id),
    enabled: !!id,
  });

  return {
    service: data?.data ?? null,
    isLoading,
    error: error ? mapHttpError(error instanceof Error ? error : new Error(String(error))) : null,
  };
}

export const useServices = () => {
  return useQuery({
    ...ServicesQueryOptions(),
    select: (res) => res?.data,
  });
};
