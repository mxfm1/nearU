'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SolicitudesEmpty() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="rounded-2xl border border-dashed bg-card p-8 text-center"
    >
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <ClipboardList className="h-6 w-6 text-muted-foreground" />
      </div>
      <h2 className="text-lg font-semibold text-foreground">Todavía no tenés solicitudes</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Cuando envíes peticiones de validación, reportes o consultas, van a aparecer acá.
      </p>
      <Button asChild className="mt-6 bg-emerald-700 text-white hover:bg-emerald-800">
        <Link href="/user/perfil">Ir a mi perfil</Link>
      </Button>
    </motion.div>
  );
}
