'use client'

import type { Region } from '@/lib/catalogo-api'
import { ProfileBanner } from './profile-banner'
import { ProfileLogo } from './profile-logo'
import { GeneralInfo } from './general-info'
import { ProfileDetails } from './profile-details'
import { DigitalPresence } from './digital-presence'

interface Draft {
  bannerUrl: string | null
  logoUrl: string | null
  name: string | null
  description: string | null
  tags: string[]
  regionId: string
  founded: string
  employees: string
  website: string | null
  whatsapp: string | null
  socialLinks: { id?: string; platform?: string; url?: string; orden?: number }[]
}

interface ProfileContentProps {
  data: Draft
  regiones: Region[]
  onChange: (field: string, value: unknown) => void
  locationError?: string | null
}

export function ProfileContent({ data, regiones, onChange, locationError }: ProfileContentProps) {
  return (
    <>
      <ProfileBanner
        bannerUrl={data.bannerUrl}
        onChange={(url) => onChange('bannerUrl', url)}
      />

      <ProfileLogo
        logoUrl={data.logoUrl}
        companyName={data.name ?? ''}
        onChange={(url) => onChange('logoUrl', url)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <GeneralInfo
            name={data.name ?? ''}
            description={data.description ?? ''}
            tags={data.tags}
            onChange={onChange}
          />
        </div>

        <div>
          <ProfileDetails
            regionId={data.regionId}
            founded={data.founded}
            employees={data.employees}
            regiones={regiones}
            onChange={onChange}
            locationError={locationError}
          />
        </div>
      </div>

      <DigitalPresence
        website={data.website ?? ''}
        whatsapp={data.whatsapp ?? ''}
        socialLinks={data.socialLinks}
        onChange={onChange}
      />
    </>
  )
}
