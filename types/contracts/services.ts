import type { paths } from './api-contracts-types'

// ─── Servicios ────────────────────────────────────────────────

type ServiciosGet = paths['/api/servicios']['get']
type ServicioListItem = NonNullable<
  NonNullable<ServiciosGet['responses']['200']>['content']['application/json']['data']
>[number]

export type { ServicioListItem }

// ─── Servicio por ID / slug ───────────────────────────────────

type ServicioByIdGet = paths['/api/servicios/{slugOrId}']['get']
export type ServicioDetalle = NonNullable<
  NonNullable<ServicioByIdGet['responses']['200']>['content']['application/json']['data']
>

// ─── Crear servicio ───────────────────────────────────────────

type ServicioPost = paths['/api/servicios']['post']
export type CreateServicioPayload = NonNullable<
  ServicioPost['requestBody']
>['content']['application/json']

// ─── Actualizar servicio ──────────────────────────────────────

type ServicioPatch = paths['/api/servicios/{id}']['patch']
export type UpdateServicioPayload = NonNullable<
  ServicioPatch['requestBody']
>['content']['application/json']

// ─── Mis servicios ────────────────────────────────────────────

type MisServiciosGet = paths['/api/mis-servicios']['get']
export type MisServiciosResponse = NonNullable<
  NonNullable<MisServiciosGet['responses']['200']>['content']['application/json']['data']
>
