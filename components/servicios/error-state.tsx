'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, SearchX, Lock, ServerCrash, WifiOff, Ban } from 'lucide-react'

interface ErrorStateProps {
  error: string
}

const errorMessages: Record<string, { title: string; message: string; icon: typeof AlertTriangle }> = {
  NOT_FOUND: {
    title: 'Servicio no encontrado',
    message: 'El servicio que buscas no existe o ha sido eliminado.',
    icon: SearchX,
  },
  UNAUTHORIZED: {
    title: 'Acceso no autorizado',
    message: 'Debes iniciar sesión para ver este servicio.',
    icon: Lock,
  },
  FORBIDDEN: {
    title: 'Acceso denegado',
    message: 'No tienes permisos para acceder a este servicio.',
    icon: Ban,
  },
  SERVICE_UNAVAILABLE: {
    title: 'Servicio no disponible',
    message: 'El servicio no está disponible en este momento. Intenta más tarde.',
    icon: ServerCrash,
  },
  NETWORK_ERROR: {
    title: 'Error de conexión',
    message: 'No pudimos conectarnos al servidor. Revisa tu conexión a internet.',
    icon: WifiOff,
  },
  RATE_LIMITED: {
    title: 'Demasiadas solicitudes',
    message: 'Has realizado demasiadas solicitudes. Espera unos minutos e intenta de nuevo.',
    icon: AlertTriangle,
  },
}

const defaultError = {
  title: 'Algo salió mal',
  message: 'Ocurrió un error inesperado. Por favor, intenta de nuevo más tarde.',
  icon: AlertTriangle,
}

export function ErrorState({ error }: ErrorStateProps) {
  const config = errorMessages[error] ?? defaultError
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
    >
      <Icon className="h-16 w-16 text-muted-foreground/40 mb-6" />
      <h2 className="text-2xl font-semibold text-foreground mb-2">
        {config.title}
      </h2>
      <p className="text-muted-foreground max-w-md">{config.message}</p>
    </motion.div>
  )
}
