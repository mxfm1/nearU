import { apiFetch } from './api-client'
import type { ServicioListItem, ServicioDetalle, CreateServicioPayload, UpdateServicioPayload } from '@/types/contracts/services'

// Re-export contract types for consumers
export type { ServicioListItem as ServicioResumen, ServicioDetalle, CreateServicioPayload, UpdateServicioPayload }

// Legacy aliases for backward compatibility
export type Category = { id: string; name: string }
export type Location = { id: string; name: string }
export type ProfileRef = { id: string; name: string; slug: string }
export type ContactInfo = { type: string; value: string; id?: string; readAt?: string | null; respondedAt?: string | null }
export type PortfolioImage = { id?: string; url: string; title?: string | null; description?: string | null; orden?: number }

// --- API Client ---

export const serviciosApi = {
  misServicios: () =>
    apiFetch<{ success: boolean; data: ServicioListItem[] }>('/mis-servicios'),

  list: () =>
    apiFetch<{ success: boolean; data: ServicioListItem[] }>('/servicios'),

  getById: (id: string) =>
    apiFetch<{ success: boolean; data: ServicioDetalle }>(`/servicios/${id}`),

  create: (payload: CreateServicioPayload) =>
    apiFetch<{ success: boolean; data: ServicioDetalle }>('/servicios', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  update: (id: string, payload: UpdateServicioPayload) =>
    apiFetch<{ success: boolean; data: ServicioDetalle }>(`/servicios/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
}
