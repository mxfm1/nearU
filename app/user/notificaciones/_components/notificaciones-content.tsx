'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Calendar, ClipboardCheck, MessageCircle, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { cn } from '@/lib/utils';
import { useNotificaciones } from '@/hooks/notificaciones/notificaciones-queries';
import {
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
} from '@/hooks/notificaciones/notificaciones-mutations';
import type { NotificationItem } from '@/types/contracts/notifications';
import { NotificacionesEmpty } from './notificaciones-empty';
import { NotificacionesError } from './notificaciones-error';
import { NotificacionesSkeleton } from './notificaciones-skeleton';
import {
  filterNotifications,
  formatNotificationTime,
  getSafeNotificationActionUrl,
  getNotificationStyle,
  ITEMS_PER_PAGE,
} from './notificaciones-utils';

const ICONS = {
  Bell,
  Calendar,
  ClipboardCheck,
  MessageCircle,
};

export function NotificacionesContent() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const notificationsQuery = useNotificaciones();
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();

  const notifications = notificationsQuery.data?.data ?? [];
  const filteredNotifications = filterNotifications(notifications, searchQuery);
  const totalPages = Math.ceil(filteredNotifications.length / ITEMS_PER_PAGE);
  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const unreadCount = notifications.filter((notification) => !notification.readAt).length;

  function handleSearch(value: string) {
    setSearchQuery(value);
    setCurrentPage(1);
  }

  async function handleNotificationClick(notification: NotificationItem) {
    const actionUrl = getSafeNotificationActionUrl(notification.actionUrl);

    if (notification.id && !notification.readAt && !markAsReadMutation.isPending) {
      try {
        await markAsReadMutation.mutateAsync(notification.id);
      } catch {
        // La navegación a la acción relevante no debe depender de marcar como leída.
      }
    }

    if (actionUrl) router.push(actionUrl);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-6 md:py-8">
        <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">Notificaciones</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {unreadCount > 0
                ? `${unreadCount} ${unreadCount === 1 ? 'sin leer' : 'sin leer'}`
                : 'Estás al día'}
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar notificaciones..."
                value={searchQuery}
                onChange={(event) => handleSearch(event.target.value)}
                className="pl-9"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={unreadCount === 0 || markAllAsReadMutation.isPending}
              onClick={() => markAllAsReadMutation.mutate()}
              className="w-full sm:w-auto"
            >
              Marcar todas leídas
            </Button>
          </div>
        </div>

        {notificationsQuery.isLoading && <NotificacionesSkeleton />}

        {notificationsQuery.isError && (
          <NotificacionesError onRetry={() => notificationsQuery.refetch()} />
        )}

        {notificationsQuery.isSuccess && filteredNotifications.length === 0 && (
          <NotificacionesEmpty hasSearch={searchQuery.trim().length > 0} />
        )}

        {notificationsQuery.isSuccess && filteredNotifications.length > 0 && (
          <>
            <motion.div
              initial="initial"
              animate="animate"
              variants={{ animate: { transition: { staggerChildren: 0.06 } } }}
              className="flex flex-col gap-3"
            >
              {paginatedNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id ?? `${notification.createdAt}-${notification.title}`}
                  notification={notification}
                  actionUrl={getSafeNotificationActionUrl(notification.actionUrl)}
                  onClick={() => handleNotificationClick(notification)}
                />
              ))}
            </motion.div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                className="mt-8"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

function NotificationCard({
  notification,
  actionUrl,
  onClick,
}: {
  notification: NotificationItem;
  actionUrl: string | null;
  onClick: () => void;
}) {
  const style = getNotificationStyle(notification.type, notification.readAt);
  const Icon = ICONS[style.icon as keyof typeof ICONS] ?? Bell;
  const isUnread = !notification.readAt;

  return (
    <motion.button
      type="button"
      variants={{
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={cn(
        'flex w-full cursor-pointer items-start gap-3 rounded-xl border border-border bg-card p-4 text-left hover:shadow-md md:gap-4',
        isUnread && 'bg-brand/5',
        style.borderColor && `border-l-4 ${style.borderColor}`
      )}
    >
      <div
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
          style.iconBg
        )}
      >
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
          <h3 className="font-semibold text-foreground">
            {notification.title ?? 'Notificación'}
            {isUnread && <span className="ml-2 inline-block h-2 w-2 rounded-full bg-brand" />}
          </h3>
          <span className="shrink-0 text-xs text-muted-foreground sm:whitespace-nowrap">
            {formatNotificationTime(notification.createdAt)}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {notification.message ?? 'Tenés una nueva actualización.'}
        </p>
        {actionUrl && (
          <span className="mt-3 inline-flex text-xs font-semibold text-primary">Ver detalle</span>
        )}
      </div>
    </motion.button>
  );
}
