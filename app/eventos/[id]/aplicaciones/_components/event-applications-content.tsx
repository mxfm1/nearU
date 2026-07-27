'use client';

import Link from 'next/link';
import { ArrowLeft, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EventInfoSection } from './event-info-section';
import { ApplicationListSection } from './application-list-section';
import { useEvent } from '@/hooks/use-event';
import { useEventApplications } from '@/hooks/applications/applications-queries';
import type { ApplicationStatus } from '@/lib/applications-api';

const STATUS_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'pending', label: 'Pendiente' },
  { value: 'reviewing', label: 'En revisión' },
  { value: 'accepted', label: 'Aprobado' },
  { value: 'rejected', label: 'Rechazado' },
];

interface EventApplicationsContentProps {
  eventId: string;
  statusFilter: string;
  currentPage: number;
  onStatusChange: (status: string) => void;
  onPageChange: (page: number) => void;
}

export function EventApplicationsContent({
  eventId,
  statusFilter,
  currentPage,
  onStatusChange,
  onPageChange,
}: EventApplicationsContentProps) {
  const { event, isLoading: eventLoading } = useEvent(eventId);
  const { data, isLoading, isError, refetch } = useEventApplications(eventId, {
    status: statusFilter as ApplicationStatus | 'all',
    page: currentPage,
    limit: 10,
  });

  const applications = data || [];
  const total = applications.length;
  const totalPages = Math.ceil(total / 10) || 1;

  if (eventLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* TopNavBar */}
      <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <nav className="flex justify-between items-center px-4 md:px-8 w-full h-16 max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-bold text-xl text-primary">
              NearU
            </Link>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Inicio
            </Link>
          </Button>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-8">
        {/* Breadcrumb */}
        <div className="mb-4">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Volver a mis publicaciones</span>
          </button>
        </div>

        {/* Event Overview */}
        <EventInfoSection event={event} />

        {/* Main Content Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-1">Aplicaciones del Evento</h2>
            <p className="text-muted-foreground">
              Listado de proveedores postulados ordenados por calificación de confianza.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-muted p-2 rounded-xl border">
            <div className="flex items-center gap-2 px-3 border-r border-border">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Filtrar:</span>
              <select
                value={statusFilter}
                onChange={(e) => onStatusChange(e.target.value)}
                className="bg-transparent border-none focus:ring-0 font-bold text-primary p-0 pr-6 text-sm cursor-pointer"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="px-3">
              <span className="text-sm text-muted-foreground">
                <strong className="text-primary">{total}</strong> Aplicaciones
              </span>
            </div>
          </div>
        </div>

        {/* Application List */}
        <ApplicationListSection
          applications={applications}
          isPending={isLoading}
          isError={isError}
          onRefetch={refetch}
          total={total}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </main>
    </div>
  );
}
