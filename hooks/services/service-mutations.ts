'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateServicioPayload, UpdateServicioPayload } from '@/lib/servicios-api';

export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateServicioPayload) => {
      const { serviciosApi } = await import('@/lib/servicios-api');
      return serviciosApi.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificaciones'] });
      queryClient.invalidateQueries({ queryKey: ['notificaciones', 'unread-count'] });
      queryClient.invalidateQueries({ queryKey: ['mis-servicios'] });
    },
  });
}

export function useUpdateService(serviceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateServicioPayload) => {
      const { serviciosApi } = await import('@/lib/servicios-api');
      return serviciosApi.update(serviceId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services', 'detail', serviceId] });
      queryClient.invalidateQueries({ queryKey: ['mis-servicios'] });
    },
  });
}
