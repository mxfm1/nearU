'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, Shield, ArrowRight, HelpCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ApplyPendingProps {
  eventId: string;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export function ApplyPending({ eventId }: ApplyPendingProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-6"
          >
            {/* Status Badge */}
            <motion.div variants={staggerItem}>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                Estado de la Solicitud
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={staggerItem}
              className="text-3xl sm:text-4xl font-bold text-foreground leading-tight"
            >
              Evaluando tu solicitud
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={staggerItem}
              className="text-base text-muted-foreground leading-relaxed max-w-lg"
            >
              Estamos revisando tu perfil y portafolio para asegurar el mejor resultado. Te
              notificaremos pronto por email y a través de tu panel de control.
            </motion.p>

            {/* Info Cards */}
            <motion.div variants={staggerItem} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Tiempo estimado</p>
                  <p className="text-sm text-muted-foreground">24-48 horas</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Estado actual</p>
                  <p className="text-sm text-muted-foreground">Verificando</p>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div variants={staggerItem} className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button variant="outline" className="flex-1 sm:flex-none" asChild>
                <Link href={`/eventos/${eventId}`}>
                  Ver mi Perfil
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" className="flex-1 sm:flex-none" asChild>
                {/* <Link href="/soporte">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Contactar Soporte
                </Link> */}
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Content - Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-md">
              {/* Main Card */}
              <div className="relative bg-card rounded-2xl border border-border p-8 shadow-lg">
                {/* Evaluation Badge */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground shadow-sm">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Puntuando tu perfil
                  </span>
                </div>

                {/* Illustration Placeholder */}
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="relative mb-6">
                    {/* Magnifying Glass Icon */}
                    <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
                      <svg
                        className="w-20 h-20 text-primary"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                        <path d="M11 8v6" />
                        <path d="M8 11h6" />
                      </svg>
                    </div>
                    {/* Pulse Ring */}
                    <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                  </div>

                  <h3 className="text-lg font-bold text-foreground mb-2">EN PROGRESO</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    El sistema está analizando tu perfil
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-muted-foreground mb-2">
                    <span>Progreso</span>
                    <span>En curso...</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: '60%' }}
                      transition={{ duration: 2, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -z-10 top-4 right-4 w-full h-full bg-primary/5 rounded-2xl" />
              <div className="absolute -z-20 top-8 right-8 w-full h-full bg-primary/10 rounded-2xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
