export interface User {
  id: string
  email: string
  emailVerified: boolean
  name: string
  image?: string | null
  createdAt: string
  updatedAt: string
}

export interface Session {
  id: string
  userId: string
  expiresAt: Date
  token: string
  createdAt: string
  updatedAt: string
  ipAddress?: string
  userAgent?: string
}

export type ProfileType = 'provider' | 'organizer' | 'both'

export interface Profile {
  id: string
  userId: string
  companyName: string
  description: string | null
  contactEmail: string | null
  phone: string | null
  website: string | null
  socialLinks: Record<string, string> | null
  region: string | null
  profileTypes: ProfileType[]
  logo: Media | null
  banner: Media | null
  createdAt: string
  updatedAt: string
}

export interface ServiceCategory {
  id: string
  name: string
  slug: string
}

export interface Service {
  id: string
  profileId: string
  categoryId: string
  title: string
  description: string | null
  referentialPrice: number | null
  coverageRegion: string | null
  category: ServiceCategory
  portfolio: ServicePortfolio[]
  media: ServiceMedia[]
  createdAt: string
  updatedAt: string
}

export interface ServicePortfolio {
  id: string
  serviceId: string
  title: string
  description: string | null
  date: string | null
  client: string | null
  media: ServicePortfolioMedia[]
  createdAt: string
  updatedAt: string
}

export interface EventCategory {
  id: string
  name: string
  slug: string
}

export interface Event {
  id: string
  profileId: string
  categoryId: string
  title: string
  description: string | null
  estimatedDate: string | null
  region: string | null
  referentialBudget: number | null
  category: EventCategory
  portfolio: EventPortfolio[]
  media: EventMedia[]
  requiredServiceCategoryIds: string[]
  createdAt: string
  updatedAt: string
}

export interface EventPortfolio {
  id: string
  eventId: string
  title: string | null
  description: string | null
  media: EventPortfolioMedia[]
  createdAt: string
  updatedAt: string
}

export type ContactRequestStatus = 'pending' | 'accepted' | 'rejected'

export interface ContactRequest {
  id: string
  senderProfileId: string
  recipientProfileId: string
  serviceId: string | null
  eventId: string | null
  message: string
  status: ContactRequestStatus
  createdAt: string
  updatedAt: string
}

export interface Media {
  id: string
  name: string
  path: string
  mimeType: string
  size: number
  url: string
  uploadedAt: string
}

export interface ProfileMedia {
  id: string
  profileId: string
  mediaId: string
  type: 'logo' | 'banner' | 'institutional'
  media: Media
}

export interface ServiceMedia {
  id: string
  serviceId: string
  mediaId: string
  type: 'main_image' | 'promotional_video' | 'informative_pdf'
  media: Media
}

export interface ServicePortfolioMedia {
  id: string
  portfolioId: string
  mediaId: string
  media: Media
}

export interface EventMedia {
  id: string
  eventId: string
  mediaId: string
  type: 'cover_image' | 'banner' | 'informative_document'
  media: Media
}

export interface EventPortfolioMedia {
  id: string
  eventId: string
  mediaId: string
  media: Media
}
