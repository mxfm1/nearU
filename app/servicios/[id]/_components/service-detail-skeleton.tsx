'use client';

import { motion } from 'framer-motion';

export function ServiceDetailSkeleton() {
  return (
    <main className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="h-[280px] animate-pulse rounded-xl bg-muted sm:h-[360px] lg:h-[460px]"
        />

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="rounded-xl border bg-card p-5 shadow-sm">
                  <div className="mx-auto mb-3 h-11 w-11 animate-pulse rounded-full bg-muted" />
                  <div className="mx-auto mb-2 h-3 w-20 animate-pulse rounded bg-muted" />
                  <div className="mx-auto h-5 w-28 animate-pulse rounded bg-muted" />
                </div>
              ))}
            </div>

            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="mb-4 h-6 w-48 animate-pulse rounded bg-muted" />
                <div className="space-y-3">
                  <div className="h-4 w-full animate-pulse rounded bg-muted" />
                  <div className="h-4 w-11/12 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="mb-5 h-5 w-32 animate-pulse rounded bg-muted" />
            <div className="mb-5 flex items-center gap-3">
              <div className="h-12 w-12 animate-pulse rounded-full bg-muted" />
              <div className="space-y-2">
                <div className="h-4 w-36 animate-pulse rounded bg-muted" />
                <div className="h-3 w-24 animate-pulse rounded bg-muted" />
              </div>
            </div>
            <div className="h-11 w-full animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>
    </main>
  );
}
