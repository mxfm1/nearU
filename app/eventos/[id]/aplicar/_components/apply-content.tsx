'use client';

import { useQuery } from '@tanstack/react-query';
import { scoringRulesApi } from '@/lib/scoring-rules-api';
import { eventosApi } from '@/lib/eventos-api';
import { ApplyForm } from './apply-form';
import { ApplySkeleton } from './apply-skeleton';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ApplyContentProps {
  eventId: string;
}

export function ApplyContent({ eventId }: ApplyContentProps) {
  // Fetch event details
  const {
    data: eventRes,
    isLoading: eventLoading,
    isError: eventError,
  } = useQuery({
    queryKey: ['evento', eventId],
    queryFn: () => eventosApi.getById(eventId),
  });

  // Fetch scoring rules for this event (public endpoint)
  const {
    data: rulesRes,
    isLoading: rulesLoading,
    isError: rulesError,
  } = useQuery({
    queryKey: ['scoring-rules', eventId],
    queryFn: () => scoringRulesApi.getByEventId(eventId),
  });

  const isLoading = eventLoading || rulesLoading;
  const isError = eventError || rulesError;

  if (isLoading) {
    return <ApplySkeleton />;
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="mb-4 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-7 w-7 text-destructive" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Error al cargar</h2>
          <p className="text-sm text-muted-foreground mb-4">
            No se pudieron cargar los datos del evento o las reglas de postulación.
          </p>
          <Button asChild variant="outline">
            <Link href={`/eventos/${eventId}`}>Volver al evento</Link>
          </Button>
        </div>
      </div>
    );
  }

  const event = eventRes?.data;
  const scoringRules = rulesRes?.data ?? [];

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-bold text-foreground mb-2">Evento no encontrado</h2>
          <p className="text-sm text-muted-foreground mb-4">
            El evento que buscás no existe o fue eliminado.
          </p>
          <Button asChild variant="outline">
            <Link href="/eventos">Ver eventos</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <ApplyForm eventId={eventId} eventTitle={event.title ?? ''} />;
}
