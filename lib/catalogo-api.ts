import { apiFetch } from './api-client'
import type { Categoria, Region } from '@/types/contracts/catalog-types'

export type { Categoria, Region }

export const catalogoApi = {
  categorias: (type?: 'service' | 'event') => {
    const params = type ? `?type=${type}` : ''
    return apiFetch<{ success: boolean; data: Categoria[] }>(`/categorias${params}`)
  },

  regiones: () =>
    apiFetch<{ success: boolean; data: Region[] }>('/regiones'),

  ubicaciones: () =>
    apiFetch<{ success: boolean; data: { id: string; name: string; region: { id: string; name: string; slug: string } }[] }>('/ubicaciones'),

  intenciones: () =>
    apiFetch<{ success: boolean; data: string[] }>('/contactos/intenciones'),
}
