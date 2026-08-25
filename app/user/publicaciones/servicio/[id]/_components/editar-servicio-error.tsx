'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EditarServicioErrorProps {
  message: string;
  onRetry?: () => void;
}

export function EditarServicioError({ message, onRetry }: EditarServicioErrorProps) {
  return (
    <section className="min-h-screen bg-background px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-xl rounded-2xl border bg-card p-8 text-center shadow-sm"
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">No pudimos cargar el servicio</h1>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {onRetry ? (
            <Button onClick={onRetry} className="bg-brand text-white hover:bg-brand/90">
              Reintentar
            </Button>
          ) : null}
          <Button asChild variant="outline">
            <Link href="/user/publicaciones">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a publicaciones
            </Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
