'use client'

import { motion } from 'framer-motion'
import { SearchX } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function NotFoundFallback() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
    >
      <SearchX className="h-16 w-16 text-muted-foreground/40 mb-6" />
      <h2 className="text-2xl font-semibold text-foreground mb-2">
        Upss, no encontramos este recurso
      </h2>
      <p className="text-muted-foreground max-w-md mb-8">
        El recurso que buscas no existe o ha sido eliminado.
      </p>
      <Button asChild>
        <Link href="/">Volver al inicio</Link>
      </Button>
    </motion.div>
  )
}
