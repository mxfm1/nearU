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

export type ContactInfo = {
  type: 'email' | 'telefono' | 'whatsapp' | 'website' | 'instagram' | 'facebook' | 'twitter'
  value: string
}

export type PortfolioImage = {
  url: string
  title?: string
  description?: string
}

export type ServicioResumen = {
  id: string
  profileId: string
  slug: string
  title: string
  marca: string | null
  description: string | null
  yearsExperience: number | null
  priceMin: number | null
  priceMax: number | null
  availability: string | null
  bannerUrl: string | null
  logoUrl: string | null
  thumbnailUrl: string | null
  contacts: (ContactInfo & { id?: string; readAt?: string | null; respondedAt?: string | null })[] | null
  portfolio: PortfolioImage[]
  location: { id: string; name: string } | null
  category: { id: string; name: string } | null
  profile: { id: string; name: string; slug: string }
  status: { id: string; name: string; slug: string }
  createdAt: string
  updatedAt: string
}

export type ServicioDetalle = ServicioResumen

// --- API Client ---

export type CreateServicioPayload = {
  slug: string
  title: string
  marca?: string | null
  description?: string | null
  yearsExperience?: number | null
  priceMin?: number | null
  priceMax?: number | null
  availability?: string | null
  contacts?: ContactInfo[]
  bannerUrl?: string | null
  logoUrl?: string | null
  thumbnailUrl?: string | null
  locationId?: string | null
  categoryId?: string | null
  status?: 'draft' | 'published' | 'paused' | 'archived'
  portfolio?: PortfolioImage[]
}

export type UpdateServicioPayload = Partial<{
  slug: string
  title: string
  marca: string | null
  description: string | null
  yearsExperience: number | null
  priceMin: number | null
  priceMax: number | null
  availability: string | null
  contacts: ContactInfo[]
  bannerUrl: string | null
  logoUrl: string | null
  thumbnailUrl: string | null
  locationId: string | null
  categoryId: string | null
  status: 'draft' | 'published' | 'paused' | 'archived'
  portfolio: PortfolioImage[]
}>

export const serviciosApi = {
  misServicios: () =>
    apiFetch<{ success: boolean; data: ServicioResumen[] }>('/mis-servicios'),

  list: () =>
    apiFetch<ServicioResumen[]>('/servicios'),

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
