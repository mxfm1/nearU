import { apiFetch } from './api-client'

// --- Tipos públicos ---

export type Category = {
  id: string
  name: string
}

export type Location = {
  id: string
  name: string
}

export type ProfileRef = {
  id: string
  name: string
  slug: string
}

export type EventoResumen = {
  id: string
  profileId: string
  slug: string
  title: string
  description: string
  startAt: string
  location: Location | null
  category: Category | null
  thumbnailUrl: string | null
  profile: ProfileRef
  eventStatus: string
  createdAt: string
  updatedAt: string
}

export type EventoDetalle = EventoResumen

// --- API Client ---

export const eventosApi = {
  list: () =>
    apiFetch<{ success: boolean; data: EventoResumen[] }>('/eventos'),

  getById: (id: string) =>
    apiFetch<{ success: boolean; data: EventoDetalle }>(`/eventos/${id}`),
}
