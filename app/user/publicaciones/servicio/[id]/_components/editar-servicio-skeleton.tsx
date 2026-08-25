'use client';

import { motion } from 'framer-motion';

export function EditarServicioSkeleton() {
  return (
    <section className="min-h-screen bg-background px-4 py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[16rem_minmax(0,1fr)]"
      >
        <div className="space-y-4">
          <div className="h-8 w-44 rounded-md bg-muted" />
          <div className="h-4 w-56 rounded-md bg-muted" />
          <div className="space-y-2 pt-4">
            <div className="h-12 rounded-lg bg-muted" />
            <div className="h-12 rounded-lg bg-muted" />
            <div className="h-12 rounded-lg bg-muted" />
          </div>
        </div>
        <div className="space-y-6">
          <div className="h-40 rounded-xl bg-muted" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="h-24 rounded-xl bg-muted" />
            <div className="h-24 rounded-xl bg-muted" />
          </div>
          <div className="h-56 rounded-xl bg-muted" />
        </div>
      </motion.div>
    </section>
  );
}
