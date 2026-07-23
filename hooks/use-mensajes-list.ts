'use client'

import { useQuery } from '@tanstack/react-query'
import type { ConversationListItem } from '@/lib/mensajes-api'
import { mensajesApi } from '@/lib/mensajes-api'

export function useMensajesList() {
  const query = useQuery({
    queryKey: ['threads'],
    queryFn: () => mensajesApi.getConversations(),
  })

  return {
    conversations: (query.data?.data ?? []) as ConversationListItem[],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}
