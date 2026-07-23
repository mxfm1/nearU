'use client'

import { AlertCircle, RefreshCw, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorDisplayProps {
  message?: string
  onRetry?: () => void
  retryLabel?: string
  className?: string
}

export function ErrorDisplay({
  message = 'Error al cargar los datos',
  onRetry,
  retryLabel = 'Reintentar',
  className = '',
}: ErrorDisplayProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
      <div className="flex items-center gap-2 text-destructive mb-4">
        <AlertCircle className="h-5 w-5" />
        <span className="text-sm font-medium">{message}</span>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw className="h-4 w-4 mr-2" />
          {retryLabel}
        </Button>
      )}
    </div>
  )
}

interface LoadingDisplayProps {
  message?: string
  className?: string
}

export function LoadingDisplay({
  message = 'Cargando...',
  className = '',
}: LoadingDisplayProps) {
  return (
    <div className={`flex items-center justify-center py-12 px-4 ${className}`}>
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mr-2" />
      <span className="text-muted-foreground">{message}</span>
    </div>
  )
}
