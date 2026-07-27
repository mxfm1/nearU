import { queryOptions } from '@tanstack/react-query';
import { eventosApi } from '@/lib/eventos-api';

export const EventsQueryOptions = () =>
  queryOptions({
    queryKey: ['eventos'],
    queryFn: eventosApi.list,
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
