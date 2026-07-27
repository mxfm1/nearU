import { apiFetch } from './api-client';
import type { paths } from '@/types/contracts/api-contracts-types';

// --- Types from OpenAPI Contract ---

type ApplicationContractResponse = NonNullable<
  paths['/api/applications/{id}']['get']['responses']['200']['content']['application/json']['data']
>;

type ApplicationListContractResponse = NonNullable<
  paths['/api/mis-aplicaciones']['get']['responses']['200']['content']['application/json']['data']
>;

type EventApplicationListContractResponse = NonNullable<
  paths['/api/events/{eventId}/applications']['get']['responses']['200']['content']['application/json']['data']
>;

type CreateApplicationResponse = NonNullable<
  paths['/api/applications']['post']['responses']['201']['content']['application/json']['data']
>;

type UpdateStatusResponse = NonNullable<
  paths['/api/applications/{id}/status']['patch']['responses']['200']['content']['application/json']['data']
>;

// --- Extend with additional fields from backend ---

interface ApplicantProfile {
  name: string | null;
  logoUrl?: string | null;
  categories?: string[];
  region?: string | null;
  isVerified?: boolean;
  rating?: number | null;
}

type Application = ApplicationContractResponse & {
  applicantProfile?: ApplicantProfile;
};

type ApplicationListItem = ApplicationListContractResponse[number] & {
  applicantProfile?: ApplicantProfile;
};

type EventApplication = EventApplicationListContractResponse[number] & {
  applicantProfile?: ApplicantProfile;
};

// --- Re-export ---

export type ApplicationStatus = 'pending' | 'reviewing' | 'accepted' | 'rejected';

export type { Application, ApplicationListItem, EventApplication };

export type CreateApplicationPayload = NonNullable<
  paths['/api/applications']['post']['requestBody']
>['content']['application/json'];

// --- API Functions ---

export const applicationsApi = {
  async create(payload: CreateApplicationPayload) {
    return apiFetch<{ success: boolean; data: CreateApplicationResponse }>('/applications', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getMyApplications() {
    return apiFetch<{ success: boolean; data: ApplicationListItem[] }>('/mis-aplicaciones');
  },

  async getById(id: string) {
    return apiFetch<{ success: boolean; data: Application }>(`/applications/${id}`);
  },

  async getMyApplicationByEventId(eventId: string) {
    return apiFetch<{ success: boolean; data: Application | null }>(
      `/events/${eventId}/my-application`
    );
  },

  async getEventApplications(
    eventId: string,
    options?: {
      status?: ApplicationStatus | 'all';
      page?: number;
      limit?: number;
    }
  ) {
    const params = new URLSearchParams();
    if (options?.status && options.status !== 'all') {
      params.set('status', options.status);
    }
    if (options?.page) {
      params.set('page', String(options.page));
    }
    if (options?.limit) {
      params.set('limit', String(options.limit));
    }
    const queryString = params.toString();
    return apiFetch<{
      success: boolean;
      data: EventApplication[];
    }>(`/events/${eventId}/applications${queryString ? `?${queryString}` : ''}`);
  },

  async updateApplicationStatus(applicationId: string, status: ApplicationStatus) {
    return apiFetch<{ success: boolean; data: UpdateStatusResponse }>(
      `/applications/${applicationId}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }
    );
  },
};
