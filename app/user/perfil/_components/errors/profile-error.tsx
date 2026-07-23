'use client'

import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ProfileErrorProps {
  message?: string
  onRetry?: () => void
}

export function ProfileError({ message = 'Error al cargar el perfil', onRetry }: ProfileErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="flex items-center gap-2 text-amber-600 mb-4">
        <AlertTriangle className="h-5 w-5" />
        <span className="text-sm font-medium">{message}</span>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  )
}
