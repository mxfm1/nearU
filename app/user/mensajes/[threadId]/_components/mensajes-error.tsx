'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw } from 'lucide-react'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' },
}

interface MensajesErrorProps {
  error: Error
  onRetry: () => void
}

export function MensajesError({ error, onRetry }: MensajesErrorProps) {
  return (
    <motion.div
      {...fadeInUp}
      className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4"
    >
      <div className="text-center max-w-md">
        <div className="mb-4 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-7 w-7 text-destructive" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">
          Error al cargar
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          {error.message || 'No se pudieron cargar los mensajes.'}
        </p>
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Reintentar
        </button>
      </div>
    </motion.div>
  )
}
