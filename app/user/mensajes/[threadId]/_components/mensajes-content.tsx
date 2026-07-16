'use client'

import { useEffect, useRef, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { mensajesApi, type Conversation, type Mensaje } from '@/lib/mensajes-api'
import { MensajesHeader } from './mensajes-header'
import { MensajesList } from './mensajes-list'
import { MensajesInput } from './mensajes-input'
import { MensajesBanner } from './mensajes-banner'
import { MensajesError } from './mensajes-error'
import { MensajesEmpty } from './mensajes-empty'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, X } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

interface MensajesContentProps {
  threadId: string
}

function SystemBanner({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mx-4 md:mx-0 bg-destructive/10 border border-destructive/20 p-4 rounded-xl flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
        <p className="text-sm text-destructive font-medium">{message}</p>
      </div>
      <button
        onClick={onDismiss}
        className="p-1 hover:bg-destructive/10 rounded-full transition-colors"
      >
        <X className="w-4 h-4 text-destructive" />
      </button>
    </motion.div>
  )
}

export function MensajesContent({ threadId }: MensajesContentProps) {
  const queryClient = useQueryClient()
  const containerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [systemMessage, setSystemMessage] = useState<string | null>(null)
  const [dismissedSystemMessages, setDismissedSystemMessages] = useState<Set<string>>(new Set())
  const { user } = useAuth()

  // Obtener metadata del thread
  const threadQuery = useQuery({
    queryKey: ['thread', threadId],
    queryFn: () => mensajesApi.getThread(threadId),
  })

  // Obtener mensajes del thread con polling basado en IntersectionObserver
  const messagesQuery = useQuery({
    queryKey: ['thread-messages', threadId],
    queryFn: () => mensajesApi.getThreadMessages(threadId),
    refetchInterval: false, // We control refetch manually via IntersectionObserver
  })

  // IntersectionObserver for polling when visible
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0 }
    )

    observer.observe(container)

    return () => {
      observer.disconnect()
    }
  }, [])

  // Polling when visible
  useEffect(() => {
    if (!isVisible) return

    const interval = setInterval(() => {
      queryClient.refetchQueries({ queryKey: ['thread-messages', threadId] })
    }, 10000) // 10 seconds

    return () => clearInterval(interval)
  }, [isVisible, threadId, queryClient])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messagesQuery.data])

  // Log del error al inicio del componente
  if (threadQuery.isError) {
    console.error('[MensajesContent] Error fetching thread:', threadQuery.error)
  }
  if (messagesQuery.isError) {
    console.error('[MensajesContent] Error fetching messages:', messagesQuery.error)
  }

  // Loading state
  if (threadQuery.isLoading || messagesQuery.isLoading) {
    return null
  }

  // Error state
  if (threadQuery.isError) {
    return (
      <MensajesError
        error={threadQuery.error instanceof Error ? threadQuery.error : new Error('Error desconocido')}
        onRetry={() => threadQuery.refetch()}
      />
    )
  }

  // El endpoint devuelve directamente el objeto sin wrapper
  const conversation: Conversation = threadQuery.data as Conversation

  if (!conversation) {
    return (
      <MensajesError
        error={new Error('Conversación no encontrada')}
        onRetry={() => threadQuery.refetch()}
      />
    )
  }

  // Obtener los mensajes y agregar la propiedad isFromCurrentUser
  // El endpoint de mensajes también devuelve directamente el array
  const rawMessages: Mensaje[] = messagesQuery.data?.data || messagesQuery.data || []
  
  // Extraer mensajes SYSTEM para el banner (derived state, no effect needed)
  const systemMessages = rawMessages.filter(
    (msg) => msg.messageType === 'SYSTEM' && !dismissedSystemMessages.has(msg.id)
  )
  const currentSystemMessage = systemMessage || (systemMessages[0]?.content || null)

  const mensajes = rawMessages.map((msg) => ({
    ...msg,
    isFromCurrentUser:
      (msg.senderProfileId === conversation.applicantProfileId && user?.id === conversation.applicantUserId) ||
      (msg.senderProfileId === conversation.organizerProfileId && user?.id === conversation.organizerUserId),
    timestamp: msg.createdAt,
    senderAvatar: msg.senderLogoUrl,
    isRead: !!msg.readAt,
  }))
  // Si el usuario actual es el applicant, el otro es el organizer
  // Si el usuario actual es el organizer, el otro es el applicant
  const isApplicant = user?.id === conversation.applicantUserId
  const otherParty = isApplicant
    ? {
        id: conversation.organizerProfileId,
        name: conversation.organizerName,
        logoUrl: conversation.organizerLogoUrl,
      }
    : {
        id: conversation.applicantProfileId,
        name: conversation.applicantName,
        logoUrl: conversation.applicantLogoUrl,
      }

  const handleDismissSystemMessage = (messageId: string) => {
    setDismissedSystemMessages((prev) => new Set(prev).add(messageId))
    setSystemMessage(null)
  }

  return (
    <div ref={containerRef} className="flex flex-col h-screen max-w-5xl mx-auto">
      {/* System Banner */}
      <AnimatePresence>
        {currentSystemMessage && (
          <SystemBanner
            message={currentSystemMessage}
            onDismiss={() => {
              const msg = systemMessages.find((m) => m.content === currentSystemMessage)
              if (msg) {
                handleDismissSystemMessage(msg.id)
              }
            }}
          />
        )}
      </AnimatePresence>

      {/* Success Banner (only for accepted applications when user is the applicant) */}
      {conversation.status === 'OPEN' && isApplicant && (
        <MensajesBanner empresa={otherParty.name} />
      )}

      {/* Fixed Header */}
      <div className="shrink-0">
        <MensajesHeader
          empresa={otherParty}
          eventTitle={conversation.applicationTitle}
        />
      </div>

      {/* Scrollable Messages */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {mensajes.length === 0 ? (
          <MensajesEmpty />
        ) : (
          <>
            <MensajesList mensajes={mensajes} />
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Fixed Input */}
      <div className="shrink-0">
        <MensajesInput threadId={threadId} />
      </div>
    </div>
  )
}
