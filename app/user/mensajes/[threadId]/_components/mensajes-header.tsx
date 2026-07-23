'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { User, Building2, ArrowLeft } from 'lucide-react'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

interface Empresa {
  id: string
  name: string
  logoUrl: string | null
}

interface MensajesHeaderProps {
  empresa: Empresa
  eventTitle: string
}

export function MensajesHeader({ empresa, eventTitle }: MensajesHeaderProps) {
  const router = useRouter()

  return (
    <motion.div
      {...fadeInUp}
      className="px-4 md:px-6 py-4 bg-card border-b border-border flex items-center justify-between"
    >
      <div className="flex items-center gap-3 md:gap-4">
        <button
          onClick={() => router.push('/user/mensajes')}
          className="p-2 hover:bg-muted rounded-full transition-colors"
          title="Volver a conversaciones"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="relative">
          {empresa.logoUrl ? (
            <img
              src={empresa.logoUrl}
              alt={empresa.name}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-primary/20"
            />
          ) : (
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
              <Building2 className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </div>
          )}
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
        </div>
        <div>
          <h3 className="text-base md:text-lg font-semibold text-primary">
            {empresa.name}
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground">
            {eventTitle}
          </p>
        </div>
      </div>
      <button className="flex items-center gap-2 px-3 md:px-4 py-2 bg-card border border-primary/20 rounded-full text-xs md:text-sm font-medium text-primary hover:bg-primary/5 transition-colors">
        <User className="w-4 h-4" />
        <span className="hidden sm:inline">Ver Perfil</span>
      </button>
    </motion.div>
  )
}
