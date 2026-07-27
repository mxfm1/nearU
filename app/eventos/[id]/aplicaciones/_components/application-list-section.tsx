'use client';

import { Loader2, Search } from 'lucide-react';
import { ApplicationCard } from './application-card';
import type { EventApplication } from '@/lib/applications-api';

interface ApplicationListSectionProps {
  applications: EventApplication[];
  isPending: boolean;
  isError: boolean;
  onRefetch: () => void;
  total: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ApplicationListSection({
  applications,
  isPending,
  isError,
  onRefetch,
  total,
  currentPage,
  totalPages,
  onPageChange,
}: ApplicationListSectionProps) {
  if (isPending) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-card rounded-xl border border-border p-5 flex items-center gap-6 animate-pulse"
          >
            <div className="w-20 h-20 rounded-xl bg-muted" />
            <div className="flex-grow space-y-2">
              <div className="h-5 w-48 bg-muted rounded" />
              <div className="h-4 w-32 bg-muted rounded" />
            </div>
            <div className="w-24 h-8 bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12 bg-card rounded-xl border border-border">
        <p className="text-destructive mb-4">Error al cargar las aplicaciones</p>
        <button
          onClick={onRefetch}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-12 bg-card rounded-xl border border-border">
        <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No hay aplicaciones para este evento.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {applications.map((application) => (
          <ApplicationCard key={application.id} application={application} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 border rounded ${
                page === currentPage ? 'bg-primary text-white border-primary' : 'hover:bg-muted'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      )}
    </>
  );
}
