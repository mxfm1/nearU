'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateUserRequestPayload } from '@/lib/requests-api';

export function useCreateRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateUserRequestPayload) => {
      const { requestsApi } = await import('@/lib/requests-api');
      return requestsApi.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['notificaciones'] });
      queryClient.invalidateQueries({ queryKey: ['notificaciones', 'unread-count'] });
    },
  });
}
