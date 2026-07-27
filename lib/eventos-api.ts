import { apiFetch } from './api-client';
import type {
  EventoListItem,
  EventoDetalle,
  CreateEventoPayload,
  UpdateEventoPayload,
} from '@/types/contracts/event';

export type {
  EventoListItem as EventoResumen,
  EventoDetalle,
  CreateEventoPayload,
  UpdateEventoPayload,
};

export const eventosApi = {
  list: () => apiFetch<{ success: boolean; data: EventoListItem[] }>('/eventos'),

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
