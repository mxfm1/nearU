import { apiFetch } from './api-client'

// --- Tipos ---

export type Categoria = {
  id: string
  name: string
  type: 'service' | 'event'
}

export type Region = {
  id: string
  name: string
  slug: string
  locations: {
    id: string
    name: string
  }[]
}

export type Ubicacion = {
  id: string
  name: string
  region: {
    id: string
    name: string
    slug: string
  }
}

// --- API Client ---

export const catalogoApi = {
  /** GET /api/categorias?type=service | &type=event | sin filtro */
  categorias: (type?: 'service' | 'event') => {
    const params = type ? `?type=${type}` : ''
    return apiFetch<{ success: boolean; data: Categoria[] }>(`/categorias${params}`)
  },

  /** GET /api/regiones — regiones con ubicaciones anidadas */
  regiones: () =>
    apiFetch<{ success: boolean; data: Region[] }>('/regiones'),

  /** GET /api/ubicaciones — plano, cada una incluye su región */
  ubicaciones: () =>
    apiFetch<{ success: boolean; data: Ubicacion[] }>('/ubicaciones'),
}
