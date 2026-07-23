'use client'

import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CrearEventoErrorProps {
  message?: string
  onRetry?: () => void
}

export function CrearEventoError({
  message = 'Error al cargar los datos necesarios',
  onRetry,
}: CrearEventoErrorProps) {
  return (
    <section className="min-h-screen bg-background">
      <div className="section-container pt-20 pb-12 md:pt-28 md:pb-16">
        <div className="max-w-md mx-auto">
          <div className="card-base rounded-xl p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="h-7 w-7 text-destructive" />
              </div>
            </div>

            <h2 className="text-xl font-bold text-foreground mb-2">
              No se pudieron cargar los datos
            </h2>

            <p className="text-sm text-muted-foreground mb-6">
              {message}
            </p>

            {onRetry && (
              <Button onClick={onRetry} className="bg-brand hover:bg-brand/90">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reintentar
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
