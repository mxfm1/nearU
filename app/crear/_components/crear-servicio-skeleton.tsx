'use client'

import { motion } from 'framer-motion'

const steps = [
  { id: 'brand-essentials', label: 'Información General', number: '01' },
  { id: 'portfolio-narrative', label: 'Detalles del servicio', number: '02' },
  { id: 'service-details', label: 'Contacto', number: '03' },
]

export function CrearServicioSkeleton() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="w-full lg:w-64 shrink-0">
          <div className="sticky top-28 space-y-6">
            <div>
              <div className="h-8 w-32 bg-muted rounded animate-pulse mb-2" />
              <div className="h-4 w-48 bg-muted rounded animate-pulse" />
            </div>
            <div className="space-y-2">
              {steps.map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg">
                  <div className="h-6 w-6 bg-muted rounded-full animate-pulse" />
                  <div className="h-4 flex-1 bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-8">
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

                {section === 2 && (
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2].map((f) => (
                      <div key={f} className="space-y-2">
                        <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                        <div className="h-10 bg-muted rounded-md animate-pulse" />
                      </div>
                    ))}
                  </div>
                )}

                {section === 3 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                      <div className="h-6 w-6 bg-muted rounded animate-pulse" />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
