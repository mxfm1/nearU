'use client'

import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search, SlidersHorizontal, RefreshCw } from 'lucide-react'
import { mensajesApi, type ConversationListItem } from '@/lib/mensajes-api'
import { MensajesListError } from './mensajes-list-error'
import { MensajesListEmpty } from './mensajes-list-empty'
import { MensajesListCard } from './mensajes-list-card'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' },
}

type FilterType = 'all' | 'unread' | 'events'

export function MensajesListContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentFilter = (searchParams.get('filter') as FilterType) || 'all'
  const searchQuery = searchParams.get('q') || ''

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['threads'],
    queryFn: () => mensajesApi.getConversations(),
  })

  // Log del error al inicio del componente
  if (isError) {
    console.error('[MensajesListContent] Error fetching threads:', error)
  }

  console.log("thread list",data)

  const conversations: ConversationListItem[] = data || []

  // Filtrar conversaciones
  const filteredConversations = conversations.filter((conv) => {
    // Filtro por búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesOrganizer = conv.organizerName.toLowerCase().includes(query)
      const matchesApplicant = conv.applicantName.toLowerCase().includes(query)
      const matchesEvent = conv.applicationTitle.toLowerCase().includes(query)
      if (!matchesOrganizer && !matchesApplicant && !matchesEvent) {
        return false
      }
    }
    // Filtro por tabs
    if (currentFilter === 'unread' && conv.unreadCount === 0) {
      return false
    }
    // 'events' filter would need event-specific logic
    return true
  })

  // Actualizar URL con filtros
  const updateFilter = (filter: FilterType) => {
    const params = new URLSearchParams(searchParams.toString())
    if (filter === 'all') {
      params.delete('filter')
    } else {
      params.set('filter', filter)
    }
    router.replace(`/user/mensajes?${params.toString()}`)
  }

  const updateSearch = (query: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (query) {
      params.set('q', query)
    } else {
      params.delete('q')
    }
    router.replace(`/user/mensajes?${params.toString()}`)
  }

  if (isLoading) {
    return null
  }

  if (isError) {
    return (
      <MensajesListError
        error={error instanceof Error ? error : new Error('Error desconocido')}
        onRetry={() => refetch()}
      />
    )
  }

  if (conversations.length === 0) {
    return <MensajesListEmpty />
  }

  return (
    <motion.div {...fadeInUp} className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 md:px-6 pt-6 pb-4">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary">Mensajes</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gestiona tus comunicaciones con proveedores y socios.
            </p>
          </div>
          <div className="flex gap-2">
            {/* <button className="p-2 border border-border rounded-lg hover:bg-muted transition-colors">
              <SlidersHorizontal className="w-5 h-5 text-muted-foreground" />
            </button>
            <button 
              onClick={() => refetch()}
              className="p-2 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              <RefreshCw className="w-5 h-5 text-muted-foreground" />
            </button> */}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex bg-muted/50 p-1 rounded-xl w-full md:w-auto">
            <button
              onClick={() => updateFilter('all')}
              className={`flex-1 md:flex-none px-4 md:px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                currentFilter === 'all'
                  ? 'bg-card text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => updateFilter('unread')}
              className={`flex-1 md:flex-none px-4 md:px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                currentFilter === 'unread'
                  ? 'bg-card text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              No leídos
            </button>
            <button
              onClick={() => updateFilter('events')}
              className={`flex-1 md:flex-none px-4 md:px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                currentFilter === 'events'
                  ? 'bg-card text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Eventos
            </button>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => updateSearch(e.target.value)}
              placeholder="Filtrar por empresa..."
              className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-6 space-y-3">
        {filteredConversations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No se encontraron conversaciones con los filtros aplicados.
            </p>
          </div>
        ) : (
          filteredConversations.map((conversation, index) => (
            <MensajesListCard
              key={conversation.id}
              conversation={conversation}
              index={index}
            />
          ))
        )}
      </div>
    </motion.div>
  )
}
