import { apiFetch } from './api-client';
import type {
  NotificationListResponse,
  UnreadNotificationsCountResponse,
} from '@/types/contracts/notifications';

export const notificacionesApi = {
  getNotifications() {
    return apiFetch<NotificationListResponse>('/notificaciones');
  },

  getUnreadCount() {
    return apiFetch<UnreadNotificationsCountResponse>('/notificaciones/unread-count');
  },

  markAsRead(id: string) {
    return apiFetch<void>(`/notificaciones/${id}/read`, { method: 'PATCH' });
  },

  markAllAsRead() {
    return apiFetch<void>('/notificaciones/read-all', { method: 'PATCH' });
  },
};
