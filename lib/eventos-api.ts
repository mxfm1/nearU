import { apiFetch } from './api-client';
import type {
  EventoListItem,
  EventoDetalle,
  CreateEventoPayload,
  UpdateEventoPayload,
} from '@/types/contracts/event';
import type { paths } from '@/types/contracts/api-contracts-types';

export type {
  EventoListItem as EventoResumen,
  EventoDetalle,
  CreateEventoPayload,
  UpdateEventoPayload,
};

export type EventosListParams = NonNullable<paths['/api/eventos']['get']['parameters']['query']>;

function toQueryString(params?: Record<string, string | number | boolean | undefined>): string {
  if (!params) return '';
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') searchParams.set(key, String(value));
  });
  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

export const eventosApi = {
  list: (params?: EventosListParams) =>
    apiFetch<{ success: boolean; data: EventoListItem[] }>(`/eventos${toQueryString(params)}`),

  getById: (id: string) => apiFetch<{ success: boolean; data: EventoDetalle }>(`/eventos/${id}`),

  create: (payload: CreateEventoPayload) =>
    apiFetch<{ success: boolean; data: EventoDetalle }>('/eventos', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  update: (id: string, payload: UpdateEventoPayload) =>
    apiFetch<{ success: boolean; data: EventoDetalle }>(`/eventos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  misEventos: () => apiFetch<{ success: boolean; data: EventoListItem[] }>('/mis-eventos'),

  getMisEvento: (id: string) =>
    apiFetch<{ success: boolean; data: EventoDetalle }>(`/mis-eventos/${id}`),
};
