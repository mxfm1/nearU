'use client'

import { Profile } from '@/lib/profile-api'
import { type Region } from '@/lib/catalogo-api'
import { ProfileBanner } from './profile-banner'
import { ProfileLogo } from './profile-logo'
import { GeneralInfo } from './general-info'
import { ProfileDetails } from './profile-details'
import { DigitalPresence } from './digital-presence'

interface ProfileContentProps {
  profile: Profile
  regiones: Region[]
  onChange: (field: string, value: unknown) => void
  locationError?: string | null
}

export function ProfileContent({
  profile,
  regiones,
  onChange,
  locationError,
}: ProfileContentProps) {
  return (
    <>
      {/* Banner */}
      <ProfileBanner
        bannerUrl={profile.bannerUrl ?? null}
        onChange={(url) => onChange('bannerUrl', url)}
      />

      {/* Logo + Company Name */}
      <ProfileLogo
        logoUrl={profile.logoUrl ?? null}
        companyName={profile.name ?? ''}
        onChange={(url) => onChange('logoUrl', url)}
      />

      {/* General Info + Details grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <GeneralInfo
            name={profile.name ?? ''}
            description={profile.description ?? ''}
            tags={profile.tags ?? []}
            onChange={onChange}
          />
        </div>

        <div>
          <ProfileDetails
            regionId={profile.location ?? ''}
            founded={profile.founded ?? ''}
            employees={profile.employees ?? ''}
            regiones={regiones}
            onChange={onChange}
            locationError={locationError}
          />
        </div>
      </div>

      {/* Digital Presence */}
      <DigitalPresence
        website={profile.website ?? ''}
        whatsapp={profile.whatsapp ?? ''}
        socialLinks={profile.socialLinks ?? []}
        onChange={onChange}
      />
    </>
  )
}
