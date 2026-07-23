'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function CrearPageContent() {
  const router = useRouter()
  const [isPendingEvent, startTransitionEvent] = useTransition()
  const [isPendingService, startTransitionService] = useTransition()

  function handleNavigateEvent() {
    startTransitionEvent(() => {
      router.push('/crear/evento')
    })
  }

  function handleNavigateService() {
    startTransitionService(() => {
      router.push('/crear/servicio')
    })
  }

  return (
    <section className="px-4 pt-24 pb-20 md:pt-32 md:pb-28">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-[40px] font-semibold leading-[1.2] text-foreground mb-4 md:text-[52px] md:leading-[1.15]">
            Que quieres publicar?
          </h1>
          <p className="text-[18px] leading-[1.7] text-muted-foreground max-w-2xl mx-auto md:text-[20px]">
            Publica tu servicio o evento en nuestra plataforma, permitiendote conectar con otras personas
          </p>
        </div>

        {/* Cards */}
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          {/* Create Event Card */}
          <motion.button
            onClick={handleNavigateEvent}
            disabled={isPendingEvent || isPendingService}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={cn(
              'flex-1 p-8 rounded-xl border bg-card text-left transition-all duration-300',
              'hover:shadow-lg hover:border-primary/30',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'group'
            )}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="w-10 h-10 rounded-lg border border-border bg-muted/50 flex items-center justify-center">
                <Plus className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-3">
              Crear un Evento
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Define toda la información relevante de tu evento
            </p>
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
              Siguiente
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </motion.button>

          {/* Create Service Card */}
          <motion.button
            onClick={handleNavigateService}
            disabled={isPendingEvent || isPendingService}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={cn(
              'flex-1 p-8 rounded-xl border bg-card text-left transition-all duration-300',
              'hover:shadow-lg hover:border-primary/30',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'group'
            )}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="w-10 h-10 rounded-lg border border-border bg-muted/50 flex items-center justify-center">
                <Plus className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-3">
              Crear Servicio
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Define toda la información relevante de tu negocio para conectar con otras personas
            </p>
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
              Siguiente
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </motion.button>
        </div>

        {/* Bottom Guidance */}
        {/* <div className="text-center">
          <p className="text-sm text-muted-foreground">
            NEED GUIDANCE?{' '}
            <button className="text-foreground font-medium hover:underline transition-colors">
              Review the Creator Handbook
            </button>
          </p>
        </div> */}
      </div>
    </section>
  )
}
