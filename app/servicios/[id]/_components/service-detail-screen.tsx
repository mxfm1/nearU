'use client';

import type { ServicioDetalle } from '@/types/contracts/services';
import type { Profile } from '@/lib/profile-api';
import { ServiceDetailHero } from './service-detail-hero';
import { ServiceDetailMain } from './service-detail-main';
import { ServiceDetailSidebar } from './service-detail-sidebar';

interface ServiceDetailScreenProps {
  service: ServicioDetalle;
  currentUserId?: string;
  authPending: boolean;
  myProfile?: Profile;
  profilePending: boolean;
  profileError: boolean;
  onRetryProfile: () => void;
}

export function ServiceDetailScreen({
  service,
  currentUserId,
  authPending,
  myProfile,
  profilePending,
  profileError,
  onRetryProfile,
}: ServiceDetailScreenProps) {
  return (
    <main className="bg-background">
      <ServiceDetailHero service={service} />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)] xl:grid-cols-[minmax(0,2fr)_minmax(340px,1fr)]">
          <ServiceDetailMain service={service} />
          <ServiceDetailSidebar
            service={service}
            currentUserId={currentUserId}
            authPending={authPending}
            myProfile={myProfile}
            profilePending={profilePending}
            profileError={profileError}
            onRetryProfile={onRetryProfile}
          />
        </div>
      </div>
    </main>
  );
}
