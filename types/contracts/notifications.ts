import type { paths } from './api-contracts-types';

export type NotificationListResponse =
  paths['/api/notificaciones']['get']['responses']['200']['content']['application/json'];

export type NotificationItem = NonNullable<NotificationListResponse['data']>[number];

export type UnreadNotificationsCountResponse =
  paths['/api/notificaciones/unread-count']['get']['responses']['200']['content']['application/json'];
