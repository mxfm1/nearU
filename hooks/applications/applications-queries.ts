'use client';

import { useQuery, queryOptions } from '@tanstack/react-query';
import { applicationsApi } from '@/lib/applications-api';

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

export const ApplicationQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['application-detail', id],
    queryFn: () => applicationsApi.getById(id),
    enabled: !!id,
  });

export function useApplication(applicationId: string) {
  return useQuery({
    queryKey: ['application-detail', applicationId],
    queryFn: () => applicationsApi.getById(applicationId),
    enabled: !!applicationId,
    select: (res) => res?.data,
  });
}

export function useMyApplications() {
  return useQuery({
    queryKey: ['my-applications'],
    queryFn: () => applicationsApi.getMyApplications(),
    select: (res) => res?.data,
  });
}

export function useMyApplicationByEventId(eventId: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['my-application', eventId],
    queryFn: () => applicationsApi.getMyApplicationByEventId(eventId),
    enabled: !!eventId,
  });

  return {
    application: data ?? null,
    isLoading,
    error: error ? mapHttpError(error instanceof Error ? error : new Error(String(error))) : null,
  };
}

export function useEventApplications(
  eventId: string,
  options?: { status?: string; page?: number; limit?: number }
) {
  return useQuery({
    queryKey: ['event-applications', eventId, options],
    queryFn: () =>
      applicationsApi.getEventApplications(
        eventId,
        options as Parameters<typeof applicationsApi.getEventApplications>[1]
      ),
    select: (res) => res?.data,
  });
}
