'use client';

import { motion } from 'framer-motion';

export function CrearEventoSkeleton() {
  return (
    <section className="min-h-screen bg-background">
      <div className="section-container pt-20 pb-12 md:pt-28 md:pb-16">
        <div className="mb-6 md:mb-8">
          <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
          <div className="h-4 w-72 bg-muted rounded animate-pulse" />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 md:mb-8">
          {['General', 'Evento', 'Requisitos'].map((_, i) => (
            <div key={i} className="h-9 w-20 bg-muted rounded-full animate-pulse" />
          ))}
        </div>

        <div className="space-y-10">
          {[1, 2, 3].map((section) => (
            <motion.div
              key={section}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: section * 0.1 }}
              className="card-base rounded-xl p-6"
            >
              <div className="h-4 w-32 bg-muted rounded animate-pulse mb-6 border-b border-border pb-3" />

              <div className="space-y-5">
                {[1, 2, 3].map((field) => (
                  <div key={field} className="space-y-2">
                    <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                    <div className="h-10 w-full bg-muted rounded-md animate-pulse" />
                  </div>
                ))}

                {section === 1 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="h-32 bg-muted rounded-xl animate-pulse" />
                    <div className="h-32 bg-muted rounded-xl animate-pulse" />
                  </div>
                )}

                {section === 2 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3.5 bg-muted/30 rounded-xl">
                      <div className="space-y-1">
                        <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                        <div className="h-3 w-48 bg-muted rounded animate-pulse" />
                      </div>
                      <div className="h-6 w-11 bg-muted rounded-full animate-pulse" />
                    </div>
                    <div className="flex items-center justify-between p-3.5 bg-muted/30 rounded-xl">
                      <div className="space-y-1">
                        <div className="h-4 w-36 bg-muted rounded animate-pulse" />
                        <div className="h-3 w-44 bg-muted rounded animate-pulse" />
                      </div>
                      <div className="h-6 w-11 bg-muted rounded-full animate-pulse" />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-3 mt-8 pt-6">
          <div className="h-10 w-36 bg-muted rounded-xl animate-pulse" />
          <div className="h-10 w-32 bg-muted rounded-xl animate-pulse" />
        </div>
      </div>
    </section>
  );
}
