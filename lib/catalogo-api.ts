import { apiFetch } from './api-client';
import type { Categoria, Region, Ubicacion } from '@/types/contracts/catalog-types';

export type { Categoria, Region, Ubicacion };

export const catalogoApi = {
  categorias: (type?: 'service' | 'event') => {
    const params = type ? `?type=${type}` : '';
    return apiFetch<{ success: boolean; data: Categoria[] }>(`/categorias${params}`);
  },

  regiones: () => apiFetch<{ success: boolean; data: Region[] }>('/regiones'),

  ubicaciones: () => apiFetch<{ success: boolean; data: Ubicacion[] }>('/ubicaciones'),

  intenciones: () => apiFetch<{ success: boolean; data: string[] }>('/contactos/intenciones'),
};
