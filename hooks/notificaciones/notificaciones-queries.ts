'use client';

import { queryOptions, useQuery } from '@tanstack/react-query';
import { notificacionesApi } from '@/lib/notificaciones-api';

export const notificacionesQueryOptions = () =>
  queryOptions({
    queryKey: ['notificaciones'],
    queryFn: () => notificacionesApi.getNotifications(),
  });

export const unreadNotificationsCountQueryOptions = () =>
  queryOptions({
    queryKey: ['notificaciones', 'unread-count'],
    queryFn: () => notificacionesApi.getUnreadCount(),
  });

export function useNotificaciones() {
  return useQuery(notificacionesQueryOptions());
}

export function useUnreadNotificationsCount() {
  return useQuery(unreadNotificationsCountQueryOptions());
}
