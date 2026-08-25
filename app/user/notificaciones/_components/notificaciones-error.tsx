'use client';

import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NotificacionesErrorProps {
  onRetry: () => void;
}

export function NotificacionesError({ onRetry }: NotificacionesErrorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-center"
    >
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="h-6 w-6 text-destructive" />
      </div>
      <h2 className="mb-2 text-lg font-semibold text-foreground">
        No pudimos cargar tus notificaciones
      </h2>
      <p className="mb-4 text-sm text-muted-foreground">
        Revisá tu conexión o intentá de nuevo en unos segundos.
      </p>
      <Button variant="outline" onClick={onRetry}>
        Reintentar
      </Button>
    </motion.div>
  );
}
