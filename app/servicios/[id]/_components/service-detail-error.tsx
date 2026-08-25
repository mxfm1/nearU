'use client';

import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ServiceDetailErrorProps {
  onRetry: () => void;
}

export function ServiceDetailError({ onRetry }: ServiceDetailErrorProps) {
  return (
    <main className="bg-background px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="mx-auto max-w-lg rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center"
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-7 w-7 text-destructive" />
        </div>
        <h1 className="text-2xl font-semibold text-foreground">No pudimos cargar el servicio</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Revisá tu conexión o intentá nuevamente en unos segundos.
        </p>
        <Button onClick={onRetry} className="mt-6">
          Reintentar
        </Button>
      </motion.div>
    </main>
  );
}
