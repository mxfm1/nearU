'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {  PersonStanding, X } from 'lucide-react'

const slideDown = {
  initial: { opacity: 0, y: -100 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: 'easeOut' },
}

interface MensajesBannerProps {
  empresa: string
}

export function MensajesBanner({ empresa }: MensajesBannerProps) {
  const [isVisible, setIsVisible] = useState(true)

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          {...slideDown}
          className="mx-4 md:mx-0 mt-4 md:mt-0 bg-primary/10 border border-primary/20 p-4 md:p-6 rounded-xl flex items-center justify-between shadow-lg"
        >
          <div className="flex items-center gap-3 md:gap-4">
            <div className="bg-primary/20 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shrink-0">
              <PersonStanding className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-semibold text-primary">
                ¡Felicidades!
              </h2>
              <p className="text-sm text-muted-foreground">
                Fuiste seleccionado para trabajar con{' '}
                <span className="font-semibold text-foreground">{empresa}</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="p-2 hover:bg-primary/10 rounded-full transition-colors shrink-0"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
