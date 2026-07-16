import { apiFetch } from './api-client'

export type SocialLink = {
  id?: string
  platform: string
  url: string
  orden?: number
}

export type Profile = {
  id: string
  userId: string
  bannerUrl: string | null
  logoUrl: string | null
  name: string
  industry: string
  description: string
  tags: string[]
  location: string
  founded: string
  employees: string
  website: string
  whatsapp: string
  socialLinks: SocialLink[]
  createdAt: string
  updatedAt: string
}

export type UpdateProfileData = Partial<
  Omit<Profile, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'location'>
> & { locationId?: string }

export const profileApi = {
  getByUserId: (userId: string) =>
    apiFetch<{ success: boolean; data: Profile }>(`/profiles/${userId}`),

  getById: (profileId: string) =>
    apiFetch<{ success: boolean; data: Profile }>(`/profiles/id/${profileId}`),

  updateMine: (data: UpdateProfileData) =>
    apiFetch<{ success: boolean; data: Profile }>('/profiles/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
}
