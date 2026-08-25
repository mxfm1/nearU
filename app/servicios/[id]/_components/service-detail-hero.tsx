'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { BriefcaseBusiness } from 'lucide-react';
import type { ServicioDetalle } from '@/types/contracts/services';
import { getProviderName } from './service-detail-utils';

interface ServiceDetailHeroProps {
  service: ServicioDetalle;
}

export function ServiceDetailHero({ service }: ServiceDetailHeroProps) {
  const imageSrc = service.bannerUrl ?? service.thumbnailUrl;
  const providerName = getProviderName(service);

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative min-h-[280px] overflow-hidden bg-primary sm:min-h-[360px] lg:min-h-[460px]"
    >
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="(min-width: 1280px) 1200px, calc(100vw - 2rem)"
        />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_hsl(var(--primary)/0.35),_transparent_38%),linear-gradient(135deg,_hsl(var(--primary)),_hsl(var(--brand)))]" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-8 lg:p-10">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/85">
          <BriefcaseBusiness className="h-4 w-4" />
          <span>{service.category?.name ?? 'Servicio profesional'}</span>
        </div>
        <h1 className="max-w-4xl text-3xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          {service.title ?? 'Servicio'}
        </h1>
        <p className="mt-3 max-w-2xl text-base text-white/90 sm:text-lg">
          {providerName}
          {service.category?.name ? ` • ${service.category.name}` : ''}
        </p>
      </div>
    </motion.section>
  );
}
