'use client';

import { motion } from 'framer-motion';
import { BellOff } from 'lucide-react';

interface NotificacionesEmptyProps {
  hasSearch: boolean;
}

export function NotificacionesEmpty({ hasSearch }: NotificacionesEmptyProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="rounded-2xl border border-dashed border-border bg-card p-8 text-center"
    >
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <BellOff className="h-6 w-6 text-muted-foreground" />
      </div>
      <h2 className="mb-2 text-lg font-semibold text-foreground">
        {hasSearch ? 'No encontramos notificaciones' : 'No tenés notificaciones'}
      </h2>
      <p className="text-sm text-muted-foreground">
        {hasSearch
          ? 'Probá con otra búsqueda o borrá el filtro actual.'
          : 'Cuando haya novedades importantes para vos, van a aparecer acá.'}
      </p>
    </motion.div>
  );
}
