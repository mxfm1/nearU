'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ServiceDetailEmpty() {
  return (
    <main className="bg-background px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="mx-auto max-w-lg rounded-2xl border border-dashed bg-card p-8 text-center"
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <SearchX className="h-7 w-7 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-semibold text-foreground">Servicio no disponible</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          No encontramos información publicada para este servicio.
        </p>
        <Button asChild className="mt-6">
          <Link href="/explorar?scope=services">Explorar servicios</Link>
        </Button>
      </motion.div>
    </main>
  );
}
