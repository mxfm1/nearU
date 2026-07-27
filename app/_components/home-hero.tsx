'use client';

import { motion } from 'framer-motion';
import { HomeSearchBar } from './home-search-bar';
import { HomeCategories } from './home-categories';
import { Users, Star } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const fadeInRight = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function HomeHero() {
  return (
    <section className="bg-gradient-hero pt-20 pb-12 sm:pt-24 sm:pb-16 md:pt-32 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main grid - text left, image right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left content */}
          <motion.div
            className="space-y-5 sm:space-y-6"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.h1
              variants={fadeInUp}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-text-primary"
            >
              Encuentra los mejores <span className="text-primary">proveedores</span> para tu evento
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
              className="text-base sm:text-lg text-text-secondary max-w-xl"
            >
              Conecta con empresas confiables de calidad, producción, iluminación y más para eventos
              inolvidables, fáciles y exitosos.
            </motion.p>

            {/* Search bar */}
            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            >
              <HomeSearchBar />
            </motion.div>

            {/* Category chips below search */}
            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
            >
              <HomeCategories />
            </motion.div>
          </motion.div>

          {/* Right image with floating cards */}
          <motion.div
            className="relative flex justify-center lg:justify-end order-first lg:order-last"
            initial="initial"
            animate="animate"
          >
            {/* Image container */}
            <motion.div
              variants={fadeInRight}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              className="relative w-full max-w-xs sm:max-w-sm md:max-w-md overflow-hidden rounded-xl shadow-lg"
            >
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=750&fit=crop&crop=faces"
                alt="Professional woman smiling"
                width={400}
                height={500}
                className="w-full h-auto object-cover"
              />
            </motion.div>

            {/* Floating card - empresas verificadas */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.8 }}
              className="absolute top-4 sm:top-8 -left-2 sm:-left-4 lg:-left-8 bg-card rounded-xl p-3 sm:p-4 shadow-float z-10"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-brand-200 border-2 border-card flex items-center justify-center">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4 text-brand-700" />
                  </div>
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-brand-300 border-2 border-card flex items-center justify-center">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4 text-brand-800" />
                  </div>
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-brand-400 border-2 border-card flex items-center justify-center">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-text-primary">+1,200</div>
                  <div className="text-[10px] sm:text-xs text-text-secondary">
                    Empresas verificadas
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Rating card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 1 }}
              className="absolute bottom-4 sm:bottom-8 -right-2 sm:-right-4 lg:-right-8 bg-card rounded-xl p-3 sm:p-4 shadow-float z-10"
            >
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-text-primary">5.0</div>
                <div className="flex items-center justify-center gap-0.5 sm:gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-brand-500 text-brand-500" />
                  ))}
                </div>
                <div className="text-[10px] sm:text-xs text-text-secondary mt-1">
                  Calificación promedio
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
