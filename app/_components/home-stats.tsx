'use client'

import { motion } from 'framer-motion'
import { Shield, Calendar, Star } from 'lucide-react'

const stats = [
  {
    icon: Shield,
    number: '500+',
    label: 'Proveedores verificados',
  },
  {
    icon: Calendar,
    number: '1.200+',
    label: 'Eventos realizados',
  },
  {
    icon: Star,
    number: '98%',
    label: 'Satisfacción de clientes',
  },
]

const containerVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

export function HomeStats() {
  return (
    <section className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6"
          variants={containerVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-50px' }}
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-card rounded-xl border border-border p-4 sm:p-6 shadow-sm flex items-center gap-3 sm:gap-4"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-50 rounded-full flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-brand-500" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-text-primary">{stat.number}</div>
                  <div className="text-xs sm:text-sm text-text-secondary">{stat.label}</div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
