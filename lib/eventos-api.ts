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

export type EventoDetalle = {
  id: string
  profileId: string
  slug: string
  title: string
  description: string
  startAt: string
  endAt: string | null
  location: Location | null
  category: Category | null
  thumbnailUrl: string | null
  bannerUrl: string | null
  profile: ProfileRef
  eventStatus: string
  createdAt: string
  updatedAt: string
  requirements: string | null
  applicationDeadline: string | null
  requiredCandidates: number
  requiresVerifiedProfile: boolean
  autoCloseWhenFilled: boolean
}

// --- Payloads ---

export type CreateEventoPayload = {
  slug: string
  title: string
  description?: string | null
  applicationDeadline?: string | null
  requiredCandidates?: number
  requiresVerifiedProfile?: boolean
  autoCloseWhenFilled?: boolean
  requirements?: string | null
  locationId?: string | null
  categoryId?: string | null
  thumbnailUrl?: string | null
  bannerUrl?: string | null
  eventStatus?: 'draft' | 'published' | 'paused' | 'archived'
}

export type UpdateEventoPayload = Partial<CreateEventoPayload>

// --- API Client ---

export const eventosApi = {
  list: () =>
    apiFetch<{ success: boolean; data: EventoResumen[] }>('/eventos'),

  getById: (id: string) =>
    apiFetch<{ success: boolean; data: EventoDetalle }>(`/eventos/${id}`),

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

  misEventos: () =>
    apiFetch<{ success: boolean; data: EventoResumen[] }>('/mis-eventos'),

  getMisEvento: (id: string) =>
    apiFetch<{ success: boolean; data: EventoDetalle }>(`/mis-eventos/${id}`),
}
