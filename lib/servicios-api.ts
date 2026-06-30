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
  title: string
  description: string
}

export type ServicioResumen = {
  id: string
  profileId: string
  slug: string
  title: string
  marca: string
  description: string
  category: Category | null
  location: Location | null
  serviceStatus: string
  availability: string | null
  yearsExperience: number | null
  priceMin: number | null
  priceMax: number | null
  bannerUrl: string | null
  logoUrl: string | null
  thumbnailUrl: string | null
  contactInfo: ContactInfo[]
  portfolio: PortfolioImage[]
  profile: ProfileRef
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
  contactInfo?: ContactInfo[]
  bannerUrl?: string | null
  logoUrl?: string | null
  thumbnailUrl?: string | null
  locationId?: string | null
  categoryId?: string | null
  serviceStatus?: 'draft' | 'published' | 'paused' | 'archived'
  portfolio?: PortfolioImage[]
}

export const serviciosApi = {
  list: () =>
    apiFetch<{ success: boolean; data: ServicioResumen[] }>('/servicios'),

  getById: (id: string) =>
    apiFetch<{ success: boolean; data: ServicioDetalle }>(`/servicios/${id}`),

  create: (payload: CreateServicioPayload) =>
    apiFetch<{ success: boolean; data: ServicioDetalle }>('/servicios', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
}
