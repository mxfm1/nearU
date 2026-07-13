'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Megaphone } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HomeCta() {
  return (
    <section className="py-8 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative bg-gradient-brand rounded-2xl p-6 sm:p-8 md:p-12 overflow-hidden"
        >
          {/* Lighter green gradient at top */}
          <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/10 to-transparent" />
          
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
            {/* Left content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
              className="flex items-center gap-3 sm:gap-4"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                <Megaphone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
                  ¿Ofreces servicios para eventos?
                </h3>
                <p className="text-sm sm:text-base text-white/80">
                  Regístrate y publica tu empresa para llegar a miles de personas que organizan eventos cada día.
                </p>
              </div>
            </motion.div>
            
            {/* Right buttons */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full md:w-auto"
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  asChild
                  className="bg-white text-primary hover:bg-white/90 font-semibold px-6 py-3 rounded-lg shadow-brand hover:shadow-brand-lg transition-shadow w-full sm:w-auto"
                >
                  <Link href="/register">Publicar mi empresa</Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  asChild
                  className="bg-white/10 border-2 border-white text-white hover:bg-white/20 font-semibold px-6 py-3 rounded-lg transition-colors w-full sm:w-auto"
                >
                  <Link href="/search">Explorar proveedores</Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
