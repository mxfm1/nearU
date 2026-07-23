'use client'

import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import type { ConversationListItem } from '@/lib/mensajes-api'
import { mensajesApi } from '@/lib/mensajes-api'

export type UseMensajesListResult = UseQueryResult<ConversationListItem[], Error>

export function useMensajesList(): UseMensajesListResult {
  return useQuery({
    queryKey: ['threads'],
    queryFn: () => mensajesApi.getConversations(),
    select: (res) => (Array.isArray(res) ? res : res.data),
  })
}
