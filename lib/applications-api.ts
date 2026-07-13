import { apiFetch } from './api-client'

// --- Types ---

export type ApplicationStatus = 'pending' | 'reviewing' | 'accepted' | 'rejected'

export type Application = {
  id: string
  eventId: string
  applicantProfileId: string
  coverLetter: string | null
  portfolioUrls: string[]
  scoringFieldValues: Record<string, unknown>
  status: ApplicationStatus
  score: {
    totalScore: number
    maxPossible: number
    computedAt: string
    breakdown: Array<{
      ruleType: string
      pointsEarned: number
      pointsPossible: number
      reason: string
    }>
  } | null
  createdAt: string
  updatedAt: string
}

export type ApplicationListItem = {
  id: string
  eventId: string
  status: ApplicationStatus
  event: {
    title: string
    startAt: string | null
  }
  applicantProfile: {
    name: string | null
  }
  createdAt: string
}

export type EventApplication = {
  id: string
  eventId: string
  status: ApplicationStatus
  score: {
    totalScore: number
    maxPossible: number
  } | null
  coverLetter: string | null
  portfolioUrls: string[]
  scoringFieldValues: Record<string, unknown>
  createdAt: string
  updatedAt: string
  applicantProfile: {
    id: string
    name: string | null
    imageUrl: string | null
    categories: string[]
    region: string | null
    isVerified: boolean
    rating: number | null
  }
}

// --- Payloads ---

export type CreateApplicationPayload = {
  eventId: string
  coverLetter?: string | null
  portfolioUrls?: string[]
  scoringFieldValues: Record<string, unknown>
}

// --- API Functions ---

export const applicationsApi = {
  async create(payload: CreateApplicationPayload) {
    return apiFetch<{ success: boolean; data: Application }>(
      '/applications',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    )
  },

  async getMyApplications() {
    return apiFetch<{ success: boolean; data: ApplicationListItem[] }>(
      '/mis-aplicaciones'
    )
  },

  async getById(id: string) {
    return apiFetch<{ success: boolean; data: Application }>(
      // `/applications/${id}`
      `/applications/${id}`
    )
  },

  async getMyApplicationByEventId(eventId: string) {
    return apiFetch<{ success: boolean; data: Application | null }>(
      `/events/${eventId}/my-application`
    )
  },

  async getEventApplications(
    eventId: string,
    options?: {
      status?: ApplicationStatus | 'all'
      page?: number
      limit?: number
    }
  ) {
    const params = new URLSearchParams()
    if (options?.status && options.status !== 'all') {
      params.set('status', options.status)
    }
    if (options?.page) {
      params.set('page', String(options.page))
    }
    if (options?.limit) {
      params.set('limit', String(options.limit))
    }
    const queryString = params.toString()
    return apiFetch<{
      success: boolean
      data: EventApplication[]
    }>(`/events/${eventId}/applications${queryString ? `?${queryString}` : ''}`)
  },

  async updateApplicationStatus(
    applicationId: string,
    status: ApplicationStatus
  ) {
    return apiFetch<{ success: boolean; data: Application }>(
      `/applications/${applicationId}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }
    )
  },
}

// /api/applications/:id
// /api/events/{eventId}/my-application