'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Clapperboard, 
  Camera, 
  Music, 
  UtensilsCrossed, 
  Lightbulb, 
  Paintbrush, 
  Play, 
  Truck 
} from 'lucide-react'

const largeCategories = [
  {
    name: 'Producción',
    slug: 'produccion',
    icon: Clapperboard,
    image: 'https://placehold.co/600x400/1A2E23/FFFFFF?text=Producción',
    isPremium: true,
  },
  {
    name: 'Fotografía',
    slug: 'fotografia',
    icon: Camera,
    image: 'https://placehold.co/600x400/2D5A3D/FFFFFF?text=Fotografía',
    isPremium: true,
  },
]

const smallCategories = [
  {
    name: 'Sonido',
    slug: 'sonido',
    icon: Music,
    image: 'https://placehold.co/300x300/0F2A1A/FFFFFF?text=Sonido',
    isPremium: true,
  },
  {
    name: 'Catering',
    slug: 'catering',
    icon: UtensilsCrossed,
    image: 'https://placehold.co/300x300/1A3A2A/FFFFFF?text=Catering',
    isPremium: true,
  },
  {
    name: 'Iluminación',
    slug: 'iluminacion',
    icon: Lightbulb,
    image: 'https://placehold.co/300x300/2D4A3A/FFFFFF?text=Iluminación',
    isPremium: true,
  },
  {
    name: 'Decoración',
    slug: 'decoracion',
    icon: Paintbrush,
    image: 'https://placehold.co/300x300/1B4332/FFFFFF?text=Decoración',
    isPremium: true,
  },
  {
    name: 'Animación',
    slug: 'animacion',
    icon: Play,
    image: 'https://placehold.co/300x300/3D5A4D/FFFFFF?text=Animación',
    isPremium: true,
  },
  {
    name: 'Transporte',
    slug: 'transporte',
    icon: Truck,
    image: 'https://placehold.co/300x300/4A6B5A/FFFFFF?text=Transporte',
    isPremium: true,
  },
]

const containerVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
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

export function HomeCategoryGrid() {
  return (
    <section className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2 sm:gap-4 mb-6 sm:mb-8"
        >
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-1 sm:mb-2">
              Explora por categoría
            </h2>
            <p className="text-sm sm:text-base text-text-secondary">
              Encuentra servicios y especialistas para cada detalle de tu evento.
            </p>
          </div>
          <Link
            href="/search"
            className="text-primary font-semibold hover:text-primary/80 transition-colors flex items-center gap-1 text-sm sm:text-base"
          >
            Ver todas →
          </Link>
        </motion.div>

        {/* Large cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6"
          variants={containerVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-50px' }}
        >
          {largeCategories.map((category) => {
            const Icon = category.icon
            return (
              <motion.div
                key={category.slug}
                variants={itemVariants}
              >
                <Link
                  href={`/search?category=${category.slug}`}
                  className="group relative block aspect-[4/3] sm:aspect-[3/2] rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300"
                >
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  {/* Icon top-left */}
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                  </div>
                  {/* Content bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2">{category.name}</h3>
                    {category.isPremium && (
                      <span className="inline-block bg-brand text-white rounded-md px-2 py-1 text-[10px] sm:text-xs font-semibold">
                        Premium
                      </span>
                    )}
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Small cards */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4"
          variants={containerVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-50px' }}
        >
          {smallCategories.map((category) => {
            const Icon = category.icon
            return (
              <motion.div
                key={category.slug}
                variants={itemVariants}
              >
                <Link
                  href={`/search?category=${category.slug}`}
                  className="group relative block aspect-square rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300"
                >
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  {/* Icon top-left */}
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                  </div>
                  {/* Content bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                    <h3 className="text-xs sm:text-sm font-bold text-white mb-0.5 sm:mb-1">{category.name}</h3>
                    {category.isPremium && (
                      <span className="inline-block bg-brand text-white rounded px-1 sm:px-1.5 py-0.5 text-[8px] sm:text-[10px] font-semibold">
                        Premium
                      </span>
                    )}
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
