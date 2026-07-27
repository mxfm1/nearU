'use client';

import { useQuery } from '@tanstack/react-query';
import type { EventoDetalle } from '@/lib/eventos-api';
import {
  EventsQueryOptions,
  EventDetailQueryOptions,
  MyEventsQueryOptions,
} from '@/queries/event.queries';

// ─── Helpers ──────────────────────────────────────────────────

function mapHttpError(err: Error): string {
  const msg = err.message;
  if (msg.includes('404')) return 'NOT_FOUND';
  if (msg.includes('401')) return 'UNAUTHORIZED';
  if (msg.includes('403')) return 'FORBIDDEN';
  if (msg.includes('503')) return 'SERVICE_UNAVAILABLE';
  if (msg.includes('429')) return 'RATE_LIMITED';
  if (msg.includes('Failed to fetch')) return 'NETWORK_ERROR';
  return 'UNKNOWN';
}

// ─── Queries ──────────────────────────────────────────────────

export function useEvents() {
  return useQuery(EventsQueryOptions());
}

export function useEvent(id: string) {
  const { data, isLoading, error } = useQuery(EventDetailQueryOptions(id));

  return {
    event: data ?? null,
    isLoading,
    error: error ? mapHttpError(error instanceof Error ? error : new Error(String(error))) : null,
  };
}

export function useMyEvents() {
  return useQuery(MyEventsQueryOptions());
}

// ─── Mutations ────────────────────────────────────────────────

// TODO: Add useCreateEvent, useUpdateEvent, useDeleteEvent when needed
