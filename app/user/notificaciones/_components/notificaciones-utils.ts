import type { NotificationItem } from '@/types/contracts/notifications';

export const ITEMS_PER_PAGE = 5;

const SUPPORTED_ACTION_URL_PREFIXES = [
  '/servicios/',
  '/eventos/',
  '/user/mensajes/',
  '/user/publicaciones/evento/',
] as const;

const TYPE_STYLES: Record<string, { icon: string; iconBg: string; borderColor: string | null }> = {
  EVENT: {
    icon: 'Calendar',
    iconBg: 'bg-blue-100 text-blue-700',
    borderColor: 'border-l-blue-500',
  },
  MESSAGE: {
    icon: 'MessageCircle',
    iconBg: 'bg-violet-100 text-violet-700',
    borderColor: 'border-l-violet-500',
  },
  APPLICATION: {
    icon: 'ClipboardCheck',
    iconBg: 'bg-emerald-100 text-emerald-700',
    borderColor: 'border-l-emerald-500',
  },
  SYSTEM: { icon: 'Bell', iconBg: 'bg-gray-100 text-gray-700', borderColor: null },
};

export function filterNotifications(notifications: NotificationItem[], searchQuery: string) {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  if (!normalizedQuery) return notifications;

  return notifications.filter((notification) => {
    const title = notification.title?.toLowerCase() ?? '';
    const message = notification.message?.toLowerCase() ?? '';
    return title.includes(normalizedQuery) || message.includes(normalizedQuery);
  });
}

export function getNotificationStyle(type?: string | null, readAt?: string | null) {
  const style = TYPE_STYLES[type?.toUpperCase() ?? ''] ?? {
    icon: 'Bell',
    iconBg: 'bg-gray-100 text-gray-700',
    borderColor: null,
  };

  return {
    ...style,
    borderColor: readAt ? null : (style.borderColor ?? 'border-l-brand'),
  };
}

export function formatNotificationTime(value?: string | null) {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('es-UY', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function getSafeNotificationActionUrl(value?: string | null): string | null {
  if (!value) return null;
  if (!value.startsWith('/') || value.startsWith('//')) return null;

  const [pathname] = value.split(/[?#]/);
  const isSupported = SUPPORTED_ACTION_URL_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  return isSupported ? value : null;
}
