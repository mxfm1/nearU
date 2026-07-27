'use client';

import { motion } from 'framer-motion';
import { Search, Shield, Calendar } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Busca',
    description: 'Explora proveedores y servicios según la categoría que necesites.',
    icon: Search,
  },
  {
    number: '02',
    title: 'Conecta',
    description: 'Revisa perfiles, compara opciones y contacta directamente.',
    icon: Shield,
  },
  {
    number: '03',
    title: 'Organiza',
    description: 'Coordina, reserva y haz de tu evento un momento inolvidable.',
    icon: Calendar,
  },
];

const containerVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
};

const iconVariants = {
  initial: { scale: 0, rotate: -180 },
  animate: {
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 200,
      damping: 15,
      delay: 0.3,
    },
  },
};

export function HomeHowItWorks() {
  return (
    <section className="py-12 sm:py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3 sm:mb-4">
            ¿Cómo funciona?
          </h2>
          <p className="text-sm sm:text-base text-text-secondary max-w-2xl mx-auto">
            Tres pasos simples para encontrar y contratar los mejores proveedores.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative"
          variants={containerVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-50px' }}
        >
          {/* Connecting line - hidden on mobile */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.5 }}
            className="hidden md:block absolute top-8 left-[20%] right-[20%] h-0.5 origin-left"
          >
            <div className="w-full h-full border-t-2 border-dashed border-brand-300" />
          </motion.div>

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div key={index} variants={itemVariants} className="text-center relative">
                {/* Icon circle */}
                <motion.div
                  variants={iconVariants}
                  className="w-14 h-14 sm:w-16 sm:h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 relative z-10"
                >
                  <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-brand-500" />
                </motion.div>

                {/* Step number and title */}
                <div className="mb-2 sm:mb-3">
                  <h3 className="text-base sm:text-lg font-bold text-text-primary">
                    <span className="text-brand-600">{step.number}. </span>
                    {step.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-text-secondary max-w-xs mx-auto">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
