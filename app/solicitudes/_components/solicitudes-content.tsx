'use client';

import { motion } from 'framer-motion';
import { CalendarClock, ClipboardList, MessageSquareText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useRequests } from '@/hooks/requests/request-queries';
import {
  getRequestStatusLabel,
  getRequestTypeLabel,
  splitRequestsByStatus,
} from '@/lib/requests-utils';
import { cn } from '@/lib/utils';
import type { RequestStatus, UserRequest } from '@/types/contracts/requests';
import { SolicitudesEmpty } from './solicitudes-empty';
import { SolicitudesError } from './solicitudes-error';
import { SolicitudesSkeleton } from './solicitudes-skeleton';

const STATUS_STYLES: Record<RequestStatus, string> = {
  pending: 'border-amber-200 bg-amber-50 text-amber-800',
  in_review: 'border-blue-200 bg-blue-50 text-blue-800',
  approved: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  rejected: 'border-red-200 bg-red-50 text-red-800',
  resolved: 'border-slate-200 bg-slate-50 text-slate-800',
  cancelled: 'border-muted bg-muted text-muted-foreground',
};

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

export function SolicitudesContent() {
  const requestsQuery = useRequests();
  const requests = requestsQuery.data?.data ?? [];
  const { active, completed } = splitRequestsByStatus(requests);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand/10 text-brand">
              <ClipboardList className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-2xl font-bold text-foreground md:text-3xl">Solicitudes</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Seguimiento de tus peticiones activas y realizadas.
              </p>
            </div>
          </div>
        </div>

        {requestsQuery.isLoading && <SolicitudesSkeleton />}
        {requestsQuery.isError && <SolicitudesError onRetry={() => requestsQuery.refetch()} />}
        {requestsQuery.isSuccess && requests.length === 0 && <SolicitudesEmpty />}
        {requestsQuery.isSuccess && requests.length > 0 && (
          <motion.div
            initial="initial"
            animate="animate"
            variants={{ animate: { transition: { staggerChildren: 0.06 } } }}
            className="space-y-8"
          >
            <RequestsSection
              title="Activas"
              requests={active}
              emptyText="No tenés solicitudes activas."
            />
            <RequestsSection
              title="Realizadas"
              requests={completed}
              emptyText="No tenés solicitudes finalizadas todavía."
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}

function RequestsSection({
  title,
  requests,
  emptyText,
}: {
  title: string;
  requests: UserRequest[];
  emptyText: string;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <span className="text-sm text-muted-foreground">{requests.length}</span>
      </div>
      {requests.length === 0 ? (
        <div className="rounded-xl border border-dashed p-5 text-sm text-muted-foreground">
          {emptyText}
        </div>
      ) : (
        <div className="grid gap-3">
          {requests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      )}
    </section>
  );
}

function RequestCard({ request }: { request: UserRequest }) {
  return (
    <motion.div
      variants={{ initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <Card className="overflow-hidden shadow-sm">
        <CardContent className="space-y-4 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {getRequestTypeLabel(request.type)}
              </p>
              <h3 className="mt-1 text-lg font-semibold text-foreground">{request.title}</h3>
            </div>
            <Badge variant="outline" className={cn('w-fit border', STATUS_STYLES[request.status])}>
              {getRequestStatusLabel(request.status)}
            </Badge>
          </div>

          {request.description ? (
            <p className="text-sm leading-6 text-muted-foreground">{request.description}</p>
          ) : null}

          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CalendarClock className="h-4 w-4" />
              Creada el {formatDate(request.createdAt)}
            </span>
            {request.reviewedAt ? (
              <span className="flex items-center gap-1.5">
                <CalendarClock className="h-4 w-4" />
                Revisada el {formatDate(request.reviewedAt)}
              </span>
            ) : null}
          </div>

          {request.reviewerComment ? (
            <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
              <MessageSquareText className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="font-medium text-foreground">Comentario de revisión</p>
                <p className="mt-1">{request.reviewerComment}</p>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </motion.div>
  );
}
