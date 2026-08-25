'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { EventoListItem } from '@/types/contracts/event';
import type { ProfileListItem } from '@/lib/profile-api';
import type { ServicioListItem } from '@/types/contracts/services';
import type { SearchScope, SearchState } from '@/types/search';
import { EventCard } from '@/components/cards/event-card';
import { ProfileCard } from '@/components/cards/profile-card';
import { ProviderCard } from '@/components/cards/provider-card';
import { ExplorePagination } from './explore-pagination';
import { ExploreSectionEmpty } from './explore-section-empty';
import { ExploreSectionError } from './explore-section-error';
import { ExploreSectionSkeleton } from './explore-section-skeleton';
import { changeSearchScope, pageItems, serializeSearchState } from '@/lib/search-state';

const PAGE_SIZE = 12;
const PREVIEW_SIZE = 6;

function formatEventDate(value: string | null | undefined): string {
  if (!value) return 'Fecha por confirmar';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Fecha por confirmar';
  return date.toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' });
}

function scopedHref(basePath: string, state: SearchState, scope: SearchScope): string {
  const params = serializeSearchState(changeSearchScope(state, scope));
  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

function SectionHeader({ title, total, href }: { title: string; total?: number; href?: string }) {
  return (
    <div className="flex items-end justify-between gap-3 border-b border-border pb-2">
      <div>
        <h2 className="text-xl font-bold text-foreground sm:text-2xl">{title}</h2>
        {total !== undefined && (
          <p className="mt-1 text-xs text-muted-foreground">{total} resultados</p>
        )}
      </div>
      {href && (
        <Link href={href} className="text-sm font-semibold text-primary hover:underline">
          Ver todos
        </Link>
      )}
    </div>
  );
}

function ServicesGrid({ items }: { items: ServicioListItem[] }) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.06 } } }}
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
    >
      {items.map((item) => (
        <motion.div
          key={item.id}
          variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
        >
          <ProviderCard
            name={item.title ?? item.marca ?? 'Servicio sin nombre'}
            category={item.category?.name ?? 'Sin categoría'}
            verified={false}
            location={item.location?.name ?? 'Ubicación no disponible'}
            thumbnail={item.thumbnailUrl ?? 'https://placehold.co/600x340?text=Sin+imagen'}
            slug={item.slug ?? item.id ?? ''}
            className="h-full w-full border border-border"
          />
        </motion.div>
      ))}
    </motion.div>
  );
}

function EventsGrid({ items }: { items: EventoListItem[] }) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.06 } } }}
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
    >
      {items.map((item) => (
        <motion.div
          key={item.id}
          variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
        >
          <EventCard
            title={item.title ?? 'Evento sin nombre'}
            description={item.description ?? ''}
            date={formatEventDate(item.startAt)}
            location={item.location?.name ?? 'Ubicación no disponible'}
            thumbnail={item.thumbnailUrl ?? 'https://placehold.co/600x340?text=Sin+imagen'}
            slug={item.slug ?? item.id ?? ''}
            className="h-full w-full border border-border"
          />
        </motion.div>
      ))}
    </motion.div>
  );
}

function ProfilesGrid({ items }: { items: ProfileListItem[] }) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.06 } } }}
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
    >
      {items.map((item) => (
        <motion.div
          key={item.id ?? item.userId}
          variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
        >
          <ProfileCard
            name={item.name ?? 'Empresa sin nombre'}
            description={item.description}
            category={item.industry ?? 'Empresa'}
            verified={item.isVerified ?? false}
            location={item.location}
            employees={item.employees}
            thumbnail={item.logoUrl ?? item.bannerUrl}
            className="border border-border"
          />
        </motion.div>
      ))}
    </motion.div>
  );
}

export function ExploreResults({
  basePath,
  state,
  profiles,
  services,
  events,
  profilesPending,
  servicesPending,
  eventsPending,
  profilesError,
  servicesError,
  eventsError,
  onRetryProfiles,
  onRetryServices,
  onRetryEvents,
  onPageChange,
}: {
  basePath: string;
  state: SearchState & { page: number };
  profiles: ProfileListItem[];
  services: ServicioListItem[];
  events: EventoListItem[];
  profilesPending: boolean;
  servicesPending: boolean;
  eventsPending: boolean;
  profilesError: boolean;
  servicesError: boolean;
  eventsError: boolean;
  onRetryProfiles: () => void;
  onRetryServices: () => void;
  onRetryEvents: () => void;
  onPageChange: (page: number) => void;
}) {
  const isPreview = state.scope === 'all';
  const activeTotal =
    state.scope === 'organizations'
      ? profiles.length
      : state.scope === 'services'
        ? services.length
        : state.scope === 'events'
          ? events.length
          : 0;
  const totalPages = Math.max(1, Math.ceil(activeTotal / PAGE_SIZE));
  const currentPage = Math.min(state.page, totalPages);
  const profilesPage = isPreview
    ? profiles.slice(0, PREVIEW_SIZE)
    : pageItems(profiles, currentPage, PAGE_SIZE);
  const servicesPage = isPreview
    ? services.slice(0, PREVIEW_SIZE)
    : pageItems(services, currentPage, PAGE_SIZE);
  const eventsPage = isPreview
    ? events.slice(0, PREVIEW_SIZE)
    : pageItems(events, currentPage, PAGE_SIZE);

  return (
    <div className="space-y-10">
      {(state.scope === 'all' || state.scope === 'organizations') && (
        <section className="space-y-4">
          <SectionHeader
            title="Empresas"
            total={profiles.length}
            href={isPreview ? scopedHref(basePath, state, 'organizations') : undefined}
          />
          {profilesPending ? (
            <ExploreSectionSkeleton />
          ) : profilesError ? (
            <ExploreSectionError onRetry={onRetryProfiles} />
          ) : profilesPage.length === 0 ? (
            <ExploreSectionEmpty message="No encontramos empresas con estos filtros." />
          ) : (
            <ProfilesGrid items={profilesPage} />
          )}
        </section>
      )}

      {(state.scope === 'all' || state.scope === 'services') && (
        <section className="space-y-4">
          <SectionHeader
            title="Servicios"
            total={services.length}
            href={isPreview ? scopedHref(basePath, state, 'services') : undefined}
          />
          {servicesPending ? (
            <ExploreSectionSkeleton />
          ) : servicesError ? (
            <ExploreSectionError onRetry={onRetryServices} />
          ) : servicesPage.length === 0 ? (
            <ExploreSectionEmpty message="No encontramos servicios con estos filtros." />
          ) : (
            <ServicesGrid items={servicesPage} />
          )}
        </section>
      )}

      {(state.scope === 'all' || state.scope === 'events') && (
        <section className="space-y-4">
          <SectionHeader
            title="Eventos"
            total={events.length}
            href={isPreview ? scopedHref(basePath, state, 'events') : undefined}
          />
          {eventsPending ? (
            <ExploreSectionSkeleton />
          ) : eventsError ? (
            <ExploreSectionError onRetry={onRetryEvents} />
          ) : eventsPage.length === 0 ? (
            <ExploreSectionEmpty message="No encontramos eventos con estos filtros." />
          ) : (
            <EventsGrid items={eventsPage} />
          )}
        </section>
      )}

      {!isPreview && (
        <ExplorePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
