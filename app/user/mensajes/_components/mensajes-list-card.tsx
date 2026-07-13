'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { MoreVertical, Building2 } from 'lucide-react'
import type { ConversationListItem } from '@/lib/mensajes-api'

const container = {
  animate: { transition: { staggerChildren: 0.05 } },
}

const item = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

interface MensajesListCardProps {
  conversation: ConversationListItem
  index: number
}

function formatRelativeTime(dateString: string | null): string {
  if (!dateString) return ''

  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return 'Ahora'
  if (diffMins < 60) return `Hace ${diffMins} min`
  if (diffHours < 24) return `Hace ${diffHours} h`
  if (diffDays === 1) return 'Ayer'
  if (diffDays < 7) return `Hace ${diffDays} días`
  
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
  })
}

export function MensajesListCard({ conversation, index }: MensajesListCardProps) {
  const isUnread = conversation.unreadCount > 0
  const isOpen = conversation.status === 'OPEN'

  // Para el usuario actual (applicant), el "otro" es el organizer
  const otherPartyName = conversation.organizerName
  const otherPartyLogo = conversation.organizerLogoUrl

  return (
    <motion.div
      variants={item}
      initial="initial"
      animate="animate"
    >
      <Link href={`/user/mensajes/${conversation.id}`}>
        <div
          className={`
            flex items-center gap-4 p-4 md:p-5 rounded-xl transition-all cursor-pointer
            ${isUnread 
              ? 'bg-card shadow-md border-l-4 border-primary hover:bg-muted/50' 
              : 'bg-card/70 hover:bg-muted border border-transparent hover:border-border'
            }
          `}
        >
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {otherPartyLogo ? (
              <img
                src={otherPartyLogo}
                alt={otherPartyName}
                className={`w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 ${
                  isUnread ? 'border-primary/30' : 'border-border'
                }`}
              />
            ) : (
              <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/10 flex items-center justify-center border-2 ${
                isUnread ? 'border-primary/30' : 'border-border'
              }`}>
                <Building2 className="w-6 h-6 text-primary" />
              </div>
            )}
            {isUnread && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary border-2 border-card rounded-full" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-1">
              <h3 className={`text-sm md:text-base font-semibold truncate pr-4 ${
                isUnread ? 'text-foreground' : 'text-foreground'
              }`}>
                {otherPartyName}
              </h3>
              <span className={`text-xs whitespace-nowrap ${
                isUnread ? 'text-primary font-bold' : 'text-muted-foreground'
              }`}>
                {formatRelativeTime(conversation.lastMessageAt || conversation.updatedAt)}
              </span>
            </div>
            
            <p className={`text-sm truncate ${
              isUnread ? 'text-foreground font-medium' : 'text-muted-foreground'
            }`}>
              {conversation.applicationTitle}
            </p>

            {/* Status Badge */}
            <div className="flex gap-2 mt-2">
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                isOpen 
                  ? 'bg-primary/10 text-primary' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {isOpen ? 'Postulación Aceptada' : 'Cerrado'}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col items-end gap-3">
            <button 
              onClick={(e) => e.preventDefault()}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            {isUnread && (
              <div className="w-2 h-2 bg-primary rounded-full" />
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
