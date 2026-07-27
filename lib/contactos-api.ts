import { apiFetch } from './api-client';

// --- Tipos públicos ---

export type ContactoEstado = 'pendiente' | 'leido' | 'respondido' | 'archivado';

export type ContactoResumen = {
  id: string;
  servicioId: string;
  propietarioId: string;
  remitente: {
    id: string;
    nombre: string;
    email: string;
    imagen: string | null;
  };
  intencion?: string;
  estado: ContactoEstado;
  ultimoMensaje: string | null;
  cantidadMensajes: number | string;
  createdAt: string;
  updatedAt: string;
};

export type ContactoDetalle = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  message: string;
  subject: string;
  read: boolean;
  estado: ContactoEstado;
  createdAt: string;
  updatedAt: string;
};

export type CreateContactoPayload = {
  slug: string;
  intencion: string;
  mensaje?: string | null;
  attachments?: string[];
};

// --- API Client ---

export const contactosApi = {
  create: (payload: CreateContactoPayload) =>
    apiFetch<{ success: boolean; data: ContactoDetalle }>('/contactos', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  inbox: () => apiFetch<{ success: boolean; data: ContactoResumen[] }>('/contactos/inbox'),

  getById: (id: string) =>
    apiFetch<{ success: boolean; data: ContactoDetalle }>(`/contactos/${id}`),

  updateStatus: (id: string, estado: ContactoEstado) =>
    apiFetch<{ success: boolean; data: ContactoDetalle }>(`/contactos/${id}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ estado }),
    }),
};
