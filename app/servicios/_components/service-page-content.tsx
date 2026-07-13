'use client'

import { useService } from '@/hooks/use-service'
import { BannerSection } from './banner-section'
import { ProfileLogo } from './profile-logo'
import { ServiceDetail } from './service-detail'
import { ContactSection } from './contact-section'
import { PortfolioSection } from './portfolio-section'
import { ErrorState } from './error-state'
import { LoadingSkeleton } from './loading-skeleton'

interface ServicePageContentProps {
  id: string
}

export function ServicePageContent({ id }: ServicePageContentProps) {
  const { service, isLoading, error } = useService(id)

  if (isLoading) return <LoadingSkeleton />

  if (error || !service) {
    return <ErrorState error={error ?? 'NOT_FOUND'} />
  }


  return (
    <div className="w-full">
      <div className="relative">
        <BannerSection src={service.bannerUrl ?? undefined} alt={service.marca} />
      </div>

      <div className="relative z-10 -mt-16 sm:-mt-20 px-4 sm:px-6 sm:pr-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">

            <ServiceDetail
              title={service.title}
              description={service.description}
              categoryName={service.category?.name ?? 'Sin categoría'}
              companyName={service.marca}
              location={service.location?.name ?? 'Ubicación no disponible'}
            />
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <ContactSection
                contactInformation={service.contacts ?? []}
                profileId={service.profileId}
                slug={service.slug}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 mt-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-12">
            <PortfolioSection portfolio={service.portfolio} />
          </div>
        </div>
      </div>
    </div>
  )
}
