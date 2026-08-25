'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  CalendarClock,
  Images,
  MapPin,
  MonitorSmartphone,
  Sparkles,
  WalletCards,
} from 'lucide-react';
import type { ServicioDetalle } from '@/types/contracts/services';
import { cn } from '@/lib/utils';
import {
  formatAvailability,
  formatAvailabilityBadge,
  formatExperience,
  formatModality,
  formatPriceRange,
  getPortfolioImages,
  splitParagraphs,
} from './service-detail-utils';

interface ServiceDetailMainProps {
  service: ServicioDetalle;
}

export function ServiceDetailMain({ service }: ServiceDetailMainProps) {
  const availability = formatAvailability(service);
  const availabilityBadge = formatAvailabilityBadge(service.availability);
  const price = formatPriceRange(service.priceMin, service.priceMax);
  const location = service.location?.name;
  const descriptionParagraphs = splitParagraphs(service.description);
  const modality = formatModality(service.modality);
  const experience = formatExperience(service.yearsExperience);
  const portfolio = getPortfolioImages(service.portfolio);
  const detailRows = [
    service.category?.name ? { label: 'Categoría', value: service.category.name } : null,
    modality ? { label: 'Modalidad', value: modality } : null,
    experience ? { label: 'Experiencia', value: experience } : null,
    availability ? { label: 'Disponibilidad', value: availability } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="space-y-6 lg:space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05, ease: 'easeOut' }}
        className="grid gap-4 sm:grid-cols-3"
      >
        <StatCard
          icon={CalendarClock}
          label="Disponibilidad"
          value={availabilityBadge ?? availability}
        />
        <StatCard icon={WalletCards} label="Rango de precios" value={price ? `$${price}` : null} />
        <StatCard icon={MapPin} label="Ubicación" value={location} />
      </motion.div>

      {descriptionParagraphs.length > 0 && (
        <Section title="Sobre el servicio">
          <div className="space-y-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {descriptionParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </Section>
      )}

      {detailRows.length > 0 && (
        <Section title="Detalles del servicio">
          <div className="grid gap-3 sm:grid-cols-2">
            {detailRows.map((row) => (
              <div key={row.label} className="flex items-start gap-3 rounded-xl bg-muted/40 p-4">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {row.label === 'Modalidad' ? (
                    <MonitorSmartphone className="h-4 w-4" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                    {row.label}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{row.value}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Images className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Galería de trabajos
          </h2>
        </div>

        {portfolio.length > 0 ? (
          <motion.div
            initial="initial"
            animate="animate"
            variants={{ animate: { transition: { staggerChildren: 0.06 } } }}
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
          >
            {portfolio.map((image) => (
              <motion.figure
                key={image.id ?? image.url}
                variants={{ initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="group overflow-hidden rounded-xl border bg-card shadow-sm"
              >
                <div className="relative aspect-[4/3] bg-muted">
                  <Image
                    src={image.url}
                    alt={image.title ?? 'Trabajo realizado'}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  />
                </div>
                {(image.title || image.description) && (
                  <figcaption className="space-y-1 p-4">
                    {image.title && (
                      <h3 className="font-semibold text-foreground">{image.title}</h3>
                    )}
                    {image.description && (
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {image.description}
                      </p>
                    )}
                  </figcaption>
                )}
              </motion.figure>
            ))}
          </motion.div>
        ) : (
          <div className="rounded-xl border border-dashed bg-card p-8 text-center text-sm text-muted-foreground">
            Este servicio todavía no tiene trabajos cargados en su galería.
          </div>
        )}
      </section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6"
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="h-6 w-1 rounded-full bg-primary" />
        <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
      </div>
      {children}
    </motion.section>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarClock;
  label: string;
  value?: string | null;
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border bg-card p-5 text-center shadow-sm',
        !value && 'hidden sm:block sm:opacity-50'
      )}
    >
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-lg font-bold text-foreground">{value ?? 'No informado'}</p>
    </div>
  );
}
