'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { eventosApi, type CreateEventoPayload, type EventoDetalle } from '@/lib/eventos-api'

export interface UseCreateEventoOptions {
  onSuccess?: (evento: EventoDetalle) => void
  onError?: (error: Error) => void
}

export function useCreateEvento({ onSuccess, onError }: UseCreateEventoOptions = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateEventoPayload) => eventosApi.create(payload),
    onSuccess: (res) => {
      if (res.success && res.data) {
        queryClient.invalidateQueries({ queryKey: ['mis-eventos'] })
        onSuccess?.(res.data)
      }
    },
    onError: (error: Error) => {
      onError?.(error)
    },
  })
}
