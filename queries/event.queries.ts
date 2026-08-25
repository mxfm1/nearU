import { queryOptions } from '@tanstack/react-query';
import { eventosApi, type EventosListParams } from '@/lib/eventos-api';

export const EventsQueryOptions = (params?: EventosListParams) =>
  queryOptions({
    queryKey: ['eventos', params],
    queryFn: () => eventosApi.list(params),
    select: (res) => res?.data,
  });

export const EventDetailQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['evento', id],
    queryFn: () => eventosApi.getById(id),
    enabled: !!id,
    select: (res) => res?.data,
  });

export const MyEventsQueryOptions = () =>
  queryOptions({
    queryKey: ['mis-eventos'],
    queryFn: eventosApi.misEventos,
    select: (res) => res?.data,
  });
