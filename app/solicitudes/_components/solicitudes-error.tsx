'use client';

import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SolicitudesErrorProps {
  onRetry: () => void;
}

export function SolicitudesError({ onRetry }: SolicitudesErrorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="rounded-2xl border border-destructive/20 bg-destructive/10 p-8 text-center"
    >
      <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-destructive" />
      <h2 className="text-lg font-semibold text-foreground">No pudimos cargar tus solicitudes</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Hubo un problema consultando tus peticiones. Intentá nuevamente.
      </p>
      <Button onClick={onRetry} className="mt-6 bg-brand text-white hover:bg-brand/90">
        Reintentar
      </Button>
    </motion.div>
  );
}
