'use client';

import { motion } from 'framer-motion';

export function SolicitudesSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="space-y-8"
    >
      {Array.from({ length: 2 }).map((_, sectionIndex) => (
        <section key={sectionIndex} className="space-y-3">
          <div className="h-6 w-40 animate-pulse rounded bg-muted" />
          <div className="grid gap-3">
            {Array.from({ length: 2 }).map((__, cardIndex) => (
              <div key={cardIndex} className="rounded-xl border bg-card p-5">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="h-5 w-56 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-32 animate-pulse rounded bg-muted" />
                  </div>
                  <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full animate-pulse rounded bg-muted" />
                  <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </motion.div>
  );
}
