'use client';

import { useMutation } from '@tanstack/react-query';
import type { CreateServicioPayload } from '@/lib/servicios-api';

export function useCreateService() {
  return useMutation({
    mutationFn: async (payload: CreateServicioPayload) => {
      const { serviciosApi } = await import('@/lib/servicios-api');
      return serviciosApi.create(payload);
    },
  });
}

export function useUpdateService(serviceId: string) {
  return useMutation({
    mutationFn: async (payload: Partial<CreateServicioPayload>) => {
      const { serviciosApi } = await import('@/lib/servicios-api');
      return serviciosApi.update(serviceId, payload);
    },
  });
}
