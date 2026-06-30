import { apiFetch } from './api-client'

// --- Tipos públicos ---

export type ContactoResumen = {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  lastMessage: string | null
  lastMessageAt: string | null
  unread: boolean
}

export type ContactoDetalle = {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  message: string
  subject: string
  read: boolean
  createdAt: string
  updatedAt: string
}

// --- API Client ---

export const contactosApi = {
  inbox: () =>
    apiFetch<{ success: boolean; data: ContactoResumen[] }>('/contactos/inbox'),

  getById: (id: string) =>
    apiFetch<{ success: boolean; data: ContactoDetalle }>(`/contactos/${id}`),
}
