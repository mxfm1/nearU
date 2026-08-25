'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function EditarServicioEmpty() {
  return (
    <section className="min-h-screen bg-background px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-xl rounded-2xl border bg-card p-8 text-center shadow-sm"
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Search className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Servicio no encontrado</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          El servicio que intentás editar no existe o ya no está disponible.
        </p>
        <Button asChild className="mt-6 bg-brand text-white hover:bg-brand/90">
          <Link href="/user/publicaciones">Volver a mis publicaciones</Link>
        </Button>
      </motion.div>
    </section>
  );
}
