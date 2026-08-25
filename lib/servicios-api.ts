import { apiFetch } from './api-client';
import type {
  ServicioListItem,
  ServicioDetalle,
  CreateServicioPayload,
  UpdateServicioPayload,
} from '@/types/contracts/services';
import type { paths } from '@/types/contracts/api-contracts-types';

// Re-export contract types for consumers
export type {
  ServicioListItem as ServicioResumen,
  ServicioDetalle,
  CreateServicioPayload,
  UpdateServicioPayload,
};

// Legacy aliases for backward compatibility
export type Category = { id: string; name: string };
export type Location = { id: string; name: string };
export type ProfileRef = { id: string; name: string; slug: string };
export type ContactInfo = {
  type: string;
  value: string;
  id?: string;
  readAt?: string | null;
  respondedAt?: string | null;
};
export type PortfolioImage = {
  id?: string;
  url: string;
  title?: string | null;
  description?: string | null;
  orden?: number;
};

export type ServiciosListParams = NonNullable<
  paths['/api/servicios']['get']['parameters']['query']
>;

function toQueryString(params?: Record<string, string | number | boolean | undefined>): string {
  if (!params) return '';
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') searchParams.set(key, String(value));
  });
  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

// --- API Client ---

export const serviciosApi = {
  misServicios: () => apiFetch<{ success: boolean; data: ServicioListItem[] }>('/mis-servicios'),

  list: (params?: ServiciosListParams) =>
    apiFetch<{ success: boolean; data: ServicioListItem[] }>(`/servicios${toQueryString(params)}`),

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
};
