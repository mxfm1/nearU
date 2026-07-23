'use client'

import { motion } from 'framer-motion'
import { ServerCrash } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface ApiErrorFallbackProps {
  reset?: () => void
}

export function ApiErrorFallback({ reset }: ApiErrorFallbackProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
    >
      <ServerCrash className="h-16 w-16 text-muted-foreground/40 mb-6" />
      <h2 className="text-2xl font-semibold text-foreground mb-2">
        Error del servidor
      </h2>
      <p className="text-muted-foreground max-w-md mb-8">
        Ocurrió un error inesperado. Por favor, intentá de nuevo más tarde.
      </p>
      <div className="flex items-center gap-4">
        {reset && (
          <Button variant="default" onClick={reset}>
            Intentar de nuevo
          </Button>
        )}
        <Button variant={reset ? 'outline' : 'default'} asChild>
          <Link href="/">Volver al inicio</Link>
        </Button>
      </div>
    </motion.div>
  )
}
