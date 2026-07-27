import type { paths } from './api-contracts-types';

// ─── Eventos ──────────────────────────────────────────────────

type EventosGet = paths['/api/eventos']['get'];
export type EventoListItem = NonNullable<
  NonNullable<EventosGet['responses']['200']>['content']['application/json']['data']
>[number];

// ─── Evento por ID / slug ─────────────────────────────────────

type EventoByIdGet = paths['/api/eventos/{slugOrId}']['get'];
export type EventoDetalle = NonNullable<
  NonNullable<EventoByIdGet['responses']['200']>['content']['application/json']['data']
>;

// ─── Crear evento ─────────────────────────────────────────────

type EventoPost = paths['/api/eventos']['post'];
export type CreateEventoPayload = NonNullable<
  EventoPost['requestBody']
>['content']['application/json'];

// ─── Actualizar evento ────────────────────────────────────────

type EventoPatch = paths['/api/eventos/{id}']['patch'];
export type UpdateEventoPayload = NonNullable<
  EventoPatch['requestBody']
>['content']['application/json'];

// ─── Mis eventos ──────────────────────────────────────────────

type MisEventosGet = paths['/api/mis-eventos']['get'];
export type MisEventosResponse = NonNullable<
  NonNullable<MisEventosGet['responses']['200']>['content']['application/json']['data']
>;
